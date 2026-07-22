// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

function evaluateCodeAuthorization(memory, ftId, options = {}) {
  const fronts = splitFronts(memory);
  const target = fronts.find((front) => front.ft === normalizeFt(ftId));
  if (!target) return blocked("FT_CODIGO_AUSENTE");
  if (target.type !== "implementacao_codigo") return blocked("FT_NAO_E_CODIGO");
  const dependencies = parseDependencies(target.block);
  const normative = dependencies.map((id) => fronts.find((front) => front.ft === id)).filter(Boolean);
  if (!normative.length) return blocked("FT_NORMATIVA_AUSENTE");
  const openNormative = normative.filter((front) => front.type === "implementacao_normativa" && front.status !== "concluido");
  if (openNormative.length) return blocked("FT_NORMATIVA_PENDENTE", { fronts: openNormative.map((front) => front.ft) });
  if (options.authorized !== true && !hasExplicitAuthorization(target.block)) return blocked("AUTORIZACAO_HUMANA_AUSENTE");
  return { code: "CODIGO_AUTORIZADO", ft: target.ft, normative: normative.map((front) => front.ft), status: "authorized" };
}

function splitFronts(memory) {
  return String(memory || "").split(/(?=^FT-\d+\|)/mu)
    .filter((block) => /^FT-\d+\|/u.test(block))
    .map((block) => ({
      block,
      ft: (block.match(/^(FT-\d+)\|/mu) || [])[1] || "",
      status: (block.match(/^FT-\d+\|.*\|status=([^|\r\n]+)/mu) || [])[1] || "",
      type: (block.match(/^FT-\d+\|.*\|tipo=([^|\r\n]+)/mu) || [])[1] || "",
    }));
}

function parseDependencies(block) {
  const dependencies = [];
  for (const match of String(block).matchAll(/\bFT-\d{3,}\b/gu)) dependencies.push(match[0]);
  const self = (String(block).match(/^(FT-\d+)\|/mu) || [])[1] || "";
  return [...new Set(dependencies.filter((id) => id !== self))];
}

function hasExplicitAuthorization(block) {
  return /^autorizacao_codigo=humana(?:\||$)/mu.test(String(block)) || /^autorizacao_humana=sim(?:\||$)/mu.test(String(block));
}

function blocked(reason, details = {}) {
  return { code: reason, status: "blocked", ...details };
}

function normalizeFt(value) {
  const ft = String(value || "").toUpperCase();
  if (!/^FT-\d{3,}$/u.test(ft)) throw new Error("PARAMETRO_INVALIDO:ft");
  return ft;
}

module.exports = { evaluateCodeAuthorization, hasExplicitAuthorization, parseDependencies, splitFronts };
