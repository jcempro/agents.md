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
const path = require("path");

const { createZipFromDirectory } = require("./archive");
const { loadConfiguration } = require("./configuration");
const { buildDistributionMap, distributionMapFileName, distributionMapRelativePath, validateDistributionMap } = require("./distribution-map");
const { validateRefusedDecisions } = require("./refused-decisions");
const { resolveExistingReleaseTrigger } = require("./release-trigger-policy");
const { filterOutput } = require("./to-ia");
const { runPackageRegistryLifecycle } = require("../../../scenarios/release/scripts/package-registry");
const { runReleaseHook } = require("../../../scenarios/release/scripts/release-hooks");

const RUNTIME_ROOT = path.resolve(__dirname, "..", "..", "..", "..");
// FIX-BUG: o mesmo runtime executa na fonte src/.ia.rules e no pacote .ia.rules.
const ROOT_DIR = fs.existsSync(path.join(RUNTIME_ROOT, "package.json")) ? RUNTIME_ROOT : path.resolve(RUNTIME_ROOT, "..");
const CONFIGURATION = loadConfiguration(ROOT_DIR);
const SRC_DIR = resolveConfiguredRoot("paths.source");
const DIST_DIR = resolveConfiguredRoot("paths.artifact");
const SOURCE_RULES_DIR = path.join(SRC_DIR, ".ia.rules");
const RUNTIME_RULES_DIR = fs.existsSync(path.join(ROOT_DIR, ".ia.rules")) ? path.join(ROOT_DIR, ".ia.rules") : SOURCE_RULES_DIR;
const INDEX_PATH = path.join(ROOT_DIR, (CONFIGURATION.paths && CONFIGURATION.paths.index) || "index.json");
const RELEASE_PATH = path.join(DIST_DIR, "release.json");
const RELEASE_NOTE_PATH = path.join(DIST_DIR, "release-note.txt");
const PACKAGE_PATH = path.join(ROOT_DIR, "package.json");
const DISTRIBUTION_PACKAGE_PATH = path.join(DIST_DIR, "package.json");
const UPDATE_FORMAT_PATH = path.join(RUNTIME_RULES_DIR, "core", "update", "formats", "governance-manifest.v2.json");
const SOURCE_DISTRIBUTION_MANIFEST_PATH = path.join(SOURCE_RULES_DIR, "distribution", "source-manifest.json");
const RUNTIME_MATRIX_PATH = path.join(SOURCE_RULES_DIR, "runtime", "runtime-matrix.json");
const TSCONFIG_PATH = path.join(ROOT_DIR, "config", "tsconfig.json");
const NORMATIVE_GRAPH_SOURCE_PATH = path.join(SOURCE_RULES_DIR, "scenarios", "governance", "scripts", "normative-graph.py");
const NORMATIVE_GRAPH_RUNTIME_PATH = path.join(RUNTIME_RULES_DIR, "scenarios", "governance", "scripts", "normative-graph.py");
const SOURCE_DISTRIBUTION_FORMAT = "agents-source-distribution/v1";
const SOURCE_DISTRIBUTION_PROFILES = new Set([
  "consumer-core",
  "consumer-runtime",
  "consumer-scenario",
  "consumer-bootstrap",
  "generated-release",
]);
const UPDATE_HANDOFF_RUNTIME = [
  ".ia.rules/core/runtime/scripts/update-agents.js",
  ".ia.rules/core/runtime/scripts/archive.js",
  ".ia.rules/core/runtime/scripts/distribution-map.js",
  ".ia.rules/core/update/migrations/v1-to-v2.js",
];
const LEGACY_RULES_ROOT = [".", "agents"].join("");
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
const SECURITY_SCAN_EXCLUDED_PREFIXES = [
  ".git/",
  ".ia.rules/cache/",
  "dist/",
  "node_modules/",
];
const SECURITY_SCAN_DEFINITION_FILES = new Set([
  ".ia.rules/core/runtime/scripts/repo-tools.js",
  "src/.ia.rules/core/runtime/scripts/repo-tools.ts",
]);

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
    description: "gera handoff.md de .ia.rules/continue.ia",
    run: () => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "generate-agents-status.js")),
    status: "available",
  },
  "agent:compress": {
    description: "gera projecao operacional compacta sem descartar memoria canonica",
    run: compactOperationalContext,
    status: "available",
  },
  "agent:autoupdate": {
    description: "atualiza automaticamente a governanca operacional gerenciada",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "autoupdate.js"), _args),
    status: "available",
  },
  "agent:agents": {
    description: "alias transitorio de agent:autoupdate",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "autoupdate.js"), _args),
    status: "available",
  },
  "agent:workflows": {
    description: "lista, instala, atualiza e valida workflows oficiais distribuídos",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "workflow-manager.js"), _args),
    status: "available",
  },
  "agent:upstream:check": {
    description: "resolve e consulta o upstream de AGENTS.md com seguranca",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "upstream-share.js"), ["check", ..._args]),
    status: "available",
  },
  "agent:upstream:prepare": {
    description: "sanitiza e prepara proposta upstream revisavel",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "upstream-share.js"), ["prepare", ..._args]),
    status: "available",
  },
  "agent:upstream:publish": {
    description: "publica proposta upstream somente com autorizacao explicita",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "upstream-share.js"), ["publish", ..._args]),
    status: "available",
  },
  "agent:upstream:assess": {
    description: "classifica proposta para decisao manual do mantenedor",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "upstream-share.js"), ["assess", ..._args]),
    status: "available",
  },
  "agent:upstream:apply-assessment": {
    description: "aplica rotulo e comentario de avaliacao somente com autorizacao",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "upstream-share.js"), ["apply-assessment", ..._args]),
    status: "available",
  },
  "agent:test:upstream": {
    description: "executa verificacao local do pipeline upstream",
    run: () => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "upstream-share.js"), ["self-test"]),
    status: "available",
  },
  "agent:inbox:event": {
    description: "sanitiza e indexa evento de issue no construtor",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-inbox.js"), ["event", ..._args]),
    status: "available",
  },
  "agent:inbox:fetch": {
    description: "busca e indexa issue para avaliacao construtora",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-inbox.js"), ["fetch", ..._args]),
    status: "available",
  },
  "agent:inbox:evaluate": {
    description: "avalia item sanitizado da inbox sem efeito remoto",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-inbox.js"), ["evaluate", ..._args]),
    status: "available",
  },
  "agent:inbox:process": {
    description: "processa evento da inbox e exige autorizacao para efeito remoto",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-inbox.js"), ["process", ..._args]),
    status: "available",
  },
  "agent:inbox:apply": {
    description: "aplica efeito da avaliacao construtora somente com autorizacao",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-inbox.js"), ["apply", ..._args]),
    status: "available",
  },
  "agent:inbox:approve": {
    description: "registra aprovacao humana de issue vinculada a FT",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-inbox.js"), ["approve", ..._args]),
    status: "available",
  },
  "agent:inbox:sync-approved": {
    description: "baixa issues aprovadas e cria FTs correlacionadas",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-lifecycle.js"), ["sync-approved", ..._args]),
    status: "available",
  },
  "agent:inbox:start": {
    description: "marca issues importadas como em desenvolvimento apos push",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-lifecycle.js"), ["start", ..._args]),
    status: "available",
  },
  "agent:inbox:bind-release": {
    description: "vincula FTs concluidas e suas issues a uma versao",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-lifecycle.js"), ["bind-release", ..._args]),
    status: "available",
  },
  "agent:inbox:complete-release": {
    description: "comenta e fecha todas as issues corrigidas pelo release",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-lifecycle.js"), ["complete-release", ..._args]),
    status: "available",
  },
  "agent:test:inbox": {
    description: "executa verificacao local da inbox construtora",
    run: () => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "issue-inbox.js"), ["self-test"]),
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
    description: "valida e regenera índice, custos e mapa normativo com tokenizer exato",
    run: (_args) => runNormativeGraph(["--write", "--check", ..._args]),
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
  "agent:rcf:trace": {
    description: "prepara, finaliza e valida rastreabilidade causal de RCF",
    run: (_args) => runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "rcf-trace.js"), _args),
    status: "available",
  },
  "agent:package": {
    description: "alias seguro de agent:dist",
    run: () => COMMANDS["agent:dist"].run(),
    status: "available",
  },
  "agent:release": {
    description: "gera release local rastreavel com release-note.txt e pacote versionado",
    run: releaseLocal,
    status: "available",
  },
  "agent:release:trigger": {
    description: "cria gatilho local release para o workflow tecnico",
    run: releaseTrigger,
    status: "available",
  },
  "agent:test": {
    description: "executa verificacao e testes locais da governanca",
    run: testAll,
    status: "available",
  },
  "agent:lint": {
    description: "checagem estatica local dos scripts",
    run: lint,
    status: "available",
  },
  "agent:typecheck": {
    description: "valida as fontes TypeScript canonicas sem emitir artefato",
    run: typecheck,
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
  "agent:build", "agent:verify", "agent:dist", "agent:package", "agent:release", "agent:release:trigger", "agent:rollback",
  "agent:test", "agent:lint", "agent:format", "agent:typecheck", "agent:benchmark", "agent:security", "agent:analyze",
  "agent:deps", "agent:update-deps", "agent:licenses",
  "agent:index", "agent:map", "agent:handoff", "agent:docs", "agent:rcf", "agent:agents",
  "agent:upstream:check", "agent:upstream:prepare", "agent:upstream:publish", "agent:upstream:assess", "agent:upstream:apply-assessment", "agent:test:upstream", "agent:inbox:event", "agent:inbox:fetch", "agent:inbox:evaluate", "agent:inbox:process", "agent:inbox:apply", "agent:test:inbox",
  "agent:parse-data", "agent:summarize", "agent:convert", "agent:validate-data", "agent:index-data", "agent:query-data",
];

