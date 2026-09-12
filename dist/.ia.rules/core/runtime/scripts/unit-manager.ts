// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const RUNTIME_ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const ROOT_DIR = fs.existsSync(path.join(RUNTIME_ROOT, "package.json")) ? RUNTIME_ROOT : path.resolve(RUNTIME_ROOT, "..");
const CATALOG_PATH = path.join(ROOT_DIR, ".ia.rules", "units", "catalog.json");
const STATE_PATH = path.join(ROOT_DIR, ".ia.rules", "state", "units-installed.json");
const LOCK_PATH = path.join(ROOT_DIR, ".ia.rules", "state", "locks", "units.lock");

/** Normaliza path relativo e rejeita escapes da fronteira do repositório. */
function safeRelative(value) {
  const normalized = String(value || "").replace(/\\/gu, "/").replace(/^\.\//u, "");
  if (!normalized || path.isAbsolute(normalized) || normalized === ".." || normalized.startsWith("../") || normalized.includes("/../")) {
    throw new Error(`UNIT_PATH_INSEGURO:${value}`);
  }
  return normalized;
}

/** Produz SHA-256 normalizado para comparação reproduzível. */
function sha256(content) {
  return crypto.createHash("sha256").update(Buffer.isBuffer(content) ? content : Buffer.from(String(content), "utf8")).digest("hex");
}

/** Carrega e valida o catálogo mínimo de unidades distribuíveis. */
function loadCatalog(rootDir = ROOT_DIR) {
  const runtimePath = path.join(rootDir, ".ia.rules", "units", "catalog.json");
  const sourcePath = path.join(rootDir, "src", ".ia.rules", "units", "catalog.json");
  const catalogPath = fs.existsSync(runtimePath) ? runtimePath : sourcePath;
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  if (catalog.schema !== "agents-unit-catalog/v1" || catalog.version !== 1 || catalog.generated !== false || !Array.isArray(catalog.units)) {
    throw new Error("UNIT_CATALOG_INVALIDO");
  }
  const ids = new Set();
  for (const unit of catalog.units) {
    if (!unit || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(unit.id) || !["skill", "subagent"].includes(unit.kind) || ids.has(unit.id)) {
      throw new Error(`UNIT_CATALOG_ENTRADA_INVALIDA:${unit && unit.id}`);
    }
    ids.add(unit.id);
    safeRelative(unit.descriptor);
    safeRelative(unit.source);
    for (const destination of Object.values(unit.destinations || {})) safeRelative(destination);
  }
  Object.defineProperty(catalog, "baseDir", { value: path.dirname(path.dirname(path.dirname(catalogPath))), enumerable: false });
  return catalog;
}

/** Valida estruturalmente descriptor de Skill ou Subagent e seus limites essenciais. */
function validateDescriptor(descriptor, kind) {
  const skill = kind === "skill";
  const expected = skill ? "agents-skill-descriptor/v1" : "agents-subagent-descriptor/v1";
  const id = skill ? descriptor.name : descriptor.id;
  const arrays = skill
    ? ["positiveTriggers", "negativeTriggers", "roles", "requires", "resources", "scripts", "hooks", "permissions", "effects", "validation", "clients"]
    : ["positiveTriggers", "negativeTriggers", "roles", "tools", "permissions", "read", "write", "requires", "stopConditions", "states", "effects", "validation", "clients"];
  if (!descriptor || descriptor.schema !== expected || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/u.test(id || "") || !descriptor.description || !descriptor.version) {
    throw new Error(`UNIT_DESCRIPTOR_INVALIDO:${id || kind}`);
  }
  for (const field of arrays) {
    if (!Array.isArray(descriptor[field]) || new Set(descriptor[field]).size !== descriptor[field].length) {
      throw new Error(`UNIT_DESCRIPTOR_CAMPO_INVALIDO:${id}:${field}`);
    }
  }
  if (!skill && descriptor.write.length !== 0) throw new Error(`SUBAGENT_PRIVILEGIO_EXCESSIVO:${id}`);
  return descriptor;
}

/** Lê metadados mínimos do frontmatter sem introduzir parser YAML oculto. */
function parseSkillFrontmatter(content) {
  const match = String(content).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/u);
  if (!match) throw new Error("SKILL_FRONTMATTER_AUSENTE");
  const metadata = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const field = line.match(/^([a-z][a-z0-9_-]*):\s*(.+)$/u);
    if (field) metadata[field[1]] = field[2].trim();
  }
  if (!metadata.name || !metadata.description) throw new Error("SKILL_FRONTMATTER_INVALIDO");
  return metadata;
}

