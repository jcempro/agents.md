# AGENTS.md — Governança Operacional Global

RCF (Reference Compliance Framework): especificação arquitetural normativa e SSOT do sistema. Define, declarativa, determinística e verificavelmente, sua especificação integral (RF, RNF, regras, modelos, contratos, componentes, padrões, restrições, convenções, conformidade e correlatos), suficiente para que qualquer implementação conforme produza o mesmo sistema, independentemente de tecnologia, linguagem, framework, ferramenta ou equipe; ressalvado o domínio normativo de /agents.md e associados. Definição mandatória, integrante e irremovível (mas otimizável) desta norma.

`AGENTS.md` governa atuação da IA; RCF governa requisito, contrato, arquitetura e negócio. Registro: `./.agents/core/concepts/microconceitos.md`. Aplicar sempre `MN-2119`, `MN-DENS`, `MN-PRES` e `MN-REF`; cada seção cita os demais conceitos aplicáveis, resolvidos seletivamente por `MN-REF`.

## Apendice - GESTAO DE CONTEXTO (RFC_COMPLIANT)

- O Agente DEVE executar `/compact` para comprimir o histórico sob alto volume de mensagens (12+). Quando a plataforma não expuser `/compact`, `agent:compress` DEVE gerar projeção resumida e retomável a partir da memória canônica, atualizar somente derivados autorizados e NÃO DEVE apagar FT dentro da retenção.

## 0. Finalidade, autoridade e portabilidade

### 0.1–0.5 Finalidade e domínio

Aplicar `MN-ROLE` e `MN-EXT`. Este arquivo DEVE governar a operação da IA sem alterar instrução intrínseca da plataforma e permanecer reutilizável sem adaptação. NÃO DEVE conter URL, nome próprio, path físico ou regra exclusiva; PODE usar path relativo e conceito universal. AGENTS define processamento; RCF/cenário define função do produto. AGENTS PODE normatizar método, cache, FT, artefato, build e validação, mas NÃO DEVE criar negócio.

RCF aplicável DEVE explicar contexto e critérios da regra de negócio projetada na fonte. Alteração de regra, contrato, capacidade, cenário, script ou validação DEVE sincronizar RCF e fonte na mesma FT: RCF conserva explicação integral; AGENTS, projeção operacional.

### 0.6–0.11 Compartimentação e extensão local

RCF/cenário DEVE definir comportamento; AGENTS/auxiliar, processamento. Conversão entre domínios é regressão. `agents.local.md` e memória PODEM residir na raiz ou em `./.agents/`. Fonte, artefato, construtor, consumidor e dupla função DEVEM manter autoridade, contexto, arquivo e validação segregados. Atualizar norma raiz a partir da fonte exige solicitação humana explícita. Alterar RCF exige confirmação humana diante de ambiguidade, risco interpretativo ou regressão possível.

### 0.12 Atualização

Todo repositório DEVE expor `update:agents` como comando NPM canônico; `agent:autoupdate`, `agents:autoupdate`, `agent:agents` e `agents:update` PODEM ser aliases transitórios equivalentes. Sem argumento sempre converge o núcleo ao manifesto validado, commita e publica; `--check` e `--dry-run` não escrevem. Criação/reparo aplica `./.agents/core/update/scenario.md`. Após download/extracao e validação mínima do runtime manifestado, o bootstrap instalado DEVE passar bastão ao atualizador da release, com estado autenticado e retomada exata sem nova rede: releaseRoot é fonte imutável de código/dependências e targetRoot é o único destino. Falha no handoff fecha sem fallback ao runtime antigo. Origem recebida validada define exaustivamente o gerenciado: arquivo preexistente ou editado em path recebido DEVE ser preservado, quando divergente, em ZIP de compressão máxima sob `./agents-governance-backups/YYYY-MM-DD/` e substituído, nunca bloquear a atualização; somente extensão autorizada fica fora de descoberta e sobrescrita. A raiz de backup DEVE ser ignorada pelo Git, ter nome rastreável e ser informada para exclusão humana. Preexistente serve à migração, backup, legado comprovado, limpeza ou restauração transacional, nunca como segunda fonte. Mudança de formato/path/notação/recurso/estrutura DEVE incluir descritor versionado, marcador e conversor permanente da versão anterior; ausência futura do original NÃO autoriza retirar conversor. Configuração equivalente DEVERIA compartilhar parser e descritor formal.

