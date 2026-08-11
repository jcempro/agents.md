const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { resolveReleaseRuntime } = require("../.ia.rules/core/runtime/scripts/update-agents");

const repositoryRoot = path.join(__dirname, "..");
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "agents-handoff-fallback-"));

try {
  fs.cpSync(path.join(repositoryRoot, "dist"), fixture, { recursive: true });
  const releasePath = path.join(fixture, "release.json");
  const release = JSON.parse(fs.readFileSync(releasePath, "utf8"));
  delete release.handoff;
  fs.writeFileSync(releasePath, `${JSON.stringify(release)}\n`);
  fs.rmSync(path.join(fixture, ".ia.rules", "core", "runtime", "scripts", "repository-boundary.js"));

  const recovered = resolveReleaseRuntime(fixture);
  assert.equal(recovered.entryPath, fs.realpathSync(path.join(fixture, "scripts", ".agents", "autoupdate.js")));
  assert.equal(Object.keys(recovered.runtimeHashes).length, 1);
  assert.match(recovered.recovery, /bridge legado autocontido/u);

  fs.appendFileSync(path.join(fixture, "scripts", ".agents", "autoupdate.js"), "\n// adulterado\n");
  assert.throws(() => resolveReleaseRuntime(fixture), /Runtime de handoff divergente/u);
} finally {
  fs.rmSync(fixture, { force: true, recursive: true });
}
