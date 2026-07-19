// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const assert = require("assert");
const { resolveExistingReleaseTrigger } = require("../src/.agents/core/runtime/scripts/release-trigger-policy");

assert.strictEqual(resolveExistingReleaseTrigger("0.0.19", "0.0.19", false), "preserve");
assert.strictEqual(resolveExistingReleaseTrigger("0.0.18", "0.0.19", true), "replace");
assert.strictEqual(resolveExistingReleaseTrigger("0.0.18", "0.0.19", false), "conflict");

process.stdout.write("RELEASE_TRIGGER_POLICY_OK\n");
