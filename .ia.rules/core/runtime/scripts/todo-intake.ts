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
const FEATURE_HISTORY_DIR = path.join(".ia.rules", "state", "history");
const COMPLETED_FEATURES_INDEX = path.join(".ia.rules", "state", "FT.implementados.md");

/** Executa inspectTodoIa no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function inspectTodoIa(rootDir, options = {}) {
  const files = locateTodoFiles(rootDir, options);
  const records = files.map((relativePath) => {
    const absolute = path.join(rootDir, relativePath);
    const content = fs.readFileSync(absolute, "utf8");
    return { hash: sha256(content), items: parseTodoItems(content), path: toPosix(relativePath) };
  });
  const canonical = records.find((record) => record.path === toPosix(CANONICAL_TODO));
  const divergentProjection = canonical && records.some((record) => record.path !== canonical.path && record.hash !== canonical.hash);
  return {
    code: records.length ? "TODO_IA_FOUND" : "TODO_IA_EMPTY",
    records,
    status: !canonical || divergentProjection ? "triagem_requerida" : "ok",
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

/** Projeta estado canônico nos adaptadores legados após validar a governança imutável. */
function syncCanonicalProjections(rootDir) {
  const stateDir = path.join(rootDir, ".ia.rules", "state");
  const canonicalTodo = path.join(rootDir, CANONICAL_TODO);
  const canonicalContinue = path.join(stateDir, "continue.ia");
  if (!fs.existsSync(canonicalTodo) || !fs.existsSync(canonicalContinue)) throw new Error("ESTADO_CANONICO_INCOMPLETO");
  const todoContent = fs.readFileSync(canonicalTodo, "utf8");
  const canonicalGovernance = parseGovernedTodo(todoContent).governanceHash;
  const rootTodo = path.join(rootDir, "TODO.ia.md");
  if (fs.existsSync(rootTodo) && parseGovernedTodo(fs.readFileSync(rootTodo, "utf8")).governanceHash !== canonicalGovernance) {
    throw new Error("TODO_GOVERNANCA_DIVERGENTE");
  }
  atomicWrite(rootTodo, todoContent);
  atomicWrite(path.join(rootDir, ".ia.rules", "continue.ia"), fs.readFileSync(canonicalContinue, "utf8"));
  return { code: "STATE_PROJECTIONS_SYNCED", todoHash: sha256(todoContent), continueHash: sha256(fs.readFileSync(canonicalContinue, "utf8")) };
}

/** Transiciona uma frente canônica ou a remove após aprovação humana efetiva. */
function transitionTodoRoot(rootDir, text, nextStatus, options = {}) {
  const canonical = path.join(rootDir, CANONICAL_TODO);
  if (!fs.existsSync(canonical)) throw new Error("TODO_CANONICO_AUSENTE");
  const content = fs.readFileSync(canonical, "utf8").replace(/\r\n/gu, "\n");
  const lines = content.split("\n");
  const marker = lines.indexOf(TODO_MARKER);
  const rootPattern = /^(?:- \[[ xX]\]|[⬜📌📜⚖️⏳🔄🔎✅]) (\S.*)$/u;
  const roots = lines.map((line, index) => ({ index, match: line.match(rootPattern) })).filter((entry) => entry.index > marker && entry.match);
  const matches = roots.filter((entry) => entry.match[1] === text);
  if (matches.length !== 1) throw new Error(`TODO_FRENTE_NAO_UNICA:${text}`);
  const current = matches[0];
  const currentStatus = current.match[0].startsWith("- [") ? (/^- \[[xX]\]/u.test(current.match[0]) ? "✅" : "⬜") : current.match[0].match(/^[⬜📌📜⚖️⏳🔄🔎✅]/u)[0];
  if (options.approvedHuman) {
    if (options.authorization !== "human" || currentStatus !== "✅") throw new Error("TODO_REMOCAO_SEM_APROVACAO");
    const next = roots.find((entry) => entry.index > current.index);
    lines.splice(current.index, (next ? next.index : lines.length) - current.index);
  } else {
    if (!STATUS_EMOJI.has(nextStatus)) throw new Error(`TODO_STATUS_INVALIDO:${nextStatus}`);
    if (nextStatus === "⏳" && (options.authorization !== "human" || options.normativeFtConcluded !== true)) {
      throw new Error("TODO_IMPLEMENTACAO_NAO_AUTORIZADA");
    }
    lines[current.index] = `${nextStatus} ${text}`;
  }
  atomicWrite(canonical, lines.join("\n"));
  syncCanonicalProjections(rootDir);
  return { code: options.approvedHuman ? "TODO_ROOT_REMOVED" : "TODO_ROOT_TRANSITIONED", from: currentStatus, to: options.approvedHuman ? null : nextStatus, text };
}

