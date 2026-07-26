# Contexto-mestre — FT-061/FT-063

- Fonte: `.ia.rules/state/requests/FT-061/request.md`
- Identidade: `github:jcempro/agents.md#10`
- Ordem: RCF/Norma (FT-061) → pipeline/testes (FT-063) → integração global (FT-059)
- Objetivo: reduzir permanentemente o custo injetado por `AGENTS.md` sem perder nenhuma norma, precedência, nuance, exemplo, autoridade ou rota.
- Entradas: issue integral; AGENTS atual; módulos; índice/grafo; tiktoken oficial; manifesto positivo; update/build/release; clientes que reconhecem AGENTS.
- Restrições: máximo 500 tokens; entrypoint apenas; corpo preservado integralmente em auxiliar; leitura auxiliar condicional; nenhum resumo com perda; papéis Final/Construtor e RCF intactos.
- Decisão arquitetural: preservar o corpo anterior byte a byte em `.ia.rules/agents.inc.md` como fallback normativo integral e manter módulos especializados como rotas menores; o entrypoint seleciona índice/módulos e exige fallback integral apenas por ausência, perda, conflito, auditoria ou rota insuficiente.
- Entregáveis: RCF; entrypoint; auxiliar; índice/grafo; manifesto; guardas; testes; derivados e release.
- Validação: contagem `tiktoken/o200k_base`; equivalência de hash do corpo migrado; resolução das rotas/referências; build/update/release; redução percentual; suíte global.
- Estado: conciliação.
- Aceite global: critérios da issue comprovados e issue encerrada somente após release.
