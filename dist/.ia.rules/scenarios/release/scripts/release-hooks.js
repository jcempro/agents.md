// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/scenarios/release/scripts/release-hooks.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

const h=require("fs"),t=require("path"),{runHookChain:O}=require("../../../core/runtime/scripts/extension-contract"),c=t.resolve(__dirname,"..","..","..",".."),u=t.join(c,".ia.rules","hooks","release.js"),a=t.join(c,".ia.rules","hooks","core.js"),l=new Set(["prepare","verify","published"]);class f extends Error{}function p(e,s={}){if(!l.has(e))throw new f(`EVENTO_HOOK_INVALIDO:${e||"(vazio)"}`);const o=[i("core",a,e),i("release",u,e)].filter(Boolean);if(!o.length)return{event:e,executed:!1};const r=O(e,s,o);return{event:e,executed:!0,result:r.observations}}function i(e,s,o){if(!h.existsSync(s))return null;const r=require(s),n=typeof r=="function"?r:r&&r[o];return typeof n=="function"?{id:e,handler:n}:null}if(require.main===module){const[e,s="",o=""]=process.argv.slice(2);try{if(e==="--help"){process.stdout.write(`Uso: release-hooks <prepare|verify|published> [versao] [asset]
`);return}const r=p(e,{asset:o,version:s});process.stdout.write(`${JSON.stringify(r)}
`)}catch(r){process.stderr.write(`${r.message}
`),process.exitCode=r instanceof f?2:1}}module.exports={CORE_HOOK_PATH:a,EVENTS:l,HOOK_PATH:u,runReleaseHook:p};
