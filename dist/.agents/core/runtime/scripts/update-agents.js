// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido "AS IS", sem garantias de qualquer tipo.

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const https = require("https");
const os = require("os");
const path = require("path");

const { extractZip } = require("./archive");
const { FORMAT, MARKER, VERSION, convertLegacyLock, isCurrentLock } = require("../../update/migrations/v1-to-v2");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const LOCK_FILE = path.join(".agents", "agents-update.lock.json");
const MANAGED_EXTENSIONS = new Set([".js", ".json", ".md"]);
const PACKAGE_RELATIVE_PATH = "package.json";
const BOOTSTRAP_MANAGED = new Set([
  "AGENTS.md",
  ".agents/core/contracts.md",
  ".agents/core/concepts/microconceitos.md",
  ".agents/core/update/scenario.md",
  ".agents/scenarios/web/page-like/scenario.md",
]);
const LEGACY_MANAGED_FILES = new Set([
  "scripts/.agents/generate-agents-status.js",
  "scripts/.agents/release-hooks.js",
  "scripts/.agents/release-workflow.js",
  "scripts/.agents/repo-tools.js",
  "scripts/.agents/to-ia.js",
  "scripts/.agents/update-agents.js",
  "scripts/lib/archive.js",
]);

class UsageError extends Error {}

async function main(argv = process.argv.slice(2), options = {}) {
  const parsed = parseArgs(argv);
  if (parsed.help) {
    console.log(help());
    return { help: true };
  }
  const rootDir = options.rootDir || ROOT_DIR;
  const httpClient = options.httpClient || defaultHttpClient;
  const plan = await buildUpdatePlan(rootDir, httpClient);

  if (parsed.dryRun) {
    printPlan(plan, "dry-run");
    return plan;
  }

  if (parsed.check) {
    printPlan(plan, plan.changed ? "desatualizado" : "atualizado");
    if (plan.changed) {
      process.exitCode = 2;
    }
    return plan;
  }

  if (!plan.changed) {
    console.log("Governanca operacional ja esta atualizada.");
    return plan;
  }

  assertManagedFilesClean(rootDir, parsed.force, plan);
  assertNoUnmanagedCollisions(rootDir, parsed.force, plan);
  applyPlan(rootDir, plan);
  commitAndPushNormativeUpdate(rootDir, plan);
  console.log(`Governanca operacional atualizada de ${plan.source.label}.`);
  return plan;
}

function parseArgs(argv = []) {
  const parsed = { check: false, dryRun: false, force: false, help: false };
  for (const value of argv) {
    if (value === "--check") parsed.check = true;
    else if (value === "--dry-run") parsed.dryRun = true;
    else if (value === "--force") parsed.force = true;
    else if (value === "--help") parsed.help = true;
    else throw new UsageError(`PARAMETRO_INVALIDO:${value}`);
  }
  return parsed;
}

function help() {
  return "Uso: agent:autoupdate [--check|--dry-run] [--force] [--help]";
}

async function buildUpdatePlan(rootDir, httpClient = defaultHttpClient) {
  const source = await resolveRemoteSource(httpClient, rootDir);
  const archive = await httpClient(source.archiveUrl, { binary: true });
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-update-"));

  try {
    extractZip(archive.body, tempRoot);
    const remoteRoot = discoverRemoteRoot(tempRoot);
    const remoteFiles = collectRemoteGovernanceFiles(remoteRoot);
    const previousLock = readUpdateLock(rootDir);
    const changes = compareRemoteFiles(rootDir, remoteFiles, previousLock);

    return {
      changed: changes.some((change) => change.action !== "unchanged"),
      changes,
      remoteRoot,
      source,
      lock: createUpdateLock(source, remoteFiles),
    };
  } finally {
    fs.rmSync(tempRoot, { force: true, recursive: true });
  }
}

