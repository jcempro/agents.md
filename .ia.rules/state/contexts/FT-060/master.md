# Contexto-mestre — FT-060/FT-062

- Fonte: `.ia.rules/state/requests/FT-060/request.md`
- Identidade: `github:jcempro/agents.md#2`
- Ordem: RCF (FT-060) → código/distribuição (FT-062) → integração global (FT-059)
- Objetivo: eliminar dependência de configuração residual em consumidor limpo e restaurar o gate explícito de autorização upstream.
- Entradas: issue integral; RCF; configuração central; manifesto positivo; build/update; runtime `upstream-share`; testes; release.
- Restrições: metadados não podem ser inferidos; edição local continua detectável; autorização não pode ser enfraquecida; fonte TypeScript permanece canônica; nenhum registro decisório local integra o payload.
- Entregáveis: RCF causal; `repository.json` distribuído e autenticado; função de autorização; testes de consumidor limpo/duplicata; derivados e release.
- Validação: origem→RCF→fonte→artefato→ZIP→instalação; cabeçalhos; transação; publicação autorizada ou duplicata; regressão global.
- Estado: conciliação.
- Aceite global: todos os critérios da issue comprovados e issue encerrada somente após release.
