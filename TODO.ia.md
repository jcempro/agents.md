- [ ] [equalizer] Equalizar e executar as TO-DOs como frentes convergentes de um único objetivo
  - Este item rege todas as demais TO-DOs. Cada uma DEVE ser tratada como frente complementar de uma única execução, conciliada com as demais e convergente ao objetivo principal do projeto.

  - Contradições aparentes DEVEM ser presumidas como imprecisão redacional e resolvidas por equalização, sem perda de intenção, requisito, restrição ou nuance. Havendo evidência de conflito material não solucionável pelas normas e pelo contexto, o desenvolvedor DEVE ser consultado.

  - Considerações, comparações ou solicitações PODEM não ser plenamente aderentes ao projeto, especialmente quando previamente processadas por IA. Salvo dúvida material que exija confirmação, a IA DEVE interpretá-las conforme o contexto aplicável já normatizado no RCF e no `README.md`; persistindo ambiguidade ou incompatibilidade, DEVE consultar o desenvolvedor antes de prosseguir.

  - O `AGENTS.md` prevalece absolutamente; o RCF vigente prevalece sobre as demais fontes subordinadas. Toda alteração DEVE aprimorar o projeto, ampliar capacidades e recursos, preservar compatibilidade e força normativa e NÃO PODE introduzir regressão.

  - JAMAIS enfraqueça normas/RCF/agents.md ou regras, ainda que progressivamente, exceto se explicitamente e inequivocamente solicitado - havendo possibilidade de má interpretação / dubiedade, questione o desenvolvendor.

  - Antes de executar qualquer TO-DO:
    1. ler integralmente todas as TO-DOs e normas aplicáveis;
    2. equalizar objetivos, requisitos, dependências, precedências e terminologia;
    3. resolver incompatibilidades, ambiguidades, sobreposições e lacunas;
    4. adaptar, consolidar, desmembrar, reordenar ou eliminar itens somente quando isso aumentar coerência sem reduzir o objetivo material.

  - Toda TO-DO DEVE ser separada em:
    - **Normatização (RCF):** atualizar RCFs, contratos, precedências e documentação normativa necessária;
    - **Implementação:** executar código, migrações, testes, validações e alterações funcionais.

  - Após a equalização, a IA DEVE iniciar e concluir imediatamente a **Normatização RCF de todas as TO-DOs**, mantendo rastreabilidade entre cada regra e sua implementação futura.

  - Concluída a normatização, a IA DEVE INTERROMPER antes de qualquer implementação e solicitar autorização expressa do desenvolvedor, informando sucintamente:
    - implementações pendentes;
    - dependências e ordem recomendada;
    - impedimentos materiais identificados.

  - Toda alteração que implique em alteração no modo de codificar markdown, deve ser devidamente documentada em modo de uso.
  - Esta TO-DO é perene: NÃO PODE ser marcada como concluída nem removida e nem editada. Sua existência é perene; sua contabilização somente é necessária quando houver ao menos uma TO-DO por ela regida.