### 0.13 Raízes arquiteturais

Repositório DEVE distinguir raiz do repositório, raiz da aplicação e raiz do artefato publicado; elas NÃO são intercambiáveis. Raiz do repositório contém somente governança ativa, documentação, manifesto, automação e infraestrutura transversal; código, implementação e recurso internos DEVEM ficar sob estrutura-fonte `src`/equivalente declarada, salvo exigência superior comprovável de framework, ecossistema, gerador ou compilador. Essa estrutura-fonte NÃO é a raiz da aplicação. Conveniência NÃO justifica exceção. Em Web Page Like, raiz da aplicação e raiz do artefato publicado DEVEM coincidir com o `/` percebido pelo usuário; fonte interna NÃO DEVE vazar para essa superfície. RCF PODE declarar nomes e pipeline físicos, mas NÃO PODE inverter precedência, deslocar governança ativa para artefato ou dispensar segregação.

## 1. Domínios e precedência

Governança: AGENTS → RCF global → RCF específico → README → memória → demais. Projeto/negócio: RCF global → específico → README → memória → demais; AGENTS DEVE permanecer aplicável quanto ao método. Regra local: `agents.local.md`, limitada pelos anteriores. Conflito transversal DEVE preservar comportamento e conteúdo; insolúvel aplica `MN-PRES`.

## 2. Edição normativa

Aplicar `MN-2119`, `MN-DENS`, `MN-PRES` e `MN-IA-OPT`. Perfil: AGENTS/memória/associados 90% máquina; RCF 75%; README/análogo 50%. Alteração manual NÃO DEVE regredir. Marcação de IA só DEVE incidir sobre conteúdo editorial, documentação humana ou FT Negócio semanticamente transformada; NÃO DEVE incidir sobre AGENTS, RCF, memória, código, configuração, manifesto, workflow ou técnico análogo, salvo RCF expresso. Correção mecânica NÃO DEVE exigir marcação.

## 3. Mapa, leitura e cache

Aplicar `MN-IA-OPT` e `MN-PREP`. Mapa DEVE conter somente fonte, norma, configuração e artefato útil; NÃO DEVE conter build, temporário, intermediário ou lixo. IA DEVE ler somente faltante, divergente ou indispensável, manter em contexto norma/FT/decisão/falha/resultado e NÃO DEVE reprocessar sem mudança, evidência, atualização ou ganho concreto. Cache insuficiente DEVE provocar leitura/validação completa.

## 4. Execução por estado

Aplicar `MN-STATE`. Antes de implementar, IA DEVE identificar intenção, localizar/criar/classificar FT, selecionar etapa/tarefa, atualizar plano e executar do estado registrado. FT pendente incompatível DEVE ser resolvida primeiro.

## 5. Frentes de Trabalho

Cada solicitação pertence a uma FT conforme `MN-STATE`; etapa contém tarefas e FT só conclui com todas concluídas. Técnico constrói mecanismo; Negócio produz substância. FT PODE usar subarquivo versionado quando reduzir contexto; `.gitignore` NÃO DEVE ocultá-la.

## 6. Plano, etapas e tarefas

Plano vigente DEVE preceder implementação; requisito, contrato ou solução alterada DEVE atualizar RCF/memória antes de continuar. Etapa declara posição `X/N`, objetivo, dependência, tarefas e estado funcional; tarefa declara posição, nome e previsão e DEVERIA entregar estado funcional. Plano PODE evoluir, preservando concluídos enquanto ativo. Conclusão valida e atualiza memória antes de avançar. Alteração moderada exige ≥2 commits; agressiva, ≥4. FT concluída DEVE ser comprimida sem perda, retida exatamente 15 dias e removida depois.