async function resolveRemoteSource(httpClient = defaultHttpClient, rootDir = ROOT_DIR) {
  const source = resolveConfiguredUpstream(rootDir);
  const sourceApi = `https://api.github.com/repos/${source.repository}`;
  const latest = await requestJsonAllow404(httpClient, `${sourceApi}/releases/latest`);

  if (latest && latest.statusCode !== 404) {
    const asset = selectReleaseZipAsset(latest.json);
    return {
      archiveUrl: asset ? asset.browser_download_url : latest.json.zipball_url,
      label: `release:${latest.json.tag_name || "latest"}`,
      ref: latest.json.tag_name || "latest",
      type: "release",
    };
  }

  for (const branch of ["main", "master"]) {
    const response = await requestJsonAllow404(httpClient, `${sourceApi}/branches/${branch}`);

    if (response && response.statusCode !== 404) {
      const sha = response.json && response.json.commit && response.json.commit.sha;

      if (!sha) {
        throw new Error(`Branch ${branch} sem commit SHA.`);
      }

      return {
        archiveUrl: `${sourceApi}/zipball/${sha}`,
        label: `branch:${branch}:${sha}`,
        ref: sha,
        type: "branch",
      };
    }
  }

  throw new Error(`Nenhuma release latest ou branch main/master encontrada para AGENTS em ${source.repository}.`);
}

function resolveConfiguredUpstream(rootDir) {
  const packagePath = path.join(rootDir, "package.json");
  const localPath = path.join(rootDir, ".agents", "upstream.json");
  const packageConfig = fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath, "utf8")).agentsUpstream || {} : {};
  const localConfig = fs.existsSync(localPath) ? JSON.parse(fs.readFileSync(localPath, "utf8")) : {};
  const config = { ...packageConfig, ...localConfig };
  const repository = String(config.upstreamRepository || "").trim();
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(repository)) {
    throw new Error("UPSTREAM_AGENTS_NAO_RESOLVIDO: configure agentsUpstream.upstreamRepository.");
  }
  return { repository, source: localConfig.upstreamRepository ? "local" : "package" };
}

async function requestJsonAllow404(httpClient, url) {
  let response = await httpClient(url);

  // PROTECAO: limita o fallback autenticado a consultas JSON da API GitHub.
  if (response.statusCode === 403) {
    const authenticated = githubCliJsonResponse(url);
    if (authenticated) {
      response = authenticated;
    }
  }

  if (response.statusCode === 404) {
    return response;
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`Falha ao consultar ${url}: HTTP ${response.statusCode}.`);
  }

  return {
    ...response,
    json: JSON.parse(response.body.toString("utf8")),
  };
}

function githubCliJsonResponse(url) {
  const target = new URL(url);

  if (target.protocol !== "https:" || target.hostname !== "api.github.com") {
    return null;
  }

  const result = childProcess.spawnSync("gh", [
    "api",
    `${target.pathname}${target.search}`,
    "-H",
    "Accept: application/vnd.github+json",
  ], {
    encoding: "utf8",
    windowsHide: true,
  });

  if (result.error || result.status !== 0 || !result.stdout.trim()) {
    return null;
  }

  return {
    body: Buffer.from(result.stdout, "utf8"),
    headers: {},
    statusCode: 200,
  };
}

function selectReleaseZipAsset(release) {
  const assets = Array.isArray(release && release.assets) ? release.assets : [];
  const candidates = assets.filter((asset) => {
    const name = String(asset.name || "").toLocaleLowerCase("en-US");
    return name.endsWith(".zip") && asset.browser_download_url;
  });

  if (candidates.length > 1) {
    throw new Error("Release latest possui múltiplos ZIPs normativos possíveis.");
  }

  return candidates[0] || null;
}

function discoverRemoteRoot(tempRoot) {
  const agentsFiles = listFiles(tempRoot)
    .filter((filePath) => path.basename(filePath).toLocaleLowerCase("en-US") === "agents.md")
    .filter((filePath) => fs.readFileSync(filePath, "utf8").includes("AGENTS.md"));

  if (agentsFiles.length === 0) {
    throw new Error("AGENTS.md remoto não encontrado no pacote normativo.");
  }

  agentsFiles.sort((a, b) => scoreAgentsPath(a).localeCompare(scoreAgentsPath(b)));
  return path.dirname(agentsFiles[0]);
}

