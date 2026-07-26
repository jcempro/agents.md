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

const FORMAT = "agents-rcf-trace/v1";
const PENDING = "[PENDENTE-CODIGO]";
const HASH_MARKER = /\[([a-f0-9]{7})\]$/iu;

/** Localiza raiz por RCF/AGENTS e evita confundir pacote interno com repositório. */
function resolveRoot(start = __dirname) {
  let current = path.resolve(start);
  while (path.dirname(current) !== current) {
    if (fs.existsSync(path.join(current, "AGENTS.md")) && fs.existsSync(path.join(current, "package.json"))) return current;
    current = path.dirname(current);
  }
  throw new Error("RAIZ_REPOSITORIO_NAO_ENCONTRADA");
}

/** Executa Git sem shell e preserva diagnóstico para validação causal. */
function git(rootDir, args, options = {}) {
  const result = childProcess.spawnSync("git", args, { cwd: rootDir, encoding: "utf8", shell: false });
  if (!options.optional && result.status !== 0) throw new Error(`GIT_FALHOU:${args.join(" ")}:${result.stderr || result.stdout}`);
  return result;
}

/** Lista paths alterados inclusive no commit raiz para comprovar vínculo material. */
function commitPaths(rootDir, commit) {
  return new Set(git(rootDir, ["show", "--pretty=", "--name-only", "--format=", commit]).stdout.split(/\r?\n/u).filter(Boolean));
}

/** Calcula ID estável da sentença sem incorporar marcador humano mutável. */
function sentenceId(rcfPath, text) {
  return crypto.createHash("sha256").update(`${rcfPath}\0${stripMarker(text).trim()}`, "utf8").digest("hex").slice(0, 24);
}

/** Remove somente assinatura ou pendência terminal reconhecida. */
function stripMarker(text) {
  return String(text).replace(/\s+(?:\[PENDENTE-CODIGO\]|\[[a-f0-9]{7}\])$/iu, "");
}

