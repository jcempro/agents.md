// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido "AS IS", sem garantias de qualquer tipo.

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { createZipFromDirectory } = require("../lib/archive");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const SRC_DIR = path.join(ROOT_DIR, "src");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const INDEX_PATH = path.join(ROOT_DIR, "index.json");
const RELEASE_PATH = path.join(DIST_DIR, "release.json");
const PACKAGE_PATH = path.join(ROOT_DIR, "package.json");
const ALIEN_SCRIPT_TERMS = [
  "What" + "Send",
  "what" + "sender",
  "w" + "web",
  "clientes" + ".csv",
  "texto" + ".md",
  "src" + "/browser",
  "src" + "\\browser",
  "src" + "/config",
  "src" + "\\config",
  "main" + ".js",
  "JeanCarloEM/" + "What" + "Send",
];

const COMMANDS = {
  "agent:index": {
    description: "gera index.json normativo a partir de src/",
    run: () => {
      const index = buildIndex();
      writeJsonMinified(INDEX_PATH, index);
      return ok("INDEX_OK", { files: index.files.length, path: "index.json" });
    },
    status: "available",
  },
  "agent:dist": {
    description: "gera dist/ otimizado com release.json",
    run: () => {
      const result = buildDist();
      return ok("DIST_OK", result);
    },
    status: "available",
  },
  "agent:verify": {
    description: "valida scripts, indexador e dist",
    run: verify,
    status: "available",
  },
  "agent:build": {
    description: "alias de agent:dist",
    run: () => COMMANDS["agent:dist"].run(),
    status: "available",
  },
  "agent:status": {
    description: "resume workspace e capacidades agent:*",
    run: printStatus,
    status: "available",
  },
  "agent:handoff": {
    description: "gera handoff.md de .agents/continue.ia",
    run: () => runNodeScript(path.join("scripts", ".agents", "generate-agents-status.js")),
    status: "available",
  },
  "agent:agents": {
    description: "atualiza governanca operacional gerenciada",
    run: (_args) => runNodeScript(path.join("scripts", ".agents", "update-agents.js"), _args),
    status: "available",
  },
};

const DEGRADED_COMMANDS = new Set([
  "agent:pwd",
  "agent:ls",
  "agent:tree",
  "agent:find",
  "agent:search",
  "agent:grep",
  "agent:head",
  "agent:tail",
  "agent:view",
  "agent:stat",
  "agent:size",
  "agent:hash",
  "agent:git-status",
  "agent:git-log",
  "agent:git-diff",
]);

const CANONICAL_COMMANDS = [
  "agent:setup", "agent:doctor", "agent:repair", "agent:clean", "agent:status", "agent:context", "agent:workspace",
  "agent:pwd", "agent:ls", "agent:tree", "agent:find", "agent:search", "agent:grep", "agent:head", "agent:tail", "agent:view", "agent:stat", "agent:size", "agent:hash", "agent:diff-file", "agent:logs", "agent:process", "agent:kill", "agent:ports", "agent:compress", "agent:extract",
  "agent:git-status", "agent:git-fetch", "agent:git-pull", "agent:git-push", "agent:git-sync", "agent:git-add", "agent:git-commit", "agent:git-branch", "agent:git-switch", "agent:git-tag", "agent:git-log", "agent:git-show", "agent:git-history", "agent:git-diff", "agent:git-blame", "agent:git-reset", "agent:git-restore", "agent:git-clean", "agent:git-stash", "agent:git-prune", "agent:git-gc", "agent:git-last-release", "agent:git-release-notes", "agent:git-changelog",
  "agent:build", "agent:verify", "agent:dist", "agent:package", "agent:release", "agent:publish", "agent:deploy", "agent:rollback",
  "agent:test", "agent:lint", "agent:format", "agent:typecheck", "agent:benchmark", "agent:security", "agent:analyze",
  "agent:deps", "agent:update-deps", "agent:licenses",
  "agent:index", "agent:map", "agent:handoff", "agent:docs", "agent:rcf", "agent:agents",
  "agent:parse-data", "agent:summarize", "agent:convert", "agent:validate-data", "agent:index-data", "agent:query-data",
];

function main(argv = process.argv.slice(2)) {
  const [command, ...args] = argv;

  if (!command) {
    return printStatus();
  }

  if (COMMANDS[command]) {
    return COMMANDS[command].run(args);
  }

  if (DEGRADED_COMMANDS.has(command)) {
    return runDegraded(command, args);
  }

  if (CANONICAL_COMMANDS.includes(command)) {
    console.log(JSON.stringify({
      code: "COMMAND_NA",
      command,
      reason: "Comando canonico declarado, ainda sem implementacao segura neste repositorio.",
      status: "n/a",
    }));
    return 3;
  }

  console.error(`Comando desconhecido: ${command}`);
  return 2;
}

