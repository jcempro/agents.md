const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  buildDistributionMap,
  compareDistributionMaps,
  distributionMapFileName,
  distributionMapRelativePath,
  normalizeMapPath,
  validateDistributionMap,
} = require("../src/.ia.rules/core/runtime/scripts/distribution-map");
const { planDistributionTransition } = require("../src/.ia.rules/core/runtime/scripts/update-agents");

const root = fs.mkdtempSync(path.join(os.tmpdir(), "agents-distribution-map-test-"));
try {
  fs.mkdirSync(path.join(root, ".ia.rules", "core"), { recursive: true });
  fs.writeFileSync(path.join(root, "AGENTS.md"), "norma\n", "utf8");
  fs.writeFileSync(path.join(root, "release.json"), "{\"schema\":1}\n", "utf8");
  fs.writeFileSync(path.join(root, ".ia.rules", "core", "contracts.md"), "contrato\n", "utf8");

  assert.equal(distributionMapFileName("0.0.20"), "distribution-map-0.0.20.json");
  assert.equal(distributionMapRelativePath("0.0.20"), ".ia.rules/distribution/distribution-map-0.0.20.json");
  assert.equal(normalizeMapPath("./.ia.rules/core/contracts.md"), ".ia.rules/core/contracts.md");
  assert.throws(() => normalizeMapPath("../AGENTS.md"), /PATH_MAPA_DISTRIBUICAO_INSEGURO/u);
  assert.throws(() => normalizeMapPath("C:\\temp\\x.md"), /PATH_MAPA_DISTRIBUICAO_INSEGURO/u);

  const selfPath = distributionMapRelativePath("0.0.20");
  const map = buildDistributionMap({
    files: [
      { path: "AGENTS.md" },
      { path: "release.json", status: "generated" },
      { path: ".ia.rules/core/contracts.md" },
      { path: selfPath, status: "generated" },
    ],
    rootDir: root,
    selfPath,
    version: "0.0.20",
  });
  assert.equal(map.format, "agents-distribution-map/v1");
  assert.ok(map.entries.find((entry) => entry.path === "AGENTS.md").sha256);
  assert.equal(map.entries.find((entry) => entry.path === selfPath).sha256, undefined);
  assert.ok(map.entries.find((entry) => entry.path === "agents.local.md").userModifiable);
  validateDistributionMap(map, { rootDir: root });

  const duplicate = { ...map, entries: [...map.entries, { ...map.entries[0], path: map.entries[0].path.toLocaleUpperCase("en-US") }] };
  assert.throws(() => validateDistributionMap(duplicate, { rootDir: root, requireFiles: false }), /PATH_DUPLICADO/u);

  const previous = {
    ...map,
    entries: [
      { path: "AGENTS.md", type: "file", status: "required", property: "managed", updatePolicy: "replace-if-managed", removalPolicy: "remove-when-obsolete-managed", source: "AGENTS.md", destination: "AGENTS.md", required: true, sha256: "a".repeat(64) },
      { path: ".ia.rules/obsolete.md", type: "file", status: "obsolete", property: "managed", updatePolicy: "replace-if-managed", removalPolicy: "remove-when-obsolete-managed", source: ".ia.rules/obsolete.md", destination: ".ia.rules/obsolete.md", required: false, sha256: "b".repeat(64) },
      { path: ".ia.rules/local/custom.md", type: "file", status: "optional", property: "local", updatePolicy: "preserve-local", removalPolicy: "preserve", source: ".ia.rules/local/custom.md", destination: ".ia.rules/local/custom.md", required: false, userModifiable: true },
      { path: ".ia.rules/moved-old.md", type: "file", status: "required", property: "managed", updatePolicy: "replace-if-managed", removalPolicy: "remove-when-obsolete-managed", source: ".ia.rules/moved-old.md", destination: ".ia.rules/moved-old.md", required: true, sha256: "c".repeat(64) },
    ],
  };
  const current = {
    ...map,
    entries: [
      { ...previous.entries[0], sha256: "d".repeat(64) },
      { ...previous.entries[3], path: ".ia.rules/moved-new.md", source: ".ia.rules/moved-new.md", destination: ".ia.rules/moved-new.md" },
      { path: ".ia.rules/new.md", type: "file", status: "required", property: "managed", updatePolicy: "replace-if-managed", removalPolicy: "remove-when-obsolete-managed", source: ".ia.rules/new.md", destination: ".ia.rules/new.md", required: true, sha256: "e".repeat(64) },
    ],
  };
  fs.mkdirSync(path.join(root, ".ia.rules"), { recursive: true });
  fs.writeFileSync(path.join(root, ".ia.rules", "obsolete.md"), "modificado\n", "utf8");
  const plan = compareDistributionMaps(previous, current, root);
  assert.deepEqual(plan.updated, ["AGENTS.md"]);
  assert.deepEqual(plan.added, [".ia.rules/new.md"]);
  assert.deepEqual(plan.moved, [{ from: ".ia.rules/moved-old.md", to: ".ia.rules/moved-new.md" }]);
  assert.deepEqual(plan.preserved, [".ia.rules/local/custom.md"]);
  assert.deepEqual(plan.conflicts.map((entry) => entry.path), [".ia.rules/obsolete.md"]);

  const releaseRoot = path.join(root, "release");
  fs.mkdirSync(path.join(releaseRoot, ".ia.rules", "distribution"), { recursive: true });
  fs.writeFileSync(path.join(releaseRoot, "release.json"), JSON.stringify({ distributionMap: { path: selfPath } }), "utf8");
  fs.writeFileSync(path.join(releaseRoot, selfPath), JSON.stringify(map), "utf8");
  fs.mkdirSync(path.join(root, ".ia.rules", "distribution"), { recursive: true });
  fs.writeFileSync(path.join(root, "release.json"), JSON.stringify({ distributionMap: { path: selfPath } }), "utf8");
  fs.writeFileSync(path.join(root, selfPath), "{", "utf8");
  const failSafe = planDistributionTransition(root, releaseRoot);
  assert.equal(failSafe.failSafe, true);
  assert.equal(failSafe.diagnostics[0].code, "MAPA_DISTRIBUICAO_LOCAL_IGNORADO");

  const remoteWithoutMap = path.join(root, "release-sem-mapa");
  fs.mkdirSync(remoteWithoutMap, { recursive: true });
  fs.writeFileSync(path.join(remoteWithoutMap, "release.json"), JSON.stringify({ schema: 1 }), "utf8");
  assert.throws(() => planDistributionTransition(root, remoteWithoutMap), /MAPA_DISTRIBUICAO_RELEASE_AUSENTE/u);

  const remoteWithBadMap = path.join(root, "release-mapa-invalido");
  fs.mkdirSync(path.join(remoteWithBadMap, ".ia.rules", "distribution"), { recursive: true });
  fs.writeFileSync(path.join(remoteWithBadMap, "release.json"), JSON.stringify({ distributionMap: { path: selfPath } }), "utf8");
  fs.writeFileSync(path.join(remoteWithBadMap, selfPath), "{", "utf8");
  assert.throws(() => planDistributionTransition(root, remoteWithBadMap), /MAPA_DISTRIBUICAO_JSON_INVALIDO/u);
} finally {
  fs.rmSync(root, { force: true, recursive: true });
}
