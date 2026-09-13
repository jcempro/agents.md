// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const legacyBridge = require("./legacy-update-bridge");

/** Mantém executável o path carregado por dispatchers anteriores ao alias canônico update:agents. */
async function main(argv = process.argv.slice(2), options = {}) {
  return legacyBridge.main(argv, options);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Falha ao atualizar governanca operacional: ${error.message}`);
    process.exitCode = String(error.message).startsWith("PARAMETRO_INVALIDO:") ? 2 : 1;
  });
}

module.exports = { main };
