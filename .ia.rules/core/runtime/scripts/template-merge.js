// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/core/runtime/scripts/template-merge.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

const T=require("crypto");function O(n,t,e={}){return(e.type||w(e.path||""))==="json"?d(n,t,e):m(n,t,e)}function m(n,t,e={}){g(e);const r=e.id,o=String(e.version||"1"),a=`<!-- ia-rules-template:${r}:v${o}:begin -->`,u=`<!-- ia-rules-template:${r}:v${o}:end -->`,l=`${a}
${String(t).trimEnd()}
${u}`,i=String(n||""),p=new RegExp(`${h(a)}[\\s\\S]*?${h(u)}`,"u"),E=p.test(i)?i.replace(p,l):`${i.trimEnd()}${i.trim()?`

`:""}${l}
`;return y(i,E,{id:r,mode:"text-region",version:o})}function d(n,t,e={}){g(e);const r=S(n||"{}","local"),o=S(t,"template"),a=f(r,o),u=`${JSON.stringify(a,null,2)}
`;return y(String(n||""),u,{id:e.id,mode:"json-merge",version:String(e.version||"1")})}function f(n,t){if(!s(n)||!s(t))return $(t);const e={...n};for(const[r,o]of Object.entries(t))e[r]=s(o)&&s(n[r])?f(n[r],o):$(o);return e}function g(n={}){if(!n.id||!/^[a-z0-9_.-]+$/iu.test(String(n.id)))throw new Error("TEMPLATE_ID_INVALIDO");if(n.target&&/(^|[\\/])\.\.(?:[\\/]|$)/u.test(String(n.target)))throw new Error("TEMPLATE_TARGET_INVALIDO");return!0}function y(n,t,e){return{changed:c(n)!==c(t),content:Buffer.from(t,"utf8"),rollback:{...e,nextSha256:c(t),previousSha256:c(n)}}}function S(n,t){try{return JSON.parse(String(n||"{}"))}catch{throw new Error(`TEMPLATE_JSON_INVALIDO:${t}`)}}function w(n){return String(n).toLocaleLowerCase("en-US").endsWith(".json")?"json":"text"}function $(n){return n===void 0?void 0:JSON.parse(JSON.stringify(n))}function s(n){return!!(n&&typeof n=="object"&&!Array.isArray(n))}function h(n){return String(n).replace(/[.*+?^${}()|[\]\\]/gu,"\\$&")}function c(n){return T.createHash("sha256").update(String(n).replace(/\r\n/gu,`
`),"utf8").digest("hex")}module.exports={applyTemplate:O,applyTextTemplate:m,deepMergePreserveLocal:f,mergeJsonTemplate:d,validateTemplateDescriptor:g};
