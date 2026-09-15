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

const CACHE_SCHEMA = "agents-context-session-cache/v1";
const DELIVERY_SCHEMA = "agents-context-delivery/v1";

/** Entrega unidades integrais em miss e referências validadas em hit, persistindo somente metadados locais. */
function deliverSessionContext(options = {}) {
  const rootDir = path.resolve(required(options.rootDir, "CONTEXT_ROOT_AUSENTE"));
  const sessionId = String(options.sessionId || "");
  const enabled = options.enabled !== false && sessionId.length > 0;
  const sessionDigest = sha256(sessionId || "cache-disabled");
  const cacheDir = path.resolve(options.cacheDir || path.join(rootDir, ".ia.rules", "cache", "context-sessions"));
  assertWithin(rootDir, cacheDir);
  const cachePath = path.join(cacheDir, `${sessionDigest}.json`);
  const units = prepareUnits(rootDir, options.units || []);
  const reset = options.reset === true;
  let readState = { entries: new Map(), status: enabled ? "missing" : "disabled" };

  if (enabled && reset) clearSessionCache({ cacheDir, rootDir, sessionId });
  if (enabled && !reset) readState = readSessionCache(cachePath, sessionDigest);
  if (enabled && reset) readState = { entries: new Map(), status: "reset" };

  let delivery = buildDelivery(units, readState, {
    enabled,
    sessionDigest,
    tokenizer: String(options.tokenizer || "declared"),
  });

  if (enabled) {
    try {
      writeSessionCache(cachePath, sessionDigest, units);
    } catch (error) {
      delivery = buildDelivery(units, { entries: new Map(), status: "write-error" }, {
        enabled: false,
        sessionDigest,
        tokenizer: String(options.tokenizer || "declared"),
      });
      delivery.cache.error = safeError(error);
    }
  }
  return delivery;
}

/** Remove somente o registro derivado da sessão indicada; ausência já satisfaz o rollback. */
function clearSessionCache(options = {}) {
  const rootDir = path.resolve(required(options.rootDir, "CONTEXT_ROOT_AUSENTE"));
  const cacheDir = path.resolve(options.cacheDir || path.join(rootDir, ".ia.rules", "cache", "context-sessions"));
  assertWithin(rootDir, cacheDir);
  const cachePath = path.join(cacheDir, `${sha256(required(options.sessionId, "CONTEXT_SESSION_AUSENTE"))}.json`);
  try {
    fs.rmSync(cachePath);
    return { changed: true, path: relativePath(rootDir, cachePath) };
  } catch (error) {
    if (error && error.code === "ENOENT") return { changed: false, path: relativePath(rootDir, cachePath) };
    throw error;
  }
}

/** Normaliza, lê e encadeia a identidade material de cada unidade antes de consultar o cache. */
function prepareUnits(rootDir, inputUnits) {
  if (!Array.isArray(inputUnits) || inputUnits.length === 0) throw new Error("CONTEXT_UNITS_AUSENTES");
  const ids = new Set();
  const units = inputUnits.map((input) => {
    const id = required(input.id, "CONTEXT_UNIT_ID_AUSENTE");
    if (ids.has(id)) throw new Error(`CONTEXT_UNIT_DUPLICADA:${id}`);
    ids.add(id);
    const absolutePath = path.resolve(rootDir, required(input.path, `CONTEXT_UNIT_PATH_AUSENTE:${id}`));
    assertWithin(rootDir, absolutePath);
    const content = normalizeText(fs.readFileSync(absolutePath, "utf8"));
    return {
      authority: stableList(input.authority || "AGENTS.md"),
      bytes: Buffer.byteLength(content, "utf8"),
      content,
      dependencies: stableList(input.dependencies || []),
      id,
      path: relativePath(rootDir, absolutePath),
      precedence: stableList(input.precedence || "common"),
      role: stableList(input.role || "common"),
      route: stableList(input.route || "always"),
      sha256: sha256(content),
      tokens: nonNegativeInteger(input.tokens, `CONTEXT_UNIT_TOKENS_INVALIDOS:${id}`),
      version: String(input.version || "1"),
    };
  });
  const byId = new Map(units.map((unit) => [unit.id, unit]));
  for (const unit of units) {
    for (const dependency of unit.dependencies) if (!byId.has(dependency)) throw new Error(`CONTEXT_DEPENDENCIA_AUSENTE:${unit.id}:${dependency}`);
  }
  const fingerprints = new Map();
  const visiting = new Set();
  const fingerprint = (unit) => {
    if (fingerprints.has(unit.id)) return fingerprints.get(unit.id);
    if (visiting.has(unit.id)) throw new Error(`CONTEXT_DEPENDENCIA_CICLICA:${unit.id}`);
    visiting.add(unit.id);
    unit.dependencyHashes = Object.fromEntries(unit.dependencies.map((id) => [id, fingerprint(byId.get(id))]));
    const value = sha256(stableJson(cacheFields(unit)));
    unit.fingerprint = value;
    visiting.delete(unit.id);
    fingerprints.set(unit.id, value);
    return value;
  };
  for (const unit of units) fingerprint(unit);
  return units;
}

