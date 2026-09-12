// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const crypto = require("crypto");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const CANONICAL_TODO = path.join(".ia.rules", "state", "TODO.ia.md");

/** Executa inspectTodoIa no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function inspectTodoIa(rootDir, options = {}) {
  const files = locateTodoFiles(rootDir, options);
  const records = files.map((relativePath) => {
    const absolute = path.join(rootDir, relativePath);
    const content = fs.readFileSync(absolute, "utf8");
    return { hash: sha256(content), items: parseTodoItems(content), path: toPosix(relativePath) };
  });
  return {
    code: records.length ? "TODO_IA_FOUND" : "TODO_IA_EMPTY",
    records,
    status: records.some((record) => record.path !== toPosix(CANONICAL_TODO)) ? "triagem_requerida" : "ok",
  };
}

/** Executa assertTodoIaTriaged no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function assertTodoIaTriaged(rootDir, options = {}) {
  const result = inspectTodoIa(rootDir, options);
  const pending = result.records.filter((record) => record.path !== toPosix(CANONICAL_TODO) || record.items.some((item) => item.status === "pendente"));
  if (pending.length) throw new Error(`TODO_IA_TRIAGEM_PENDENTE:${pending.map((record) => record.path).join(",")}`);
  return result;
}

/** Executa locateTodoFiles no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function locateTodoFiles(rootDir, options = {}) {
  const candidates = [options.path || CANONICAL_TODO, "TODO.ia.md"].map((value) => path.normalize(String(value)));
  return [...new Set(candidates)]
    .filter((relativePath) => !path.isAbsolute(relativePath) && fs.existsSync(path.join(rootDir, relativePath)))
    .sort((a, b) => toPosix(a).localeCompare(toPosix(b), "en"));
}

/** Executa parseTodoItems no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function parseTodoItems(content) {
  return String(content).split(/\r?\n/u).map((line, index) => ({ line, number: index + 1 }))
    .filter((entry) => /^\s*[-*]\s+(?:\[[ xX-]\]\s+)?\S/u.test(entry.line))
    .map((entry) => ({
      line: entry.number,
      status: /\[[xX]\]/u.test(entry.line) ? "concluido" : "pendente",
      text: entry.line.replace(/^\s*[-*]\s+(?:\[[ xX-]\]\s+)?/u, "").trim(),
    }));
}

const TODO_MARKER = "# TO-DOs";
const EQUALIZER = "- [ ] Equalizar e executar as TO-DOs como frentes convergentes de um único objetivo";
const STATUS_EMOJI = new Set(["⬜", "📌", "📜", "⚖️", "⏳", "🔄", "🔎", "✅"]);

/** Analisa gramática, raízes, subordinação, status e invariantes do TODO governado. */
function parseGovernedTodo(content) {
  const text = String(content || "").replace(/\r\n/gu, "\n");
  const marker = text.indexOf(`\n${TODO_MARKER}\n`);
  if (!text.startsWith("# RCF — Governança da TO-DO\n") || marker < 0) throw new Error("TODO_GOVERNANCA_INVALIDA");
  const governance = text.slice(0, marker + 1);
  const operational = text.slice(marker + 1);
  if (!governance.includes(EQUALIZER)) throw new Error("TODO_EQUALIZER_AUSENTE");
  const roots = [];
  for (const [offset, line] of operational.split("\n").entries()) {
    if (/^\s+[-*]\s+(?:\[[ xX]\]|[⬜📌📜⚖️⏳🔄🔎✅])/u.test(line)) continue;
    const checkbox = line.match(/^- \[([ xX])\] (\S.*)$/u);
    const emoji = line.match(/^([⬜📌📜⚖️⏳🔄🔎✅]) (\S.*)$/u);
    if (!checkbox && !emoji) continue;
    const status = checkbox ? (checkbox[1].toLocaleLowerCase() === "x" ? "✅" : "⬜") : emoji[1];
    roots.push({ line: offset + governance.split("\n").length, marker: checkbox ? "checkbox" : "emoji", status, text: (checkbox ? checkbox[2] : emoji[2]).trim() });
  }
  if (roots.some((root) => root.text.startsWith("Equalizar e executar") && (root.marker !== "checkbox" || root.status !== "⬜"))) {
    throw new Error("TODO_EQUALIZER_NAO_PERENE");
  }
  return { governanceHash: sha256(governance), operationalHash: sha256(operational), roots };
}