/** Conclui FTs autorizadas e reduz imediatamente seu estado corrente sem perder o registro integral. */
function concludeFeatureState(rootDir, ids, options = {}) {
  if (options.authorization !== "human") throw new Error("FT_CONCLUSAO_NAO_AUTORIZADA");
  const canonical = path.join(rootDir, ".ia.rules", "state", "continue.ia");
  if (!fs.existsSync(canonical)) throw new Error("CONTINUE_CANONICO_AUSENTE");
  let content = fs.readFileSync(canonical, "utf8").replace(/\r\n/gu, "\n");
  const now = options.timestamp || new Date().toISOString();
  for (const id of ids) {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    const startMatch = content.match(new RegExp(`^${escaped}\\|`, "mu"));
    if (!startMatch) throw new Error(`FT_ESTADO_AUSENTE:${id}`);
    const start = startMatch.index;
    const tail = content.slice(start);
    const boundary = tail.search(/\nFT-\d+\|/u);
    const end = boundary < 0 ? content.length : start + boundary + 1;
    let section = content.slice(start, end).replace(/\|status=[^|\r\n]+/u, "|status=concluida").replace(/\|atualizacao=[^|\r\n]+/u, `|atualizacao=${now}`)
      .replace(/\[(?:pendente|em_andamento)\]/gu, "[concluido]");
    if (!/\|autorizacao=/u.test(section.split("\n", 1)[0])) section = section.replace(/\n/u, "|autorizacao=humana\n");
    if (!/\|conclusao=/u.test(section.split("\n", 1)[0])) section = section.replace(/\n/u, `|conclusao=${now}\n`);
    section = section.replace(/^resultado=.*\nverificacoes=.*\npendencias=.*\n\n(?=objetivo=)/mu, "");
    const evidence = options.evidence && options.evidence[id] || {};
    const close = `resultado=${evidence.result || "Implementação concluída conforme aceite da FT."}\nverificacoes=${evidence.verification || "Gates locais aplicáveis executados."}\npendencias=${evidence.pending || "Nenhuma pendência funcional; validação humana do TODO permanece externa."}`;
    section = /^pendencias=.*$/mu.test(section) ? section.replace(/^pendencias=.*$/mu, close) : `${section.trimEnd()}\n${close}\n`;
    content = `${content.slice(0, start)}${section}${content.slice(end)}`;
  }
  atomicWrite(canonical, content);
  const plan = options.developerValidated === true
    ? { validated: ids, pendingValidation: [] }
    : { validated: [], pendingValidation: ids };
  const reconciliation = reconcileFeatureState(rootDir, plan, {
    authorization: options.authorization,
    validatedBy: options.developerValidated === true ? "developer" : "",
  });
  return { code: "FT_STATE_CONCLUDED", ids, reconciliation };
}

/** Separa seções de FT sem interpretar ou reescrever seu histórico material. */
function parseFeatureState(content) {
  const text = String(content || "").replace(/\r\n/gu, "\n");
  const starts = [...text.matchAll(/^FT-\d+\|.*$/gmu)];
  const sections = starts.map((match, index) => {
    const start = match.index;
    const end = index + 1 < starts.length ? starts[index + 1].index : text.length;
    const body = text.slice(start, end).trimEnd();
    const header = body.split("\n", 1)[0];
    const fields = Object.fromEntries(header.split("|").slice(1).map((field) => {
      const separator = field.indexOf("=");
      return separator < 0 ? [field, ""] : [field.slice(0, separator), field.slice(separator + 1)];
    }));
    return { body, fields, id: header.split("|", 1)[0] };
  });
  const preamble = starts.length ? text.slice(0, starts[0].index).trimEnd() : text.trimEnd();
  return { preamble, sections };
}