function scoreAgentsPath(filePath) {
  const rel = toPosixPath(filePath).toLocaleLowerCase("en-US");

  if (rel.toLocaleLowerCase("en-US").endsWith("/src/agents.md")) {
    return "0";
  }

  return `${String(rel.split("/").length).padStart(4, "0")}:${rel}`;
}

function collectRemoteGovernanceFiles(remoteRoot) {
  const source = discoverGovernanceManifest(remoteRoot);
  const files = new Map();
  for (const entry of source.manifest.files) {
    const target = safeRelativePath(entry.path);
    if (isLocalExtensionPath(target) || toPosixPath(target).toLocaleLowerCase("en-US") === "agents.local.md") {
      throw new Error(`Manifesto remoto inclui extensao local: ${toPosixPath(target)}`);
    }
    const origin = safeRelativePath(entry.source || entry.path);
    addRemoteFile(files, source.baseRoot, origin, target, entry.kind || (target === PACKAGE_RELATIVE_PATH ? "package" : "file"), entry.sha256);
  }
  assertRequiredManagedFiles(files);
  return [...files.values()];
}

function discoverGovernanceManifest(remoteRoot) {
  const candidates = [
    { baseRoot: remoteRoot, filePath: path.join(remoteRoot, "release.json"), label: "release.json" },
    { baseRoot: path.dirname(remoteRoot), filePath: path.join(path.dirname(remoteRoot), "index.json"), label: "index.json" },
  ];
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate.filePath)) continue;
    const raw = JSON.parse(fs.readFileSync(candidate.filePath, "utf8"));
    return { ...candidate, manifest: parseGovernanceManifest(raw, candidate.label) };
  }
  throw new Error("Manifesto remoto de atualizacao ausente.");
}

function parseGovernanceManifest(raw, label) {
  const declared = raw && raw.update;
  if (declared && declared.format === FORMAT && declared.schema === VERSION && declared.marker === MARKER) {
    return validateGovernanceManifest(declared, label);
  }
  if (raw && raw.schema === 1 && Array.isArray(raw.files)) {
    return validateGovernanceManifest({
      format: FORMAT,
      marker: "governance-manifest/v1-transitional",
      schema: 1,
      files: raw.files.map((entry) => ({ path: entry.path, source: entry.source || entry.path, kind: entry.path === PACKAGE_RELATIVE_PATH ? "package" : "file" })),
    }, label, true);
  }
  throw new Error(`${label} sem manifesto de atualizacao reconhecido.`);
}

function validateGovernanceManifest(manifest, label, legacy = false) {
  if (!manifest || !Array.isArray(manifest.files) || manifest.files.length === 0 || (!legacy && manifest.marker !== MARKER)) {
    throw new Error(`${label} contem manifesto invalido.`);
  }
  const paths = new Set();
  for (const entry of manifest.files) {
    const target = toPosixPath(safeRelativePath(entry && entry.path));
    if (paths.has(target)) throw new Error(`${label} possui destino duplicado: ${target}`);
    paths.add(target);
    safeRelativePath(entry.source || entry.path);
    if (entry.sha256 && !/^[a-f0-9]{64}$/iu.test(entry.sha256)) throw new Error(`${label} possui hash invalido: ${target}`);
  }
  return manifest;
}

function assertRequiredManagedFiles(files) {
  for (const required of BOOTSTRAP_MANAGED) {
    if (!files.has(required)) throw new Error(`Manifesto remoto incompleto: ${required}`);
  }
}

function discoverReferencedMarkdown(content) {
  const result = [];
  const pattern = /\]\((\.\/[^)#]+\.md)(?:#[^)]+)?\)/giu;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    result.push(match[1]);
  }

  return result;
}

