// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/core/runtime/scripts/configuration.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

const a=require("fs"),s=require("path");function y(o){const r=s.join(o,".ia.rules","config"),e=a.existsSync(r)?r:s.join(o,"config"),n=i(s.join(e,"schema.json"),!0),t=i(s.join(e,"core.json"),!0),j=i(s.join(e,"repository.json"),!1),N=i(s.join(e,"agents.local.json"),!1),p=process.env.AGENTS_CONFIG_JSON?u(process.env.AGENTS_CONFIG_JSON,"AGENTS_CONFIG_JSON"):{},f=c(c(c(t,j),N),p);if(n.id!=="agents-config/v1"||n.version!==1||f.schema!==n.version)throw new Error("CONFIG_SCHEMA_NAO_SUPORTADO");for(const O of n.required||[])if(!(O in f))throw new Error(`PARAMETRO_NORMATIVO_AUSENTE:${O}`);return A(f)}function i(o,r){if(!a.existsSync(o)){if(r)throw new Error(`CONFIGURACAO_AUSENTE:${s.basename(o)}`);return{}}return u(a.readFileSync(o,"utf8"),o)}function u(o,r){try{const e=JSON.parse(o);if(!e||Array.isArray(e)||typeof e!="object")throw new Error("objeto esperado");return e}catch(e){throw new Error(`CONFIGURACAO_INVALIDA:${r}:${e.message}`)}}function c(o,r){const e={...o};for(const[n,t]of Object.entries(r||{}))e[n]=t&&typeof t=="object"&&!Array.isArray(t)?c(o&&typeof o[n]=="object"?o[n]:{},t):t;return e}function A(o){for(const r of Object.values(o))r&&typeof r=="object"&&!Object.isFrozen(r)&&A(r);return Object.freeze(o)}module.exports={deepMerge:c,loadConfiguration:y,parseConfig:u};