- [ ] Tornar o script de atualização integralmente resiliente, fail-safe, retrocompatível e orientado a sucesso efetivo
  - Tratar este requisito como contrato estrutural do atualizador, NÃO como correção pontual dos erros exemplificados abaixo.
  - O comando de atualização DEVE, obrigatoriamente, cumprir sua finalidade material: **atualizar todos os arquivos aplicáveis**, preservando integralmente dados, adaptações legítimas e compatibilidade histórica.
  - O atualizador NÃO PODE considerar sucesso a mera ausência de exceção: sucesso significa atualização efetivamente concluída e estado final válido.

  - **Princípio fail-safe/resiliente**
    - O script NÃO PODE deixar arquivos antigos sem atualização por inferência, otimização, heurística, estado parcial, metadata presumida ou conclusão não comprovada.
    - A necessidade de atualização DEVE ser determinada de forma verificável; na dúvida, prevalece processamento seguro, idempotente e sem perda.
    - Problemas, inconsistências, layouts legados, estados intermediários, incompatibilidades históricas e demais condições programaticamente tratáveis NÃO DEVEM causar aborto.
    - Detectar problema NÃO é tratamento. O script DEVE **resolver**, adaptar, migrar, reconstruir, realocar, reconciliar ou aplicar estratégia alternativa até alcançar estado válido.
    - Mensagens de diagnóstico PODEM existir, mas NÃO substituem a correção automática quando esta for tecnicamente possível.
    - É PROIBIDO transformar condição recuperável em erro terminal apenas para simplificar a implementação.

  - **Garantia de conclusão**
    - `agents:update` e comandos equivalentes DEVEM ser projetados para concluir com **sucesso efetivo** em qualquer estado programaticamente recuperável.
    - DEVEM existir quantas estratégias alternativas forem necessárias para resolver estados diferentes, ainda que isso torne a implementação significativamente mais complexa, modular ou segmentada.
    - Um mesmo problema PODE e, quando necessário, DEVE possuir múltiplos caminhos de recuperação/fallback.
    - NÃO existe limite arbitrário de tratamentos por condição: se cem variações recuperáveis exigirem cem tratamentos, todas DEVEM ser contempladas.
    - O fluxo somente PODE terminar sem sucesso quando houver impedimento material externo ou intrinsecamente não solucionável pelo próprio programa, por exemplo:
      - indisponibilidade real de conexão quando um recurso remoto indispensável ainda não estiver disponível localmente;
      - ausência de permissão do sistema operacional que o processo não possa adquirir legitimamente;
      - corrupção física/indisponibilidade de armazenamento;
      - outro impedimento externo comprovadamente fora da capacidade programática do atualizador.
    - Antes de declarar impedimento irrecuperável, o script DEVE esgotar alternativas tecnicamente seguras e registrar a causa objetiva.
    - NÃO classificar como irrecuperável situação meramente inconveniente, inesperada, legada ou não prevista pela implementação atual.

  - **Retrocompatibilidade absoluta**
    - O atualizador DEVE permanecer **continuamente retrocompatível com todas as versões anteriores suportáveis do projeto/`AGENTS.md`**, incluindo estruturas, adaptações, layouts e mecanismos historicamente válidos.
    - É terminantemente PROIBIDO eliminar adaptação anteriormente permitida pelo `AGENTS.md`, por versões anteriores dele ou pelo estado normativamente válido do projeto apenas porque a versão atual reorganizou sua arquitetura.
    - Quando uma adaptação antiga não puder permanecer em sua localização original:
      1. preserve seu conteúdo integral;
      2. mova-a para a nova localização normativa apropriada;
      3. preserve, quando necessário, vínculo/rastreabilidade com a origem;
      4. identifique-a explicitamente como adaptação herdada que pode exigir posterior revisão, correção ou adequação à norma atual;
      5. NÃO descarte nem sobrescreva silenciosamente seu conteúdo.
    - Migração DEVE significar transformação conservativa, nunca limpeza destrutiva do legado.
    - Estruturas desconhecidas porém potencialmente legítimas DEVEM ser preservadas e isoladas para reconciliação segura, não removidas por ausência de reconhecimento.

  - **Passagem de tocha / handoff**
    - O processo de `passagem de tocha` DEVE ocorrer **tão cedo quanto tecnicamente seguro e viável**, reduzindo janela de falso positivo, estado híbrido, processamento pelo runtime errado e erros descobertos apenas ao final.
    - A detecção do runtime/estrutura que deve assumir a atualização DEVE ocorrer antes de alterações desnecessárias feitas por mecanismo legado.
    - O handoff DEVE ser verificável e possuir fallback para estruturas históricas.
    - A inexistência do destino esperado para handoff NÃO DEVE, por si só, abortar a atualização; o script DEVE:
      - localizar alternativas válidas;
      - reconhecer layouts anteriores;
      - reconstruir/restaurar material derivável quando normativamente seguro;
      - utilizar runtime compatível disponível;
      - ou executar estratégia de migração apropriada.
    - Apenas ausência material impossível de reconstruir/obter por meios disponíveis PODE resultar em impedimento terminal.

  - **Git e estados locais**
    - Estado Git legítimo NÃO DEVE ser tratado automaticamente como razão para abortar atualização.
    - Commits locais pendentes, working tree modificada, branches divergentes ou condições análogas DEVEM possuir tratamento que preserve integralmente o trabalho existente e permita concluir a atualização sempre que programaticamente possível.
    - É PROIBIDO resolver conflitos de atualização mediante perda, descarte, reset destrutivo ou sobrescrita silenciosa de trabalho do usuário.
    - Quando atualização normativa, commits locais e/ou push precisarem coexistir, implemente estratégia segura de isolamento, preservação, reconciliação e restauração conforme a arquitetura real.
    - Um requisito de "push normativo exclusivo" NÃO PODE transformar automaticamente commits locais pendentes em falha terminal; a implementação DEVE contornar o conflito de forma segura ou reestruturar o fluxo para que ambas as garantias coexistam.

  - **Processamento integral**
    - O atualizador DEVE descobrir e processar **todos** os arquivos sujeitos à atualização.
    - NÃO confiar exclusivamente em listas históricas, timestamps, manifestos incompletos, hashes antigos, diretórios esperados ou qualquer outra heurística capaz de omitir arquivos.
    - Otimizações PODEM evitar trabalho comprovadamente redundante, desde que a equivalência do estado seja verificável.
    - Ausência de prova de atualização DEVE ser tratada como necessidade de reconciliação.
    - Ao concluir, DEVE existir verificação final independente suficiente para comprovar que nenhum arquivo aplicável permaneceu em versão anterior ou estado parcialmente migrado.

  - **Transacionalidade e preservação**
    - Atualizações que envolvam múltiplos arquivos DEVEM evitar estado final parcialmente atualizado.
    - Sempre que necessário, utilize staging, temporários, snapshots, journal/checkpoints, operações atômicas ou estratégia equivalente apropriada à implementação real.
    - Uma falha intermediária recuperável DEVE permitir continuidade/reentrada sem corrupção, duplicação ou perda.
    - A reexecução do comando DEVE ser idempotente ou convergir deterministicamente para o mesmo estado válido.
    - O script DEVE conseguir reconhecer atualização parcial anterior e retomá-la/reconciliá-la, em vez de reiniciar destrutivamente ou abortar.

  - **Tratamento de erros**
    - Audite todos os caminhos que hoje terminam em `throw`, `process.exit(1)`, rejeição não tratada, `status:error`, guard clause terminal ou equivalente.
    - Para cada um, classifique:
      - recuperável automaticamente;
      - recuperável por fallback/migração;
      - externo e realmente não solucionável.
    - Todo caso das duas primeiras categorias DEVE deixar de ser terminal.
    - Exceções internas inesperadas DEVEM, quando possível, ser capturadas no nível apropriado, convertidas em tentativa alternativa e somente propagadas depois de esgotadas estratégias seguras.
    - NÃO ocultar falhas reais: registre diagnóstico suficiente, mas mantenha a execução orientada à resolução.
    - `warn`/telemetria/relatório DEVEM distinguir:
      - problema detectado e corrigido;
      - fallback utilizado;
      - migração efetuada;
      - adaptação legada preservada;
      - impedimento realmente irrecuperável.

  - **Casos concretos atualmente proibidos**
    - Os comportamentos abaixo representam **classes de defeito**, não casos especiais a serem apenas mascarados.
    - Situação como:
      ```text
      Falha ao atualizar governanca operacional: Ha commits locais pendentes; push normativo exclusivo bloqueado.
      ```
      NÃO DEVE abortar. O atualizador DEVE preservar os commits/trabalho local, executar a atualização por estratégia compatível e alcançar estado válido sem perda.
    - Situação como:
      ```text
      Runtime de handoff nao manifestado: .ia.rules/core/runtime/scripts/update-agents.js
      ```
      NÃO DEVE abortar enquanto houver qualquer caminho programaticamente viável para reconhecer estrutura anterior, localizar runtime alternativo, reconstruir/migrar o handoff ou continuar por mecanismo compatível.
    - Mensagens similares que apenas descrevam condição recuperável seguida de encerramento com erro DEVEM ser eliminadas como comportamento terminal.

  - **Arquitetura de recuperação**
    - Se necessário para cumprir essas garantias, refatore o atualizador em etapas/módulos explícitos, por exemplo: descoberta, classificação de versão/layout, preservação, handoff, migração, atualização, reconciliação, validação e commit/finalização.
    - A segmentação é permitida e preferível quando reduzir risco ou tornar fallbacks independentes, mas NÃO imponha arquitetura específica sem antes inspecionar o código real.
    - Estratégias de recuperação DEVEM ser determinísticas, testáveis e ordenadas por segurança, preservação de dados e aderência normativa.

  - **Validação obrigatória**
    - Criar testes reais cobrindo, no mínimo:
      - repositório totalmente atualizado;
      - arquivos antigos ainda não atualizados;
      - mistura de versões/layouts históricos;
      - adaptações legadas válidas;
      - adaptação que precise ser realocada;
      - runtime atual presente;
      - runtime/handoff esperado ausente;
      - runtime legado presente;
      - atualização parcial/interrompida;
      - working tree limpa;
      - arquivos modificados não commitados;
      - commits locais pendentes;
      - branch divergente;
      - reexecução após sucesso;
      - reexecução após interrupção;
      - arquivo inesperado porém preservável;
      - inconsistência de metadata/manifests;
      - falha de uma estratégia com sucesso por fallback subsequente;
      - indisponibilidade externa realmente irrecuperável;
      - confirmação de que nenhum arquivo aplicável ficou desatualizado;
      - confirmação de ausência de perda de dados.
    - Testes DEVEM comprovar não apenas exit code `0`, mas o **estado final correto**.
    - Introduza fixtures/matrizes representando versões anteriores suficientes para comprovar retrocompatibilidade real, e não somente o layout corrente.

  - **Critérios de aceite**
    - `npm run agents:update` DEVE convergir para atualização completa e válida em todo cenário programaticamente recuperável.
    - Nenhum arquivo aplicável pode permanecer desatualizado por inferência não comprovada.
    - Nenhuma adaptação legítima histórica pode ser eliminada.
    - Estados Git recuperáveis não podem provocar aborto ou perda de trabalho.
    - Ausência/mudança de runtime de handoff deve ser recuperada quando houver solução tecnicamente possível.
    - Falhas recuperáveis devem resultar em tratamento/fallback, não em simples mensagem + exit não zero.
    - Reexecução deve ser segura e convergente.
    - A validação final deve comprovar atualização integral, compatibilidade, preservação de dados e sucesso material.
    - Exit diferente de sucesso somente é aceitável quando houver impedimento externo/irrecuperável demonstrável e depois de esgotadas alternativas programáticas seguras.

