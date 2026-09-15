const assert = require("assert");

const spoken = require("../src/.ia.rules/core/runtime/scripts/spoken-normalization.ts");

assert.equal(spoken.normalizeForSpeech("Brasil vs. Argentina").spokenText, "Brasil versus Argentina");
assert.equal(spoken.normalizeForSpeech("Brasil X Argentina").spokenText, "Brasil versus Argentina");
assert.equal(spoken.normalizeForSpeech("3 x 4 e matriz A x B").spokenText, "3 x 4 e matriz A x B");
assert.equal(spoken.normalizeForSpeech("Use `Brasil vs Argentina` e https://x.test/a(vs)").spokenText, "Use `Brasil vs Argentina` e https://x.test/a(vs)");

assert.equal(spoken.normalizeForSpeech("século XXI, volume IV e Luís XIV").spokenText, "século 21, volume 4 e Luís 14");
assert.equal(spoken.normalizeForSpeech("mistério IIV").spokenText, "mistério IIV");
assert.equal(spoken.normalizeForSpeech("João 3:16-18 às 12:30").spokenText, "João, capítulo 3, versículos 16 a 18 às 12:30");
assert.equal(spoken.normalizeForSpeech("texto<sup>12</sup>").spokenText, "texto nota 12");

const quote = spoken.normalizeForSpeech('Ele disse: "venha".', { citationQuotes: true });
assert.equal(quote.spokenText, "Ele disse: abre aspas venha fecha aspas .");
assert.equal(spoken.normalizeForSpeech('Uso "irônico"').spokenText, 'Uso "irônico"');
assert.equal(spoken.normalizeForSpeech('Uso "irônico"').diagnostics[0].code, "ASPAS_CONTEXTO_NAO_CLASSIFICADO");
assert.equal(spoken.normalizeForSpeech("<blockquote>Texto</blockquote>").spokenText, "início da citação em bloco Texto fim da citação em bloco");

assert.equal(spoken.normalizeForSpeech("A (B [C])").spokenText, "A abre parênteses B abre colchetes C fecha colchetes fecha parênteses");
const crossed = spoken.normalizeForSpeech("A ([B)]");
assert.equal(crossed.spokenText, "A ([B)]");
assert.equal(crossed.diagnostics[0].code, "DELIMITADORES_CRUZADOS");
const incomplete = spoken.normalizeForSpeech("A (B");
assert.equal(incomplete.spokenText, "A (B");
assert.equal(incomplete.diagnostics[0].code, "DELIMITADORES_INCOMPLETOS");

let observed;
const payload = spoken.createSpeechPayload("João 3:16", {
  mode: "full",
  adapter: (input) => ({ ssml: `<speak>${input.text}</speak>`, language: input.locale }),
  hook: (value) => { observed = value; },
});
assert.equal(payload.payload.ssml, "<speak>João, capítulo 3, versículo 16</speak>");
assert.equal(payload.mode, "full");
assert.equal(observed.normalized.original, "João 3:16");
assert.equal(spoken.createSpeechPayload("texto").payload.text, "texto");
assert.throws(() => spoken.createSpeechPayload("texto", { adapter: () => null }), /TTS_PAYLOAD_INVALIDO/u);

console.log("spoken-normalization.test.js: OK");
