// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const https = require("https");
const path = require("path");

const { createZipFromDirectory, extractZip } = require("./archive");
const { compareDistributionMaps, findInstalledDistributionMap, readDistributionMap } = require("./distribution-map");
const { applyTemplate } = require("./template-merge");
const { assertRepositoryGit, assertRepositoryTarget, resolveRepositoryBoundary } = require("./repository-boundary");
const { FORMAT, MARKER, VERSION, convertLegacyLock, isCurrentLock } = require("../../update/migrations/v1-to-v2");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const LOCK_FILE = path.join(".ia.rules", "agents-update.lock.json");
const GITIGNORE_RELATIVE_PATH = ".gitignore";
const HANDOFF_FORMAT = "agents-update-handoff/v1";
const HANDOFF_PHASE = "release-runtime-ready";
const HANDOFF_RUNTIME_FORMAT = "agents-update-runtime/v1";
const HANDOFF_STATE_ENV = "AGENTS_UPDATE_HANDOFF_STATE";
const HANDOFF_KEY_ENV = "AGENTS_UPDATE_HANDOFF_KEY";
const LEGACY_UPDATE_BRIDGE_CONDITION = "legacy-update-bridge";
const MANAGED_EXTENSIONS = new Set([".js", ".json", ".md", ".py", ".ts", ".txt", ".yml", ".yaml"]);
const PACKAGE_RELATIVE_PATH = "package.json";
const REPOSITORY_BOUNDARIES = new Map();
const BOOTSTRAP_MANAGED = new Set([
  "AGENTS.md",
  ".ia.rules/core/contracts.md",
  ".ia.rules/core/concepts/microconceitos.md",
  ".ia.rules/core/update/scenario.md",
  ".ia.rules/scenarios/web/page-like/scenario.md",
]);
const LEGACY_MANAGED_FILES = new Set([
  ".agents/package.json",
  ".agents/.autoupdate.md",
  ".agents/agents-update.lock.json",
  ".agents/core/contracts.md",
  ".agents/core/concepts/microconceitos.md",
  ".agents/core/runtime/scripts/autoupdate.js",
  ".agents/core/runtime/scripts/autoupdate.ts",
  ".agents/core/update/scenario.md",
  ".agents/scenarios/web/page-like/scenario.md",
  ".agents/microconceitos.md",
  ".agents/publish.md",
  ".agents/release.md",
  ".agents/webPageLike.md",
  "scripts/.agents/autoupdate.js",
  "scripts/.agents/autoupdate.ts",
  "scripts/.agents/bootstrap/core/concepts/microconceitos.md",
  "scripts/.agents/bootstrap/core/contracts.md",
  "scripts/.agents/bootstrap/core/update/scenario.md",
  "scripts/.agents/bootstrap/scenarios/web/page-like/scenario.md",
  "scripts/.agents/generate-agents-status.js",
  "scripts/.agents/package.json",
  "scripts/.agents/release-hooks.js",
  "scripts/.agents/release-workflow.js",
  "scripts/.agents/repo-tools.js",
  "scripts/.agents/to-ia.js",
  "scripts/.agents/update-agents.js",
  "scripts/.ia.rules/generate-agents-status.js",
  "scripts/.ia.rules/release-hooks.js",
  "scripts/.ia.rules/release-workflow.js",
  "scripts/.ia.rules/repo-tools.js",
  "scripts/.ia.rules/to-ia.js",
  "scripts/.ia.rules/update-agents.js",
  "scripts/lib/archive.js",
]);
const RECOVERABLE_HANDOFF_RUNTIME = [
  ".ia.rules/core/runtime/scripts/update-agents.js",
  ".ia.rules/core/runtime/scripts/repository-boundary.js",
  ".ia.rules/core/runtime/scripts/archive.js",
  ".ia.rules/core/runtime/scripts/distribution-map.js",
  ".ia.rules/core/runtime/scripts/template-merge.js",
  ".ia.rules/core/update/migrations/v1-to-v2.js",
];
const LEGACY_MANAGED_ROOTS = [
  ".agents/core",
  ".agents/meta",
  ".agents/resources",
  ".agents/roles",
  ".agents/runtime",
  ".agents/scenarios",
  ".agents/workflows",
];

/** Representa entrada inválida do atualizador sem executar alteração parcial no destino. */
class UsageError extends Error {}

