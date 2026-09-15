// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const fs = require("fs");
const path = require("path");

const EDIT_KINDS = new Set(["mechanical", "editorial", "ai-generated"]);

/** Valida um plano explícito de edições sem permitir sobreposição ou fonte implícita. */
function validateEditPlan(original, edits) {
  if (typeof original !== "string") throw new Error("EDITORIAL_ORIGINAL_INVALIDO");
  if (!Array.isArray(edits)) throw new Error("EDITORIAL_PLANO_INVALIDO");
  const normalized = edits.map((edit, index) => {
    if (!edit || !Number.isInteger(edit.start) || !Number.isInteger(edit.end) || edit.start < 0 || edit.end < edit.start || edit.end > original.length) {
      throw new Error(`EDITORIAL_INTERVALO_INVALIDO:${index}`);
    }
    if (typeof edit.replacement !== "string" || !EDIT_KINDS.has(edit.kind)) throw new Error(`EDITORIAL_EDICAO_INVALIDA:${index}`);
    const expected = edit.expected === undefined ? original.slice(edit.start, edit.end) : edit.expected;
    if (expected !== original.slice(edit.start, edit.end)) throw new Error(`EDITORIAL_FONTE_DIVERGENTE:${index}`);
    if (edit.ambiguous && edit.replacement !== expected) throw new Error(`EDITORIAL_AMBIGUIDADE_ALTERADA:${index}`);
    return { ...edit, expected, index };
  }).sort((left, right) => left.start - right.start || left.end - right.end);
  for (let index = 1; index < normalized.length; index += 1) {
    if (normalized[index].start < normalized[index - 1].end) throw new Error(`EDITORIAL_SOBREPOSICAO:${normalized[index].index}`);
  }
  return normalized;
}

/** Executa hook observador opcional sem tornar o hook requisito da capacidade. */
function notifyHook(hook, payload, diagnostics, strict) {
  if (typeof hook !== "function") return;
  try { hook(Object.freeze({ ...payload })); }
  catch (error) {
    if (strict) throw new Error(`EDITORIAL_HOOK_FALHOU:${error.message}`);
    diagnostics.push({ code: "EDITORIAL_HOOK_FALHOU", message: error.message });
  }
}

/** Aplica edições explícitas, preserva regiões não editadas e marca somente transformações autorais. */
function applyEditorialEdits(original, edits, options = {}) {
  const plan = validateEditPlan(original, edits);
  const diagnostics = [];
  const pieces = [];
  const markedPieces = [];
  const regions = [];
  let cursor = 0;
  let outputOffset = 0;
  notifyHook(options.hooks && options.hooks.before, { original, edits: plan }, diagnostics, options.strictHooks === true);
  for (const edit of plan) {
    const unchanged = original.slice(cursor, edit.start);
    pieces.push(unchanged, edit.replacement);
    markedPieces.push(unchanged);
    const transformed = edit.kind !== "mechanical" && edit.replacement !== edit.expected;
    markedPieces.push(transformed ? `<!-- AI-PROCESSED:START -->${edit.replacement}<!-- AI-PROCESSED:END -->` : edit.replacement);
    const outputStart = outputOffset + unchanged.length;
    const region = {
      kind: edit.kind,
      sourceStart: edit.start,
      sourceEnd: edit.end,
      outputStart,
      outputEnd: outputStart + edit.replacement.length,
      transformed,
      reason: edit.reason || null,
    };
    regions.push(region);
    outputOffset = region.outputEnd;
    cursor = edit.end;
  }
  pieces.push(original.slice(cursor));
  markedPieces.push(original.slice(cursor));
  const result = { schema: "agents-editorial-result/v1", original, output: pieces.join(""), markedOutput: markedPieces.join(""), regions, diagnostics };
  notifyHook(options.hooks && options.hooks.after, result, diagnostics, options.strictHooks === true);
  return result;
}

/** Produz diagnóstico mecânico de inteligibilidade sem reescrever nem infantilizar o texto. */
function assessIntelligibility(text, options = {}) {
  if (typeof text !== "string") throw new Error("EDITORIAL_TEXTO_INVALIDO");
  const sentenceWordLimit = Number.isInteger(options.sentenceWordLimit) ? options.sentenceWordLimit : 30;
  const knownTerms = new Set(options.knownTerms || []);
  const explanations = options.explanations || {};
  const findings = [];
  for (const sentence of text.split(/(?<=[.!?])\s+/u)) {
    const words = sentence.trim().split(/\s+/u).filter(Boolean);
    if (words.length > sentenceWordLimit) findings.push({ code: "PERIODO_LONGO", excerpt: sentence, words: words.length });
  }
  for (const term of knownTerms) {
    const expression = new RegExp(`\\b${String(term).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\b`, "iu");
    if (expression.test(text) && !String(explanations[term] || "").trim()) findings.push({ code: "TERMO_SEM_EXPLICACAO", term });
  }
  return { schema: "agents-editorial-assessment/v1", changed: false, findings };
}

/** Executa CLI baseada em JSON para aplicação ou diagnóstico editorial. */
function main(argv = process.argv.slice(2)) {
  if (!argv[0] || !argv[1]) throw new Error("Uso: editorial-authoring <apply|assess> <arquivo.json>");
  const input = JSON.parse(fs.readFileSync(path.resolve(argv[1]), "utf8"));
  const result = argv[0] === "apply"
    ? applyEditorialEdits(input.original, input.edits || [], input.options || {})
    : argv[0] === "assess" ? assessIntelligibility(input.text, input.options || {}) : null;
  if (!result) throw new Error("EDITORIAL_COMANDO_INVALIDO");
  console.log(JSON.stringify(result));
}

if (require.main === module) { try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; } }

module.exports = { applyEditorialEdits, assessIntelligibility, validateEditPlan };