/** Inicializa estado canônico e preserva o exemplar raiz como projeção compatível. */
function migrateCanonicalState(rootDir) {
  const rootTodo = path.join(rootDir, "TODO.ia.md");
  if (!fs.existsSync(rootTodo)) throw new Error("TODO_RAIZ_AUSENTE");
  const content = fs.readFileSync(rootTodo, "utf8");
  const parsed = parseGovernedTodo(content);
  const stateDir = path.join(rootDir, ".ia.rules", "state");
  fs.mkdirSync(stateDir, { recursive: true });
  const legacyContinue = path.join(rootDir, ".ia.rules", "continue.ia");
  const canonicalContinue = path.join(stateDir, "continue.ia");
  if (!fs.existsSync(legacyContinue) && !fs.existsSync(canonicalContinue)) throw new Error("CONTINUE_IA_AUSENTE");
  const continueContent = fs.readFileSync(fs.existsSync(canonicalContinue) ? canonicalContinue : legacyContinue, "utf8");
  if (fs.existsSync(canonicalContinue) && fs.existsSync(legacyContinue) && sha256(fs.readFileSync(legacyContinue, "utf8")) !== sha256(continueContent)) {
    throw new Error("CONTINUE_MIGRACAO_CONFLITO");
  }
  atomicWrite(canonicalContinue, continueContent);
  const canonical = path.join(rootDir, CANONICAL_TODO);
  if (fs.existsSync(canonical) && sha256(fs.readFileSync(canonical, "utf8")) !== sha256(content)) throw new Error("TODO_MIGRACAO_CONFLITO");
  atomicWrite(canonical, content);
  const defaults = {
    "memory.md": "# Memória operacional\n\nÍndice durável; evidência não constitui autoridade.\n",
    "fix.md": "# Correções\n\nÍndice de riscos e reclamações do desenvolvedor.\n",
    "FT.implementados.md": "# FTs implementadas\n\nÍndice mínimo para pedidos e evidências canônicas.\n",
  };
  for (const [name, initial] of Object.entries(defaults)) {
    const target = path.join(stateDir, name);
    if (!fs.existsSync(target)) atomicWrite(target, initial);
  }
  const baseline = {
    schema: "agents-state-migration/v1", generatedAt: new Date().toISOString(),
    entries: [
      { source: "TODO.ia.md", destination: ".ia.rules/state/TODO.ia.md", sha256: sha256(content) },
      { source: ".ia.rules/continue.ia", destination: ".ia.rules/state/continue.ia", sha256: sha256(continueContent) },
    ],
  };
  atomicWrite(path.join(stateDir, "migration-baseline.json"), `${JSON.stringify(baseline, null, 2)}\n`);
  const index = {
    schema: "agents-state-index/v1", active: "continue.ia", todo: "TODO.ia.md", durable: "memory.md",
    corrections: "fix.md", completed: "FT.implementados.md", governanceHash: parsed.governanceHash,
  };
  atomicWrite(path.join(stateDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`);
  return { code: "STATE_MIGRATED", baseline, index };
}

/** Calcula fingerprint estável derivado sem persistir identificador bruto do equipamento. */
function environmentFingerprint() {
  let raw = "";
  let source = "kernel-fallback";
  try {
    if (process.platform === "win32") {
      raw = childProcess.execFileSync("reg", ["query", "HKLM\\SOFTWARE\\Microsoft\\Cryptography", "/v", "MachineGuid"], { encoding: "utf8", windowsHide: true })
        .split(/\r?\n/u).find((line) => line.includes("MachineGuid"))?.trim().split(/\s{2,}/u).pop() || "";
      source = "windows-machine-guid-hash";
    } else if (fs.existsSync("/etc/machine-id")) {
      raw = fs.readFileSync("/etc/machine-id", "utf8").trim(); source = "linux-machine-id-hash";
    }
  } catch (_) { raw = ""; }
  const kernel = { platform: os.platform(), release: os.release(), arch: os.arch(), node: process.version };
  if (!raw) raw = JSON.stringify(kernel);
  return { id: sha256(`agents-env-v1\0${raw}`).slice(0, 24), source, stable: source !== "kernel-fallback", kernel };
}

/** Acrescenta resultado operacional com proveniência mínima e sem segredo. */
function recordMemoryResult(rootDir, result) {
  const required = ["command", "projectHash", "timestamp", "exitCode"];
  for (const field of required) if (result[field] === undefined || result[field] === "") throw new Error(`MEMORIA_CAMPO_AUSENTE:${field}`);
  const forbidden = /(token|password|secret|authorization)\s*[:=]/iu;
  const serialized = JSON.stringify(result);
  if (forbidden.test(serialized)) throw new Error("MEMORIA_SEGREDO_RECUSADO");
  const target = path.join(rootDir, ".ia.rules", "state", "memory.md");
  const record = { ...result, environment: environmentFingerprint() };
  fs.appendFileSync(target, `\n- \`${record.timestamp}\` ${JSON.stringify(record)}\n`, "utf8");
  return record;
}

/** Grava estado por temporário, fsync e rename. */
function atomicWrite(target, content) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const temporary = `${target}.tmp-${process.pid}-${crypto.randomBytes(4).toString("hex")}`;
  const handle = fs.openSync(temporary, "wx");
  try { fs.writeFileSync(handle, content, "utf8"); fs.fsyncSync(handle); } finally { fs.closeSync(handle); }
  fs.renameSync(temporary, target);
}

/** Executa sha256 no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function sha256(content) {
  return crypto.createHash("sha256").update(String(content).replace(/\r\n/gu, "\n"), "utf8").digest("hex");
}

/** Executa toPosix no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function toPosix(value) {
  return String(value).replace(/\\/gu, "/");
}

module.exports = {
  CANONICAL_TODO, EQUALIZER, STATUS_EMOJI, assertTodoIaTriaged, environmentFingerprint,
  inspectTodoIa, locateTodoFiles, migrateCanonicalState, parseGovernedTodo, parseTodoItems,
  recordMemoryResult,
};
