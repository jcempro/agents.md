# AGENTS.md — Governança Operacional Global

`AGENTS.md` governa a atuação da IA; RCF governa requisitos, contratos, arquitetura e negócio. Aplicar cumulativamente `./.agents/microconceitos.md` (`MN-2119`, `MN-DENS`, `MN-PRES`, `MN-IA-OPT`, `MN-PREP`, `MN-OUT`, `MN-CMD`, `MN-API`, `MN-DEF`, `MN-STATE`, `MN-VAL`, `MN-REF`). Referência a microconceito o incorpora integralmente.

## 0. Finalidade, autoridade e portabilidade

### 0.1–0.5 Finalidade e domínio

Este arquivo DEVE governar a operação da IA sem alterar instrução intrínseca da plataforma e DEVE permanecer reutilizável sem adaptação. NÃO DEVE conter URL, nome próprio, path físico ou regra exclusiva de projeto; PODE usar paths relativos e conceitos universais. AGENTS define como a IA processa; RCF/cenário define o que o projeto faz. AGENTS PODE normatizar método, cache, FT, artefato, build, validação e equivalentes, mas NÃO DEVE criar negócio.

### 0.6–0.11 Compartimentação

RCF/cenário DEVE definir comportamento funcional; AGENTS/auxiliar DEVE definir processamento. Regra de IA convertida em negócio, ou inverso, é regressão. `agents.local.md` contém somente particularidade não replicável. Terceiro importado NÃO DEVE ser analisado, alterado ou mantido antes de incorporação definitiva. `agents.local.md` e memória PODEM residir na raiz ou em `./.agents/`.

Somente `./AGENTS.md`, `./.agents/` e importações governam a IA; homônimo sob `src`, `dist` ou equivalente é artefato do produto e NÃO DEVE contaminar a governança. Alteração de RCF exige confirmação humana diante de ambiguidade, risco interpretativo ou regressão possível.

### 0.12 Atualização

Todo repositório DEVE expor `agent:agents`; `agents:update` PODE ser alias. Criação/reparo DEVE observar `./.agents/.autoupdate.md` quando aplicável.

## 1. Domínios e precedência

Governança: AGENTS → RCF global → RCF específico → README → memória → demais. Projeto/negócio: RCF global → específico → README → memória → demais; AGENTS DEVE permanecer aplicável quanto ao método. Regra local: `agents.local.md`, limitada pelos anteriores. Conflito transversal DEVE preservar comportamento e conteúdo; insolúvel aplica `MN-PRES`.

## 2. Edição normativa

Aplicar `MN-2119`, `MN-DENS`, `MN-PRES` e `MN-IA-OPT`. Perfil: AGENTS/memória/associados 90% máquina; RCF 75%; README/análogo 50%. Alteração manual NÃO DEVE regredir. Marcação de IA só DEVE incidir sobre conteúdo editorial, documentação humana ou FT Negócio semanticamente transformada; NÃO DEVE incidir sobre AGENTS, RCF, memória, código, configuração, manifesto, workflow ou técnico análogo, salvo RCF expresso. Correção mecânica NÃO DEVE exigir marcação.

## 3. Mapa, leitura e cache

Aplicar `MN-IA-OPT` e `MN-PREP`. Mapa DEVE conter somente fonte, norma, configuração e artefato útil; NÃO DEVE conter build, temporário, intermediário ou lixo. IA DEVE ler somente faltante, divergente ou indispensável, manter em contexto norma/FT/decisão/falha/resultado e NÃO DEVE reprocessar sem mudança, evidência, atualização ou ganho concreto. Cache insuficiente DEVE provocar leitura/validação completa.

## 4. Execução por estado

Aplicar `MN-STATE`. Antes de implementar, IA DEVE identificar intenção, localizar/criar e classificar FT, identificar etapa/tarefa, atualizar plano e executar do estado registrado. FT incompatível pendente DEVE ser resolvida antes de implementação posterior incompatível.

## 5. Frentes de Trabalho

Cada solicitação pertence a uma FT: `FT-NNN`, nome, objetivo, prioridade, status, escopo Técnico/Negócio, início/atualização/conclusão `YYYYMMDD.HHMM.SS`, plano integral e retomada. Etapa contém tarefas; FT só conclui com todas concluídas. Técnico constrói mecanismo; Negócio produz substância. FT PODE ser segregada em subarquivo versionado quando reduzir contexto; `.gitignore` NÃO DEVE ocultá-la.

## 6. Plano, etapas e tarefas