## 7. Memória operacional

Exatamente um `continue.ia` ou `continue.dev` canônico DEVE existir; referência legada converge ao ativo. Formato DEVE ser rastreável, indexável e legível; XML NÃO DEVERIA ser usado sem justificativa. Além de `MN-STATE`, aprendizado registra `MACHINE_ID`, `DATA_REF`, cache e bloqueio de repetir falha sem evidência nova.

## 8. Interrupção e retomada

Iminência de limite DEVE salvar estado e marcar `[INTERROMPIDO_POR_LIMITACAO_DE_RECURSOS]`. Retomada valida alteração manual, continua se equivalente ou solicita decisão; remove a flag somente após retomada validada.

## 9. Git

Desenvolvimento DEVE ocorrer em `dev`; merge em `main`/`master` só PODE ocorrer com FT concluída e sistema global funcional. Branch e working tree DEVEM ser verificados antes de alterar. Se branch não for `dev` com alteração unstaged, IA DEVE solicitar escolha: preservar `dev`; recriá-lo de main/master; levar/mesclar estado; ou continuar. Commit/push DEVEM ser comprovados e usar API quando disponível.

Conclusão de FT ou release publicado DEVE convergir `dev` para a branch primária disponível (`main`, senão `master`) antes de encerrar o ciclo. Merge preserva ambos os históricos: fast-forward se a primária for ancestral de `dev`; diante de divergência compatível, merge normal; conflito bloqueia publicação até resolução explícita. A primária NÃO DEVE permanecer ancestral defasada de `dev`.

## 10. Não regressão e sincronização

Implementação NÃO DEVE regredir arquitetura, negócio, UX, API, build, cache, desempenho, compatibilidade, CI/CD, publicação, bundle ou produto final. Regressão só PODE ocorrer por solicitação humana confirmada. Mudança de regra, comportamento, build, fluxo, UI, operador, recurso ou documentação DEVE sincronizar AGENTS/local, README, RCF, memória, implementação e UI aplicáveis.

## 11. Runtime, build e CDN

Implementação NÃO DEVE introduzir negócio não autorizado, dependência inútil, duplicação, complexidade gratuita ou refatoração extrínseca. Produto final contém somente runtime necessário; recurso de desenvolvimento NÃO DEVE integrá-lo. Build incorpora recurso resolvido se manifesto/licença/target forem compatíveis. RCF decide CDN; em silêncio, produto online DEVERIA usar CDN cacheável, solução local PODE prevalecer por tamanho/latência/banda, e bundle offline mantém recursos locais.

Configuração personalizável DEVE residir somente em `./config/` ou raiz estrutural equivalente declarada, modularizada por contexto e com schema/versionamento; código NÃO DEVE redefinir URL, path de aplicação/artefato, porta, modo, hook ou metadado mutável. Precedência aplica `MN-CLI`; build/CLI materializa configuração para o target, sem vazar parâmetro exclusivo de desenvolvimento. Web DEVERIA referenciar configuração versionada cacheável sem duplicação entre páginas; bundle offline/móvel DEVE embutir somente o subconjunto necessário ou apontar à URL homologada declarada.

Todo repositório DEVE declarar `dev-live` com host, porta, protocolo, proxy e reload na configuração central. Default portátil: `127.0.0.1:4000`, HTTP, sem proxy e reload por watch; especialização local PODE substituir valores sem alterar o contrato público.

## 12. Padrões de implementação

Análise e saída técnica DEVEM usar PT-BR, validar impacto e NÃO DEVE apresentar hipótese como conclusão. Alteração DEVE ter diff mínimo, preservar fluxo, contrato e comentário correto; redundância suspeita DEVE receber `// PRESERVADO: potencial correção de bug não documentada`. Correção nova DEVE usar `// FIX-BUG:` ou `// PROTECAO:` conciso. Texto NÃO DEVE usar pronome interlocutório/autorreferencial, "talvez", "pode ser" ou "provavelmente". Ambiguidade aplica `MN-PRES`.

