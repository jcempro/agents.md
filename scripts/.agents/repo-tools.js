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
const { filterOutput } = require("./to-ia");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const SRC_DIR = path.join(ROOT_DIR, "src");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const INDEX_PATH = path.join(ROOT_DIR, "index.json");
const RELEASE_PATH = path.join(DIST_DIR, "release.json");
const RELEASE_NOTE_PATH = path.join(DIST_DIR, "release-note.txt");
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
  "agent:filter": {
    description: "filtra saida textual pela interface to-ia",
    run: () => 0,
    status: "available",
  },
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
  "agent:clean": {
    description: "remove artefatos gerados locais com escopo controlado",
    run: cleanGeneratedArtifacts,
    status: "available",
  },
  "agent:repair": {
    description: "reconstroi artefatos gerados e memoria visual derivada",
    run: repairGeneratedArtifacts,
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

Object.assign(COMMANDS, {
  "agent:setup": {
    description: "valida prerequisitos locais sem instalar dependencias",
    run: setup,
    status: "available",
  },
  "agent:doctor": {
    description: "diagnostica arquivos, comandos e estado local",
    run: doctor,
    status: "available",
  },
  "agent:context": {
    description: "gera contexto executivo compacto",
    run: context,
    status: "available",
  },
  "agent:workspace": {
    description: "gera snapshot compacto do workspace",
    run: workspace,
    status: "available",
  },
  "agent:map": {
    description: "gera mapa normativo via indexador",
    run: () => COMMANDS["agent:index"].run(),
    status: "available",
  },
  "agent:docs": {
    description: "lista documentacao normativa disponivel",
    run: docs,
    status: "available",
  },
  "agent:rcf": {
    description: "valida presenca e referencia do RCF",
    run: rcf,
    status: "available",
  },
  "agent:package": {
    description: "alias seguro de agent:dist",
    run: () => COMMANDS["agent:dist"].run(),
    status: "available",
  },
  "agent:release": {
    description: "gera release local com release-note.txt e pacote versionado",
    run: releaseLocal,
    status: "available",
  },
  "agent:publish": {
    description: "cria gatilho local publish para o workflow de release",
    run: publishTrigger,
    status: "available",
  },
  "agent:deploy": {
    description: "alias de agent:publish para acionar publicacao remota",
    run: publishTrigger,
    status: "available",
  },
  "agent:test": {
    description: "alias seguro de agent:verify",
    run: () => COMMANDS["agent:verify"].run(),
    status: "available",
  },
  "agent:lint": {
    description: "checagem estatica local dos scripts",
    run: lint,
    status: "available",
  },
  "agent:typecheck": {
    description: "checagem sintatica JavaScript local",
    run: lint,
    status: "available",
  },
  "agent:security": {
    description: "audita referencias sensiveis conhecidas",
    run: security,
    status: "available",
  },
  "agent:analyze": {
    description: "executa verificacao local completa",
    run: () => COMMANDS["agent:verify"].run(),
    status: "available",
  },
  "agent:deps": {
    description: "resume dependencias declaradas",
    run: deps,
    status: "available",
  },
  "agent:licenses": {
    description: "resume licenca declarada",
    run: licenses,
    status: "available",
  },
  "agent:git-branch": {
    description: "lista branches locais",
    run: () => runGitReadOnly(["branch", "--list"]),
    status: "available",
  },
  "agent:git-status": {
    description: "exibe status local compacto",
    run: () => runGitReadOnly(["status", "--short"]),
    status: "available",
  },
  "agent:git-tag": {
    description: "lista tags locais",
    run: () => runGitReadOnly(["tag", "--list"]),
    status: "available",
  },
  "agent:git-log": {
    description: "exibe log local compacto",
    run: () => runGitReadOnly(["log", "--oneline", "-20"]),
    status: "available",
  },
  "agent:git-show": {
    description: "exibe commit local filtrado",
    run: (args) => runGitReadOnly(["show", "--stat", "--oneline", args[0] || "HEAD"]),
    status: "available",
  },
  "agent:git-history": {
    description: "exibe historico local compacto",
    run: () => runGitReadOnly(["log", "--oneline", "-50"]),
    status: "available",
  },
  "agent:git-diff": {
    description: "exibe diff local resumido",
    run: (args) => runGitReadOnly(["diff", "--stat", ...(args || [])]),
    status: "available",
  },
  "agent:git-blame": {
    description: "exibe autoria local filtrada de arquivo",
    run: (args) => runGitReadOnly(["blame", "--", args[0] || "README.md"]),
    status: "available",
  },
  "agent:git-last-release": {
    description: "localiza ultimo commit release local",
    run: gitLastRelease,
    status: "available",
  },
  "agent:git-release-notes": {
    description: "gera notas locais desde ultimo release",
    run: gitReleaseNotes,
    status: "available",
  },
  "agent:git-changelog": {
    description: "gera changelog local compacto",
    run: () => runGitReadOnly(["log", "--oneline", "-100"]),
    status: "available",
  },
});

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
]);

