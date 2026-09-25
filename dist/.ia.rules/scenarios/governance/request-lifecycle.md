# Ciclo de solicitação e implementação faseada

Identidade normativa: `scenario.governance.request-lifecycle`; cenário técnico; tipo: híbrido. Ler diante de prompt, issue, TODO, demanda, alteração de escopo ou retomada. Não dispensar por tamanho da solicitação. Deriva passivamente para `./refused-decisions.md` em toda nova solicitação. Depende de `../../core/authority.md`, `../../roles/final.md`, `../../roles/constructor.md` quando ativo e `MN-STATE`.

## 1. Fonte e captura

Toda solicitação DEVE possuir ID único estável e registro individual antes de execução material. Fonte local versionada PODE ser vinculada ao blob/commit íntegro quando a recuperação for determinística; fonte efêmera/remota é preservada integralmente, inclusive complementações, referências e anexos, sob `.ia.rules/state/requests/<ID>/`, com origem, data, identidade, hash, FTs, RCFs de destino e incorporação. Original é imutável; correção, esclarecimento ou expansão posterior é adendo ordenado e distinguível, nunca reescrita. Registro é versionado, bidirecionalmente rastreável e independente do histórico da ferramenta; exceção de `.gitignore` é cirúrgica e não expõe cache, segredo ou log.

Imediatamente depois da fonte, antes de decomposição, FT ou solução, executar a triagem prioritária de `./refused-decisions.md`. Índice ausente porque não há entrada elegível significa acervo vazio, não falha. Candidato exige leitura do registro; equivalência material com recusa expressa ainda ausente e sem mudança técnica suficiente encerra a solicitação com ID/fundamento, sem reanálise. Matéria diferente ou mudança material segue o ciclo normal e atualiza o registro quando aplicável.

Antes de criar FT ou alterar artefato, decompor o conjunto integral em objetivo, escopo, requisitos, proibições, exceções, precedências, dependências, decisões, nuances, impactos, conflitos, lacunas, inferências legítimas, aceite e regressões.

## 2. Contextos e execução

Solicitação extensa DEVE ter contexto-mestre e subcontextos temporários densos em `.ia.rules/state/contexts/<ID>/`. Mestre registra mapa, arquitetura, relações, ordem, integração, estado e aceite global. Cada subcontexto declara identidade, ordem, fase, tarefa, escopo, objetivo, entradas, dependências, normas herdadas, restrições, fora de escopo, entregáveis, validações, estado e aceite.

Subcontexto carrega somente mestre, seu conteúdo, handoffs predecessores necessários e normas aplicáveis. Execução é unitária; paralelismo exige independência comprovada. Handoff registra decisões, arquivos, contratos, efeitos posteriores, riscos e validações. Mudança de escopo atualiza mestre e dependentes antes da continuação. Conclusão local NÃO autoriza conclusão global.

## 3. FTs, fases e integração

FT vincula-se ao registro material, nunca ao comando de orquestração, e possui arquivo individual suficiente à execução sem carregar FTs alheias. Compactação é válida somente com semântica íntegra, referência inequívoca ao original e menor custo global. Unidades relacionadas formam objetivo único, segregado somente por fase, dependência ou responsabilidade real. Norma e código permanecem em FTs distintas. Criação, identificação, vínculo e conciliação de todas as FTs formam commit exclusivo antes da norma.

No construtor, a ordem obrigatória é RCF → Norma em `src/` → código/scripts → validação/integração. Cada fase tem estado próprio, validação e commit; a atuação interrompe após fase normativa e aguarda nova autorização. No Final, aplica-se captura, análise, FT, commit inicial e RCF antes de código, sem inventar a dupla projeção exclusiva do construtor.

Integração final revisa objetivo original, fluxo, divergências, lacunas, dependências, contratos, artefatos e regressões. Temporários só são removidos no commit normativo após auditoria bidirecional comprovar que nenhuma regra, exceção, anexo, nuance, motivação ou critério permanece exclusivo.

## 4. Aceite

Validar fonte íntegra e hash; FTs vinculadas; ordem e autorização; contextos completos; handoffs suficientes; ausência de execução antecipada; auditoria origem→RCF→fonte→implementação; remoção correta de temporários; e conclusão global independente das conclusões locais.