Todo código-fonte e código final entregável cujo formato aceite comentário DEVE manter ou inserir somente cabeçalho de autoria/licença e NUNCA removê-lo. O cabeçalho DEVE usar dados do repositório ao qual o código pertence: URL upstream/origem, autor primário e secundário se houver, respectivos site/e-mail se houver, nome/link da licença e seu texto canônico ultrassucinto; dado ausente NÃO DEVE ser inferido.

Build DEVE injetar/validar o cabeçalho a partir da configuração central em cada saída comentável, inclusive minificada/compilada. README DEVE encerrar com Autoria, Repositório e Licença equivalentes, sem fonte paralela de metadados.

## 13. Validação

Aplicar `MN-VAL`. Validação DEVE comprovar ausência de regressão, autonomia, segregação runtime/build, preservação pós-build, independência de bundle, pipeline/publicação, reprodutibilidade, redução possível e critérios específicos do RCF.

## 14. Documentação e RCF

RCF aplicável DEVE cobrir, quando pertinente, segregação runtime/build, validação centralizada, hierarquia Global → Sessão → Execução, FT/memória e sincronização entre documentação e implementação.

## 15. Implementações em andamento

`agent:handoff` DEVE gerar Markdown raiz a partir da memória; arquivo NÃO DEVE ser editado manualmente e DEVE ser linkado no README. Deve conter introdução curta, uma subseção por FT ativa, objetivo e escopo quando autorizado; FT Negócio DEVE ser omitida por padrão. Tabela DEVE ser HTML, com etapa/tarefa individual e somente status `pendente`, `em andamento`, `concluído` e ícone mapeado.

## 16. Saída final

Entrega DEVE terminar com `COMMIT_SUGERIDO: <PT-BR; até 512 caracteres>` e `PENDENCIAS: <etapas/tarefas ou nenhuma>`.

## 17. Cenários

Aplicar `MN-SCEN`, `MN-REF` e `./.agents/core/contracts.md`. Regra específica só PODE restringir geral no próprio escopo, com justificativa e preservação. Interface pública e processo existente DEVEM permanecer; correção incidental limita-se à região alterada. Contradição registra `CONTRADIÇÃO DETECTADA: <origem> vs <regra> — Aplicando a regra de maior precedência.`

| Cenário                 | Arquivo/seção                                                                                                 | Dependência                               | Aplicação                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| Web Page Like           | `./.agents/scenarios/web/page-like/scenario.md` → `./.agents/scenarios/web/page-like/capabilities/browser.md` | capacidades Web                           | navegador/engine web                                                          |
| Web estático/hospedagem | mesmo roteador → `./.agents/scenarios/web/page-like/capabilities/static-hosting.md`                           | `WEB-BROWSER`                             | gerador, template, páginas                                                    |
| Editorial               | mesmo roteador → `./.agents/scenarios/web/page-like/capabilities/editorial.md`                                | `WEB-BROWSER`; `WEB-STATIC` se verdadeiro | artigo, post, sermão, ensaio, notícia                                         |
| Release                 | `./.agents/scenarios/release/scenario.md`                                                                     | núcleo/release                            | versão, tag, asset ou release publicável                                      |
| Publicação de Conteúdo  | `./.agents/scenarios/content-publication/scenario.md`                                                         | cenário técnico selecionado pelo RCF      | artefato de Negócio publicável                                                |
| Evolução upstream       | `./.agents/scenarios/governance/upstream-sharing/scenario.md`                                                 | núcleo, atualização e CLI                 | consumidor que avalia contribuição reutilizável; construtor para inbox formal |

## 18. API operacional

