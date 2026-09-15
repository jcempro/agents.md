const assert = require("assert");

const editorial = require("../src/.ia.rules/core/runtime/scripts/editorial-authoring.ts");

const original = "Eu gosto disto. Porém, isto é complexo.";
const start = original.indexOf("complexo");
const result = editorial.applyEditorialEdits(original, [
  { start, end: start + "complexo".length, expected: "complexo", replacement: "difícil de entender", kind: "editorial", reason: "inteligibilidade" },
]);
assert.equal(result.output, "Eu gosto disto. Porém, isto é difícil de entender.");
assert.equal(result.markedOutput, "Eu gosto disto. Porém, isto é <!-- AI-PROCESSED:START -->difícil de entender<!-- AI-PROCESSED:END -->.");
assert.equal(result.regions[0].sourceStart, start);
assert.equal(result.regions[0].transformed, true);

const punctuation = editorial.applyEditorialEdits("É isto... mesmo!", [
  { start: 0, end: 1, expected: "É", replacement: "É", kind: "mechanical" },
]);
assert.equal(punctuation.output, "É isto... mesmo!");
assert.equal(punctuation.markedOutput, punctuation.output);

assert.throws(() => editorial.applyEditorialEdits("abc", [
  { start: 0, end: 2, replacement: "x", kind: "editorial" },
  { start: 1, end: 3, replacement: "y", kind: "editorial" },
]), /EDITORIAL_SOBREPOSICAO/u);
assert.throws(() => editorial.applyEditorialEdits("abc", [
  { start: 0, end: 1, expected: "z", replacement: "x", kind: "editorial" },
]), /EDITORIAL_FONTE_DIVERGENTE/u);
assert.throws(() => editorial.applyEditorialEdits("talvez", [
  { start: 0, end: 6, replacement: "certamente", kind: "editorial", ambiguous: true },
]), /EDITORIAL_AMBIGUIDADE_ALTERADA/u);

let observed = false;
assert.equal(editorial.applyEditorialEdits("voz", [], { hooks: { after: () => { observed = true; } } }).output, "voz");
assert.equal(observed, true);
const degraded = editorial.applyEditorialEdits("voz", [], { hooks: { before: () => { throw new Error("indisponível"); } } });
assert.equal(degraded.diagnostics[0].code, "EDITORIAL_HOOK_FALHOU");
assert.equal(editorial.applyEditorialEdits("voz", []).output, "voz");

const assessment = editorial.assessIntelligibility("Termo técnico permanece.", { knownTerms: ["técnico"] });
assert.deepEqual(assessment.findings, [{ code: "TERMO_SEM_EXPLICACAO", term: "técnico" }]);
assert.equal(assessment.changed, false);

console.log("editorial-authoring.test.js: OK");