Plano vigente DEVE preceder implementação; requisito, contrato ou solução alterada DEVE atualizar RCF e memória antes da continuação. Etapa DEVE ter posição `X/N`, objetivo, dependência, tarefas e estado funcional. Tarefa DEVE ter posição, nome e previsão; DEVERIA deixar estado funcional. Plano pode evoluir, mas itens concluídos DEVEM permanecer enquanto FT ativa. Conclusão DEVE validar, atualizar memória, commitar, publicar quando possível e só então avançar. Alteração moderada DEVE ter pelo menos 2 commits; agressiva, 4. FT concluída DEVE ser comprimida sem perda, retida exatamente 15 dias e removida depois.

## 7. Memória operacional

Exatamente um arquivo canônico `continue.ia` ou `continue.dev` DEVE existir; referência legada converge ao nome ativo. Formato DEVE ser rastreável, indexável e legível; XML NÃO DEVERIA ser usado sem justificativa. Registro de FT DEVE conter identidade, datas, etapa/tarefa, plano, progresso, próximo ponto, decisões, verificações, comandos, pendências, hipóteses descartadas, falhas e antirretrabalho. Atualização DEVE ser contínua. Aprendizado DEVE registrar `MACHINE_ID`, `DATA_REF`, cache e bloqueio de repetição falha sem evidência nova.

## 8. Interrupção e retomada

Iminência de limite DEVE interromper controladamente, salvar estado e marcar tarefa `[INTERROMPIDO_POR_LIMITACAO_DE_RECURSOS]`. Retomada DEVE localizar a flag, validar alteração manual, retomar se equivalente ou solicitar decisão; remoção da flag só PODE ocorrer após retomada bem-sucedida.

## 9. Git

Desenvolvimento DEVE ocorrer em `dev`; merge em `main`/`master` só PODE ocorrer com FT concluída e sistema global funcional. Branch e working tree DEVEM ser verificados antes de alterar. Se branch não for `dev` com alteração unstaged, IA DEVE solicitar escolha: preservar `dev`; recriá-lo de main/master; levar/mesclar estado; ou continuar. Commit/push DEVEM ser comprovados e usar API quando disponível.

## 10. Não regressão e sincronização

Implementação NÃO DEVE regredir arquitetura, negócio, UX, API, build, cache, desempenho, compatibilidade, CI/CD, publicação, bundle ou produto final. Regressão só PODE ocorrer por solicitação humana confirmada. Mudança de regra, comportamento, build, fluxo, UI, operador, recurso ou documentação DEVE sincronizar AGENTS/local, README, RCF, memória, implementação e UI aplicáveis.

## 11. Runtime, build e CDN

Implementação NÃO DEVE introduzir negócio não autorizado, dependência inútil, duplicação, complexidade gratuita ou refatoração extrínseca. Produto final DEVE conter somente runtime necessário; recurso de desenvolvimento NÃO DEVE integrá-lo. Build DEVE incorporar seletivamente recurso resolvido quando possível. RCF decide CDN; em silêncio, produto online DEVERIA usar CDN cacheável, solução local PODE prevalecer por tamanho/latência/banda, e bundle offline DEVE manter recursos locais.

## 12. Padrões de implementação

Análise e saída técnica DEVEM usar PT-BR, validar impacto e NÃO DEVE apresentar hipótese como conclusão. Alteração DEVE ter diff mínimo, preservar fluxo, contrato e comentário correto; redundância suspeita DEVE receber `// PRESERVADO: potencial correção de bug não documentada`. Correção nova DEVE usar `// FIX-BUG:` ou `// PROTECAO:` conciso. Texto NÃO DEVE usar pronome interlocutório/autorreferencial, "talvez", "pode ser" ou "provavelmente". Ambiguidade aplica `MN-PRES`.

## 13. Validação

Aplicar `MN-VAL`. Validação DEVE comprovar ausência de regressão, autonomia, segregação runtime/build, preservação pós-build, independência de bundle, pipeline/publicação, reprodutibilidade, redução possível e critérios específicos do RCF.

## 14. Documentação e RCF

RCF aplicável DEVE cobrir, quando pertinente, segregação runtime/build, validação centralizada, hierarquia Global → Sessão → Execução, FT/memória e sincronização entre documentação e implementação.

## 15. Implementações em andamento

`agent:handoff` DEVE gerar Markdown raiz a partir da memória; arquivo NÃO DEVE ser editado manualmente e DEVE ser linkado no README. Deve conter introdução curta, uma subseção por FT ativa, objetivo e escopo quando autorizado; FT Negócio DEVE ser omitida por padrão. Tabela DEVE ser HTML, com etapa/tarefa individual e somente status `pendente`, `em andamento`, `concluído` e ícone mapeado.

