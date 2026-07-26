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

const INDEX_FORMAT = "agents-refused-decisions-index/v1";
const LOCAL_ROOT = path.join(".ia.rules", "state", "decisions", "refused");
const ENTRY_FIELDS = [
  "absenceConfirmed",
  "currentSituation",
  "decidedAt",
  "decision",
  "id",
  "lastReviewedAt",
  "ownership",
  "reconsiderationCondition",
  "record",
  "refusalDegree",
  "relatedArtifacts",
  "scope",
  "semanticKey",
  "status",
  "summaryReason",
  "title",
].sort();
const STATUSES = new Set([
  "RECUSADO",
  "PARCIALMENTE_RECUSADO",
  "RECUSADO_PARA_RECONSIDERACAO",
  "EM_ANDAMENTO_COM_RESTRICOES",
  "REABERTO",
  "SUPERADO",
  "SUBSTITUIDO",
  "ACEITO_APOS_REAVALIACAO",
]);
const DEGREES = new Set(["TOTAL", "PARCIAL", "CONDICIONAL", "NAO_APLICAVEL"]);
const TRANSITION_STATUSES = new Set(["REABERTO", "SUPERADO", "SUBSTITUIDO", "ACEITO_APOS_REAVALIACAO"]);

/** Executa validateRefusedDecisions no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateRefusedDecisions(rootDir, options = {}) {
  const repositoryRoot = path.resolve(rootDir || ".");
  assertNotPublished(repositoryRoot);
  const localRoot = path.join(repositoryRoot, LOCAL_ROOT);
  if (!fs.existsSync(localRoot)) {
    return { entries: 0, present: false, records: 0 };
  }
  assertFile(path.join(localRoot, "index.schema.json"), "RECUSAS_SCHEMA_AUSENTE");
  assertFile(path.join(localRoot, "index.json"), "RECUSAS_INDICE_AUSENTE");
  assertFile(path.join(localRoot, "record.template.md"), "RECUSAS_TEMPLATE_AUSENTE");

  const schema = readJson(path.join(localRoot, "index.schema.json"), "RECUSAS_SCHEMA_JSON_INVALIDO");
  if (schema.$id !== INDEX_FORMAT || !schema.properties || !schema.properties.entries) {
    throw new Error("RECUSAS_SCHEMA_INVALIDO");
  }
  const index = readJson(path.join(localRoot, "index.json"), "RECUSAS_INDICE_JSON_INVALIDO");
  validateIndexHeader(index);

  const ids = new Set();
  const semanticKeys = new Set();
  const records = new Set();
  for (const entry of index.entries) {
    validateEntry(entry, { ids, semanticKeys, records });
    const recordPath = path.join(localRoot, ...entry.record.split("/"));
    assertExactFile(localRoot, entry.record, `RECUSAS_REGISTRO_AUSENTE:${entry.record}`);
    const content = fs.readFileSync(recordPath, "utf8").replace(/\r\n/gu, "\n");
    validateRecord(entry, content);
    if (options.verifyArtifacts !== false) validateRelatedArtifacts(repositoryRoot, entry);
  }

  const recordsRoot = path.join(localRoot, "records");
  const physicalRecords = listFiles(recordsRoot)
    .filter((filePath) => path.extname(filePath).toLocaleLowerCase("en-US") === ".md")
    .map((filePath) => `records/${path.basename(filePath)}`)
    .sort();
  for (const record of physicalRecords) {
    if (!records.has(record.toLocaleLowerCase("en-US"))) {
      throw new Error(`RECUSAS_REGISTRO_ORFAO:${record}`);
    }
  }
  if (physicalRecords.length !== records.size) {
    throw new Error(`RECUSAS_INDICE_NAO_EXAUSTIVO:records=${physicalRecords.length}:indexed=${records.size}`);
  }

  return { entries: index.entries.length, present: true, records: physicalRecords.length };
}

/** Executa validateIndexHeader no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateIndexHeader(index) {
  const expected = ["entries", "generated", "ownership", "schema", "version"].sort();
  if (!index || sortedKeys(index).join("|") !== expected.join("|") ||
    index.schema !== INDEX_FORMAT || index.version !== 1 || index.generated !== false ||
    index.ownership !== "repository-local" || !Array.isArray(index.entries)) {
    throw new Error("RECUSAS_INDICE_INVALIDO");
  }
}

/** Executa validateEntry no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateEntry(entry, state) {
  if (!entry || sortedKeys(entry).join("|") !== ENTRY_FIELDS.join("|")) {
    throw new Error(`RECUSAS_ENTRADA_CAMPOS_INVALIDOS:${entry && entry.id || "sem-id"}`);
  }
  if (!/^DEC-[0-9]{8}-[0-9]{3}$/u.test(entry.id)) throw new Error(`RECUSAS_ID_INVALIDO:${entry.id}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(entry.semanticKey)) throw new Error(`RECUSAS_CHAVE_INVALIDA:${entry.id}`);
  if (!STATUSES.has(entry.status) || entry.status === "ADIADO") throw new Error(`RECUSAS_ESTADO_INVALIDO:${entry.id}:${entry.status}`);
  if (!DEGREES.has(entry.refusalDegree)) throw new Error(`RECUSAS_GRAU_INVALIDO:${entry.id}:${entry.refusalDegree}`);
  if (!isDate(entry.decidedAt) || !isDate(entry.lastReviewedAt) || entry.lastReviewedAt < entry.decidedAt) {
    throw new Error(`RECUSAS_DATA_INVALIDA:${entry.id}`);
  }
  if (entry.id.slice(4, 12) !== entry.decidedAt.replace(/-/gu, "")) throw new Error(`RECUSAS_ID_DATA_DIVERGENTE:${entry.id}`);
  for (const field of ["title", "scope", "decision", "summaryReason", "reconsiderationCondition", "currentSituation"]) {
    if (!String(entry[field] || "").trim()) throw new Error(`RECUSAS_CAMPO_VAZIO:${entry.id}:${field}`);
  }
  if (entry.absenceConfirmed !== true || entry.ownership !== "repository-local") {
    throw new Error(`RECUSAS_AUSENCIA_OU_PROPRIEDADE_INVALIDA:${entry.id}`);
  }
  if (!Array.isArray(entry.relatedArtifacts) || entry.relatedArtifacts.length === 0 ||
    new Set(entry.relatedArtifacts).size !== entry.relatedArtifacts.length) {
    throw new Error(`RECUSAS_REFERENCIAS_INVALIDAS:${entry.id}`);
  }
  if (entry.record !== `records/${entry.id}.md`) throw new Error(`RECUSAS_REGISTRO_DIVERGENTE:${entry.id}`);

  const idKey = entry.id.toLocaleLowerCase("en-US");
  const semanticKey = entry.semanticKey.toLocaleLowerCase("en-US");
  const recordKey = entry.record.toLocaleLowerCase("en-US");
  if (state.ids.has(idKey)) throw new Error(`RECUSAS_ID_DUPLICADO:${entry.id}`);
  if (state.semanticKeys.has(semanticKey)) throw new Error(`RECUSAS_CHAVE_DUPLICADA:${entry.semanticKey}`);
  if (state.records.has(recordKey)) throw new Error(`RECUSAS_REGISTRO_DUPLICADO:${entry.record}`);
  state.ids.add(idKey);
  state.semanticKeys.add(semanticKey);
  state.records.add(recordKey);
}

/** Executa validateRecord no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateRecord(entry, content) {
  const title = content.match(/^# (DEC-[0-9]{8}-[0-9]{3}) — (.+)$/mu);
  if (!title || title[1] !== entry.id || title[2].trim() !== entry.title) {
    throw new Error(`RECUSAS_TITULO_REGISTRO_DIVERGENTE:${entry.id}`);
  }
  const metadata = new Map();
  for (const match of content.matchAll(/^- ([^:\r\n]+):\s*(.+)$/gmu)) {
    metadata.set(match[1].trim(), stripTicks(match[2].trim()));
  }
  const expectedMetadata = {
    chave_semantica: entry.semanticKey,
    estado: entry.status,
    grau_recusa: entry.refusalDegree,
    escopo: entry.scope,
    decidido_em: entry.decidedAt,
    ultima_revisao: entry.lastReviewedAt,
    ausencia_confirmada: "true",
    propriedade: "repository-local",
  };
  for (const [key, value] of Object.entries(expectedMetadata)) {
    if (metadata.get(key) !== value) throw new Error(`RECUSAS_METADATA_DIVERGENTE:${entry.id}:${key}`);
  }
  if (!metadata.get("condição_reavaliação") || !metadata.get("situação_atual")) {
    throw new Error(`RECUSAS_METADATA_INCOMPLETA:${entry.id}`);
  }

  let previous = -1;
  for (let section = 1; section <= 11; section += 1) {
    const matches = [...content.matchAll(new RegExp(`^## ${section}\\. .+$`, "gmu"))];
    if (matches.length !== 1 || matches[0].index <= previous) throw new Error(`RECUSAS_SECAO_INVALIDA:${entry.id}:${section}`);
    previous = matches[0].index;
  }
  if (entry.lastReviewedAt > entry.decidedAt && !sectionContent(content, 10).includes(entry.lastReviewedAt)) {
    throw new Error(`RECUSAS_REVISAO_SEM_EVOLUCAO:${entry.id}:${entry.lastReviewedAt}`);
  }
  if (TRANSITION_STATUSES.has(entry.status)) {
    const evolution = sectionContent(content, 10);
    const marker = entry.status.toLocaleLowerCase("pt-BR").replaceAll("_", " ");
    if (!evolution.toLocaleLowerCase("pt-BR").includes(marker)) {
      throw new Error(`RECUSAS_TRANSICAO_SEM_EVOLUCAO:${entry.id}:${entry.status}`);
    }
    if (entry.status === "REABERTO" && !/(fato novo|mudan[cç]a material|evid[eê]ncia nova|justific)/iu.test(evolution)) {
      throw new Error(`RECUSAS_REABERTURA_SEM_JUSTIFICATIVA:${entry.id}`);
    }
  }
}

/** Executa validateRelatedArtifacts no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function validateRelatedArtifacts(rootDir, entry) {
  for (const reference of entry.relatedArtifacts) {
    if (reference.startsWith("git:")) {
      const commit = reference.slice(4);
      if (!/^[a-f0-9]{7,40}$/iu.test(commit)) throw new Error(`RECUSAS_COMMIT_INVALIDO:${entry.id}:${reference}`);
      const result = childProcess.spawnSync("git", ["cat-file", "-e", `${commit}^{commit}`], {
        cwd: rootDir,
        encoding: "utf8",
        windowsHide: true,
      });
      if (result.status !== 0) throw new Error(`RECUSAS_COMMIT_AUSENTE:${entry.id}:${reference}`);
      continue;
    }
    const [relativePath, anchor = ""] = reference.split("#", 2);
    const normalized = normalizeLocalPath(relativePath);
    assertExactFile(rootDir, normalized, `RECUSAS_REFERENCIA_AUSENTE:${entry.id}:${reference}`);
    if (anchor) {
      const target = fs.readFileSync(path.join(rootDir, ...normalized.split("/")), "utf8");
      const found = /^FT-[0-9]+$/u.test(anchor)
        ? target.includes(anchor)
        : new RegExp(`^#{1,6}\\s+${escapeRegex(anchor)}(?:\\D|$)`, "mu").test(target);
      if (!found) throw new Error(`RECUSAS_ANCORA_AUSENTE:${entry.id}:${reference}`);
    }
  }
}

/** Executa assertNotPublished no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertNotPublished(rootDir) {
  for (const prefix of ["src", "dist"]) {
    const leaked = path.join(rootDir, prefix, LOCAL_ROOT);
    if (fs.existsSync(leaked)) throw new Error(`RECUSAS_ACERVO_PUBLICADO:${toPosix(path.relative(rootDir, leaked))}`);
  }
}

/** Executa normalizeLocalPath no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function normalizeLocalPath(value) {
  const normalized = String(value || "").trim().replace(/\\/gu, "/").replace(/^\.\//u, "");
  if (!normalized || path.posix.isAbsolute(normalized) || /^[A-Za-z]:\//u.test(normalized) ||
    normalized === "." || normalized === ".." || normalized.startsWith("../") || normalized.includes("/../") ||
    normalized.includes("//") || normalized.endsWith("/")) {
    throw new Error(`RECUSAS_PATH_INSEGURO:${value}`);
  }
  return normalized;
}

/** Executa assertExactFile no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertExactFile(rootDir, relativePath, errorCode) {
  const normalized = normalizeLocalPath(relativePath);
  let current = rootDir;
  for (const segment of normalized.split("/")) {
    if (!fs.existsSync(current) || !fs.statSync(current).isDirectory() || !fs.readdirSync(current).includes(segment)) {
      throw new Error(errorCode);
    }
    current = path.join(current, segment);
  }
  if (!fs.existsSync(current) || !fs.statSync(current).isFile()) throw new Error(errorCode);
}

/** Executa assertFile no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertFile(filePath, errorCode) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) throw new Error(errorCode);
}

/** Executa readJson no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function readJson(filePath, errorCode) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${errorCode}:${error.message}`);
  }
}

/** Executa listFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function listFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name, "en"))) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(entryPath));
    else if (entry.isFile()) files.push(entryPath);
  }
  return files;
}

/** Executa sectionContent no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function sectionContent(content, section) {
  const start = content.search(new RegExp(`^## ${section}\\. `, "mu"));
  if (start < 0) return "";
  const tail = content.slice(start);
  const next = tail.slice(1).search(/^## [0-9]+\. /mu);
  return next < 0 ? tail : tail.slice(0, next + 1);
}

/** Executa sortedKeys no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function sortedKeys(value) {
  return Object.keys(value || {}).sort();
}

/** Executa stripTicks no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function stripTicks(value) {
  return value.replace(/^`|`$/gu, "");
}

/** Executa isDate no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function isDate(value) {
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/u.test(String(value || ""))) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Executa escapeRegex no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

/** Executa toPosix no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function toPosix(value) {
  return String(value || "").replace(/\\/gu, "/");
}

module.exports = {
  DEGREES,
  STATUSES,
  validateRefusedDecisions,
};
