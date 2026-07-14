// Autor: JeanCarloEM.com
// Licenca: Mozilla Public License 2.0
// Disclaimer: fornecido "AS IS", sem garantias de qualquer tipo.

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const { normalizeReleaseVersion } = require("./release-workflow");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const PACKAGE_PATH = path.join(ROOT_DIR, "package.json");

class UsageError extends Error {}

function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(help());
    return 0;
  }
  const version = normalizeReleaseVersion(options.version);
  const preflight = inspectPreflight(version, options);

  if (options.dryRun) {
    printJson({ code: "RELEASE_PUBLISH_DRY_RUN", ...preflight, configuration: publicOptions(options), version, watch: !options.noWatch });
    return 0;
  }

  assertPreflight(preflight);
  prepareVersionCommit(version, options);
  prepareArtifactCommit(version, options);
  const trigger = createAndPushTrigger(version, options);
  const remote = options.noWatch || !preflight.gh ? null : waitForRemoteRelease(version, trigger.commit, options);

  printJson({
    code: remote ? "RELEASE_PUBLISH_OK" : "RELEASE_TRIGGER_ENVIADO",
    configuration: publicOptions(options),
    githubCli: preflight.gh,
    triggerCommit: trigger.commit,
    version,
    ...(remote ? remote : {}),
  });
  return 0;
}

function parseArgs(argv) {
  const options = {
    branch: process.env.AGENTS_RELEASE_BRANCH || "dev",
    dryRun: false,
    help: false,
    noWatch: false,
    primary: process.env.AGENTS_RELEASE_PRIMARY || "",
    remote: process.env.AGENTS_RELEASE_REMOTE || "origin",
    version: "",
    workflow: process.env.AGENTS_RELEASE_WORKFLOW || "release.yml",
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--dry-run") {
      options.dryRun = true;
    } else if (value === "--help") {
      options.help = true;
    } else if (value === "--no-watch") {
      options.noWatch = true;
    } else if (["--branch", "--primary", "--remote", "--workflow"].includes(value)) {
      const key = value.slice(2);
      options[key] = argv[++index] || "";
      if (!options[key]) throw new UsageError(`PARAMETRO_NORMATIVO_AUSENTE:${key}`);
    } else if (value.startsWith("-")) {
      throw new UsageError(`PARAMETRO_INVALIDO:${value}`);
    } else if (!options.version) {
      options.version = value;
    } else {
      throw new UsageError(`PARAMETRO_INVALIDO:${value}`);
    }
  }
  if (!options.help && !options.version) {
    throw new UsageError("PARAMETRO_NORMATIVO_AUSENTE:version");
  }
  for (const key of ["branch", "primary", "remote"]) {
    if (options[key] && !/^[A-Za-z0-9._/-]+$/u.test(options[key])) throw new UsageError(`PARAMETRO_INVALIDO:${key}`);
  }
  if (!/^[A-Za-z0-9._-]+\.ya?ml$/u.test(options.workflow)) throw new UsageError("PARAMETRO_INVALIDO:workflow");
  return options;
}

function help() {
  return "Uso: release:publish <versao> [--dry-run] [--no-watch] [--branch <nome>] [--primary <nome>] [--remote <nome>] [--workflow <arquivo.yml>]\n";
}

function publicOptions(options) {
  return { branch: options.branch, primary: options.primary, remote: options.remote, workflow: options.workflow };
}

function inspectPreflight(version, options = { branch: "dev", workflow: "release.yml" }) {
  const branch = run("git", ["branch", "--show-current"]).stdout.trim();
  const dirty = run("git", ["status", "--porcelain"], { optional: true }).stdout.trim().split(/\r?\n/u).filter(Boolean);
  const tag = `v${version}`;
  const localTag = run("git", ["rev-parse", "--verify", `refs/tags/${tag}`], { optional: true }).status === 0;
  const workflow = path.join(ROOT_DIR, ".github", "workflows", options.workflow);
  const gh = run("gh", ["--version"], { optional: true }).status === 0;
  return { branch, dirty, expectedBranch: options.branch, gh, localTag, tag, workflow: fs.existsSync(workflow) };
}