/** Executa main no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
async function main(argv = process.argv.slice(2), options = {}) {
  const handoffStatePath = options.handoffStatePath || process.env[HANDOFF_STATE_ENV];
  if (handoffStatePath) {
    return resumeFromHandoff(handoffStatePath, options);
  }
  const parsed = parseArgs(argv);
  if (parsed.help) {
    console.log(help());
    return { help: true };
  }
  const rootDir = options.rootDir || ROOT_DIR;
  const httpClient = options.httpClient || defaultHttpClient;
  if (options.disableHandoff) {
    const plan = await buildUpdatePlan(rootDir, httpClient, options);
    return executeUpdatePlan(parsed, rootDir, plan);
  }
  return handoffToReleaseRuntime(argv, rootDir, httpClient, options);
}

/** Executa executeUpdatePlan no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function executeUpdatePlan(parsed, rootDir, plan) {

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

  const backupPath = backupDivergentManagedFiles(rootDir, plan);
  if (backupPath) {
    console.log(`Backup de divergencias locais: ${backupPath}`);
  }
  const migratedExtensions = applyLegacyExtensionMigrations(rootDir, plan.extensionMigrations || []);
  for (const migration of migratedExtensions) {
    console.log(`Extensao legada preservada: ${migration.source} -> ${migration.target}`);
  }
  applyPlan(rootDir, plan);
  commitAndPushNormativeUpdate(rootDir, plan);
  console.log(`Governanca operacional atualizada de ${plan.source.label}.`);
  return plan;
}

/** Executa parseArgs no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function parseArgs(argv = []) {
  const parsed = { check: false, dryRun: false, force: false, help: false };
  for (const original of argv) {
    // Compatibilidade: wrappers npm antigos removiam o prefixo somente destes quatro modos conhecidos.
    const value = ["check", "dry-run", "force", "help"].includes(original) ? `--${original}` : original;
    if (value === "--check") parsed.check = true;
    else if (value === "--dry-run") parsed.dryRun = true;
    else if (value === "--force") parsed.force = true;
    else if (value === "--help") parsed.help = true;
    else throw new UsageError(`PARAMETRO_INVALIDO:${value}`);
  }
  return parsed;
}

/** Executa help no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function help() {
  return "Uso: update:agents [--check|--dry-run] [--force] [--help]";
}

/** Executa handoffToReleaseRuntime no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
async function handoffToReleaseRuntime(argv, targetRoot, httpClient, options = {}) {
  const prepared = await prepareReleaseHandoff(targetRoot, httpClient, { ...options, argv });
  try {
    const env = { ...process.env, [HANDOFF_KEY_ENV]: prepared.key, [HANDOFF_STATE_ENV]: prepared.statePath };
    delete env.NODE_PATH;
    const spawn = options.spawnRuntime || childProcess.spawnSync;
    const result = spawn(process.execPath, [prepared.entryPath, ...argv], {
      cwd: targetRoot,
      env,
      encoding: "utf8",
      stdio: options.captureRuntime ? "pipe" : "inherit",
      windowsHide: true,
    });
    if (result.error) throw new Error(`Falha ao iniciar runtime da release: ${result.error.message}`);
    if (result.status !== 0) {
      const detail = options.captureRuntime ? String(result.stderr || result.stdout || "").trim() : "";
      throw new Error(`Runtime da release falhou com codigo ${result.status}${detail ? `: ${detail}` : "."}`);
    }
    return { handoff: true, source: prepared.payload.source, status: result.status };
  } finally {
    fs.rmSync(prepared.handoffRoot, { force: true, recursive: true });
  }
}

/** Executa prepareReleaseHandoff no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
async function prepareReleaseHandoff(targetRoot, httpClient = defaultHttpClient, options = {}) {
  const canonicalTarget = realDirectory(targetRoot, "targetRoot");
  const source = await resolveRemoteSource(httpClient, canonicalTarget, options);
  const archive = await httpClient(source.archiveUrl, { binary: true });
  assertArchiveResponse(archive, source);
  const handoffCache = assertRepositoryTarget(repositoryBoundary(canonicalTarget), path.join(".ia.rules", "cache", "update-handoff"), { allowHardlink: true });
  fs.mkdirSync(handoffCache, { recursive: true });
  const handoffRoot = fs.mkdtempSync(path.join(handoffCache, "run-"));
  const releaseContainer = path.join(handoffRoot, "release");
  fs.mkdirSync(releaseContainer, { recursive: true });
  try {
    extractZip(archive.body, releaseContainer);
    const remoteRoot = discoverRemoteRoot(releaseContainer);
    const runtime = resolveReleaseRuntime(remoteRoot, releaseContainer);
    if (runtime.recovery) console.warn(`Handoff recuperado: ${runtime.recovery}`);
    const key = crypto.randomBytes(32).toString("hex");
    const statePath = path.join(handoffRoot, "handoff-state.json");
    const payload = {
      argv: Array.isArray(options.argv) ? options.argv.map(String) : [],
      entryPath: runtime.entryPath,
      format: HANDOFF_FORMAT,
      governanceRoot: fs.realpathSync(remoteRoot),
      phase: HANDOFF_PHASE,
      releaseRoot: fs.realpathSync(releaseContainer),
      runtimeHashes: runtime.runtimeHashes,
      schema: 1,
      source,
      targetRoot: canonicalTarget,
    };
    const state = signHandoffPayload(payload, key);
    fs.writeFileSync(statePath, `${JSON.stringify(state)}\n`, { encoding: "utf8", mode: 0o600 });
    return { entryPath: runtime.entryPath, handoffRoot, key, payload, statePath };
  } catch (error) {
    fs.rmSync(handoffRoot, { force: true, recursive: true });
    throw error;
  }
}

/** Executa resolveReleaseRuntime no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function resolveReleaseRuntime(remoteRoot, releaseRoot = remoteRoot) {
  const source = discoverGovernanceManifest(remoteRoot);
  const descriptor = source.raw && source.raw.handoff;
  try {
    if (!descriptor || descriptor.format !== HANDOFF_RUNTIME_FORMAT || descriptor.schema !== 1 ||
      !Array.isArray(descriptor.files) || descriptor.files.length === 0 || !descriptor.files.includes(descriptor.entry)) {
      throw new Error("Release sem descritor de runtime de handoff valido.");
    }
    const declared = new Map(source.manifest.files.map((entry) => [toPosixPath(safeRelativePath(entry.path)), entry]));
    const runtimeHashes = {};
    let entryPath = "";
    for (const value of descriptor.files) {
      const target = toPosixPath(safeRelativePath(value));
      const manifestEntry = declared.get(target);
      if (!manifestEntry || !manifestEntry.sha256) throw new Error(`Runtime de handoff nao manifestado: ${target}`);
      const origin = safeRelativePath(manifestEntry.source || manifestEntry.path);
      const absolute = path.join(source.baseRoot, origin);
      if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) throw new Error(`Runtime de handoff ausente: ${target}`);
      const actualHash = hashTextContent(fs.readFileSync(absolute));
      if (actualHash !== String(manifestEntry.sha256).toLocaleLowerCase("en-US")) throw new Error(`Runtime de handoff divergente: ${target}`);
      if (!isPathInside(releaseRoot, absolute)) throw new Error(`Runtime fora da release: ${target}`);
      runtimeHashes[toPosixPath(path.relative(releaseRoot, absolute))] = actualHash;
      if (target === descriptor.entry) entryPath = fs.realpathSync(absolute);
    }
    if (!entryPath) throw new Error("Entrypoint de handoff ausente.");
    return { entryPath, runtimeHashes };
  } catch (error) {
    if (/divergente|fora da release/iu.test(String(error.message || ""))) throw error;
    return reconstructReleaseRuntime(source.baseRoot, releaseRoot, error.message);
  }
}

/** Reconstrói somente o runtime transitivo canônico existente no mesmo artefato fixado, sem executar código remoto adicional. */
function reconstructReleaseRuntime(baseRoot, releaseRoot, reason) {
  const runtimeHashes = {};
  let entryPath = "";
  for (const relativePath of RECOVERABLE_HANDOFF_RUNTIME) {
    const absolute = path.join(baseRoot, safeRelativePath(relativePath));
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile() || !isPathInside(releaseRoot, absolute)) {
      throw new Error(`${reason} Recuperacao de handoff indisponivel: ${relativePath}`);
    }
    const actualHash = hashTextContent(fs.readFileSync(absolute));
    runtimeHashes[toPosixPath(path.relative(releaseRoot, absolute))] = actualHash;
    if (relativePath === RECOVERABLE_HANDOFF_RUNTIME[0]) entryPath = fs.realpathSync(absolute);
  }
  return { entryPath, recovery: "runtime-canônico reconstruído do artefato fixado", runtimeHashes };
}

