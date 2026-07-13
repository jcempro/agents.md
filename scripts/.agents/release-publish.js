// Autor: JeanCarloEM.com
// Licenca: Mozilla Public License 2.0
// Disclaimer: fornecido "AS IS", sem garantias de qualquer tipo.

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const { normalizeReleaseVersion } = require("./release-workflow");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const PACKAGE_PATH = path.join(ROOT_DIR, "package.json");

function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  const version = normalizeReleaseVersion(options.version);
  const preflight = inspectPreflight(version);

  if (options.dryRun) {
    printJson({ code: "RELEASE_PUBLISH_DRY_RUN", ...preflight, version, watch: !options.noWatch });
    return 0;
  }

  assertPreflight(preflight);
  prepareVersionCommit(version);
  prepareArtifactCommit(version);
  const trigger = createAndPushTrigger(version);
  const remote = options.noWatch || !preflight.gh ? null : waitForRemoteRelease(version, trigger.commit);

  printJson({
    code: remote ? "RELEASE_PUBLISH_OK" : "RELEASE_TRIGGER_ENVIADO",
    githubCli: preflight.gh,
    triggerCommit: trigger.commit,
    version,
    ...(remote ? remote : {}),
  });
  return 0;
}

function parseArgs(argv) {
  const options = { dryRun: false, noWatch: false, version: "" };
  for (const value of argv) {
    if (value === "--dry-run") {
      options.dryRun = true;
    } else if (value === "--no-watch") {
      options.noWatch = true;
    } else if (!options.version) {
      options.version = value;
    } else {
      throw new Error(`PARAMETRO_INVALIDO:${value}`);
    }
  }
  if (!options.version) {
    throw new Error("PARAMETRO_NORMATIVO_AUSENTE:version");
  }
  return options;
}

function inspectPreflight(version) {
  const branch = run("git", ["branch", "--show-current"]).stdout.trim();
  const dirty = run("git", ["status", "--porcelain"], { optional: true }).stdout.trim().split(/\r?\n/u).filter(Boolean);
  const tag = `v${version}`;
  const localTag = run("git", ["rev-parse", "--verify", `refs/tags/${tag}`], { optional: true }).status === 0;
  const workflow = path.join(ROOT_DIR, ".github", "workflows", "release.yml");
  const gh = run("gh", ["--version"], { optional: true }).status === 0;
  return { branch, dirty, gh, localTag, tag, workflow: fs.existsSync(workflow) };
}

function assertPreflight(preflight) {
  if (preflight.branch !== "dev") {
    throw new Error(`BRANCH_RELEASE_INVALIDA:${preflight.branch || "(vazia)"}`);
  }
  if (preflight.dirty.length) {
    throw new Error(`WORKTREE_NAO_LIMPO:${preflight.dirty.join(",")}`);
  }
  if (preflight.localTag) {
    throw new Error(`VERSAO_JA_PUBLICADA:${preflight.tag}`);
  }
  if (!preflight.workflow) {
    throw new Error("WORKFLOW_RELEASE_AUSENTE:.github/workflows/release.yml");
  }
}

