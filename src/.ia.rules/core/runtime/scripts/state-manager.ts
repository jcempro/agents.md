// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const path = require("path");
const todo = require("./todo-intake");

/** Expõe migração e projeções canônicas por comandos explícitos e revisáveis. */
function main(argv = process.argv.slice(2), rootDir = process.cwd()) {
  const [command, payload] = argv;
  if (command === "migrate") return todo.migrateCanonicalState(rootDir);
  if (command === "inspect") return todo.inspectTodoIa(rootDir);
  if (command === "sync") return todo.syncCanonicalProjections(rootDir);
  if (command === "record") {
    if (!payload) throw new Error("STATE_RECORD_JSON_AUSENTE");
    return todo.recordMemoryResult(rootDir, JSON.parse(payload));
  }
  if (command === "transition") {
    if (!payload) throw new Error("STATE_TRANSITION_JSON_AUSENTE");
    const request = JSON.parse(payload);
    return todo.transitionTodoRoot(rootDir, request.text, request.status, request);
  }
  if (command === "conclude") {
    if (!payload) throw new Error("STATE_CONCLUDE_JSON_AUSENTE");
    const request = JSON.parse(payload);
    return todo.concludeFeatureState(rootDir, request.ids, request);
  }
  throw new Error("Uso: state-manager <migrate|inspect|sync|record JSON|transition JSON|conclude JSON>");
}

if (require.main === module) {
  try { console.log(JSON.stringify(main(), null, 2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { main, rootPath: (...parts) => path.resolve(process.cwd(), ...parts) };
