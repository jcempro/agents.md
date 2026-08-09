# Subcontexto 03 — Código, integração e release

Ordem: 3/3. Fase: FT-068. Dependências: FT-066 e FT-067 concluídas. Objetivo: materializar o gate proporcional, provar não regressão, limpar TODO e publicar `0.1.1`.

Entradas: contexto-mestre, handoffs normativos, runtime TypeScript canônico, testes, pipeline e cenário Release.

Entregável: validação determinística com diagnósticos; testes positivos/negativos; TODO somente com equalizer intacto; rastreabilidade sincronizada; release latest e branches convergidas.

Restrições: não exigir documentação impossível em derivados/gerados; não fazer varredura destrutiva; não editar equalizer; não publicar com gate degradado; não repetir release/tag existente sem inspeção idempotente.

Validação: typecheck, lint, testes, build, verify, RCF, grafo, diff/semântica, release remota e convergência. Estado: pendente.
