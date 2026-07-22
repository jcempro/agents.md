// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const fs = require("fs");
const path = require("path");
const { loadConfiguration } = require("./configuration");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");

async function main(argv = process.argv.slice(2)) {
  const [operation, ...args] = argv;
  if (!operation || operation === "--help") {
    process.stdout.write("Uso: shared-lifecycle <publish|dev-live> [-- argumentos do hook]\n");
    return 0;
  }
  if (!new Set(["publish", "dev-live"]).has(operation)) throw new Error(`OPERACAO_INVALIDA:${operation}`);
  const configuration = loadConfiguration(ROOT_DIR);
  const hooksRoot = path.resolve(ROOT_DIR, configuration.lifecycle.hooksRoot);
  const context = Object.freeze({ args: Object.freeze([...args]), configuration, operation, rootDir: ROOT_DIR });
  const results = [];
  for (const phase of ["pre", "main", "post"]) {
    const suffix = phase === "main" ? "" : `.${phase}`;
    const hookPath = path.join(hooksRoot, `${operation}${suffix}.js`);
    if (!fs.existsSync(hookPath)) continue;
    const hook = require(hookPath);
    const execute = typeof hook === "function" ? hook : hook.execute;
    if (typeof execute !== "function") throw new Error(`HOOK_INVALIDO:${path.relative(ROOT_DIR, hookPath)}`);
    results.push({ phase, result: await execute(context) });
  }
  if (!results.some((item) => item.phase === "main")) {
    console.log(JSON.stringify({ code: `${operation.toUpperCase().replace("-", "_")}_NAO_APLICAVEL`, configuration: operation === "dev-live" ? configuration.devLive : undefined }));
    return 0;
  }
  console.log(JSON.stringify({ code: `${operation.toUpperCase().replace("-", "_")}_OK`, hooks: results.map((item) => item.phase) }));
  return 0;
}

if (require.main === module) main().then((code) => { process.exitCode = code; }).catch((error) => { console.error(error.message); process.exitCode = 1; });

module.exports = { main };
