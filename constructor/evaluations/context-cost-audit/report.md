# Auditoria experimental de custo contextual

Revisão: `c60fcc7`. Tokenizer: `tiktoken 0.13.0` / `o200k_base` / `gpt-4o`.
Entrada: `a45c5ba258bc667f402447590f8fabe0d795d5333b16c5ee475eee4cd6c7830b`. Serialização: UTF-8; CRLF normalizado para LF; arquivo integral.

## Alternativas

- `validated-session-cache`: reusar somente unidades com hash validado durante a mesma sessão (cache: session; risco: 0.30).
- `scenario-deduplication`: eliminar releitura da mesma unidade dentro de um único cenário (cache: scenario; risco: 0.10).
- `handoff-replaces-state`: controle adverso que tenta substituir o estado pelo handoff derivado (cache: none; risco: 0.90).

## Resultados

| Variante | Equivalente | Economia ponderada | Economia | Interação | Risco | Regressões |
|---|---:|---:|---:|---:|---:|---|
| validated-session-cache | sim | 47530.00 | 55.80% | 0.00 | 0.30 | nenhuma |
| scenario-deduplication | sim | 0.00 | 0.00% | 0.00 | 0.10 | nenhuma |
| handoff-replaces-state | não | 40780.00 | 47.88% | 0.00 | 0.90 | nenhuma |
| validated-session-cache+scenario-deduplication | sim | 47530.00 | 55.80% | 0.00 | 0.40 | nenhuma |
| validated-session-cache+handoff-replaces-state | não | 55686.00 | 65.38% | -32624.00 | 1.20 | nenhuma |
| scenario-deduplication+handoff-replaces-state | não | 40780.00 | 47.88% | 0.00 | 1.00 | nenhuma |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | não | 55686.00 | 65.38% | -32624.00 | 1.30 | nenhuma |

## Deltas por cenário

| Variante | Cenário | Baseline | Variante | Delta | Átomos | Relações |
|---|---|---:|---:|---:|---:|---:|
| validated-session-cache | cold-audit | 14161 | 14161 | 0 | 100.00% | 100.00% |
| validated-session-cache | continued-audit | 13600 | 0 | -13600 | 100.00% | 100.00% |
| validated-session-cache | todo-operation | 19517 | 8071 | -11446 | 100.00% | 100.00% |
| validated-session-cache | recovery | 17026 | 8303 | -8723 | 100.00% | 100.00% |
| validated-session-cache | resume | 11491 | 45 | -11446 | 100.00% | 100.00% |
| validated-session-cache | historical-query | 9378 | 7063 | -2315 | 100.00% | 100.00% |
| scenario-deduplication | cold-audit | 14161 | 14161 | 0 | 100.00% | 100.00% |
| scenario-deduplication | continued-audit | 13600 | 13600 | 0 | 100.00% | 100.00% |
| scenario-deduplication | todo-operation | 19517 | 19517 | 0 | 100.00% | 100.00% |
| scenario-deduplication | recovery | 17026 | 17026 | 0 | 100.00% | 100.00% |
| scenario-deduplication | resume | 11491 | 11491 | 0 | 100.00% | 100.00% |
| scenario-deduplication | historical-query | 9378 | 9378 | 0 | 100.00% | 100.00% |
| handoff-replaces-state | cold-audit | 14161 | 6005 | -8156 | 45.29% | 90.00% |
| handoff-replaces-state | continued-audit | 13600 | 5444 | -8156 | 43.23% | 88.89% |
| handoff-replaces-state | todo-operation | 19517 | 11361 | -8156 | 65.53% | 87.50% |
| handoff-replaces-state | recovery | 17026 | 8870 | -8156 | 44.28% | 80.00% |
| handoff-replaces-state | resume | 11491 | 3335 | -8156 | 34.63% | 85.71% |
| handoff-replaces-state | historical-query | 9378 | 9378 | 0 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | cold-audit | 14161 | 14161 | 0 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | continued-audit | 13600 | 0 | -13600 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | todo-operation | 19517 | 8071 | -11446 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | recovery | 17026 | 8303 | -8723 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | resume | 11491 | 45 | -11446 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | historical-query | 9378 | 7063 | -2315 | 100.00% | 100.00% |
| validated-session-cache+handoff-replaces-state | cold-audit | 14161 | 6005 | -8156 | 45.29% | 90.00% |
| validated-session-cache+handoff-replaces-state | continued-audit | 13600 | 0 | -13600 | 43.23% | 88.89% |
| validated-session-cache+handoff-replaces-state | todo-operation | 19517 | 8071 | -11446 | 65.53% | 87.50% |
| validated-session-cache+handoff-replaces-state | recovery | 17026 | 8303 | -8723 | 44.28% | 80.00% |
| validated-session-cache+handoff-replaces-state | resume | 11491 | 45 | -11446 | 34.63% | 85.71% |
| validated-session-cache+handoff-replaces-state | historical-query | 9378 | 7063 | -2315 | 100.00% | 100.00% |
| scenario-deduplication+handoff-replaces-state | cold-audit | 14161 | 6005 | -8156 | 45.29% | 90.00% |
| scenario-deduplication+handoff-replaces-state | continued-audit | 13600 | 5444 | -8156 | 43.23% | 88.89% |
| scenario-deduplication+handoff-replaces-state | todo-operation | 19517 | 11361 | -8156 | 65.53% | 87.50% |
| scenario-deduplication+handoff-replaces-state | recovery | 17026 | 8870 | -8156 | 44.28% | 80.00% |
| scenario-deduplication+handoff-replaces-state | resume | 11491 | 3335 | -8156 | 34.63% | 85.71% |
| scenario-deduplication+handoff-replaces-state | historical-query | 9378 | 9378 | 0 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | cold-audit | 14161 | 6005 | -8156 | 45.29% | 90.00% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | continued-audit | 13600 | 0 | -13600 | 43.23% | 88.89% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | todo-operation | 19517 | 8071 | -11446 | 65.53% | 87.50% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | recovery | 17026 | 8303 | -8723 | 44.28% | 80.00% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | resume | 11491 | 45 | -11446 | 34.63% | 85.71% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | historical-query | 9378 | 7063 | -2315 | 100.00% | 100.00% |

Pareto: validated-session-cache, scenario-deduplication.
Ranking: validated-session-cache, validated-session-cache+scenario-deduplication, scenario-deduplication.

## Recomendação

Melhor combinação mensurada: `validated-session-cache`. A recomendação não foi aplicada e exige FT posterior.

## Fontes

- 2026-09-15: https://openai.com/index/gpt-5-6-frontier-intelligence-efficiency/ — eficiência e custo de agentes.
- 2026-09-15: https://openai.com/index/equip-responses-api-computer-environment/ — contexto e ambiente de execução.
- 2026-09-15: https://www.anthropic.com/engineering/managed-agents — estado e retomada de agentes.
- 2026-09-15: https://arxiv.org/abs/2607.01916 — avaliação de contexto de agentes.
- 2026-09-15: https://arxiv.org/abs/2609.04915 — otimização contextual recente.

O JSON correspondente preserva deltas por cenário, cobertura de átomos/relações, riscos e metadados reproduzíveis.