/** Descobre unidades por gatilhos positivos e bloqueia falsos positivos explícitos. */
function discoverUnits(query, rootDir = ROOT_DIR) {
  const normalized = String(query || "").normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLocaleLowerCase("pt-BR");
  const catalog = loadCatalog(rootDir);
  return catalog.units.flatMap((unit) => {
    const descriptor = validateDescriptor(JSON.parse(fs.readFileSync(path.join(catalog.baseDir, safeRelative(unit.descriptor)), "utf8")), unit.kind);
    const norm = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLocaleLowerCase("pt-BR");
    const blocked = descriptor.negativeTriggers.some((trigger) => normalized.includes(norm(trigger)));
    const matches = descriptor.positiveTriggers.filter((trigger) => normalized.includes(norm(trigger)));
    return !blocked && matches.length ? [{ id: unit.id, kind: unit.kind, matches }] : [];
  });
}

/** Inventaria scripts e cenários por chamadas estáticas, estado, determinismo e paralelismo. */
function inventoryMechanisms(rootDir = ROOT_DIR) {
  const catalog = loadCatalog(rootDir);
  const rulesRoot = path.join(catalog.baseDir, ".ia.rules");
  const walk = (directory) => fs.existsSync(directory) ? fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  }) : [];
  const scripts = walk(path.join(rulesRoot, "core", "runtime", "scripts"))
    .concat(walk(path.join(rulesRoot, "scenarios")).filter((file) => path.extname(file) === ".ts"))
    .filter((file) => path.extname(file) === ".ts");
  const scenarios = walk(path.join(rulesRoot, "scenarios")).filter((file) => path.extname(file) === ".md");
  const corpusFiles = walk(rulesRoot).filter((file) => [".ts", ".md", ".json"].includes(path.extname(file)));
  const corpus = corpusFiles.map((file) => fs.readFileSync(file, "utf8"));
  const entry = (file, kind) => {
    const content = fs.readFileSync(file, "utf8");
    const stem = path.basename(file, path.extname(file));
    const calls = corpus.reduce((count, text) => count + (text.match(new RegExp(stem.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "gu")) || []).length, 0) - 1;
    return {
      path: path.relative(catalog.baseDir, file).replace(/\\/gu, "/"), kind,
      classification: kind === "script" ? "manter-script" : "manter-cenario",
      staticReferences: Math.max(0, calls), deterministic: kind === "script",
      stateful: /(?:writeFile|rename|appendFile|spawn|execFile)/u.test(content),
      parallelizable: /(?:Promise\.all|spawn|worker|parallel)/iu.test(content),
      duration: { observed: false, profile: /(?:build|release|publish|test|long-running)/iu.test(file) ? "potencialmente-longo" : "curto-ou-desconhecido" },
    };
  };
  return {
    schema: "agents-mechanism-inventory/v1", generatedAt: new Date().toISOString(),
    entries: [...scripts.map((file) => entry(file, "script")), ...scenarios.map((file) => entry(file, "scenario"))]
      .sort((left, right) => left.path.localeCompare(right.path, "en")),
    decisions: {
      maintainScripts: scripts.length, maintainScenarios: scenarios.length,
      encapsulateSkills: ["governed-state", "visual-evidence"], delegateSubagents: ["validation-audit"],
      rejected: ["uma Skill por script", "conversão nominal de Cenário", "Subagent para fluxo curto ou sequencial"],
    },
  };
}

