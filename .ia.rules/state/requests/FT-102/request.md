# Solicitação corretiva — FT-102

Origem: segunda tentativa de retomada da release `0.1.4-rc4`, que revelou normalização `trim()` da primeira linha de `git status --porcelain` não coberta pela FT-101.
Estado: implementação corretiva autorizada pela solicitação vigente e em andamento.

## Solução e aceite

Reconhecer tanto a linha Porcelain integral quanto a primeira linha sem seu espaço inicial, ainda limitadas a `dist/` e `index.json`; manter bloqueio para qualquer fonte/estado. O teste deve reproduzir a forma real `M dist/...`.