/** Executa main no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa buildIndex no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function buildIndex() {
  assertBuildConfiguration();
  assertDirectory(SRC_DIR, "src ausente.");
  const sourceManifest = readSourceDistributionManifest();
  const runtimeMatrix = validateRuntimeMatrix();
  const files = sourceManifest.entries.flatMap((entry) => {
    const source = {
      condition: entry.condition,
      destination: entry.destination,
      name: path.posix.basename(entry.destination),
      path: toPosix(path.join("src", entry.path)),
      profile: entry.profile,
      ...(entry.language ? { language: entry.language } : {}),
    };
    if (!entry.artifact) return [source];
    return [source, {
      artifact: true,
      condition: entry.condition,
      destination: entry.artifact.destination,
      generatedFrom: source.path,
      language: "javascript",
      name: path.posix.basename(entry.artifact.destination),
      path: source.path,
      profile: entry.profile,
      runtime: {
        builder: entry.artifact.builder,
        format: entry.artifact.format,
        target: entry.artifact.target,
      },
    }];
  }).sort((a, b) => a.destination.localeCompare(b.destination, "en"));

  const index = {
    files,
    root: "src",
    schema: 1,
    runtime: {
      matrix: toPosix(path.relative(ROOT_DIR, RUNTIME_MATRIX_PATH)),
      schema: runtimeMatrix.schema,
    },
    sourceManifest: {
      id: sourceManifest.id,
      path: toPosix(path.relative(ROOT_DIR, SOURCE_DISTRIBUTION_MANIFEST_PATH)),
      version: sourceManifest.version,
    },
  };
  index.update = createGovernanceManifest(buildDistributionFiles(index), distributionContent);
  index.update.files.push({
    kind: "package",
    path: "package.json",
    profile: "generated-release",
    sha256: hashTextFile(PACKAGE_PATH),
    source: "package.json",
  });
  index.handoff = createUpdateHandoffDescriptor(index.update);
  return index;
}

/** Executa readSourceDistributionManifest no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function readSourceDistributionManifest() {
  assertFile(SOURCE_DISTRIBUTION_MANIFEST_PATH, "MANIFESTO_FONTE_AUSENTE");
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(SOURCE_DISTRIBUTION_MANIFEST_PATH, "utf8"));
  } catch (error) {
    throw new Error(`MANIFESTO_FONTE_JSON_INVALIDO:${error.message}`);
  }
  return validateSourceDistributionManifest(manifest, SRC_DIR);
}

/** Executa validateSourceDistributionManifest no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateSourceDistributionManifest(manifest, sourceRoot) {
  if (!manifest || manifest.schema !== SOURCE_DISTRIBUTION_FORMAT || manifest.id !== "agents.source-distribution" ||
    manifest.version !== 1 || manifest.generated !== false || manifest.scope !== "src" ||
    !Array.isArray(manifest.entries) || manifest.entries.length === 0) {
    throw new Error("MANIFESTO_FONTE_INVALIDO");
  }

  const sources = new Map();
  const destinations = new Map();
  const artifacts = new Map();
  for (const entry of manifest.entries) {
    if (!entry || !SOURCE_DISTRIBUTION_PROFILES.has(entry.profile) || entry.profile === "generated-release" ||
      !entry.purpose || !entry.condition || entry.ownership !== "managed" ||
      !Array.isArray(entry.roles) || entry.roles.length === 0 ||
      !Array.isArray(entry.validation) || entry.validation.length === 0) {
      throw new Error(`MANIFESTO_FONTE_ENTRADA_INVALIDA:${JSON.stringify(entry)}`);
    }
    entry.path = normalizeSourceDistributionPath(entry.path, "origem");
    entry.destination = normalizeSourceDistributionPath(entry.destination, "destino");
    const sourceKey = entry.path.toLocaleLowerCase("en-US");
    const destinationKey = entry.destination.toLocaleLowerCase("en-US");
    if (sources.has(sourceKey)) throw new Error(`MANIFESTO_FONTE_ORIGEM_DUPLICADA:${entry.path}`);
    if (destinations.has(destinationKey)) throw new Error(`MANIFESTO_FONTE_DESTINO_DUPLICADO:${entry.destination}`);
    sources.set(sourceKey, entry.path);
    destinations.set(destinationKey, entry.destination);
    if (entry.artifact) {
      if (entry.language !== "typescript" || path.posix.extname(entry.path) !== ".ts" ||
        path.posix.extname(entry.destination) !== ".ts" || entry.profile !== "consumer-runtime" ||
        entry.artifact.format !== "commonjs" || entry.artifact.target !== "node24" ||
        !entry.artifact.builder || !entry.artifact.destination) {
        throw new Error(`MANIFESTO_FONTE_ARTEFATO_INVALIDO:${entry.path}`);
      }
      entry.artifact.destination = normalizeSourceDistributionPath(entry.artifact.destination, "artefato");
      const artifactKey = entry.artifact.destination.toLocaleLowerCase("en-US");
      if (destinations.has(artifactKey) || artifacts.has(artifactKey)) {
        throw new Error(`MANIFESTO_FONTE_DESTINO_DUPLICADO:${entry.artifact.destination}`);
      }
      artifacts.set(artifactKey, entry.artifact.destination);
    } else if (path.posix.extname(entry.path) === ".ts") {
      throw new Error(`MANIFESTO_FONTE_TYPESCRIPT_SEM_ARTEFATO:${entry.path}`);
    } else if (path.posix.extname(entry.path) === ".js") {
      throw new Error(`MANIFESTO_FONTE_JAVASCRIPT_MANUAL_PROIBIDO:${entry.path}`);
    }
    const absolute = path.join(sourceRoot, entry.path);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile() || !hasExactPathCase(sourceRoot, entry.path.split("/").join(path.sep))) {
      throw new Error(`MANIFESTO_FONTE_ARQUIVO_AUSENTE:${entry.path}`);
    }
  }

  const physical = listFiles(sourceRoot)
    .map((filePath) => toPosix(path.relative(sourceRoot, filePath)))
    .sort((left, right) => left.localeCompare(right, "en"));
  for (const relativePath of physical) {
    if (!sources.has(relativePath.toLocaleLowerCase("en-US"))) {
      throw new Error(`FONTE_SEM_PERFIL:${relativePath}`);
    }
  }
  if (physical.length !== sources.size) {
    throw new Error(`MANIFESTO_FONTE_NAO_EXAUSTIVO:physical=${physical.length}:declared=${sources.size}`);
  }
  return manifest;
}

/** Executa normalizeSourceDistributionPath no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function normalizeSourceDistributionPath(value, kind) {
  const normalized = String(value || "").trim().replace(/\\/gu, "/").replace(/^\.\//u, "");
  if (!normalized || path.posix.isAbsolute(normalized) || /^[A-Za-z]:\//u.test(normalized) ||
    normalized === "." || normalized === ".." || normalized.startsWith("../") ||
    normalized.includes("/../") || normalized.includes("//") || normalized.endsWith("/")) {
    throw new Error(`MANIFESTO_FONTE_PATH_INSEGURO:${kind}:${value}`);
  }
  return normalized;
}

/** Executa buildDist no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function buildDist(options = {}) {
  assertBuildConfiguration();
  syncActiveRuntime();
  const preservedRelease = options.releaseMetadata || readExistingReleaseMetadata();
  const releaseVersion = normalizeReleaseVersion(options.version || (preservedRelease && preservedRelease.version) || "");
  const releaseNotes = typeof options.releaseNotes === "string" ? options.releaseNotes.trim() : readExistingReleaseNotes();
  const index = buildIndex();
  const archiveName = resolveArchiveName(releaseVersion);
  const files = buildDistributionFiles(index);
  cleanDirectory(DIST_DIR);
  fs.mkdirSync(DIST_DIR, { recursive: true });

  for (const file of files) {
    const targetPath = path.join(DIST_DIR, file.path);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    copyDistributionFile(file, targetPath);
  }
  writeJsonMinified(DISTRIBUTION_PACKAGE_PATH, buildDistributionPackage());
  const effectiveVersion = releaseVersion || readPackageVersion();
  const distributionMapPath = distributionMapRelativePath(effectiveVersion);

  const releaseIndex = {
    files: [...files.map(({ condition, name, path: releasePath, profile, sourcePath }) => ({
      condition,
      name,
      path: releasePath,
      profile,
      source: sourcePath,
    })), {
      name: "package.json",
      path: "package.json",
      profile: "generated-release",
    }, {
      name: "release.json",
      path: "release.json",
      profile: "generated-release",
    }, {
      name: distributionMapFileName(effectiveVersion),
      path: distributionMapPath,
      profile: "generated-release",
    }],
    distributionMap: {
      format: "agents-distribution-map/v1",
      path: distributionMapPath,
      version: effectiveVersion,
    },
    root: ".",
    schema: 1,
  };
  if (releaseNotes) {
    fs.writeFileSync(RELEASE_NOTE_PATH, `${releaseNotes}\n`, "utf8");
    releaseIndex.files.push({
      name: "release-note.txt",
      path: "release-note.txt",
      profile: "generated-release",
    });
  }
  if (preservedRelease) {
    releaseIndex.release = {
      asset: toPosix(path.join("dist", archiveName)),
      baseTag: preservedRelease.baseTag || "",
      commit: preservedRelease.commit,
      inference: preservedRelease.inference,
      notesSha256: crypto.createHash("sha256").update(releaseNotes, "utf8").digest("hex"),
      previousRelease: preservedRelease.previousRelease || preservedRelease.baseTag || "",
      issues: releaseIssueLinks(releaseVersion),
      tag: `v${releaseVersion}`,
      version: releaseVersion,
    };
  }
  releaseIndex.update = createGovernanceManifest(
    releaseIndex.files.filter((entry) => !["release.json", "release-note.txt", distributionMapPath].includes(entry.path)),
    (entry) => fs.readFileSync(path.join(DIST_DIR, entry.path)),
    { installedSource: true },
  );
  releaseIndex.handoff = createUpdateHandoffDescriptor(releaseIndex.update);
  writeJsonMinified(RELEASE_PATH, releaseIndex);
  const distributionMap = buildDistributionMap({
    files: releaseIndex.files.map((entry) => ({
      condition: entry.condition || "",
      path: entry.path,
      profile: entry.profile || "generated-release",
      source: entry.source || entry.path,
      status: entry.path === "release.json" || entry.path === distributionMapPath ? "generated" : "required",
    })),
    rootDir: DIST_DIR,
    selfPath: distributionMapPath,
    version: effectiveVersion,
  });
  fs.mkdirSync(path.dirname(path.join(DIST_DIR, distributionMapPath)), { recursive: true });
  writeJsonMinified(path.join(DIST_DIR, distributionMapPath), distributionMap);

  const archivePath = path.join(DIST_DIR, archiveName);
  createZipFromDirectory(DIST_DIR, archivePath, {
    exclude: [/^agents-v.+\.zip$/u],
  });

  validateDist();
  return {
    archive: toPosix(path.relative(ROOT_DIR, archivePath)),
    files: releaseIndex.files.length,
    releaseNote: releaseNotes ? toPosix(path.relative(ROOT_DIR, RELEASE_NOTE_PATH)) : "",
    version: effectiveVersion,
  };
}

/** Executa buildDistributionFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function buildDistributionFiles(index) {
  return index.files.map((file) => ({
    artifact: Boolean(file.artifact),
    condition: file.condition,
    generatedFrom: file.generatedFrom || "",
    name: file.name,
    path: file.destination,
    profile: file.profile,
    runtime: file.runtime || null,
    sourcePath: file.path,
  })).sort((a, b) => a.path.localeCompare(b.path, "en"));
}

/** Executa copyDistributionFile no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function copyDistributionFile(entry, targetPath) {
  fs.writeFileSync(targetPath, distributionContent(entry));
}

/** Executa distributionContent no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function distributionContent(entry) {
  const sourcePath = path.join(ROOT_DIR, entry.sourcePath);
  if (!entry.artifact) return fs.readFileSync(sourcePath);
  return Buffer.from(transpileTypeScript(sourcePath, {
    minify: true,
    sourceLabel: entry.generatedFrom || entry.sourcePath,
  }), "utf8");
}

/** Executa transpileTypeScript no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function transpileTypeScript(sourcePath, options = {}) {
  let esbuild;
  try {
    esbuild = require("esbuild");
  } catch (error) {
    throw new Error(`TOOLCHAIN_TYPESCRIPT_INDISPONIVEL:${error.message}`);
  }
  const source = fs.readFileSync(sourcePath, "utf8");
  const result = esbuild.transformSync(source, {
    charset: "utf8",
    format: "cjs",
    legalComments: "none",
    loader: "ts",
    minify: Boolean(options.minify),
    platform: "node",
    sourcemap: false,
    target: "node24",
    treeShaking: true,
  });
  return `${distributionBanner()}\n// Gerado de: ${toPosix(options.sourceLabel || path.relative(ROOT_DIR, sourcePath))}; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.\n\n${result.code.trim()}\n`;
}

/** Executa syncActiveRuntime no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function syncActiveRuntime() {
  const manifest = readSourceDistributionManifest();
  let generated = 0;
  for (const entry of manifest.entries.filter((item) => item.artifact)) {
    const sourcePath = path.join(SRC_DIR, entry.path);
    const targetPath = path.join(ROOT_DIR, entry.artifact.destination);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, transpileTypeScript(sourcePath, {
      minify: false,
      sourceLabel: toPosix(path.join("src", entry.path)),
    }), "utf8");
    generated += 1;
  }
  return generated;
}

/** Executa validateRuntimeMatrix no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateRuntimeMatrix() {
  assertFile(RUNTIME_MATRIX_PATH, "MATRIZ_RUNTIME_AUSENTE");
  const matrix = JSON.parse(fs.readFileSync(RUNTIME_MATRIX_PATH, "utf8"));
  if (!matrix || matrix.schema !== "agents-runtime-matrix/v1" || matrix.version !== 1 ||
    matrix.generated !== false || !matrix.node || matrix.node.minimum !== "24.0.0" ||
    matrix.node.target !== "ES2024" || matrix.node.moduleFormat !== "commonjs" ||
    !matrix.node.toolchain || matrix.node.toolchain.typescript !== "7.0.2" ||
    matrix.node.toolchain.esbuild !== "0.28.1" || !Array.isArray(matrix.node.platforms) ||
    !matrix.python || !Array.isArray(matrix.python.resources)) {
    throw new Error("MATRIZ_RUNTIME_INVALIDA");
  }
  return matrix;
}

/** Executa distributionBanner no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function distributionBanner() {
  const metadata = CONFIGURATION.metadata || {};
  const required = ["author", "contact", "repository", "license", "licenseUrl", "licenseNotice", "disclaimer"];
  const missing = required.filter((key) => !String(metadata[key] || "").trim());
  if (missing.length) throw new Error(`PARAMETRO_NORMATIVO_AUSENTE:metadata.${missing.join(",metadata.")}`);
  return [
    `// Autor: ${metadata.author}`,
    `// Site do Autor: ${metadata.contact}`,
    `// Repositorio: ${metadata.repository}`,
    `// Licenca: ${metadata.license}`,
    `// Site da Licenca: ${metadata.licenseUrl}`,
    `// Resumo da Licenca: ${metadata.licenseNotice}`,
    `// Disclaimer: ${metadata.disclaimer}`,
  ].join("\n");
}

/** Executa resolveConfiguredRoot no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function resolveConfiguredRoot(key) {
  const [group, name] = key.split(".");
  const value = CONFIGURATION[group] && CONFIGURATION[group][name];
  return value ? path.resolve(ROOT_DIR, value) : path.join(ROOT_DIR, ".ia.rules", "cache", "unconfigured", name);
}

/** Executa assertBuildConfiguration no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertBuildConfiguration() {
  for (const key of ["source", "artifact"]) {
    if (!CONFIGURATION.paths || !CONFIGURATION.paths[key]) throw new Error(`PARAMETRO_NORMATIVO_AUSENTE:paths.${key}`);
  }
}

/** Executa createGovernanceManifest no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function createGovernanceManifest(entries, contentForEntry, options = {}) {
  const format = JSON.parse(fs.readFileSync(UPDATE_FORMAT_PATH, "utf8"));
  return {
    format: format.format,
    marker: format.marker,
    schema: format.version,
    files: entries.map((entry) => ({
      ...(entry.kind ? { kind: entry.kind } : {}),
      path: entry.path,
      ...(entry.profile ? { profile: entry.profile } : {}),
      ...(options.installedSource ? { source: entry.path } :
        (entry.sourcePath || entry.source ? { source: entry.sourcePath || entry.source } : {})),
      sha256: hashTextBuffer(contentForEntry(entry)),
    })),
  };
}

/** Executa createUpdateHandoffDescriptor no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function createUpdateHandoffDescriptor(manifest) {
  const indexed = new Map(manifest.files.map((entry) => [entry.path, entry]));
  for (const relativePath of UPDATE_HANDOFF_RUNTIME) {
    if (!indexed.has(relativePath)) throw new Error(`Runtime de handoff ausente do manifesto: ${relativePath}`);
  }
  return {
    entry: UPDATE_HANDOFF_RUNTIME[0],
    files: [...UPDATE_HANDOFF_RUNTIME],
    format: "agents-update-runtime/v1",
    schema: 1,
  };
}

/** Executa validateUpdateHandoffDescriptor no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateUpdateHandoffDescriptor(descriptor, label) {
  if (!descriptor || descriptor.format !== "agents-update-runtime/v1" || descriptor.schema !== 1 ||
    descriptor.entry !== UPDATE_HANDOFF_RUNTIME[0] || !Array.isArray(descriptor.files) ||
    UPDATE_HANDOFF_RUNTIME.some((relativePath) => !descriptor.files.includes(relativePath))) {
    throw new Error(`${label} sem runtime de handoff valido.`);
  }
}

/** Executa buildDistributionPackage no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function buildDistributionPackage() {
  const source = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
  const sourceScripts = source.scripts || {};
  const aliases = new Set(["build", "check", "clean", "dev-live", "lint", "prepare", "publish", "release", "release:publish", "release:trigger", "test", "update:agents"]);
  const scripts = Object.fromEntries(Object.entries(sourceScripts)
    .filter(([name]) => name === "agents:update" || name === "agents:autoupdate" || name.startsWith("agent:") || name.startsWith("shared:") || aliases.has(name))
    .map(([name, command]) => [name, String(command)
      .split(LEGACY_RULES_ROOT + "/").join(".ia.rules/")
      .split(LEGACY_RULES_ROOT + "\\").join(".ia.rules\\")]));
  const dependencies = source.dependencies || {};
  const optionalDependencies = source.optionalDependencies || {};
  const governance = source["agentsGovernance"] || {};

  return {
    name: source.name || "agents-governance",
    version: readPackageVersion(),
    private: false,
    files: [".ia.rules/", "AGENTS.md", "INIT-REPO.md", "release.json"],
    license: source.license || "MPL-2.0",
    description: source.description || "Governanca operacional portavel para agentes IA.",
    main: source.main || "AGENTS.md",
    ...(source["agentsUpstream"] ? { agentsUpstream: source["agentsUpstream"] } : {}),
    scripts,
    ...(Object.keys(dependencies).length ? { dependencies } : {}),
    ...(Object.keys(optionalDependencies).length ? { optionalDependencies } : {}),
    agentsGovernance: {
      schema: 1,
      managedScriptPrefixes: governance.managedScriptPrefixes || ["agent:", "shared:"],
      managedScripts: governance.managedScripts || ["agents:autoupdate", "agents:update", "update:agents"],
      dependencies: Object.keys(dependencies).sort((a, b) => a.localeCompare(b, "en")),
      optionalDependencies: Object.keys(optionalDependencies).sort((a, b) => a.localeCompare(b, "en")),
    },
  };
}

/** Executa readExistingReleaseNotes no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function readExistingReleaseNotes() {
  if (!fs.existsSync(RELEASE_NOTE_PATH)) {
    return "";
  }

  return fs.readFileSync(RELEASE_NOTE_PATH, "utf8").trim();
}

/** Executa readExistingReleaseMetadata no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function readExistingReleaseMetadata() {
  if (!fs.existsSync(RELEASE_PATH)) {
    return null;
  }

  const release = JSON.parse(fs.readFileSync(RELEASE_PATH, "utf8")).release;
  if (!release) {
    return null;
  }
  if (!release.commit || !release.version) {
    throw new Error("METADADO_RELEASE_INVALIDO");
  }
  return release;
}

/** Executa verify no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function verify() {
  const checks = [];
  const manualJavaScript = listFiles(SOURCE_RULES_DIR).filter((filePath) => path.extname(filePath) === ".js" && isManagedScriptPath(filePath));
  if (manualJavaScript.length) {
    throw new Error(`FONTE_JAVASCRIPT_MANUAL_PROIBIDA:${manualJavaScript.map((file) => toPosix(path.relative(ROOT_DIR, file))).join(",")}`);
  }
  typecheck();
  for (const script of listFiles(SOURCE_RULES_DIR).filter((filePath) => path.extname(filePath) === ".ts" && isManagedScriptPath(filePath))) {
    const content = fs.readFileSync(script, "utf8");
    assertCodeBanner(content, toPosix(path.relative(ROOT_DIR, script)));
    assertNativeDocumentation(content, toPosix(path.relative(ROOT_DIR, script)));
    if (ALIEN_SCRIPT_TERMS.some((term) => content.toLocaleLowerCase("en-US").includes(term.toLocaleLowerCase("en-US")))) {
      throw new Error(`Referencia alienigena detectada em ${toPosix(path.relative(ROOT_DIR, script))}.`);
    }
    checks.push(toPosix(path.relative(ROOT_DIR, script)));
  }

  const index = buildIndex();
  writeJsonMinified(INDEX_PATH, index);
  validateIndex(index);
  validateNormativeReferences(index);
  runNormativeGraph(["--check"]);
  validateRcfTraceIfPresent();
  const refusedDecisions = validateRefusedDecisions(ROOT_DIR);
  buildDist();
  for (const script of listFiles(DIST_DIR).filter((filePath) => path.extname(filePath) === ".js")) {
    assertCodeBanner(fs.readFileSync(script, "utf8"), toPosix(path.relative(ROOT_DIR, script)));
  }
  assertPublishedNorms(index);

  return ok("VERIFY_OK", { scripts: checks.length, indexedFiles: index.files.length, refusedDecisions });
}

/** Executa assertCodeBanner no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertCodeBanner(content, label) {
  const header = String(content).split(/\r?\n/u).slice(0, 10).join("\n");
  const metadata = CONFIGURATION.metadata || {};
  for (const value of [metadata.author, metadata.contact, metadata.repository, metadata.license, metadata.licenseUrl, metadata.licenseNotice]) {
    if (!value || !header.includes(value)) throw new Error(`CABECALHO_CODIGO_INVALIDO:${label}`);
  }
}

/** Executa testAll no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function testAll() {
  verify();
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "distribution-map.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "upstream-share.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "issue-inbox.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "issue-lifecycle.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "autoupdate.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "configuration.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "application-update.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "package-registry.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "todo-and-gate.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "template-merge.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "source-distribution.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "refused-decisions.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "workflow-manager.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "normative-graph.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "agents-entrypoint.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "rcf-trace.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "runtime-resilience.test.js")]);
  runProcess(process.execPath, [path.join(ROOT_DIR, "test", "clean-consumer.test.js")]);
  return ok("TEST_OK", { suites: 18 });
}

/** Executa validateIndex no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateIndex(index) {
  if (!index || index.schema !== 1 || index.root !== "src" || !index.sourceManifest ||
    index.sourceManifest.id !== "agents.source-distribution" || !Array.isArray(index.files)) {
    throw new Error("index.json invalido.");
  }
  const destinations = new Set();
  for (const file of index.files) {
    if (!file.name || !file.path || !file.path.startsWith("src/") || !file.destination ||
      !SOURCE_DISTRIBUTION_PROFILES.has(file.profile) || file.profile === "generated-release" ||
      !fs.existsSync(path.join(ROOT_DIR, file.path))) {
      throw new Error(`Entrada invalida no indexador: ${JSON.stringify(file)}`);
    }
    const destinationKey = file.destination.toLocaleLowerCase("en-US");
    if (destinations.has(destinationKey)) throw new Error(`Destino duplicado no indexador: ${file.destination}`);
    destinations.add(destinationKey);
  }
  validateGovernanceManifest(index.update, "index.json");
  validateUpdateHandoffDescriptor(index.handoff, "index.json");
}

/** Executa validateNormativeReferences no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateNormativeReferences(index) {
  const conceptPath = path.join(SRC_DIR, ".ia.rules", "core", "concepts", "microconceitos.md");
  const conceptText = fs.readFileSync(conceptPath, "utf8");
  const definitions = new Set();
  for (const match of conceptText.matchAll(/^## (MN-[A-Z0-9-]+|W-MTX-42)\b/gmu)) {
    if (definitions.has(match[1])) {
      throw new Error(`Microconceito duplicado: ${match[1]}.`);
    }
    definitions.add(match[1]);
  }

  for (const entry of index.files.filter((file) => path.extname(file.path) === ".md")) {
    const filePath = path.join(ROOT_DIR, entry.path);
    const content = fs.readFileSync(filePath, "utf8");
    for (const match of content.matchAll(/\b(MN-[A-Z0-9-]+|W-MTX-42)\b/gu)) {
      if (!definitions.has(match[1])) {
        throw new Error(`Microconceito indefinido em ${entry.path}: ${match[1]}.`);
      }
    }
    for (const match of content.matchAll(/`((?:\.\.\/|\.\/)[^`\r\n]*?\.md)(?:#[^`\s]*)?`/gu)) {
      const reference = match[1];
      if (reference.includes("<") || reference.includes(">")) {
        continue;
      }
      const fromRoot = reference === "./AGENTS.md" || reference.startsWith("./.ia.rules/");
      const target = path.resolve(fromRoot ? SRC_DIR : path.dirname(filePath), reference);
      const relative = path.relative(SRC_DIR, target);
      if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative) || !fs.existsSync(target) || !hasExactPathCase(SRC_DIR, relative)) {
        throw new Error(`Referencia normativa invalida em ${entry.path}: ${reference}.`);
      }
    }
  }
}

/** Executa hasExactPathCase no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function hasExactPathCase(root, relativePath) {
  let current = root;
  for (const segment of relativePath.split(path.sep)) {
    if (!fs.readdirSync(current).includes(segment)) {
      return false;
    }
    current = path.join(current, segment);
  }
  return true;
}

/** Executa validateDist no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateDist() {
  assertFile(path.join(DIST_DIR, "AGENTS.md"), "dist/AGENTS.md ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "core", "contracts.md"), "dist/.ia.rules/core/contracts.md ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "core", "update", "scenario.md"), "dist/.ia.rules/core/update/scenario.md ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "core", "concepts", "microconceitos.md"), "dist/.ia.rules/core/concepts/microconceitos.md ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "scenarios", "content-publication", "scenario.md"), "dist/.ia.rules/scenarios/content-publication/scenario.md ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "scenarios", "governance", "upstream-sharing", "scenario.md"), "dist/.ia.rules/scenarios/governance/upstream-sharing/scenario.md ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "scenarios", "release", "scenario.md"), "dist/.ia.rules/scenarios/release/scenario.md ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "scenarios", "web", "page-like", "scenario.md"), "dist/.ia.rules/scenarios/web/page-like/scenario.md ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "core", "runtime", "scripts", "public-client.js"), "dist/.ia.rules/core/runtime/scripts/public-client.js ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "config", "core.json"), "dist/.ia.rules/config/core.json ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "config", "schema.json"), "dist/.ia.rules/config/schema.json ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "core", "runtime", "scripts", "issue-inbox.js"), "dist/.ia.rules/core/runtime/scripts/issue-inbox.js ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "core", "runtime", "scripts", "upstream-share.js"), "dist/.ia.rules/core/runtime/scripts/upstream-share.js ausente.");
  assertFile(path.join(DIST_DIR, ".ia.rules", "scenarios", "release", "scripts", "release-hooks.js"), "dist/.ia.rules/scenarios/release/scripts/release-hooks.js ausente.");
  assertFile(DISTRIBUTION_PACKAGE_PATH, "dist/package.json ausente.");
  assertFile(RELEASE_PATH, "dist/release.json ausente.");
  const release = JSON.parse(fs.readFileSync(RELEASE_PATH, "utf8"));
  if (release.root !== "." || !Array.isArray(release.files)) {
    throw new Error("dist/release.json invalido.");
  }
  if (!release.distributionMap || release.distributionMap.format !== "agents-distribution-map/v1" || !release.distributionMap.path) {
    throw new Error("dist/release.json nao aponta mapa de distribuicao versionado.");
  }
  const distributionMapPath = path.join(DIST_DIR, release.distributionMap.path);
  assertFile(distributionMapPath, "Mapa de distribuicao versionado ausente.");
  const distributionMap = JSON.parse(fs.readFileSync(distributionMapPath, "utf8"));
  validateDistributionMap(distributionMap, { rootDir: DIST_DIR });
  validateDistributionMapCompleteness(distributionMap);
  validateDistributionProfiles(release, distributionMap);
  if (!release.files.some((file) => file.path === "package.json")) {
    throw new Error("dist/release.json nao indexa package.json.");
  }
  validateGovernanceManifest(release.update, "dist/release.json");
  validateUpdateHandoffDescriptor(release.handoff, "dist/release.json");
  validateReleasePayloadTopology(release);
  const distributionPackage = JSON.parse(fs.readFileSync(DISTRIBUTION_PACKAGE_PATH, "utf8"));
  assertPublishedMain(distributionPackage);
  if (!Array.isArray(distributionPackage.files) || distributionPackage.files.join("|") !== ".ia.rules/|AGENTS.md|INIT-REPO.md|release.json") {
    throw new Error("dist/package.json.files fora da allowlist de release.");
  }
  const policy = distributionPackage["agentsGovernance"];
  if (!policy || policy.schema !== 1 || !Array.isArray(policy.managedScriptPrefixes) ||
    !Array.isArray(policy.managedScripts) || !Array.isArray(policy.dependencies) ||
    !Array.isArray(policy.optionalDependencies) || !distributionPackage.scripts ||
    !distributionPackage.scripts["agent:autoupdate"] || !distributionPackage.scripts["agents:autoupdate"] ||
    !distributionPackage.scripts["agent:agents"] || !distributionPackage.scripts["agents:update"] ||
    !distributionPackage.scripts["update:agents"] || !distributionPackage.scripts["shared:update:agents"] ||
    !distributionPackage.scripts.release || !distributionPackage.scripts.publish ||
    !policy.managedScriptPrefixes.includes("shared:")) {
    throw new Error("dist/package.json nao contem contrato executavel de governanca.");
  }
}

/** Executa assertNativeDocumentation no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertNativeDocumentation(content, label) {
  const declarations = [
    /(^|\n)([ \t]*)(?:async[ \t]+)?function[ \t]+\*?[ \t]*([A-Za-z_$][\w$]*)[ \t]*\(/gu,
    /(^|\n)([ \t]*)class[ \t]+([A-Za-z_$][\w$]*)\b/gu,
  ];
  for (const declaration of declarations) for (const match of content.matchAll(declaration)) {
    const before = content.slice(0, match.index + match[1].length).trimEnd();
    if (!/\/\*\*[^]*?\*\/$/u.test(before)) {
      throw new Error(`DOCUMENTACAO_NATIVA_AUSENTE:${label}:${match[3]}`);
    }
  }
}

/** Executa validateDistributionProfiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateDistributionProfiles(release, distributionMap) {
  const mapEntries = new Map(distributionMap.entries.map((entry) => [entry.path, entry]));
  for (const entry of release.files) {
    if (!SOURCE_DISTRIBUTION_PROFILES.has(entry.profile) || entry.profile === "builder-internal") {
      throw new Error(`RELEASE_PERFIL_INVALIDO:${entry.path}`);
    }
    const mapped = mapEntries.get(entry.path);
    if (!mapped || mapped.profile !== entry.profile) {
      throw new Error(`RELEASE_MAPA_PERFIL_DIVERGENTE:${entry.path}`);
    }
  }
  for (const entry of release.update.files) {
    if (!SOURCE_DISTRIBUTION_PROFILES.has(entry.profile) || entry.profile === "builder-internal") {
      throw new Error(`UPDATE_PERFIL_INVALIDO:${entry.path}`);
    }
  }
}

/** Executa validateDistributionMapCompleteness no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateDistributionMapCompleteness(distributionMap) {
  const declared = new Set(distributionMap.entries.map((entry) => entry.path));
  for (const filePath of listFiles(DIST_DIR)) {
    const relativePath = toPosix(path.relative(DIST_DIR, filePath));
    if (/^agents-v.+\.zip$/u.test(relativePath)) continue;
    if (!declared.has(relativePath)) {
      throw new Error(`MAPA_DISTRIBUICAO_OMITE_ARQUIVO:${relativePath}`);
    }
  }
}

/** Executa validateReleasePayloadTopology no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateReleasePayloadTopology(release) {
  const directories = new Set();
  for (const filePath of listFiles(DIST_DIR)) {
    const relativePath = toPosix(path.relative(DIST_DIR, filePath));
    if (relativePath.includes(LEGACY_RULES_ROOT)) throw new Error(`PAYLOAD_LEGADO_PROIBIDO:${relativePath}`);
    const segments = relativePath.split("/");
    if (segments.length > 1) directories.add(segments[0]);
  }
  if ([...directories].some((directory) => directory !== ".ia.rules")) {
    throw new Error(`DIRETORIO_PAYLOAD_PROIBIDO:${[...directories].sort().join(",")}`);
  }
  for (const entry of [...release.files, ...release.update.files]) {
    if (entry.path.includes(LEGACY_RULES_ROOT)) throw new Error(`MANIFESTO_LEGADO_PROIBIDO:${entry.path}`);
    const segments = entry.path.split("/");
    if (segments.length > 1 && segments[0] !== ".ia.rules") throw new Error(`MANIFESTO_FORA_ALLOWLIST:${entry.path}`);
  }
}

/** Executa validateGovernanceManifest no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateGovernanceManifest(manifest, label) {
  const format = JSON.parse(fs.readFileSync(UPDATE_FORMAT_PATH, "utf8"));
  if (!manifest || manifest.format !== format.format || manifest.schema !== format.version ||
    manifest.marker !== format.marker || !Array.isArray(manifest.files) || manifest.files.length === 0) {
    throw new Error(`${label} sem manifesto de atualizacao valido.`);
  }
  const paths = new Set();
  for (const entry of manifest.files) {
    if (!entry || !entry.path || !entry.sha256 || paths.has(entry.path)) {
      throw new Error(`${label} possui entrada de atualizacao invalida.`);
    }
    paths.add(entry.path);
  }
}

/** Executa cleanGeneratedArtifacts no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa repairGeneratedArtifacts no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function repairGeneratedArtifacts() {
  const index = buildIndex();
  writeJsonMinified(INDEX_PATH, index);
  runNodeScript(path.join(".ia.rules", "core", "runtime", "scripts", "generate-agents-status.js"));
  const dist = buildDist();
  return ok("REPAIR_OK", {
    archive: dist.archive,
    files: index.files.length,
    handoff: "handoff.md",
  });
}

/** Executa setup no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function setup() {
  const published = fs.existsSync(path.join(ROOT_DIR, ".ia.rules"));
  const required = published
    ? ["package.json", "AGENTS.md", path.join(".ia.rules", "core", "contracts.md")]
    : ["package.json", "README.md", "RCF.md", "AGENTS.md", path.join(".ia.rules", "continue.ia")];
  const missing = required.filter((entry) => !fs.existsSync(path.join(ROOT_DIR, entry)));
  return ok(missing.length ? "SETUP_DEGRADED" : "SETUP_OK", { missing });
}

/** Executa doctor no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function doctor() {
  const scripts = readPackageScripts();
  const commandSummary = summarizeCommands(scripts);
  const published = fs.existsSync(path.join(ROOT_DIR, ".ia.rules"));
  const requiredFiles = published
    ? ["AGENTS.md", "package.json", path.join(".ia.rules", "core", "contracts.md")]
    : ["README.md", "RCF.md", "AGENTS.md", "package.json", "index.json", path.join(".ia.rules", "continue.ia")];
  const missing = requiredFiles.filter((entry) => !fs.existsSync(path.join(ROOT_DIR, entry)));
  const git = runProcess("git", ["status", "--short"], { optional: true });
  return ok(missing.length ? "DOCTOR_DEGRADED" : "DOCTOR_OK", {
    commands: commandSummary,
    dirty: Boolean((git.stdout || "").trim()),
    missing,
  });
}

/** Executa context no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function context() {
  const index = buildIndex();
  const log = runProcess("git", ["log", "--oneline", "-5"], { optional: true }).stdout.trim().split(/\r?\n/u).filter(Boolean);
  return ok("CONTEXT_OK", {
    branch: runProcess("git", ["branch", "--show-current"], { optional: true }).stdout.trim(),
    latestCommits: log,
    normativeFiles: index.files,
  });
}

/** Executa workspace no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function workspace() {
  return ok("WORKSPACE_OK", {
    files: runProcess("git", ["ls-files"], { optional: true }).stdout.trim().split(/\r?\n/u).filter(Boolean).slice(0, 200),
    status: runProcess("git", ["status", "--short"], { optional: true }).stdout.trim().split(/\r?\n/u).filter(Boolean),
  });
}

/** Executa docs no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function docs() {
  const docsFiles = ["README.md", "RCF.md", "AGENTS.md", "handoff.md"].filter((entry) => fs.existsSync(path.join(ROOT_DIR, entry)));
  return ok("DOCS_OK", { files: docsFiles });
}

/** Executa rcf no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function rcf() {
  const rcfPath = path.join(ROOT_DIR, "RCF.md");
  assertFile(rcfPath, "RCF.md ausente.");
  const content = fs.readFileSync(rcfPath, "utf8");
  const trace = validateRcfTraceIfPresent();
  return ok(content.includes("## 13.") && content.includes("## 20.") ? "RCF_OK" : "RCF_DEGRADED", {
    path: "RCF.md",
    bytes: Buffer.byteLength(content),
    trace,
  });
}

/** Valida mapa local de rastreabilidade quando o repositório o adota. */
function validateRcfTraceIfPresent() {
  const mapPath = path.join(ROOT_DIR, ".ia.rules", "state", "traceability", "rcf-map.json");
  if (!fs.existsSync(mapPath)) return { adopted: false };
  const result = runProcess(process.execPath, [
    path.join(ROOT_DIR, ".ia.rules", "core", "runtime", "scripts", "rcf-trace.js"),
    "validate",
  ]);
  return { adopted: true, result: JSON.parse(result.stdout) };
}

