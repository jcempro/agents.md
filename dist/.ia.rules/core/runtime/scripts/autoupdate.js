// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const BACKEND_PATH = path.join(__dirname, "update-agents.js");

async function main(argv = process.argv.slice(2), options = {}) {
  const rootDir = options.rootDir || ROOT_DIR;
  const policy = readSuccessorPolicy(rootDir);
  global.SOURCE_OWNER = policy.upstreamRepository.split("/")[0];
  global.SOURCE_REPO = policy.upstreamRepository.split("/")[1];
  const result = await withVirtualUpstream(policy, rootDir, async () => require(BACKEND_PATH).main(argv, options));
  const migration = planPackageMigration(rootDir, policy);
  if (migration.changed && (argv.includes("--dry-run") || argv.includes("--check"))) {
    console.log("migrate: package.json aliases para agent:autoupdate");
    if (argv.includes("--check")) process.exitCode = 2;
  } else if (migration.changed && !argv.includes("--help")) {
    applyPackageMigration(rootDir, migration);
  }
  return result;
}

function planPackageMigration(rootDir, policy) {
  const packagePath = path.join(rootDir, "package.json");
  if (!fs.existsSync(packagePath)) throw new Error("PACKAGE_JSON_AUSENTE");
  const raw = fs.readFileSync(packagePath, "utf8");
  const pkg = JSON.parse(raw);
  const canonical = "npm run update:agents --";
  const scripts = { ...(pkg.scripts || {}) };
  for (const name of ["agent:autoupdate", "agents:autoupdate", "agent:agents", "agents:update"]) scripts[name] = canonical;
  const next = {
    ...pkg,
    agentsUpstream: policy,
    agentsGovernance: {
      ...(pkg["agentsGovernance"] || {}),
      schema: 1,
      managedScriptPrefixes: Array.isArray(pkg["agentsGovernance"] && pkg["agentsGovernance"].managedScriptPrefixes) ? pkg["agentsGovernance"].managedScriptPrefixes : ["agent:", "shared:"],
      managedScripts: Array.isArray(pkg["agentsGovernance"] && pkg["agentsGovernance"].managedScripts) ? pkg["agentsGovernance"].managedScripts : ["agents:autoupdate", "agents:update", "update:agents"],
      dependencies: Array.isArray(pkg["agentsGovernance"] && pkg["agentsGovernance"].dependencies) ? pkg["agentsGovernance"].dependencies : [],
      optionalDependencies: Array.isArray(pkg["agentsGovernance"] && pkg["agentsGovernance"].optionalDependencies) ? pkg["agentsGovernance"].optionalDependencies : [],
    },
    scripts,
  };
  const indent = (raw.match(/\n([ \t]+)"[^"]+"\s*:/u) || [null, "  "])[1];
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const content = `${JSON.stringify(next, null, indent).replace(/\n/gu, eol)}${eol}`;
  return { changed: normalizeText(raw) !== normalizeText(content), content, packagePath };
}

function applyPackageMigration(rootDir, migration) {
  assertGitClean(rootDir);
  fs.writeFileSync(migration.packagePath, migration.content, "utf8");
  runGit(rootDir, ["add", "--", "package.json"]);
  const staged = runGit(rootDir, ["diff", "--cached", "--name-only"]).stdout.trim().split(/\r?\n/u).filter(Boolean);
  if (staged.length !== 1 || staged[0] !== "package.json") throw new Error(`STAGING_MIGRACAO_INVALIDO:${staged.join(",")}`);
  runGit(rootDir, ["commit", "-m", "ajuste: migra comando agent:autoupdate"]);
  const branch = runGit(rootDir, ["branch", "--show-current"]).stdout.trim();
  if (!branch) throw new Error("BRANCH_ATUAL_AUSENTE");
  runGit(rootDir, ["push", "-u", "origin", branch]);
  console.log("package.json migrado para agent:autoupdate.");
}

function assertGitClean(rootDir) {
  const worktree = childProcess.spawnSync("git", ["-C", rootDir, "diff", "--quiet"], { encoding: "utf8" });
  const staged = childProcess.spawnSync("git", ["-C", rootDir, "diff", "--cached", "--quiet"], { encoding: "utf8" });
  if (worktree.status !== 0 || staged.status !== 0) throw new Error("WORKTREE_RASTREADO_SUJO_APOS_ATUALIZACAO");
}

function runGit(rootDir, args) {
  const result = childProcess.spawnSync("git", ["-C", rootDir, ...args], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} falhou: ${result.stderr || result.stdout}`);
  return result;
}

function normalizeText(value) { return String(value).replace(/\r\n/gu, "\n").trimEnd(); }

function readSuccessorPolicy(rootDir) {
  const packagePath = path.join(rootDir, "package.json");
  const managedPath = path.join(rootDir, ".ia.rules", "core", "update", "upstream.json");
  const managed = fs.existsSync(managedPath) ? JSON.parse(fs.readFileSync(managedPath, "utf8")) : {};
  const declared = fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath, "utf8"))["agentsUpstream"] || {} : {};
  const policy = managed.schema === 1 ? managed : declared;
  if (policy.schema !== 1 || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(String(policy.upstreamRepository || ""))) {
    throw new Error("UPSTREAM_AGENTS_NAO_RESOLVIDO: metadado de sucessor ausente ou invalido.");
  }
  return policy;
}

async function withVirtualUpstream(policy, rootDir, operation) {
  const localPath = path.join(rootDir, ".ia.rules", "upstream.json");
  if (fs.existsSync(localPath)) return operation();
  const originalExists = fs.existsSync;
  const originalRead = fs.readFileSync;
  const virtual = JSON.stringify({ schema: 1, upstreamRepository: policy.upstreamRepository });
  fs.existsSync = function patchedExists(target) { return path.resolve(String(target)) === path.resolve(localPath) || originalExists.call(fs, target); };
  fs.readFileSync = function patchedRead(target, ...args) {
    if (path.resolve(String(target)) === path.resolve(localPath)) return virtual;
    return originalRead.call(fs, target, ...args);
  };
  try {
    return await operation();
  } finally {
    fs.existsSync = originalExists;
    fs.readFileSync = originalRead;
  }
}

if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = error.exitCode || 1; });

module.exports = { main, planPackageMigration, readSuccessorPolicy, withVirtualUpstream };
