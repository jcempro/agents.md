# Projeção RCF para a Norma Operacional

Identidade normativa: `core.rcf-projection`; núcleo de auditoria; tipo: folha. Ler ao alterar RCF §§13–20, arquitetura da Norma, índice ou aceite de fase. Este arquivo mapeia autoridades sem repetir integralmente suas regras.

## 1. Matriz bidirecional

| RCF | Projeção canônica em `src/` | Cobertura |
|---|---|---|
| §§0.0.14 e 13.1 | `AGENTS.md` §§0–1; `core/authority.md`; `roles/final.md`; `roles/constructor.md`; `scenarios/governance/constructor-operation.md` | vocabulário, autoridades, papéis cumulativos, fonte distribuível e segregação interna |
| §13.2 | `core/authority.md` §3; `roles/final.md` §2; `core/contracts.md` | compulsoriedade, extensão e proibição de fluxo paralelo |
| §13.3 | `scenarios/governance/official-gap.md`; `scenarios/governance/upstream-sharing/scenario.md` | validação atual, issue-proposta, suspensão e exceção extrema |
| §13.4 | `scenarios/governance/request-lifecycle.md`; `AGENTS.md` §§4–8; `roles/constructor.md` §2 | captura, decomposição, contextos, FTs, fases, handoffs e integração |
| §13.5 | `resources/scripts.md` §§1–3; `core/contracts.md` CT-8 | automação proporcional, processo longo, orquestração e custo |
| §13.6 | `AGENTS.md` §§0.14, 3 e 7; `scenarios/governance/request-lifecycle.md`; `scenarios/governance/refused-decisions.md`; estado local fora de `src/` | triagem prioritária, recusa expressa ainda ausente, não inundação, reavaliação e exclusão de release |
| §14.1 | `core/contracts.md` CT-5–CT-8; `resources/scripts.md` | assinatura, hook, callback, fallback, estado, log, segurança e failsafe |
| §14.2 | `core/update/scenario.md`; `AGENTS.md` §0.12; `roles/final.md` §1 | atualização convergente, backup, classificação, transação e commit |
| §14.3 | `resources/workflows.md`; `roles/constructor.md` §3; `scenarios/governance/constructor-operation.md` §§3–5; `core/contracts.md` CT-9 | manifesto positivo, perfis, distribuição, instalação, gatilho, permissão e integridade |
| §§15.1–15.2 | `AGENTS.md` §§10–13; `resources/scripts.md` §§1–3 | intervenção mínima, microunidades, proteção e validação proporcional |
| §§15.3–15.4 | `resources/traceability.md`; `AGENTS.md` §12 | documentação nativa e assinatura causal RCF↔commit sem recursão |
| §16 | `core/authority.md`; `roles/*`; `scenarios/*`; `resources/*`; `normative-index.json` | núcleo, papéis, cenário técnico/produto, recurso, descoberta e eixo papel≠distribuição |
| §17 | `resources/scripts.md` §§4–5; `roles/constructor.md` §3 | TypeScript fonte, JavaScript derivado, multilíngue, matriz e update seletivo |
| §18 | `core/routing.md`; `normative-index.json`; schema do índice | RAG determinístico, grafo, fallback, tokenização planejada e segurança |
| §19 | `core/evaluations/logical-syntax.md`; `core/routing.md` §6 | comparação, rejeição atual e gate anterior a parser/formatter |
| §20 | este mapa; índice; `scenarios/governance/constructor-operation.md`; validações e estado das FTs | cobertura, gates, segregação FT-052/FT-058 e planejamento dos movimentos internos |

Toda alteração posterior em uma coluna DEVE revisar a outra. Norma com implementação futura aponta à FT-052 ou à FT-058 conforme a conciliação registrada; nenhum contrato desta projeção autoriza código.

## 1.1 Plano físico da segregação

Sem executar movimento nesta fase, a classificação autoritativa determina:

| Origem atual | Classe | Destino planejado | Efeito |
|---|---|---|---|
| `src/.ia.rules/core/evaluations/logical-syntax.md` | `builder-internal` | `constructor/evaluations/logical-syntax.md` | retirar estudo do corpus, índice e payload; preservar decisão e evidência |
| `src/.ia.rules/core/rcf-projection.md` | `builder-internal` | `constructor/docs/rcf-projection.md` | manter auditoria interna fora da fonte consumidora |
| `src/.ia.rules/config/repository.json` | `builder-internal` | configuração física canônica já existente em `config/repository.json` | retirar duplicata distribuível; gerar somente projeção mínima se necessária |
| `src/.ia.rules/roles/constructor.md` e `scenarios/governance/constructor-operation.md` | `consumer-scenario` | mesmos destinos relativos | preservar normatização reutilizável do papel Construtor |
| `scenarios/governance/issue-lifecycle.md` e runtimes de inbox/ciclo | `consumer-scenario`/`consumer-runtime` | mesmos destinos relativos | preservar integração condicional reutilizável |

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

## 3. Evolução da FT-054

Comparação normalizada LF/UTF-8 contra a FT-051:

| Métrica normativa | FT-051 | FT-054 | Delta |
|---|---:|---:|---:|
| Markdown normativo indexado | 35 | 36 | +1 |
| bytes normativos | 147.654 | 155.471 | +7.817 |
| bytes do `AGENTS.md` | 30.263 | 31.636 | +1.373 |
| nós/arestas | 35/34 | 36/35 | +1/+1 |

A rota Final comum para nova solicitação carrega `AGENTS.md`, autoridade, papel Final, ciclo da solicitação e triagem de recusas: 5 arquivos, 47.008 bytes e 5.347 palavras, equivalentes a 30,2% do corpus normativo. O custo aumentou apenas quando o gatilho universal de nova solicitação ocorre; em compensação, evita reanálise integral e FT duplicada diante de recusa equivalente.

O acervo local inicial possui 2 registros comprovados em 5 arquivos/13.083 bytes: sintaxe lógica/parser e técnicas avançadas de RAG. Esses bytes NÃO integram corpus normativo, grafo, fallback, fonte ou release. Ausência de outros registros é decisão de não inundação, não lacuna de migração.

## 4. Invariantes e limites

Validação desta fase DEVE comprovar todos os Markdown normativos indexados, paths existentes, IDs únicos, arestas resolvidas, ausência de leaf com saída, nó inalcançável, ciclo ou código executável alterado. Registros locais de `.ia.rules/state/decisions/refused/` não são normas, nós do grafo ou conteúdo de release; seu próprio índice governa descoberta. Fallback lê todos os nós normativos por precedência, nunca o acervo decisório inteiro.

Permanecem exclusivos da FT-052: gerador/validador do índice; tokenizer e métricas derivadas; mapa visual/README; TypeScript, transpilação e minificação; adaptação de scripts; manifestos materiais com hashes; pacote/allowlist; workflows; hooks; rastreabilidade automática; build e correção da paridade EOL. Esta fase apenas os normatiza.