## 16. Saída final

Entrega DEVE terminar com `COMMIT_SUGERIDO: <PT-BR; até 512 caracteres>` e `PENDENCIAS: <etapas/tarefas ou nenhuma>`.

## 17. Cenários

Cenário é especialização reutilizável; regra específica só PODE restringir geral no próprio escopo, com justificativa e preservação. Novo cenário DEVE estar em Markdown independente e indexado; regra multicenário DEVERIA estar neste núcleo. Antes de criar solução, DEVE reutilizar universal → grupo → composição → parâmetro → criação. Interface pública DEVE permanecer estável; fluxo composto NÃO DEVE duplicar lógica; escolha técnica DEVE ser proporcional; processo existente DEVE ser preservado; correção textual incidental DEVE limitar-se à região alterada.

Arquivo de cenário DEVE declarar escopo, limites, dependências, contratos, exceções, precedência, segurança, privacidade, acessibilidade, desempenho, compatibilidade e validação; DEVE referenciar regra comum, não copiá-la. Antes de implementar, IA DEVE classificar projeto, carregar cenário/dependência integral, aplicar cumulativamente e registrar aplicação/dispensa. Falha de integridade normativa NÃO DEVE ser suprida por inferência. Contradição DEVE registrar `CONTRADIÇÃO DETECTADA: <origem> vs <regra> — Aplicando a regra de maior precedência.`

| Cenário | Arquivo/seção | Dependência | Aplicação |
| --- | --- | --- | --- |
| Web Page Like | `./.agents/webPageLike.md` §1 | — | navegador/engine web |
| Web estático/hospedagem | mesmo §2 | §1 | gerador, template, páginas |
| Editorial | mesmo §3 | §1; §2 quando aplicável | artigo, post, sermão, ensaio, notícia |
| Release | `./.agents/release.md` | — | versão, tag, asset ou release publicável |
| Publicação de Conteúdo | `./.agents/publish.md` | Web/RCF quando aplicável | artefato de Negócio publicável |

## 18. API operacional

Aplicar `MN-API`, `MN-DEF`, `MN-OUT` e `MN-CMD`. `agent:filter`/`to-ia` DEVE existir antes dos demais; toda saída para IA DEVE atravessá-lo. Entrada exclusiva/predominante de IA DEVE residir em `./scripts/.agents/`. Sequência repetida 2 vezes, com 3+ comandos, saída provável acima do orçamento ou filtragem repetida DEVE virar comando composto.

Matriz canônica: Workspace `agent:filter`, `agent:setup`, `agent:doctor`, `agent:repair`, `agent:clean`, `agent:status`, `agent:context`, `agent:workspace`; SO `agent:pwd`, `agent:ls`, `agent:tree`, `agent:find`, `agent:search`, `agent:grep`, `agent:head`, `agent:tail`, `agent:view`, `agent:stat`, `agent:size`, `agent:hash`, `agent:diff-file`, `agent:logs`, `agent:process`, `agent:kill`, `agent:ports`, `agent:compress`, `agent:extract`; Git `agent:git-status`, `agent:git-fetch`, `agent:git-pull`, `agent:git-push`, `agent:git-sync`, `agent:git-add`, `agent:git-commit`, `agent:git-branch`, `agent:git-switch`, `agent:git-tag`, `agent:git-log`, `agent:git-show`, `agent:git-history`, `agent:git-diff`, `agent:git-blame`, `agent:git-reset`, `agent:git-restore`, `agent:git-clean`, `agent:git-stash`, `agent:git-prune`, `agent:git-gc`, `agent:git-last-release`, `agent:git-release-notes`, `agent:git-changelog`; build `agent:build`, `agent:verify`, `agent:dist`, `agent:package`, `agent:release`, `agent:release:trigger`, `agent:rollback`; conteúdo, somente com o cenário aplicável, `agent:publish`, `agent:deploy`; qualidade `agent:test`, `agent:test:<grupo>`, `agent:lint`, `agent:format`, `agent:typecheck`, `agent:benchmark`, `agent:security`, `agent:analyze`; dependência `agent:deps`, `agent:update-deps`, `agent:licenses`; documentação `agent:index`, `agent:map`, `agent:handoff`, `agent:docs`, `agent:rcf`, `agent:agents`; dados `agent:parse-data`, `agent:summarize`, `agent:convert`, `agent:validate-data`, `agent:index-data`, `agent:query-data`. `publish` nunca representa release. Remoção, renomeação ou dispensa DEVE ter autoridade e transição explícita.