/** Executa resumeFromHandoff no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function resumeFromHandoff(statePath, options = {}) {
  const key = options.handoffKey || process.env[HANDOFF_KEY_ENV];
  const payload = verifyHandoffState(statePath, key, options.currentScript || __filename);
  delete process.env[HANDOFF_KEY_ENV];
  delete process.env[HANDOFF_STATE_ENV];
  const parsed = parseArgs(payload.argv || []);
  const remoteFiles = collectRemoteGovernanceFiles(payload.governanceRoot);
  const previousLock = readUpdateLock(payload.targetRoot);
  const changes = compareRemoteFiles(payload.targetRoot, remoteFiles, previousLock);
  const distributionTransition = planDistributionTransition(payload.targetRoot, payload.governanceRoot);
  const extensionMigrations = planLegacyExtensionMigrations(payload.targetRoot, remoteFiles);
  const lock = createUpdateLock(payload.source, remoteFiles, changes);
  if (distributionTransition) lock.distributionMap = distributionTransition;
  const plan = {
    changed: changes.some((change) => change.action !== "unchanged") || extensionMigrations.length > 0,
    changes,
    distributionTransition,
    extensionMigrations,
    remoteRoot: payload.releaseRoot,
    source: payload.source,
    lock,
  };
  return executeUpdatePlan(parsed, payload.targetRoot, plan);
}

/** Executa verifyHandoffState no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function verifyHandoffState(statePath, key, currentScript = __filename) {
  if (!key || !/^[a-f0-9]{64}$/iu.test(String(key))) throw new Error("Chave efemera de handoff ausente ou invalida.");
  const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  if (!state || !state.payload || !state.mac) throw new Error("Estado de handoff invalido.");
  const expected = handoffMac(state.payload, key);
  const actual = Buffer.from(String(state.mac), "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (actual.length !== expectedBuffer.length || !crypto.timingSafeEqual(actual, expectedBuffer)) throw new Error("HMAC do handoff divergente.");
  const payload = state.payload;
  if (payload.format !== HANDOFF_FORMAT || payload.schema !== 1 || payload.phase !== HANDOFF_PHASE) throw new Error("Protocolo ou fase de handoff invalida.");
  const releaseRoot = realDirectory(payload.releaseRoot, "releaseRoot");
  const governanceRoot = realDirectory(payload.governanceRoot, "governanceRoot");
  const targetRoot = realDirectory(payload.targetRoot, "targetRoot");
  if (releaseRoot === targetRoot || isPathInside(releaseRoot, targetRoot)) throw new Error("Roots de release e target nao estao segregados.");
  if (isPathInside(targetRoot, releaseRoot)) {
    const authorizedCache = path.join(targetRoot, ".ia.rules", "cache", "update-handoff");
    if (!isPathInside(authorizedCache, releaseRoot)) throw new Error("Release de handoff aninhada fora do cache autorizado.");
  }
  const canonicalState = fs.realpathSync(statePath);
  if (!isPathInside(path.dirname(canonicalState), releaseRoot)) throw new Error("Estado e release nao pertencem ao mesmo handoff temporario.");
  if (!isPathInside(releaseRoot, governanceRoot)) throw new Error("Raiz de governanca fora da release.");
  const entryPath = fs.realpathSync(payload.entryPath);
  if (entryPath !== fs.realpathSync(currentScript) || !isPathInside(releaseRoot, entryPath)) throw new Error("Entrypoint executado nao corresponde ao runtime da release.");
  for (const [relativePath, expectedHash] of Object.entries(payload.runtimeHashes || {})) {
    const absolute = path.join(releaseRoot, safeRelativePath(relativePath));
    if (!isPathInside(releaseRoot, absolute) || !fs.existsSync(absolute) || hashTextContent(fs.readFileSync(absolute)) !== expectedHash) {
      throw new Error(`Runtime alterado apos handoff: ${relativePath}`);
    }
  }
  return { ...payload, entryPath, governanceRoot, releaseRoot, targetRoot };
}

/** Executa signHandoffPayload no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function signHandoffPayload(payload, key) {
  return { mac: handoffMac(payload, key), payload };
}

/** Executa handoffMac no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function handoffMac(payload, key) {
  return crypto.createHmac("sha256", Buffer.from(String(key), "hex")).update(JSON.stringify(payload), "utf8").digest("hex");
}

/** Executa assertArchiveResponse no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertArchiveResponse(response, source) {
  if (!response || response.statusCode < 200 || response.statusCode >= 300 || !Buffer.isBuffer(response.body) || response.body.length === 0) {
    throw new Error(`Download normativo invalido: HTTP ${response && response.statusCode ? response.statusCode : 0}.`);
  }
  if (source.archiveSha256 && hashBuffer(response.body) !== source.archiveSha256) throw new Error("SHA-256 do arquivo de release divergente.");
}

/** Executa realDirectory no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function realDirectory(value, label) {
  const absolute = path.resolve(String(value || ""));
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isDirectory()) throw new Error(`${label} ausente ou invalido.`);
  return fs.realpathSync(absolute);
}

/** Executa isPathInside no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function isPathInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

/** Executa buildUpdatePlan no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
async function buildUpdatePlan(rootDir, httpClient = defaultHttpClient, options = {}) {
  const source = await resolveRemoteSource(httpClient, rootDir, options);
  const archive = await httpClient(source.archiveUrl, { binary: true });
  assertArchiveResponse(archive, source);
  const updateCache = assertRepositoryTarget(repositoryBoundary(rootDir), path.join(".ia.rules", "cache", "update-plan"), { allowHardlink: true });
  fs.mkdirSync(updateCache, { recursive: true });
  const tempRoot = fs.mkdtempSync(path.join(updateCache, "run-"));

  try {
    extractZip(archive.body, tempRoot);
    const remoteRoot = discoverRemoteRoot(tempRoot);
    const remoteFiles = collectRemoteGovernanceFiles(remoteRoot);
    const previousLock = readUpdateLock(rootDir);
    const changes = compareRemoteFiles(rootDir, remoteFiles, previousLock);
    const distributionTransition = planDistributionTransition(rootDir, remoteRoot);
    const extensionMigrations = planLegacyExtensionMigrations(rootDir, remoteFiles);
    const lock = createUpdateLock(source, remoteFiles, changes);
    if (distributionTransition) lock.distributionMap = distributionTransition;

    return {
      changed: changes.some((change) => change.action !== "unchanged") || extensionMigrations.length > 0,
      changes,
      distributionTransition,
      extensionMigrations,
      remoteRoot,
      source,
      lock,
    };
  } finally {
    fs.rmSync(tempRoot, { force: true, recursive: true });
  }
}

/** Executa resolveRemoteSource no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
async function resolveRemoteSource(httpClient = defaultHttpClient, rootDir = ROOT_DIR, options = {}) {
  const source = resolveConfiguredUpstream(rootDir, options.upstreamRepository || "");
  const sourceApi = `https://api.github.com/repos/${source.repository}`;
  const latest = await requestJsonAllow404(httpClient, `${sourceApi}/releases/latest`);

  if (latest && latest.statusCode !== 404) {
    const asset = selectReleaseZipAsset(latest.json);
    return {
      archiveUrl: asset ? asset.browser_download_url : latest.json.zipball_url,
      archiveSha256: asset && /^sha256:[a-f0-9]{64}$/iu.test(String(asset.digest || "")) ? String(asset.digest).slice(7).toLocaleLowerCase("en-US") : "",
      label: `release:${latest.json.tag_name || "latest"}`,
      repository: source.repository,
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
        archiveSha256: "",
        label: `branch:${branch}:${sha}`,
        repository: source.repository,
        ref: sha,
        type: "branch",
      };
    }
  }

  throw new Error(`Nenhuma release latest ou branch main/master encontrada para AGENTS em ${source.repository}.`);
}

/** Executa resolveConfiguredUpstream no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function resolveConfiguredUpstream(rootDir, fallbackRepository = "") {
  const packagePath = path.join(rootDir, "package.json");
  const localPath = path.join(rootDir, ".ia.rules", "core", "update", "upstream.json");
  const legacyLocalPath = path.join(rootDir, ".ia.rules", "upstream.json");
  const packageConfig = fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath, "utf8"))["agentsUpstream"] || {} : {};
  const localConfig = fs.existsSync(localPath) ? JSON.parse(fs.readFileSync(localPath, "utf8")) :
    (fs.existsSync(legacyLocalPath) ? JSON.parse(fs.readFileSync(legacyLocalPath, "utf8")) : {});
  const config = { ...packageConfig, ...localConfig };
  const repository = String(config.upstreamRepository || fallbackRepository || "").trim();
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(repository)) {
    throw new Error("UPSTREAM_AGENTS_NAO_RESOLVIDO: configure agentsUpstream.upstreamRepository.");
  }
  return { repository, source: localConfig.upstreamRepository ? "local" : (packageConfig.upstreamRepository ? "package" : "bridge") };
}

/** Executa requestJsonAllow404 no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa githubCliJsonResponse no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa selectReleaseZipAsset no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa discoverRemoteRoot no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa scoreAgentsPath no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function scoreAgentsPath(filePath) {
  const rel = toPosixPath(filePath).toLocaleLowerCase("en-US");

  if (rel.toLocaleLowerCase("en-US").endsWith("/src/agents.md")) {
    return "0";
  }

  return `${String(rel.split("/").length).padStart(4, "0")}:${rel}`;
}

/** Executa planDistributionTransition no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function planDistributionTransition(targetRoot, remoteRoot) {
  const currentMap = findRemoteDistributionMap(remoteRoot);
  if (!currentMap) throw new Error("MAPA_DISTRIBUICAO_RELEASE_AUSENTE");
  let previousMap = null;
  const diagnostics = [];
  try {
    previousMap = findInstalledDistributionMap(targetRoot);
  } catch (error) {
    // PROTECAO: mapa local anterior corrompido nao bloqueia convergencia para release valida.
    diagnostics.push({ code: "MAPA_DISTRIBUICAO_LOCAL_IGNORADO", message: error.message });
  }
  return {
    diagnostics,
    failSafe: diagnostics.length > 0 || !previousMap,
    format: currentMap.format,
    path: currentMap.self,
    plan: compareDistributionMaps(previousMap, currentMap, targetRoot),
    version: currentMap.version,
  };
}

/** Executa findRemoteDistributionMap no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function findRemoteDistributionMap(remoteRoot) {
  const releasePath = path.join(remoteRoot, "release.json");
  if (fs.existsSync(releasePath)) {
    const release = JSON.parse(fs.readFileSync(releasePath, "utf8"));
    const declared = release.distributionMap && release.distributionMap.path;
    if (declared) {
      const mapPath = path.join(remoteRoot, safeRelativePath(declared));
      if (fs.existsSync(mapPath)) return readDistributionMap(mapPath);
    }
  }
  const distributionRoot = path.join(remoteRoot, ".ia.rules", "distribution");
  if (!fs.existsSync(distributionRoot)) return null;
  const candidates = fs.readdirSync(distributionRoot)
    .filter((name) => /^distribution-map-.+\.json$/u.test(name))
    .sort((a, b) => b.localeCompare(a, "en"));
  return candidates.length ? readDistributionMap(path.join(distributionRoot, candidates[0])) : null;
}

/** Executa collectRemoteGovernanceFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function collectRemoteGovernanceFiles(remoteRoot) {
  const source = discoverGovernanceManifest(remoteRoot);
  const files = new Map();
  for (const entry of source.manifest.files) {
    // O bridge existe no asset para coletores anteriores ao handoff, mas não integra o estado canônico final.
    if (entry.condition === LEGACY_UPDATE_BRIDGE_CONDITION) continue;
    const target = safeRelativePath(entry.path);
    if (isLocalExtensionPath(target) || toPosixPath(target).toLocaleLowerCase("en-US") === "agents.local.md") {
      throw new Error(`Manifesto remoto inclui extensao local: ${toPosixPath(target)}`);
    }
    const origin = safeRelativePath(entry.source || entry.path);
    addRemoteFile(files, source.baseRoot, origin, target, entry.kind || (target === PACKAGE_RELATIVE_PATH ? "package" : "file"), entry.sha256, entry);
  }
  assertRequiredManagedFiles(files);
  return [...files.values()];
}

/** Executa discoverGovernanceManifest no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function discoverGovernanceManifest(remoteRoot) {
  const candidates = [
    { baseRoot: remoteRoot, filePath: path.join(remoteRoot, "release.json"), label: "release.json" },
    { baseRoot: path.dirname(remoteRoot), filePath: path.join(path.dirname(remoteRoot), "index.json"), label: "index.json" },
  ];
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate.filePath)) continue;
    const raw = JSON.parse(fs.readFileSync(candidate.filePath, "utf8"));
    return { ...candidate, manifest: parseGovernanceManifest(raw, candidate.label), raw };
  }
  throw new Error("Manifesto remoto de atualizacao ausente.");
}

/** Executa parseGovernanceManifest no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function parseGovernanceManifest(raw, label) {
  const declared = raw && (raw.canonicalUpdate || raw.update);
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

/** Executa validateGovernanceManifest no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa assertRequiredManagedFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertRequiredManagedFiles(files) {
  for (const required of BOOTSTRAP_MANAGED) {
    if (!files.has(required)) throw new Error(`Manifesto remoto incompleto: ${required}`);
  }
}

/** Executa discoverReferencedMarkdown no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function discoverReferencedMarkdown(content) {
  const result = [];
  const pattern = /\]\((\.\/[^)#]+\.md)(?:#[^)]+)?\)/giu;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    result.push(match[1]);
  }

  return result;
}

/** Executa normalizeGovernanceRelativePath no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function normalizeGovernanceRelativePath(value) {
  const normalized = toPosixPath(value).replace(/^\.\//u, "");

  if (normalized.startsWith("agents/")) {
    return `.ia.rules/${normalized.slice("agents/".length)}`;
  }

  return normalized;
}

/** Executa addRemoteFile no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function addRemoteFile(files, remoteRoot, relativePath, targetRelativePath = relativePath, kind = "file", expectedHash = "", descriptor = {}) {
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
    descriptor,
    kind,
    relativePath: safeRelativePath(targetRelativePath),
  });
}

/** Executa compareRemoteFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function compareRemoteFiles(rootDir, remoteFiles, previousLock = null) {
  const changes = [];
  const remotePaths = new Set(remoteFiles.map((entry) => toPosixPath(entry.relativePath)));

  for (const entry of remoteFiles) {
    const localPath = path.join(rootDir, entry.relativePath);
    const localContent = fs.existsSync(localPath) ? fs.readFileSync(localPath) : null;
    const applied = resolveManagedContent(entry, localContent);
    const committedBase = readGitBlob(rootDir, `HEAD:${toPosixPath(entry.relativePath)}`);
    const indexedBase = readGitBlob(rootDir, `:${toPosixPath(entry.relativePath)}`);
    const committed = resolveManagedContent(entry, committedBase || localContent);
    const indexed = resolveManagedContent(entry, indexedBase || committedBase || localContent);
    const content = applied.content;
    const same = localContent && hashTextContent(localContent) === hashTextContent(content);
    const committedSame = committedBase && hashTextContent(committedBase) === hashTextContent(committed.content);
    changes.push({
      action: same && committedSame ? "unchanged" : localContent ? "update" : "add",
      commitContent: committed.content,
      content,
      indexContent: indexed.content,
      kind: entry.kind,
      remoteContent: entry.content,
      remoteDescriptor: entry.descriptor,
      relativePath: entry.relativePath,
      rollback: applied.rollback,
    });
  }

  for (const localRel of listManagedCleanupPaths(rootDir, previousLock, remotePaths)) {
    if (toPosixPath(localRel) !== toPosixPath(LOCK_FILE) && toPosixPath(localRel) !== PACKAGE_RELATIVE_PATH &&
      !remotePaths.has(toPosixPath(localRel)) && fs.existsSync(path.join(rootDir, localRel))) {
      changes.push({
        action: "remove",
        commitContent: null,
        indexContent: null,
        relativePath: localRel,
      });
    }
  }

  return changes.sort((a, b) => toPosixPath(a.relativePath).localeCompare(toPosixPath(b.relativePath), "en"));
}

/** Executa resolveManagedContent no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function resolveManagedContent(entry, localContent) {
  if (entry.kind === "package" && localContent) return { content: mergePackageManifest(localContent, entry.content) };
  if (entry.kind === "template") {
    const descriptor = entry.descriptor || {};
    const result = applyTemplate(localContent || Buffer.from(""), entry.content, {
      id: descriptor.templateId || toPosixPath(entry.relativePath).replace(/[^a-z0-9_.-]+/giu, "-"),
      path: entry.relativePath,
      target: entry.relativePath,
      type: descriptor.templateType,
      version: descriptor.templateVersion,
    });
    return { content: result.content, rollback: result.rollback };
  }
  return { content: entry.content };
}

/** Executa listPreviouslyManagedFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function listPreviouslyManagedFiles(lock) {
  if (!lock || !Array.isArray(lock.managedFiles)) {
    return [];
  }

  return lock.managedFiles.map((entry) => safeRelativePath(entry.path || entry.relativePath || entry));
}

/** Executa listManagedCleanupPaths no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function listManagedCleanupPaths(rootDir, lock, remotePaths = new Set()) {
  return [...new Set([
    ...BOOTSTRAP_MANAGED,
    ...LEGACY_MANAGED_FILES,
    ...listLegacyManagedTreeFiles(rootDir).filter((relativePath) => {
      const normalized = toPosixPath(relativePath);
      if (!normalized.startsWith(".agents/")) return false;
      return remotePaths.has(`.ia.rules/${normalized.slice(".agents/".length)}`);
    }),
    ...listPreviouslyManagedFiles(lock),
  ])].filter((relativePath) => !isLocalExtensionPath(relativePath) && toPosixPath(relativePath).toLocaleLowerCase("en-US") !== "agents.local.md");
}

/** Lê uma camada Git sem alterar index ou worktree; ausência legítima retorna null. */
function readGitBlob(rootDir, spec) {
  assertRepositoryGit(repositoryBoundary(rootDir), ["show", spec]);
  const result = childProcess.spawnSync("git", ["-C", rootDir, "show", spec], { encoding: null, windowsHide: true });
  return result.status === 0 ? Buffer.from(result.stdout) : null;
}

