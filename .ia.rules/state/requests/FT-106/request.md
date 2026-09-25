# Solicitação remota preservada — FT-106

Origem: issue `github:jcempro/agents.md#13`, aberta em 2026-09-24T14:22:08Z.
URL: https://github.com/jcempro/agents.md/issues/13
Título: `Distribuição gerenciada inconsistente bloqueia validação global de consumidores`.

## Original

Consumidor em `release:v0.1.14-rc5` reproduziu: manifesto exige `scripts/.agents/autoupdate.ts`/`.js` ausentes (`GOVERNANCA_INSTALADA_INCOMPLETA`); `update:agents` não converge, `doctor` retorna OK e `repair` falha `MANIFESTO_FONTE_AUSENTE`; publicadores não preservam `ASSETS_RELEASE_INCOMPLETOS`; transição de TODO remove o cabeçalho perene da projeção raiz. Esperado: destinos entregues ou retirados pela fonte, update/doctor/repair convergentes, gate de assets preservado e transição mantendo governança. Evidências externas declaradas: commit `916a5103219e7642295bb38d27b021aa54035c86`, rastreabilidade `b895701`, testes focados 29/29. Marcador de recomendação: `agents-inbox:b21f475fbe6c3131`.

## Aplicabilidade

Aplicável. A inspeção local confirmou manifesto de bootstrap, pacote npm sem `scripts/`, repair dependente de manifesto-fonte do construtor, ausência literal do gate de assets e risco na regravação integral do TODO.
