# Projeção RCF para a Norma Operacional

Identidade normativa: `core.rcf-projection`; núcleo de auditoria; tipo: folha. Ler ao alterar RCF §§13–20, arquitetura da Norma, índice ou aceite de fase. Este arquivo mapeia autoridades sem repetir integralmente suas regras.

## 1. Matriz bidirecional

| RCF | Projeção canônica em `src/` | Cobertura |
|---|---|---|
| §13.1 | `AGENTS.md` §§0–1; `core/authority.md`; `roles/final.md`; `roles/constructor.md` | vocabulário, autoridades, princípios e papéis cumulativos |
| §13.2 | `core/authority.md` §3; `roles/final.md` §2; `core/contracts.md` | compulsoriedade, extensão e proibição de fluxo paralelo |
| §13.3 | `scenarios/governance/official-gap.md`; `scenarios/governance/upstream-sharing/scenario.md` | validação atual, issue-proposta, suspensão e exceção extrema |
| §13.4 | `scenarios/governance/request-lifecycle.md`; `AGENTS.md` §§4–8; `roles/constructor.md` §2 | captura, decomposição, contextos, FTs, fases, handoffs e integração |
| §13.5 | `resources/scripts.md` §§1–3; `core/contracts.md` CT-8 | automação proporcional, processo longo, orquestração e custo |
| §14.1 | `core/contracts.md` CT-5–CT-8; `resources/scripts.md` | assinatura, hook, callback, fallback, estado, log, segurança e failsafe |
| §14.2 | `core/update/scenario.md`; `AGENTS.md` §0.12; `roles/final.md` §1 | atualização convergente, backup, classificação, transação e commit |
| §14.3 | `resources/workflows.md`; `roles/constructor.md` §3 | manifesto, distribuição, instalação, gatilho, permissão e integridade |
| §§15.1–15.2 | `AGENTS.md` §§10–13; `resources/scripts.md` §§1–3 | intervenção mínima, microunidades, proteção e validação proporcional |
| §§15.3–15.4 | `resources/traceability.md`; `AGENTS.md` §12 | documentação nativa e assinatura causal RCF↔commit sem recursão |
| §16 | `core/authority.md`; `roles/*`; `scenarios/*`; `resources/*`; `normative-index.json` | núcleo, papéis, cenário técnico/produto, recurso e descoberta |
| §17 | `resources/scripts.md` §§4–5; `roles/constructor.md` §3 | TypeScript fonte, JavaScript derivado, multilíngue, matriz e update seletivo |
| §18 | `core/routing.md`; `normative-index.json`; schema do índice | RAG determinístico, grafo, fallback, tokenização planejada e segurança |
| §19 | `core/evaluations/logical-syntax.md`; `core/routing.md` §6 | comparação, rejeição atual e gate anterior a parser/formatter |
| §20 | este mapa; índice; validações e estado da FT | cobertura, gates e separação da FT-052 |

Toda alteração posterior em uma coluna DEVE revisar a outra. Norma com implementação futura aponta à FT-052; nenhum contrato desta projeção autoriza código.

## 2. Métricas da reconstrução

Baseline: commit `b37ac57`, normalização LF/UTF-8 para comparação:

| Métrica | Baseline | FT-051 | Delta |
|---|---:|---:|---:|
| arquivos Markdown normativos | 24 | 35 | +11 |
| bytes Markdown normalizados | 102.695 | 147.654 | +44.959 |
| bytes do `AGENTS.md` | 28.159 | 30.263 | +2.104 |
| nós/arestas do grafo | inexistente | 35/34 | arquitetura nova |
| profundidade máxima | inexistente | 2 arestas | limitada |

Rotas exemplares medem conteúdo integral selecionado, sem contar índice JSON:

| Rota | Nós | Bytes | Palavras | Fração do corpus Markdown |
|---|---:|---:|---:|---:|
| Final comum + solicitação | 4 | 39.928 | 4.541 | 27,0% |
| Construtor em fase normativa | 11 | 58.397 | 6.792 | 39,5% |
| Lacuna + proposta upstream | 5 | 44.556 | 5.093 | 30,2% |

Tokenizer oficial/versionado ainda não existe; contagem exata de tokens seria hipótese e permanece tarefa executável da FT-052. Bytes/palavras são métricas reproduzíveis desta fase. A ausência de tokens exatos não autoriza sintaxe nova nem invalida o índice: impede alegar ganho tokenizado.

## 3. Invariantes e limites

Validação desta fase DEVE comprovar todos os Markdown normativos indexados, paths existentes, IDs únicos, arestas resolvidas, ausência de leaf com saída, nó inalcançável, ciclo ou código executável alterado. Fallback lê todos os nós por precedência.

Permanecem exclusivos da FT-052: gerador/validador do índice; tokenizer e métricas derivadas; mapa visual/README; TypeScript, transpilação e minificação; adaptação de scripts; manifestos materiais com hashes; pacote/allowlist; workflows; hooks; rastreabilidade automática; build e correção da paridade EOL. Esta fase apenas os normatiza.