/** Executa lint no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function lint() {
  const scripts = listFiles(path.join(ROOT_DIR, "scripts")).filter((filePath) => path.extname(filePath) === ".js");
  for (const script of scripts) {
    runProcess(process.execPath, ["--check", script]);
  }
  return ok("LINT_OK", { scripts: scripts.length });
}

/** Executa typecheck no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function typecheck() {
  assertFile(TSCONFIG_PATH, "TSCONFIG_AUSENTE");
  const compiler = path.join(ROOT_DIR, "node_modules", "typescript", "bin", "tsc");
  assertFile(compiler, "TOOLCHAIN_TYPESCRIPT_INDISPONIVEL");
  runProcess(process.execPath, [compiler, "--project", TSCONFIG_PATH, "--pretty", "false"]);
  return ok("TYPECHECK_OK", { config: toPosix(path.relative(ROOT_DIR, TSCONFIG_PATH)), sources: listFiles(SOURCE_RULES_DIR).filter((file) => path.extname(file) === ".ts").length });
}

/** Executa o indexador Python com dependência local isolada e comportamento idêntico ao CI. */
function runNormativeGraph(args = ["--check"]) {
  const scriptPath = fs.existsSync(NORMATIVE_GRAPH_SOURCE_PATH) ? NORMATIVE_GRAPH_SOURCE_PATH : NORMATIVE_GRAPH_RUNTIME_PATH;
  assertFile(scriptPath, "INDEXADOR_NORMATIVO_AUSENTE");
  const pythonPath = path.join(ROOT_DIR, ".ia.rules", "cache", "python");
  const candidates = process.platform === "win32"
    ? [["python", []], ["py", ["-3"]]]
    : [["python3", []], ["python", []]];
  let last = null;
  for (const [command, prefix] of candidates) {
    const result = runProcess(command, [...prefix, scriptPath, ...args], {
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",
        PYTHONUTF8: "1",
        ...(fs.existsSync(pythonPath) ? {
          PYTHONPATH: [pythonPath, process.env.PYTHONPATH || ""].filter(Boolean).join(path.delimiter),
        } : {}),
      },
      optional: true,
    });
    if (!result.error && result.status === 0) {
      process.stdout.write(result.stdout);
      process.stderr.write(result.stderr);
      return 0;
    }
    last = result;
    if (!result.error || result.error.code !== "ENOENT") break;
  }
  throw new Error(`INDEXADOR_NORMATIVO_FALHOU:${last && (last.stderr || last.stdout || (last.error && last.error.message))}`);
}

