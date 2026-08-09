// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const assert = require("assert");
const { assertNativeDocumentation } = require("../.ia.rules/core/runtime/scripts/repo-tools");

/** Confirma cobertura positiva e negativa das declarações TypeScript e Python sem examinar artefatos derivados. */
function main() {
  const documentedTypeScript = `
/** Classe documentada. */
class Example {
  /** Inicializa a instância. */
  constructor() {}
  /** Executa o contrato. */
  run() {}
}
/** Contrato documentado. */
interface Contract { value: string }
/** Tipo documentado. */
type Identifier = string;
/** Função documentada. */
function execute() { return true; }
/** Callback documentado. */
const callback = () => true;
`;
  assert.equal(assertNativeDocumentation(documentedTypeScript, "fixture.ts"), 7);
  assert.throws(
    () => assertNativeDocumentation("function missing() {}", "fixture.ts"),
    /DOCUMENTACAO_NATIVA_AUSENTE:fixture\.ts:missing@1/u,
  );
  assert.throws(
    () => assertNativeDocumentation("/** Classe. */\nclass Example {\n  run() {}\n}", "fixture.ts"),
    /DOCUMENTACAO_NATIVA_AUSENTE:fixture\.ts:run@3/u,
  );

  const documentedPython = `def execute():
    """Executa o contrato."""
    return True

class Example:
    """Representa o contrato."""
`;
  assert.equal(assertNativeDocumentation(documentedPython, "fixture.py"), 2);
  assert.throws(
    () => assertNativeDocumentation("def missing():\n    return True\n", "fixture.py"),
    /DOCUMENTACAO_NATIVA_AUSENTE:fixture\.py:missing@1/u,
  );
  console.log("DOCUMENTATION_POLICY_OK");
}

main();
