# Solicitação preservada — FT-076 a FT-083

Origem material: `TODO.ia.md` no commit `30b07f9602a371c1d6af8a45140cfc04c51c1476`.
Origem operacional: prompt humano recebido em 2026-09-12 (America/Sao_Paulo).
FTs: FT-076, FT-077, FT-078, FT-079, FT-080, FT-081, FT-082 e FT-083.
RCFs de destino: `RCF.md` §§ 0.0.9, 3.4–3.8, 4, 13.4–13.6, 14–16, 20 e 21.
Estado de incorporação: preservada; pendente de auditoria bidirecional e implementação funcional.

## Prompt humano integral

```text
implementar TODO.ia.md: equalizar.
```

## Fonte versionada

- Arquivo: `TODO.ia.md`.
- Commit: `30b07f9602a371c1d6af8a45140cfc04c51c1476`.
- SHA-256 operacional: `81b9eeaf4b14c197338e1a98c4f4b28b248855802e463a22cb2ba906264f9e74`.
- Tamanho observado: 31.074 bytes e 233 linhas.
- Item raiz: `Evoluir a governança distribuível de agents.md com Skills, Subagents, memória, automação e precisão visual`.

## Decisões de equalização

- A única frente raiz é decomposta por fase e responsabilidade real, mantendo um objetivo global e o item Equalizar perene intacto.
- A menção isolada a “MCU” é tratada como imprecisão redacional de “MCP”: a própria matriz, o título do item e a referência normativa MCP 2025-11-25 tornam a intenção inequívoca.
- O limite novo de 400 tokens especializa e endurece o limite vigente de 500; não há conflito sem solução nem reanálise de decisão recusada.
- `DEC-20260725-001` impede sintaxe lógica/parser rejeitados; nenhuma FT os recria. `DEC-20260725-002` mantém recuperação local determinística e impede embeddings, banco vetorial ou reranking sem nova evidência.
- O repositório já possui índice/grafo de uma camada, rastreabilidade, runtime TypeScript, hooks, manifesto positivo, processamento inicial de TODO e contrato parcial de processos longos; as novas FTs evoluem esses mecanismos, sem fluxo paralelo.
- Não existem `agents.local.md`, `.ia.rules/state/TODO.ia.md`, `memory.md`, `fix.md` ou `FT.implementados.md`; a migração e criação pertencem à implementação posterior, não a esta fase RCF.
- Não existem Skills ou Subagents distribuíveis nem adaptadores por cliente; suporte só será declarado após schema, loader, fixture e descoberta reais.
- A cobertura visual atual é específica de Web; imagem e PDF generalistas exigem capacidade própria, evidência regional e render posterior.
- As referências externas foram reconsultadas em 2026-09-12; as versões acadêmicas atuais e a documentação oficial serão registradas na FT normativa.
