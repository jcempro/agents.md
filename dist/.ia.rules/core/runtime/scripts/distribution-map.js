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

const DISTRIBUTION_MAP_FORMAT = "agents-distribution-map/v1";
const DISTRIBUTION_MAP_SCHEMA = 1;
const ACTIVE_MAP_PATH = ".ia.rules/distribution/active-map.json";
const DEFAULT_MIN_PROCESSOR_VERSION = "1.0.0";

function distributionMapFileName(version) {
  const normalized = String(version || "").trim();
  if (!/^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/u.test(normalized)) {
    throw new Error(`VERSAO_MAPA_DISTRIBUICAO_INVALIDA:${version}`);
  }
  return `distribution-map-${normalized}.json`;
}

function distributionMapRelativePath(version) {
  return `.ia.rules/distribution/${distributionMapFileName(version)}`;
}

function buildDistributionMap(options = {}) {
  const version = String(options.version || "").trim();
  const rootDir = path.resolve(String(options.rootDir || "."));
  const effective = Array.isArray(options.files) ? options.files : [];
  const potential = Array.isArray(options.potentialFiles) ? options.potentialFiles : defaultPotentialEntries();
  const selfPath = options.selfPath ? normalizeMapPath(options.selfPath) : distributionMapRelativePath(version);
  const entries = [];

  for (const file of effective) {
    const relativePath = normalizeMapPath(file.path || file.relativePath);
    const absolute = path.join(rootDir, relativePath);
    const isSelf = relativePath === selfPath;
    const stat = fs.existsSync(absolute) && fs.statSync(absolute).isFile() ? fs.statSync(absolute) : null;
    entries.push(compactEntry({
      condition: file.condition || "",
      destination: relativePath,
      path: relativePath,
      property: file.property || "managed",
      removalPolicy: file.removalPolicy || "remove-when-obsolete-managed",
      required: file.required !== false,
      sha256: stat && !isSelf ? hashFile(absolute) : "",
      size: stat ? stat.size : 0,
      source: normalizeMapPath(file.source || file.sourcePath || relativePath),
      status: file.status || (file.generated ? "generated" : "required"),
      type: file.type || "file",
      updatePolicy: file.updatePolicy || "replace-if-managed",
    }));
  }

  for (const file of potential) {
    const relativePath = normalizeMapPath(file.path || file.relativePath);
    entries.push(compactEntry({
      condition: file.condition || "",
      destination: relativePath,
      path: relativePath,
      property: file.property || "local",
      removalPolicy: file.removalPolicy || "preserve",
      required: false,
      sha256: "",
      size: 0,
      source: file.source ? normalizeMapPath(file.source) : relativePath,
      status: file.status || "optional",
      type: file.type || "directory",
      updatePolicy: file.updatePolicy || "preserve-local",
      userModifiable: file.userModifiable !== false,
    }));
  }

  const map = {
    format: DISTRIBUTION_MAP_FORMAT,
    generatedAt: new Date(0).toISOString(),
    minProcessorVersion: DEFAULT_MIN_PROCESSOR_VERSION,
    schema: DISTRIBUTION_MAP_SCHEMA,
    self: selfPath,
    version,
    entries: entries.sort((a, b) => a.path.localeCompare(b.path, "en")),
  };
  validateDistributionMap(map, { rootDir, requireFiles: options.requireFiles !== false });
  return map;
}

function compactEntry(entry) {
  const result = {
    path: normalizeMapPath(entry.path),
    type: entry.type || "file",
    status: entry.status || "required",
    property: entry.property || "managed",
    updatePolicy: entry.updatePolicy || "replace-if-managed",
    removalPolicy: entry.removalPolicy || "remove-when-obsolete-managed",
    source: normalizeMapPath(entry.source || entry.path),
    destination: normalizeMapPath(entry.destination || entry.path),
    minProcessorVersion: entry.minProcessorVersion || DEFAULT_MIN_PROCESSOR_VERSION,
    required: Boolean(entry.required),
  };
  if (entry.condition) result.condition = String(entry.condition);
  if (entry.sha256) result.sha256 = String(entry.sha256).toLocaleLowerCase("en-US");
  if (Number.isFinite(entry.size) && entry.size > 0) result.size = entry.size;
  if (entry.userModifiable) result.userModifiable = true;
  return result;
}