/** Lista arquivos regulares de uma unidade em ordem estável. */
function listUnitFiles(rootDir, unit, client) {
  if (unit.kind === "subagent") {
    const extension = client === "codex" ? ".toml" : ".agent.md";
    const source = path.join(rootDir, safeRelative(unit.source), client, `${unit.id}${extension}`);
    return [{ source, relative: path.basename(unit.destinations[client]) }];
  }
  const sourceRoot = path.join(rootDir, safeRelative(unit.source));
  const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [{ source: absolute, relative: path.relative(sourceRoot, absolute) }];
  });
  return walk(sourceRoot).sort((a, b) => a.relative.localeCompare(b.relative, "en"));
}

/** Calcula plano revisável sem alterar destino. */
function planInstallation(rootDir, unitId, client) {
  const catalog = loadCatalog(rootDir);
  const unit = catalog.units.find((candidate) => candidate.id === unitId);
  if (!unit) throw new Error(`UNIT_AUSENTE:${unitId}`);
  if (!unit.destinations[client]) throw new Error(`CLIENTE_NAO_SUPORTADO:${client}`);
  const descriptor = validateDescriptor(JSON.parse(fs.readFileSync(path.join(catalog.baseDir, unit.descriptor), "utf8")), unit.kind);
  if (!descriptor.clients.includes(client)) throw new Error(`CLIENTE_NAO_DECLARADO:${unitId}:${client}`);
  if (unit.kind === "skill") {
    const skill = fs.readFileSync(path.join(catalog.baseDir, unit.source, "SKILL.md"), "utf8");
    const metadata = parseSkillFrontmatter(skill);
    if (metadata.name !== unit.id) throw new Error(`SKILL_NOME_DIVERGENTE:${unit.id}`);
  }
  const destinationRoot = path.join(rootDir, safeRelative(unit.destinations[client]));
  const files = listUnitFiles(catalog.baseDir, unit, client).map((entry) => {
    const target = unit.kind === "skill" ? path.join(destinationRoot, entry.relative) : destinationRoot;
    const content = fs.readFileSync(entry.source);
    const previous = fs.existsSync(target) ? fs.readFileSync(target) : null;
    return {
      action: previous ? (sha256(previous) === sha256(content) ? "unchanged" : "update") : "create",
      sha256: sha256(content), source: path.relative(catalog.baseDir, entry.source).replace(/\\/gu, "/"),
      target: path.relative(rootDir, target).replace(/\\/gu, "/"), content,
    };
  });
  return { client, unit: unitId, kind: unit.kind, files };
}

/** Adquire lock exclusivo, sem espera infinita. */
function acquireLock(rootDir) {
  const lockPath = path.join(rootDir, ".ia.rules", "state", "locks", "units.lock");
  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  try { return { handle: fs.openSync(lockPath, "wx"), path: lockPath }; } catch (error) { throw new Error(`UNIT_LOCK_OCUPADO:${error.code}`); }
}

/** Grava arquivo por temporário, fsync e rename atômico. */
function atomicWrite(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const temporary = `${target}.tmp-${process.pid}-${crypto.randomBytes(4).toString("hex")}`;
  const handle = fs.openSync(temporary, "wx");
  try { fs.writeFileSync(handle, content); fs.fsyncSync(handle); } finally { fs.closeSync(handle); }
  fs.renameSync(temporary, target);
}

/** Carrega a posse gerenciada persistida, sem inferi-la do conteúdo. */
function readManagedState(rootDir) {
  const target = path.join(rootDir, path.relative(ROOT_DIR, STATE_PATH));
  return fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, "utf8")) : { schema: "agents-unit-state/v1", files: {} };
}