/** Reconcilia classificação humana explícita com histórico por FT e estado operacional mínimo. */
function reconcileFeatureState(rootDir, plan = {}, options = {}) {
  if (options.authorization !== "human") throw new Error("FT_RECONCILIACAO_NAO_AUTORIZADA");
  const validated = normalizeFeatureIds(plan.validated || []);
  const pendingValidation = normalizeFeatureIds(plan.pendingValidation || []);
  if (validated.length && options.validatedBy !== "developer") throw new Error("FT_VALIDACAO_DESENVOLVEDOR_AUSENTE");
  const overlap = validated.find((id) => pendingValidation.includes(id));
  if (overlap) throw new Error(`FT_CLASSIFICACAO_AMBIGUA:${overlap}`);

  const canonical = path.join(rootDir, ".ia.rules", "state", "continue.ia");
  if (!fs.existsSync(canonical)) throw new Error("CONTINUE_CANONICO_AUSENTE");
  const parsed = parseFeatureState(fs.readFileSync(canonical, "utf8"));
  const byId = new Map();
  for (const section of parsed.sections) {
    if (!byId.has(section.id)) byId.set(section.id, []);
    byId.get(section.id).push(section);
  }
  const records = new Map();

  for (const id of [...validated, ...pendingValidation]) {
    const sections = byId.get(id);
    if (!sections) {
      if (validated.includes(id) && fs.existsSync(featureHistoryAbsolute(rootDir, id))) continue;
      throw new Error(`FT_ESTADO_AUSENTE:${id}`);
    }
    if (pendingValidation.includes(id) && sections.length !== 1) throw new Error(`FT_ESTADO_DUPLICADO:${id}`);
    if (sections.some((section) => !/^conclu[ií]d[oa]$/iu.test(String(section.fields.status || "")))) throw new Error(`FT_NAO_CONCLUIDA:${id}`);
    records.set(id, persistFeatureHistory(rootDir, sections));
  }

  const nextSections = parsed.sections.flatMap((section) => {
    if (validated.includes(section.id)) return [];
    if (pendingValidation.includes(section.id)) return [renderPendingValidation(section, records.get(section.id))];
    return [section.body];
  });
  const nextContent = `${[parsed.preamble, ...nextSections].filter(Boolean).join("\n\n").trimEnd()}\n`;
  rewriteFeatureStateReferences(rootDir, validated);
  writeFeatureHistoryIndexes(rootDir, nextContent);
  atomicWrite(canonical, nextContent);
  syncCanonicalProjections(rootDir);
  return {
    code: "FT_STATE_RECONCILED",
    pendingValidation,
    stateSha256: sha256(nextContent),
    unchanged: [...validated].filter((id) => !byId.has(id)),
    validated,
  };
}