function normalizeGovernanceRelativePath(value) {
  const normalized = toPosixPath(value).replace(/^\.\//u, "");

  if (normalized.startsWith("agents/")) {
    return `.agents/${normalized.slice("agents/".length)}`;
  }

  return normalized;
}

function addRemoteFile(files, remoteRoot, relativePath, targetRelativePath = relativePath, kind = "file", expectedHash = "") {
  const safeRel = safeRelativePath(relativePath);
  const sourcePath = path.join(remoteRoot, safeRel);

  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    throw new Error(`Arquivo normativo remoto ausente: ${toPosixPath(safeRel)}`);
  }

  if (!MANAGED_EXTENSIONS.has(path.extname(sourcePath).toLocaleLowerCase("en-US"))) {
    throw new Error(`Tipo normativo não permitido: ${toPosixPath(safeRel)}`);
  }

  const content = fs.readFileSync(sourcePath);
  if (expectedHash && hashTextContent(content) !== expectedHash.toLocaleLowerCase("en-US")) {
    throw new Error(`Hash remoto divergente: ${toPosixPath(safeRel)}`);
  }
  files.set(toPosixPath(targetRelativePath), {
    content,
    kind,
    relativePath: safeRelativePath(targetRelativePath),
  });
}

function compareRemoteFiles(rootDir, remoteFiles, previousLock = null) {
  const changes = [];
  const remotePaths = new Set(remoteFiles.map((entry) => toPosixPath(entry.relativePath)));

  for (const entry of remoteFiles) {
    const localPath = path.join(rootDir, entry.relativePath);
    const localContent = fs.existsSync(localPath) ? fs.readFileSync(localPath) : null;
    const content = entry.kind === "package" && localContent ? mergePackageManifest(localContent, entry.content) : entry.content;
    const same = localContent && hashTextContent(localContent) === hashTextContent(content);
    changes.push({
      action: same ? "unchanged" : localContent ? "update" : "add",
      content,
      kind: entry.kind,
      relativePath: entry.relativePath,
    });
  }

  for (const localRel of listManagedCleanupPaths(previousLock)) {
    if (toPosixPath(localRel) !== toPosixPath(LOCK_FILE) && toPosixPath(localRel) !== PACKAGE_RELATIVE_PATH &&
      !remotePaths.has(toPosixPath(localRel)) && fs.existsSync(path.join(rootDir, localRel))) {
      changes.push({
        action: "remove",
        relativePath: localRel,
      });
    }
  }

  return changes.sort((a, b) => toPosixPath(a.relativePath).localeCompare(toPosixPath(b.relativePath), "en"));
}

function listPreviouslyManagedFiles(lock) {
  if (!lock || !Array.isArray(lock.managedFiles)) {
    return [];
  }

  return lock.managedFiles.map((entry) => safeRelativePath(entry.path || entry.relativePath || entry));
}

function listManagedCleanupPaths(lock) {
  return [...new Set([
    ...BOOTSTRAP_MANAGED,
    ...LEGACY_MANAGED_FILES,
    ...listPreviouslyManagedFiles(lock),
  ])].filter((relativePath) => !isLocalExtensionPath(relativePath) && toPosixPath(relativePath).toLocaleLowerCase("en-US") !== "agents.local.md");
}

function assertManagedFilesClean(rootDir, force, plan) {
  if (force) {
    return;
  }

  const paths = [...new Set(plan.changes
    .filter((change) => change.action !== "unchanged")
    .map((change) => toPosixPath(change.relativePath)))];

  if (paths.length === 0) {
    return;
  }

  const result = childProcess.spawnSync("git", [
    "-C",
    rootDir,
    "status",
    "--porcelain",
    "--",
    ...paths,
  ], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(`Falha ao verificar working tree: ${result.stderr || result.stdout}`);
  }

  if (result.stdout.trim()) {
    throw new Error("Arquivos normativos locais modificados; use --force somente após revisar o diff.");
  }
}

