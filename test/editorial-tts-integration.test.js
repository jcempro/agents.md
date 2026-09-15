const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { extractZip } = require("../.ia.rules/core/runtime/scripts/archive");
const editorial = require("../.ia.rules/core/runtime/scripts/editorial-authoring");
const spoken = require("../.ia.rules/core/runtime/scripts/spoken-normalization");
const distEditorial = require("../dist/.ia.rules/core/runtime/scripts/editorial-authoring");
const distSpoken = require("../dist/.ia.rules/core/runtime/scripts/spoken-normalization");

const root = path.resolve(__dirname, "..");
const original = 'No século XXI, Brasil vs. Argentina relembra João 3:16. Ele disse: "Leia".';
const term = "relembra";
const start = original.indexOf(term);
const edited = editorial.applyEditorialEdits(original, [{
  start,
  end: start + term.length,
  expected: term,
  replacement: "faz lembrar",
  kind: "editorial",
  reason: "palavra simples igualmente precisa",
}]);
const speech = spoken.createSpeechPayload(edited.output, {
  citationQuotes: true,
  locale: "pt-BR",
  mode: "continuous",
  adapter: ({ text, locale, mode }) => ({ text, voice: "fixture-neutral", locale, mode }),
});
assert.equal(edited.original, original);
assert.equal(speech.original, edited.output);
assert.match(speech.payload.text, /século 21.*Brasil versus Argentina.*João, capítulo 3, versículo 16.*abre aspas Leia fecha aspas/u);
assert.equal(speech.payload.locale, "pt-BR");

assert.deepEqual(
  distEditorial.applyEditorialEdits(original, []).output,
  editorial.applyEditorialEdits(original, []).output,
);
assert.deepEqual(
  distSpoken.normalizeForSpeech(original, { citationQuotes: true }),
  spoken.normalizeForSpeech(original, { citationQuotes: true }),
);

const release = JSON.parse(fs.readFileSync(path.join(root, "dist", "release.json"), "utf8"));
for (const runtime of ["editorial-authoring", "spoken-normalization"]) {
  assert.ok(release.files.some((entry) => entry.path === `.ia.rules/core/runtime/scripts/${runtime}.js`));
  assert.ok(release.files.some((entry) => entry.path === `.ia.rules/core/runtime/scripts/${runtime}.ts`));
}

const archiveName = fs.readdirSync(path.join(root, "dist")).find((name) => /^agents-v.+\.zip$/u.test(name));
assert.ok(archiveName, "ZIP de release local ausente");
const extracted = fs.mkdtempSync(path.join(os.tmpdir(), "agents-editorial-tts-"));
try {
  extractZip(fs.readFileSync(path.join(root, "dist", archiveName)), extracted);
  for (const runtime of ["editorial-authoring", "spoken-normalization"]) {
    assert.ok(fs.existsSync(path.join(extracted, ".ia.rules", "core", "runtime", "scripts", `${runtime}.js`)));
    assert.ok(fs.existsSync(path.join(extracted, ".ia.rules", "core", "runtime", "scripts", `${runtime}.ts`)));
  }
  const packageJson = JSON.parse(fs.readFileSync(path.join(extracted, "package.json"), "utf8"));
  assert.match(packageJson.scripts["agent:editorial"], /editorial-authoring\.js/u);
  assert.match(packageJson.scripts["agent:spoken"], /spoken-normalization\.js/u);
} finally {
  fs.rmSync(extracted, { recursive: true, force: true });
}

for (const fixture of [
  { platform: "win32", locale: "pt-BR", voice: "fixture-windows" },
  { platform: "linux", locale: "pt-BR", voice: "fixture-linux" },
  { platform: "darwin", locale: "pt-BR", voice: "fixture-macos" },
]) {
  const value = spoken.createSpeechPayload("João 3:16", {
    locale: fixture.locale,
    adapter: ({ text, locale }) => ({ text, locale, voice: fixture.voice, platform: fixture.platform }),
  });
  assert.equal(value.payload.text, "João, capítulo 3, versículo 16");
  assert.equal(value.payload.platform, fixture.platform);
}

console.log("editorial-tts-integration.test.js: OK");