/** Converge somente âncoras estruturadas conhecidas; texto livre permanece para revisão explícita. */
function rewriteFeatureStateReferences(rootDir, validated) {
  if (!validated.length) return 0;
  const target = path.join(rootDir, ".ia.rules", "state", "decisions", "refused", "index.json");
  if (!fs.existsSync(target)) return 0;
  const index = JSON.parse(fs.readFileSync(target, "utf8"));
  let changed = 0;
  for (const entry of index.entries || []) {
    if (!Array.isArray(entry.relatedArtifacts)) continue;
    entry.relatedArtifacts = entry.relatedArtifacts.map((artifact) => {
      const match = String(artifact).match(/^\.ia\.rules\/(?:state\/)?continue\.ia#(FT-\d+)$/u);
      if (!match || !validated.includes(match[1])) return artifact;
      changed += 1;
      return `.ia.rules/state/history/${match[1]}.ia#${match[1]}`;
    });
  }
  if (changed) atomicWrite(target, `${JSON.stringify(index, null, 2)}\n`);
  return changed;
}

/** Normaliza IDs, rejeita ambiguidades e conserva ordem determinística. */
function normalizeFeatureIds(ids) {
  if (!Array.isArray(ids)) throw new Error("FT_CLASSIFICACAO_INVALIDA");
  const normalized = ids.map((id) => String(id || "").trim());
  for (const id of normalized) if (!/^FT-\d+$/u.test(id)) throw new Error(`FT_ID_INVALIDO:${id}`);
  if (new Set(normalized).size !== normalized.length) throw new Error("FT_ID_DUPLICADO");
  return normalized.sort((left, right) => left.localeCompare(right, "en", { numeric: true }));
}

/** Resolve destino fixo por identidade validada, sem aceitar path fornecido externamente. */
function featureHistoryAbsolute(rootDir, id) {
  return path.join(rootDir, FEATURE_HISTORY_DIR, `${id}.ia`);
}

/** Obtém o histórico integral original de seção já compactada ou da própria seção. */
function featureHistoryContent(rootDir, section) {
  const pointer = section.body.match(/^historico=([^|\r\n]+)\|sha256=([a-f0-9]{64})$/mu);
  if (!pointer) return `${section.body.trimEnd()}\n`;
  const expected = toPosix(path.join(FEATURE_HISTORY_DIR, `${section.id}.ia`));
  if (toPosix(pointer[1]) !== expected) throw new Error(`FT_HISTORICO_PATH_INVALIDO:${section.id}`);
  const target = featureHistoryAbsolute(rootDir, section.id);
  if (!fs.existsSync(target)) throw new Error(`FT_HISTORICO_AUSENTE:${section.id}`);
  const content = fs.readFileSync(target, "utf8").replace(/\r\n/gu, "\n");
  if (sha256(content) !== pointer[2]) throw new Error(`FT_HISTORICO_HASH_DIVERGENTE:${section.id}`);
  return content;
}

/** Grava antes da remoção; duplicata histórica legítima é conservada integralmente no mesmo registro. */
function persistFeatureHistory(rootDir, sections) {
  const content = sections.map((section) => featureHistoryContent(rootDir, section).trimEnd()).join("\n\n") + "\n";
  const [section] = sections;
  const target = featureHistoryAbsolute(rootDir, section.id);
  const digest = sha256(content);
  if (fs.existsSync(target)) {
    if (sha256(fs.readFileSync(target, "utf8")) !== digest) throw new Error(`FT_HISTORICO_COLISAO:${section.id}`);
  } else {
    atomicWrite(target, content);
  }
  return { id: section.id, path: toPosix(path.join(FEATURE_HISTORY_DIR, `${section.id}.ia`)), sha256: digest };
}

/** Projeta somente identificação, conclusão, pendência e ponte ao histórico íntegro. */
function renderPendingValidation(section, record) {
  const header = section.body.split("\n", 1)[0];
  const normalizedHeader = /\|validacao=/u.test(header)
    ? header.replace(/\|validacao=[^|\r\n]+/u, "|validacao=pendente_desenvolvedor")
    : `${header}|validacao=pendente_desenvolvedor`;
  const lines = [normalizedHeader];
  for (const key of ["objetivo", "origem", "resultado", "verificacoes", "pendencias"]) {
    const match = section.body.match(new RegExp(`^${key}=(.*)$`, "mu"));
    if (match) lines.push(`${key}=${match[1]}`);
  }
  if (!lines.some((line) => line.startsWith("pendencias="))) lines.push("pendencias=Validação do desenvolvedor.");
  lines.push(`historico=${record.path}|sha256=${record.sha256}`);
  return lines.join("\n");
}

/** Regenera índices humano/mecânico exclusivamente dos históricos verificados. */
function writeFeatureHistoryIndexes(rootDir, stateContent) {
  const historyDir = path.join(rootDir, FEATURE_HISTORY_DIR);
  fs.mkdirSync(historyDir, { recursive: true });
  const currentIds = new Set(parseFeatureState(stateContent).sections.map((section) => section.id));
  const entries = fs.readdirSync(historyDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^FT-\d+\.ia$/u.test(entry.name))
    .map((entry) => {
      const id = entry.name.slice(0, -3);
      const relativePath = toPosix(path.join(FEATURE_HISTORY_DIR, entry.name));
      const content = fs.readFileSync(path.join(historyDir, entry.name), "utf8");
      const header = content.split(/\r?\n/u, 1)[0];
      const name = (header.match(/\|nome=([^|\r\n]+)/u) || [])[1] || "Sem nome";
      return { id, name, path: relativePath, sha256: sha256(content), state: currentIds.has(id) ? "pendente-validacao" : "validada" };
    }).sort((left, right) => left.id.localeCompare(right.id, "en", { numeric: true }));
  const machine = { schema: "agents-feature-history-index/v1", entries };
  atomicWrite(path.join(historyDir, "index.json"), `${JSON.stringify(machine, null, 2)}\n`);
  const markdown = ["# FTs implementadas", "", "Índice mínimo; carregue somente o histórico da FT pertinente.", "",
    ...entries.map((entry) => `- ${entry.id} — ${entry.name}; estado: ${entry.state}; histórico: \`${toPosix(path.relative(path.join(rootDir, ".ia.rules", "state"), path.join(rootDir, entry.path)))}\`; sha256: \`${entry.sha256}\`.`), ""].join("\n");
  atomicWrite(path.join(rootDir, COMPLETED_FEATURES_INDEX), markdown);
  const stateIndexPath = path.join(rootDir, ".ia.rules", "state", "index.json");
  if (fs.existsSync(stateIndexPath)) {
    const stateIndex = JSON.parse(fs.readFileSync(stateIndexPath, "utf8"));
    stateIndex.history = "history/index.json";
    atomicWrite(stateIndexPath, `${JSON.stringify(stateIndex, null, 2)}\n`);
  }
  return entries;
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
  concludeFeatureState, parseFeatureState, reconcileFeatureState, recordMemoryResult,
  syncCanonicalProjections, transitionTodoRoot,
};
