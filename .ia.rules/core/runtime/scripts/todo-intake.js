// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/core/runtime/scripts/todo-intake.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

const y=require("crypto"),v=require("child_process"),s=require("fs"),S=require("os"),c=require("path"),p=c.join(".ia.rules","state","TODO.ia.md");function g(n,e={}){const t=x(n,e).map(o=>{const a=c.join(n,o),r=s.readFileSync(a,"utf8");return{hash:l(r),items:A(r),path:O(o)}});return{code:t.length?"TODO_IA_FOUND":"TODO_IA_EMPTY",records:t,status:t.some(o=>o.path!==O(p))?"triagem_requerida":"ok"}}function C(n,e={}){const i=g(n,e),t=i.records.filter(o=>o.path!==O(p)||o.items.some(a=>a.status==="pendente"));if(t.length)throw new Error(`TODO_IA_TRIAGEM_PENDENTE:${t.map(o=>o.path).join(",")}`);return i}function x(n,e={}){const i=[e.path||p,"TODO.ia.md"].map(t=>c.normalize(String(t)));return[...new Set(i)].filter(t=>!c.isAbsolute(t)&&s.existsSync(c.join(n,t))).sort((t,o)=>O(t).localeCompare(O(o),"en"))}function A(n){return String(n).split(/\r?\n/u).map((e,i)=>({line:e,number:i+1})).filter(e=>/^\s*[-*]\s+(?:\[[ xX-]\]\s+)?\S/u.test(e.line)).map(e=>({line:e.number,status:/\[[xX]\]/u.test(e.line)?"concluido":"pendente",text:e.line.replace(/^\s*[-*]\s+(?:\[[ xX-]\]\s+)?/u,"").trim()}))}const j="# TO-DOs",w="- [ ] Equalizar e executar as TO-DOs como frentes convergentes de um único objetivo",F=new Set(["⬜","📌","📜","⚖️","⏳","🔄","🔎","✅"]);function _(n){const e=String(n||"").replace(/\r\n/gu,`
`),i=e.indexOf(`
${j}
`);if(!e.startsWith(`# RCF — Governança da TO-DO
`)||i<0)throw new Error("TODO_GOVERNANCA_INVALIDA");const t=e.slice(0,i+1),o=e.slice(i+1);if(!t.includes(w))throw new Error("TODO_EQUALIZER_AUSENTE");const a=[];for(const[r,u]of o.split(`
`).entries()){if(/^\s+[-*]\s+(?:\[[ xX]\]|[⬜📌📜⚖️⏳🔄🔎✅])/u.test(u))continue;const d=u.match(/^- \[([ xX])\] (\S.*)$/u),m=u.match(/^([⬜📌📜⚖️⏳🔄🔎✅]) (\S.*)$/u);if(!d&&!m)continue;const h=d?d[1].toLocaleLowerCase()==="x"?"✅":"⬜":m[1];a.push({line:r+t.split(`
`).length,marker:d?"checkbox":"emoji",status:h,text:(d?d[2]:m[2]).trim()})}if(a.some(r=>r.text.startsWith("Equalizar e executar")&&(r.marker!=="checkbox"||r.status!=="⬜")))throw new Error("TODO_EQUALIZER_NAO_PERENE");return{governanceHash:l(t),operationalHash:l(o),roots:a}}function R(n){const e=c.join(n,"TODO.ia.md");if(!s.existsSync(e))throw new Error("TODO_RAIZ_AUSENTE");const i=s.readFileSync(e,"utf8"),t=_(i),o=c.join(n,".ia.rules","state");s.mkdirSync(o,{recursive:!0});const a=c.join(n,".ia.rules","continue.ia"),r=c.join(o,"continue.ia");if(!s.existsSync(a)&&!s.existsSync(r))throw new Error("CONTINUE_IA_AUSENTE");const u=s.readFileSync(s.existsSync(r)?r:a,"utf8");if(s.existsSync(r)&&s.existsSync(a)&&l(s.readFileSync(a,"utf8"))!==l(u))throw new Error("CONTINUE_MIGRACAO_CONFLITO");f(r,u);const d=c.join(n,p);if(s.existsSync(d)&&l(s.readFileSync(d,"utf8"))!==l(i))throw new Error("TODO_MIGRACAO_CONFLITO");f(d,i);const m={"memory.md":`# Memória operacional

Índice durável; evidência não constitui autoridade.
`,"fix.md":`# Correções

Índice de riscos e reclamações do desenvolvedor.
`,"FT.implementados.md":`# FTs implementadas

Índice mínimo para pedidos e evidências canônicas.
`};for(const[N,D]of Object.entries(m)){const T=c.join(o,N);s.existsSync(T)||f(T,D)}const h={schema:"agents-state-migration/v1",generatedAt:new Date().toISOString(),entries:[{source:"TODO.ia.md",destination:".ia.rules/state/TODO.ia.md",sha256:l(i)},{source:".ia.rules/continue.ia",destination:".ia.rules/state/continue.ia",sha256:l(u)}]};f(c.join(o,"migration-baseline.json"),`${JSON.stringify(h,null,2)}
`);const E={schema:"agents-state-index/v1",active:"continue.ia",todo:"TODO.ia.md",durable:"memory.md",corrections:"fix.md",completed:"FT.implementados.md",governanceHash:t.governanceHash};return f(c.join(o,"index.json"),`${JSON.stringify(E,null,2)}
`),{code:"STATE_MIGRATED",baseline:h,index:E}}function I(){let n="",e="kernel-fallback";try{process.platform==="win32"?(n=v.execFileSync("reg",["query","HKLM\\SOFTWARE\\Microsoft\\Cryptography","/v","MachineGuid"],{encoding:"utf8",windowsHide:!0}).split(/\r?\n/u).find(t=>t.includes("MachineGuid"))?.trim().split(/\s{2,}/u).pop()||"",e="windows-machine-guid-hash"):s.existsSync("/etc/machine-id")&&(n=s.readFileSync("/etc/machine-id","utf8").trim(),e="linux-machine-id-hash")}catch{n=""}const i={platform:S.platform(),release:S.release(),arch:S.arch(),node:process.version};return n||(n=JSON.stringify(i)),{id:l(`agents-env-v1\0${n}`).slice(0,24),source:e,stable:e!=="kernel-fallback",kernel:i}}function M(n,e){const i=["command","projectHash","timestamp","exitCode"];for(const u of i)if(e[u]===void 0||e[u]==="")throw new Error(`MEMORIA_CAMPO_AUSENTE:${u}`);const t=/(token|password|secret|authorization)\s*[:=]/iu,o=JSON.stringify(e);if(t.test(o))throw new Error("MEMORIA_SEGREDO_RECUSADO");const a=c.join(n,".ia.rules","state","memory.md"),r={...e,environment:I()};return s.appendFileSync(a,`
- \`${r.timestamp}\` ${JSON.stringify(r)}
`,"utf8"),r}function f(n,e){s.mkdirSync(c.dirname(n),{recursive:!0});const i=`${n}.tmp-${process.pid}-${y.randomBytes(4).toString("hex")}`,t=s.openSync(i,"wx");try{s.writeFileSync(t,e,"utf8"),s.fsyncSync(t)}finally{s.closeSync(t)}s.renameSync(i,n)}function l(n){return y.createHash("sha256").update(String(n).replace(/\r\n/gu,`
`),"utf8").digest("hex")}function O(n){return String(n).replace(/\\/gu,"/")}module.exports={CANONICAL_TODO:p,EQUALIZER:w,STATUS_EMOJI:F,assertTodoIaTriaged:C,environmentFingerprint:I,inspectTodoIa:g,locateTodoFiles:x,migrateCanonicalState:R,parseGovernedTodo:_,parseTodoItems:A,recordMemoryResult:M};
