// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const fs = require("fs");
const path = require("path");
const updateAgents = require("./update-agents");

/** Localiza a raiz do consumidor a partir do próprio bridge, sem depender do cwd do processo. */
function findTargetRoot(startPath = __dirname) {
  let current = path.resolve(startPath);
  for (let depth = 0; depth < 8; depth += 1) {
    if (fs.existsSync(path.join(current, "AGENTS.md")) && fs.existsSync(path.join(current, "package.json"))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  throw new Error("RAIZ_CONSUMIDOR_NAO_RESOLVIDA");
}

/** Entrega a operação ao runtime íntegro contido na release e preserva os argumentos recebidos. */
async function main(argv = process.argv.slice(2), options = {}) {
  const rootDir = options.rootDir || findTargetRoot(options.startPath || __dirname);
  return updateAgents.main(argv.map(String), { ...options, rootDir });
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Falha ao atualizar governanca operacional: ${error.message}`);
    process.exitCode = String(error.message).startsWith("PARAMETRO_INVALIDO:") ? 2 : 1;
  });
}

module.exports = { findTargetRoot, main };