function assertNoUnmanagedCollisions(rootDir, force, plan) {
  if (force) {
    return;
  }

  const previousLock = readUpdateLock(rootDir);
  const managed = new Set([
    ...BOOTSTRAP_MANAGED,
    PACKAGE_RELATIVE_PATH,
    ...listPreviouslyManagedFiles(previousLock).map(toPosixPath),
  ]);

  for (const change of plan.changes) {
    if (change.action === "unchanged" || change.action === "remove") {
      continue;
    }
    const relativePath = toPosixPath(change.relativePath);
    const target = path.join(rootDir, relativePath);
    if (fs.existsSync(target) && !managed.has(relativePath) && !isRecognizedLegacyGovernanceFile(relativePath)) {
      throw new Error(`Colisao com arquivo local nao gerenciado: ${relativePath}. Use agents.local.md ou .agents/hooks/.`);
    }
  }
}

function mergePackageManifest(localContent, remoteContent) {
  const localPackage = parsePackageManifest(localContent, "local");
  const remotePackage = parsePackageManifest(remoteContent, "distribuido");
  const policy = readGovernancePolicy(remotePackage);
  const merged = { ...localPackage };
  const localScripts = localPackage.scripts && typeof localPackage.scripts === "object" ? localPackage.scripts : {};
  const remoteScripts = remotePackage.scripts && typeof remotePackage.scripts === "object" ? remotePackage.scripts : {};

  merged.scripts = { ...localScripts };
  for (const [name, command] of Object.entries(remoteScripts)) {
    if (isManagedScriptName(name, policy)) {
      merged.scripts[name] = command;
    }
  }

  mergeManagedDependencies(merged, localPackage, remotePackage, "dependencies", policy.dependencies);
  mergeManagedDependencies(merged, localPackage, remotePackage, "optionalDependencies", policy.optionalDependencies);
  merged.agentsGovernance = policy;
  return Buffer.from(`${JSON.stringify(merged, null, 2)}\n`, "utf8");
}

function parsePackageManifest(content, label) {
  let manifest;
  try {
    manifest = JSON.parse(content.toString("utf8"));
  } catch (error) {
    throw new Error(`package.json ${label} invalido: ${error.message}`);
  }
  if (!manifest || Array.isArray(manifest) || typeof manifest !== "object") {
    throw new Error(`package.json ${label} invalido.`);
  }
  return manifest;
}

function readGovernancePolicy(remotePackage) {
  const policy = remotePackage.agentsGovernance;
  if (!policy || policy.schema !== 1 || !Array.isArray(policy.managedScriptPrefixes) ||
    !Array.isArray(policy.managedScripts) || !Array.isArray(policy.dependencies) ||
    !Array.isArray(policy.optionalDependencies)) {
    throw new Error("package.json distribuido sem agentsGovernance valido.");
  }
  return {
    schema: 1,
    managedScriptPrefixes: policy.managedScriptPrefixes.map(String),
    managedScripts: policy.managedScripts.map(String),
    dependencies: policy.dependencies.map(String),
    optionalDependencies: policy.optionalDependencies.map(String),
  };
}

function isManagedScriptName(name, policy) {
  return policy.managedScripts.includes(name) || policy.managedScriptPrefixes.some((prefix) => name.startsWith(prefix));
}

function mergeManagedDependencies(merged, localPackage, remotePackage, group, names) {
  if (!names.length) {
    return;
  }
  const localDependencies = localPackage[group] && typeof localPackage[group] === "object" ? localPackage[group] : {};
  const remoteDependencies = remotePackage[group] && typeof remotePackage[group] === "object" ? remotePackage[group] : {};
  merged[group] = { ...localDependencies };

  for (const name of names) {
    if (typeof remoteDependencies[name] !== "string") {
      throw new Error(`Dependencia gerenciada ausente no pacote distribuido: ${group}.${name}.`);
    }
    merged[group][name] = remoteDependencies[name];
  }
}

function isRecognizedLegacyGovernanceFile(relativePath) {
  return LEGACY_MANAGED_FILES.has(toPosixPath(relativePath));
}

