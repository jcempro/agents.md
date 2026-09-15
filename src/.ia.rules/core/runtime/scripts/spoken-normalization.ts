// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const fs = require("fs");
const path = require("path");

const ROMAN_VALUES = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

/** Converte romano formal e canônico; sequências inválidas permanecem recusadas. */
function romanToNumber(value) {
  const roman = String(value || "").toUpperCase();
  if (!/^(?=.)M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/u.test(roman)) return null;
  let total = 0;
  for (let index = 0; index < roman.length; index += 1) {
    const current = ROMAN_VALUES[roman[index]];
    const next = ROMAN_VALUES[roman[index + 1]] || 0;
    total += current < next ? -current : current;
  }
  return total;
}

/** Protege código, URL e fórmula simples contra normalização editorial acidental. */
function protectTechnicalSegments(text) {
  const segments = [];
  const protectedText = String(text).replace(/`[^`]*`|https?:\/\/[^\s<>"']+|\b\w+\s*=\s*[^,.;\n]+/giu, (value) => {
    const token = `\uE000${segments.length}\uE001`;
    segments.push(value);
    return token;
  });
  return { text: protectedText, restore: (value) => value.replace(/\uE000(\d+)\uE001/gu, (_, index) => segments[Number(index)]) };
}

/** Valida e verbaliza parênteses e colchetes sem misturar seus tipos. */
function normalizeBrackets(text, diagnostics) {
  const pairs = { "(": ")", "[": "]" };
  const labels = { "(": "abre parênteses", ")": "fecha parênteses", "[": "abre colchetes", "]": "fecha colchetes" };
  const stack = [];
  let invalid = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (pairs[character]) stack.push({ character, index });
    else if (character === ")" || character === "]") {
      const opening = stack.pop();
      if (!opening || pairs[opening.character] !== character) { invalid = true; break; }
    }
  }
  if (stack.length || invalid) {
    diagnostics.push({ code: invalid ? "DELIMITADORES_CRUZADOS" : "DELIMITADORES_INCOMPLETOS" });
    return text;
  }
  return text.replace(/[()[\]]/gu, (character) => ` ${labels[character]} `).replace(/\s+/gu, " ").trim();
}

/** Verbaliza apenas pares de aspas classificados explicitamente como citação. */
function normalizeQuotes(text, options, diagnostics) {
  const hasQuotes = /["“”]/u.test(text);
  if (!hasQuotes) return text;
  if (options.citationQuotes !== true) {
    diagnostics.push({ code: "ASPAS_CONTEXTO_NAO_CLASSIFICADO" });
    return text;
  }
  let opened = false;
  const output = text.replace(/["“”]/gu, (character) => {
    if (character === "“") { opened = true; return " abre aspas "; }
    if (character === "”") { opened = false; return " fecha aspas "; }
    opened = !opened;
    return opened ? " abre aspas " : " fecha aspas ";
  });
  if (opened) {
    diagnostics.push({ code: "ASPAS_INCOMPLETAS" });
    return text;
  }
  return output.replace(/\s+/gu, " ").trim();
}

/** Normaliza confrontos inequívocos e preserva dimensões, multiplicações e variáveis. */
function normalizeVersus(text) {
  let output = text.replace(/\b([\p{L}][\p{L}\p{M}.'-]*)\s+vs\.?\s+([\p{L}][\p{L}\p{M}.'-]*)\b/giu, "$1 versus $2");
  output = output.replace(/\b([\p{L}][\p{L}\p{M}.'-]{1,})\s+[xX]\s+([\p{L}][\p{L}\p{M}.'-]{1,})\b/gu, "$1 versus $2");
  return output;
}

/** Normaliza romanos somente em contextos linguísticos autenticáveis. */
function normalizeRomans(text) {
  return text.replace(/\b(século|capítulo|volume)\s+([IVXLCDM]+)\b/giu, (whole, context, roman) => {
    const number = romanToNumber(roman);
    return number === null ? whole : `${context} ${number}`;
  }).replace(/\b([\p{Lu}][\p{L}\p{M}.'-]+)\s+([IVXLCDM]+)\b/gu, (whole, title, roman) => {
    const number = romanToNumber(roman);
    return number === null ? whole : `${title} ${number}`;
  });
}

/** Normaliza referências bíblicas conhecidas antes de qualquer leitura semelhante a horário. */
function normalizeBiblicalReferences(text) {
  const books = "Gênesis|Êxodo|Salmos|Mateus|Marcos|Lucas|João|Romanos|Coríntios|Apocalipse";
  const expression = new RegExp(`\\b((?:[123]\\s*)?(?:${books}))\\s+(\\d{1,3}):(\\d{1,3})(?:-(\\d{1,3}))?\\b`, "giu");
  return text.replace(expression, (_, book, chapter, verse, end) => `${book}, capítulo ${chapter}, ${end ? `versículos ${verse} a ${end}` : `versículo ${verse}`}`);
}

/** Prepara representação pt-BR falada, mantendo original, diagnósticos e mecanismos independentes. */
function normalizeForSpeech(original, options = {}) {
  if (typeof original !== "string") throw new Error("FALA_ORIGINAL_INVALIDO");
  const diagnostics = [];
  const protectedInput = protectTechnicalSegments(original);
  let text = protectedInput.text;
  text = text.replace(/<sup\b[^>]*>\s*([^<]+?)\s*<\/sup>/giu, (_, marker) => ` nota ${marker} `);
  text = text.replace(/<blockquote\b[^>]*>/giu, " início da citação em bloco ").replace(/<\/blockquote>/giu, " fim da citação em bloco ");
  text = normalizeBiblicalReferences(text);
  text = normalizeVersus(text);
  text = normalizeRomans(text);
  text = normalizeBrackets(text, diagnostics);
  text = normalizeQuotes(text, options, diagnostics);
  text = protectedInput.restore(text).replace(/\s+/gu, " ").trim();
  return { schema: "agents-spoken-normalization/v1", locale: options.locale || "pt-BR", mode: options.mode || "continuous", original, spokenText: text, diagnostics };
}

/** Produz o payload efetivo de TTS por adaptador opcional e observável. */
function createSpeechPayload(original, options = {}) {
  const normalized = normalizeForSpeech(original, options);
  const base = { text: normalized.spokenText, locale: normalized.locale, mode: normalized.mode };
  const payload = typeof options.adapter === "function" ? options.adapter(Object.freeze({ ...base })) : base;
  if (!payload || typeof payload !== "object") throw new Error("TTS_PAYLOAD_INVALIDO");
  if (typeof options.hook === "function") options.hook(Object.freeze({ normalized, payload }));
  return { ...normalized, payload };
}

/** Executa CLI JSON para normalização ou criação de payload. */
function main(argv = process.argv.slice(2)) {
  if (!argv[0] || !argv[1]) throw new Error("Uso: spoken-normalization <normalize|payload> <arquivo.json>");
  const input = JSON.parse(fs.readFileSync(path.resolve(argv[1]), "utf8"));
  const result = argv[0] === "normalize" ? normalizeForSpeech(input.text, input.options || {})
    : argv[0] === "payload" ? createSpeechPayload(input.text, input.options || {}) : null;
  if (!result) throw new Error("FALA_COMANDO_INVALIDO");
  console.log(JSON.stringify(result));
}

if (require.main === module) { try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; } }

module.exports = { createSpeechPayload, normalizeBiblicalReferences, normalizeBrackets, normalizeForSpeech, normalizeQuotes, normalizeRomans, normalizeVersus, protectTechnicalSegments, romanToNumber };
