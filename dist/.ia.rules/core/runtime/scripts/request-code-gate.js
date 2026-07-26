// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/core/runtime/scripts/request-code-gate.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

function p(e,t,a={}){const r=c(e),i=r.find(n=>n.ft===A(t));if(!i)return o("FT_CODIGO_AUSENTE");if(i.type!=="implementacao_codigo")return o("FT_NAO_E_CODIGO");const u=f(i.block).map(n=>r.find(d=>d.ft===n)).filter(Boolean);if(!u.length)return o("FT_NORMATIVA_AUSENTE");const s=u.filter(n=>n.type==="implementacao_normativa"&&n.status!=="concluido");return s.length?o("FT_NORMATIVA_PENDENTE",{fronts:s.map(n=>n.ft)}):a.authorized!==!0&&!m(i.block)?o("AUTORIZACAO_HUMANA_AUSENTE"):{code:"CODIGO_AUTORIZADO",ft:i.ft,normative:u.map(n=>n.ft),status:"authorized"}}function c(e){return String(e||"").split(/(?=^FT-\d+\|)/mu).filter(t=>/^FT-\d+\|/u.test(t)).map(t=>({block:t,ft:(t.match(/^(FT-\d+)\|/mu)||[])[1]||"",status:(t.match(/^FT-\d+\|.*\|status=([^|\r\n]+)/mu)||[])[1]||"",type:(t.match(/^FT-\d+\|.*\|tipo=([^|\r\n]+)/mu)||[])[1]||""}))}function f(e){const t=[];for(const r of String(e).matchAll(/\bFT-\d{3,}\b/gu))t.push(r[0]);const a=(String(e).match(/^(FT-\d+)\|/mu)||[])[1]||"";return[...new Set(t.filter(r=>r!==a))]}function m(e){return/^autorizacao_codigo=humana(?:\||$)/mu.test(String(e))||/^autorizacao_humana=sim(?:\||$)/mu.test(String(e))}function o(e,t={}){return{code:e,status:"blocked",...t}}function A(e){const t=String(e||"").toUpperCase();if(!/^FT-\d{3,}$/u.test(t))throw new Error("PARAMETRO_INVALIDO:ft");return t}module.exports={evaluateCodeAuthorization:p,hasExplicitAuthorization:m,parseDependencies:f,splitFronts:c};
