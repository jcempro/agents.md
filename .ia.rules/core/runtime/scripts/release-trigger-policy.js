// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

function resolveExistingReleaseTrigger(existingVersion, requestedVersion, published) {
  if (existingVersion === requestedVersion) {
    return "preserve";
  }
  return published ? "replace" : "conflict";
}

module.exports = { resolveExistingReleaseTrigger };