/** Aplica plano transacional, preservando bytes não gerenciados e backup recuperável. */
function applyInstallation(rootDir, unitId, client) {
  const lock = acquireLock(rootDir);
  try {
    const plan = planInstallation(rootDir, unitId, client);
    const state = readManagedState(rootDir);
    const backupRoot = path.join(rootDir, ".ia.rules", "state", "backups", "units", `${Date.now()}-${unitId}-${client}`);
    for (const file of plan.files) {
      const target = path.join(rootDir, file.target);
      if (fs.existsSync(target) && state.files[file.target] !== sha256(fs.readFileSync(target)) && file.action !== "unchanged") {
        throw new Error(`UNIT_DESTINO_NAO_GERENCIADO:${file.target}`);
      }
      if (fs.existsSync(target) && file.action === "update") {
        const backup = path.join(backupRoot, file.target);
        fs.mkdirSync(path.dirname(backup), { recursive: true });
        fs.copyFileSync(target, backup);
      }
      if (file.action !== "unchanged") atomicWrite(target, file.content);
      state.files[file.target] = file.sha256;
    }
    atomicWrite(path.join(rootDir, ".ia.rules", "state", "units-installed.json"), `${JSON.stringify(state, null, 2)}\n`);
    return { ...plan, files: plan.files.map(({ content, ...file }) => file) };
  } finally { fs.closeSync(lock.handle); fs.rmSync(lock.path, { force: true }); }
}

/** Remove somente arquivos cujo hash ainda coincide com a posse gerenciada. */
function removeInstallation(rootDir, unitId, client) {
  const plan = planInstallation(rootDir, unitId, client);
  const state = readManagedState(rootDir);
  for (const file of plan.files) {
    const target = path.join(rootDir, file.target);
    if (!fs.existsSync(target)) continue;
    if (state.files[file.target] !== sha256(fs.readFileSync(target))) throw new Error(`UNIT_REMOCAO_CONFLITO:${file.target}`);
    fs.rmSync(target); delete state.files[file.target];
  }
  atomicWrite(path.join(rootDir, ".ia.rules", "state", "units-installed.json"), `${JSON.stringify(state, null, 2)}\n`);
  return { client, unit: unitId, removed: plan.files.map((file) => file.target) };
}

/** Executa CLI explícita para validação, descoberta, plano, instalação ou remoção. */
function main(argv = process.argv.slice(2)) {
  const [command, unitOrQuery, client] = argv;
  if (command === "validate") {
    const catalog = loadCatalog();
    for (const unit of catalog.units) validateDescriptor(JSON.parse(fs.readFileSync(path.join(catalog.baseDir, unit.descriptor), "utf8")), unit.kind);
    console.log(JSON.stringify({ code: "UNITS_OK", units: catalog.units.length })); return;
  }
  if (command === "discover") { console.log(JSON.stringify({ code: "UNITS_DISCOVERED", units: discoverUnits(unitOrQuery) })); return; }
  if (command === "inventory") { console.log(JSON.stringify(inventoryMechanisms(), null, 2)); return; }
  if (command === "plan") { const plan = planInstallation(ROOT_DIR, unitOrQuery, client); console.log(JSON.stringify({ ...plan, files: plan.files.map(({ content, ...file }) => file) }, null, 2)); return; }
  if (command === "install") { console.log(JSON.stringify(applyInstallation(ROOT_DIR, unitOrQuery, client), null, 2)); return; }
  if (command === "remove") { console.log(JSON.stringify(removeInstallation(ROOT_DIR, unitOrQuery, client), null, 2)); return; }
  throw new Error("Uso: unit-manager <validate|discover|inventory|plan|install|remove> [unidade|consulta] [codex|github-copilot]");
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { applyInstallation, discoverUnits, inventoryMechanisms, loadCatalog, parseSkillFrontmatter, planInstallation, removeInstallation, safeRelative, sha256, validateDescriptor };
