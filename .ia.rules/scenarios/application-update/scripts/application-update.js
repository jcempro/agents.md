// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const fs = require("fs");
const https = require("https");

const STATES = new Set([
  "atualizada",
  "atualizacao_disponivel",
  "origem_indisponivel",
  "resposta_invalida",
  "offline",
  "politica_bloqueada",
  "erro_controlado",
]);

async function checkApplicationUpdate(policy = {}, options = {}) {
  const effective = normalizePolicy(policy);
  if (!effective.enabled) return state("APPLICATION_UPDATE_SKIPPED", "politica_bloqueada", { reason: "capacidade_nao_declarada" });
  if (options.offline || options.dryRun) return state("APPLICATION_UPDATE_OFFLINE", "offline", { dryRun: Boolean(options.dryRun) });

  let remote;
  try {
    remote = await readVersionSource(effective, options);
  } catch (error) {
    return state("APPLICATION_UPDATE_SOURCE_UNAVAILABLE", "origem_indisponivel", { error: safeMessage(error) });
  }

  const parsed = parseVersionPayload(remote);
  if (!parsed.valid) return state("APPLICATION_UPDATE_INVALID_RESPONSE", "resposta_invalida", { reason: parsed.reason });
  const comparison = compareVersions(effective.currentVersion, parsed.version);
  if (comparison < 0) {
    return state("APPLICATION_UPDATE_AVAILABLE", "atualizacao_disponivel", {
      currentVersion: effective.currentVersion,
      latestVersion: parsed.version,
      updateAvailable: true,
    });
  }
  return state("APPLICATION_UPDATE_CURRENT", "atualizada", {
    currentVersion: effective.currentVersion,
    latestVersion: parsed.version,
    updateAvailable: false,
  });
}

function normalizePolicy(policy) {
  const source = policy && typeof policy === "object" ? policy : {};
  const currentVersion = normalizeVersion(source.currentVersion || source.version || "");
  if (source.enabled !== true) return { enabled: false };
  if (!currentVersion) throw new Error("APPLICATION_UPDATE_CURRENT_VERSION_REQUIRED");
  return {
    currentVersion,
    enabled: true,
    source: source.source && typeof source.source === "object" ? source.source : {},
  };
}

async function readVersionSource(policy, options = {}) {
  if (typeof options.provider === "function") return options.provider(policy);
  const source = policy.source || {};
  if (source.type === "static") return source.payload || source.version || "";
  if (source.type === "file") return fs.readFileSync(required(source.path, "source.path"), "utf8");
  if (source.type === "https") return readHttpsJson(required(source.url, "source.url"), options.httpClient || defaultHttpClient);
  throw new Error("APPLICATION_UPDATE_SOURCE_UNDECLARED");
}

async function readHttpsJson(url, httpClient) {
  const response = await httpClient(url);
  if (!response || response.statusCode < 200 || response.statusCode >= 300) throw new Error(`HTTP_${response && response.statusCode ? response.statusCode : 0}`);
  return Buffer.isBuffer(response.body) ? response.body.toString("utf8") : String(response.body || "");
}

function defaultHttpClient(url) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, { headers: { Accept: "application/json", "User-Agent": "agents-application-update" }, timeout: 30000 }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({ body: Buffer.concat(chunks), headers: response.headers, statusCode: response.statusCode || 0 }));
    });
    request.on("error", reject);
    request.on("timeout", () => request.destroy(new Error(`Tempo esgotado: ${url}`)));
    request.end();
  });
}

function parseVersionPayload(payload) {
  if (payload && typeof payload === "object" && !Buffer.isBuffer(payload)) return parseVersionObject(payload);
  const text = Buffer.isBuffer(payload) ? payload.toString("utf8") : String(payload || "").trim();
  if (!text) return { valid: false, reason: "vazio" };
  if (/^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/u.test(text)) return { valid: true, version: text };
  try {
    return parseVersionObject(JSON.parse(text));
  } catch (error) {
    return { valid: false, reason: "json_invalido" };
  }
}

function parseVersionObject(value) {
  const version = normalizeVersion(value && (value.version || value.latest || value.latestVersion));
  return version ? { valid: true, version } : { valid: false, reason: "versao_ausente" };
}

function compareVersions(left, right) {
  const a = normalizeVersion(left).split("-")[0].split(".").map(Number);
  const b = normalizeVersion(right).split("-")[0].split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] < b[index] ? -1 : 1;
  }
  return 0;
}

function normalizeVersion(value) {
  const version = String(value || "").trim().replace(/^v/u, "");
  return /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/u.test(version) ? version : "";
}

function state(code, value, details = {}) {
  if (!STATES.has(value)) throw new Error(`APPLICATION_UPDATE_STATE_INVALID:${value}`);
  return { code, state: value, ...details };
}

function required(value, name) {
  if (!String(value || "").trim()) throw new Error(`APPLICATION_UPDATE_REQUIRED:${name}`);
  return String(value);
}

function safeMessage(error) {
  return String(error && error.message ? error.message : error).slice(0, 160);
}

module.exports = { STATES, checkApplicationUpdate, compareVersions, normalizePolicy, parseVersionPayload };