function defaultPotentialEntries() {
  return [
    { path: "agents.local.md", status: "optional", type: "file", property: "local", updatePolicy: "preserve-local", removalPolicy: "preserve", userModifiable: true },
    { path: ".ia.rules/local/", status: "optional", type: "directory", property: "local", updatePolicy: "preserve-local", removalPolicy: "preserve", userModifiable: true },
    { path: ".ia.rules/hooks/", status: "optional", type: "directory", property: "extension", updatePolicy: "preserve-local", removalPolicy: "preserve", userModifiable: true },
    { path: ".ia.rules/cache/", status: "generated", type: "directory", property: "generated", updatePolicy: "ignore", removalPolicy: "remove-generated", userModifiable: true },
  ];
}

function validateDistributionMap(map, options = {}) {
  if (!map || map.format !== DISTRIBUTION_MAP_FORMAT || map.schema !== DISTRIBUTION_MAP_SCHEMA ||
    !map.version || !Array.isArray(map.entries) || map.entries.length === 0) {
    throw new Error("MAPA_DISTRIBUICAO_INVALIDO");
  }

  const rootDir = options.rootDir ? path.resolve(options.rootDir) : "";
  const seen = new Map();
  for (const entry of map.entries) {
    const relativePath = normalizeMapPath(entry && entry.path);
    const key = relativePath.toLocaleLowerCase("en-US");
    if (seen.has(key)) throw new Error(`MAPA_DISTRIBUICAO_PATH_DUPLICADO:${relativePath}`);
    seen.set(key, relativePath);
    normalizeMapPath(entry.source || relativePath);
    normalizeMapPath(entry.destination || relativePath);
    if (!["file", "directory"].includes(entry.type)) throw new Error(`MAPA_DISTRIBUICAO_TIPO_INVALIDO:${relativePath}`);
    if (!["required", "optional", "conditional", "generated", "obsolete"].includes(entry.status)) throw new Error(`MAPA_DISTRIBUICAO_STATUS_INVALIDO:${relativePath}`);
    if (entry.sha256 && !/^[a-f0-9]{64}$/u.test(entry.sha256)) throw new Error(`MAPA_DISTRIBUICAO_HASH_INVALIDO:${relativePath}`);
    if (options.requireFiles && rootDir && entry.required && entry.type === "file" && entry.status !== "obsolete" && relativePath !== map.self) {
      const absolute = path.join(rootDir, relativePath);
      if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) throw new Error(`MAPA_DISTRIBUICAO_ARQUIVO_AUSENTE:${relativePath}`);
      if (entry.sha256 && hashFile(absolute) !== entry.sha256) throw new Error(`MAPA_DISTRIBUICAO_HASH_DIVERGENTE:${relativePath}`);
    }
  }
  normalizeMapPath(map.self || distributionMapRelativePath(map.version));
  return map;
}

function readDistributionMap(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    throw new Error(`MAPA_DISTRIBUICAO_AUSENTE:${toPosixPath(filePath)}`);
  }
  let map;
  try {
    map = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`MAPA_DISTRIBUICAO_JSON_INVALIDO:${toPosixPath(filePath)}:${error.message}`);
  }
  try {
    return validateDistributionMap(map, { rootDir: findMapRoot(filePath), requireFiles: false });
  } catch (error) {
    throw new Error(`MAPA_DISTRIBUICAO_SEMANTICA_INVALIDA:${toPosixPath(filePath)}:${error.message}`);
  }
}