/** Constrói telemetria observável sem repetir conteúdo já validado na mesma sessão. */
function buildDelivery(units, readState, options) {
  const outputUnits = [];
  const reasonCounts = {};
  let hits = 0;
  let invalidations = 0;
  let tokensAvoided = 0;
  let bytesAvoided = 0;
  for (const unit of units) {
    const previous = readState.entries.get(unit.id);
    const hit = options.enabled && previous && previous.fingerprint === unit.fingerprint;
    const reason = hit ? "validated-session-cache" : missReason(unit, previous, readState.status);
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    const common = publicFields(unit);
    if (hit) {
      hits += 1;
      tokensAvoided += unit.tokens;
      bytesAvoided += unit.bytes;
      outputUnits.push({ ...common, reason, status: "hit" });
    } else {
      if (previous || ["corrupt", "reset", "write-error"].includes(readState.status)) invalidations += 1;
      outputUnits.push({ ...common, content: unit.content, reason, status: "miss" });
    }
  }
  const misses = units.length - hits;
  const state = readState.status === "corrupt" || readState.status === "write-error" ? "recovered"
    : readState.status === "disabled" ? "disabled"
      : hits === units.length ? "hit" : hits === 0 ? "cold" : "mixed";
  return {
    cache: {
      enabled: options.enabled,
      payloadStored: false,
      session: options.sessionDigest,
      state,
    },
    metrics: {
      bytesAvoided,
      hits,
      invalidations,
      misses,
      reasonCounts,
      tokenizer: options.tokenizer,
      tokensAvoided,
      units: units.length,
    },
    schema: DELIVERY_SCHEMA,
    units: outputUnits,
  };
}

/** Lê o cache como não confiável; qualquer divergência o converte em cold context integral. */
function readSessionCache(cachePath, sessionDigest) {
  if (!fs.existsSync(cachePath)) return { entries: new Map(), status: "missing" };
  try {
    const parsed = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    if (parsed.schema !== CACHE_SCHEMA || parsed.session !== sessionDigest || !Array.isArray(parsed.entries)) throw new Error("CACHE_CONTRATO_INVALIDO");
    const entries = new Map();
    for (const entry of parsed.entries) {
      if (!entry || typeof entry.id !== "string" || typeof entry.fingerprint !== "string" || entries.has(entry.id)) throw new Error("CACHE_ENTRADA_INVALIDA");
      entries.set(entry.id, entry);
    }
    return { entries, status: "loaded" };
  } catch (_error) {
    return { entries: new Map(), status: "corrupt" };
  }
}

