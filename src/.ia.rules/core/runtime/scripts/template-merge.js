// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const crypto = require("crypto");

function applyTemplate(existingContent, templateContent, descriptor = {}) {
  const type = descriptor.type || inferType(descriptor.path || "");
  if (type === "json") return mergeJsonTemplate(existingContent, templateContent, descriptor);
  return applyTextTemplate(existingContent, templateContent, descriptor);
}

function applyTextTemplate(existingContent, templateContent, descriptor = {}) {
  validateTemplateDescriptor(descriptor);
  const id = descriptor.id;
  const version = String(descriptor.version || "1");
  const begin = `<!-- ia-rules-template:${id}:v${version}:begin -->`;
  const end = `<!-- ia-rules-template:${id}:v${version}:end -->`;
  const managed = `${begin}\n${String(templateContent).trimEnd()}\n${end}`;
  const existing = String(existingContent || "");
  const pattern = new RegExp(`${escapeRegExp(begin)}[\\s\\S]*?${escapeRegExp(end)}`, "u");
  const next = pattern.test(existing) ? existing.replace(pattern, managed) : `${existing.trimEnd()}${existing.trim() ? "\n\n" : ""}${managed}\n`;
  return withRollback(existing, next, { id, mode: "text-region", version });
}

function mergeJsonTemplate(existingContent, templateContent, descriptor = {}) {
  validateTemplateDescriptor(descriptor);
  const local = parseJson(existingContent || "{}", "local");
  const template = parseJson(templateContent, "template");
  const nextObject = deepMergePreserveLocal(local, template);
  const next = `${JSON.stringify(nextObject, null, 2)}\n`;
  return withRollback(String(existingContent || ""), next, { id: descriptor.id, mode: "json-merge", version: String(descriptor.version || "1") });
}

function deepMergePreserveLocal(local, template) {
  if (!isPlainObject(local) || !isPlainObject(template)) return clone(template);
  const merged = { ...local };
  for (const [key, value] of Object.entries(template)) {
    merged[key] = isPlainObject(value) && isPlainObject(local[key]) ? deepMergePreserveLocal(local[key], value) : clone(value);
  }
  return merged;
}

function validateTemplateDescriptor(descriptor = {}) {
  if (!descriptor.id || !/^[a-z0-9_.-]+$/iu.test(String(descriptor.id))) throw new Error("TEMPLATE_ID_INVALIDO");
  if (descriptor.target && /(^|[\\/])\.\.(?:[\\/]|$)/u.test(String(descriptor.target))) throw new Error("TEMPLATE_TARGET_INVALIDO");
  return true;
}

function withRollback(previous, next, metadata) {
  return {
    changed: hash(previous) !== hash(next),
    content: Buffer.from(next, "utf8"),
    rollback: { ...metadata, nextSha256: hash(next), previousSha256: hash(previous) },
  };
}

function parseJson(content, label) {
  try {
    return JSON.parse(String(content || "{}"));
  } catch (error) {
    throw new Error(`TEMPLATE_JSON_INVALIDO:${label}`);
  }
}

function inferType(filePath) {
  return String(filePath).toLocaleLowerCase("en-US").endsWith(".json") ? "json" : "text";
}

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function hash(value) {
  return crypto.createHash("sha256").update(String(value).replace(/\r\n/gu, "\n"), "utf8").digest("hex");
}

module.exports = { applyTemplate, applyTextTemplate, deepMergePreserveLocal, mergeJsonTemplate, validateTemplateDescriptor };