const CANONICAL_COMMANDS = [
  "agent:filter",
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

  if (CANONICAL_COMMANDS.includes(command)) {
    return runDegraded(command, args);
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

function buildDist(options = {}) {
  const releaseVersion = normalizeReleaseVersion(options.version || "");
  const releaseNotes = typeof options.releaseNotes === "string" ? options.releaseNotes.trim() : readExistingReleaseNotes();
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
  if (releaseNotes) {
    fs.writeFileSync(RELEASE_NOTE_PATH, `${releaseNotes}\n`, "utf8");
  }

  const archiveName = resolveArchiveName(releaseVersion);
  const archivePath = path.join(DIST_DIR, archiveName);
  createZipFromDirectory(DIST_DIR, archivePath, {
    exclude: [/^agents-v.+\.zip$/u],
  });

  validateDist();
  return {
    archive: toPosix(path.relative(ROOT_DIR, archivePath)),
    files: releaseIndex.files.length,
    releaseNote: releaseNotes ? toPosix(path.relative(ROOT_DIR, RELEASE_NOTE_PATH)) : "",
    version: releaseVersion || readPackageVersion(),
  };
}

function readExistingReleaseNotes() {
  if (!fs.existsSync(RELEASE_NOTE_PATH)) {
    return "";
  }

  return fs.readFileSync(RELEASE_NOTE_PATH, "utf8").trim();
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

function cleanGeneratedArtifacts() {
  const removed = [];
  for (const relativePath of ["dist", "index.json", "handoff.md"]) {
    const target = path.join(ROOT_DIR, relativePath);
    if (!fs.existsSync(target)) {
      continue;
    }
    if (fs.statSync(target).isDirectory()) {
      cleanDirectory(target);
    } else {
      fs.rmSync(target, { force: true });
    }
    removed.push(toPosix(relativePath));
  }
  return ok("CLEAN_OK", { removed });
}

function repairGeneratedArtifacts() {
  const index = buildIndex();
  writeJsonMinified(INDEX_PATH, index);
  runNodeScript(path.join("scripts", ".agents", "generate-agents-status.js"));
  const dist = buildDist();
  return ok("REPAIR_OK", {
    archive: dist.archive,
    files: index.files.length,
    handoff: "handoff.md",
  });
}

function setup() {
  const required = ["package.json", "README.md", "RCF.md", "agents.md", path.join(".agents", "continue.ia")];
  const missing = required.filter((entry) => !fs.existsSync(path.join(ROOT_DIR, entry)));
  return ok(missing.length ? "SETUP_DEGRADED" : "SETUP_OK", { missing });
}

function doctor() {
  const scripts = readPackageScripts();
  const commandSummary = summarizeCommands(scripts);
  const requiredFiles = ["README.md", "RCF.md", "agents.md", "package.json", "index.json", path.join(".agents", "continue.ia")];
  const missing = requiredFiles.filter((entry) => !fs.existsSync(path.join(ROOT_DIR, entry)));
  const git = runProcess("git", ["status", "--short"], { optional: true });
  return ok(missing.length ? "DOCTOR_DEGRADED" : "DOCTOR_OK", {
    commands: commandSummary,
    dirty: Boolean((git.stdout || "").trim()),
    missing,
  });
}

function context() {
  const index = buildIndex();
  const log = runProcess("git", ["log", "--oneline", "-5"], { optional: true }).stdout.trim().split(/\r?\n/u).filter(Boolean);
  return ok("CONTEXT_OK", {
    branch: runProcess("git", ["branch", "--show-current"], { optional: true }).stdout.trim(),
    latestCommits: log,
    normativeFiles: index.files,
  });
}

function workspace() {
  return ok("WORKSPACE_OK", {
    files: runProcess("git", ["ls-files"], { optional: true }).stdout.trim().split(/\r?\n/u).filter(Boolean).slice(0, 200),
    status: runProcess("git", ["status", "--short"], { optional: true }).stdout.trim().split(/\r?\n/u).filter(Boolean),
  });
}

function docs() {
  const docsFiles = ["README.md", "RCF.md", "agents.md", "handoff.md"].filter((entry) => fs.existsSync(path.join(ROOT_DIR, entry)));
  return ok("DOCS_OK", { files: docsFiles });
}

function rcf() {
  const rcfPath = path.join(ROOT_DIR, "RCF.md");
  assertFile(rcfPath, "RCF.md ausente.");
  const content = fs.readFileSync(rcfPath, "utf8");
  return ok(content.includes("## 9. Indexador") && content.includes("## 10. Dist") ? "RCF_OK" : "RCF_DEGRADED", {
    path: "RCF.md",
    bytes: Buffer.byteLength(content),
  });
}

function lint() {
  const scripts = listFiles(path.join(ROOT_DIR, "scripts")).filter((filePath) => path.extname(filePath) === ".js");
  for (const script of scripts) {
    runProcess(process.execPath, ["--check", script]);
  }
  return ok("LINT_OK", { scripts: scripts.length });
}

function security() {
  const findings = [];
  for (const filePath of listFiles(ROOT_DIR).filter((entry) => !toPosix(path.relative(ROOT_DIR, entry)).startsWith(".git/"))) {
    if (![".js", ".json", ".md"].includes(path.extname(filePath).toLocaleLowerCase("en-US"))) {
      continue;
    }
    const relative = toPosix(path.relative(ROOT_DIR, filePath));
    const content = fs.readFileSync(filePath, "utf8");
    if (ALIEN_SCRIPT_TERMS.some((term) => content.toLocaleLowerCase("en-US").includes(term.toLocaleLowerCase("en-US")))) {
      findings.push(relative);
    }
  }
  return ok(findings.length ? "SECURITY_DEGRADED" : "SECURITY_OK", { findings });
}

function deps() {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
  return ok("DEPS_OK", {
    dependencies: Object.keys(pkg.dependencies || {}).length,
    devDependencies: Object.keys(pkg.devDependencies || {}).length,
    optionalDependencies: Object.keys(pkg.optionalDependencies || {}).length,
  });
}

function licenses() {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
  return ok("LICENSES_OK", { license: pkg.license || "" });
}

function gitLastRelease() {
  const result = runProcess("git", ["log", "--grep=^release:", "--format=%H %s", "-1"], { optional: true });
  return ok(result.stdout.trim() ? "GIT_LAST_RELEASE_OK" : "GIT_LAST_RELEASE_EMPTY", {
    commit: result.stdout.trim(),
  });
}

function gitReleaseNotes() {
  const last = runProcess("git", ["log", "--grep=^release:", "--format=%H", "-1"], { optional: true }).stdout.trim();
  const range = last ? `${last}..HEAD` : "HEAD";
  const log = runProcess("git", ["log", "--oneline", range], { optional: true }).stdout.trim().split(/\r?\n/u).filter(Boolean);
  return ok("GIT_RELEASE_NOTES_OK", { commits: log });
}

function releaseLocal(args = []) {
  const version = normalizeReleaseVersion(args[0] || readPackageVersion());
  const notes = buildReleaseNotes(version);
  const result = buildDist({ releaseNotes: notes, version });
  return ok("RELEASE_OK", result);
}

function publishTrigger(args = []) {
  const version = normalizeReleaseVersion(args[0] || readPackageVersion());
  const targetPath = path.join(ROOT_DIR, "publish");
  fs.writeFileSync(targetPath, `${version}\n`, "utf8");
  return ok("PUBLISH_TRIGGER_OK", {
    file: "publish",
    version,
  });
}

function runGitReadOnly(args) {
  const result = runProcess("git", args, { optional: true });
  process.stdout.write(limitOutput(result.stdout || ""));
  if (result.stderr) {
    process.stderr.write(limitOutput(result.stderr));
  }
  return result.status || 0;
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

function summarizeCommands(scripts) {
  return CANONICAL_COMMANDS.reduce((acc, command) => {
    const status = commandStatus(command, scripts);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}

function commandStatus(command, scripts) {
  if (COMMANDS[command] && scripts[command]) {
    return "available";
  }
  if (CANONICAL_COMMANDS.includes(command) && scripts[command]) {
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
  if (CANONICAL_COMMANDS.includes(command)) {
    return "superficie canonica degradada: sem acao destrutiva, rede ou mutacao implicita";
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
  if (!map[command]) {
    console.log(JSON.stringify({
      code: "COMMAND_DEGRADED",
      command,
      reason: "Comando canonico reconhecido; implementacao completa pendente. Nenhuma acao destrutiva, rede ou mutacao foi executada.",
      status: "degraded",
    }));
    return 0;
  }

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

function resolveArchiveName(versionOverride = "") {
  return `agents-v${normalizeReleaseVersion(versionOverride || readPackageVersion())}.zip`;
}

function readPackageVersion() {
  const pkg = fs.existsSync(PACKAGE_PATH) ? JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8")) : {};
  return normalizeReleaseVersion(pkg.version || "0.0.0-beta");
}

function normalizeReleaseVersion(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  const match = raw.match(/^(\d+)\.(\d+)(?:\.(\d+))?(?:-([0-9A-Za-z.-]+))?$/u);

  if (!match) {
    throw new Error(`Versao de release invalida: ${value}`);
  }

  const major = match[1];
  const minor = match[2];
  const patch = match[3] || "0";
  const suffix = match[4] ? `-${match[4]}` : "";
  return `${major}.${minor}.${patch}${suffix}`;
}

function buildReleaseNotes(version) {
  const last = runProcess("git", ["log", "--grep=^release:", "--format=%H", "-1"], { optional: true }).stdout.trim();
  const range = last ? `${last}..HEAD` : "HEAD";
  const commits = runProcess("git", ["log", "--format=%h %s", range], { optional: true }).stdout
    .trim()
    .split(/\r?\n/u)
    .filter(Boolean);

  const lines = [
    `Release v${version}`,
    "",
  ];

  if (commits.length === 0) {
    lines.push("- Sem alteracoes registradas desde o ultimo marcador release.");
  } else {
    for (const commit of commits) {
      lines.push(`- ${commit}`);
    }
  }

  return lines.join("\n");
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
  const stdout = process.stdout.write.bind(process.stdout);
  const stderr = process.stderr.write.bind(process.stderr);
  const out = [];
  const err = [];
  process.stdout.write = (chunk) => { out.push(String(chunk)); return true; };
  process.stderr.write = (chunk) => { err.push(String(chunk)); return true; };
  let code = 0;
  try {
    code = main();
  } catch (err) {
    console.error(err.message);
    code = 1;
  }
  process.stdout.write = stdout;
  process.stderr.write = stderr;
  stdout(filterOutput({ command: process.argv[2] || "agent:status", exit: Number.isInteger(code) ? code : 1, stderr: err.join(""), stdout: out.join("") }));
  process.exitCode = Number.isInteger(code) ? code : 1;
}

module.exports = {
  buildDist,
  buildIndex,
  main,
  validateDist,
  verify,
};
