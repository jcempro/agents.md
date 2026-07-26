const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { extractZip } = require("../.ia.rules/core/runtime/scripts/archive");
const { validateSourceDistributionManifest } = require("../.ia.rules/core/runtime/scripts/repo-tools");

const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "src");
const manifestPath = path.join(sourceDir, ".ia.rules", "distribution", "source-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const clone = (value) => JSON.parse(JSON.stringify(value));

assert.equal(validateSourceDistributionManifest(clone(manifest), sourceDir).entries.length, manifest.entries.length);
assert.ok(manifest.entries.every((entry) => entry.profile.startsWith("consumer-")));
assert.ok(!manifest.entries.some((entry) => entry.path.includes("evaluations/") || entry.path.includes("rcf-projection")));
assert.ok(manifest.entries.some((entry) => entry.path === ".ia.rules/config/repository.json" && entry.profile === "consumer-core"));
assert.ok(manifest.entries.some((entry) => entry.path === ".ia.rules/agents.inc.md" && entry.profile === "consumer-core"));

const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "agents-source-manifest-"));
try {
  fs.writeFileSync(path.join(temporary, "a.md"), "a\n", "utf8");
  fs.writeFileSync(path.join(temporary, "b.md"), "b\n", "utf8");
  const entry = (sourcePath, destination = sourcePath, profile = "consumer-core") => ({
    path: sourcePath,
    profile,
    destination,
    purpose: "teste",
    roles: ["final"],
    condition: "always",
    ownership: "managed",
    validation: ["source-exists"],
  });
  const base = (entries) => ({
    schema: "agents-source-distribution/v1",
    id: "agents.source-distribution",
    version: 1,
    generated: false,
    authority: "AGENTS.md#0.14",
    scope: "src",
    profiles: ["consumer-core", "consumer-runtime", "consumer-scenario", "consumer-bootstrap", "generated-release"],
    entries,
    integrity: { algorithm: "sha256", timing: "build" },
  });

  assert.throws(
    () => validateSourceDistributionManifest(base([entry("a.md")]), temporary),
    /FONTE_SEM_PERFIL:b\.md/u,
  );
  assert.throws(
    () => validateSourceDistributionManifest(base([entry("a.md"), entry("b.md", "a.md")]), temporary),
    /DESTINO_DUPLICADO/u,
  );
  assert.throws(
    () => validateSourceDistributionManifest(base([entry("a.md", "a.md", "builder-internal"), entry("b.md")]), temporary),
    /ENTRADA_INVALIDA/u,
  );
  assert.throws(
    () => validateSourceDistributionManifest(base([entry("../a.md"), entry("b.md")]), temporary),
    /PATH_INSEGURO/u,
  );
} finally {
  fs.rmSync(temporary, { force: true, recursive: true });
}

const release = JSON.parse(fs.readFileSync(path.join(rootDir, "dist", "release.json"), "utf8"));
const distributionMap = JSON.parse(fs.readFileSync(path.join(rootDir, "dist", release.distributionMap.path), "utf8"));
const publishedPaths = release.files.map((entry) => entry.path);
assert.ok(release.files.every((entry) => entry.profile && entry.profile !== "builder-internal"));
assert.ok(distributionMap.entries.filter((entry) => entry.type === "file" && entry.required).every((entry) => entry.profile));
assert.ok(!publishedPaths.some((entryPath) => /(?:^|\/)constructor(?:\/|$)|evaluations\/|rcf-projection|state\/decisions\/refused/u.test(entryPath)));
assert.ok(publishedPaths.includes(".ia.rules/config/repository.json"));
assert.ok(publishedPaths.includes(".ia.rules/agents.inc.md"));

const archivePath = fs.readdirSync(path.join(rootDir, "dist")).find((name) => /^agents-v.+\.zip$/u.test(name));
assert.ok(archivePath, "ZIP de release ausente.");
const extracted = fs.mkdtempSync(path.join(os.tmpdir(), "agents-release-zip-"));
try {
  extractZip(fs.readFileSync(path.join(rootDir, "dist", archivePath)), extracted);
  const forbidden = [
    path.join(extracted, "constructor"),
    path.join(extracted, ".ia.rules", "core", "evaluations"),
    path.join(extracted, ".ia.rules", "core", "rcf-projection.md"),
    path.join(extracted, ".ia.rules", "state", "decisions", "refused"),
  ];
  assert.ok(forbidden.every((target) => !fs.existsSync(target)));
  assert.ok(fs.existsSync(path.join(extracted, ".ia.rules", "scenarios", "governance", "constructor-operation.md")));
  assert.ok(fs.existsSync(path.join(extracted, ".ia.rules", "config", "repository.json")));
  assert.ok(fs.existsSync(path.join(extracted, ".ia.rules", "agents.inc.md")));
} finally {
  fs.rmSync(extracted, { force: true, recursive: true });
}

console.log("source-distribution.test.js: OK");
