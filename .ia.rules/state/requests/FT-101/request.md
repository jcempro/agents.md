# Solicitação corretiva — FT-101

Origem: retomada da release `0.1.4-rc4` após a correção FT-100, sob a mesma autorização humana explícita de resolver a falha de release sem regressão.
Estado: implementação autorizada e em andamento.

## Problema comprovado

Quando a preparação já alterou somente `dist/` e `index.json`, mas `agent:verify` falha antes do commit do artefato, a retomada reconhece a versão preparada e ainda assim rejeita esses derivados como `WORKTREE_NAO_LIMPO`. A etapa imediatamente seguinte já reconstrói, verifica e commita exatamente esses paths.

## Solução e aceite

A retomada deve aceitar como resíduo apenas linhas Git de `dist/` ou `index.json`, continuar bloqueando qualquer outro path, reconstruir deterministicamente o artefato e prosseguir pelo fluxo oficial. Testes devem cobrir derivado permitido e fonte/estado proibidos.