function findInstalledDistributionMap(rootDir) {
  const releasePath = path.join(rootDir, "release.json");
  if (fs.existsSync(releasePath)) {
    const release = JSON.parse(fs.readFileSync(releasePath, "utf8"));
    const declared = release.distributionMap && release.distributionMap.path;
    if (declared) {
      const target = path.join(rootDir, normalizeMapPath(declared));
      return readDistributionMap(target);
    }
  }
  const activePath = path.join(rootDir, ACTIVE_MAP_PATH);
  if (fs.existsSync(activePath)) {
    let active;
    try {
      active = JSON.parse(fs.readFileSync(activePath, "utf8"));
    } catch (error) {
      throw new Error(`MAPA_DISTRIBUICAO_ATIVO_JSON_INVALIDO:${toPosixPath(activePath)}:${error.message}`);
    }
    const target = path.join(rootDir, normalizeMapPath(active.path));
    return readDistributionMap(target);
  }
  return null;
}

function compareDistributionMaps(previousMap, currentMap, rootDir = "") {
  const previous = indexEntries(previousMap);
  const current = indexEntries(currentMap);
  const result = { added: [], conflicts: [], kept: [], moved: [], preserved: [], removed: [], updated: [] };

  for (const [entryPath, currentEntry] of current) {
    const prior = previous.get(entryPath);
    if (!prior) {
      const moved = [...previous.values()].find((entry) => entry.sha256 && currentEntry.sha256 && entry.sha256 === currentEntry.sha256 && entry.path !== currentEntry.path);
      if (moved) result.moved.push({ from: moved.path, to: currentEntry.path });
      else result.added.push(currentEntry.path);
      continue;
    }
    if (prior.sha256 && currentEntry.sha256 && prior.sha256 !== currentEntry.sha256) result.updated.push(currentEntry.path);
    else result.kept.push(currentEntry.path);
  }

  for (const [entryPath, prior] of previous) {
    if (current.has(entryPath)) continue;
    if (prior.removalPolicy === "preserve" || prior.userModifiable || prior.property === "local" || prior.property === "extension") {
      result.preserved.push(prior.path);
      continue;
    }
    if (rootDir && prior.sha256) {
      const localPath = path.join(rootDir, prior.path);
      if (fs.existsSync(localPath) && fs.statSync(localPath).isFile() && hashFile(localPath) !== prior.sha256) {
        result.conflicts.push({ path: prior.path, reason: "local-modified" });
        continue;
      }
    }
    result.removed.push(prior.path);
  }

  return result;
}

function indexEntries(map) {
  const result = new Map();
  if (!map || !Array.isArray(map.entries)) return result;
  for (const entry of map.entries) result.set(normalizeMapPath(entry.path), entry);
  return result;
}

function normalizeMapPath(value) {
  const raw = String(value || "").trim().replace(/\\/gu, "/").replace(/^\.\//u, "");
  if (!raw || /^[A-Za-z]:\//u.test(raw) || path.posix.isAbsolute(raw) || raw === "." || raw === ".." || raw.startsWith("../") || raw.includes("/../") || raw.includes("//")) {
    throw new Error(`PATH_MAPA_DISTRIBUICAO_INSEGURO:${value}`);
  }
  return raw.endsWith("/") ? raw : raw;
}

function hashFile(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function findMapRoot(filePath) {
  const normalized = toPosixPath(path.resolve(filePath));
  const marker = "/.ia.rules/distribution/";
  const index = normalized.lastIndexOf(marker);
  if (index === -1) return path.dirname(path.dirname(path.dirname(filePath)));
  return path.resolve(normalized.slice(0, index));
}

function toPosixPath(value) {
  return String(value || "").replace(/\\/gu, "/");
}

module.exports = {
  ACTIVE_MAP_PATH,
  DISTRIBUTION_MAP_FORMAT,
  DISTRIBUTION_MAP_SCHEMA,
  buildDistributionMap,
  compareDistributionMaps,
  distributionMapFileName,
  distributionMapRelativePath,
  findInstalledDistributionMap,
  normalizeMapPath,
  readDistributionMap,
  validateDistributionMap,
};
