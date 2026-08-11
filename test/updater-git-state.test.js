const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { applyPlan, commitAndPushNormativeUpdate } = require("../.ia.rules/core/runtime/scripts/update-agents");

const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "agents-updater-git-"));
const remote = path.join(sandbox, "remote.git");
const local = path.join(sandbox, "local");
const peer = path.join(sandbox, "peer");
const audit = path.join(sandbox, "audit");

function git(cwd, args, optional = false) {
  const result = childProcess.spawnSync("git", args, { cwd, encoding: "utf8", windowsHide: true });
  if (!optional) assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr || result.stdout}`);
  return result;
}

function configure(cwd) {
  git(cwd, ["config", "user.email", "test@example.invalid"]);
  git(cwd, ["config", "user.name", "Updater Test"]);
}

try {
  fs.mkdirSync(local, { recursive: true });
  git(sandbox, ["init", "--bare", remote]);
  git(local, ["init", "-b", "dev"]);
  configure(local);
  fs.writeFileSync(path.join(local, "AGENTS.md"), "# AGENTS antigo\n");
  fs.writeFileSync(path.join(local, "product.txt"), "produto base\n");
  fs.writeFileSync(path.join(local, ".gitignore"), "/.ia.rules/cache/\n/.ia.rules/agents-update.lock.json\n");
  git(local, ["add", "."]);
  git(local, ["commit", "-m", "base"]);
  git(local, ["remote", "add", "origin", remote]);
  git(local, ["push", "-u", "origin", "dev"]);

  git(sandbox, ["clone", "-b", "dev", remote, peer]);
  configure(peer);
  fs.writeFileSync(path.join(peer, "remote-only.txt"), "mudanca remota\n");
  git(peer, ["add", "remote-only.txt"]);
  git(peer, ["commit", "-m", "mudanca remota"]);
  git(peer, ["push"]);

  fs.writeFileSync(path.join(local, "local-only.txt"), "commit local pendente\n");
  git(local, ["add", "local-only.txt"]);
  git(local, ["commit", "-m", "mudanca local"]);
  const pendingCommit = git(local, ["rev-parse", "HEAD"]).stdout.trim();
  fs.writeFileSync(path.join(local, "product.txt"), "produto modificado sem commit\n");

  const governance = Buffer.from("# AGENTS atualizado\n");
  const plan = {
    changes: [{
      action: "update",
      commitContent: governance,
      content: governance,
      indexContent: governance,
      kind: "file",
      relativePath: "AGENTS.md",
      remoteContent: governance,
    }],
    lock: { files: { "AGENTS.md": "test" }, managedFiles: [{ path: "AGENTS.md" }] },
    source: { label: "release:v-test", ref: "v-test", type: "release" },
  };
  applyPlan(local, plan);
  commitAndPushNormativeUpdate(local, plan);

  git(sandbox, ["clone", "-b", "dev", remote, audit]);
  assert.equal(text(path.join(audit, "AGENTS.md")), governance.toString("utf8"));
  assert.equal(text(path.join(audit, "remote-only.txt")), "mudanca remota\n");
  assert.equal(fs.existsSync(path.join(audit, "local-only.txt")), false);
  assert.equal(text(path.join(audit, "product.txt")), "produto base\n");

  assert.equal(text(path.join(local, "local-only.txt")), "commit local pendente\n");
  assert.equal(text(path.join(local, "remote-only.txt")), "mudanca remota\n");
  assert.equal(text(path.join(local, "product.txt")), "produto modificado sem commit\n");
  assert.equal(git(local, ["merge-base", "--is-ancestor", pendingCommit, "HEAD"], true).status, 0);
  assert.notEqual(git(local, ["merge-base", "--is-ancestor", pendingCommit, "origin/dev"], true).status, 0);
  assert.match(git(local, ["status", "--short"]).stdout, /^ M product\.txt$/mu);
} finally {
  fs.rmSync(sandbox, { force: true, recursive: true });
}

function text(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/\r\n/gu, "\n");
}
