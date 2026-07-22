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
const { loadConfiguration } = require("./configuration");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const DEFAULTS = loadConfiguration(ROOT_DIR).publicClient;

async function requestJson(options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const url = assertPublicHttpsUrl(options.url);
  const timeoutMs = positiveInt(options.timeoutMs, DEFAULTS.timeoutMs);
  const maxBytes = positiveInt(options.maxBytes, DEFAULTS.maxBytes);
  const retries = method === "GET" || method === "HEAD" ? boundedInt(options.retries, DEFAULTS.retries, 0, 2) : 0;
  const cachePath = options.cachePath ? safeCachePath(options.cachePath) : "";
  const cacheTtlMs = positiveInt(options.cacheTtlMs, DEFAULTS.cacheTtlMs);
  const cacheKey = hash(`${method}\n${url}\n${options.body || ""}`);

  if (cachePath && method === "GET") {
    const cached = readCache(cachePath, cacheKey, cacheTtlMs);
    if (cached) return { ...cached, cached: true };
  }

  let lastFailure;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const result = await fetchOnce({ ...options, method, url, timeoutMs, maxBytes });
      if (cachePath && method === "GET" && result.ok) writeCache(cachePath, cacheKey, result);
      return { ...result, attempt, cached: false };
    } catch (error) {
      lastFailure = normalizeFailure(error);
      if (attempt === retries || !lastFailure.transient) return { ...lastFailure, attempt, cached: false, ok: false };
      await delay(attempt === 0 ? 1000 : 3000);
    }
  }
  return { ...lastFailure, cached: false, ok: false, attempt: retries };
}

async function fetchOnce(options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  try {
    const headers = { Accept: "application/json", ...(options.headers || {}) };
    const response = await fetch(options.url, {
      body: options.body || undefined,
      headers,
      method: options.method,
      redirect: "follow",
      signal: controller.signal,
    });
    const contentLength = Number(response.headers.get("content-length") || "0");
    if (contentLength && contentLength > options.maxBytes) {
      return failure("RESPONSE_TOO_LARGE", response.status, false);
    }
    const text = await readLimited(response, options.maxBytes);
    if (!response.ok) return failure(httpCode(response.status), response.status, response.status === 408 || response.status === 429 || response.status >= 500, text);
    let data = null;
    if (text.trim()) {
      try {
        data = JSON.parse(text);
      } catch {
        return failure("RESPONSE_JSON_INVALID", response.status, false);
      }
    }
    return { ok: true, status: response.status, data, text: sanitizeText(text), code: "HTTP_OK" };
  } finally {
    clearTimeout(timer);
  }
}

async function readLimited(response, maxBytes) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      const error = new Error("RESPONSE_TOO_LARGE");
      error.code = "RESPONSE_TOO_LARGE";
      throw error;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString("utf8");
}

function failure(code, status = 0, transient = false, detail = "") {
  return { code, detail: sanitizeText(detail).slice(0, 240), ok: false, status, transient };
}

function normalizeFailure(error) {
  if (error && error.code === "RESPONSE_TOO_LARGE") return failure("RESPONSE_TOO_LARGE");
  if (error && error.name === "AbortError") return failure("NETWORK_TIMEOUT", 0, true);
  const message = String(error && error.message || "");
  if (/fetch failed|ENOTFOUND|ECONNRESET|ECONNREFUSED|EAI_AGAIN/iu.test(message)) return failure("NETWORK_UNAVAILABLE", 0, true);
  return failure("NETWORK_FAILURE", 0, false, message);
}

function httpCode(status) {
  if (status === 401 || status === 403) return "HTTP_AUTHORIZATION_REQUIRED";
  if (status === 404) return "HTTP_NOT_FOUND";
  if (status === 429) return "HTTP_RATE_LIMITED";
  if (status >= 500) return "HTTP_SERVER_FAILURE";
  return `HTTP_${status}`;
}

function assertPublicHttpsUrl(value) {
  let parsed;
  try {
    parsed = new URL(String(value || ""));
  } catch {
    throw new Error("PUBLIC_URL_INVALID");
  }
  if (parsed.protocol !== "https:" || !parsed.hostname || /^(localhost|127\.0\.0\.1|::1)$/iu.test(parsed.hostname)) {
    throw new Error("PUBLIC_URL_REQUIRED");
  }
  return parsed.toString();
}

function safeCachePath(value) {
  const normalized = path.resolve(String(value));
  if (!normalized.endsWith(".json")) throw new Error("CACHE_PATH_INVALID");
  return normalized;
}

function readCache(cachePath, key, ttl) {
  if (!fs.existsSync(cachePath)) return null;
  try {
    const cached = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    if (cached.key !== key || Date.now() - cached.createdAt > ttl || !cached.result || !cached.result.ok) return null;
    return cached.result;
  } catch {
    return null;
  }
}

function writeCache(cachePath, key, result) {
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify({ createdAt: Date.now(), key, result }), "utf8");
}

function sanitizeText(value) {
  return String(value || "")
    .replace(/(?:ghp|github_pat|sk|api)[A-Za-z0-9_\-]{12,}/gu, "[REDACTED]")
    .replace(/Bearer\s+[^\s]+/giu, "Bearer [REDACTED]")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/gu, "");
}

function hash(value) {
  return crypto.createHash("sha256").update(String(value), "utf8").digest("hex");
}

function positiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function boundedInt(value, fallback, min, max) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { DEFAULTS, requestJson, sanitizeText };