/** Varre namespaces estruturais que eram integralmente gerenciados antes de .ia.rules. */
function listLegacyManagedTreeFiles(rootDir) {
  const result = [];
  for (const relativeRoot of LEGACY_MANAGED_ROOTS) {
    const absoluteRoot = path.join(rootDir, relativeRoot);
    if (!fs.existsSync(absoluteRoot) || !fs.statSync(absoluteRoot).isDirectory()) continue;
    const pending = [absoluteRoot];
    while (pending.length > 0) {
      const current = pending.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const absolute = path.join(current, entry.name);
        if (entry.isDirectory()) {
          pending.push(absolute);
        } else if (entry.isFile() && MANAGED_EXTENSIONS.has(path.extname(entry.name).toLocaleLowerCase("en-US"))) {
          result.push(toPosixPath(path.relative(rootDir, absolute)));
        }
      }
    }
  }
  return result.sort((a, b) => a.localeCompare(b, "en"));
}

/** Planeja a realocação conservativa de extensões reconhecidas em raízes predecessoras. */
function planLegacyExtensionMigrations(rootDir, remoteFiles = []) {
  const remotePaths = new Set(remoteFiles.map((entry) => toPosixPath(entry.relativePath)));
  const roots = [
    [".agents/hooks", ".ia.rules/hooks"],
    [".agents/local", ".ia.rules/local"],
    ["scripts/.agents/hooks", ".ia.rules/hooks"],
    ["scripts/.agents/local", ".ia.rules/local"],
  ];
  const candidates = [];
  for (const [sourceRoot, targetRoot] of roots) {
    const absoluteSource = path.join(rootDir, sourceRoot);
    if (!fs.existsSync(absoluteSource) || !fs.statSync(absoluteSource).isDirectory()) continue;
    for (const source of listTreeFiles(absoluteSource)) {
      const suffix = toPosixPath(path.relative(absoluteSource, source));
      candidates.push({ source: toPosixPath(path.relative(rootDir, source)), target: toPosixPath(path.posix.join(targetRoot, suffix)) });
    }
  }
  for (const source of [".agents/agents.local.md", "scripts/.agents/agents.local.md"]) {
    if (fs.existsSync(path.join(rootDir, source)) && fs.statSync(path.join(rootDir, source)).isFile()) {
      candidates.push({ source, target: "agents.local.md" });
    }
  }
  for (const source of listLegacyManagedTreeFiles(rootDir)) {
    const normalized = toPosixPath(source);
    const canonical = normalized.startsWith(".agents/") ? `.ia.rules/${normalized.slice(".agents/".length)}` : "";
    if (!canonical || remotePaths.has(canonical) || LEGACY_MANAGED_FILES.has(normalized)) continue;
    candidates.push({ source: normalized, target: `.ia.rules/local/inherited/${normalized}` });
  }

  const uniqueBySource = new Map();
  for (const entry of candidates) {
    if (!uniqueBySource.has(entry.source)) uniqueBySource.set(entry.source, entry);
  }
  const unique = [...uniqueBySource.values()];
  return unique.map((entry) => {
    const content = fs.readFileSync(path.join(rootDir, safeRelativePath(entry.source)));
    const intended = path.join(rootDir, safeRelativePath(entry.target));
    let target = entry.target;
    let collision = false;
    if (fs.existsSync(intended) && hashBuffer(fs.readFileSync(intended)) !== hashBuffer(content)) {
      collision = true;
      const inherited = path.posix.join(".ia.rules/local/inherited", entry.source);
      target = `${inherited}.${hashBuffer(content).slice(0, 12)}`;
    }
    const targetPath = path.join(rootDir, safeRelativePath(target));
    if (fs.existsSync(targetPath) && hashBuffer(fs.readFileSync(targetPath)) === hashBuffer(content)) {
      return { ...entry, collision, content, target, targetExists: true };
    }
    return { ...entry, collision, content, target, targetExists: false };
  }).sort((a, b) => a.source.localeCompare(b.source, "en"));
}