function applyPlan(rootDir, plan) {
  const backupRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-update-backup-"));
  const touched = [];
  const lockTarget = path.join(rootDir, LOCK_FILE);
  try {
    for (const change of plan.changes) {
      if (change.action === "unchanged") continue;
      applyTransactionalChange(rootDir, backupRoot, change, touched);
    }
    applyTransactionalChange(rootDir, backupRoot, {
      action: "update",
      content: Buffer.from(`${JSON.stringify(plan.lock)}\n`, "utf8"),
      relativePath: LOCK_FILE,
    }, touched);
  } catch (error) {
    restoreTransactionalChanges(rootDir, backupRoot, touched);
    throw error;
  } finally {
    fs.rmSync(backupRoot, { force: true, recursive: true });
  }

  if (!fs.existsSync(lockTarget)) {
    throw new Error("Lock de atualizacao ausente apos transacao.");
  }
}

function applyTransactionalChange(rootDir, backupRoot, change, touched) {
  const target = path.join(rootDir, change.relativePath);
  const backup = path.join(backupRoot, change.relativePath);
  const existed = fs.existsSync(target);
  if (existed) {
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.copyFileSync(target, backup);
  }
  touched.push({ backup, existed, relativePath: change.relativePath });
  if (change.action === "remove") {
    fs.rmSync(target, { force: true });
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, change.content);
}

function restoreTransactionalChanges(rootDir, backupRoot, touched) {
  for (const entry of [...touched].reverse()) {
    const target = path.join(rootDir, entry.relativePath);
    if (entry.existed) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(entry.backup, target);
    } else {
      fs.rmSync(target, { force: true });
    }
  }
}

function commitAndPushNormativeUpdate(rootDir, plan) {
  const paths = listChangedNormativePaths(plan);

  if (paths.length === 0) {
    return;
  }

  const upstream = resolveUpstream(rootDir);
  assertNoPendingLocalCommits(rootDir, upstream);
  runGit(rootDir, ["add", "--", ...paths]);

  const staged = runGit(rootDir, ["diff", "--cached", "--name-only"]).stdout
    .trim()
    .split(/\r?\n/u)
    .filter(Boolean)
    .map(toPosixPath);
  const allowed = new Set(paths.map(toPosixPath));
  const invalid = staged.filter((entry) => !allowed.has(entry));

  if (invalid.length > 0) {
    throw new Error(`Staging normativo contem path proibido: ${invalid.join(", ")}`);
  }

  if (staged.length === 0) {
    return;
  }

  runGit(rootDir, ["commit", "-m", `ajuste: sincroniza governanca ${plan.source.ref}`]);

  if (upstream) {
    runGit(rootDir, ["push"]);
  } else {
    runGit(rootDir, ["push", "-u", "origin", currentBranchName(rootDir)]);
  }
}

function listChangedNormativePaths(plan) {
  return plan.changes
    .filter((change) => change.action !== "unchanged")
    .map((change) => toPosixPath(change.relativePath));
}

function resolveUpstream(rootDir) {
  const upstream = childProcess.spawnSync("git", [
    "-C",
    rootDir,
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{u}",
  ], {
    encoding: "utf8",
  });

  if (upstream.status !== 0) {
    return "";
  }

  return upstream.stdout.trim();
}

function assertNoPendingLocalCommits(rootDir, upstream) {
  if (!upstream) {
    return;
  }

  const count = runGit(rootDir, ["rev-list", "--count", `${upstream}..HEAD`]).stdout.trim();

  if (Number(count) > 0) {
    throw new Error("Ha commits locais pendentes; push normativo exclusivo bloqueado.");
  }
}

function currentBranchName(rootDir) {
  return runGit(rootDir, ["branch", "--show-current"]).stdout.trim();
}

