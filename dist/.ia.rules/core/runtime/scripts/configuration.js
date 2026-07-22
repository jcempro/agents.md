// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const fs = require("fs");
const path = require("path");

function loadConfiguration(rootDir) {
  // FIX-BUG: o pacote publicado concentra toda configuração estrutural em .ia.rules.
  const packagedConfigRoot = path.join(rootDir, ".ia.rules", "config");
  const configRoot = fs.existsSync(packagedConfigRoot) ? packagedConfigRoot : path.join(rootDir, "config");
  const descriptor = readConfig(path.join(configRoot, "schema.json"), true);
  const core = readConfig(path.join(configRoot, "core.json"), true);
  const repository = readConfig(path.join(configRoot, "repository.json"), false);
  const local = readConfig(path.join(configRoot, "agents.local.json"), false);
  const environment = process.env.AGENTS_CONFIG_JSON ? parseConfig(process.env.AGENTS_CONFIG_JSON, "AGENTS_CONFIG_JSON") : {};
  const merged = deepMerge(deepMerge(deepMerge(core, repository), local), environment);
  if (descriptor.id !== "agents-config/v1" || descriptor.version !== 1 || merged.schema !== descriptor.version) throw new Error("CONFIG_SCHEMA_NAO_SUPORTADO");
  for (const key of descriptor.required || []) if (!(key in merged)) throw new Error(`PARAMETRO_NORMATIVO_AUSENTE:${key}`);
  return deepFreeze(merged);
}

function readConfig(filePath, required) {
  if (!fs.existsSync(filePath)) {
    if (required) throw new Error(`CONFIGURACAO_AUSENTE:${path.basename(filePath)}`);
    return {};
  }
  return parseConfig(fs.readFileSync(filePath, "utf8"), filePath);
}

function parseConfig(raw, label) {
  try {
    const value = JSON.parse(raw);
    if (!value || Array.isArray(value) || typeof value !== "object") throw new Error("objeto esperado");
    return value;
  } catch (error) {
    throw new Error(`CONFIGURACAO_INVALIDA:${label}:${error.message}`);
  }
}

function deepMerge(base, override) {
  const result = { ...base };
  for (const [key, value] of Object.entries(override || {})) {
    result[key] = value && typeof value === "object" && !Array.isArray(value)
      ? deepMerge(base && typeof base[key] === "object" ? base[key] : {}, value)
      : value;
  }
  return result;
}

function deepFreeze(value) {
  for (const item of Object.values(value)) if (item && typeof item === "object" && !Object.isFrozen(item)) deepFreeze(item);
  return Object.freeze(value);
}

module.exports = { deepMerge, loadConfiguration, parseConfig };