/** Lista arquivos regulares sem seguir links; links locais desconhecidos permanecem intocados para classificação. */
function listTreeFiles(rootDir) {
  const files = [];
  const pending = [rootDir];
  while (pending.length) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) pending.push(absolute);
      else if (entry.isFile()) files.push(absolute);
    }
  }
  return files.sort((a, b) => a.localeCompare(b, "en"));
}

/** Aplica migrações locais com rollback em memória e registra origem/hash sem alterar o conteúdo herdado. */
function applyLegacyExtensionMigrations(rootDir, migrations) {
  if (!migrations.length) return [];
  const created = [];
  const removed = [];
  const manifestPath = path.join(rootDir, ".ia.rules", "local", "inherited", "extensions.json");
  const previousManifest = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath) : null;
  try {
    for (const migration of migrations) {
      const source = assertRepositoryTarget(repositoryBoundary(rootDir), safeRelativePath(migration.source), { allowHardlink: true });
      const target = assertRepositoryTarget(repositoryBoundary(rootDir), safeRelativePath(migration.target), { allowHardlink: true });
      if (!migration.targetExists) {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        const temporary = `${target}.agents-update-${process.pid}.tmp`;
        fs.writeFileSync(temporary, migration.content);
        fs.renameSync(temporary, target);
        created.push(target);
      }
      if (hashBuffer(fs.readFileSync(target)) !== hashBuffer(migration.content)) throw new Error(`MIGRACAO_EXTENSAO_DIVERGENTE:${migration.source}`);
      removed.push({ content: migration.content, source });
      fs.rmSync(source, { force: true });
      removeEmptyLegacyParents(rootDir, path.dirname(source));
    }
    const previous = previousManifest ? JSON.parse(previousManifest.toString("utf8")) : { schema: 1, entries: [] };
    const bySource = new Map((Array.isArray(previous.entries) ? previous.entries : []).map((entry) => [entry.source, entry]));
    for (const migration of migrations) {
      bySource.set(migration.source, {
        collision: migration.collision,
        inherited: true,
        sha256: hashBuffer(migration.content),
        source: migration.source,
        target: migration.target,
      });
    }
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, `${JSON.stringify({ schema: 1, entries: [...bySource.values()].sort((a, b) => a.source.localeCompare(b.source, "en")) }, null, 2)}\n`, "utf8");
    return migrations;
  } catch (error) {
    for (const entry of removed.reverse()) {
      fs.mkdirSync(path.dirname(entry.source), { recursive: true });
      fs.writeFileSync(entry.source, entry.content);
    }
    for (const target of created.reverse()) fs.rmSync(target, { force: true });
    if (previousManifest) fs.writeFileSync(manifestPath, previousManifest);
    else fs.rmSync(manifestPath, { force: true });
    throw error;
  }
}