function assertPreflight(preflight) {
  if (preflight.branch !== preflight.expectedBranch) {
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

function prepareVersionCommit(version, options) {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
  pkg.version = version;
  fs.writeFileSync(PACKAGE_PATH, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  run("git", ["add", "--", "package.json"]);
  assertStagedPaths(["package.json"]);
  run("git", ["commit", "-m", `chore: prepara release v${version}`]);
  run("git", ["push", options.remote, options.branch], { timeout: 120000 });
}

function prepareArtifactCommit(version, options) {
  run(process.execPath, [path.join(ROOT_DIR, ".agents", "core", "runtime", "scripts", "repo-tools.js"), "agent:release", version], { timeout: 900000 });
  run(process.execPath, [path.join(ROOT_DIR, ".agents", "core", "runtime", "scripts", "repo-tools.js"), "agent:verify"], { timeout: 900000 });
  run("git", ["add", "--", "dist", "index.json"]);
  assertStagedPaths(["dist/", "index.json"], { prefixes: true });
  run("git", ["commit", "-m", `chore: gera artefato v${version}`]);
  run("git", ["push", options.remote, options.branch], { timeout: 120000 });
}

function createAndPushTrigger(version, options) {
  run(process.execPath, [path.join(ROOT_DIR, ".agents", "core", "runtime", "scripts", "repo-tools.js"), "agent:release:trigger", version]);
  run("git", ["add", "--", "release"]);
  assertStagedPaths(["release"], { statuses: ["A"] });
  run("git", ["commit", "-m", `chore: aciona release v${version}`]);
  const commit = run("git", ["rev-parse", "HEAD"]).stdout.trim();
  run("git", ["push", options.remote, options.branch], { timeout: 120000 });
  return { commit };
}

function waitForRemoteRelease(version, triggerCommit, options) {
  const runId = findWorkflowRun(triggerCommit, options);
  run("gh", ["run", "watch", runId, "--exit-status"], { timeout: 900000 });
  const primary = resolvePrimaryBranch(options);
  run("git", ["fetch", options.remote, options.branch, primary], { timeout: 120000 });
  run("git", ["pull", "--ff-only", options.remote, options.branch], { timeout: 120000 });
  const dev = run("git", ["rev-parse", `${options.remote}/${options.branch}`]).stdout.trim();
  const primaryCommit = run("git", ["rev-parse", `${options.remote}/${primary}`]).stdout.trim();
  if (dev !== primaryCommit) {
    throw new Error(`CONVERGENCIA_REMOTA_PENDENTE:dev=${dev};${primary}=${primaryCommit}`);
  }
  const release = JSON.parse(run("gh", ["release", "view", `v${version}`, "--json", "url,tagName,isDraft,isPrerelease"], { timeout: 120000 }).stdout);
  if (release.tagName !== `v${version}` || release.isDraft || release.isPrerelease) {
    throw new Error(`RELEASE_REMOTO_INVALIDO:v${version}`);
  }
  return { primary, releaseUrl: release.url, workflowRun: Number(runId) };
}

function findWorkflowRun(triggerCommit, options) {
  for (const delay of [0, 1000, 3000]) {
    if (delay) {
      sleep(delay);
    }
    const result = run("gh", ["run", "list", "--workflow", options.workflow, "--branch", options.branch, "--event", "push", "--limit", "20", "--json", "databaseId,headSha"], { optional: true, timeout: 120000 });
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

function resolvePrimaryBranch(options) {
  const candidates = options.primary ? [options.primary] : ["main", "master"];
  for (const branch of candidates) {
    if (run("git", ["ls-remote", "--exit-code", "--heads", options.remote, branch], { optional: true, timeout: 120000 }).status === 0) {
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
    process.exitCode = error instanceof UsageError ? 2 : 1;
  }
}

module.exports = { help, inspectPreflight, main, parseArgs };
