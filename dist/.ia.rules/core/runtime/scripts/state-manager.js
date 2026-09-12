// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/core/runtime/scripts/state-manager.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

const a=require("path"),o=require("./todo-intake");function c(s=process.argv.slice(2),e=process.cwd()){const[r,t]=s;if(r==="migrate")return o.migrateCanonicalState(e);if(r==="inspect")return o.inspectTodoIa(e);if(r==="sync")return o.syncCanonicalProjections(e);if(r==="record"){if(!t)throw new Error("STATE_RECORD_JSON_AUSENTE");return o.recordMemoryResult(e,JSON.parse(t))}if(r==="transition"){if(!t)throw new Error("STATE_TRANSITION_JSON_AUSENTE");const n=JSON.parse(t);return o.transitionTodoRoot(e,n.text,n.status,n)}if(r==="conclude"){if(!t)throw new Error("STATE_CONCLUDE_JSON_AUSENTE");const n=JSON.parse(t);return o.concludeFeatureState(e,n.ids,n)}throw new Error("Uso: state-manager <migrate|inspect|sync|record JSON|transition JSON|conclude JSON>")}if(require.main===module)try{console.log(JSON.stringify(c(),null,2))}catch(s){console.error(s.message),process.exitCode=1}module.exports={main:c,rootPath:(...s)=>a.resolve(process.cwd(),...s)};
