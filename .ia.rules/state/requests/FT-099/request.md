# Solicitação derivada — FT-099

Origem: recomendação `validated-session-cache` de `constructor/evaluations/context-cost-audit/report.json`, entrada SHA-256 `d1b8180f28aab971d7225140b744f21f095e156321cae7dee5d84d329467f7a4` registrada em 2026-09-15.
Estado: proposta pendente; nenhuma implementação, migração ou aplicação foi autorizada pelo relatório.

## Solução recomendada

Reutilizar dentro da mesma sessão apenas unidade contextual já lida cuja identidade, conteúdo normalizado, SHA-256, versão, autoridade, rota e dependências continuem válidos. Cold context permanece integral. Mudança de hash, versão, precedência, papel, rota, estado, memória ou dependência invalida o item antes da decisão seguinte.

## Alternativas ordenadas

1. `validated-session-cache`: economia ponderada de 46.498 tokens (55,43%), equivalência integral nos seis cenários, risco experimental 0,30 e nenhuma regressão local medida.
2. `validated-session-cache+scenario-deduplication`: mesmo ganho, complexidade/risco maior (0,40), portanto dominada.
3. `scenario-deduplication`: equivalência integral, mas ganho zero no corpus observado.
4. `handoff-replaces-state`: rejeitada; a economia aparente perde átomos e relações do estado e não pode ser implementada.

## Critérios e dependências

- depende de FT-098 concluída e de autorização humana posterior específica;
- preserva DEC-20260725-002 e não introduz embeddings, vetor, similaridade semântica nem reranking;
- cache é otimização de leitura, não nova autoridade, fonte ou persistência canônica;
- identidade e invalidação são determinísticas, locais, observáveis e fail-closed.

## Implementação e migração

- estender o mecanismo oficial de roteamento/contexto, sem wrapper ou fluxo paralelo;
- chavear por unidade, hash, versão, papel, autoridade, rota e dependências;
- não migrar conteúdo canônico; cache vazio é o estado inicial e ausência degrada para releitura integral;
- registrar hit, miss, invalidação, tokens evitados e razão, sem armazenar segredo ou payload externo.

## Testes, rollback e equivalência

- cobrir cold context, hit, alteração de hash, versão, papel, precedência, estado, memória, recovery, resume, nova sessão e corrupção;
- reexecutar o experimento FT-097 com os mesmos seis cenários, 682 átomos e 16 relações;
- exigir 100% de cobertura material e nenhuma regressão local injustificada;
- rollback desabilita/removerá somente o cache e restaura leitura integral, sem conversão de estado.

## Aceite

O ganho deve reproduzir-se com tokenizer e serialização declarados, respeitar invalidação antes da decisão, preservar cold context e provar que ausência, erro ou corrupção do cache não altera conteúdo, autoridade nem comportamento. Publicação/release permanecem fora sem autorização própria.