function prepareVersionCommit(version) {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
  pkg.version = version;
  fs.writeFileSync(PACKAGE_PATH, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  run("git", ["add", "--", "package.json"]);
  assertStagedPaths(["package.json"]);
  run("git", ["commit", "-m", `chore: prepara release v${version}`]);
  run("git", ["push", "origin", "dev"], { timeout: 120000 });
}

function prepareArtifactCommit(version) {
  run(process.execPath, [path.join(ROOT_DIR, "scripts", ".agents", "repo-tools.js"), "agent:release", version], { timeout: 900000 });
  run(process.execPath, [path.join(ROOT_DIR, "scripts", ".agents", "repo-tools.js"), "agent:verify"], { timeout: 900000 });
  run("git", ["add", "--", "dist", "index.json"]);
  assertStagedPaths(["dist/", "index.json"], { prefixes: true });
  run("git", ["commit", "-m", `chore: gera artefato v${version}`]);
  run("git", ["push", "origin", "dev"], { timeout: 120000 });
}

function createAndPushTrigger(version) {
  run(process.execPath, [path.join(ROOT_DIR, "scripts", ".agents", "repo-tools.js"), "agent:release:trigger", version]);
  run("git", ["add", "--", "release"]);
  assertStagedPaths(["release"], { statuses: ["A"] });
  run("git", ["commit", "-m", `chore: aciona release v${version}`]);
  const commit = run("git", ["rev-parse", "HEAD"]).stdout.trim();
  run("git", ["push", "origin", "dev"], { timeout: 120000 });
  return { commit };
}

function waitForRemoteRelease(version, triggerCommit) {
  const runId = findWorkflowRun(triggerCommit);
  run("gh", ["run", "watch", runId, "--exit-status"], { timeout: 900000 });
  const primary = resolvePrimaryBranch();
  run("git", ["fetch", "origin", "dev", primary], { timeout: 120000 });
  run("git", ["pull", "--ff-only", "origin", "dev"], { timeout: 120000 });
  const dev = run("git", ["rev-parse", "origin/dev"]).stdout.trim();
  const primaryCommit = run("git", ["rev-parse", `origin/${primary}`]).stdout.trim();
  if (dev !== primaryCommit) {
    throw new Error(`CONVERGENCIA_REMOTA_PENDENTE:dev=${dev};${primary}=${primaryCommit}`);
  }
  const release = JSON.parse(run("gh", ["release", "view", `v${version}`, "--json", "url,tagName,isDraft,isPrerelease"], { timeout: 120000 }).stdout);
  if (release.tagName !== `v${version}` || release.isDraft || release.isPrerelease) {
    throw new Error(`RELEASE_REMOTO_INVALIDO:v${version}`);
  }
  return { primary, releaseUrl: release.url, workflowRun: Number(runId) };
}

function findWorkflowRun(triggerCommit) {
  for (const delay of [0, 1000, 3000]) {
    if (delay) {
      sleep(delay);
    }
    const result = run("gh", ["run", "list", "--workflow", "release.yml", "--branch", "dev", "--event", "push", "--limit", "20", "--json", "databaseId,headSha"], { optional: true, timeout: 120000 });
    if (result.status !== 0) {
      continue;
    }
    const match = JSON.parse(result.stdout).find((entry) => entry.headSha === triggerCommit);
    if (match) {
      return String(match.databaseId);
    }
  }
  throw new Error(`WORKFLOW_RELEASE_NAO_ENCONTRADO:${triggerCommit}`);
}

function resolvePrimaryBranch() {
  for (const branch of ["main", "master"]) {
    if (run("git", ["ls-remote", "--exit-code", "--heads", "origin", branch], { optional: true, timeout: 120000 }).status === 0) {
      return branch;
    }
  }
  throw new Error("BRANCH_PRIMARIA_AUSENTE");
}

function assertStagedPaths(allowed, options = {}) {
  const entries = run("git", ["diff", "--cached", "--name-status"]).stdout.trim().split(/\r?\n/u).filter(Boolean)
    .map((line) => {
      const [status, filePath] = line.split(/\t/u);
      return { filePath, status };
    });
  if (!entries.length || entries.some((entry) => {
    const pathAllowed = options.prefixes ? allowed.some((prefix) => entry.filePath === prefix || entry.filePath.startsWith(prefix)) : allowed.includes(entry.filePath);
    const statusAllowed = !options.statuses || options.statuses.includes(entry.status);
    return !pathAllowed || !statusAllowed;
  })) {
    throw new Error(`STAGING_RELEASE_INVALIDO:${entries.map((entry) => `${entry.status}:${entry.filePath}`).join(",")}`);
  }
}

function run(command, args, options = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd: ROOT_DIR,
    encoding: "utf8",
    shell: false,
    timeout: options.timeout || 30000,
  });
  if (!options.optional && (result.error || result.status !== 0)) {
    throw new Error(`${command} ${args.join(" ")} falhou: ${result.error ? result.error.message : result.stderr || result.stdout}`);
  }
  return result;
}

function sleep(milliseconds) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { inspectPreflight, main, parseArgs };