Aplicar `MN-API`, `MN-DEF`, `MN-OUT` e `MN-CMD`. `agent:filter`/`to-ia` DEVE existir antes dos demais; toda saída para IA DEVE atravessá-lo. Entrada exclusiva/predominante de IA DEVE residir em `./.agents/core/runtime/scripts/`; script especializado DEVE residir com seu cenário. Sequência repetida 2 vezes, com 3+ comandos, saída provável acima do orçamento ou filtragem repetida DEVE virar comando composto.

Script reutilizável DEVE aplicar `MN-CLI`, `MN-META` e `MN-EXT`; carrega apenas `./.agents/meta/cli.md` e contextos mapeados aplicáveis.

NPM DEVE expor `release`, `publish` e `update:agents` como orquestradores universais all-in-one; comandos parciais usam namespace hierárquico por `:`. Implementação compartilhável reside em `shared:*`; `agent:*`/`agents:*` ficam reservados à operação da IA e DEVEM somente delegar ao comando global/compartilhado com saída filtrada, sem duplicar lógica. Core NÃO DEVE inferir raiz-fonte, saída ou ativo da aplicação: recebe paths/configuração e propaga hooks `pre`/`post` tipados. Fluxo all-in-one valida branch/tree, limpa somente saída declarada, executa hooks/build/validação, commita, publica, acompanha pipeline e solicita decisão humana apenas diante de divergência crítica não resolvível.

Aceite humano de issue DEVE usar `agent:inbox:approve` com issue, papel construtor e autorização explícita; recomendação técnica não constitui aceite e a FT nasce na sincronização posterior.

Matriz canônica: Workspace `agent:filter`, `agent:setup`, `agent:doctor`, `agent:repair`, `agent:clean`, `agent:status`, `agent:context`, `agent:workspace`; SO `agent:pwd`, `agent:ls`, `agent:tree`, `agent:find`, `agent:search`, `agent:grep`, `agent:head`, `agent:tail`, `agent:view`, `agent:stat`, `agent:size`, `agent:hash`, `agent:diff-file`, `agent:logs`, `agent:process`, `agent:kill`, `agent:ports`, `agent:compress`, `agent:extract`; Git `agent:git-status`, `agent:git-fetch`, `agent:git-pull`, `agent:git-push`, `agent:git-sync`, `agent:git-add`, `agent:git-commit`, `agent:git-branch`, `agent:git-switch`, `agent:git-tag`, `agent:git-log`, `agent:git-show`, `agent:git-history`, `agent:git-diff`, `agent:git-blame`, `agent:git-reset`, `agent:git-restore`, `agent:git-clean`, `agent:git-stash`, `agent:git-prune`, `agent:git-gc`, `agent:git-last-release`, `agent:git-release-notes`, `agent:git-changelog`; upstream `agent:upstream:check`, `agent:upstream:prepare`, `agent:upstream:publish`, `agent:upstream:assess`, `agent:upstream:apply-assessment`, `agent:test:upstream`, `agent:inbox:event`, `agent:inbox:fetch`, `agent:inbox:evaluate`, `agent:inbox:process`, `agent:inbox:apply`, `agent:test:inbox`; build `agent:build`, `agent:verify`, `agent:dist`, `agent:package`, `agent:release`, `agent:release:trigger`, `agent:release:publish`, `agent:rollback`; conteúdo, somente com o cenário aplicável, `agent:publish`, `agent:deploy`; qualidade `agent:test`, `agent:test:<grupo>`, `agent:lint`, `agent:format`, `agent:typecheck`, `agent:benchmark`, `agent:security`, `agent:analyze`; dependência `agent:deps`, `agent:update-deps`, `agent:licenses`; documentação `agent:index`, `agent:map`, `agent:handoff`, `agent:docs`, `agent:rcf`, `agent:agents`; dados `agent:parse-data`, `agent:summarize`, `agent:convert`, `agent:validate-data`, `agent:index-data`, `agent:query-data`. `publish` nunca representa release. Remoção, renomeação ou dispensa DEVE ter autoridade e transição explícita.
