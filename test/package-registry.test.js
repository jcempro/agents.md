const assert = require("assert");
const { runPackageRegistryLifecycle } = require("../src/.ia.rules/scenarios/release/scripts/package-registry");

function main() {
  assert.equal(runPackageRegistryLifecycle("release").code, "PACKAGE_REGISTRY_SKIPPED");
  const dry = runPackageRegistryLifecycle("release", { packageRegistry: { enabled: true, packageName: "pkg", registry: "npm" } }, { dryRun: true });
  assert.equal(dry.code, "PACKAGE_REGISTRY_DRY_RUN");
  assert.equal(dry.effects.length, 4);
  const calls = [];
  const adapter = {
    confirmPackage: () => { calls.push("confirm"); return { ok: true, token: "omitido" }; },
    preparePackage: () => { calls.push("prepare"); return { ok: true }; },
    publishPackage: () => { calls.push("publish"); return { ok: true }; },
    verifyPackage: () => { calls.push("verify"); return { ok: true }; },
  };
  const result = runPackageRegistryLifecycle("release", { packageRegistry: { enabled: true, packageName: "pkg", registry: "npm" } }, { adapter });
  assert.equal(result.code, "PACKAGE_REGISTRY_OK");
  assert.deepEqual(calls, ["prepare", "verify", "publish", "confirm"]);
  assert.equal(Object.hasOwn(result.effects[3].result, "token"), false);
}

main();
