// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/core/runtime/scripts/todo-intake.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

const f=require("crypto"),l=require("fs"),o=require("path"),a=o.join(".ia.rules","state","TODO.ia.md");function p(n,e={}){const t=d(n,e).map(s=>{const u=o.join(n,s),c=l.readFileSync(u,"utf8");return{hash:T(c),items:m(c),path:i(s)}});return{code:t.length?"TODO_IA_FOUND":"TODO_IA_EMPTY",records:t,status:t.some(s=>s.path!==i(a))?"triagem_requerida":"ok"}}function O(n,e={}){const r=p(n,e),t=r.records.filter(s=>s.path!==i(a)||s.items.some(u=>u.status==="pendente"));if(t.length)throw new Error(`TODO_IA_TRIAGEM_PENDENTE:${t.map(s=>s.path).join(",")}`);return r}function d(n,e={}){const r=[e.path||a,"TODO.ia.md"].map(t=>o.normalize(String(t)));return[...new Set(r)].filter(t=>!o.isAbsolute(t)&&l.existsSync(o.join(n,t))).sort((t,s)=>i(t).localeCompare(i(s),"en"))}function m(n){return String(n).split(/\r?\n/u).map((e,r)=>({line:e,number:r+1})).filter(e=>/^\s*[-*]\s+(?:\[[ xX-]\]\s+)?\S/u.test(e.line)).map(e=>({line:e.number,status:/\[[xX]\]/u.test(e.line)?"concluido":"pendente",text:e.line.replace(/^\s*[-*]\s+(?:\[[ xX-]\]\s+)?/u,"").trim()}))}function T(n){return f.createHash("sha256").update(String(n).replace(/\r\n/gu,`
`),"utf8").digest("hex")}function i(n){return String(n).replace(/\\/gu,"/")}module.exports={CANONICAL_TODO:a,assertTodoIaTriaged:O,inspectTodoIa:p,locateTodoFiles:d,parseTodoItems:m};
