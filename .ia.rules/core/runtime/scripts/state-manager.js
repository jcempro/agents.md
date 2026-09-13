// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/core/runtime/scripts/state-manager.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

const i=require("path"),o=require("./todo-intake");function c(s=process.argv.slice(2),t=process.cwd()){const[n,r]=s;if(n==="migrate")return o.migrateCanonicalState(t);if(n==="inspect")return o.inspectTodoIa(t);if(n==="sync")return o.syncCanonicalProjections(t);if(n==="record"){if(!r)throw new Error("STATE_RECORD_JSON_AUSENTE");return o.recordMemoryResult(t,JSON.parse(r))}if(n==="transition"){if(!r)throw new Error("STATE_TRANSITION_JSON_AUSENTE");const e=JSON.parse(r);return o.transitionTodoRoot(t,e.text,e.status,e)}if(n==="conclude"){if(!r)throw new Error("STATE_CONCLUDE_JSON_AUSENTE");const e=JSON.parse(r);return o.concludeFeatureState(t,e.ids,e)}if(n==="reconcile"){if(!r)throw new Error("STATE_RECONCILE_JSON_AUSENTE");const e=JSON.parse(r);return o.reconcileFeatureState(t,e,e)}throw new Error("Uso: state-manager <migrate|inspect|sync|record JSON|transition JSON|conclude JSON|reconcile JSON>")}if(require.main===module)try{console.log(JSON.stringify(c(),null,2))}catch(s){console.error(s.message),process.exitCode=1}module.exports={main:c,rootPath:(...s)=>i.resolve(process.cwd(),...s)};