/** Grava atomicamente apenas identidade, hashes e métricas; conteúdo canônico nunca entra no cache. */
function writeSessionCache(cachePath, sessionDigest, units) {
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  const payload = `${JSON.stringify({
    entries: units.map((unit) => ({ ...cacheFields(unit), bytes: unit.bytes, fingerprint: unit.fingerprint, tokens: unit.tokens })),
    schema: CACHE_SCHEMA,
    session: sessionDigest,
  })}\n`;
  const temporary = `${cachePath}.${process.pid}.${crypto.randomBytes(4).toString("hex")}.tmp`;
  try {
    const handle = fs.openSync(temporary, "wx");
    try { fs.writeFileSync(handle, payload, "utf8"); fs.fsyncSync(handle); } finally { fs.closeSync(handle); }
    fs.renameSync(temporary, cachePath);
  } finally {
    try { fs.rmSync(temporary); } catch (error) { if (!error || error.code !== "ENOENT") throw error; }
  }
}

/** Explica deterministicamente por que uma unidade precisa ser relida. */
function missReason(unit, previous, readStatus) {
  if (!previous) return ({ corrupt: "cache-corrupt", disabled: "cache-disabled", reset: "cache-reset", "write-error": "cache-write-error" })[readStatus] || "cold-context";
  const comparisons = [
    ["sha256", "content-changed"], ["version", "version-changed"], ["role", "role-changed"],
    ["authority", "authority-changed"], ["route", "route-changed"], ["precedence", "precedence-changed"],
    ["dependencies", "dependencies-changed"], ["dependencyHashes", "dependency-changed"],
  ];
  for (const [field, reason] of comparisons) if (stableJson(previous[field]) !== stableJson(unit[field])) return reason;
  return "identity-changed";
}

/** Seleciona campos estáveis que compõem a identidade e podem ser persistidos sem payload. */
function cacheFields(unit) {
  return {
    authority: unit.authority,
    dependencies: unit.dependencies,
    dependencyHashes: unit.dependencyHashes || {},
    id: unit.id,
    path: unit.path,
    precedence: unit.precedence,
    role: unit.role,
    route: unit.route,
    sha256: unit.sha256,
    version: unit.version,
  };
}

/** Projeta metadados suficientes para provar o hit sem expor o payload persistente. */
function publicFields(unit) {
  return {
    authority: unit.authority,
    dependencies: unit.dependencies,
    fingerprint: unit.fingerprint,
    id: unit.id,
    path: unit.path,
    precedence: unit.precedence,
    role: unit.role,
    route: unit.route,
    sha256: unit.sha256,
    tokens: unit.tokens,
    version: unit.version,
  };
}

/** Rejeita escrita/leitura fora da raiz física autorizada. */
function assertWithin(rootDir, targetPath) {
  const relative = path.relative(rootDir, targetPath);
  if (relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))) return;
  throw new Error(`CONTEXT_PATH_FORA_DA_RAIZ:${targetPath}`);
}

/** Serializa objetos com chaves ordenadas para fingerprints reproduzíveis. */
function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

/** Normaliza lista de identidade sem criar equivalência semântica implícita. */
function stableList(value) {
  return [...new Set((Array.isArray(value) ? value : [value]).map(String))].sort();
}

/** Exige inteiro não negativo para telemetria declarada pelo tokenizer do chamador. */
function nonNegativeInteger(value, code) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) throw new Error(code);
  return number;
}

/** Exige valor textual não vazio em campos de contrato. */
function required(value, code) {
  const text = String(value || "").trim();
  if (!text) throw new Error(code);
  return text;
}

/** Normaliza somente EOL, conforme a serialização experimental declarada. */
function normalizeText(value) { return String(value).replace(/\r\n/gu, "\n"); }

/** Calcula identidade SHA-256 local sem serviço ou recuperação semântica. */
function sha256(value) { return crypto.createHash("sha256").update(String(value), "utf8").digest("hex"); }

/** Produz path relativo portável para telemetria e cache. */
function relativePath(rootDir, targetPath) { return path.relative(rootDir, targetPath).split(path.sep).join("/"); }

/** Sanitiza falha de armazenamento sem registrar path, segredo ou payload. */
function safeError(error) { return error && error.code ? String(error.code) : "CACHE_WRITE_FAILED"; }

module.exports = {
  CACHE_SCHEMA,
  DELIVERY_SCHEMA,
  clearSessionCache,
  deliverSessionContext,
  prepareUnits,
  readSessionCache,
};