/** Executa security no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function security() {
  const findings = [];
  for (const filePath of listFiles(ROOT_DIR)) {
    const relative = toPosix(path.relative(ROOT_DIR, filePath));
    if (SECURITY_SCAN_EXCLUDED_PREFIXES.some((prefix) => relative.startsWith(prefix)) ||
      SECURITY_SCAN_DEFINITION_FILES.has(relative)) {
      continue;
    }
    if (![".js", ".json", ".md"].includes(path.extname(filePath).toLocaleLowerCase("en-US"))) {
      continue;
    }
    const content = fs.readFileSync(filePath, "utf8");
    if (ALIEN_SCRIPT_TERMS.some((term) => content.toLocaleLowerCase("en-US").includes(term.toLocaleLowerCase("en-US")))) {
      findings.push(relative);
    }
  }
  return ok(findings.length ? "SECURITY_DEGRADED" : "SECURITY_OK", { findings });
}

/** Executa deps no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function deps() {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
  return ok("DEPS_OK", {
    dependencies: Object.keys(pkg.dependencies || {}).length,
    devDependencies: Object.keys(pkg.devDependencies || {}).length,
    optionalDependencies: Object.keys(pkg.optionalDependencies || {}).length,
  });
}

/** Executa licenses no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function licenses() {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
  return ok("LICENSES_OK", { license: pkg.license || "" });
}

/** Executa gitLastRelease no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function gitLastRelease() {
  const result = runProcess("git", ["log", "--grep=^release:", "--format=%H %s", "-1"], { optional: true });
  return ok(result.stdout.trim() ? "GIT_LAST_RELEASE_OK" : "GIT_LAST_RELEASE_EMPTY", {
    commit: result.stdout.trim(),
  });
}

/** Executa gitReleaseNotes no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function gitReleaseNotes() {
  const last = runProcess("git", ["log", "--grep=^release:", "--format=%H", "-1"], { optional: true }).stdout.trim();
  const range = last ? `${last}..HEAD` : "HEAD";
  const log = runProcess("git", ["log", "--oneline", range], { optional: true }).stdout.trim().split(/\r?\n/u).filter(Boolean);
  return ok("GIT_RELEASE_NOTES_OK", { commits: log });
}

/** Executa releaseLocal no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function releaseLocal(args = []) {
  const release = resolveRelease(args[0] || "");
  const prepare = runReleaseHook("prepare", release);
  const notes = buildReleaseNotes(release.version);
  const result = buildDist({ releaseMetadata: release, releaseNotes: notes, version: release.version });
  const packageRegistry = runPackageRegistryLifecycle("release", { ...release, ...result, packageRegistry: CONFIGURATION.packageRegistry || {} }, { rootDir: ROOT_DIR });
  const verify = runReleaseHook("verify", { ...release, ...result });
  return ok("RELEASE_OK", { ...result, inference: release.inference, packageRegistry, prepare, verify });
}

/** Executa releaseTrigger no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function releaseTrigger(args = []) {
  const requestedVersion = String(args[0] || "").trim();
  if (!requestedVersion) {
    console.error("PARAMETRO_NORMATIVO_AUSENTE:version");
    return 4;
  }

  const release = resolveRelease(requestedVersion);
  const targetPath = path.join(ROOT_DIR, "release");
  let replacedPublishedTrigger = false;
  if (fs.existsSync(targetPath)) {
    const existingVersion = normalizeReleaseVersion(fs.readFileSync(targetPath, "utf8"));
    const published = existingVersion
      ? runProcess("git", ["rev-parse", "--verify", `refs/tags/v${existingVersion}`], { optional: true }).status === 0
      : false;
    const decision = resolveExistingReleaseTrigger(existingVersion, release.version, published);
    if (decision === "preserve") {
      return ok("RELEASE_TRIGGER_EXISTENTE", {
        file: "release",
        inference: release.inference,
        reused: true,
        version: release.version,
      });
    }
    if (decision === "conflict") {
      throw new Error(`GATILHO_RELEASE_PENDENTE:release=${existingVersion || "invalido"};solicitada=${release.version}`);
    }
    replacedPublishedTrigger = true;
  }
  fs.writeFileSync(targetPath, `${release.version}\n`, "utf8");
  return ok("RELEASE_TRIGGER_OK", {
    file: "release",
    inference: release.inference,
    replacedPublishedTrigger,
    version: release.version,
  });
}

/** Executa runGitReadOnly no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function runGitReadOnly(args) {
  const result = runProcess("git", args, { optional: true });
  process.stdout.write(limitOutput(result.stdout || ""));
  if (result.stderr) {
    process.stderr.write(limitOutput(result.stderr));
  }
  return result.status || 0;
}

/** Executa printStatus no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa summarizeCommands no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function summarizeCommands(scripts) {
  return CANONICAL_COMMANDS.reduce((acc, command) => {
    const status = commandStatus(command, scripts);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}

/** Executa commandStatus no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function commandStatus(command, scripts) {
  if (COMMANDS[command] && scripts[command]) {
    return "available";
  }
  if (CANONICAL_COMMANDS.includes(command) && scripts[command]) {
    return "degraded";
  }
  return "n/a";
}

/** Executa commandReason no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa runDegraded no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa runNodeScript no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function runNodeScript(relativePath, args = []) {
  const result = runProcess(process.execPath, [path.join(ROOT_DIR, relativePath), ...args]);
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  return result.status;
}

/** Executa runProcess no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function runProcess(command, args, options = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd: ROOT_DIR,
    encoding: "utf8",
    env: options.env || process.env,
    shell: false,
  });
  if (!options.optional && result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} falhou: ${result.stderr || result.stdout}`);
  }
  return result;
}

/** Executa releaseRelativePath no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function releaseRelativePath(sourcePath) {
  const relative = toPosix(sourcePath).replace(/^src\//u, "");
  return relative.toLocaleLowerCase("en-US") === "agents.md" ? "AGENTS.md" : relative;
}

/** Executa resolveArchiveName no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function resolveArchiveName(versionOverride = "") {
  return `agents-v${normalizeReleaseVersion(versionOverride || readPackageVersion())}.zip`;
}

/** Executa readPackageVersion no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function readPackageVersion() {
  const pkg = fs.existsSync(PACKAGE_PATH) ? JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8")) : {};
  return normalizeReleaseVersion(pkg.version || "0.0.0-beta");
}

/** Executa resolveRelease no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function resolveRelease(value) {
  const raw = String(value || "").trim();
  const commit = runProcess("git", ["rev-parse", "HEAD"]).stdout.trim();
  const baseTag = findLatestReleaseTag();
  const explicit = Boolean(raw);
  let version;
  let inference;

  if (explicit) {
    version = normalizeReleaseVersion(raw);
    inference = "explicit";
  } else if (baseTag) {
    version = inferVersionFromCommits(baseTag);
    inference = `conventional:${baseTag}`;
  } else {
    const lastMarker = runProcess("git", ["log", "--grep=^release:", "--format=%H", "-1"], { optional: true }).stdout.trim();
    if (lastMarker) {
      throw new Error("VERSAO_NAO_INFERIVEL: marcador release sem tag correspondente.");
    }
    version = readPackageVersion();
    inference = "manifesto-inicial";
  }

  assertReleaseTagAvailable(version);
  return { baseTag, commit, explicit, inference, version };
}

/** Executa findLatestReleaseTag no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function findLatestReleaseTag() {
  const tags = runProcess("git", ["tag", "--merged", "HEAD", "--sort=-version:refname"], { optional: true }).stdout
    .trim()
    .split(/\r?\n/u)
    .filter(Boolean);
  return tags.find((tag) => /^v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(tag)) || "";
}

/** Executa assertReleaseTagAvailable no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertReleaseTagAvailable(version) {
  const tag = `v${version}`;
  const exists = runProcess("git", ["rev-parse", "--verify", `refs/tags/${tag}`], { optional: true });
  if (exists.status === 0) {
    throw new Error(`VERSAO_JA_PUBLICADA:${tag}`);
  }
}

/** Executa inferVersionFromCommits no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function inferVersionFromCommits(baseTag) {
  const base = normalizeReleaseVersion(baseTag.replace(/^v/u, ""));
  if (base.includes("-")) {
    throw new Error("VERSAO_NAO_INFERIVEL: tag base de pre-release exige versao explicita.");
  }
  const records = runProcess("git", ["log", "--format=%s%x1f%b%x1e", `${baseTag}..HEAD`]).stdout
    .split("\x1e")
    .map((record) => record.trim())
    .filter(Boolean);
  if (records.length === 0) {
    throw new Error("VERSAO_NAO_INFERIVEL: sem commits apos a ultima tag.");
  }

  let level = "";
  for (const record of records) {
    const [subject, body = ""] = record.split("\x1f");
    const match = subject.match(/^(feat|fix|perf)(?:\([^)]*\))?(!)?:\s/u);
    if (!match) {
      throw new Error(`VERSAO_NAO_INFERIVEL: commit sem convencao semantica: ${subject}`);
    }
    if (match[2] || /BREAKING[ -]CHANGE:/iu.test(body)) {
      level = "major";
    } else if (level !== "major" && match[1] === "feat") {
      level = "minor";
    } else if (!level) {
      level = "patch";
    }
  }
  return incrementReleaseVersion(base, level);
}

/** Executa incrementReleaseVersion no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function incrementReleaseVersion(version, level) {
  const [major, minor, patch] = normalizeReleaseVersion(version).split("-")[0].split(".").map(Number);
  if (level === "major") return `${major + 1}.0.0`;
  if (level === "minor") return `${major}.${minor + 1}.0`;
  if (level === "patch") return `${major}.${minor}.${patch + 1}`;
  throw new Error("VERSAO_NAO_INFERIVEL: nivel semantico ausente.");
}

/** Executa normalizeReleaseVersion no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa buildReleaseNotes no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

  const issues = releaseIssueLinks(version);
  if (issues.length) {
    lines.push("", "Issues corrigidas:");
    for (const issue of issues) lines.push(`- ${issue.ft}: ${issue.id}`);
  }

  return lines.join("\n");
}

/** Executa releaseIssueLinks no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function releaseIssueLinks(version) {
  const memoryPath = path.join(ROOT_DIR, ".ia.rules", "continue.ia");
  if (!fs.existsSync(memoryPath) || !version) return [];
  return fs.readFileSync(memoryPath, "utf8").split(/(?=^FT-\d+\|)/mu).map((block) => {
    const ft = (block.match(/^(FT-\d+)\|.*\|status=concluido(?:\||$)/mu) || [])[1];
    const id = (block.match(/^issue_id=([^\r\n]+)/mu) || [])[1];
    const bound = (block.match(/^release=([^\r\n]+)/mu) || [])[1];
    return ft && id && bound === version ? { ft, id } : null;
  }).filter(Boolean).sort((left, right) => left.id.localeCompare(right.id));
}

/** Executa readPackageScripts no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function readPackageScripts() {
  if (!fs.existsSync(PACKAGE_PATH)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8")).scripts || {};
}

/** Executa cleanDirectory no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { force: true, maxRetries: 20, recursive: true, retryDelay: 250 });
    } catch (error) {
      if (!new Set(["ENOTEMPTY", "EPERM", "EBUSY"]).has(error.code) || !fs.existsSync(dirPath)) {
        throw error;
      }

      // FIX-BUG: Windows pode manter o ZIP ou o diretorio transitoriamente bloqueado apos a geracao.
      for (const entry of fs.readdirSync(dirPath)) {
        fs.rmSync(path.join(dirPath, entry), { force: true, maxRetries: 20, recursive: true, retryDelay: 250 });
      }
      fs.rmSync(dirPath, { force: true, maxRetries: 20, recursive: true, retryDelay: 250 });
    }
  }
}

/** Executa listFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa writeJsonMinified no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function writeJsonMinified(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value), "utf8");
}

/** Executa hashTextFile no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function hashTextFile(filePath) {
  return hashTextBuffer(fs.readFileSync(filePath));
}

/** Executa hashTextBuffer no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function hashTextBuffer(buffer) {
  return crypto.createHash("sha256").update(Buffer.from(buffer.toString("utf8").replace(/\r\n/gu, "\n"), "utf8")).digest("hex");
}

/** Executa assertDirectory no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertDirectory(dirPath, message) {
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(message);
  }
}

/** Executa assertFile no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertFile(filePath, message) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(message);
  }
}

/** Executa compactOperationalContext no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function compactOperationalContext() {
  const memoryPath = path.join(ROOT_DIR, ".ia.rules", "continue.ia");
  const handoffPath = path.join(ROOT_DIR, "handoff.md");
  assertFile(memoryPath, ".ia.rules/continue.ia ausente.");
  const result = runProcess(process.execPath, [path.join(ROOT_DIR, ".ia.rules", "core", "runtime", "scripts", "generate-agents-status.js")]);
  if (result.status !== 0) {
    throw new Error("Falha ao gerar projecao compacta do estado operacional.");
  }
  assertFile(handoffPath, "handoff.md ausente apos compactacao operacional.");
  const activeFronts = fs.readFileSync(memoryPath, "utf8")
    .split(/\r?\n/u)
    .filter((line) => /^FT-\d+\|.*\|status=em_andamento\b/u.test(line))
    .map((line) => line.split("|")[0]);
  return ok("COMPACT_OK", { activeFronts, canonical: ".ia.rules/continue.ia", projection: "handoff.md" });
}

/** Executa assertPublishedNorms no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertPublishedNorms(index) {
  // FIX-BUG: valida produto fonte/publicado sem contaminar a governanca ativa.
  for (const file of index.files) {
    const sourcePath = path.join(ROOT_DIR, file.path);
    const publishedPath = path.join(DIST_DIR, file.destination);
    assertFile(sourcePath, `Fonte normativa ausente: ${toPosix(file.path)}.`);
    assertFile(publishedPath, `Norma publicada ausente: ${toPosix(path.relative(ROOT_DIR, publishedPath))}.`);
    const expected = file.artifact
      ? distributionContent({ artifact: true, generatedFrom: file.generatedFrom, sourcePath: file.path })
      : fs.readFileSync(sourcePath);
    if (hashTextBuffer(expected) !== hashTextFile(publishedPath)) {
      throw new Error(`Paridade fonte/publicado divergente: ${toPosix(file.path)}.`);
    }
  }
}

/** Executa assertPublishedMain no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertPublishedMain(distributionPackage) {
  if (distributionPackage.main !== "AGENTS.md") {
    throw new Error("dist/package.json.main deve apontar para AGENTS.md na raiz publicada.");
  }
  assertFile(path.join(DIST_DIR, distributionPackage.main), "Entrada principal publicada ausente em dist/AGENTS.md.");
}

/** Executa ok no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function ok(code, data) {
  console.log(JSON.stringify({ code, ...data }));
  return 0;
}

/** Executa limitOutput no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function limitOutput(value) {
  const lines = String(value || "").replace(/\x1b\[[0-9;]*m/gu, "").split(/\r?\n/u).slice(0, 50);
  const text = lines.join("\n");
  return text.length > 8192 ? text.slice(0, 8192) : text;
}

/** Executa toPosix no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function toPosix(value) {
  return String(value || "").split(path.sep).join("/");
}

/** Executa isManagedScriptPath no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function isManagedScriptPath(filePath) {
  const relativePath = releaseRelativePath(toPosix(path.relative(ROOT_DIR, filePath)));
  return relativePath.startsWith(".ia.rules/core/runtime/scripts/")
    || relativePath.startsWith(".ia.rules/core/update/migrations/")
    || /^\.ia.rules\/scenarios\/[^/]+\/scripts\//u.test(relativePath);
}

/** Executa isManagedDistributionFile no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function isManagedDistributionFile(filePath) {
  const relativePath = releaseRelativePath(toPosix(path.relative(ROOT_DIR, filePath)));
  return (new Set([".js", ".ts"]).has(path.extname(filePath).toLocaleLowerCase("en-US")) && isManagedScriptPath(filePath))
    || relativePath === ".ia.rules/package.json"
    || relativePath === ".ia.rules/core/runtime/scripts/package.json";
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
  buildDistributionPackage,
  buildIndex,
  isManagedDistributionFile,
  isManagedScriptPath,
  main,
  resolveExistingReleaseTrigger,
  resolveRelease,
  validateSourceDistributionManifest,
  validateDist,
  verify,
};