/** Executa backupDivergentManagedFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function backupDivergentManagedFiles(rootDir, plan, options = {}) {
  const previousLock = readUpdateLock(rootDir);
  const divergences = plan.changes.filter((change) => {
    if (change.action === "unchanged" || toPosixPath(change.relativePath) === PACKAGE_RELATIVE_PATH) return false;
    const target = path.join(rootDir, change.relativePath);
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return false;
    const relativePath = toPosixPath(change.relativePath);
    const expectedHash = previousLock && previousLock.files ? previousLock.files[relativePath] : "";
    const content = fs.readFileSync(target);
    const currentHash = MANAGED_EXTENSIONS.has(path.extname(relativePath).toLocaleLowerCase("en-US"))
      ? hashTextContent(content)
      : hashBuffer(content);
    return !expectedHash || currentHash !== expectedHash;
  });

  if (divergences.length === 0) return "";

  const now = options.now instanceof Date ? options.now : new Date();
  const day = now.toISOString().slice(0, 10);
  const instant = now.toISOString().replace(/[-:]/gu, "").replace(/\.\d{3}Z$/u, "Z");
  const repository = sanitizeBackupName(path.basename(rootDir)) || "repository";
  const version = sanitizeBackupName(plan.source && plan.source.ref) || "unknown";
  const backupRoot = options.backupRoot || path.join(rootDir, "agents-governance-backups");
  assertRepositoryTarget(repositoryBoundary(rootDir), backupRoot, { allowHardlink: true });
  const dayRoot = path.join(backupRoot, day);
  const stagingBase = assertRepositoryTarget(repositoryBoundary(rootDir), path.join(backupRoot, ".staging"), { allowHardlink: true });
  fs.mkdirSync(stagingBase, { recursive: true });
  const stagingRoot = fs.mkdtempSync(path.join(stagingBase, "run-"));
  const targetZip = path.join(dayRoot, `agents-update-${repository}-${version}-${instant}.zip`);

  try {
    const manifest = {
      createdAt: now.toISOString(),
      files: divergences.map((change) => ({
        path: toPosixPath(change.relativePath),
        sha256: hashBuffer(fs.readFileSync(path.join(rootDir, change.relativePath))),
      })),
      repositoryRoot: path.resolve(rootDir),
      source: plan.source,
    };
    for (const change of divergences) {
      const source = path.join(rootDir, change.relativePath);
      const destination = path.join(stagingRoot, change.relativePath);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(source, destination);
    }
    fs.writeFileSync(path.join(stagingRoot, "backup-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    createZipFromDirectory(stagingRoot, targetZip);
    return targetZip;
  } finally {
    fs.rmSync(stagingRoot, { force: true, recursive: true });
  }
}

/** Executa sanitizeBackupName no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function sanitizeBackupName(value) {
  return String(value || "").replace(/[^A-Za-z0-9._-]+/gu, "-").replace(/^-+|-+$/gu, "").slice(0, 80);
}

/** Executa mergePackageManifest no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function mergePackageManifest(localContent, remoteContent) {
  const localPackage = parsePackageManifest(localContent, "local");
  const remotePackage = parsePackageManifest(remoteContent, "distribuido");
  const policy = readGovernancePolicy(remotePackage);
  const merged = { ...localPackage };
  const localScripts = localPackage.scripts && typeof localPackage.scripts === "object" ? localPackage.scripts : {};
  const remoteScripts = remotePackage.scripts && typeof remotePackage.scripts === "object" ? remotePackage.scripts : {};
  const previousGovernance = localPackage["agentsGovernance"] && typeof localPackage["agentsGovernance"] === "object"
    ? localPackage["agentsGovernance"]
    : {};
  const previousInstalled = previousGovernance.installedScripts && typeof previousGovernance.installedScripts === "object"
    ? previousGovernance.installedScripts
    : {};
  const installedScripts = {};

  merged.scripts = { ...localScripts };
  for (const [name, command] of Object.entries(remoteScripts)) {
    if (isManagedScriptName(name, policy)) {
      merged.scripts[name] = command;
    }
  }
  for (const name of policy.installableScripts) {
    const remoteCommand = remoteScripts[name];
    if (typeof remoteCommand !== "string") throw new Error(`Script instalavel ausente no pacote distribuido: ${name}.`);
    const localCommand = localScripts[name];
    const previousHash = String(previousInstalled[name] || "");
    const localHash = typeof localCommand === "string" ? hashTextContent(Buffer.from(localCommand, "utf8")) : "";
    if (typeof localCommand !== "string" || (previousHash && localHash === previousHash)) {
      merged.scripts[name] = remoteCommand;
      installedScripts[name] = hashTextContent(Buffer.from(remoteCommand, "utf8"));
    }
  }

  mergeManagedDependencies(merged, localPackage, remotePackage, "dependencies", policy.dependencies);
  mergeManagedDependencies(merged, localPackage, remotePackage, "optionalDependencies", policy.optionalDependencies);
  if (remotePackage["agentsUpstream"] && remotePackage["agentsUpstream"].schema === 1 &&
    /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(String(remotePackage["agentsUpstream"].upstreamRepository || ""))) {
    merged["agentsUpstream"] = remotePackage["agentsUpstream"];
  }
  merged["agentsGovernance"] = {
    ...policy,
    installedScripts,
    repositoryProfile: "consumer",
    ...(typeof previousGovernance.productVerifyScript === "string" && previousGovernance.productVerifyScript.trim()
      ? { productVerifyScript: previousGovernance.productVerifyScript.trim() }
      : {}),
  };
  return Buffer.from(`${JSON.stringify(merged, null, 2)}\n`, "utf8");
}

/** Executa parsePackageManifest no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa readGovernancePolicy no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function readGovernancePolicy(remotePackage) {
  const policy = remotePackage["agentsGovernance"];
  if (!policy || policy.schema !== 1 || !Array.isArray(policy.managedScriptPrefixes) ||
    !Array.isArray(policy.managedScripts) || !Array.isArray(policy.dependencies) ||
    !Array.isArray(policy.optionalDependencies)) {
    throw new Error("package.json distribuido sem agentsGovernance valido.");
  }
  return {
    schema: 1,
    managedScriptPrefixes: policy.managedScriptPrefixes.map(String),
    managedScripts: policy.managedScripts.map(String),
    installableScripts: Array.isArray(policy.installableScripts) ? policy.installableScripts.map(String) : [],
    dependencies: policy.dependencies.map(String),
    optionalDependencies: policy.optionalDependencies.map(String),
  };
}

/** Executa isManagedScriptName no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function isManagedScriptName(name, policy) {
  return policy.managedScripts.includes(name) || policy.managedScriptPrefixes.some((prefix) => name.startsWith(prefix));
}

/** Executa mergeManagedDependencies no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa isRecognizedLegacyGovernanceFile no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function isRecognizedLegacyGovernanceFile(relativePath) {
  const normalized = toPosixPath(relativePath);
  return LEGACY_MANAGED_FILES.has(normalized) || LEGACY_MANAGED_ROOTS.some((root) => normalized.startsWith(`${root}/`));
}

/** Executa applyPlan no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function applyPlan(rootDir, plan) {
  const transactionCache = assertRepositoryTarget(repositoryBoundary(rootDir), path.join(".ia.rules", "cache", "update-transaction"), { allowHardlink: true });
  fs.mkdirSync(transactionCache, { recursive: true });
  const backupRoot = fs.mkdtempSync(path.join(transactionCache, "run-"));
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

/** Executa applyTransactionalChange no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function applyTransactionalChange(rootDir, backupRoot, change, touched) {
  const target = assertRepositoryTarget(repositoryBoundary(rootDir), change.relativePath, { allowHardlink: change.action === "remove" });
  const backup = path.join(backupRoot, change.relativePath);
  const existed = fs.existsSync(target);
  if (existed) {
    fs.mkdirSync(path.dirname(backup), { recursive: true });
    fs.copyFileSync(target, backup);
  }
  touched.push({ backup, existed, relativePath: change.relativePath });
  if (change.action === "remove") {
    fs.rmSync(target, { force: true });
    removeEmptyLegacyParents(rootDir, path.dirname(target));
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, change.content);
}

/** Remove somente diretórios vazios dos dois namespaces legados oficialmente reconhecidos. */
function removeEmptyLegacyParents(rootDir, startPath) {
  const legacyRoots = [path.join(rootDir, ".agents"), path.join(rootDir, "scripts", ".agents")]
    .map((entry) => path.resolve(entry));
  let current = path.resolve(startPath);
  const boundary = legacyRoots.find((entry) => current === entry || current.startsWith(`${entry}${path.sep}`));
  if (!boundary) return;
  while (current === boundary || current.startsWith(`${boundary}${path.sep}`)) {
    if (!fs.existsSync(current) || fs.readdirSync(current).length > 0) return;
    fs.rmdirSync(current);
    if (current === boundary) return;
    current = path.dirname(current);
  }
}

