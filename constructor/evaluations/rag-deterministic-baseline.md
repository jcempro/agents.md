# Baseline — recuperação normativa determinística

## Escopo

Medição reproduzível do índice/grafo local adotado pela FT-051 e implementado pela FT-052. Tokenização exata: `tiktoken 0.13.0`, encoding `o200k_base`, alvo declarado `gpt-4o`, serialização UTF-8 com CRLF normalizado para LF. O corpus contém os 35 nós canônicos do produto; estudo, avaliação e material interno do construtor permanecem fora dele.

## Resultado

| Medida | Valor |
|---|---:|
| Corpus integral sem roteamento | 35.190 tokens |
| Rotas terminais válidas | 34 |
| Menor rota | 7.364 tokens |
| Média de todas as rotas | 8.352,91 tokens |
| Maior rota | 10.384 tokens |
| Redução média frente à leitura integral | 76,26% |

O grafo conserva fallback integral, IDs, precedência, papéis, cenários, condições e origem por hash. A economia decorre de seleção determinística; nenhum texto normativo foi resumido, enviado externamente ou substituído por similaridade.

## Decisão técnica

A implementação confirma ganho líquido da parcela aceita: índice local, grafo, busca por ID/gatilho, custo por caminho, cache invalidado por digest e fallback integral. A recusa parcial `DEC-20260725-002` permanece vigente: embeddings, banco vetorial, expansão semântica, reranking por modelo e serviço externo não foram implementados nem reanalisados, pois nenhuma nova proposta comparável demonstrou precisão/cobertura superiores com menor custo, risco e manutenção.

## Reprodução

`npm run agent:map` regenera e valida `src/.ia.rules/normative-index.json`, `src/.ia.rules/generated/normative-map.md` e somente a região demarcada do `README.md`. `npm run agent:verify` falha se o grafo, tokenizer, fonte ou derivado divergir.
