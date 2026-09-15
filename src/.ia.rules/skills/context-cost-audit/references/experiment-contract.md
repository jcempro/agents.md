# Contrato do experimento

O JSON de entrada usa `schema: agents-context-cost-experiment/v1` e declara:

- `metadata`: revisão, tokenizer, versão, encoding, modelo e serialização;
- `units`: conteúdo ou contagem exata, átomos materiais e relações de cada unidade carregável;
- `scenarios`: sequência de unidades efetivamente lidas e peso positivo;
- `candidates`: plano reversível com cache e/ou snapshots substitutivos;
- `risks`: risco conhecido por candidato.

Snapshot declara `replaces`, `tokens`, `atoms` e `relations`. Seus átomos e relações devem ser exatamente a união do que substitui. Cache reduz apenas releitura dentro do escopo declarado; não reduz cold context. Combinações são avaliadas na ordem dos candidatos e um conflito de snapshots invalida a combinação.

O relatório JSON é a evidência canônica. O Markdown é projeção humana e deve incluir baseline, deltas por cenário, combinações, equivalência, regressões, Pareto, ranking, riscos e recomendação sem efeito automático.