/** Executa restoreTransactionalChanges no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa commitAndPushNormativeUpdate no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function commitAndPushNormativeUpdate(rootDir, plan) {
  const candidates = [...new Set([...prepareUpdateAnalogFiles(rootDir, plan), ...listChangedNormativePaths(plan)].map(toPosixPath))];
  const tracked = new Set(runGit(rootDir, ["ls-files", "--", ...candidates]).stdout.trim().split(/\r?\n/u).filter(Boolean).map(toPosixPath));
  // Remoção de lock legado ignorado não possui entrada no índice e não pode virar pathspec de git add.
  const paths = candidates.filter((entry) => fs.existsSync(path.join(rootDir, entry)) || tracked.has(entry));

  if (paths.length === 0) {
    return;
  }

  const upstream = resolveUpstream(rootDir);
  const branch = currentBranchName(rootDir);
  if (!branch) throw new Error("BRANCH_ATUAL_AUSENTE");
  const head = runGit(rootDir, ["rev-parse", "HEAD"]).stdout.trim();
  const message = `ajuste: sincroniza governanca ${plan.source.ref}`;
  const localChanges = commitChangesForParent(rootDir, plan, paths, head, false);
  const localCommit = createPlumbingCommit(rootDir, head, localChanges, message);
  runGit(rootDir, ["update-ref", `refs/heads/${branch}`, localCommit, head]);
  updateRealIndex(rootDir, plan, paths);

  if (!upstream) {
    runGit(rootDir, ["push", "-u", "origin", branch]);
    return;
  }

  const pending = Number(runGit(rootDir, ["rev-list", "--count", `${upstream}..${head}`]).stdout.trim()) > 0;
  if (!pending) {
    runGit(rootDir, ["push"]);
    return;
  }

  const upstreamCommit = runGit(rootDir, ["rev-parse", upstream]).stdout.trim();
  const remoteChanges = commitChangesForParent(rootDir, plan, paths, upstreamCommit, true);
  const remoteCommit = createPlumbingCommit(rootDir, upstreamCommit, remoteChanges, message);
  const remoteName = runGit(rootDir, ["config", "--get", `branch.${branch}.remote`]).stdout.trim() || "origin";
  const mergeRef = runGit(rootDir, ["config", "--get", `branch.${branch}.merge`]).stdout.trim() || `refs/heads/${branch}`;
  runGit(rootDir, ["push", remoteName, `${remoteCommit}:${mergeRef}`]);

  const localTree = runGit(rootDir, ["rev-parse", `${localCommit}^{tree}`]).stdout.trim();
  const mergeCommit = runGit(rootDir, ["commit-tree", localTree, "-p", localCommit, "-p", remoteCommit, "-m", `${message} (reconcilia commits locais)`]).stdout.trim();
  runGit(rootDir, ["update-ref", `refs/heads/${branch}`, mergeCommit, localCommit]);
}

/** Materializa somente os paths autorizados sobre um parent, sem tocar index/worktree nem incluir alterações alheias. */
function createPlumbingCommit(rootDir, parent, changes, message) {
  const gitDirRaw = runGit(rootDir, ["rev-parse", "--git-dir"]).stdout.trim();
  const gitDir = path.isAbsolute(gitDirRaw) ? gitDirRaw : path.join(rootDir, gitDirRaw);
  const indexPath = path.join(gitDir, `agents-update-index-${process.pid}-${crypto.randomBytes(6).toString("hex")}`);
  try {
    runGitWithEnv(rootDir, ["read-tree", parent], { GIT_INDEX_FILE: indexPath });
    for (const change of changes) updateIndexEntry(rootDir, indexPath, change.relativePath, change.content, change.mode);
    const tree = runGitWithEnv(rootDir, ["write-tree"], { GIT_INDEX_FILE: indexPath }).stdout.trim();
    return runGit(rootDir, ["commit-tree", tree, "-p", parent, "-m", message]).stdout.trim();
  } finally {
    fs.rmSync(indexPath, { force: true });
  }
}

/** Projeta o conteúdo de commit contra HEAD ou upstream, preservando campos compartilhados próprios de cada base. */
function commitChangesForParent(rootDir, plan, paths, parent, remoteProjection) {
  return paths.map((relativePath) => {
    const change = plan.changes.find((entry) => toPosixPath(entry.relativePath) === relativePath);
    const base = readGitBlob(rootDir, `${parent}:${relativePath}`);
    let content = change ? change.commitContent : fs.existsSync(path.join(rootDir, relativePath)) ? fs.readFileSync(path.join(rootDir, relativePath)) : null;
    if (remoteProjection && change && ["package", "template"].includes(change.kind)) {
      content = resolveManagedContent({
        content: change.remoteContent,
        descriptor: change.remoteDescriptor,
        kind: change.kind,
        relativePath: change.relativePath,
      }, base).content;
    } else if (relativePath === GITIGNORE_RELATIVE_PATH) {
      content = mergeManagedGitignore(base || Buffer.from(""));
    }
    return { content, mode: gitPathMode(rootDir, parent, relativePath), relativePath };
  });
}

/** Atualiza somente entradas gerenciadas no index real, preservando staging alheio e mesclando o staging compartilhado. */
function updateRealIndex(rootDir, plan, paths) {
  const indexRaw = runGit(rootDir, ["rev-parse", "--git-path", "index"]).stdout.trim();
  const indexPath = path.isAbsolute(indexRaw) ? indexRaw : path.join(rootDir, indexRaw);
  for (const relativePath of paths) {
    const change = plan.changes.find((entry) => toPosixPath(entry.relativePath) === relativePath);
    const content = relativePath === GITIGNORE_RELATIVE_PATH
      ? mergeManagedGitignore(readGitBlob(rootDir, `:${relativePath}`) || readGitBlob(rootDir, `HEAD:${relativePath}`) || Buffer.from(""))
      : change ? change.indexContent : fs.existsSync(path.join(rootDir, relativePath)) ? fs.readFileSync(path.join(rootDir, relativePath)) : null;
    updateIndexEntry(rootDir, indexPath, relativePath, content, gitPathMode(rootDir, "HEAD", relativePath));
  }
}

/** Insere/remove uma entrada de index por blob explícito; nunca enumera nem inclui paths externos ao plano. */
function updateIndexEntry(rootDir, indexPath, relativePath, content, mode = "100644") {
  const env = { GIT_INDEX_FILE: indexPath };
  if (content === null || content === undefined) {
    runGitWithEnv(rootDir, ["update-index", "--force-remove", "--", relativePath], env, true);
    return;
  }
  const blob = runGitWithEnv(rootDir, ["hash-object", "-w", "--stdin"], env, false, content).stdout.trim();
  runGitWithEnv(rootDir, ["update-index", "--add", "--cacheinfo", `${mode},${blob},${relativePath}`], env);
}

/** Resolve o modo Git do parent, mantendo executabilidade quando já declarada. */
function gitPathMode(rootDir, parent, relativePath) {
  assertRepositoryGit(repositoryBoundary(rootDir), ["ls-tree", parent, "--", relativePath]);
  const result = childProcess.spawnSync("git", ["-C", rootDir, "ls-tree", parent, "--", relativePath], { encoding: "utf8", windowsHide: true });
  const match = result.status === 0 ? /^(\d{6})\s/u.exec(result.stdout) : null;
  return match ? match[1] : "100644";
}

/** Executa Git com ambiente adicional e input binário sem expor conteúdo em argumentos ou logs. */
function runGitWithEnv(rootDir, args, extraEnv, optional = false, input = undefined) {
  assertRepositoryGit(repositoryBoundary(rootDir), args);
  const result = childProcess.spawnSync("git", ["-C", rootDir, ...args], {
    encoding: "utf8",
    env: { ...process.env, ...extraEnv },
    input,
    windowsHide: true,
  });
  if (result.status !== 0 && !optional) throw new Error(`git ${args.join(" ")} falhou: ${result.stderr || result.stdout}`);
  return result;
}

