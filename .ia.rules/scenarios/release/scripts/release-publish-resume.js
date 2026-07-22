// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const { inspectPreflight, main: standardMain, parseArgs, runReleaseTrigger } = require("./release-publish");
const { normalizeReleaseVersion } = require("./release-workflow");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const PACKAGE_PATH = path.join(ROOT_DIR, "package.json");

function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help || options.dryRun) return standardMain(argv);
  const version = normalizeReleaseVersion(options.version);
  if (!isResumable(version)) return standardMain(argv);
  const preflight = inspectPreflight(version, options);
  assertPreflight(preflight);
  prepareArtifactCommit(version, options);
  const trigger = createAndPushTrigger(version, options);
  const remote = options.noWatch || !preflight.gh ? null : waitForRemoteRelease(version, trigger.commit, options);
  printJson({ code: remote ? "RELEASE_PUBLISH_OK" : "RELEASE_TRIGGER_ENVIADO", configuration: publicOptions(options), githubCli: preflight.gh, resumed: true, triggerCommit: trigger.commit, version, ...(remote || {}) });
  return 0;
}

function isResumable(version) {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
  if (pkg.version !== version) return false;
  const prepared = run("git", ["log", "--format=%s", "--all", "--grep", `^chore: prepara release v${version}$`], { optional: true });
  return prepared.stdout.split(/\r?\n/u).some((subject) => subject.trim() === `chore: prepara release v${version}`);
}

function assertPreflight(preflight) {
  if (preflight.branch !== preflight.expectedBranch) throw new Error(`BRANCH_RELEASE_INVALIDA:${preflight.branch || "(vazia)"}`);
  if (preflight.dirty.length) throw new Error(`WORKTREE_NAO_LIMPO:${preflight.dirty.join(",")}`);
  if (preflight.localTag) throw new Error(`VERSAO_JA_PUBLICADA:${preflight.tag}`);
  if (!preflight.workflow) throw new Error("WORKFLOW_RELEASE_AUSENTE:.github/workflows/release.yml");
}

function prepareArtifactCommit(version, options) {
  const repoTools = path.join(ROOT_DIR, ".ia.rules", "core", "runtime", "scripts", "repo-tools.js");
  runTransient(process.execPath, [repoTools, "agent:release", version]);
  runTransient(process.execPath, [repoTools, "agent:verify"]);
  run("git", ["add", "--", "dist", "index.json"]);
  const stagedArtifact = run("git", ["diff", "--cached", "--name-status", "--", "dist", "index.json"]).stdout.trim();
  if (!stagedArtifact) {
    const commit = run("git", ["log", "-1", "--format=%H", "--", "dist", "index.json"]).stdout.trim();
    if (!commit) throw new Error(`COMMIT_ARTEFATO_RELEASE_AUSENTE:v${version}`);
    run("git", ["push", options.remote, options.branch], { timeout: 120000 });
    return;
  }
  assertStagedPaths(["dist/", "index.json"], { prefixes: true });
  run("git", ["commit", "-m", `chore: gera artefato v${version}`]);
  run("git", ["push", options.remote, options.branch], { timeout: 120000 });
}

function createAndPushTrigger(version, options) {
  runReleaseTrigger(version);
  run("git", ["add", "--", "release"]);
  const stagedRelease = run("git", ["diff", "--cached", "--name-status", "--", "release"]).stdout.trim();
  if (!stagedRelease) {
    const commit = run("git", ["log", "-1", "--format=%H", "--", "release"]).stdout.trim();
    if (!commit) throw new Error(`COMMIT_GATILHO_RELEASE_AUSENTE:v${version}`);
    run("git", ["push", options.remote, options.branch], { timeout: 120000 });
    return { commit, reused: true };
  }
  assertStagedPaths(["release"], { statuses: ["A", "M"] });
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
  if (dev !== primaryCommit) throw new Error(`CONVERGENCIA_REMOTA_PENDENTE:dev=${dev};${primary}=${primaryCommit}`);
  const release = JSON.parse(run("gh", ["release", "view", `v${version}`, "--json", "url,tagName,isDraft,isPrerelease"], { timeout: 120000 }).stdout);
  if (release.tagName !== `v${version}` || release.isDraft || release.isPrerelease) throw new Error(`RELEASE_REMOTO_INVALIDO:v${version}`);
  return { primary, releaseUrl: release.url, workflowRun: Number(runId) };
}

function findWorkflowRun(triggerCommit, options) {
  for (const delay of [0, 1000, 3000]) {
    if (delay) sleep(delay);
    const result = run("gh", ["run", "list", "--workflow", options.workflow, "--branch", options.branch, "--event", "push", "--limit", "20", "--json", "databaseId,headSha"], { optional: true, timeout: 120000 });
    if (result.status === 0) {
      const match = JSON.parse(result.stdout).find((entry) => entry.headSha === triggerCommit);
      if (match) return String(match.databaseId);
    }
  }
  throw new Error(`WORKFLOW_RELEASE_NAO_ENCONTRADO:${triggerCommit}`);
}

function resolvePrimaryBranch(options) {
  for (const branch of options.primary ? [options.primary] : ["main", "master"]) {
    if (run("git", ["ls-remote", "--exit-code", "--heads", options.remote, branch], { optional: true, timeout: 120000 }).status === 0) return branch;
  }
  throw new Error("BRANCH_PRIMARIA_AUSENTE");
}

function assertStagedPaths(allowed, options = {}) {
  const entries = run("git", ["diff", "--cached", "--name-status"]).stdout.trim().split(/\r?\n/u).filter(Boolean).map((line) => {
    const [status, filePath] = line.split(/\t/u);
    return { filePath, status };
  });
  if (!entries.length || entries.some((entry) => {
    const pathAllowed = options.prefixes ? allowed.some((prefix) => entry.filePath === prefix || entry.filePath.startsWith(prefix)) : allowed.includes(entry.filePath);
    return !pathAllowed || (options.statuses && !options.statuses.includes(entry.status));
  })) throw new Error(`STAGING_RELEASE_INVALIDO:${entries.map((entry) => `${entry.status}:${entry.filePath}`).join(",")}`);
}

function runTransient(command, args) {
  let result;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    result = run(command, args, { optional: true, timeout: 900000 });
    if (result.status === 0 && !result.error) return result;
    const output = `${result.stderr || ""}${result.stdout || ""}`;
    if (!/\b(?:EBUSY|ENOTEMPTY|EPERM)\b/u.test(output) || attempt === 2) break;
    sleep(500 * (attempt + 1));
  }
  throw new Error(`${command} ${args.join(" ")} falhou: ${result.error ? result.error.message : result.stderr || result.stdout}`);
}

function run(command, args, options = {}) {
  const result = childProcess.spawnSync(command, args, { cwd: ROOT_DIR, encoding: "utf8", shell: false, timeout: options.timeout || 30000 });
  if (!options.optional && (result.error || result.status !== 0)) throw new Error(`${command} ${args.join(" ")} falhou: ${result.error ? result.error.message : result.stderr || result.stdout}`);
  return result;
}

function publicOptions(options) {
  return { branch: options.branch, primary: options.primary, remote: options.remote, workflow: options.workflow };
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

module.exports = { isResumable, main, runTransient };
