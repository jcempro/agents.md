// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const assert = require("assert");
const { resolveExistingReleaseTrigger } = require("../.ia.rules/core/runtime/scripts/release-trigger-policy");
const { assertPreflight } = require("../.ia.rules/scenarios/release/scripts/release-publish-resume");
const { isReleaseTriggerChange } = require("../.ia.rules/scenarios/release/scripts/release-workflow");

assert.strictEqual(resolveExistingReleaseTrigger("0.0.19", "0.0.19", false), "preserve");
assert.strictEqual(resolveExistingReleaseTrigger("0.0.18", "0.0.19", true), "replace");
assert.strictEqual(resolveExistingReleaseTrigger("0.0.18", "0.0.19", false), "conflict");
assert.strictEqual(isReleaseTriggerChange("A"), true);
assert.strictEqual(isReleaseTriggerChange("M"), true);
assert.strictEqual(isReleaseTriggerChange("D"), false);
assert.doesNotThrow(() => assertPreflight({
  branch: "dev", dirty: [" M dist/release.json", "?? dist/map.json", " M index.json"], expectedBranch: "dev", localTag: false, workflow: true,
}));
assert.throws(() => assertPreflight({
  branch: "dev", dirty: [" M src/runtime.ts"], expectedBranch: "dev", localTag: false, workflow: true,
}), /WORKTREE_NAO_LIMPO: M src\/runtime\.ts/u);

process.stdout.write("RELEASE_TRIGGER_POLICY_OK\n");
