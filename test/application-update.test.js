const assert = require("assert");
const { checkApplicationUpdate, compareVersions, parseVersionPayload } = require("../src/.ia.rules/scenarios/application-update/scripts/application-update");

async function main() {
  assert.equal(compareVersions("1.2.3", "1.2.4"), -1);
  assert.deepEqual(parseVersionPayload("{\"version\":\"2.0.0\"}"), { valid: true, version: "2.0.0" });
  assert.equal((await checkApplicationUpdate({ enabled: false })).state, "politica_bloqueada");
  assert.equal((await checkApplicationUpdate({ currentVersion: "1.0.0", enabled: true }, { dryRun: true })).state, "offline");
  const result = await checkApplicationUpdate({ currentVersion: "1.0.0", enabled: true, source: { type: "static", version: "1.1.0" } });
  assert.equal(result.state, "atualizacao_disponivel");
  assert.equal(result.updateAvailable, true);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
