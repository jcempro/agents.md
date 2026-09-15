# Solicitação corretiva — FT-100

Origem: falha reproduzida por `npm run release -- 0.1.4-rc4` em 2026-09-15, autorizada expressamente pelo desenvolvedor para correção sem regressão das FTs e TO-DOs existentes.
Estado: implementação autorizada e em andamento; release `0.1.4-rc4` autorizada pela versão explícita informada.

## Problema comprovado

`update:agents` aplicado ao próprio construtor canônico substituiu `agentsGovernance.repositoryProfile: canonical-constructor` por `consumer`. Com isso, `agent:verify` deixou de executar o pipeline-fonte e passou a validar a raiz como instalação consumidora, exigindo `scripts/.agents/autoupdate.ts`, destino que deve existir somente no artefato `dist`.

## Solução delimitada

- preservar `canonical-constructor` exclusivamente quando já declarado no manifesto local;
- continuar atribuindo `consumer` a instalações consumidoras novas ou existentes;
- restaurar a identidade do manifesto raiz sem alterar a identidade consumer do pacote gerado;
- cobrir a fronteira por teste regressivo e validar fonte, artefatos, pacote e release retomável.

## Aceite

`agent:verify` deve selecionar o fluxo do construtor, o teste do atualizador deve provar os dois perfis, `dist/package.json` deve permanecer `consumer`, e a retomada de `0.1.4-rc4` não deve perder nem incorporar alterações alheias.
