// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/core/runtime/scripts/shared-lifecycle.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

const O=require("fs"),t=require("path"),{loadConfiguration:g}=require("./configuration"),r=t.resolve(__dirname,"..","..","..","..");async function u(s=process.argv.slice(2)){const[e,...p]=s;if(!e||e==="--help")return process.stdout.write(`Uso: shared-lifecycle <publish|dev-live> [-- argumentos do hook]
`),0;if(!new Set(["publish","dev-live"]).has(e))throw new Error(`OPERACAO_INVALIDA:${e}`);const n=g(r),l=t.resolve(r,n.lifecycle.hooksRoot),h=Object.freeze({args:Object.freeze([...p]),configuration:n,operation:e,rootDir:r}),i=[];for(const o of["pre","main","post"]){const d=o==="main"?"":`.${o}`,c=t.join(l,`${e}${d}.js`);if(!O.existsSync(c))continue;const a=require(c),f=typeof a=="function"?a:a.execute;if(typeof f!="function")throw new Error(`HOOK_INVALIDO:${t.relative(r,c)}`);i.push({phase:o,result:await f(h)})}return i.some(o=>o.phase==="main")?(console.log(JSON.stringify({code:`${e.toUpperCase().replace("-","_")}_OK`,hooks:i.map(o=>o.phase)})),0):(console.log(JSON.stringify({code:`${e.toUpperCase().replace("-","_")}_NAO_APLICAVEL`,configuration:e==="dev-live"?n.devLive:void 0})),0)}require.main===module&&u().then(s=>{process.exitCode=s}).catch(s=>{console.error(s.message),process.exitCode=1});module.exports={main:u};