function buildIndex() {
  assertDirectory(SRC_DIR, "src ausente.");
  const files = listFiles(SRC_DIR)
    .filter((filePath) => [".md", ".json"].includes(path.extname(filePath).toLocaleLowerCase("en-US")))
    .map((filePath) => ({
      name: path.basename(filePath),
      path: toPosix(path.relative(ROOT_DIR, filePath)),
    }))
    .sort((a, b) => a.path.localeCompare(b.path, "en"));

  return {
    files,
    root: "src",
    schema: 1,
  };
}

function buildDist() {
  const index = buildIndex();
  cleanDirectory(DIST_DIR);
  fs.mkdirSync(DIST_DIR, { recursive: true });

  for (const file of index.files) {
    const sourcePath = path.join(ROOT_DIR, file.path);
    const releasePath = releaseRelativePath(file.path);
    const targetPath = path.join(DIST_DIR, releasePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
  }

  const releaseIndex = {
    files: index.files.map((file) => ({
      name: file.name === "agents.md" ? "AGENTS.md" : file.name,
      path: releaseRelativePath(file.path),
    })),
    root: ".",
    schema: 1,
  };
  writeJsonMinified(RELEASE_PATH, releaseIndex);

  const archiveName = resolveArchiveName();
  const archivePath = path.join(DIST_DIR, archiveName);
  createZipFromDirectory(DIST_DIR, archivePath, {
    exclude: [/^agents-v.+\.zip$/u],
  });

  validateDist();
  return { archive: toPosix(path.relative(ROOT_DIR, archivePath)), files: releaseIndex.files.length };
}

function verify() {
  const checks = [];
  for (const script of listFiles(path.join(ROOT_DIR, "scripts")).filter((filePath) => path.extname(filePath) === ".js")) {
    const content = fs.readFileSync(script, "utf8");
    if (ALIEN_SCRIPT_TERMS.some((term) => content.toLocaleLowerCase("en-US").includes(term.toLocaleLowerCase("en-US")))) {
      throw new Error(`Referencia alienigena detectada em ${toPosix(path.relative(ROOT_DIR, script))}.`);
    }
    runProcess(process.execPath, ["--check", script]);
    checks.push(toPosix(path.relative(ROOT_DIR, script)));
  }

  const index = buildIndex();
  writeJsonMinified(INDEX_PATH, index);
  validateIndex(index);
  buildDist();

  return ok("VERIFY_OK", { scripts: checks.length, indexedFiles: index.files.length });
}

function validateIndex(index) {
  if (!index || index.schema !== 1 || index.root !== "src" || !Array.isArray(index.files)) {
    throw new Error("index.json invalido.");
  }
  for (const file of index.files) {
    if (!file.name || !file.path || !file.path.startsWith("src/") || !fs.existsSync(path.join(ROOT_DIR, file.path))) {
      throw new Error(`Entrada invalida no indexador: ${JSON.stringify(file)}`);
    }
  }
}

function validateDist() {
  assertFile(path.join(DIST_DIR, "AGENTS.md"), "dist/AGENTS.md ausente.");
  assertFile(path.join(DIST_DIR, ".agents", ".autoupdate.md"), "dist/.agents/.autoupdate.md ausente.");
  assertFile(path.join(DIST_DIR, ".agents", "webPageLike.md"), "dist/.agents/webPageLike.md ausente.");
  assertFile(RELEASE_PATH, "dist/release.json ausente.");
  const release = JSON.parse(fs.readFileSync(RELEASE_PATH, "utf8"));
  if (release.root !== "." || !Array.isArray(release.files)) {
    throw new Error("dist/release.json invalido.");
  }
}

function printStatus() {
  const scripts = readPackageScripts();
  const commands = CANONICAL_COMMANDS.map((command) => ({
    command,
    invocation: scripts[command] ? `npm run ${command}` : "",
    reason: commandReason(command, scripts),
    status: commandStatus(command, scripts),
  }));
  const summary = {
    branch: runProcess("git", ["branch", "--show-current"], { optional: true }).stdout.trim(),
    commands,
    commit: runProcess("git", ["rev-parse", "--short", "HEAD"], { optional: true }).stdout.trim(),
    schema: 1,
  };
  console.log(JSON.stringify(summary));
  return 0;
}

function commandStatus(command, scripts) {
  if (COMMANDS[command] && scripts[command]) {
    return "available";
  }
  if (DEGRADED_COMMANDS.has(command) && scripts[command]) {
    return "degraded";
  }
  return "n/a";
}

function commandReason(command, scripts) {
  if (!scripts[command]) {
    return "script npm canonico ausente";
  }
  if (COMMANDS[command]) {
    return COMMANDS[command].description;
  }
  if (DEGRADED_COMMANDS.has(command)) {
    return "fallback local filtrado por repo-tools";
  }
  return "sem implementacao segura definida pelo RCF atual";
}

function runDegraded(command, args) {
  const map = {
    "agent:pwd": ["pwd", []],
    "agent:ls": ["git", ["ls-files"]],
    "agent:tree": ["git", ["ls-files"]],
    "agent:find": ["git", ["ls-files", ...(args || [])]],
    "agent:search": ["rg", ["-n", ...(args || [])]],
    "agent:grep": ["rg", ["-n", ...(args || [])]],
    "agent:head": ["node", ["-e", "const fs=require('fs');const p=process.argv[1];console.log(fs.readFileSync(p,'utf8').split(/\\r?\\n/).slice(0,50).join('\\n'))", args[0] || "README.md"]],
    "agent:tail": ["node", ["-e", "const fs=require('fs');const p=process.argv[1];const a=fs.readFileSync(p,'utf8').split(/\\r?\\n/);console.log(a.slice(-50).join('\\n'))", args[0] || "README.md"]],
    "agent:view": ["node", ["-e", "const fs=require('fs');const p=process.argv[1];console.log(fs.readFileSync(p,'utf8').split(/\\r?\\n/).slice(0,50).join('\\n'))", args[0] || "README.md"]],
    "agent:stat": ["node", ["-e", "const fs=require('fs');const p=process.argv[1];const s=fs.statSync(p);console.log(JSON.stringify({path:p,size:s.size,mtime:s.mtime.toISOString()}))", args[0] || "."]],
    "agent:size": ["node", ["-e", "const fs=require('fs');const p=process.argv[1]||'.';const s=fs.statSync(p);console.log(JSON.stringify({path:p,size:s.size}))", args[0] || "."]],
    "agent:hash": ["node", ["-e", "const fs=require('fs'),c=require('crypto');const p=process.argv[1];console.log(c.createHash('sha256').update(fs.readFileSync(p)).digest('hex'))", args[0] || "README.md"]],
    "agent:git-status": ["git", ["status", "--short"]],
    "agent:git-log": ["git", ["log", "--oneline", "-20"]],
    "agent:git-diff": ["git", ["diff", "--stat", ...(args || [])]],
  };
  const [cmd, cmdArgs] = map[command];
  const result = runProcess(cmd, cmdArgs, { optional: true });
  process.stdout.write(limitOutput(result.stdout || ""));
  if (result.stderr) {
    process.stderr.write(limitOutput(result.stderr));
  }
  return result.status || 0;
}

function runNodeScript(relativePath, args = []) {
  const result = runProcess(process.execPath, [path.join(ROOT_DIR, relativePath), ...args]);
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  return result.status;
}

function runProcess(command, args, options = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd: ROOT_DIR,
    encoding: "utf8",
    shell: false,
  });
  if (!options.optional && result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} falhou: ${result.stderr || result.stdout}`);
  }
  return result;
}

function releaseRelativePath(sourcePath) {
  const relative = toPosix(sourcePath).replace(/^src\//u, "");
  return relative === "agents.md" ? "AGENTS.md" : relative;
}

function resolveArchiveName() {
  const pkg = fs.existsSync(PACKAGE_PATH) ? JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8")) : {};
  return `agents-v${pkg.version || "0.0.0-beta"}.zip`;
}

function readPackageScripts() {
  if (!fs.existsSync(PACKAGE_PATH)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8")).scripts || {};
}

function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { force: true, maxRetries: 5, recursive: true, retryDelay: 100 });
  }
}

function listFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const files = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }
  return files;
}

function writeJsonMinified(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value), "utf8");
}

function assertDirectory(dirPath, message) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(message);
  }
}

function assertFile(filePath, message) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(message);
  }
}

function ok(code, data) {
  console.log(JSON.stringify({ code, ...data }));
  return 0;
}

function limitOutput(value) {
  const lines = String(value || "").replace(/\x1b\[[0-9;]*m/gu, "").split(/\r?\n/u).slice(0, 50);
  const text = lines.join("\n");
  return text.length > 8192 ? text.slice(0, 8192) : text;
}

function toPosix(value) {
  return String(value || "").split(path.sep).join("/");
}

if (require.main === module) {
  try {
    const code = main();
    if (Number.isInteger(code)) {
      process.exitCode = code;
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}

module.exports = {
  buildDist,
  buildIndex,
  main,
  validateDist,
  verify,
};