/** Executa prepareUpdateAnalogFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function prepareUpdateAnalogFiles(rootDir, plan) {
  const changed = listChangedNormativePaths(plan);
  const analogs = [];
  if (changed.some((relativePath) => toPosixPath(relativePath).startsWith(".ia.rules/")) &&
    ensureGitignoreAllowsManagedRules(rootDir)) {
    analogs.push(GITIGNORE_RELATIVE_PATH);
  }
  return analogs;
}

/** Executa ensureGitignoreAllowsManagedRules no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function ensureGitignoreAllowsManagedRules(rootDir) {
  const gitignorePath = path.join(rootDir, GITIGNORE_RELATIVE_PATH);
  const current = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath) : Buffer.from("");
  const next = mergeManagedGitignore(current);
  if (hashTextContent(current) === hashTextContent(next)) return false;
  fs.writeFileSync(gitignorePath, next);
  return true;
}

/** Mescla somente o bloco gerenciado no .gitignore e preserva exterior e EOL da camada recebida. */
function mergeManagedGitignore(content) {
  const current = Buffer.from(content || "").toString("utf8");
  const eol = current.includes("\r\n") ? "\r\n" : "\n";
  const block = [
    "# BEGIN agents-governance managed",
    "# Permite versionar o nucleo gerenciado atualizado por update:agents.",
    "!/.ia.rules/",
    "!/.ia.rules/**",
    "/.ia.rules/cache/",
    "/.ia.rules/local/",
    "/.ia.rules/agents-update.lock.json",
    "/agents-governance-backups/",
    "# END agents-governance managed",
  ].join(eol);
  const pattern = /(?:^|\r?\n)# BEGIN agents-governance managed\r?\n[\s\S]*?# END agents-governance managed(?:\r?\n|$)/u;
  const next = pattern.test(current)
    ? current.replace(pattern, `${current.startsWith("# BEGIN agents-governance managed") ? "" : eol}${block}${eol}`)
    : `${current.trimEnd()}${current.trimEnd() ? eol + eol : ""}${block}${eol}`;
  return Buffer.from(next, "utf8");
}

/** Executa listChangedNormativePaths no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function listChangedNormativePaths(plan) {
  return plan.changes
    .filter((change) => change.action !== "unchanged")
    .map((change) => toPosixPath(change.relativePath));
}

/** Executa resolveUpstream no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function resolveUpstream(rootDir) {
  repositoryBoundary(rootDir);
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

/** Executa currentBranchName no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function currentBranchName(rootDir) {
  return runGit(rootDir, ["branch", "--show-current"]).stdout.trim();
}

/** Executa runGit no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function runGit(rootDir, args) {
  assertRepositoryGit(repositoryBoundary(rootDir), args);
  const result = childProcess.spawnSync("git", ["-C", rootDir, ...args], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} falhou: ${result.stderr || result.stdout}`);
  }

  return result;
}

/** Mantém uma única fronteira física validada por raiz durante a execução corrente. */
function repositoryBoundary(rootDir) {
  const key = path.resolve(rootDir);
  if (!REPOSITORY_BOUNDARIES.has(key)) REPOSITORY_BOUNDARIES.set(key, resolveRepositoryBoundary(key));
  return REPOSITORY_BOUNDARIES.get(key);
}

/** Executa printPlan no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function printPlan(plan, mode) {
  console.log(`agent:autoupdate ${mode}: ${plan.source.label}`);

  for (const change of plan.changes) {
    if (change.action !== "unchanged") {
      console.log(`${change.action}: ${toPosixPath(change.relativePath)}`);
    }
  }
  for (const migration of plan.extensionMigrations || []) {
    console.log(`migrate-extension: ${migration.source} -> ${migration.target}`);
  }

  if (!plan.changed) {
    console.log("sem alteracoes normativas");
  } else if (mode === "dry-run") {
    console.log(`commit/push normativo previsto para: ${listChangedNormativePaths(plan).join(", ")}`);
  }
}

/** Executa safeRelativePath no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function safeRelativePath(value) {
  const normalized = path.normalize(String(value || ""));

  if (!normalized || path.isAbsolute(normalized) || normalized.startsWith("..") || normalized.includes(`..${path.sep}`)) {
    throw new Error(`Path normativo inseguro: ${value}`);
  }

  return normalized;
}

/** Executa resolveCaseInsensitiveFile no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function resolveCaseInsensitiveFile(dirPath, name) {
  const expected = String(name || "").toLocaleLowerCase("en-US");
  const entry = fs.readdirSync(dirPath, { withFileTypes: true })
    .find((candidate) => candidate.isFile() && candidate.name.toLocaleLowerCase("en-US") === expected);
  if (!entry) {
    throw new Error(`Arquivo normativo remoto ausente: ${name}`);
  }
  return path.join(dirPath, entry.name);
}

/** Executa readUpdateLock no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function readUpdateLock(rootDir) {
  const lockPath = path.join(rootDir, LOCK_FILE);

  if (!fs.existsSync(lockPath)) {
    return null;
  }

  const raw = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  return isCurrentLock(raw) ? raw : convertLegacyLock(raw);
}

/** Executa createUpdateLock no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function createUpdateLock(source, remoteFiles, changes = []) {
  const finalContent = new Map(changes.filter((change) => change.action !== "remove").map((change) => [toPosixPath(change.relativePath), change.content]));
  return {
    format: FORMAT,
    files: Object.fromEntries(remoteFiles.map((entry) => [
      toPosixPath(entry.relativePath),
      hashBuffer(finalContent.get(toPosixPath(entry.relativePath)) || entry.content),
    ])),
    managedFiles: remoteFiles.map((entry) => ({ path: toPosixPath(entry.relativePath) })),
    marker: MARKER,
    schema: VERSION,
    source: {
      label: source.label,
      ref: source.ref,
      type: source.type,
      url: source.repository || `${SOURCE_OWNER}/${SOURCE_REPO}`,
    },
    updatedAt: new Date().toISOString(),
  };
}

/** Executa listFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa defaultHttpClient no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa hashBuffer no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/** Executa hashTextContent no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function hashTextContent(buffer) {
  return hashBuffer(Buffer.from(buffer.toString("utf8").replace(/\r\n/gu, "\n"), "utf8"));
}

/** Executa normalizeText no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function normalizeText(value) {
  return String(value || "").replace(/\r\n/gu, "\n").trimEnd();
}

/** Executa toPosixPath no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function toPosixPath(value) {
  return String(value || "").split(path.sep).join("/");
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`Falha ao atualizar governanca operacional: ${err.message}`);
    process.exitCode = err instanceof UsageError ? 2 : 1;
  });
}

/** Executa isLocalExtensionPath no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function isLocalExtensionPath(value) {
  const relative = toPosixPath(value).replace(/^\.\//u, "");
  return relative.startsWith(".ia.rules/hooks/") || relative.startsWith(".ia.rules/local/");
}

module.exports = {
  applyPlan,
  backupDivergentManagedFiles,
  buildUpdatePlan,
  collectRemoteGovernanceFiles,
  compareRemoteFiles,
  executeUpdatePlan,
  githubCliJsonResponse,
  handoffMac,
  handoffToReleaseRuntime,
  hashTextContent,
  isRecognizedLegacyGovernanceFile,
  isLocalExtensionPath,
  parseGovernanceManifest,
  help,
  main,
  mergePackageManifest,
  normalizeGovernanceRelativePath,
  parseArgs,
  planLegacyExtensionMigrations,
  applyLegacyExtensionMigrations,
  prepareUpdateAnalogFiles,
  prepareReleaseHandoff,
  resolveReleaseRuntime,
  resolveRemoteSource,
  resolveCaseInsensitiveFile,
  planDistributionTransition,
  resumeFromHandoff,
  signHandoffPayload,
  verifyHandoffState,
};