- [ ] Blindar definitivamente o escopo de edição da IA ao repositório imediatamente associado ao prompt
  - Esta é uma correção normativa **crítica e reincidente**. Já houve múltiplas tentativas anteriores de impedir edição fora do repositório corrente; portanto, a redação atual do `AGENTS.md` é insuficiente em força, explicitude ou mecanismos de contenção e DEVE ser reforçada de modo inequívoco, verificável e impossível de interpretar extensivamente.

  - **Regra nuclear de escopo**
    - Cada prompt, tarefa, sessão operacional ou equivalente DEVE ser considerado associado a **um único repositório/projeto corrente**.
    - A IA SOMENTE PODE criar, editar, mover, renomear, excluir ou reescrever arquivos que pertençam diretamente a esse repositório corrente e estejam subordinados ao seu `./AGENTS.md` aplicável.
    - O fato de a IDE manter múltiplos projetos/repositórios simultaneamente abertos NÃO amplia o escopo autorizado.
    - Relação funcional, dependência, integração, importação, consumo, referência, build conjunto, workspace, monorepo lógico, documentação cruzada ou qualquer outro vínculo com outro repositório **NÃO concede autorização para editá-lo**.

  - **Proibição absoluta de edição cruzada**
    - É TERMINANTEMENTE PROIBIDO modificar qualquer arquivo pertencente a outro repositório Git que não seja o repositório imediatamente associado ao prompt/tarefa corrente.
    - Essa proibição permanece válida mesmo quando o outro repositório:
      - estiver aberto na mesma IDE/workspace;
      - for dependência direta ou indireta;
      - for biblioteca utilizada pelo projeto;
      - for projeto irmão;
      - for repositório pai/filho;
      - estiver referenciado por caminho relativo;
      - estiver clonado dentro de diretório acessível;
      - estiver configurado como workspace;
      - for necessário para reproduzir integração;
      - estiver sob controle do mesmo usuário/organização;
      - aparentemente puder ser "corrigido na origem".
    - Em qualquer desses casos, a IA PODE apenas **inspecionar**, quando tecnicamente necessário e permitido, mas NÃO editar.

  - **Submódulos, subrepositórios e repositórios aninhados**
    - A presença física de outro repositório dentro da árvore do projeto NÃO o torna parte do escopo editável.
    - Qualquer diretório contendo identidade Git própria, submodule, worktree, subrepositório ou repositório aninhado DEVE ser tratado como **fronteira de exclusão**.
    - Arquivos dentro desses repositórios NÃO estão subordinados ao `AGENTS.md` do repositório pai para fins de autorização de edição.
    - É PROIBIDO atravessar essa fronteira para aplicar correções, mesmo que o repositório pai dependa diretamente deles.
    - Se uma alteração externa for necessária, registre-a como dependência/pendência a ser executada no contexto próprio daquele repositório.

  - **Determinação objetiva do repositório corrente**
    - Antes de qualquer alteração, a IA DEVE identificar inequivocamente:
      - raiz Git do repositório associado ao prompt;
      - `AGENTS.md` aplicável;
      - limites físicos desse repositório;
      - repositórios aninhados/submódulos existentes.
    - A autorização de escrita DEVE ser derivada dessa raiz, NÃO da lista de projetos abertos na IDE.
    - Em caso de dúvida sobre qual repositório está associado ao prompt, a IA NÃO DEVE escolher por conveniência nem inferir pelo vínculo técnico com outro projeto.

  - **Princípio de subordinação normativa**
    - A IA somente está autorizada a editar arquivos cuja governança normativa derive diretamente do `AGENTS.md` do repositório corrente e das normas a ele subordinadas.
    - Arquivo pertencente a outro repositório está sujeito ao `AGENTS.md`, RCF e contexto próprios daquele outro repositório; portanto, editar esse arquivo a partir da sessão atual constitui violação de governança.
    - Nenhuma regra do repositório corrente PODE ser projetada sobre outro repositório para justificar modificação externa.

  - **Exclusões obrigatórias adicionais**
    - Permanecem fora do escopo de edição:
      - `node_modules` e demais dependências vendorizadas/gerenciadas externamente;
      - caches;
      - artefatos gerados que não devam ser editados diretamente;
      - diretórios de terceiros;
      - qualquer caminho já vedado pelo `AGENTS.md`/RCF vigente;
      - arquivos de governança cuja edição já possua restrição específica.
    - Estas exclusões NÃO substituem a regra de fronteira Git; ambas são cumulativas.

  - **Integrações com outros repositórios**
    - Quando um defeito estiver localizado em outro repositório, a IA DEVE:
      1. identificar que a causa está fora do escopo;
      2. NÃO editar o repositório externo;
      3. implementar, quando possível e normativamente correto, apenas a adaptação necessária dentro do repositório corrente;
      4. registrar de forma objetiva a alteração requerida externamente, se ela for indispensável;
      5. somente modificar o outro repositório quando houver **novo prompt/tarefa explicitamente associado a ele**, sob sua própria governança.
    - É PROIBIDO "aproveitar" que o outro repositório está aberto para corrigi-lo no mesmo fluxo.

  - **Proteção operacional**
    - Não basta reforçar texto normativo. Sempre que tecnicamente possível, implementar salvaguardas programáticas nos scripts/agentes/ferramentas de execução para impedir escrita fora da raiz autorizada.
    - Antes de qualquer operação destrutiva ou de escrita, validar que o caminho:
      - pertence à raiz Git autorizada;
      - NÃO atravessa submodule/repositório aninhado;
      - NÃO pertence a dependência/terceiro excluído.
    - Caminho fora do escopo DEVE ser recusado antes da alteração.
    - Validação por prefixo textual simples NÃO é suficiente se puder ser burlada por symlink, junction, `..`, mount, worktree ou resolução de caminho real; utilize resolução canônica adequada ao ambiente.
    - A proteção DEVE funcionar em Windows e demais ambientes oficialmente suportados.

  - **Symlinks, junctions e caminhos indiretos**
    - É PROIBIDO editar arquivo externo por meio de symlink, junction, mount, alias, path traversal ou qualquer outro caminho que aparentemente esteja dentro da raiz, mas resolva fisicamente para fora dela.
    - Toda autorização de escrita DEVE considerar o caminho real/canônico de destino.
    - Links que apontem para outro repositório devem ser tratados como fronteira externa.

  - **Leitura versus escrita**
    - A leitura de documentação ou API de outro repositório PODE ocorrer apenas quando necessária para compreender integração, contrato ou diagnóstico.
    - Leitura NÃO concede autorização de escrita.
    - A IA DEVE manter distinção explícita entre:
      - recurso consultado;
      - recurso autorizado para modificação.
    - Nenhuma descoberta durante inspeção externa pode ampliar implicitamente o escopo.

  - **Comportamento diante de necessidade externa**
    - Se a solução completa depender de alteração em outro repositório, NÃO contorne a norma.
    - Conclua tudo que for possível no repositório corrente e registre a dependência externa de forma rastreável.
    - NÃO abrir, modificar, commitar, formatar, regenerar ou "corrigir incidentalmente" arquivos externos.
    - A impossibilidade de alterar o repositório externo NÃO constitui justificativa para violar a fronteira de escopo.

  - **Commits e Git**
    - Commits, staging, reset, checkout, branch, merge, rebase ou qualquer operação Git iniciada pela IA DEVEM afetar exclusivamente o repositório corrente.
    - É PROIBIDO executar operação Git em submódulos, repositórios irmãos ou aninhados durante a tarefa atual.
    - Operações recursivas como `git submodule foreach`, scripts globais ou comandos que percorram múltiplos repositórios DEVEM ser bloqueadas ou limitadas ao escopo autorizado.

  - **Testes obrigatórios**
    - Criar testes/fixtures que comprovem a contenção de escopo, incluindo:
      - dois repositórios irmãos abertos no mesmo workspace;
      - repositório externo consumido como biblioteca;
      - submodule Git;
      - repositório Git aninhado;
      - symlink/junction interno apontando para arquivo externo;
      - caminho com `..`;
      - workspace com múltiplas roots;
      - `node_modules`;
      - dependência local via `file:`/link;
      - arquivo externo explicitamente referenciado pelo código;
      - tentativa de operação Git em repositório externo.
    - Em todos esses casos, a IA/ferramenta DEVE impedir escrita externa e preservar integralmente os arquivos de terceiros.
    - Também testar que arquivos legítimos dentro da raiz autorizada continuam editáveis normalmente.

  - **Auditoria da norma existente**
    - Localize todas as regras atuais do `AGENTS.md` relacionadas a escopo, múltiplos repositórios, dependências, submódulos e arquivos externos.
    - Preserve o conteúdo válido, mas centralize e reforce a regra para eliminar formulações ambíguas, permissivas ou dispersas.
    - NÃO remover exceções já existentes sem comprovação de conflito; porém, nenhuma exceção pode autorizar edição cruzada de repositório sem ordem explícita associada àquele repositório.
    - Se houver qualquer norma atual que possa ser interpretada como autorização implícita para alterar repositórios relacionados, ela DEVE ser corrigida.

  - **Critérios de aceite**
    - Uma tarefa associada ao repositório `A` jamais pode modificar arquivos do repositório `B`, ainda que `B` esteja aberto, vinculado, importado, aninhado ou utilizado por `A`.
    - Submodules e repositórios aninhados permanecem fora do escopo de escrita.
    - A autorização de edição deriva exclusivamente da raiz Git e do `AGENTS.md` do repositório corrente.
    - Caminhos indiretos não podem contornar a fronteira.
    - Dependências externas podem ser inspecionadas, mas não modificadas.
    - Alteração externa somente pode ocorrer em tarefa/prompt próprio, associado explicitamente ao respectivo repositório.
    - A regra deve existir tanto em nível normativo quanto, quando tecnicamente possível, em salvaguardas programáticas.
    - Após esta correção, qualquer edição cruzada de repositório deve ser tratada como **violação crítica de governança**, não como mero desvio operacional.
