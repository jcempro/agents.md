# Avaliação interna de sintaxe lógica

Identidade: `evaluation.logical-syntax/v1`; data: `2026-07-25`; fase: FT-051; decisão: **rejeitada nesta revisão**. Este relatório é evidência normativa, não gramática nem autorização de parser.

## 1. Método

Foram comparadas linguagem natural RFC 2119 e forma candidata com `IF`, `ELSEIF`, `ELSE`, `ENDIF`, `FOR`, `ENDFOR`, `GOTO`, `AND`, `OR` e `NOT`. O corpus cobre condição simples, encadeamento/exceção, operadores e precedência, loop finito, desvio, aninhamento, conflito e trecho discursivo. Medidas exatas disponíveis: bytes UTF-8 e unidades lexicais separadas por whitespace. Tokens de modelo NÃO foram medidos porque a fonte não possui tokenizer oficial/versionado; estimativa foi recusada para não apresentar aproximação como exatidão.

Critério de aprovação exige conservar sujeito, modalidade, escopo, condição, exceção, precedência e resultado; reduzir Custo Líquido; admitir uma interpretação; permanecer humana/parseável; e superar aprendizado, gramática, validação, migração e manutenção. Falha semântica invalida economia.

## 2. Resultados

| Caso | Natural bytes/palavras | Candidato bytes/palavras | Delta bytes/palavras | Equivalência | Diagnóstico |
|---|---:|---:|---:|---|---|
| condição simples | 101/16 | 95/13 | -6/-3 | suficiente | ganho pequeno, sem cobrir custo do padrão |
| encadeamento/exceção | 172/27 | 125/15 | -47/-12 | insuficiente | exceção exige token/escopo não definido |
| `AND`/`OR`/`NOT` | 125/21 | 91/14 | -34/-7 | suficiente com agrupamento | ganho local não demonstra recorrência |
| loop finito | 148/23 | 133/18 | -15/-5 | insuficiente | perde “exatamente uma vez” e contrato de término |
| `GOTO` | 115/19 | 74/10 | -41/-9 | insuficiente | salto torna registro posterior inalcançável/ambíguo |
| aninhamento | 173/26 | 149/20 | -24/-6 | insuficiente | altera precedência entre norma, divergência e exceção |
| conflito documental | 152/19 | 127/15 | -25/-4 | suficiente | economia moderada sem baseline de interpretação |
| discursivo | 174/20 | 72/8 | -102/-12 | insuficiente | remove fundamento, alcance e intenção |

Totais brutos: natural `1160` bytes/`171` palavras; candidato `866` bytes/`113` palavras; delta `-294` bytes/`-58` palavras. Apenas 3/8 casos conservaram equivalência material; 5/8 perderam regra, exceção, precedência, término, alcance ou motivação. A redução bruta é inválida como benefício normativo quando 62,5% do corpus regressa semanticamente.

## 3. Decisão

Nenhum token é aprovado. A linguagem vigente já é humana, editável, compatível com Markdown e protegida por modalidade/IDs. O candidato requer gramática, novos tokens, parser, formatter, treinamento editorial, migração e validação, mas não possui contagem oficial de tokens, baseline temporal, taxa de erro humano/IA nem equivalência suficiente.

Nova avaliação só PODE ocorrer com tokenizer oficial/versionado, corpus ampliado, execução cega por avaliadores, métricas de tempo/precisão/ambiguidade/manutenção e formas candidatas semanticamente integrais. Qualquer subconjunto futuro exige atualização prévia do RCF com gramática, aridade, precedência, exemplos, erros, migração, compatibilidade e inaplicabilidade. FT de código NÃO DEVE implementar sintaxe lógica com base neste relatório.
