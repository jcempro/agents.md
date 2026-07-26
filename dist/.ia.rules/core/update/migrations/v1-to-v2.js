// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.
// Gerado de: src/.ia.rules/core/update/migrations/v1-to-v2.ts; TypeScript 7.0.2 + esbuild 0.28.1; Node 24+.

const r="agents-governance-manifest";const a="governance-manifest/v2";function t(e){if(!e||typeof e!="object"||Array.isArray(e))throw new Error("Lock legado invalido.");const n=Array.isArray(e.managedFiles)?e.managedFiles:Object.keys(e.files||{}).map(s=>({path:s}));return{...e,format:r,marker:a,managedFiles:n,schema:2}}function i(e){return!!(e&&e.format===r&&e.schema===2&&e.marker===a&&Array.isArray(e.managedFiles))}module.exports={FORMAT:r,MARKER:a,VERSION:2,convertLegacyLock:t,isCurrentLock:i};
