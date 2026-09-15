# Auditoria experimental de custo contextual

Revisão: `4e98b28`. Tokenizer: `tiktoken 0.13.0` / `o200k_base` / `gpt-4o`.
Entrada: `d1b8180f28aab971d7225140b744f21f095e156321cae7dee5d84d329467f7a4`. Serialização: UTF-8; CRLF normalizado para LF; arquivo integral.

## Alternativas

- `validated-session-cache`: reusar somente unidades com hash validado durante a mesma sessão (cache: session; risco: 0.30).
- `scenario-deduplication`: eliminar releitura da mesma unidade dentro de um único cenário (cache: scenario; risco: 0.10).
- `handoff-replaces-state`: controle adverso que tenta substituir o estado pelo handoff derivado (cache: none; risco: 0.90).

## Resultados

| Variante | Equivalente | Economia ponderada | Economia | Interação | Risco | Regressões |
|---|---:|---:|---:|---:|---:|---|
| validated-session-cache | sim | 46498.00 | 55.43% | 0.00 | 0.30 | nenhuma |
| scenario-deduplication | sim | 0.00 | 0.00% | 0.00 | 0.10 | nenhuma |
| handoff-replaces-state | não | 39490.00 | 47.08% | 0.00 | 0.90 | nenhuma |
| validated-session-cache+scenario-deduplication | sim | 46498.00 | 55.43% | 0.00 | 0.40 | nenhuma |
| validated-session-cache+handoff-replaces-state | não | 54396.00 | 64.85% | -31592.00 | 1.20 | nenhuma |
| scenario-deduplication+handoff-replaces-state | não | 39490.00 | 47.08% | 0.00 | 1.00 | nenhuma |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | não | 54396.00 | 64.85% | -31592.00 | 1.30 | nenhuma |

## Deltas por cenário

| Variante | Cenário | Baseline | Variante | Delta | Átomos | Relações |
|---|---|---:|---:|---:|---:|---:|
| validated-session-cache | cold-audit | 13903 | 13903 | 0 | 100.00% | 100.00% |
| validated-session-cache | continued-audit | 13342 | 0 | -13342 | 100.00% | 100.00% |
| validated-session-cache | todo-operation | 19259 | 8071 | -11188 | 100.00% | 100.00% |
| validated-session-cache | recovery | 16768 | 8303 | -8465 | 100.00% | 100.00% |
| validated-session-cache | resume | 11233 | 45 | -11188 | 100.00% | 100.00% |
| validated-session-cache | historical-query | 9378 | 7063 | -2315 | 100.00% | 100.00% |
| scenario-deduplication | cold-audit | 13903 | 13903 | 0 | 100.00% | 100.00% |
| scenario-deduplication | continued-audit | 13342 | 13342 | 0 | 100.00% | 100.00% |
| scenario-deduplication | todo-operation | 19259 | 19259 | 0 | 100.00% | 100.00% |
| scenario-deduplication | recovery | 16768 | 16768 | 0 | 100.00% | 100.00% |
| scenario-deduplication | resume | 11233 | 11233 | 0 | 100.00% | 100.00% |
| scenario-deduplication | historical-query | 9378 | 9378 | 0 | 100.00% | 100.00% |
| handoff-replaces-state | cold-audit | 13903 | 6005 | -7898 | 46.30% | 90.00% |
| handoff-replaces-state | continued-audit | 13342 | 5444 | -7898 | 44.23% | 88.89% |
| handoff-replaces-state | todo-operation | 19259 | 11361 | -7898 | 66.44% | 87.50% |
| handoff-replaces-state | recovery | 16768 | 8870 | -7898 | 45.28% | 80.00% |
| handoff-replaces-state | resume | 11233 | 3335 | -7898 | 35.56% | 85.71% |
| handoff-replaces-state | historical-query | 9378 | 9378 | 0 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | cold-audit | 13903 | 13903 | 0 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | continued-audit | 13342 | 0 | -13342 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | todo-operation | 19259 | 8071 | -11188 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | recovery | 16768 | 8303 | -8465 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | resume | 11233 | 45 | -11188 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication | historical-query | 9378 | 7063 | -2315 | 100.00% | 100.00% |
| validated-session-cache+handoff-replaces-state | cold-audit | 13903 | 6005 | -7898 | 46.30% | 90.00% |
| validated-session-cache+handoff-replaces-state | continued-audit | 13342 | 0 | -13342 | 44.23% | 88.89% |
| validated-session-cache+handoff-replaces-state | todo-operation | 19259 | 8071 | -11188 | 66.44% | 87.50% |
| validated-session-cache+handoff-replaces-state | recovery | 16768 | 8303 | -8465 | 45.28% | 80.00% |
| validated-session-cache+handoff-replaces-state | resume | 11233 | 45 | -11188 | 35.56% | 85.71% |
| validated-session-cache+handoff-replaces-state | historical-query | 9378 | 7063 | -2315 | 100.00% | 100.00% |
| scenario-deduplication+handoff-replaces-state | cold-audit | 13903 | 6005 | -7898 | 46.30% | 90.00% |
| scenario-deduplication+handoff-replaces-state | continued-audit | 13342 | 5444 | -7898 | 44.23% | 88.89% |
| scenario-deduplication+handoff-replaces-state | todo-operation | 19259 | 11361 | -7898 | 66.44% | 87.50% |
| scenario-deduplication+handoff-replaces-state | recovery | 16768 | 8870 | -7898 | 45.28% | 80.00% |
| scenario-deduplication+handoff-replaces-state | resume | 11233 | 3335 | -7898 | 35.56% | 85.71% |
| scenario-deduplication+handoff-replaces-state | historical-query | 9378 | 9378 | 0 | 100.00% | 100.00% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | cold-audit | 13903 | 6005 | -7898 | 46.30% | 90.00% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | continued-audit | 13342 | 0 | -13342 | 44.23% | 88.89% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | todo-operation | 19259 | 8071 | -11188 | 66.44% | 87.50% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | recovery | 16768 | 8303 | -8465 | 45.28% | 80.00% |
| validated-session-cache+scenario-deduplication+handoff-replaces-state | resume | 11233 | 45 | -11188 | 35.56% | 85.71% |
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
