// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/core/runtime/scripts/workflow-manager.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
function resolveRoot(start = __dirname) {
  let current = path.resolve(start);
  while (path.dirname(current) !== current) {
    if (fs.existsSync(path.join(current, "AGENTS.md"))) return current;
    current = path.dirname(current);
  }
  throw new Error("RAIZ_REPOSITORIO_NAO_ENCONTRADA");
}
function sha256(content) {
  const normalized = (Buffer.isBuffer(content) ? content.toString("utf8") : String(content)).replace(/\r\n/gu, "\n").replace(/\r/gu, "\n");
  return crypto.createHash("sha256").update(normalized, "utf8").digest("hex");
}
function readJson(filePath, code) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${code}:${error.message}`);
  }
}
function safeRelative(value) {
  const normalized = String(value || "").replace(/\\/gu, "/").replace(/^\.\//u, "");
  if (!normalized || normalized === "." || normalized === ".." || normalized.startsWith("../") || normalized.includes("/../") || normalized.includes("//") || path.posix.isAbsolute(normalized) || /^[A-Za-z]:\//u.test(normalized)) throw new Error(`WORKFLOW_PATH_INSEGURO:${value}`);
  return normalized;
}
function loadCatalog(rootDir) {
  const sourceRoot = fs.existsSync(path.join(rootDir, ".ia.rules", "workflows", "index.json")) ? rootDir : path.join(rootDir, "src");
  const catalogPath = path.join(sourceRoot, ".ia.rules", "workflows", "index.json");
  const catalog = readJson(catalogPath, "WORKFLOW_INDICE_INVALIDO");
  if (!catalog || catalog.schema !== "agents-workflows/v1" || catalog.version !== 1 || !Array.isArray(catalog.workflows) || catalog.workflows.length === 0) throw new Error("WORKFLOW_INDICE_INVALIDO");
  const ids = /* @__PURE__ */ new Set();
  const destinations = /* @__PURE__ */ new Set();
  for (const item of catalog.workflows) {
    item.id = String(item.id || "").trim();
    item.source = safeRelative(item.source);
    item.destination = safeRelative(item.destination);
    if (!item.id || ids.has(item.id) || destinations.has(item.destination.toLocaleLowerCase("en-US")) || !item.purpose || !item.scope || !item.trigger || !Array.isArray(item.dependencies) || !Array.isArray(item.permissions) || !item.sha256 || item.install !== "managed-copy") {
      throw new Error(`WORKFLOW_ENTRADA_INVALIDA:${item.id || "sem-id"}`);
    }
    const sourcePath = path.join(sourceRoot, item.source);
    if (!fs.existsSync(sourcePath) || sha256(fs.readFileSync(sourcePath)) !== item.sha256) {
      throw new Error(`WORKFLOW_ORIGEM_DIVERGENTE:${item.id}`);
    }
    ids.add(item.id);
    destinations.add(item.destination.toLocaleLowerCase("en-US"));
  }
  Object.defineProperty(catalog, "sourceRoot", { enumerable: false, value: sourceRoot });
  return catalog;
}
function readInstalledState(rootDir) {
  const statePath = path.join(rootDir, ".ia.rules", "workflows", "installed.json");
  if (!fs.existsSync(statePath)) return { schema: "agents-workflows-installed/v1", workflows: [] };
  const state = readJson(statePath, "WORKFLOW_ESTADO_INVALIDO");
  if (!state || state.schema !== "agents-workflows-installed/v1" || !Array.isArray(state.workflows)) {
    throw new Error("WORKFLOW_ESTADO_INVALIDO");
  }
  return state;
}
function writeAtomic(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.agents-${process.pid}.tmp`;
  try {
    fs.writeFileSync(tempPath, content);
    fs.renameSync(tempPath, filePath);
  } finally {
    if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { force: true });
  }
}
function installWorkflows(rootDir, ids = [], options = {}) {
  const catalog = loadCatalog(rootDir);
  const selected = ids.length ? catalog.workflows.filter((item) => ids.includes(item.id)) : catalog.workflows;
  if (ids.some((id) => !selected.some((item) => item.id === id))) throw new Error(`WORKFLOW_DESCONHECIDO:${ids.join(",")}`);
  const previous = readInstalledState(rootDir);
  const previousById = new Map(previous.workflows.map((item) => [item.id, item]));
  const plan = [];
  for (const item of selected) {
    const sourcePath = path.join(catalog.sourceRoot, item.source);
    const destinationPath = path.join(rootDir, item.destination);
    const sourceContent = fs.readFileSync(sourcePath);
    const currentHash = fs.existsSync(destinationPath) ? sha256(fs.readFileSync(destinationPath)) : "";
    const prior = previousById.get(item.id);
    if (currentHash && currentHash !== item.sha256 && (!prior || currentHash !== prior.sha256)) {
      throw new Error(`WORKFLOW_CUSTOMIZACAO_CONFLITANTE:${item.id}:${item.destination}`);
    }
    plan.push({ destinationPath, item, sourceContent });
  }
  if (options.dryRun) return { changed: plan.filter((entry) => sha256(entry.sourceContent) !== (fs.existsSync(entry.destinationPath) ? sha256(fs.readFileSync(entry.destinationPath)) : "")).map((entry) => entry.item.id), dryRun: true };
  const backups = [];
  try {
    for (const entry of plan) {
      backups.push({
        content: fs.existsSync(entry.destinationPath) ? fs.readFileSync(entry.destinationPath) : null,
        path: entry.destinationPath
      });
      writeAtomic(entry.destinationPath, entry.sourceContent);
    }
    const merged = new Map(previous.workflows.map((item) => [item.id, item]));
    for (const entry of plan) merged.set(entry.item.id, {
      destination: entry.item.destination,
      id: entry.item.id,
      sha256: entry.item.sha256,
      source: entry.item.source,
      version: catalog.version
    });
    const state = {
      schema: "agents-workflows-installed/v1",
      workflows: [...merged.values()].sort((a, b) => a.id.localeCompare(b.id, "en"))
    };
    writeAtomic(path.join(rootDir, ".ia.rules", "workflows", "installed.json"), `${JSON.stringify(state, null, 2)}
`);
    return { changed: plan.map((entry) => entry.item.id), dryRun: false };
  } catch (error) {
    for (const backup of backups.reverse()) {
      if (backup.content === null) fs.rmSync(backup.path, { force: true });
      else writeAtomic(backup.path, backup.content);
    }
    throw error;
  }
}
function verifyInstalled(rootDir) {
  const catalog = loadCatalog(rootDir);
  const installed = readInstalledState(rootDir);
  const catalogById = new Map(catalog.workflows.map((item) => [item.id, item]));
  for (const record of installed.workflows) {
    const item = catalogById.get(record.id);
    const destinationPath = item && path.join(rootDir, item.destination);
    if (!item || record.sha256 !== item.sha256 || !fs.existsSync(destinationPath) || sha256(fs.readFileSync(destinationPath)) !== item.sha256) throw new Error(`WORKFLOW_INSTALADO_DIVERGENTE:${record.id}`);
  }
  return { available: catalog.workflows.length, installed: installed.workflows.length };
}
function main(argv = process.argv.slice(2), options = {}) {
  const rootDir = options.rootDir || resolveRoot();
  const command = argv[0] || "list";
  const ids = argv.slice(1).filter((arg) => !arg.startsWith("--"));
  if (command === "list") return { workflows: loadCatalog(rootDir).workflows.map(({ id, purpose, scope, destination }) => ({ destination, id, purpose, scope })) };
  if (command === "verify") return verifyInstalled(rootDir);
  if (command === "install" || command === "update") return installWorkflows(rootDir, ids, { dryRun: argv.includes("--dry-run") });
  throw new Error(`WORKFLOW_COMANDO_INVALIDO:${command}`);
}
if (require.main === module) {
  try {
    process.stdout.write(`${JSON.stringify(main())}
`);
  } catch (error) {
    process.stderr.write(`${error.message}
`);
    process.exitCode = 1;
  }
}
module.exports = { installWorkflows, loadCatalog, main, safeRelative, sha256, verifyInstalled };
