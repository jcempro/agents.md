# FT-050 — contexto-mestre da consolidação normativa

Estado: fase 1/3 em execução; `src/`, código, scripts, hooks e workflows fora de escopo. Origem de orquestração: solicitação direta de 2026-07-25 que exige consolidar integralmente todos os itens de `TODO.ia.md` com `github:jcempro/agents.md#9`, executar somente a fase RCF e interromper.

## Mapa de origens materiais

| ID | Fonte direta | Unidade material | Destino planejado no RCF |
|---|---|---|---|
| O01 | `github:jcempro/agents.md#9` | autoridade, mecanismos oficiais, lacunas, solicitações, compactação, custo temporal e comandos | autoridade operacional; execução e rastreabilidade |
| O02 | `TODO.ia.md` “Blindar… atualizador” | migração resiliente, marcadores, árvore/índice, commit isolado, idempotência | atualização e distribuição |
| O03 | `TODO.ia.md` “Blindar… scripts” | contrato comum, extensões, logs, configuração, segurança, compatibilidade | engenharia de scripts |
| O04 | `TODO.ia.md` “tratamento rastreável…” | captura, análise, FTs, RCF → src → código, commits e interrupção | ciclo de solicitações |
| O05 | `TODO.ia.md` “rigor normativo…” | intervenção mínima, microunidades, intenção, prevenção/defesa/revisão | engenharia e não regressão |
| O06 | `TODO.ia.md` “Otimizar a modularização…” | núcleo, módulos, índice, métricas e equivalência | arquitetura contextual |
| O07 | `TODO.ia.md` “Segregar normas…” | papéis cumulativos, cenários técnicos, recursos e descoberta | arquitetura contextual |
| O08 | `TODO.ia.md` “toda classe…” | documentação nativa ultrassucinta e exclusão do produto final | documentação de código |
| O09 | `TODO.ia.md` “rastreabilidade por sentença” | hash material de sete caracteres e sincronização em duas fases | rastreabilidade RCF-código |
| O10 | `TODO.ia.md` “inclusão… workflows” | distribuição, índice, instalação, hooks e compulsoriedade | workflows distribuíveis |
| O11 | `TODO.ia.md` “arquitetura multilíngue” | TypeScript, Node 24+, dualidade, runtimes, atualização e hooks | arquitetura de scripts/release |
| O12 | `TODO.ia.md` “princípios aplicáveis de RAG” | avaliação, roteamento, grafo, tokenização, mapa, workflow e privacidade | recuperação normativa |
| O13 | `TODO.ia.md` “sintaxe compacta” | decisão condicionada, gramática, corpus, parser e migração | linguagem normativa |
| O14 | `github:jcempro/agents.md#2` | reavaliação e comentário somente após todas as demais unidades | gate terminal da FT-052 |

## Dependências e decisões

1. O01/O04 governam o ciclo e precedem as demais unidades.
2. O02/O03/O10/O11 compartilham contratos de script, atualização, release e distribuição; o RCF centraliza o comum e especializa por recurso.
3. O05/O08 definem a produção e revisão de código; O09 acrescenta rastreabilidade sem substituir Git/RCF.
4. O06/O07/O12 compartilham modularização e roteamento; O12 exige o indexador global mesmo se técnicas probabilísticas de RAG forem rejeitadas.
5. O13 permanece condicionado a ganho líquido e não autoriza adoção antecipada nesta fase.
6. O14 permanece bloqueado até o término material de O01–O13.
7. A grafia legada `.ia.rule` nas origens conflita com a raiz vigente `.ia.rules`; o RCF preservará a intenção de distribuição dentro da raiz canônica sem criar alias.
8. A exigência de Node.js `24+` será registrada como baseline do produto solicitado, com revisão conservadora e metadados por artefato; não será aplicada nesta fase.
9. O termo “RAG” será tratado como técnicas candidatas; a arquitetura determinística obrigatória independe de embeddings, serviço externo ou banco vetorial.

## Subcontextos sequenciais

`C01 autoridade/ciclo` → `C02 scripts/atualização/distribuição` → `C03 código/rastreabilidade` → `C04 papéis/roteamento` → `C05 RAG/grafo/tokenização` → `C06 sintaxe lógica` → `C07 integração/validação/remoção`.

Cada subcontexto herda O01/O04, `AGENTS.md`, `RCF.md` §§0–12, `MN-2119`, `MN-DENS`, `MN-PRES`, `MN-STATE`, `MN-VAL` e `MN-REF`. A passagem deve registrar seções alteradas, decisões, dependências posteriores, verificações e lacunas. Este arquivo e o registro da issue serão removidos no commit normativo depois de comprovada a incorporação integral.