/** Classifica linha material implementável e exclui estrutura Markdown não normativa. */
function isMaterialLine(line, fenced) {
  const value = stripMarker(line).trim();
  if (fenced || !value || /^(?:#|<!--|\||```|~~~)/u.test(value)) return false;
  if (/^\[[^\]]+\]:/u.test(value)) return false;
  return /\b(?:DEVE|DEVEM|NÃO DEVE|NÃO DEVEM|PODE|PODEM|PROIBID[OA]S?|OBRIGATÓRI[OA]S?|obrigatório|proibido)\b/iu.test(value);
}

/** Extrai sentenças materiais por linha com estado de bloco cercado determinístico. */
function materialLines(content) {
  const lines = String(content).replace(/\r\n/gu, "\n").split("\n");
  const result = [];
  let fenced = false;
  for (let index = 0; index < lines.length; index += 1) {
    if (/^\s*(?:```|~~~)/u.test(lines[index])) {
      fenced = !fenced;
      continue;
    }
    if (isMaterialLine(lines[index], fenced)) result.push({ index, text: lines[index] });
  }
  return { lines, material: result };
}

/** Lê mapa local ou inicializa formato vazio sem criar segunda fonte normativa. */
function readMap(rootDir, mapPath = defaultMapPath(rootDir)) {
  if (!fs.existsSync(mapPath)) return { format: FORMAT, schema: 1, entries: [] };
  let value;
  try {
    value = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  } catch (error) {
    throw new Error(`RCF_MAPA_INVALIDO:${error.message}`);
  }
  if (!value || value.format !== FORMAT || value.schema !== 1 || !Array.isArray(value.entries)) {
    throw new Error("RCF_MAPA_INVALIDO");
  }
  return value;
}

/** Define localização repository-local, nunca incluída pelo manifesto de release. */
function defaultMapPath(rootDir) {
  return path.join(rootDir, ".ia.rules", "state", "traceability", "rcf-map.json");
}

/** Grava JSON por troca atômica para não deixar mapa parcial em interrupção. */
function writeMap(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.agents-${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    fs.renameSync(temporary, filePath);
  } finally {
    if (fs.existsSync(temporary)) fs.rmSync(temporary, { force: true });
  }
}

/** Converte blame porcelain em hash integral causal para cada linha histórica. */
function blameHashes(rootDir, rcfPath) {
  const result = git(rootDir, ["blame", "--line-porcelain", "--", rcfPath]);
  const hashes = [];
  for (const line of result.stdout.split(/\r?\n/u)) {
    const match = /^([a-f0-9]{40})\s+\d+\s+\d+(?:\s+\d+)?$/u.exec(line);
    if (match) hashes.push(match[1]);
  }
  return hashes;
}

/** Migra RCF do construtor usando commit que materializou cada linha normativa no próprio produto. */
function migrateConstructor(rootDir, rcfPath, options = {}) {
  if (!options.constructorNormative) throw new Error("MIGRACAO_RCF_EXIGE_CONSTRUCTOR_NORMATIVE");
  const absolute = path.join(rootDir, rcfPath);
  const parsed = materialLines(fs.readFileSync(absolute, "utf8"));
  const hashes = blameHashes(rootDir, rcfPath);
  if (hashes.length !== parsed.lines.length - 1 && hashes.length !== parsed.lines.length) {
    throw new Error(`RCF_BLAME_INCOMPATIVEL:lines=${parsed.lines.length}:hashes=${hashes.length}`);
  }
  const map = readMap(rootDir, options.mapPath);
  const byId = new Map(map.entries.map((entry) => [entry.id, entry]));
  for (const item of parsed.material) {
    const fullCommit = hashes[item.index];
    if (!fullCommit) throw new Error(`RCF_BLAME_AUSENTE:${rcfPath}:${item.index + 1}`);
    parsed.lines[item.index] = `${stripMarker(item.text)} [${fullCommit.slice(-7)}]`;
    const id = sentenceId(rcfPath, item.text);
    byId.set(id, {
      artifacts: [rcfPath],
      commit: fullCommit,
      ft: options.ft || "",
      id,
      line: item.index + 1,
      rcf: rcfPath,
      sentenceSha256: crypto.createHash("sha256").update(stripMarker(item.text).trim(), "utf8").digest("hex"),
      state: "synchronized",
      syncCommit: "",
    });
  }
  fs.writeFileSync(absolute, parsed.lines.join("\n"), "utf8");
  map.entries = [...byId.values()].sort((a, b) => a.rcf.localeCompare(b.rcf, "en") || a.line - b.line);
  writeMap(options.mapPath || defaultMapPath(rootDir), map);
  return { entries: parsed.material.length, rcf: rcfPath };
}

/** Registra pendências explicitamente selecionadas antes do commit material. */
function prepare(rootDir, rcfPath, artifacts, options = {}) {
  if (!artifacts.length) throw new Error("RCF_ARTEFATO_AUSENTE");
  const absolute = path.join(rootDir, rcfPath);
  const parsed = materialLines(fs.readFileSync(absolute, "utf8"));
  const selected = new Set((options.lines || []).map(Number));
  if (!selected.size) throw new Error("RCF_LINHA_MATERIAL_AUSENTE");
  const map = readMap(rootDir, options.mapPath);
  const byId = new Map(map.entries.map((entry) => [entry.id, entry]));
  for (const item of parsed.material.filter((entry) => selected.has(entry.index + 1))) {
    parsed.lines[item.index] = `${stripMarker(item.text)} ${PENDING}`;
    const id = sentenceId(rcfPath, item.text);
    byId.set(id, {
      artifacts: artifacts.map((value) => value.replace(/\\/gu, "/")).sort(),
      commit: "",
      ft: options.ft || "",
      id,
      line: item.index + 1,
      rcf: rcfPath,
      sentenceSha256: crypto.createHash("sha256").update(stripMarker(item.text).trim(), "utf8").digest("hex"),
      state: "pending",
      syncCommit: "",
    });
  }
  fs.writeFileSync(absolute, parsed.lines.join("\n"), "utf8");
  map.entries = [...byId.values()].sort((a, b) => a.rcf.localeCompare(b.rcf, "en") || a.line - b.line);
  writeMap(options.mapPath || defaultMapPath(rootDir), map);
  return { pending: selected.size };
}

/** Confirma commit material, causalidade por artefato e substitui somente pendências mapeadas. */
function finalize(rootDir, fullCommit, options = {}) {
  const resolved = git(rootDir, ["rev-parse", `${fullCommit}^{commit}`]).stdout.trim();
  const changed = commitPaths(rootDir, resolved);
  const mapPath = options.mapPath || defaultMapPath(rootDir);
  const map = readMap(rootDir, mapPath);
  const pending = map.entries.filter((entry) => entry.state === "pending");
  if (!pending.length) throw new Error("RCF_PENDENCIA_AUSENTE");
  const byRcf = new Map();
  for (const entry of pending) {
    if (!entry.artifacts.some((artifact) => changed.has(artifact))) {
      throw new Error(`RCF_COMMIT_SEM_ARTEFATO_CAUSAL:${entry.id}`);
    }
    if (!byRcf.has(entry.rcf)) byRcf.set(entry.rcf, []);
    byRcf.get(entry.rcf).push(entry);
  }
  for (const [rcfPath, entries] of byRcf) {
    const absolute = path.join(rootDir, rcfPath);
    const parsed = materialLines(fs.readFileSync(absolute, "utf8"));
    for (const entry of entries) {
      const item = parsed.material.find((candidate) => sentenceId(rcfPath, candidate.text) === entry.id);
      if (!item || !item.text.trimEnd().endsWith(PENDING)) throw new Error(`RCF_PENDENCIA_DIVERGENTE:${entry.id}`);
      parsed.lines[item.index] = `${stripMarker(item.text)} [${resolved.slice(-7)}]`;
      entry.commit = resolved;
      entry.state = "synchronized";
    }
    fs.writeFileSync(absolute, parsed.lines.join("\n"), "utf8");
  }
  writeMap(mapPath, map);
  return { commit: resolved, synchronized: pending.length };
}

/** Valida formato, mapa, hash integral existente, marcador final e round trip causal. */
function validate(rootDir, options = {}) {
  const map = readMap(rootDir, options.mapPath);
  const byRcf = new Map();
  const changedByCommit = new Map();
  for (const entry of map.entries) {
    if (!entry.id || !entry.rcf || !entry.sentenceSha256 || !Array.isArray(entry.artifacts) ||
      !["pending", "materialized", "synchronized"].includes(entry.state)) throw new Error(`RCF_ENTRADA_INVALIDA:${entry.id || "sem-id"}`);
    if (!byRcf.has(entry.rcf)) byRcf.set(entry.rcf, []);
    byRcf.get(entry.rcf).push(entry);
  }
  let material = 0;
  for (const [rcfPath, entries] of byRcf) {
    const parsed = materialLines(fs.readFileSync(path.join(rootDir, rcfPath), "utf8"));
    material += parsed.material.length;
    for (const item of parsed.material) {
      const id = sentenceId(rcfPath, item.text);
      const entry = entries.find((candidate) => candidate.id === id);
      if (!entry) throw new Error(`RCF_SENTENCA_NAO_MAPEADA:${rcfPath}:${item.index + 1}`);
      const digest = crypto.createHash("sha256").update(stripMarker(item.text).trim(), "utf8").digest("hex");
      if (digest !== entry.sentenceSha256) throw new Error(`RCF_SENTENCA_DIVERGENTE:${entry.id}`);
      if (entry.state === "pending") {
        if (!item.text.trimEnd().endsWith(PENDING) || entry.commit) throw new Error(`RCF_PENDENCIA_INVALIDA:${entry.id}`);
        continue;
      }
      const marker = HASH_MARKER.exec(item.text.trimEnd());
      if (!marker || !/^[a-f0-9]{40}$/u.test(entry.commit) || marker[1].toLocaleLowerCase("en-US") !== entry.commit.slice(-7)) {
        throw new Error(`RCF_ASSINATURA_INVALIDA:${entry.id}`);
      }
      if (!changedByCommit.has(entry.commit)) {
        git(rootDir, ["cat-file", "-e", `${entry.commit}^{commit}`]);
        changedByCommit.set(entry.commit, commitPaths(rootDir, entry.commit));
      }
      const changed = changedByCommit.get(entry.commit);
      if (!entry.artifacts.some((artifact) => changed.has(artifact))) throw new Error(`RCF_CAUSALIDADE_INVALIDA:${entry.id}`);
    }
  }
  return { entries: map.entries.length, material };
}

/** Interpreta opções repetíveis sem depender de pacote externo ou shell específico. */
function parseArgs(argv) {
  const options = { artifacts: [], lines: [] };
  for (let index = 1; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--constructor-normative") options.constructorNormative = true;
    else if (["--artifact", "--line"].includes(key)) {
      const field = key === "--artifact" ? "artifacts" : "lines";
      options[field].push(argv[++index]);
    } else if (key.startsWith("--")) options[key.slice(2)] = argv[++index];
  }
  return options;
}

/** Executa migração, preparo, finalização ou validação por contrato CLI estável. */
function main(argv = process.argv.slice(2), runtime = {}) {
  const rootDir = runtime.rootDir || resolveRoot();
  const command = argv[0] || "validate";
  const options = parseArgs(argv);
  const rcfPath = options.rcf || "RCF.md";
  if (command === "migrate") return migrateConstructor(rootDir, rcfPath, { constructorNormative: options.constructorNormative, ft: options.ft });
  if (command === "prepare") return prepare(rootDir, rcfPath, options.artifacts, { ft: options.ft, lines: options.lines });
  if (command === "finalize") return finalize(rootDir, options.commit || "", {});
  if (command === "validate") return validate(rootDir, {});
  throw new Error(`RCF_COMANDO_INVALIDO:${command}`);
}

if (require.main === module) {
  try {
    process.stdout.write(`${JSON.stringify(main())}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { finalize, isMaterialLine, main, materialLines, migrateConstructor, prepare, sentenceId, stripMarker, validate };