function runGit(rootDir, args) {
  const result = childProcess.spawnSync("git", ["-C", rootDir, ...args], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} falhou: ${result.stderr || result.stdout}`);
  }

  return result;
}

function printPlan(plan, mode) {
  console.log(`agent:autoupdate ${mode}: ${plan.source.label}`);

  for (const change of plan.changes) {
    if (change.action !== "unchanged") {
      console.log(`${change.action}: ${toPosixPath(change.relativePath)}`);
    }
  }

  if (!plan.changed) {
    console.log("sem alteracoes normativas");
  } else if (mode === "dry-run") {
    console.log(`commit/push normativo previsto para: ${listChangedNormativePaths(plan).join(", ")}`);
  }
}

function safeRelativePath(value) {
  const normalized = path.normalize(String(value || ""));

  if (!normalized || path.isAbsolute(normalized) || normalized.startsWith("..") || normalized.includes(`..${path.sep}`)) {
    throw new Error(`Path normativo inseguro: ${value}`);
  }

  return normalized;
}

function resolveCaseInsensitiveFile(dirPath, name) {
  const expected = String(name || "").toLocaleLowerCase("en-US");
  const entry = fs.readdirSync(dirPath, { withFileTypes: true })
    .find((candidate) => candidate.isFile() && candidate.name.toLocaleLowerCase("en-US") === expected);
  if (!entry) {
    throw new Error(`Arquivo normativo remoto ausente: ${name}`);
  }
  return path.join(dirPath, entry.name);
}

function readUpdateLock(rootDir) {
  const lockPath = path.join(rootDir, LOCK_FILE);

  if (!fs.existsSync(lockPath)) {
    return null;
  }

  const raw = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  return isCurrentLock(raw) ? raw : convertLegacyLock(raw);
}

function createUpdateLock(source, remoteFiles) {
  return {
    format: FORMAT,
    files: Object.fromEntries(remoteFiles.map((entry) => [
      toPosixPath(entry.relativePath),
      hashBuffer(entry.content),
    ])),
    managedFiles: remoteFiles.map((entry) => ({ path: toPosixPath(entry.relativePath) })),
    marker: MARKER,
    schema: VERSION,
    source: {
      label: source.label,
      ref: source.ref,
      type: source.type,
      url: `${SOURCE_OWNER}/${SOURCE_REPO}`,
    },
    updatedAt: new Date().toISOString(),
  };
}

function listFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const result = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      result.push(...listFiles(entryPath));
    } else if (entry.isFile()) {
      result.push(entryPath);
    }
  }

  return result;
}

function defaultHttpClient(url, options = {}, redirectCount = 0) {
  if (redirectCount > 5) {
    return Promise.reject(new Error(`Redirecionamentos demais: ${url}`));
  }

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      headers: {
        Accept: options.binary ? "*/*" : "application/vnd.github+json",
        "User-Agent": "agents-update",
      },
      timeout: 30000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        resolve(defaultHttpClient(new URL(res.headers.location, url).toString(), options, redirectCount + 1));
        return;
      }

      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        resolve({
          body: Buffer.concat(chunks),
          headers: res.headers,
          statusCode: res.statusCode || 0,
        });
      });
    });

    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error(`Tempo esgotado: ${url}`)));
    req.end();
  });
}

function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function hashTextContent(buffer) {
  return hashBuffer(Buffer.from(buffer.toString("utf8").replace(/\r\n/gu, "\n"), "utf8"));
}

function toPosixPath(value) {
  return String(value || "").split(path.sep).join("/");
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`Falha ao atualizar governanca operacional: ${err.message}`);
    process.exitCode = err instanceof UsageError ? 2 : 1;
  });
}

function isLocalExtensionPath(value) {
  const relative = toPosixPath(value).replace(/^\.\//u, "");
  return relative.startsWith(".agents/hooks/") || relative.startsWith(".agents/local/");
}

module.exports = {
  applyPlan,
  buildUpdatePlan,
  collectRemoteGovernanceFiles,
  compareRemoteFiles,
  assertNoUnmanagedCollisions,
  githubCliJsonResponse,
  hashTextContent,
  isRecognizedLegacyGovernanceFile,
  isLocalExtensionPath,
  parseGovernanceManifest,
  help,
  main,
  mergePackageManifest,
  normalizeGovernanceRelativePath,
  parseArgs,
  resolveRemoteSource,
  resolveCaseInsensitiveFile,
};
