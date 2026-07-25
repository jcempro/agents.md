# Autoridade operacional e mecanismos oficiais

Identidade normativa: `core.authority`; papel: comum; tipo: folha. Ler integralmente em toda atuação governada. Não dispensar por cenário, papel, familiaridade ou economia de contexto. Aplicar `MN-2119`, `MN-PRES`, `MN-ROLE`, `MN-EXT` e `MN-REF`.

## 1. Vocabulário canônico

**Norma Operacional** é `AGENTS.md` e associados, responsável pelo modo de atuação, processo, leitura, edição, validação, rastreabilidade, automação, scripts, hooks, comandos e FTs. **RCF** é a SSOT arquitetural declarativa, determinística e verificável do que o sistema é e DEVE fazer. **Repositório Construtor** mantém, constrói, valida ou distribui a Norma Operacional. **Repositório Final** consome a Norma. Papéis são cumulativos e nenhum afasta o outro.

**Mecanismo Oficial** é script, comando, hook, callback, adaptador, workflow, arquivo-gatilho, convenção, nomenclatura, contrato ou ponto de extensão normatizado. **Extensão Oficial** compõe o mecanismo sem substituir fluxo ou contrato. **Fluxo Paralelo** é mecanismo novo, duplicado, substitutivo ou funcionalmente equivalente que contorne o oficial. **Lacuna Oficial** é erro, risco, insuficiência ou ausência comprovada no mecanismo necessário. **Princípio Estruturante** é regra cuja degradação altera autoridade, alcance ou comportamento fundamental. **Microtexto Normativo** é unidade curta, coesa, autônoma, estável e referenciável. **Custo Líquido** compara tokens, bytes, tempo, processamento, navegação, manutenção, risco, precisão e reutilização.

Definição canônica NÃO DEVE ser redefinida em papel, cenário, recurso, RCF específico ou extensão. Especialização referencia o termo e restringe somente seu contexto.

## 2. Proteção estrutural

Revisão parcial, cirúrgica, ampla ou estrutural DEVE preservar autoridade, precedência, domínios, contratos, nomes, proibições, exceções, hooks, modus operandi, incisividade, rastreabilidade, força, efeitos e intenção. Princípio Estruturante é permanente, identificável e não regressivo; validação DEVE detectar remoção, diluição, relativização, subordinação, abreviação com perda, facultatividade ou substituição.

Densificação, modularização, roteamento, índice, resumo, tokenização e otimização NÃO DEVEM reduzir rigor, minúcia, clareza, explicitabilidade, exigibilidade, previsibilidade ou resistência a interpretação desviada. Norma não recuperada NÃO é norma inexistente.

## 3. Compulsoriedade e evolução

Antes de solucionar, agente e Repositório Final DEVEM consultar descoberta oficial, inspecionar estado real, reutilizar finalidade/nomenclatura existentes e corrigir implementação divergente. Dúvida, desconhecimento, cópia possivelmente desatualizada ou inadequação aparente exigem releitura, versão e rastreamento; NÃO autorizam improvisação.

Mecanismo Oficial NÃO DEVE ser neutralizado, duplicado, renomeado, reimplementado, contornado ou substituído. Resultado correto por fluxo incompatível permanece não conforme. Expansão só PODE usar hook, callback, composição, adaptador, arquivo-gatilho, extensão local ou contrato oficial, preservando fluxo principal, nomes, precedência, efeitos e compatibilidade.

Lacuna segue `../scenarios/governance/official-gap.md`. Solicitação segue `../scenarios/governance/request-lifecycle.md`. Contratos de composição, eventos, integração e assinaturas seguem `./contracts.md`; recurso especializado referencia o contrato comum e declara somente diferenças materiais.

## 4. Verificação

Revisão DEVE comprovar: conceitos centralizados; referências resolvíveis; ausência de fluxo paralelo; mecanismos oficiais preservados; papéis acumulados; extensão somente em ponto autorizado; princípio estruturante sem redução modal; e equivalência entre núcleo, módulo, índice e RCF aplicável.
