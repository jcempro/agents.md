# RCF — Criação e Reconstrução da Governança Operacional e dos Cenários

> **Princípio estruturante permanente:** no domínio operacional, `/AGENTS.md` e seus associados são obrigatórios, hierarquicamente prevalentes, determinísticos, rastreáveis, semanticamente íntegros e não regressivos. Implementação, documentação e extensão DEVEM obedecer aos mecanismos oficiais; Repositório Final NÃO DEVE omitir, relativizar, neutralizar, duplicar, substituir, renomear, reimplementar, contornar ou burlar contratos, nomenclaturas, hooks, gatilhos ou pontos oficiais, criar fluxo paralelo ou adaptar a norma para legitimar implementação divergente. Esta cláusula é índice interpretativo e NÃO substitui os contratos detalhados.

## Apendice - GESTAO DE CONTEXTO (RFC_COMPLIANT)

- O Agente DEVE avaliar compactação preventiva após marcos, persistência de decisões, substituição por fonte canônica, antes de operação extensa, sob redundância e ao alcançar 12 mensagens. Havendo ganho líquido e ausência de risco material, DEVE executar `/compact`; quando a plataforma não o expuser, `agent:compress` DEVE gerar projeção resumida e retomável da memória canônica, atualizar somente derivados autorizados e NÃO DEVE apagar FT dentro da retenção. Antes da compactação, objetivo, escopo, fonte ainda não normatizada, restrições, exceções, decisões, estados, alterações, falhas, verificações, contratos, riscos, bloqueios e próximo ponto DEVEM estar persistidos; conteúdo não persistido, operação indivisível, força normativa ou retomada determinística NÃO PODEM ser perdidos. Conteúdo já integralmente canônico DEVE ser substituído por referência confiável; compactação que exija reconstrução especulativa, suprima exceção ou custe mais do que economiza NÃO DEVE ocorrer.

## 0. Finalidade, escopo e autoridade

> Target Construtivo: `./src/`.
>
> Topologia obrigatória: raiz do repositório `./`; estrutura-fonte `./src/`; raiz do artefato publicado `./dist/`. `./` organiza e governa, `./src/` contém o produto-fonte e `./dist/` é a superfície distribuível; a raiz da aplicação é declarada pelo cenário e, em Web Page Like, coincide com `./dist/` e com `/` público. Esses domínios NÃO são equivalentes.

Este RCF define as regras de negócio necessárias para reconstruir, validar e evoluir a arquitetura normativa composta por:

- [objetivo] `AGENTS.md`: governança operacional global da IA ;
- [!objetivo] `agents.local.md`: extensão local opcional [referência];
- [!objetivo] `continue.ia` ou `continue.dev`: memória operacional oficial [referência];
- [objetivo] raiz operacional exclusiva `./.ia.rules/`, incluindo roteadores, módulos, runtime, configuração e manifestos;
- [secundário] RCFs globais/específicos, README e demais documentos subordinados <sup>1</sup>.

Seu objetivo não é reproduzir texto literal, mas preservar integralmente comportamento normativo, domínios, precedências, contratos, exceções, rastreabilidade e extensibilidade. Qualquer implementação conforme este RCF deve ser semanticamente equivalente ou superior, nunca mais fraca.

Se a edição/alteração a ser feita em AGENTS.md`ou cenários for alterar algo que já esteja rigoroso, bem incisiva ou mais rigorosa, incisiva e especializada do que a proposta atual de edição/alteração, não regreda, exceto se explicitamente solicitado e, neste caso, prefira adicionar ponto(s) de exceção se for possível, mantendo aderência ao minimo de tokens e a Regra de Ouro.

**<sup>1</sup> Secundário:** neste caso específico, o _target_ é o RCF localizado no root do próprio repositório, atualizar sua especificação conforme solicitações explícitas do desenvolvedor, preservando e consolidando todos os aprimoramentos já incorporados, vedando regressões. Sempre que modificações no **Target Construtivo** alterarem, ampliarem, restringirem ou impactarem regras de negócio, garantir seu espelhamento integral, consistente e sincronizado no próprio RCF.

### 0.0.1 Projeção RCF → fonte normativa

O RCF é a especificação de maior explicação do produto normativo em `./src/`: DEVE registrar finalidade, motivação, domínio, limites, exceções, alternativas rejeitadas, precedência, transição e critérios de validação suficientes para preservar interpretação e permitir correção posterior. `src/AGENTS.md` é a projeção operacional concisa dessa especificação: DEVE ser aderente, referenciável e não introduzir negócio autônomo. Solicitação de ajuste, aprimoramento, correção ou melhoria que toque regra, cenário, capacidade, script, hook, contrato, caminho, build, atualização ou validação DEVE seguir FTs e commits segregados em **RCF → fonte operacional em `src/` → código/scripts**, com validação e autorização humana entre norma concluída e cada implementação posterior. O RCF DEVE conservar o contexto adicional; AGENTS DEVE conservar a instrução executável correspondente; código DEVE materializar somente contrato já normatizado. Divergência bloqueia conclusão, build distribuível e atualização. A norma NÃO DEVE ser alterada para legitimar, absorver, preservar ou ocultar implementação divergente; conflito exige corrigir, refazer ou descartar a implementação, salvo solicitação explícita cujo objeto seja a própria evolução normativa e que cumpra o ciclo desta seção.

**referência**: a normatização correspondente deve ser feita, mas a criação do arquivo não.

### 0.0.2 Atualização declarativa, compatibilidade e limpeza

O produto-fonte reside em `./src/`; dentro dele, `./src/.ia.rules/` é a única árvore estrutural publicável. A montagem copia arquivos raiz explicitamente allowlisted e materializa todo conteúdo técnico sob `./dist/.ia.rules/`. `./dist/` e o ZIP NÃO PODEM conter outro diretório, árvore predecessora, teste, infraestrutura, configuração externa, código exclusivo de desenvolvimento ou referência de caminho ao layout expurgado. Fonte TypeScript distribuível declarada por §17 é contrato público versionado, não código exclusivo de desenvolvimento; DEVE permanecer manifestada e vinculada ao transpilado. O `package.json` distribuído deve reescrever comandos gerenciados para `.ia.rules/`; `release.json`, manifesto e validação devem rejeitar qualquer entrada fora dessa allowlist. A governança ativa do construtor permanece domínio separado e não é fonte de payload.

O pacote recebido de release estável validado ou da branch primária é a única autoridade para o conjunto gerenciado após uma atualização. O atualizador deve ler seu manifesto versionado antes de tocar o destino e construir o resultado exclusivamente a partir das entradas, caminhos, versões e hashes recebidos. Antes do staging, o atualizador deve preparar `.gitignore`, `package.json` e manifestos análogos quando indispensáveis para versionar a árvore gerenciada recebida; essa edição é parte do update, mas deve ser mínima, rastreável, delimitada por bloco quando textual, preservadora de regras locais, e limitada a material reutilizável aplicável ao consumidor. Hash de conteúdo textual deve usar UTF-8 com LF canônico, para que checkout CRLF e ZIP/main LF sejam semanticamente iguais sem ocultar alteração material. Após download/extracao únicos, o bootstrap instalado valida o runtime mínimo manifestado e passa bastão ao atualizador contido na release. Estado autenticado `agents-update-handoff/v1` fixa a fase posterior ao download, argumentos, source, hashes, releaseRoot-fonte e targetRoot-destino; o sucessor retoma sem rede ou repetição de fase, carrega código/dependências somente da release e aplica exclusivamente no target. HMAC efêmero, paths reais, entrypoint/hashes revalidados, arquivo restrito, espera do filho e limpeza posterior impedem troca de contexto. Falha fecha sem fallback ao atualizador antigo. Conteúdo preexistente não é uma segunda fonte: serve somente para reconhecer gestão anterior, converter formato, gerar backup local ignorado de divergência, planejar remoção de legado ou restaurar uma transação interrompida. Todo path recebido deve convergir mesmo sem lock ou com edição local; arquivo que existia localmente, mas não integra o manifesto recebido, não pode sobreviver por inércia como parte da governança gerenciada.

Preservação não significa manter tudo. `agents.local.md`, `.ia.rules/local/`, `.ia.rules/hooks/` e adaptadores formalmente declarados são extensões do consumidor e ficam fora da descoberta, lock, plano, limpeza e sobrescrita. Colisão, edição manual ou autoria ambígua em path declarado pelo manifesto não interrompe a atualização: o conteúdo divergente é reunido em ZIP nível máximo sob `./agents-governance-backups/YYYY-MM-DD/`, com instante, identidade e versão no nome, excluído de lock/commit, informado ao usuário para exclusão e substituído. A raiz é ignorada pelo Git. Atualizador e backup devem ser cross-platform e usar APIs portáveis do runtime, sem shell, separador, comando ou path exclusivo de sistema operacional. Arquivo fora do manifesto permanece intocado; só pode ser removido quando sua gestão anterior for comprovada por lock, marcador de migração ou catálogo legado fechado. Origem inválida, path inseguro ou falha de integridade bloqueiam antes de qualquer escrita. A troca deve preparar, validar e restaurar integralmente em falha; o lock novo é gravado por último.

Toda mudança de formato, caminho, notação, nome, recurso ou redução de estrutura deve declarar uma versão de linguagem/formato, marcador de variação e conversor da versão imediatamente anterior. Conversores são patrimônio de compatibilidade: permanecem versionados no histórico e distribuídos enquanto a origem puder encontrar estado anterior; a retirada do arquivo antigo exige equivalência ou pseudo-equivalência transitória explicitamente marcada. Um parser comum deve interpretar as versões declaradas e delegar apenas a conversão correspondente, evitando leitores paralelos e evolução estrutural implícita. Arquivos de configuração equivalentes DEVERIAM adotar o mesmo padrão, com descritor formal e parser único, pois a recomendação reduz acoplamento e permite limpeza segura sem transformar convenção local em obrigação absoluta.

### 0.0.3 Identidade operacional, construtor e consumidor

O **repositório de execução** é somente o repositório fisicamente aberto. Antes de decidir, a IA construtora ou consumidora DEVE verificar sua função; abertura física NÃO prova ser construtor, consumidor, upstream, origem canônica ou destino de issue. Neste produto, a evidência inicial classifica o repositório aberto como **construtor**, salvo declaração autoritativa contrária.

`./AGENTS.md` significa exclusivamente a norma localizada na raiz do repositório em que a operação ocorre. Homônimo fora da raiz NÃO recebe autoridade por nome, inclusive sob `src/`, `dist/` ou diretório de cenário; função normativa distinta exige declaração explícita da norma raiz, configuração autoritativa ou RCF aplicável. A exceção de localização exige declaração inequívoca.

No construtor, `./AGENTS.md` rege a IA construtora e permanece a norma vigente. `./src/AGENTS.md` é a aplicação-fonte distribuível: a FT construtiva PODE editá-la, testá-la, empacotá-la e distribuí-la, mas ela NÃO rege automaticamente a IA construtora, NÃO substitui a norma raiz, NÃO sincroniza `./AGENTS.md` e NÃO altera a operação vigente por inferência. A equivalência de categoria entre ambos NÃO cria identidade física, temporal, de versão ou autoridade. A atualização da norma raiz a partir da aplicação exige solicitação manual, explícita e específica do desenvolvedor.

No consumidor, o `./AGENTS.md` materializado pela distribuição é a norma vigente daquele consumidor; o construtor e o consumidor PODEM coincidir fisicamente somente em etapa declarada de dupla função. A fonte construtiva, a governança ativa, o artefato distribuído, o consumidor e o ambiente normativo DEVEM manter arquivos, contexto, autoridade, validação e registros segregados. Em dupla função, a IA consumidora NÃO DEVE abrir issue para a própria IA construtora: deve implementar dentro de sua autoridade ou solicitar decisão humana quando a alteração for invasiva ou material.

### 0.0.4 Atores e upstreams explícitos

**IA construtora** constrói, norma, testa, empacota, distribui e avalia contribuições da aplicação. **IA consumidora** opera sob a norma instalada, identifica lacuna, usa extensão autorizada, preserva evidência e prepara proposta. **Automação construtora** e **automação consumidora** somente executam o contrato do respectivo ator; mantenedor upstream decide aceitação, rejeição, adaptação ou postergação. Regra que diferencie ator DEVE nomeá-lo; “a IA” só é válido em obrigação inequivocamente comum ou subseção já delimitada.

**Upstream do consumidor** é a origem do projeto consumidor e PODE não ter relação com esta aplicação. **Upstream de AGENTS.md** é a fonte canônica que mantém, publica ou administra a aplicação; **upstream de dependência** é a origem da dependência consultada. “Upstream” isolado NÃO DEVE ser usado quando houver ambiguidade. Construtor, repositório de publicação e upstream de AGENTS.md PODEM coincidir ou divergir por migração, espelho, mantenedor, desenvolvimento privado ou sucessão; coincidência NÃO DEVE ser presumida.

### 0.0.5 Configuração, resolução e autonomia do consumidor

O consumidor DEVE resolver o upstream de AGENTS.md por configuração explícita → metadado oficial distribuído → origem declarada no artefato → redirecionamento/sucessor anunciado → destino canônico validado → candidato configurado. Um candidato, inclusive `jcempro/agents.md`, NÃO é prova de existência, oficialidade, atividade, manutenção, permissão de issue ou canonicidade. Fork, mirror, homônimo, upstream do consumidor ou destino de dependência NÃO DEVEM ser usados sem evidência de autoridade. Destino inválido, arquivado, somente leitura, migrado, sem issues ou inacessível exige preservação da proposta, evidências e impedimento para reavaliação, nunca descarte ou redirecionamento silencioso.

Neste produto, `jcempro/agents.md` é o sucessor canônico comprovado de `JeanCarloEM/agents.md`. A migração DEVE publicar no predecessor uma release-ponte com a mesma versão, ZIP e notas do sucessor; o ZIP DEVE conter metadado gerenciado que faça `agent:autoupdate` resolver o sucessor nas execuções seguintes sem escrita em `--check` ou `--dry-run`. Se o atualizador legado preservar adaptador/package antigos, a primeira execução efetiva do wrapper DEVE migrar somente aliases, `agentsGovernance` e `agentsUpstream` em commit exclusivo posterior ao commit do núcleo, publicar ambos e manter scripts alheios intactos. O lock DEVE registrar o repositório efetivamente resolvido e não constante histórica.

Checkout upstream, fork e consumidor comum DEVEM adotar como gerenciado todo path declarado pelo manifesto validado, mesmo sem lock. Divergência preexistente é preservada em backup local ignorado e substituída; a identidade do remoto não altera a autoridade do manifesto.

O consumidor PODE implementar solução local antes de propor quando o escopo estiver autorizado, o mecanismo for hook/extensão/adaptador permitido, a solução for removível, testável, desacoplada, útil sem aceitação futura e não alterar artefato gerenciado. Deve registrar problema, mecanismo, escopo, limites, dependências, testes, potencial de generalização e relação com proposta. `agents.local.md`, `.ia.rules/local/`, `.ia.rules/hooks/` e adaptador declarado são os únicos mecanismos locais para alterar comportamento gerenciado; patch oculto, cópia apresentada como oficial, reescrita pós-sincronização, fork local não rastreado ou alteração de gerado são vedados.

### 0.0.6 Avaliação e compartilhamento upstream

A IA consumidora DEVE reavaliar extensões locais ao criar/alterar hook, `agents.local.md`, cenário especializado, automação, correção normativa, padrão recorrente, incompatibilidade repetida, atualização, FT concluída ou solução útil a outros. Deve classificar: particularidade exclusiva; especialização de classe; melhoria geral; defeito; hook; ponto de extensão; cenário; automação; lacuna documental. Hook funcional NÃO encerra a análise.

Antes de preparar proposta, a IA consumidora e sua automação DEVEM identificar consumidor, upstream de AGENTS.md, eventual dupla função, papel exercido, norma/limitação, caso concreto e solução local; consultar versão e atualização; pesquisar issues, PRs, discussões, releases, FTs, commits, recusas e propostas equivalentes; comparar comportamento, causa, contexto e solução, nunca só texto; distinguir falha local, especialização, lacuna, ausência de hook, limitação, defeito e cenário compartilhável; estimar reutilização, impacto, segurança, compatibilidade, custo e manutenção; sanitizar evidências; então decidir nenhuma ação, atualização, documentação local, hook, proposta, ambos ou preservação para reavaliação. A decisão deve ser sucinta, rastreável e vinculada à evidência.

Proposta exige lacuna real, compatibilidade com princípios, benefício plausível superior à complexidade, classe ou cenário reutilizável identificável, abstração que preserve condição/problema/causa/limite/efeito/impacto e evidência suficiente. Rejeição potencial, incerteza moderada ou aplicabilidade limitada não a impede isoladamente. Não propor quando o caso for trivial, estético, uso/configuração local inválida, já integralmente coberto, duplicado ativo, recusa ainda válida sem evidência nova, excessivamente específico, não abstraível, sensível, sem evidência, desproporcional ou substituído por versão disponível. Recusa anterior só pode ser retomada por evidência, condição, caso, premissa, implementação ou escopo materialmente novo.

Issue usa somente seções aplicáveis: Contexto, Lacuna, Condições, Proposta, Reutilização, Referência sanitizada, Impacto e Aceite verificável. A automação nunca publica sem autorização explícita, destino validado, permissão, não duplicação, sanitização e conformidade; sem autorização gera artefato pronto para revisão. Após publicação registra consumidor, construtor identificado, upstream de AGENTS.md, destino, número/URL, data, versão, hash da evidência, cenário, FT, status e próxima revisão. Incorporação futura NÃO altera automaticamente norma, fonte, hook ou RCF: consumidor compara a distribuição com extensão e só remove hook após cobertura integral validada.

### 0.0.7 Integrações públicas fail-safe

Integração pública com GitHub, npm, IA opcional ou análogo DEVE usar cliente comum com configuração declarada, timeout, limite de tamanho, normalização, classificação de HTTP/rede/sintaxe/servidor, retry de leitura idempotente somente para falha transitória, cache com validade declarada, ordenação estável e saída por `to-ia`. Mutação externa tem concorrência um, autorização explícita e nenhum retry implícito. Credencial, token, dado pessoal, domínio privado, caminho irrelevante, nome confidencial, conteúdo de cliente ou identificador sensível NÃO DEVEM entrar em log, estado, cache, artefato ou proposta. Ausência de rede, credencial opcional ou serviço não bloqueia análise local: deve retornar indisponibilidade acionável, permitir dry-run/offline e preservar material para revisão. Resposta malformada, status não 2xx, rate limit, timeout, erro de sintaxe ou falha de servidor NÃO DEVEM ser convertidos em sucesso.

### 0.0.8 Inbox e decisão da IA construtora

O construtor DEVE tratar issue recebida como entrada externa não confiável. Automação construtora recebe somente evento GitHub `issues` declarado, normaliza número, URL, autor, idioma, título, corpo, labels, estado, atualização e hash; sanitiza antes de persistir; grava item e índice local em extensão/cache do construtor e, em CI efêmero, publica somente a inbox sanitizada como artefato. Chave idempotente é repositório+número+`updated_at`/hash; reprocessamento idêntico NÃO deve duplicar comentário, label, índice ou notificação. Payload, log e artefato NÃO incluem token, cabeçalho, segredo, dado pessoal desnecessário, caminho privado ou conteúdo fora do necessário à avaliação.

A inbox DEVE separar: recebido, aguardando evidência, recusado, não recomendado, recomendado, altamente recomendado e aprovado para implementação. A avaliação construtora DEVE conferir destino, integridade, duplicação, recusa anterior, substância, generalização, segurança, compatibilidade, custo, manutenção, evidência e possibilidade de hook/cenário antes de produzir grau e justificativa curta. IA opcional só recebe conteúdo sanitizado, não é requisito do fluxo e NÃO pode converter indicação em aceite definitivo. `agents:recommended` e `agents:highly-recommended` são somente pareceres técnicos. O aceite definitivo exige ação humana explícita do mantenedor, label exclusivo `agents:approved` e comentário inequívoco; sem ambos a issue NÃO está aprovada. A FT e a identidade canônica são criadas pela sincronização posterior, antes do desenvolvimento. Aceitar, adaptar, postergar, fechar, mesclar ou alterar a aplicação continua decisão humana do mantenedor upstream.

Automação construtora só PODE aplicar efeito remoto com autorização explícita do workflow/comando e credencial externa. Para `recusado` ou `não recomendado`, responde no idioma detectado, com fallback pt-BR, agradecimento e motivo curto; não rotula nem notifica colaboradores. Para `recomendado` ou `altamente recomendado`, aplica label compatível, comenta justificativa técnica curta e só menciona colaboradores quando configuração e opção explícitas o autorizarem. O comando humano de aprovação DEVE exigir papel construtor, `--authorize` e número da issue; aplicar idempotentemente `agents:approved` e o comentário `Aprovada para implementação.`, sem fechar a issue, remover pareceres, criar FT ou iniciar implementação automaticamente. Nenhuma avaliação ou IA aprova mudança ou publica release. Falha de leitura/indexação/avaliação deve produzir inbox pendente e saída acionável; falha de comentário/label deve registrar tentativa e nunca repetir sem nova evidência ou autorização.

Workflow de inbox DEVE usar permissões mínimas `contents: read` e `issues: write`, não executar em `pull_request` privilegiado, limitar concorrência por issue, validar evento antes de chamar script e reter artefato sanitizado por período declarado. Execução manual deve aceitar número de issue e dry-run; evento automático deve limitar-se a abertura, edição, reabertura ou rotulagem declaradas. O construtor DEVE conseguir reindexar e reavaliar localmente sem emitir efeito externo.

Issue aprovada DEVE possuir identidade canônica `github:<owner>/<repo>#<numero>`. Script local e workflow online DEVEM localizar todas as issues abertas que satisfaçam integralmente o contrato de aprovação, baixar e sanitizar seus dados, persistir a inbox e publicar a correlação antes de qualquer efeito de desenvolvimento. Solicitação que exija norma e código DEVE originar duas FTs distintas por identidade: uma `implementacao_normativa`, executável após o primeiro commit de criação/conciliação, e uma `implementacao_codigo`, inicialmente pendente, dependente da primeira e de autorização humana explícita posterior. Reprocessamento preserva IDs já publicados; FT genérica legada DEVE ser reclassificada sem renumeração e receber a FT complementar ausente. `agents:in-development` significa ciclo da issue ativo, não início de código; o comentário DEVE listar as duas FTs e seus estados. FT correlacionada concluída só integra uma versão quando `release=<versao>` for gravado antes da geração do artefato.

Encerramento de issue é efeito externo autorizado, explícito e idempotente. Antes dele, o agente DEVE resolver todas as FTs vinculadas por identidade formal, excluir menção apenas referencial e comprovar que requisitos, tarefas, critérios e validações de todo o escopo obrigatório estão concluídos, sem bloqueio ou pendência interna. Issue com múltiplas FTs só fecha quando todas as necessárias estiverem concluídas; FT vinculada a várias issues exige avaliação individual. Melhoria futura fora do escopo origina registro separado e não bloqueia. O comentário final DEVE identificar FTs, síntese, validações, commits/PRs/artefatos aplicáveis e impedimentos. Issue já fechada é sucesso idempotente; comentário/label/fechamento repetidos não duplicam efeito; falha parcial registra efeitos realizados e ponto exato de retomada. Permissão ausente, vínculo ambíguo, FT suspensa/cancelada, aceite incompleto ou pendência do escopo mantém a issue aberta com motivo. O release continua especialização em lote: após publicar `latest`, processa somente FTs concluídas vinculadas à versão, comenta, marca `agents:fixed`, fecha e registra `issue_state=corrigida`; falha bloqueia o commit final. Agendamento, evento e despacho manual DEVEM reutilizar o mesmo contrato e nunca inferir correlação por título, texto ou ordem.

### 0.0.9 Demanda do desenvolvedor e sequência norma-código

Implementação normativa converte solicitação em requisitos, contratos, restrições, exceções, compatibilidades, riscos e critérios de aceite nos RCFs aplicáveis; criação de FT, plano, comentário ou cópia da solicitação NÃO a substitui. Implementação de código cria ou altera fonte executável, script, configuração operacional, dependência, teste, build, workflow, infraestrutura, migração ou pacote. Solicitação comportamental DEVE seguir: capturar e classificar → identificar RCF → criar FTs normativa e de código correlacionadas → fazer commit exclusivo de criação/conciliação → executar e validar a FT normativa → remover entrada transitória coberta → obter autorização humana explícita para código → executar FT técnica → validar contra RCF. Pedido somente normativo encerra antes do código; intenção ambígua não autoriza código; pedido explícito de ambos ainda respeita gates superiores. Alteração estritamente mecânica sem efeito comportamental, contratual ou interpretativo PODE usar fluxo reduzido registrado.

Quando a FT concisa não preservar material suficiente, a solicitação íntegra necessária DEVE residir transitoriamente em `./.ia.rules/state/requests/<FT-ID>.md`, com FT, captura ISO, origem, hash, RCF afetado, estado, condição de remoção e complementos ordenados. Segredo, dado pessoal desnecessário e conteúdo externo supérfluo são vedados; política local decide versionamento conforme sensibilidade e continuidade. Complemento anterior à conclusão normativa atualiza arquivo, FT e conciliação; conflito material aplica a versão humana mais recente apenas nos pontos incompatíveis e preserva o restante. Após cobertura normativa validada e rastreabilidade permanente por FT, RCF e commit, a cópia DEVE ser removida antes da conclusão; lacuna, decisão, falha ou dependência ativa justifica retenção com motivo e próxima ação. Release NÃO inclui solicitações transitórias.

`TODO.ia.md` é lista de demandas do desenvolvedor, não issue externa, FT, RCF, autorização ou fila executável. Sua localização canônica é `./.ia.rules/state/TODO.ia.md`; exemplar de raiz é somente entrada legada/transitória declarada e deve convergir. Cada item possui chave estável, hash, criação ISO, prioridade, estado, vínculo de FT/RCF e histórico mínimo. Delta de hash bloqueia somente etapa técnica afetada ou cuja compatibilidade não possa ser comprovada, nunca congela trabalho independente por conveniência. Triagem distingue item novo, já vinculado, duplicado, conflito, complemento, rejeitado, adiado e concluído; aceitações criam/atualizam primeiro a FT normativa, sincronizam RCF/contexto e conciliam cirurgicamente FTs impactadas. Mutação de status é determinística e preserva conteúdo até normatização; item concluído não permanece como fonte concorrente.

Urgência NÃO elimina norma. Exceção emergencial exige risco da demora superior, escopo delimitado, autorização, critérios de aceite e tarefa obrigatória de complementação; não vira fluxo ordinário. Estimativa inicial DEVERIA usar etapas, complexidade, dependências, riscos, incertezas e confiança, sem falsa garantia cronológica. Compactação substitui texto integral no contexto somente após preservar FT, path, resumo, estado e próxima ação; depois da normatização, referencia o RCF.

### 0.0.10 Inicialização normativa de consumidores

`INIT-REPO.md` é artefato textual de bootstrap excepcional, subordinado a `AGENTS.md`, para iniciar, adequar, migrar, auditar ou reconstruir documentação normativa de consumidor novo ou existente. PODE permanecer na raiz do release por descoberta direta, mas não é norma operacional permanente nem autoriza implementação. Deve ler AGENTS/associados, requisito específico e estado real; criar FTs normativa e de código; construir ou refatorar RCF e README preservando regra válida; validar somente a etapa documental; revisar diff; commitar, enviar e comprovar Git; compactar contexto; encerrar com código bloqueado até nova autorização explícita. Ausência de RCF/README/código ou tecnologia específica não altera o contrato.

O arquivo DEVE conter blocos de precedência, objetivo, eficiência contextual, ordem, segregação, entrada transitória, RCF, README, indicadores reais, autoria/licença não inferidas, FTs, validação, commit/push, compactação, proibição de código, continuidade condicionada, saída e seção final `# Prompt`. O prompt específico é integralmente lido, subordinado, removido ou substituído após materialização e nunca permanece placeholder no consumidor. Reconstrução usa RCF, módulos normativos e metadados autorizados; evolução incompatível exige versão e migração. A futura implementação DEVE provar presença na raiz de todos os canais declarados, integridade estrutural, encoding, links, licença, ausência de requisito residual e bloqueio técnico; a existência atual de `src/INIT-REPO.md` não comprova distribuição ou aceite.

### 0.0.11 Verificação de atualização de aplicações distribuídas

Capacidade aplicacional opt-in, distinta de `update:agents`, detecta versão mais recente sem impor rede, polling, UI ou ação a projeto que não a declare no RCF/configuração. Papéis plugáveis: fornecedor de versão, `provider`, `version-source`, `comparison-strategy`, `cache-adapter`, `scheduler`, verificador, política, `notification-adapter`, `update-action`, `event-observer`, `interceptor` e `factory`. Cada componente declara identidade, versão contratual, requisitos/capacidades, validação, execução, eventos e descarte; provider HTTP, release, branch, tag, API, manifesto ou customizado entra sem alterar o núcleo.

Ciclo: obter identidade local imutável → consultar origem sob política → limitar/validar resposta → comparar por estratégia declarada → decidir estado → persistir cache permitido → emitir evento estruturado → delegar apresentação → executar ação somente se autorizada. Estados mínimos: `atualizada`, `atualizacao_disponivel`, `origem_indisponivel`, `resposta_invalida`, `offline`, `politica_bloqueada` e `erro_controlado`. Configuração versionada central define provider/origem, identidade, comparação, timeout, tamanho, frequência/polling, retry/backoff, cache/TTL, offline, observabilidade, notificações e ações. Consulta idempotente PODE retentar falha transitória; ação mutável não tem retry implícito. Falha externa degrada apenas a capacidade, nunca a função principal. Segredo/dado sensível não entra em artefato, cache, log, telemetria ou UI; detecção, notificação e atualização permanecem separadas; automático exige política e autorização inequívocas. Dry-run/offline não acessa rede nem escreve. Aceite técnico futuro exige parser/schema compartilhado, contratos versionados, testes de todos os estados e ao menos dois adaptadores arquiteturalmente distintos.

### 0.0.12 Integração gerenciada sob `.ia.rules`

CONTRADIÇÃO DETECTADA: issue `github:jcempro/agents.md#6` propõe `.ia.gules` vs `AGENTS.md` §0.14 e RCF §0.0.5 definem `.ia.rules` — Aplicando a norma superior vigente e preservando a intenção de isolamento, propriedade, templates, migração e atualização segura. `.ia.gules` NÃO é alias, destino novo ou fonte concorrente; eventual ocorrência é entrada experimental desconhecida, preservada até classificação humana/conversor autorizado.

`./.ia.rules/` reserva o namespace gerenciado, mas não presume propriedade irrestrita: manifesto distingue gerenciado, extensão local declarada, desconhecido, legado e conflito. Estrutura PODE conter `config`, `docs`, `hooks`, `manifests`, `migrations`, `schemas`, `scripts`, `state` e `templates`, cada qual com finalidade, perfil de distribuição, atualização e remoção. `AGENTS.md` permanece na raiz; `INIT-REPO.md` e exigência externa são exceções com finalidade, autoridade, permanência e remoção declaradas. Build publica somente allowlist do manifesto, nunca todo o ambiente do construtor.

Templates são completos, fragmentos, exemplos, regiões gerenciadas ou patches estruturais classificados por ecossistema e aplicados somente quando stack, arquivo, precedência, escopo, autorização e compatibilidade forem comprovados. Texto comentável PODE usar região com ID, versão, origem e delimitadores estáveis; atualizador altera só o interior, preserva exterior, detecta ausência/duplicação/malformação/edição e produz diff/conflito controlado. Estruturado usa parser, schema e merge semântico determinístico, preservando campos desconhecidos e locais; concatenação textual é vedada. Manifesto de integração declara destino, método, precondição, conflito, validação, rollback, propriedade e remoção.

Instalação/atualização verifica `.gitignore`, exclude local/global, empacotador e sincronizador para impedir omissão de AGENTS e `.ia.rules`, corrigindo somente regra relacionada com autorização. Operação resolve raiz real, limita escrita, rejeita traversal/symlink de escape, não instala dependência implicitamente, simula, faz backup, escreve atomicamente, valida e reverte integralmente em falha. Remoção atinge somente gestão comprovada e preserva extensão/conteúdo desconhecido. Migração de árvore predecessora ou experimental segue descritor/versionamento externo, atualização de referências, validação e rollback; coexistência autoritativa termina antes da operação corrente. Pacote/release deve provar inclusão de dotfiles declarados e exclusão de interno, cache, estado sensível e template inaplicável.

### 0.0.13 Registro de pacote no release

Quando RCF/configuração declarar registro de pacote, o cenário Release compõe capacidade `package-registry` sem tornar NPM ou fornecedor específico dependência do núcleo. Contrato tipado inclui `prepare-package` (manifesto, versão, allowlist, identidade e metadado imutável), `verify-package` (mesmo arquivo/digest validado), `publish-package` (única mutação do mesmo pacote) e `confirm-package` (consulta idempotente de versão, digest e canal/dist-tag); `published` continua observação do release completo. Adaptador declara registro, acesso, autenticação externa, identidade OIDC quando aplicável, comandos, efeitos e confirmação; segredo/OTP/token não persiste. Bootstrap de identidade ou autenticação fora de confiança federada exige exceção local e autorização explícita.

Ordem com capacidade ativa: versão/gatilho → suíte/hook `prepare` → empacotamento único → validação/hook `verify` → `prepare-package` → `verify-package` → `publish-package` → `confirm-package` → tag → GitHub Release/asset → hook `published` → limpeza/convergência. Falha bloqueia dependentes e preserva retomada; publicação mutável não retenta implicitamente, enquanto confirmação idempotente segue política de leitura. Repositório sem declaração retorna `n/a` sem carregar adapter, rede, permissão ou custo. `publish`/`agent:publish` continuam exclusivos de conteúdo; comando externo do fornecedor não altera essa taxonomia. Aceite técnico futuro cobre mesmo tarball, ordem registro antes do release externo, falha bloqueante, dry-run sem rede/escrita, ausência de retry mutável e adaptador de referência sem acoplamento do núcleo.

### 0.0 Topologia, segregação e precedência arquitetural

A raiz do repositório contém exclusivamente governança ativa, documentação, manifesto, automação e infraestrutura transversal. Implementação, código-fonte e recursos internos DEVEM permanecer em `./src/` ou estrutura-fonte equivalente; essa estrutura NÃO é a raiz da aplicação. Exceção exige imposição verificável de framework, convenção obrigatória do ecossistema, gerador ou compilador. Conveniência NÃO constitui exceção. `./dist/` contém somente o artefato distribuível/publicado e NÃO DEVE depender de `./src/` em caminho, manifesto ou runtime. Em cenário Web Page Like, raiz da aplicação e `./dist/`/saída declarada correspondem ao `/` público percebido pelo usuário e NÃO DEVEM expor fonte interna. AGENTS possui precedência operacional: RCF somente especializa o produto sem deslocar a governança ativa, inverter os roots ou reduzir esta segregação. Neste repositório produtor, `./src/AGENTS.md` e associados são a fonte construtiva da governança distribuível, não a governança ativa desta execução; sua manutenção é autorizada pela FT do produto. Após materialização no consumidor, tornam-se núcleo gerenciado: não aceitam edição local para alterar comportamento, que DEVE usar `agents.local.md`, `./.ia.rules/local/`, `./.ia.rules/hooks/` ou adaptador subordinado e preservável. O espelho local entre governança ativa e fonte distribuível somente valida o pacote produzido; NÃO altera consumidor e NÃO participa do `agents:update` de outro repositório.

Excepcionalmente no construtor, quando defeito cíclico tecnicamente justificado impedir o caminho canônico de corrigir, construir ou materializar o produto, solicitação humana explícita PODE autorizar correção mínima no núcleo gerenciado ativo. A FT DEVE registrar bloqueio, justificativa, arquivos e limite; aplicar a autoridade definitiva em `./src/`, sincronizar implementação/contrato, regenerar derivados e comprovar validação antes do fechamento. A exceção NÃO alcança consumidor, não autoriza especialização local e não decorre de conveniência, urgência ou mera dificuldade.

### 0.0.5 Raiz operacional canônica e rastreabilidade interna

`./.ia.rules/` é oficialmente a raiz interna canônica e SSOT operacional do ecossistema governado por AGENTS, encerrando a árvore predecessora como destino ativo. Deve concentrar regras auxiliares, contratos, configurações, scripts, templates, manifestos, mapas, metadados, cenários, automações e artefatos auxiliares. Novo projeto e novo conteúdo usam exclusivamente essa raiz; arquivo equivalente disperso é não conforme. `./.ia.rules/` permanece reconhecível somente como legado de entrada durante migração versionada, nunca como destino de nova regra ou capacidade.

Cada release mantém sob `./.ia.rules/` uma versão atual explícita, um manifesto versionado exaustivo com arquivos, tipos, destinos, hashes e perfil de distribuição e uma projeção sanitizada e rastreável do `package.json`. O manifesto é a autoridade para auditoria, comparação, atualização e limpeza; varredura apenas diagnostica ou converte legado. O mapa local de hooks, extensões e adaptadores é separado do manifesto gerenciado, declara namespaces preserváveis e deve ser atualizado pelo repositório consumidor.

Cada release também mantém `./.ia.rules/distribution/distribution-map-<versao>.json`, referenciado por `release.json`, com classificação de arquivos efetivos, potenciais, obrigatórios, opcionais, condicionais, gerados e obsoletos; cada entrada declara path seguro, tipo, destino, hash/tamanho quando aplicável, propriedade e políticas de preservação, atualização e remoção. Ausência, JSON inválido ou semântica inválida no mapa da release recebida bloqueiam antes de escrita. Ausência ou corrupção do mapa local anterior não bloqueia convergência para release válida: o atualizador registra diagnóstico, ignora o mapa antigo e executa transição inicial conservadora, preservando extensões e autoria indeterminada.

Limpeza compara o estado real ao manifesto vigente e só remove path cuja gestão ou condição de legado esteja comprovada. Deve ser determinística, hookável, auditável, transacional e reversível em falha; autoria ou gestão indeterminada bloqueia remoção. Ambiente construtor pode conter ferramentas internas, enquanto o pacote consumidor conserva somente contratos públicos, configuração mínima, runtime necessário, scripts reutilizáveis e respectivas fontes distribuíveis exigidas por §17. Seu `package.json` exclui desenvolvimento exclusivo do construtor, experimento, automação interna, dependência de processo interno e metadado irrelevante.

A migração da árvore predecessora para `./.ia.rules/` exige descritor de formato, marcador, conversor permanente da versão anterior, backup reversível, atualização de referências e validação integral antes da ativação atômica. Durante janela declarada, ferramentas podem ler ambas; escrita nova e estado final usam somente `./.ia.rules/`. Após conversão válida, coexistência ativa é proibida e o legado gerenciado é limpo conforme manifesto. Aceite comprova estrutura, versão, manifesto, hashes, pacote sanitizado, preservação das extensões, limpeza simulada e ausência de arquivo gerenciado excedente ou divergente.

### 0.1 Regra de ouro ao criar, editar e refatorar

Maximizar a informação por caractere mediante normas coesas, baixo acoplamento, mínima redundância, máxima reutilização e microtextos reutilizáveis, referenciáveis e de alta densidade informacional; eliminar introduções extensas, floreios, preenchimentos, repetições e explicações óbvias, preservando integralmente regras, restrições, exceções, prioridades, precedências, condicionantes, dependências, precisão, profundidade, contexto, rastreabilidade, nuances interpretativas, exemplos, analogias, contraexemplos e referências úteis. Priorizar referências internas e microexplicações sempre que reduzirem tokens sem perda semântica, sobretudo em documentos destinados a máquinas ou IAs. **Concisão reduz somente a forma, nunca a substância; toda redução que suprima significado, rigor ou rastreabilidade é degradação, não otimização.**

#### 0.1.1 Resolução seletiva e auditoria de contexto

Referência a microconceito DEVE resolver somente os identificadores citados e suas dependências explícitas; não autoriza carregar por proximidade outro identificador do mesmo arquivo. Arquivo agregador DEVE conter somente índice, predicado, dependência e path estável. Roteador de cenário DEVE ser carregado antes dos módulos, avaliar predicados apenas por evidência do RCF/configuração/entrega e formar o fecho transitivo de dependências em ordem declarada. Módulo cujo predicado seja falso NÃO DEVE ser aberto; predicado sem evidência, dependência circular/ausente ou referência sem seção/path DEVE bloquear aplicação, nunca ser tratado como verdadeiro por analogia.

A fonte PODE projetar §§0.0.3–0.0.5 como `MN-ROLE`, a fronteira de núcleo/extensão de §§0.0.2 e 0.0.5 como `MN-EXT`, e o núcleo de cenários do §4 como `MN-SCEN`; esses identificadores não criam regra, apenas centralizam sua projeção operacional.

Entrada bruta acima de 50 linhas, 8192 bytes ou 2 arquivos constitui volume relevante para preparo. Refatoração de contexto DEVE registrar baseline e resultado por arquivo e rota aplicável: bytes UTF-8, linhas, métrica de tokens declarada e dependências carregadas. Comparação só é válida com o mesmo método; proxy lexical DEVE ser identificado como proxy, nunca como tokenizador de modelo. Redução global NÃO compensa perda local: modalidade, dono, condição, exceção, valor, ordem e aceite DEVEM permanecer rastreáveis antes e depois.

### 0.2 Perfil editorial

Aplicar **75% máquina/IA; 25% humano**:

- sintaxe normativa, concisão, rigor, incisividade determinística, modularidade e indexação;
- contexto humano mínimo suficiente para impedir inferência incorreta;
- referências internas preferidas à repetição;
- exemplos somente quando delimitarem semântica, exceção ou contrato;
- nenhuma regra pode ser omitida por parecer secundária.

### 0.3 Critério de equivalência

Uma reconstrução é válida somente se:

1. mantiver todos os efeitos normativos;
2. não alterar domínio ou titularidade das regras;
3. não transformar obrigação em recomendação;
4. não transformar exceção em padrão;
5. não deslocar particularidade local ao núcleo global;
6. não enfraquecer portabilidade, rastreabilidade ou capacidade de retomada;
7. preservar expansão por novos cenários sem refatoração estrutural do `AGENTS.md`.

---

## 1. Compartimentação normativa

### 1.1 Domínio da IA

Pertencem ao `AGENTS.md` global regras que governem exclusivamente como a IA deve ler, raciocinar, planejar, registrar, alterar, validar, versionar, retomar e entregar trabalho, inclusive:

- nomenclatura e estrutura de `AGENTS.md`, `agents.local.md`, `continue.ia` e `continue.dev`;
- paths e relações entre artefatos normativos da própria IA;
- cache, mapa de arquivos úteis, invalidação e prevenção de reprocessamento;
- Frentes de Trabalho, etapas, tarefas, histórico e retomada;
- proporções editoriais por classe documental;
- fluxo de branch, commit, push e merge;
- padrões de análise, alteração, ambiguidade, bugs e saída;
- arquitetura de cenários e carregamento de seus arquivos.

Essas regras podem e devem ser explícitas, concretas e determinísticas, pois não constituem regras de negócio do projeto/reposiório.

**IMPORTANTE:** Distinguir rigorosamente o domínio normativo de IA do repositório do domínio de negócio. `./AGENTS.md`, `./.ia.rules/` e demais importações, pertencem ao repositório enquanto projeto e constituem as únicas normas, diretrizes e metadados válidos para orientar a atuação da IA. Já `./src/AGENTS.md`, `./src/.ia.rules/` e demais importações, aninhadadas sob `src`, `dist` ou outra estrutura equivalente, pertencem ao objeto de negócio produzido ou mantido pelo repositório e, embora possam possuir estrutura, nomenclatura ou conteúdo semelhantes, devem ser tratados exclusivamente como artefatos do projeto. A IA poderá lê-los, validá-los, compará-los, gerar, editar, refatorar ou manter seu conteúdo, porém jamais deverá interpretá-los como normas aplicáveis à sua própria atuação, incorporá-los ao seu contexto normativo, alterar seu comportamento com base neles ou permitir que influenciem, substituam, complementem ou contaminem as diretrizes vigentes do domínio normativo, salvo determinação explícita em sentido contrário.

### 1.2 Domínio do projeto

Pertencem ao RCF:

- arquitetura, comportamento, negócio, contratos, requisitos e validações do projeto;
- tecnologias, módulos, páginas, workflows, integrações, limites, paths, URLs, valores, UX e decisões exclusivas;
- qualquer exceção ou especialização local não replicável.

O `AGENTS.md` pode referir-se abstratamente a esses conceitos, mas não criá-los, particularizá-los ou substituí-los.

### 1.3 Domínio dos cenários

Arquivos de cenário contêm regras reutilizáveis de uma categoria técnica/funcional amplamente reproduzível. Podem ser concretos quanto às convenções oficiais desse cenário — comandos, portas, ferramentas preferenciais, capacidades, UX, build ou publicação — desde que:

- sejam aplicáveis a múltiplos repositórios da categoria;
- permaneçam subordinados ao RCF;
- permitam alternativa comprovadamente superior;
- não incorporem particularidade exclusiva de um projeto.

Valor numérico, rótulo, dimensão, limite de densidade ou detalhe visual só DEVE integrar cenário reutilizável quando representar contrato necessário e verificável em múltiplos repositórios. Medida de viewport, quantidade de cards, ordem visual, espaçamento, recuo, título editorial e limiar de compactação que variem por público, template ou identidade DEVEM ser parâmetros declarados pelo RCF específico, token de design ou configuração do projeto. A abstração só é válida quando preserva critério observável, dono do parâmetro e validação; não autoriza suprimir requisito material.

### 1.4 Extensão local

`agents.local.md`, quando existir, contém apenas particularidades operacionais não replicáveis do repositório. No consumidor, é a via mandatória para especializar comportamento de governança gerenciada, com `./.ia.rules/local/`, `./.ia.rules/hooks/` ou adaptador declarado; essas extensões são carregadas subordinadamente e preservadas pela atualização. Não pode receber regra potencialmente global, substituir RCF ou alterar diretamente `AGENTS.md`/associado gerenciado.

### 1.5 Precedência

Após instruções superiores da plataforma:

1. **Governança operacional:** `AGENTS.md` → RCF global → RCF específico → README → memória operacional → demais documentos.
2. **Projeto/negócio:** RCF global → RCF específico → README → memória operacional → demais documentos; `AGENTS.md` permanece obrigatório quanto ao método.
3. **Regra local:** `agents.local.md`, limitada pelo `AGENTS.md` e RCFs.

Regra específica prevalece sobre geral somente em seu escopo e sem contrariar norma superior.

### 1.6 Composição de cenários e extensões executáveis

Especialização DEVE usar composição antes de herança. Herança única PODE existir quando contrato, estado, ciclo de vida e substituibilidade forem estáveis; herança múltipla NÃO DEVE ser usada para agregar capacidades de borda. `Web Page Like` permanece cenário de consumo final, porém DEVE compor capacidades Web independentes — interface de navegador, saída estática, hospedagem, publicação editorial e outras aplicáveis — em ordem declarada, sem assumir Jekyll, GitHub Pages, gerador, hospedagem ou VCS exclusivos. Capacidade estática, hospedagem GitHub Pages, Jekyll e Git de sites DEVEM poder existir isoladamente, ser combinadas quando compatíveis e validar a combinação real.

Núcleo reutilizável fica em `./.ia.rules/core/`; cenário fica em `./.ia.rules/scenarios/<domínio>/<nome>/`, com `scenario.md`, `scripts/`, recursos e contratos somente daquele escopo. Script transversal fica em `core/runtime/scripts/`; migração versionada fica em `core/update/migrations/`; script de cenário fica no diretório `scripts/` do cenário. Build, teste e distribuição DEVEM coletar scripts gerenciados somente dessas raízes declaradas; cache, temporário, hook, extensão e especialização local NÃO DEVEM integrar artefato ou validação do núcleo. Runtime CommonJS distribuído DEVE levar fronteira de módulo própria e não herdar `type` incompatível do consumidor. Repositório consumidor especializa somente por `agents.local.md`, `./.ia.rules/local/`, `./.ia.rules/hooks/` ou adaptador declarado, nunca movendo comportamento local ao núcleo distribuído.

Capacidade ou script plugável DEVE declarar identidade, tipo, versão, dependências requeridas/oferecidas, eventos, validação, execução e descarte quando aplicável. Interface deve validar método, variável e versão antes do uso; estado NÃO DEVE ser exposto mutável, devendo usar getter imutável e setter/ação validada, auditável e autorizada. Camada intermediária só PODE fazer passthrough quando observar entrada, saída, alteração e evento. Eventos/hooks DEVEM alcançar núcleo, capacidades, cenário e adaptador final; camada intermediária NÃO DEVE isolá-los, absorvê-los ou renomeá-los sem contrato. Falha DEVE identificar camada, evento e contrato, sem impedir a observação das demais camadas quando isso não violar segurança ou consistência.

---

## 2. Arquitetura documental obrigatória

### 2.1 Artefatos

A arquitetura deve suportar:

```text
AGENTS.md
├── agents.local.md              # opcional; particularidades locais
├── continue.ia | continue.dev   # exatamente um arquivo canônico
└── .ia.rules/
    ├── core/                     # conceitos, contratos, atualização e runtime transversal
    │   ├── contracts.md
    │   ├── concepts/microconceitos.md
    │   └── runtime/scripts/
    ├── meta/                     # contextos de script, resolvidos por index.json
    └── scenarios/<domínio>/<nome>/
        ├── scenario.md           # norma atômica ou roteador estável
        ├── capabilities/         # módulos condicionais, quando multifuncional
        ├── scripts/
        ├── assets/
        └── tests/
```

A localização física dos cenários pode variar por decisão normativa da IA, desde que:

- seja resolvível relativamente ao `AGENTS.md`;
- permaneça estável e indexada;
- não exija varredura cega;
- cada arquivo seja carregável isoladamente;
- o índice do item 17 permaneça fonte de descoberta.

### 2.2 Modularidade

- `AGENTS.md`: pequeno, global, portável, sem regras específicas de cenário.
- Item 17: núcleo comum, organização, carregamento e índice.
- Arquivo de cenário: conteúdo específico integral.
- RCF: especificidade do projeto.
- Extensão local: particularidade operacional do repositório.
- Memória operacional: estado transitório, decisões, progresso e histórico de execução.

Diretório de cenário DEVE ser a unidade coesa de distribuição: sua norma, scripts, testes, assets e metadados ficam aninhados nele, salvo componente comprovadamente transversal promovido a `core/`. Índice DEVE mapear caminho, tipo, dependências e camada; build DEVE preservar a relação sem vazar `src/`; atualizador DEVE descobrir recursivamente conteúdo gerenciado, preservar extensões locais e substituir colisão em path manifestado após backup ignorado.

Arquivo com mais de um predicado independente DEVE tornar-se roteador e módulos atômicos no próprio diretório. O roteador conserva path público, define identificador, aplicabilidade, ordem, módulos e dependências, mas NÃO DEVE repetir suas regras. Módulo declara um único predicado observável, escopo, dependências e conteúdo integral; fragmentação por tamanho sem fronteira semântica é vedada.

### 2.3 Proibição de duplicação

Regra deve existir em um único nível:

- multicenário comprovada → item 17;
- cenário específico reutilizável → arquivo de cenário;
- projeto específico → RCF;
- operação local específica → `agents.local.md`;
- estado de execução → memória operacional.

Repetição só é admitida como microresumo com referência explícita à autoridade original. Referência DEVE resolver path e identificador/seção existentes; nome legado, destino implícito, path relativo ambíguo ou referência circular são não conformidade.

---

## 3. Contrato do `AGENTS.md` global

A reconstrução deve preservar a numeração e o propósito das seções globais. Redação pode ser otimizada; conteúdo normativo não.

### 3.1 Seção 0 — Finalidade, autoridade e portabilidade

Deve estabelecer:

- governança operacional da IA/Codex, sem alterar instruções intrínsecas da plataforma;
- reutilização entre repositórios sem adaptação;
- proibição de URLs, paths físicos, nomes próprios e regras exclusivas de projeto no núcleo global;
- permissão de conceitos universais e artefatos do próprio domínio da IA;
- separação entre AGENTS, RCF e extensão local;
- imutabilidade, no consumidor, do AGENTS e associado gerenciado para especialização; uso obrigatório de extensão local preservável e subordinada;
- bloqueio de manutenção de terceiros, salvo incorporação definitiva ao repositório.

### 3.2 Seção 1 — Domínios e precedência

Deve normatizar integralmente §1 deste RCF e impedir:

- RCF reescrever conteúdo intrínseco do AGENTS;
- AGENTS criar regras de negócio;
- extensão local ganhar precedência autônoma;
- conflito transversal ser resolvido por conveniência.

### 3.3 Seção 2 — Edição normativa

Deve conter:

- regra de ouro;
- perfis editoriais:
  - AGENTS, memória e associados: **90% máquina / 10% humano**;
  - RCF: **75% máquina / 25% humano**;
  - README/documentação análoga: **50% máquina / 50% humano**;
- preservação de alterações manuais;
- marcação de IA limitada a conteúdo editorial, documentação humana ou FT `Negócio` submetida a transformação semântica;
- exclusão de AGENTS, RCF, memória, código, configurações, manifestos, workflows e artefatos técnicos, salvo RCF expresso;
- dispensa de marcação para correções exclusivamente ortográficas, gramaticais, tipográficas, de links ou metadados.

### 3.4 Seção 3 — Mapa de arquivos, leitura e cache

Deve exigir:

- mapa ultra-sucinto de arquivos úteis;
- exclusão de build, transpilados, temporários, intermediários e lixo;
- leitura somente de arquivo ausente, alterado ou indispensável;
- leitura parcial do necessário;
- proibição de reprocessamento sem mudança observável, evidência nova, atualização ou ganho informacional;
- persistência de normas, FTs, decisões, falhas, resultados e estado de arquivos;
- execução completa quando o cache for insuficiente.

### 3.5 Seção 4 — Modelo orientado por estado

Ciclo obrigatório:

```text
Solicitação → intenção → FTs normativa/código → commit de criação/conciliação
→ RCF → validação normativa → autorização → código → validação técnica
→ atualização contínua da memória → commits/push → próxima etapa
```

Antes de implementar: identificar intenção; distinguir norma de código; localizar/criar FTs correlacionadas; classificar continuação, ampliação, dependência ou nova FT; identificar etapa/tarefa; atualizar planejamento; executar do estado registrado. Criação de FT não é normatização; código permanece bloqueado enquanto norma, validação ou autorização estiverem pendentes.

### 3.6 Seção 5 — Frentes de Trabalho

Cada unidade executável pertence a exatamente uma FT; várias podem coexistir. Solicitação comportamental com norma e código produz exatamente uma FT de cada tipo, correlacionadas à mesma origem, sem compartilhar execução ou estado. Pedido exclusivamente normativo dispensa FT de código somente quando nenhum trabalho funcional futuro fizer parte do escopo; código já previsto exige registro pendente mesmo sem autorização.

Campos mínimos:

- id permanente `FT-NNN`;
- nome, objetivo, prioridade, status;
- escopo `Técnico` ou `Negócio`;
- `criado_em` imutável em ISO 8601/RFC 3339 com `Z` ou deslocamento explícito, início operacional, última atualização e conclusão;
- etapas, tarefas e estado de retomada.

`criado_em` é a identidade temporal cronologicamente ordenável da FT; colisão usa o ID permanente como desempate. O formato legado sem fuso permanece interpretável segundo o fuso historicamente declarado pelo repositório, preserva ID e instante e DEVE receber projeção ISO quando a FT for reaberta, conciliada ou migrada, sem renumeração destrutiva. Atualização, reabertura, suspensão ou conclusão NÃO alteram `criado_em`.

Escopos:

- **Técnico/The Engine:** constrói ou corrige mecanismo, estrutura ou sistema.
- **Negócio/The Substance:** produz conteúdo/informação que trafega na estrutura.

FT pode ser segregada em subarquivo versionado quando reduzir contexto; padrões do `.gitignore` não podem ocultá-la.

Criação, identificação, vínculo e conciliação inicial formam commit exclusivo antes da execução normativa; somente correção mínima do mecanismo temporal pode acompanhá-lo. A FT normativa incorpora e valida o RCF; a FT de código referencia suas seções e permanece não iniciada até autorização humana explícita. Precedência temporal entre FTs incide apenas sobre pontos materialmente incompatíveis: primeiro conciliar como complemento/especialização/refinamento, preservar o compatível e registrar conflito, razão, regra nova prevalente e conteúdo anterior conservado.

### 3.7 Seção 6 — Planejamento, etapas e tarefas

Obrigatório:

- planejamento antes da implementação;
- etapas com nome, `X/N`, objetivo e dependências;
- tarefas como granularidade mínima de retomada;
- planejamento dinâmico, com atualização imediata na memória;
- itens concluídos preservados enquanto a FT estiver ativa;
- compressão médio-agressiva sem omissão após conclusão;
- histórico por exatamente 15 dias; remoção integral após esse prazo;
- etapa termina em estado funcional;
- tarefa preferencialmente funcional;
- conclusão: validar → atualizar memória → commit → push → próximo item;
- não acumular etapas;
- tarefa mínima pode consolidar commit na etapa;
- alteração moderada: mínimo 2 commits; agressiva: mínimo 4.

### 3.8 Seção 7 — Memória operacional

Exatamente um arquivo canônico: `continue.ia` ou `continue.dev`; `continua.ia` é referência legada equivalente.

Formato:

- rastreável, indexável, legível por humanos/máquinas;
- próprio, YAML, JSON ou equivalente;
- evitar XML salvo justificativa;
- compatibilidade com IDEs desejável.

Registro mínimo por FT:

- identidade, escopo, objetivo, prioridade, status e `criado_em` ISO 8601 com fuso;
- etapa/tarefa atuais e listas completas;
- progresso, próximo ponto, raciocínio objetivo;
- decisões, verificações, comandos, pendências, limitações;
- hipóteses descartadas, falhas, causas e decisões antirretrabalho.

Nunca registrar apenas posição; usar FT, etapa e tarefa identificadas.

Atualizar continuamente, não só em conclusões.

Aprendizado de ambiente:

- `MACHINE_ID`;
- `DATA_REF` em ISO 8601 com fuso;
- cache contextual;
- bloqueio de retentativas historicamente falhas, salvo mudança relevante.

### 3.9 Seção 8 — Interrupção e retomada

Na iminência de esgotamento de recursos:

1. interromper controladamente;
2. salvar estado completo;
3. marcar tarefa com `[INTERROMPIDO_POR_LIMITACAO_DE_RECURSOS]`;
4. registrar pendências imediatas.

Na próxima interação: procurar flag, carregar estado, validar alterações manuais, retomar se solicitado ou resumir e pedir decisão; remover flag apenas após retomada bem-sucedida.

### 3.10 Seção 9 — Branches, commits e merge

Padrão operacional:

- desenvolvimento no branch `dev`;
- merge em `main`/`master` somente após FT concluída e sistema global funcional;
- considerar outras FTs que impeçam integração segura;
- verificar branch e working tree antes de alterar.

Se branch ≠ `dev` e houver alterações unstaged, parar e oferecer:

1. alternar para `dev` preservando-o;
2. criar/atualizar `dev` a partir de `main`/`master`;
3. levar/mesclar alterações atuais a `dev`;
4. continuar no branch atual.

Commit/push por tarefa quando viável e por etapa com prioridade superior. Não declarar operação sem prova. Criar abstrações npm quando reduzirem comandos e custo da IA.

Após FT concluída ou release publicado, `dev` DEVE convergir para a branch primária disponível (`main`, senão `master`). Fast-forward DEVERIA ser usado quando possível; divergência compatível DEVE gerar merge normal e conflito DEVE bloquear publicação até resolução explícita. A branch primária NÃO DEVE permanecer ancestral defasada de `dev` após o ciclo concluído.

### 3.11 Seções 10–14 — Implementação, build, padrões, validação e documentação

Devem preservar:

- regressão proibida em arquitetura, negócio, UX, API, build, cache, desempenho, CI/CD, publicação, bundles e produto final;
- regressão somente por solicitação explícita confirmada;
- sincronização automática entre AGENTS, extensão local, README, RCF, memória, implementação e UI afetada;
- proibição de negócio não autorizado, dependência desnecessária, duplicação, complexidade gratuita e refatoração ampla;
- produto final autônomo, contendo somente runtime;
- incorporação seletiva de recursos usados;
- CDN decidida pelo RCF; em silêncio, avaliar online/offline, cache, latência, privacidade, segurança e customização;
- PT-BR, análise rigorosa, hipótese não apresentada como conclusão;
- diff mínimo, refatoração cirúrgica, preservação de comentários;
- fonte e entrega comentáveis mantêm ou recebem somente cabeçalho de autoria/licença do próprio repositório, nunca removido nem preenchido por inferência;
- marcações `PRESERVADO`, `FIX-BUG`, `PROTECAO`;
- estilo determinístico, sem “eu”, “você”, “nós”, “talvez”, “provavelmente”;
- ambiguidade: interpretação mais restritiva, menor alteração, maior preservação; insolúvel → `AMBIGUIDADE INSOLUVEL: <ponto>. Preservando original.`;
- validação objetiva e documentação correlata.

Configuração mutável ou personalizável DEVE ter uma única raiz `./config/`, com arquivos por contexto, schema e parser compartilhado; CLI → ambiente → configuração local → default permanece a precedência. Código só conserva constante intrínseca ao algoritmo. Paths de aplicação/artefato, URLs, portas, workflow, branches, estratégia web/offline e metadados de autoria/licença pertencem à configuração. Build e dev-live consomem essa raiz; parâmetro de CI/desenvolvimento não integra runtime final. Web usa arquivo versionado cacheável ou header global justificado; bundle offline/móvel embute apenas o subconjunto requerido ou URL homologada.

`dev-live` DEVE ser previsível em todos os consumidores: `127.0.0.1`, porta `4000`, HTTP, sem proxy e reload por watch são defaults portáteis, substituíveis somente por configuração local declarada. Ausência de servidor aplicável exige dispensa explícita, não script ambíguo.

Build DEVE inserir e validar banner comentável usando a mesma configuração central de autoria, upstream e licença. Minificação/compilação não autoriza removê-lo. README encerra com Autoria, Repositório e Licença equivalentes; ausência de dado permanece ausência, sem inferência.

### 3.12 Seção 15 — Implementações em andamento

Gerar automaticamente, por script npm, Markdown na raiz, linkado pelo README, nunca editado manualmente.

Conteúdo:

- introdução curta;
- subtítulo por FT;
- objetivo resumido;
- escopo quando autorizado;
- por padrão, omitir FTs `Negócio`;
- tabela HTML, não Markdown;
- linhas de etapas e tarefas;
- status somente `pendente`, `em andamento`, `concluído`;
- ícone/emoji colorido correspondente;
- dentro da tabela, apenas nomes e status.

### 3.13 Seção 16 — Saída final

Toda entrega deve terminar com:

```text
COMMIT_SUGERIDO: <PT-BR; objetivo; até 512 caracteres; distinguir fix, melhoria e ajuste>
PENDENCIAS: <etapas/tarefas restantes ou “nenhuma”>
```

### 3.14 Seção 18 — API operacional do repositório

DEVE normatizar API operacional local por comandos padronizados, determinísticos, não interativos e reutilizáveis, preferencialmente `agent:*`, para reduzir contexto, tokens, processamento por LLM, tempo, erro e acoplamento. Havendo comando equivalente, o agente DEVE usá-lo antes de compor comandos manuais de sistema, Git ou ecossistema.

Cada comando DEVE:

- encapsular operação recorrente, mecânica ou custosa, com filtros, validações, retries, tratamento de erro, paralelização, paginação, sumarização e consolidação quando cabíveis;
- produzir saída compacta, estável, acionável e automatizável, omitindo progresso, transferências, arquivos inalterados, repetição e logs sem valor;
- retornar somente resultados, diagnósticos, métricas, resumos e erros relevantes, com códigos de retorno compatíveis com automação;
- ser idempotente quando a finalidade não exigir efeito cumulativo;
- admitir execução não interativa, contrato explícito e salvaguardas para operações destrutivas.

`agent:filter`/`to-ia` DEVE preceder os demais comandos e concentrar toda saída destinada à IA. A interface DEVE normalizar UTF-8/LF, remover controles, deduplicar linhas consecutivas, classificar e ordenar `fatal`, `error`, `warning`, `change`, `result`, `metric`, `info`, limitar a 50 linhas ou 8192 bytes e persistir excedente íntegro fora do versionamento. Falha do filtro DEVE bloquear a exposição e retornar código `4`.

Sequência recorrente, multicomando ou consumidora de contexto DEVE virar comando único da API. A API DEVE evoluir continuamente para deslocar trabalho mecânico da LLM sem ocultar erro, decisão, valor ou rastreabilidade.

Matriz mínima, quando aplicável ao ecossistema:

- **Workspace:** `agent:filter`, `agent:setup`, `agent:doctor`, `agent:repair`, `agent:clean`, `agent:status`, `agent:context`, `agent:workspace`.
- **Sistema operacional:** `agent:pwd`, `agent:ls`, `agent:tree`, `agent:find`, `agent:search`, `agent:grep`, `agent:head`, `agent:tail`, `agent:view`, `agent:stat`, `agent:size`, `agent:hash`, `agent:diff-file`, `agent:logs`, `agent:process`, `agent:kill`, `agent:ports`, `agent:compress`, `agent:extract`.
- **Git:** `agent:git-status`, `agent:git-fetch`, `agent:git-pull`, `agent:git-push`, `agent:git-sync`, `agent:git-add`, `agent:git-commit`, `agent:git-branch`, `agent:git-switch`, `agent:git-tag`, `agent:git-log`, `agent:git-show`, `agent:git-history`, `agent:git-diff`, `agent:git-blame`, `agent:git-reset`, `agent:git-restore`, `agent:git-clean`, `agent:git-stash`, `agent:git-prune`, `agent:git-gc`, `agent:git-last-release`, `agent:git-release-notes`, `agent:git-changelog`.
- **Build/release:** `agent:build`, `agent:verify`, `agent:dist`, `agent:package`, `agent:release`, `agent:release:trigger`, `agent:release:publish`, `agent:rollback`; conteúdo, somente no cenário aplicável: `agent:publish`, `agent:deploy`.

### 4.0 Scripts reutilizáveis e metaarquivos

Aplicar `MN-CLI` e `MN-META`. Script reutilizável DEVE declarar contrato comum, `--help`, parâmetro tipado/default, saída, erro, modo local/CI, configuração, compatibilidade, hook/adaptador e código `0/1/2/3/4/130`; argumento desconhecido falha, salvo `--` documentado para extensão. Conteúdo gerenciado NÃO DEVE receber edição local para especialização; configuração, hook e adaptador locais DEVEM residir fora dele, permanecer subordinados e NÃO DEVEM ser sobrescritos por atualização. Metaarquivos gerenciados ficam em `./.ia.rules/meta/<contexto>.md`, são indexados/distribuídos recursivamente e segmentam `cli`, `build`, `release`, `publish`, `maintenance`, `update`, `validation` e `ia` quando aplicáveis. Cada comando carrega somente `cli` e o contexto pertinente; README/RCF referenciam, sem repetir contratos. Release inclui scripts, metaarquivos, manifesto, dependências declaradas, hooks e exemplo mínimo, mas NÃO inclui dependência instalada salvo autonomia expressa.

NPM DEVE possuir `release`, `publish` e `update:agents` como comandos universais all-in-one. Parcial/intermediário usa `:` em cadeia semântica. Implementação reutilizável fica em `shared:*`; `agent:*` e `agents:*` são reservados à IA e apenas delegam ao global/compartilhado com saída filtrada. Alias legado permanece durante transição explícita. Core recebe paths e hooks tipados `pre`/`post` por configuração, nunca presume `src`, `dist`, ativo ou hospedagem da aplicação. Orquestrador valida branch e tree, limpa somente target declarado, executa hooks/build/validação, cria commits isolados, envia upstream, acompanha pipeline e só interrompe para decisão humana em divergência crítica.

CONTRADIÇÃO DETECTADA: comando canônico anterior `agent:autoupdate` vs aditamento humano `update:agents` — Aplicando a regra humana evolutiva e preservando aliases transitórios.
- **Qualidade:** `agent:test`, `agent:test:<grupo>`, `agent:lint`, `agent:format`, `agent:typecheck`, `agent:benchmark`, `agent:security`, `agent:analyze`.
- **Dependências:** `agent:deps`, `agent:update-deps`, `agent:licenses`.
- **Documentação/governança:** `agent:index`, `agent:map`, `agent:handoff`, `agent:docs`, `agent:rcf`, `update:agents`; `agent:autoupdate`, `agents:autoupdate`, `agent:agents` e `agents:update` são aliases transitórios equivalentes.
- **Dados:** `agent:parse-data`, `agent:summarize`, `agent:convert`, `agent:validate-data`, `agent:index-data`, `agent:query-data`.

Novos comandos PODEM ser adicionados sem enfraquecer os canônicos. Alias NÃO substitui nome padronizado. Comando inaplicável DEVE possuir dispensa expressa por autoridade normativa competente.

---

## 4. Contrato do item 17 — Núcleo de cenários

O item 17 não contém regras específicas de Web Page Like. Deve conter somente:

1. definição de cenário;
2. regras gerais multicenário;
3. arquitetura dos arquivos;
4. protocolo de carregamento/manutenção;
5. índice de cenários existentes.

### 4.1 Definição

Cenário é especialização normativa reutilizável aplicável a tipo de projeto, entrega ou contexto. A lista é aberta, cumulativa e não exaustiva. Novo cenário deve ser adicionado em arquivo independente e indexado, sem expandir estruturalmente o AGENTS.

### 4.2 Diretrizes gerais

Todos os cenários devem observar:

- aplicabilidade técnica e semântica;
- acumulação entre cenários;
- especialização apenas no escopo;
- dispensa somente por incompatibilidade, irrelevância ou custo desproporcional verificável;
- contradição registrada:
  `CONTRADIÇÃO DETECTADA: <origem> vs <regra> — Aplicando a regra de maior precedência.`;
- objetivos: conformidade, reutilização, generalização, menos interfaces, composição, menos processamento/tokens, evolução sem quebra, acessibilidade, segurança, privacidade, desempenho e manutenção;
- ordem: reutilizar universal → grupo → compor → parametrizar → criar;
- interface pública estável;
- fluxos compostos sem duplicação;
- escolha tecnológica proporcional;
- preservação de processos existentes;
- correções textuais incidentais restritas à região alterada.

### 4.3 Organização

Cada cenário:

- mantém `scenario.md` estável como norma atômica ou roteador de módulos coesos;
- é extensão direta do AGENTS, não RCF;
- permanece genérico para sua categoria;
- declara definição, escopo, aplicabilidade, limites, dependências, contratos, regras, exceções, precedência, segurança, privacidade, acessibilidade, desempenho, compatibilidade, validações e conclusão;
- referencia regras gerais em vez de copiá-las.

### 4.4 Carregamento

Antes de implementar:

1. classificar projeto/entrega;
2. localizar cenários no índice;
3. carregar o `scenario.md` do cenário selecionado;
4. avaliar cada predicado somente com evidência autoritativa;
5. calcular dependências transitivas, rejeitando ausência/ciclo;
6. carregar integralmente apenas módulos verdadeiros e suas dependências, na ordem declarada;
7. aplicar cumulativamente AGENTS, módulos/cenários e RCF;
8. registrar módulos aplicados, dispensas e evidência na memória.

Arquivo ausente, ilegível, divergente ou com dependência irresolvida é falha normativa; inferência silenciosa é proibida. Cenário atômico sem módulos aplica o próprio `scenario.md` integralmente.

### 4.5 Índice inicial

O índice deve registrar:

- **Web Page Like** → `./.ia.rules/scenarios/web/page-like/scenario.md` → `capabilities/browser.md`;
- **Web estático/hospedagem** → mesmo roteador → `capabilities/static-hosting.md`; depende de `browser.md`;
- **Editorial** → mesmo roteador → `capabilities/editorial.md`; depende de `browser.md` e de `static-hosting.md` somente quando a entrega for estática.
- **Release** → `./.ia.rules/scenarios/release/scenario.md`; aplica-se somente a versão/tag/asset/release publicável.
- **Publicação de Conteúdo** → `./.ia.rules/scenarios/content-publication/scenario.md`; aplica-se somente a artefato de Negócio publicável e depende do cenário técnico/RCF pertinente.
- **Evolução upstream** → `./.ia.rules/scenarios/governance/upstream-sharing/scenario.md`; aplica-se ao consumidor contribuinte e à inbox formal do construtor.

Novo cenário exige `scenario.md`, nova linha no índice, dependências e validação de não duplicidade; módulos adicionais só são admitidos para predicados independentes comprovados.

---

## 5. Contrato de `./.ia.rules/scenarios/web/page-like/`

`scenario.md` DEVE conter apenas identidade, precedência, predicados, ordem e mapa de módulos. `capabilities/browser.md`, `capabilities/static-hosting.md` e `capabilities/editorial.md` projetam respectivamente §§5.1, 5.2 e 5.3; cada um DEVE declarar o próprio predicado e aplicar somente após resolução do roteador. O path do roteador permanece estável e a adição dos módulos é compatível por extensão recursivamente indexada, sem remover ou renomear artefato gerenciado anterior.

O diretório herda o item 17 e compõe três capacidades cumulativas: Web Page Like, gerador/hospedagem e conteúdo editorial.

## 5.1 Cenário-base Web Page Like

### 5.1.1 Escopo

Abranger páginas estáticas, apps cliente, SPA, widgets, componentes, bibliotecas frontend, WASM, sites gerados, híbridos e sites/blogs de templates.

### 5.1.2 Matriz tecnológica exata

A matriz deve gerar **42 combinações**, preservando capacidades:

#### A. Sem Jekyll/gerador — 26 linhas

1. JavaScript + HTML + sem framework + CSS/SCSS + sem build: `Dev=sim`; demais=não. **2 linhas**.
2. JavaScript + HTML + sem framework + CSS/SCSS + Vite: `Dev/Prod/Lib/Bundle/Offline=sim`. **2**.
3. TypeScript + HTML + sem framework + CSS/SCSS + sem Vite: `Dev=sim`; demais=não. **2**.
4. TypeScript + HTML + sem framework + CSS/SCSS + Vite + sem WASM: todas as capacidades=sim. **2**.
5. Mesmo perfil com WASM: todas=sim. **2**.
6. TypeScript + TSX + React + Vite + estilos `{CSS, SCSS, CSS Modules, SCSS Modules}` + WASM `{não, sim}`: todas=sim. **8**.
7. Mesmo produto cartesiano com Preact: todas=sim. **8**.

#### B. Com Jekyll/gerador — 16 linhas

1. JavaScript + HTML + CSS/SCSS + sem Vite + sem WASM: `Dev/Prod=sim`; `Lib/Bundle/Offline=não`. **2**.
2. JavaScript + HTML + CSS/SCSS + Vite + sem WASM: `Dev/Prod/Bundle/Offline=sim`; `Lib=não`. **2**.
3. TypeScript + HTML + CSS/SCSS + Vite + WASM `{não, sim}`: `Dev/Prod/Bundle/Offline=sim`; `Lib=não`. **4**.
4. TypeScript + TSX + framework `{React, Preact}` + estilos `{CSS, SCSS}` + Vite + WASM `{não, sim}`: `Dev/Prod/Bundle/Offline=sim`; `Lib=não`. **8**.

Legenda obrigatória: Dev, Prod, Lib, Bundle e Offline; offline incorpora todos os assets necessários quando tecnicamente possível.

### 5.1.3 Interface npm

`package.json` é API pública. Hierarquia: universal → grupo → especializado → implementação.

Comandos universais quando aplicáveis:

```text
dev live build clean lint format test check publish release prepare
```

Grupos:

```text
build:dev build:prod build:dist build:bundle build:offline build:lib build:types build:docs
dev:watch dev:live dev:debug dev:profile
publish:test publish:beta publish:live publish:github publish:pages
```

Fluxo composto:

```text
`release` e `publish` possuem cenários independentes: release não aciona publicação de conteúdo; publish não cria versão, tag, asset ou release.
```

Proibidos comandos redundantes como `vite-dev`, `react-build`, `jekyll-build`, `publish-react` quando houver equivalentes semânticos.

### 5.1.4 Git por npm

Criar, quando possível:

```text
commit push pull sync status fetch rebase branch
```

`commit` aceita mensagem e pode coordenar add/commit/push; não ocultar falha, descartar alteração, forçar push, contornar proteção ou executar destruição sem confirmação.

### 5.1.5 Padronização e build

Padronizar portas, parâmetros, variáveis, targets, artefatos, diretórios de saída e comportamentos Dev/Prod/Lib/Bundle/Offline. Diferença tecnológica deve ser transparente.

Ajustar manifestos/locks, compilador, gerador, bundler e CI/CD.

### 5.1.6 Aprimoramento progressivo

- HTML: estrutura/semântica;
- CSS/Sass: apresentação/estado;
- nativo: interação básica;
- JS/TS: aprimoramento/coordenação/fallback.

Conteúdo essencial não pode depender exclusivamente de JS quando houver alternativa nativa. Priorizar TS para código novo quando compatível.

### 5.1.7 UX, acessibilidade e componentes

Validar estados, temas, desktop/mobile, teclado, foco, contraste, toque, overflow.

Adotar componentes quando reduzirem duplicação; priorizar TSX, SCSS/módulos e contratos explícitos quando apropriado; não introduzir runtime para substituir templates suficientes.

### 5.1.8 Tema

Quando houver tema:

- CSS/Sass + Custom Properties;
- controle discreto, responsivo, acessível;
- sol/lua quando adotado;
- reutilizar biblioteca existente; Font Awesome pode ser padrão se já usado;
- padrão escuro na ausência de preferência, salvo norma superior;
- persistência não pode quebrar renderização.

### 5.1.9 Menus

Priorizar HTML/CSS/nativo; JS/TS apenas aprimora. Colapsar só com ganho real.

Quando aplicável:

- máximo um painel principal por contexto;
- camada externa sobre viewport;
- `backdrop-filter` com fallback;
- fechamento explícito, externo e após seleção quando necessário;
- teclado/foco preservados;
- composição `[ícone | rótulo]` alinhada.

### 5.1.10 Retorno ao topo

Quando necessário:

- canto inferior direito ou equivalente;
- aparece após rolagem, oculto no topo;
- não obstrui;
- desktop/mobile, toque/clique, rótulo acessível;
- respeita redução de movimento;
- CSS/Sass visual; TS leve se necessário;
- suave, exceto `prefers-reduced-motion`.

### 5.1.11 Loader

Componente de carregamento, quando adotado, contém indicador central e barra superior visualmente separada da animação; dimensão e identidade pertencem ao token ou RCF específico.

Progresso acompanha DOM/recursos quando possível, distingue real/estimado, degrada seguramente, suporta conexões lentas e a baseline de navegadores declarada pelo projeto, permanece leve e local.

Nunca ocultar indefinidamente, bloquear `noscript`, impedir acesso após erro parcial ou depender de recurso remoto indispensável. Página de erro usa fallback local mínimo.

### 5.1.12 Fallback sem JS

Abranger páginas relevantes, inclusive erro; somente HTML/CSS; preservar cabeçalho, conteúdo institucional, rodapé, logo, textos, links, ordem, classes e tema; rolagem vertical, sem overflow, acessível; não bloqueado por loader.

Omitir controles exclusivamente dinâmicos sem implementação funcional. Validar páginas principais e de erro com JS desativado.

### 5.1.13 Página 404

Quando suportada:

- fonte editável;
- CSS principal reutilizado;
- sem duplicação global;
- código local mínimo;
- fragmentos sincronizados;
- sanitização;
- sem cookies/localStorage, consentimento ou analytics desnecessários;
- sem seletor de tema por padrão;
- útil sob falha auxiliar.

Pode usar `404.main.html` como parcial; apresentação terminal somente por identidade/RCF.

### 5.1.14 Compactação HTML

Somente produção; incluir gerados e copiados; remover vazios/indentação dispensável; preservar `script`, `style`, `pre`, `textarea`, `template`; manter quebras não vazias; não single-line; não minificar JS/CSS/Base64 incidentalmente; evitar dependência se hook local bastar; testes obrigatórios.

---

## 5.2 Cenário cumulativo: gerador estático/hospedagem

Aplicar sobre §5.1 quando houver Jekyll/equivalente, templates e GitHub Pages/equivalente.

Regras:

- validar compatibilidade de bundler/framework/runtime com gerador, hospedagem, tema, build remoto, base paths e assets;
- em projeto estático, preferir templates nativos, CSS/Sass, TS compilado e ausência de bundler se suficiente;
- Vite/equivalente somente com vantagem e compatibilidade comprovadas;
- manifestos e versões locais/remotas compatíveis;
- plugin incompatível exige pipeline alternativo controlado;
- 404 na raiz quando a plataforma exigir, normalmente `404.html`;
- sem front matter quando precisar ser estática pura;
- CSS principal por caminho resolvido;
- recursos locais mínimos;
- publicações recentes assíncronas somente após conteúdo/loader, por JSON/feed, DOM seguro e falha controlada;
- fallback `noscript` compartilhado por include/partial/componente e sincronizado automaticamente.

---

## 5.3 Cenário cumulativo: sites/blogs editoriais

### 5.3.1 Agendamento

Área `_scheduled` ou equivalente separa rascunho, aprovado/agendado e publicado. Conteúdo futuro não aparece no build, não possui URL acessível e resulta em 404/indisponibilidade até a data.

Cadência e horário DEVEM ser declarados pela política editorial, com zona de publicação explícita; horário de corte, quando adotado, DEVE converter fuso explicitamente.

Fluxo: verificar → selecionar elegíveis → preparar → compilar → atualizar público → publicar → validar → registrar.

### 5.3.2 Distribuição

Distribuição externa somente após compilação, publicação e disponibilidade validadas. Dependentes exigem estado final conhecido.

Social automática, quando adotada, trata cada plataforma e perfil declarado separadamente. Prioridade:

1. open source madura;
2. método oficial;
3. alternativa configurada;
4. fallback.

Publicar título, resumo, imagem, hashtags e link. Exigir segredos isolados, idempotência, retries limitados, recuperação, fallback e registro. Proibir loop infinito, duplicação e wrapper desnecessário.

### 5.3.3 Listagens

Sem overflow; validar na menor viewport e nos pontos de quebra declarados pela baseline do projeto. Na ausência de baseline explícita, a RCF específica DEVE registrar a superfície representativa e o critério de responsividade antes da implementação.

Padrões:

- home, relacionados e recentes: limite de itens, paginação ou carregamento progressivo declarados pelo template/RCF específico, com densidade compatível com leitura, desempenho e navegação;
- relacionados: rótulo localizado/semântico declarado pelo projeto e sem artigo atual;
- recentes: fonte JSON/feed após conteúdo essencial, contêiner inicial vazio quando dinâmico, card reutilizado, `textContent`, sem cookies/localStorage e falha não bloqueante.

### 5.3.4 Autores

Modelo de autoria ordenado:

- identidade e resumo obrigatórios declarados pelo adaptador;
- campos opcionais declarados pelo projeto;
- entrada incompleta não renderiza;
- sem autor válido, sem bloco;
- representação ausente usa fallback local;
- destaque e compactação declarados pelo componente/editorial;
- semântica de pessoa/autoria quando aplicável;
- sem migração forçada de posts antigos.

### 5.3.5 Formatação editorial

Quando houver indentação:

- token de espaçamento declarado pelo projeto;
- CSS/Sass, nunca espaços Markdown;
- excluir títulos, listas, tabelas, imagens, legendas, notas, blockquotes e painéis.

Citações:

- corpo não itálico por padrão;
- subcitação pode ser itálica;
- referência em linha própria, iniciada por `—`, menor;
- contexto do autor somente com base segura.

Texto comum não itálico por padrão; preservar itálico semântico/autoral. Notas compactas.

### 5.3.6 Autoria e IA

Preservar estilo, vocabulário, ritmo, argumentação, estrutura, pontuação, pausas e retórica. Prioridade: identidade → intenção → correção → clareza → organização.

Transformação semântica por IA exige marcação mínima persistente, invisível, pesquisável e neutra:

```html
<!-- AI-PROCESSED:START -->
...
<!-- AI-PROCESSED:END -->
```

Aplica-se a reescrita, reorganização, expansão, resumo, simplificação, ajuste semântico, adaptação e geração. Dispensa correções mecânicas.

Referência de estilo: original não marcado → rascunho → publicado → somente correção mecânica → IA.

### 5.3.7 Rigor e referências

Exceto reflexão, testemunho, opinião, literatura ou poesia identificados, buscar rigor documental.

Referenciar fatos, história, estatísticas, estudos, técnica, citações, traduções e controvérsias. Princípio:

```text
Afirmação → referência imediata
```

Notas de rodapé devem apontar, retornar, funcionar por teclado e mobile. Referências/Bibliografia devem ser geradas de notas/metadados quando possível; padrão bibliográfico decorre da política editorial, jurisdição ou RCF específico.

### 5.3.8 Privacidade e conclusão

Conteúdo essencial, 404, recentes e fallback não dependem de cookies/localStorage. Consentimento/analytics somente quando exigidos.

Concluir somente após conteúdo correto, links/referências válidos, sem overflow, fallback legível, 404 resiliente, workflows com estado final, marcações inseridas, correções relatadas e conformidade validada.

---

## 6. Algoritmo de reconstrução

Executar nesta ordem:

1. inventariar fontes normativas e identificar a versão manual mais recente;
2. extrair regras atômicas com domínio, força, condição, exceção e dependências;
3. classificar cada regra: IA global, multicenário, cenário, projeto, local ou estado;
4. centralizar regras comuns; substituir cópias por referências;
5. reconstruir seções 0–16 conforme §3;
6. reconstruir item 17 conforme §4;
7. reconstruir seção 18/API operacional conforme §3.14;
8. gerar o roteador e os módulos de `./.ia.rules/scenarios/web/page-like/` conforme §5;
9. validar a matriz W-MTX-42 e os parâmetros editoriais declarados;
10. comparar efeitos normativos com as fontes;
11. auditar perda, enfraquecimento, deslocamento de domínio, arbitrariedade e conflito;
12. produzir diff mínimo e rastreável;
13. atualizar memória operacional e documentação correlata.

### 6.1 Tratamento de conflito

- texto manual mais recente prevalece sobre geração anterior no mesmo nível;
- especialização válida prevalece somente em seu escopo;
- regra global não pode absorver particularidade de cenário;
- cenário não pode absorver particularidade de projeto;
- em dúvida, preservar conteúdo e registrar ambiguidade;
- nunca resolver conflito removendo exceção ou exemplo que delimite comportamento.

### 6.2 Proibição de regressão editorial

É regressão:

- substituir número concreto essencial por abstração sem critério, dono e validação; ou manter no cenário número que seja apenas escolha visual/local sem promovê-lo a parâmetro;
- remover tabela sem reconstrução gerativa exata;
- trocar “deverá” por “poderá”;
- converter ferramenta oficial do cenário em exemplo não normativo sem autorização;
- mover regra da IA ao RCF;
- mover regra local ao AGENTS;
- manter regra Web no item 17;
- apagar nuance por economia textual.

---

## 7. Validação obrigatória

### 7.1 Integridade

Confirmar:

- todas as regras-fonte possuem destino;
- toda regra possui um único dono normativo;
- referências internas resolvem;
- exceções e condicionantes sobreviveram;
- nenhum exemplo normativo foi convertido em ilustração descartável;
- nenhum valor essencial foi abstraído sem critério, dono e validação; valores locais foram convertidos em parâmetros declarados.

### 7.2 Compartimentação

Confirmar:

- AGENTS governa IA;
- item 17 governa arquitetura de cenários;
- o roteador e os módulos de `./.ia.rules/scenarios/web/page-like/` governam Web;
- API operacional possui contrato, matriz e dispensa rastreável;
- RCF governa projeto;
- extensão local governa operação local;
- memória governa estado.

### 7.3 Portabilidade

Confirmar:

- `AGENTS.md` funciona em qualquer repositório;
- arquivos de cenário funcionam em qualquer projeto da categoria;
- particularidades exclusivas permanecem fora deles;
- artefatos da própria IA podem manter nomenclatura, paths e valores determinísticos.

### 7.4 Completude do cenário Web

Confirmar:

- 42 combinações;
- interface npm e Git fortes;
- padrões Dev/Prod/Lib/Bundle/Offline;
- UX, acessibilidade, loader, fallback, 404 e compactação;
- gerador/hospedagem;
- agendamento, social, listagens, autores, editorial, IA, referências e privacidade; parâmetros de viewport, densidade, rótulo, composição e espaçamento declarados quando aplicáveis.

### 7.5 Critério de aceitação

A reconstrução só é concluída quando todas as respostas forem “sim”:

1. O documento resultante preserva integralmente a norma?
2. AGENTS e RCF permanecem em domínios distintos?
3. O item 17 está livre de Web Page Like?
4. O roteador Web resolve toda regra ao módulo proprietário sem carregar módulo inaplicável?
5. Novo cenário exige somente roteador/arquivo atômico, índice e módulos justificados por predicados independentes?
6. Nenhuma obrigação foi enfraquecida?
7. Nenhuma particularidade local contaminou a camada global?
8. A densidade aumentou sem perda semântica?
9. A rastreabilidade permite auditar origem e destino?
10. A API operacional preserva comandos, preferência de uso, saída compacta e evolução contínua?
11. A arquitetura pode ser recriada somente com este RCF?

---

## 8. Saída esperada

A implementação deste RCF deve produzir, conforme escopo:

- `AGENTS.md` completo ou seções integralmente alteradas;
- item 17 desacoplado;
- seção 18/API operacional consolidada;
- roteador e módulos Web completos;
- RCFs/README/memória sincronizados quando afetados;
- relatório sucinto de validação;
- `COMMIT_SUGERIDO`;
- `PENDENCIAS`.

Não declarar conclusão sem validação integral de §7.

## 9. Indexador

O repositório deve possuir um arquivo indexador normativo localizado no root, denominado `index.json`.

Objetivo: mapear cada arquivo normativo real e útil do projeto (em `./src/`), indicando seu nome e caminho relativo real a partir de `./` do repositório.

Requisitos:

- O arquivo deve ser gerado e mantido automaticamente sempre que aplicável.
- Deve utilizar formato JSON válido.
- Deve ser minificado para reduzir tamanho e consumo desnecessário de tokens/processamento.
- Deve representar apenas arquivos efetivamente existentes e relevantes, evitando referências obsoletas ou arquivos auxiliares sem valor normativo.

## 10. Dist

Deve existir comando NPM ou mecanismo equivalente capaz de gerar releases otimizados no diretório `./dist/`.

A geração deve:

- Produzir a saída final destinada à publicação em produção a partir de `./src/`.
- Atualizar todos os paths relativos existentes nos arquivos gerados, garantindo funcionamento correto após movimentação para `./dist/`.
- Incluir o indexador gerado, renomeando `index.json` para `release.json`.
- Preservar somente arquivos necessários para execução/publicação, removendo artefatos temporários ou desnecessários.
- Aplicar otimizações compatíveis com produção.
- Incluir scripts gerenciados necessários ao mecanismo distribuído, sem incluir hook, extensão local, memória, RCF ou conteúdo de Negócio.
- Incluir `package.json` executável com `agentsGovernance` que declare scripts e dependências gerenciados; na atualização de um anfitrião, esse manifesto DEVE ser mesclado sem substituir os campos, scripts, dependências, locks ou configurações não declarados.
- Incluir manifesto de atualização com linguagem e versão declaradas, conjunto exaustivo de arquivos gerenciados e marcadores de variação; atualização de release ou branch deve usar esse manifesto como fonte exclusiva, usando lock anterior apenas para conversão e limpeza comprovada.
- `verify` DEVE rejeitar microconceito citado sem definição, definição duplicada e referência Markdown explícita inexistente, fora de `./src/` ou com caixa divergente; depois DEVE comparar cada arquivo indexado de `./src/` com seu path materializado em `./dist/`. NÃO DEVE exigir igualdade entre fonte do produto e governança ativa `./AGENTS.md`/`./.ia.rules/`, pois esses domínios possuem autoridade distinta.

O processo deve ser resiliente, prevendo falhas de ambiente, inconsistências, erros temporários, conflitos e etapas parcialmente concluídas, utilizando validações, tratamentos adequados e retries quando aplicável.

## 11. Release Automático

Deve existir um comando NPM ou equivalente e um workflow de GitHub Actions capaz de gerar, versionar, compactar e publicar releases automaticamente.

Limpeza de artefato gerado DEVE tolerar bloqueio transitório do sistema de arquivos com retentativa limitada e determinística. Após falha, o processo DEVE reconstruir integralmente o artefato ou interromper com causa identificável; não PODE publicar árvore parcialmente limpa, ignorar arquivo bloqueado ou usar remoção forçada sem escopo.

O processo deve:

- Gerar o conteúdo de `./dist/`.
- Compactar o release em arquivo `.zip` com compressão otimizada.
- Seguir padrão de nomenclatura compatível com versionamento, como:

  `agents-v0.0.0-beta.zip`

  onde:
  - `v0.0.0` representa a versão semântica;
  - `beta` é um identificador opcional de pré-release.

- Publicar o release como versão `latest`.
- Caso exista uma versão `latest` anterior, movê-la para uma tag de histórico, como `v0.0.0`.
- Criar obrigatoriamente uma tag de versão correspondente ao release publicado, como `v0.0.0`.

O fluxo deve ser resiliente, prevendo falhas, inconsistências, indisponibilidade temporária de serviços e erros de execução, utilizando validações, tratamentos e retries quando aplicável.

### 11.1 Disparo Automático por Commit

O workflow deve permitir execução manual e automática.

Além da execução manual, deve detectar push contendo um commit cujo único arquivo adicionado seja:

`release`

ou

Nenhuma extensão é autorizada neste RCF; somente `release` é válido.

Regras:

- O arquivo deve estar localizado no root do repositório.
- O arquivo NÃO DEVE possuir extensão.
- A existência do arquivo deve funcionar exclusivamente como gatilho de release.
- COnteúdo do arquivo indica a versão a ser usada e usa o padrão `0.0.0-beta` ou apenas `0.0.0` ou resumido `0.0`.
- Reexecução com gatilho da mesma versão deve reutilizá-lo idempotentemente. Gatilho divergente só pode ser substituído quando a tag da versão registrada comprovar publicação concluída; sem essa prova, a divergência bloqueia a nova execução.

Após identificar o gatilho:

1. Gerar e publicar o release.
2. Remover o arquivo `release`.
3. Criar commit garantindo que o arquivo nunca permaneça no repositório remoto.
4. O novo commit deve iniciar obrigatoriamente com texto:

   `release:`

   O restante da mensagem é livre.

O arquivo `release` deve funcionar apenas como sinalizador transitório, nunca como conteúdo persistente do repositório. `publish`/`publicar` são reservados exclusivamente à Publicação de Conteúdo.

### 11.2 Rastreabilidade de Releases

Toda publicação de release deve gerar obrigatoriamente um commit contendo prefixo:

`release:`

Esse commit servirá como marcador histórico da última publicação realizada e como referência para geração automática das próximas notas de versão.

### 11.3 Geração Automática de Release Notes

Antes da publicação, o processo deve:

- Identificar o último commit contendo prefixo `release:`.
- Coletar todos os textos de commits posteriores até o commit atual responsável pelo release.
- Sintetizar essas alterações em notas de versão sucintas e relevantes.

As notas geradas devem:

- Fazer parte do release publicado.
- Ser incluídas no root do arquivo `.zip`.
- Possuir nome:

  `release-note.txt`

A síntese poderá utilizar:

- API pública e gratuita de IA, quando disponível;
- Caso contrário, algoritmo local ou solução open source capaz de realizar sumarização textual.

O mecanismo escolhido deve priorizar:

- funcionamento offline quando possível;
- baixo acoplamento;
- previsibilidade;
- ausência de dependências obrigatórias externas para o processo principal de release.
- saída em pt-br.

### 11.4 Versão, metadados e extensões

Versão explícita DEVE ser validada. Ausente, a inferência DEVE ser determinística e auditável por tag/marcador alcançável, commits posteriores compatíveis e manifesto coerente; evidência insuficiente, pré-release ambíguo, convenção ausente, divergência ou candidato existente DEVEM bloquear e solicitar confirmação. `feat`, `fix`/`perf` e quebra explícita incrementam respectivamente minor, patch e major somente quando a convenção for comprovada.

`release.json` DEVE vincular versão, tag, commit, release anterior, arquivos, asset e hash das notas. Mesmo commit/input DEVE gerar conteúdo lógico idêntico. Hooks formais `prepare`, `verify` e `published` DEVEM permitir especialização local sem alterar mecanismo comum; hook NÃO DEVE modificar versão, tag, asset ou metadado sem contrato explícito. `latest` DEVE apontar ao release mais recente e releases anteriores DEVEM manter tag histórica.

## 12. Publicação de Conteúdo

Este cenário de Negócio só se aplica quando o RCF declarar conteúdo público. `publish`/`publicar` publica artigos, páginas, posts, documentação ou equivalente por comando, manifesto, sinalizador, workflow ou arquitetura superior; integra apenas build, hospedagem, CI, cache, SEO, feed, índice, agenda e distribuição já aplicáveis. Deve usar hooks formais, ser idempotente, auditável e validar disponibilidade real.

É independente de Release: NÃO DEVE criar/alterar versão, tag, asset, `latest`, nota de release ou commit `release:`. Repositório sem conteúdo publicável NÃO DEVE expor comando, gatilho, workflow ou custo deste cenário. Falha antes da disponibilidade DEVE bloquear dependente; segredo, dado privado e conteúdo inelegível NÃO DEVEM ser publicados.

## 13. Autoridade operacional, mecanismos oficiais e solicitações

### 13.1 Vocabulário canônico e proteção estrutural

**Norma Operacional** é `/AGENTS.md` e associados, que regem como IA, processo, leitura, edição, validação, rastreabilidade, automação, scripts, hooks, comandos e FTs operam. **RCF** é a SSOT arquitetural declarativa, determinística e verificável do que o sistema é e DEVE fazer. **Repositório Construtor** mantém, constrói, valida ou distribui a Norma Operacional; **Repositório Final** a consome. Papéis são cumulativos: este construtor atua também como Repositório Final sob seu `/AGENTS.md`, sem usar um papel para afastar o outro; `src/AGENTS.md` permanece produto-fonte, não norma desta execução.

**Mecanismo Oficial** é script, comando, hook, callback, adaptador, workflow, arquivo-gatilho, convenção, nomenclatura, contrato ou ponto de extensão normatizado. **Extensão Oficial** compõe o mecanismo sem substituir fluxo ou contrato. **Fluxo Paralelo** é mecanismo novo, duplicado, substitutivo ou funcionalmente equivalente que contorne o oficial. **Lacuna Oficial** é erro, risco, insuficiência ou ausência comprovada no mecanismo necessário. **Princípio Estruturante** é regra cuja degradação altera autoridade, alcance ou comportamento fundamental. **Microtexto Normativo** é unidade curta, coesa, autônoma, estável e referenciável. **Custo Líquido** compara tokens, bytes, tempo, processamento, navegação, manutenção, risco, precisão e reutilização.

Esses conceitos DEVEM ter definição única e central. Revisão parcial, cirúrgica, ampla ou estrutural DEVE preservar autoridade, precedência, domínios, contratos, nomenclaturas, proibições, exceções, hooks, modus operandi, incisividade, rastreabilidade, força, efeitos e intenção. Princípios Estruturantes DEVEM ser identificáveis, permanentes, irremovíveis e não regressivos; validação futura DEVE detectar remoção, diluição, relativização, subordinação, abreviação com perda, facultatividade ou substituição. Densificação, modularização e otimização de tokens NÃO DEVEM reduzir rigor, minúcia, clareza, explicitabilidade, exigibilidade, previsibilidade ou resistência a interpretação desviada.

### 13.2 Uso compulsório e evolução

Agente e Repositório Final DEVEM obedecer contratos aplicáveis, consultar descoberta oficial, reutilizar finalidade e nomenclatura oficiais, inspecionar estado real e corrigir implementação divergente. Dúvida, desconhecimento, cópia possivelmente desatualizada ou inadequação aparente exigem releitura, inspeção, comparação de versão e rastreamento; NÃO autorizam improvisação, solução unilateral ou presunção de inexistência.

Mecanismo Oficial NÃO DEVE ser neutralizado, duplicado, renomeado, reimplementado, contornado ou substituído; resultado funcionalmente correto NÃO legitima processo incompatível. Necessidade específica, complemento ou ausência de especialização NÃO autorizam reinvenção. Expansão PODE adicionar script, subcomando, callback, validação ou integração somente por hook, composição, adaptador, arquivo-gatilho, `agents.local.md` ou contrato oficial, preservando fluxo principal, nomes, precedência e compatibilidade comum. Havendo opções oficiais, critérios normatizados determinam a escolha.

Contratos `release`, `publish`, seus subcomandos, arquivo-gatilho e execução por GitHub Actions são exemplos delimitadores, não exaustivos. Se o produto distribuir workflow para a finalidade, Repositório Final NÃO DEVE criar concorrente, trocar gatilho por `workflow_dispatch`, publicar localmente, exigir acesso adicional, duplicar script ou contornar hook sem exceção normativa expressa. A execução indireta por adaptador oficial NÃO reduz compulsoriedade.

### 13.3 Lacuna oficial e exceção extrema

Possível Lacuna Oficial DEVE ser validada contra estado canônico atual: resolver upstream, consultar versão, comparar contratos/scripts/documentação, recomendar atualização local e confirmar persistência após convergência. Issue no construtor somente PODE ser criada se atual, reproduzível, generalizável, oriunda do mecanismo oficial e documentada com impacto, risco, limites, evidência e estratégia aderente sanitizada. Particularidade local NÃO autoriza issue. No consumidor, a issue criada é somente proposta: NÃO DEVE ser tratada, movimentada, atribuída, implementada ou encerrada; FT dependente sem alternativa aderente é suspensa e FT independente prossegue.

Correção provisória de código somente PODE ocorrer quando a suspensão impedir materialmente a continuidade e nenhuma solução aderente existir. DEVE ser extrema, mínima, temporária, testada, reversível, vinculada a `agents.local.md`, limitada ao modus operandi oficial, sem novo fluxo/nome/arquitetura e com critério objetivo de remoção. A issue generalizada é criada somente após a correção provisória estar funcional e sanitizada. Incorporação oficial exige nova FT para remover a exceção e seus resíduos.

### 13.4 Captura, decomposição e ciclo obrigatório

Toda solicitação — prompt, issue, TODO ou equivalente — DEVE possuir fonte canônica antes da execução material. Fonte local já versionada é referenciada diretamente, sem cópia. Fonte efêmera/remota DEVE ser preservada integralmente com complementações, referências, anexos, origem, data, ID, hash, FTs, RCFs de destino e estado de incorporação sob `./.ia.rules/state/requests/<FT-ID>/`; o registro é versionado, bidirecionalmente rastreável e NÃO depende do histórico da ferramenta. `.gitignore` PODE receber exceção cirúrgica que NÃO exponha cache, segredo ou log.

Antes de criar FT ou alterar artefato, a IA DEVE ler e decompor o conjunto integral: objetivo global, escopo, requisitos, proibições, exceções, precedências, dependências, decisões, nuances, impactos, conflitos, lacunas, inferências legítimas, aceite e regressões. Solicitações extensas DEVEM ter contexto-mestre e subcontextos densos, encadeados e temporários sob `./.ia.rules/state/contexts/<FT-ID>/`; cada um declara identidade, ordem, fase, tarefa, escopo, objetivo, entradas, dependências, normas herdadas, restrições, fora de escopo, entregáveis, validações, estado e aceite. O contexto-mestre mantém mapa, arquitetura, relações, ordem, contratos de integração, estado e critérios globais.

Subcontexto carrega integralmente somente contexto-mestre, seu arquivo, handoffs predecessores necessários e normas aplicáveis. Execução é unitária; paralelismo exige independência comprovada. Handoff registra decisões, arquivos, contratos, efeitos posteriores, riscos e validações. Alteração de escopo ou descoberta atualiza imediatamente mestre e dependentes. Conclusão local NÃO autoriza conclusão global; integração final revisa fluxo, divergências, lacunas, contratos e objetivo original. Temporários permanecem até auditoria e incorporação permanente e então DEVEM ser removidos no mesmo commit normativo, preservado o histórico Git.

FTs vinculam-se diretamente à issue, TODO-fonte ou registro, nunca ao comando de orquestração. Unidades materialmente relacionadas DEVEM ser planejadas como objetivo único, segregadas somente por fase, dependência ou responsabilidade real. Criação/conciliação de todas as FTs e vínculos forma commit exclusivo antes da norma. No construtor, sequência obrigatória é: **(1) RCF; (2) Norma Operacional em `src/`; (3) código/scripts; (4) validação/integração**. Cada fase possui FT/estado próprios; conclusão da RCF NÃO autoriza `src/`, e conclusão de `src/` NÃO autoriza código. Após cada fase normativa validada e commitada, a execução DEVE interromper, informar as fases seguintes e aguardar nova autorização humana explícita.

No Repositório Final aplica-se captura, análise, FTs, commit inicial e RCF antes de código, sem inventar dupla projeção própria do construtor. Registro temporário só é removido quando auditoria bidirecional comprovar que nenhuma regra, restrição, exceção, anexo relevante, nuance, motivação ou critério permanece exclusivo; removê-lo antes, retê-lo depois ou substituí-lo prematuramente por resumo é proibido.

### 13.5 Custo temporal, automação e comandos compostos

Antes de operação mecânica, a IA DEVE verificar brevemente se automação determinística reduz Custo Líquido; a avaliação NÃO DEVE custar mais que a tarefa. Filtragem, ordenação, extração, agregação, comparação, conversão, normalização, indexação, geração e validação DEVEM usar mecanismo oficial existente; script novo exige recorrência/benefício proporcional, entrada/saída estáveis, limites, erro explícito, diagnóstico preservado e ausência de dependência inútil. Julgamento normativo/arquitetural predominante NÃO DEVE ser transferido ao script.

Em ambiente que cobre ou limita tempo ativo, processo demorado PODE ser desacoplado quando sobreviver à sessão, não exigir interação imediata, não expuser segredo, não gerar órfão e tiver comando/argumentos sanitizados, cwd, início, PID/ID, resumo, log integral, fim, duração, código, estados `executando|concluído|falhou|cancelado|interrompido`, cancelamento, limpeza e retomada. Erro, `stderr`, kill e debug DEVEM ser preservados; ausência de saída NÃO significa sucesso. Operação com decisão intermediária, lock abandonável ou polling mais caro que a espera NÃO DEVE ser desacoplada. Na retomada, ler estado, código e cauda antes do log integral e NÃO repetir operação concluída.

Sequência dependente ou recorrente com três ou mais comandos DEVE tornar-se orquestrador quando melhorar reprodutibilidade, medição, interrupção, retomada, logs ou diagnóstico. Cada etapa registra ID, comando sanitizado, início/fim/duração, resultado/código, motivo de interrupção e log. Generalização aplicável a consumidores integra mecanismo `shared:*`; sequência estritamente local permanece local. Issue de promoção registra custo evitado, integração, estados, cancelamento, retomada, testes e sanitização e permanece somente registrada.

### 13.6 Registro indexado de decisões recusadas

O sistema DEVE manter em `./.ia.rules/decisions/` o único **Registro Decisório de Recusas**, destinado a preservar solicitação, proposta, decisão ou caminho de implementação total ou parcialmente recusado, adiado por inviabilidade/inadequação/insuficiência ou ainda ativo com parcela descartada ou condicionada. No construtor, a fonte distribuível correspondente reside em `src/.ia.rules/decisions/`; build/update materializam o mesmo contrato no destino sem criar raiz, índice ou histórico concorrente. O registro complementa, mas NÃO substitui, RCF, FT, issue, `continue.ia`, Git ou fonte da solicitação.

O diretório contém `index.json` geral, schema versionado, modelo canônico e `records/` com registros individuais ou agrupados somente quando compartilhem contexto e permaneçam inequivocamente localizáveis. O índice é conciso, suficiente para triagem sem releitura do acervo e declara, quando aplicável: ID estável `DEC-AAAAMMDD-NNN`, título, estado, escopo, data da decisão, decisão, grau da recusa, motivo resumido, path do registro, artefatos relacionados, condição de reavaliação, última revisão, situação vigente e propriedade. ID usa a data original, sequência única no repositório e nunca é renumerado ou reutilizado. Estados fechados mínimos são `RECUSADO`, `PARCIALMENTE_RECUSADO`, `ADIADO`, `EM_ANDAMENTO_COM_RESTRICOES`, `REABERTO`, `SUPERADO`, `SUBSTITUIDO` e `ACEITO_APOS_REAVALIACAO`; grau é `TOTAL`, `PARCIAL`, `CONDICIONAL` ou `NAO_APLICAVEL`. Estado, grau e situação vigente são dimensões distintas e NÃO DEVEM fazer uma parcela recusada representar a rejeição da solicitação inteira.

Cada registro preserva densamente: solicitação/proposta original ou referência íntegra; contexto e objetivo; parte aceita; parte recusada/adiada/condicionada; fundamentos técnicos, normativos ou arquiteturais; alternativas consideradas; impactos e riscos; condição necessária à reavaliação; referências cruzadas a FTs, issues, commits, RCFs, arquivos e implementações; evolução cronológica; e conclusão vigente. Mera negativa, conclusão sem fundamento, inferência retroativa, data fabricada ou reconstrução sem evidência são proibidas. Migração histórica só PODE ocorrer quando fonte e fundamento suficientes permitirem distinguir fato, contexto, alcance e conclusão; incerteza permanece não migrada e explicitamente diagnosticada, nunca preenchida por hipótese.

Antes de retomar proposta rejeitada, reapresentar solução equivalente, reconstruir implementação descartada, reanalisar questão substancialmente idêntica ou ampliar item ativo por caminho já recusado, planejamento DEVE consultar o índice e registros semanticamente relacionados. Correspondência considera finalidade, efeito, pressupostos, escopo, restrições e artefatos, não apenas palavras; automação PODE apontar candidatos, mas NÃO DEVE declarar equivalência material nem rejeitar proposta diferente sem avaliação contextual. Consulta histórica é obrigação de contexto, não lista negra, proibição permanente, precedente universal ou autoridade para impedir inovação.

Reavaliação DEVE ponderar fundamentos e estado do projeto na decisão anterior; evolução arquitetural, normativa e funcional; fatos, requisitos ou limitações novos; custo estimado; probabilidade fundamentada de conclusão diversa; e risco de regressão ou retrabalho repetido. Mudança material inclui, conforme o caso, requisito, evidência, dependência, arquitetura, contrato, risco, custo, capacidade, ambiente ou restrição que altere premissa ou resultado; mera reformulação, passagem de tempo ou preferência não basta. Sem mudança material, a decisão anterior DEVE ser preservada, salvo justificativa técnica registrada de que nova análise ainda é proporcional. Hipótese manifestamente superada, incompatível, redundante, já resolvida por outro meio ou reproduzida sem fato novo PODE ser descartada imediatamente com referência ao ID anterior e situação vigente.

Registro nunca é removido apenas porque a decisão mudou. Confirmação, revisão, superação, substituição, reabertura ou aceite posterior atualiza estado, última revisão, conclusão e evolução, preservando conteúdo, justificativa original, autorias/propriedade e razão da transição. `REABERTO` exige fato novo ou justificativa de proporcionalidade; `ACEITO_APOS_REAVALIACAO` exige fundamento e vínculo ao que mudou; `SUPERADO` e `SUBSTITUIDO` exigem destino ou motivo rastreável. Mudança relevante em artefato relacionado aciona revisão do registro ou diagnóstico explícito de que permanece válido.

Em solicitação ainda ativa, registra-se somente a parcela recusada, adiada ou condicionada, com vínculo à FT/tarefa, parte aceita e trabalho que prossegue; o registro é atualizado quando a execução alterar pertinência. Sugestão trivial, alternativa sem valor histórico ou negativa cujo custo de registro supere o retrabalho razoavelmente evitável NÃO DEVE ingressar no acervo. Propriedade gerenciada e local usa namespace/política declarados no índice; update faz merge semântico por ID, atualiza somente o gerenciado, preserva registro local/campo desconhecido permitido e bloqueia colisão de identidade, perda ou sobrescrita silenciosa.

Validação DEVE detectar ID duplicado, estado/grau inválido, schema incompatível, path/link/referência quebrada, registro não indexado, entrada sem registro, campo obrigatório ausente, reabertura sem justificativa, transição sem histórico e registro potencialmente obsoleto sem revisão após mudança relevante. A validação é determinística quanto a estrutura e referências; pertinência, equivalência semântica, proporcionalidade e mudança material permanecem julgamento fundamentado. Automação só é implementada quando reduzir Custo Líquido, integra indexador/verificador oficial e NÃO cria comando ou fluxo paralelo.

## 14. Engenharia resiliente de scripts, atualização e distribuição

### 14.1 Contrato comum e resiliência orientada à conclusão

Todo script distribuível DEVE aplicar §§4.0 e 13 e declarar nome, finalidade, sintaxe, parâmetros/ordem/tipos/defaults, configuração, pré/pós-condições, entradas/saídas, estados, efeitos, idempotência, destrutividade, timeouts, retries, concorrência, limites, callbacks, hooks, fallbacks, modos local/CI, plataformas/runtimes, logs, ajuda e códigos `0/1/2/3/4/130`. Contrato derivado por tipo/contexto só PODE especializar diferença material; nomes de scripts, comandos, parâmetros, hooks, callbacks, fallbacks, arquivos e diretórios DEVEM ser canônicos, não ambíguos nem funcionalmente duplicados.

Neste produto, failsafe significa concluir a finalidade por rotas seguras, não apenas falhar sem dano. Falha previsível, conhecida ou documentada DEVE possuir detecção, causa e alternativas finitas predefinidas: retry controlado, backoff, comando equivalente, execução por etapas, revalidação/reconstrução de estado, temporário, checkpoint ou fallback compatível. O script só PODE desistir após esgotar rotas tecnicamente aplicáveis; então restaura ou preserva estado íntegro, informa ambiente, causa, tentativas, incompatibilidades e ação necessária, sem sucesso falso. Quantidade, duração, profundidade e término DEVEM ser limitados; repetição cega ou laço infinito são proibidos.

Extensibilidade usa contrato comum estável para gatilho, hook, callback, expansão, adaptador e fallback. Hook recebe contexto validado, localiza recurso por path normatizado, independe de cwd implícito, propaga argumentos, saída e código, não duplica lógica material e permanece portável. Configuração repetida — valores, paths relativos, strings, padrões, limites e nomes — DEVE ter SSOT sob raiz canônica de configuração em `.ia.rules/`, divisível por escopo com schema, versão, validação e documentação, sem busca/edição dispersa.

Saída humana DEVE ser curta e uniforme, distinguindo progresso, informação, aviso, erro, resultado e ação. Log de máquina/IA DEVE ser estruturado, determinístico e persistente, com contexto, etapa, operação sanitizada, horários, duração, resultado, código, erros, fallbacks e estado final; especialização só acrescenta. Entrada/pré-condição, escopo, segredos, dados e estado preexistente DEVEM ser protegidos por sanitização, mínimos efeitos, permissões mínimas e operação atômica, reversível ou retomável. Diferença de SO, shell, permissão, caminho, caixa, encoding, EOL, runtime, dependência, Git ou release DEVE ser detectada, não presumida; indisponibilidade de um comando não torna a finalidade impossível se houver equivalente seguro.

### 14.2 Atualizador convergente

`update:agents` DEVE operar em instalação limpa, atualização incremental, salto, cópia manual, release coexistente, arquivo ausente/movido/renomeado/legado/parcial, árvore limpa/suja, permissão limitada, interrupção e versão desconhecida. Cada release distribui na raiz `.ia.rules/` marcador nomeadamente versionado e manifesto/mapa suficientes para identificar versão e artefatos oficiais. Após cópia manual, o comando autodetecta marcadores e artefatos antigos, atuais e recém-copiados, reconstrói histórico mínimo, seleciona migrações, remove exclusivamente oficial obsoleto e preserva desconhecido, hook, extensão e temporário autorizado — inclusive localização legada ainda não migrada — até classificar sua propriedade.

A invocação voluntária autoriza substituir/remover, sem confirmação adicional, modificação local inclusive não commitada em `/AGENTS.md` e associados gerenciados; divergência é preservada no backup normatizado antes da convergência. A autorização NÃO alcança `.gitignore`, `package.json`, extensões, hooks ou compartilhado análogo. Antes de mutar, o atualizador registra árvore e índice, classifica oficial imutável, compartilhado e local, e preserva alteração do desenvolvedor. Compartilhado recebe merge cirúrgico sem apagar, regredir ou reformatar; path legado é migrado antes de ser classificado como inválido.

O update DEVE criar um único commit contendo, tanto quanto isolável, apenas núcleo recebido, remoções/limpezas e ajustes correlatos. Compartilhado com delta preexistente inseparável permanece intocado e fora do commit; omissão e ajuste pendente são diagnosticados sem impedir os demais artefatos. Alteração preexistente em oficial gerenciado é substituída e incluída; alteração do desenvolvedor em qualquer outro arquivo NÃO DEVE ser incorporada, perdida, revertida ou confundida. Checkpoints autenticados tornam a operação idempotente, transacional e retomável; lock novo é gravado por último; interrupção retoma ou reverte sem efeito duplicado.

Teste do atualizador DEVE cobrir instalações, saltos, cópia manual, coexistência, Git limpo/sujo, edição indevida oficial, alteração compartilhada, falha primária/fallback, permissões, EOL/encoding/caixa/path, interrupção, parcial, marcador desconhecido/inconsistente, repetição, backup/restauração e preservação de extensões. Critério de aceite exige conclusão pelas rotas seguras ou falha conclusiva íntegra e retomável.

### 14.3 Workflows distribuíveis

CONTRADIÇÃO DETECTADA: origem solicita `.ia.rule` vs raiz exclusiva vigente `.ia.rules` — Aplicando `.ia.rules`, sem alias ou árvore concorrente, e preservando integralmente a intenção de distribuir workflows.

Release DEVE incluir sob `.ia.rules/` todos os workflows GitHub Actions destinados a consumidores, separados dos workflows internos do construtor. Índice canônico humano/máquina declara ID, finalidade, escopo, dependências, permissões, instalação, destino, gatilho, hook/script de acionamento, versão e hash; permite localizar, selecionar, copiar, instalar, atualizar, validar disponibilidade, integridade e atualidade. Workflow DEVERIA ser acionável por hook; quando execução direta for inadequada, adaptador oficial PODE executá-lo sem reduzir obrigatoriedade nem duplicar lógica.

Instalação DEVE ser determinística, reproduzível, idempotente, transacional e compatível com estrutura verificada, preservando customização legítima e impedindo sobrescrita silenciosa, divergência não detectada ou parcial. Workflow e auxiliar aplicam as mesmas regras de compulsoriedade, escopo, exceção, portabilidade, diagnóstico e mecanismo oficial dos scripts. Validação do release comprova presença, índice coerente, distinção interno/distribuível, permissões mínimas, instalação/atualização, acionamento e integridade.

## 15. Engenharia de código, documentação e rastreabilidade material

### 15.1 Intervenção mínima e intenção

Código funcional — função, método, procedure, classe, componente, módulo, fluxo, comando, contrato, estilo, evento, vínculo, dado, retorno e comportamento — NÃO DEVE ser alterado sem necessidade material diretamente relacionada. A implementação adota o menor ajuste cirúrgico suficiente, minimiza superfície, dependências, acoplamento, validação e regressão. Alteração funcional/estrutural exige necessidade técnica concreta, rastreável e proporcional; estética, conveniência, confiança da IA, aparente simplicidade, oportunidade incidental ou desejo genérico de melhoria NÃO bastam.

Intervenção mínima NÃO impede melhoria segura no trecho necessariamente afetado: microfunção, duplicação local, nome, comentário, documentação, validação, erro, desempenho ou organização, desde que local, proporcional, verificável e sem escopo ampliado. Otimização de estrutura, desempenho, leveza, clareza, legibilidade, testabilidade, reutilização, robustez e manutenção é obrigatória quando houver ganho líquido, mas NÃO autoriza reescrita ampla. Refatoração explicitamente solicitada PODE ampliar a intervenção, sem suspender contratos, dados, compatibilidade, integrações ou partes independentes; diante de risco substancial, DEVE evoluir incrementalmente em múltiplos commits/etapas reversíveis.

Mensagem nova durante execução DEVE ser classificada como retoque de rumo, complemento, correção de interpretação/implementação ou revisão ampla amadurecida. Tom, urgência, emoção, concisão, erro gramatical ou momento são contexto, não requisito. Na dúvida, aplicar menor impacto compatível e inspecionar estado real. Pressa, informalidade, comentário incidental ou formulação incompleta NÃO autorizam ampliar escopo, remover comportamento, trocar tecnologia ou inferir preferência material.

Escopos permanecem estritos: visual NÃO autoriza funcional; funcional NÃO autoriza redesign; estrutural NÃO autoriza comportamento; correção local NÃO autoriza revisão global; otimização interna NÃO autoriza contrato externo. Mover/substituir elemento visual NÃO DEVE perder estilo, cor, dimensão, evento, vínculo, acessibilidade, retorno ou comportamento. Acoplamento só é alterado quando indispensável ou quando impedir solução correta.

### 15.2 Microunidades e defesa

Desenvolvimento, correção, evolução e otimização DEVEM favorecer unidades adequadas ao paradigma — microfunções, micrométodos, microprocedures, micro-objetos, microcomponentes, microsserviços ou equivalentes — com responsabilidade delimitada, coesão alta, acoplamento baixo, interface estável, comportamento previsível e autonomia/reutilização suficientes. A granularidade NÃO DEVE criar fragmentação artificial, indireção excessiva, perda de legibilidade ou overhead; DEVE reduzir propagação, duplicação e acoplamento sem prejudicar compreensão, desempenho ou coerência.

Interfaces, parâmetros, retornos, eventos e estruturas DEVEM permitir evolução aditiva compatível quando tecnicamente possível; consumidor alheio ao novo campo/capacidade NÃO DEVE ser alterado, salvo incompatibilidade inerente demonstrada. Antes de codificar, inspecionar dependências, contratos, consumidores, efeitos transitivos, limites e riscos; hipótese não é fato. Durante a codificação, tratar entrada inválida, fluxo incorreto, falha parcial, estado intermediário, concorrência, interrupção, indisponibilidade e dependência ausente com validação, isolamento, idempotência, atomicidade, reversibilidade e diagnóstico proporcionais. Antes da entrega, revisar integralmente o modificado, remover resíduos/duplicações/inconsistências introduzidos e verificar segurança, desempenho, legibilidade, erros e contratos.

Validação é proporcional ao risco e alcança comportamento solicitado e contratos adjacentes. Elemento visual interativo verifica posição, dimensão, estilo, cor, estado, evento, acessibilidade e função; unidade funcional, entradas, saídas, efeitos, exceções e consumidores; refatoração, equivalência, compatibilidade, desempenho e não regressão. Rapidez, tokens ou confiança NÃO reduzem rigor, minúcia, escopo, rastreabilidade ou zelo. Essas regras aplicam-se uniformemente ao construtor e aos consumidores e NÃO PODEM ser diluídas por futura condensação/modularização.

### 15.3 Documentação nativa de unidades

Toda classe, função, procedure, type, interface ou unidade equivalente DEVE conter, quando técnica e linguisticamente aplicável, cabeçalho de documentação nativo/convencional da linguagem, como JSDoc, ShellDoc ou equivalente. O cabeçalho reside somente na fonte, preferencialmente sob `src/` e `scripts/`, e NÃO integra artefato compilado, empacotado, otimizado ou minificado, salvo impossibilidade técnica/formato. Exceção: banner global de autoria, licença e origem continua no produto final comentável conforme §3.11.

O cabeçalho usa sintaxe da linguagem e mínimo de tokens/bytes que preserve precisão: responsabilidade, comportamento, momento/contexto de execução, justificativa técnica, restrições relevantes e reutilização. Informação óbvia, repetição do identificador ou comentário que derive do código sem acrescentar contrato NÃO DEVE ser introduzido.

### 15.4 Rastreabilidade RCF ↔ commit material

Cada parágrafo, item ou sentença de RCF que defina funcionalidade, microfuncionalidade, conceito ou unidade minimamente implementável/segmentável DEVE terminar na mesma linha com `[xxxxxxx]`, os sete caracteres do commit que implementou ou modificou materialmente o código correspondente. Associação é causal e verificável, nunca commit arbitrário ou posterior. Enquanto a implementação ainda não existir, a sentença DEVE usar marcador explícito de pendência normatizado pelo gerador, sem inventar hash; a fase de código substitui-o pelo hash material.

A sincronização DEVE ser determinística, hookable e preferencialmente baseada em diff, histórico e mapa sentença↔artefato. Como o hash não integra o próprio commit material sem ciclo, o fluxo é: (1) commit material; (2) hook/script/workflow atualiza apenas RCFs afetados; (3) commit exclusivo de sincronização; (4) validação/pull seguro antes de prosseguir. Prevenção de recursão distingue commit material de sincronização, rejeita novo ciclo automático e trata concorrência/revisão obsoleta sem sobrescrever trabalho recente.

Automação DEVE detectar ausência, formato inválido, hash inexistente, referência obsoleta, norma sem sincronização e divergência RCF-implementação; associação ambígua falha explicitamente. Edição puramente editorial/normativa NÃO substitui hash material anterior, exceto quando o produto implementado é o próprio normativo, como neste construtor, caso em que o commit material da fonte normativa é causal. Processo, comandos, hooks, workflows, concorrência e limitações DEVEM constar da Norma Operacional. Critério de aceite inclui round trip entre sentença, commit e artefato; ausência de autorreferência; e preservação do hash anterior quando código não mudou.

## 16. Arquitetura contextual da Norma Operacional

### 16.1 Núcleo, papéis, cenários e recursos

O núcleo raiz DEVE conter somente autoridade, precedência, domínios, invariantes, contratos transversais, roteamento e referências indispensáveis. Conteúdo coeso, semanticamente autônomo e condicionalmente aplicável DEVE ser segregado quando sua dispensa reduzir custo efetivo; conteúdo global/frequente ou cuja separação aumente navegação, releitura, dependência ou ambiguidade permanece no núcleo. Divisão apenas para reduzir tamanho físico, sem ganho líquido de rota, é proibida.

Domínios contextuais são:

1. núcleo operacional comum;
2. papel de Repositório Final, inclusive imutabilidade do produto;
3. papel de Repositório Construtor, geração/manutenção/distribuição;
4. cenário de produto, relativo ao target/arquitetura do consumidor;
5. cenário técnico, relativo a situação operacional especializada;
6. contrato de recurso, relativo a script, comando, hook, callback, fallback, extensão ou automação.

Papéis acumulam-se conforme operação. Este repositório carrega construtor ao atuar em `src/`/build/release e Final ao reger sua própria execução; não usa construtor para afastar regra comum nem Final para editar produto fora do processo. Cenário técnico possui finalidade, gatilho, papéis, pré-condições, dependências, fluxo, proibições, resultados e conclusão, sem se confundir com cenário de produto. Criação de issue no construtor DEVE ser cenário técnico próprio cobrindo autorização/proibição, validação atual, generalização, falha oficial versus particularidade local, evidência, risco, reprodução, proposta, código sanitizado, FT/exceção provisória e proibição de tratar a issue após registrá-la.

Regra exclusiva de geração, compilação, validação, empacotamento, versão, release, atualização, distribuição e estrutura-fonte permanece no módulo Construtor. Autoridade, imutabilidade e proibição de edição direta permanecem comuns/Final. Cada recurso oficial possui módulo próprio ou compartilhado apenas sob contrato realmente comum, contendo finalidade, gatilho, precedência, limites, parâmetros, entradas/saídas, estados, efeitos, extensões, hooks, fallbacks, validação e uso correto. Nomes, localização, configuração, retorno, códigos, logs, segurança e extensibilidade comuns ficam centralizados; especialização referencia, não redefine.

### 16.2 Índice e descoberta compulsória

Índice/manifesto global ultrassucinto e estruturado DEVE declarar papéis cumulativos, cenários de produto/técnicos, recursos oficiais, ID, finalidade, gatilhos, obrigatoriedade, path canônico, dependências mínimas, precedência, artefatos e condição de leitura. Formato é escolhido por compreensão, validação e Custo Líquido, mantendo `AGENTS.md` como entrada Markdown. Antes de criar solução, a IA consulta o índice; correspondência de finalidade torna obrigatória a leitura integral dos módulos aplicáveis. Módulo não carregado continua obrigatório quando o gatilho ocorrer; economia resulta da exclusão segura do inaplicável, nunca de opacidade.

Cada módulo declara quando ler/não ler, papel/cenário/recurso, problema, artefatos, contratos comuns, dependências, modalidade e composição simultânea. Roteamento carrega somente núcleo, índice, papéis ativos, cenários/recursos aplicáveis e dependências expressas. Ciclo, órfão, profundidade excessiva, sobreposição ambígua, responsabilidade incerta, duplicação semântica ou carregamento transitivo desnecessário DEVEM ser rejeitados.

Reestruturação/renomeação exige ganho líquido comprovado, migração, referências atualizadas e não regressão; mera redistribuição NÃO muda conceito, intenção, alcance ou autoridade. Medição compara antes/depois: bytes/tokens totais, duplicação, módulos carregados, tokens efetivamente lidos, profundidade, navegação, tempo, precisão, cobertura e interpretação. Testes incluem solicitação global, local, multidomínio e ambígua; Final comum; Construtor apenas produto; Construtor como Final; ambos; cenário de produto; cenário técnico de issue; e uso/extensão/lacuna aparente de recurso. O resultado DEVE selecionar todos e somente os módulos necessários e equivaler à leitura integral.

## 17. Arquitetura multilíngue e distribuição dual de scripts

### 17.1 Fontes, artefatos e runtimes

Todo script executado em Node.js DEVE ter TypeScript como fonte canônica; fonte `.js` manual é proibida. Legado Node.js em JavaScript DEVE ser inventariado e convertido preservando comportamento, contratos, entrada/saída, compatibilidade, efeitos, diagnósticos e integração. A fonte TypeScript DEVE transpilar para JavaScript compatível com Node.js `24+`, com alvo ECMAScript `ESNext` estabilizado aproximadamente um ano antes da versão corrente; baseline, toolchain e matriz DEVEM ser revistos periodicamente e só elevados por necessidade/benefício demonstrável, sem ruptura evitável.

JavaScript em `dist` DEVE ser transpilado, validado, otimizado e minificado sem alterar comportamento, interoperabilidade ou diagnóstico indispensável. Cada release distribui simultaneamente TypeScript e JavaScript correspondentes, com identidade, versão, finalidade e caminho lógico inequívocos; artefato divergente, desatualizado ou sem origem rastreável bloqueia publicação. O consumidor PODE usar fonte, pronto ou ambos conforme ambiente/política.

Release declara, globalmente e por recurso quando diferirem, versões mínima, recomendada, máxima/faixa suportada de Node.js, linguagem, runtime, compilador, transpilador, gerenciador e ferramenta; dependências, alvo, formato de módulo, plataformas testadas e limites; fonte→build; versões de toolchain; SO, shells, frameworks e ambientes validados. O build DEVE ser reproduzível sem obrigar o consumidor a reconstruir artefato pronto.

TypeScript obrigatório limita-se a Node.js. Python, Ruby e outras linguagens DEVEM ser admitidas quando o ecossistema, Jekyll, SO, framework ou ferramenta as exigir; cada recurso declara versões e dependências com igual rigor. Linguagem é escolhida pelo contexto real; conversão artificial para TypeScript que reduza compatibilidade, integração, simplicidade ou confiabilidade NÃO DEVE ocorrer.

### 17.2 Estrutura e reutilização

Estrutura estável DEVE separar fontes, transpilados, módulos comuns, scripts de cenário, linguagens, metadados, matrizes e suporte sob paths canônicos equivalentes entre fonte/build/distribuição. Recurso específico permanece próximo ao cenário/contexto; centralização global exige reutilização real ou ganho verificável. Tipos, funções, microfunções, classes, validadores e adaptadores reutilizáveis DEVEM formar módulos coesos compartilhados; abstração NÃO DEVE fundir responsabilidades, impor dependência ou elevar particularidade a contrato global. Especialização compõe unidade comum sem corromper autonomia.

Todo script, qualquer linguagem, aplica §§14–15: responsabilidade delimitada, validação, erro explícito, diagnóstico, determinismo, idempotência, proteção parcial e resiliência a SO, permissão, rede, filesystem, concorrência, encoding, shell, runtime, dependência, ferramenta e versão. Recuperação progressiva usa estratégias finitas; falha conclusiva preserva consistência e informa tentativas. Hooks de descoberta, instalação, acionamento, validação e atualização DEVEM ser normatizados sempre que viáveis; adaptador indireto propaga argumento/código/diagnóstico e NÃO duplica lógica.

### 17.3 Atualização seletiva e release

Antes de instalar/atualizar, detectar runtimes/versões, plataforma, arquitetura, ferramentas, estrutura, customizações e artefatos. Metadados determinam, por recurso, alternativa compatível mais estável e menos invasiva. Elevação de Node/Python/Ruby NÃO atualiza recurso independente ainda válido. Gerenciado intacto, customização legítima, divergência acidental e obsoleto DEVEM ser distinguidos; somente customização permitida recebe merge/preservação, enquanto path gerenciado converge conforme §14.2.

Incompatibilidade isolada DEVE usar artefato alternativo, orientar/efetuar atualização autorizada, manter versão funcional, desabilitar apenas o recurso ou falhar localmente com diagnóstico. Atualizador NÃO DEVE instalar runtime global, trocar versão/gerenciador, alterar `PATH`, remover dependência ou reconfigurar sistema sem norma, necessidade e autorização. Aplicação usa temporário, backup proporcional, validação pré/pós e rollback, impedindo mistura e parcial.

Release transpila, otimiza, minifica, valida e empacota Node.js; prepara/valida outras linguagens; gera metadados/matriz; verifica equivalência/atualidade e bloqueia publicação parcial. Testes abrangem TypeScript, transpilado, linguagens adicionais, módulos, versões mínima/recomendada, formatos, hooks, update seletivo, customização, retry/fallback/rollback, SO e integridade. Aceite exige conversão integral do legado, dualidade, baseline Node `24+`, alvo conservador, runtimes por recurso, estrutura, reutilização adequada, atualização não destrutiva, falha segura e build reproduzível.

## 18. Recuperação normativa, grafo e custo contextual

### 18.1 Decisão sobre técnicas de RAG

RAG é conjunto candidato de princípios editoriais/arquiteturais para aperfeiçoar escrita, recuperação, roteamento, leitura e interpretação da Norma Operacional; NÃO é dependência ou autoridade. Avaliação DEVE comparar segmentação semântica, granularidade/overlap de chunks, metadados, índices lexicais/semânticos, busca híbrida, expansão/sinônimos, reranking, filtros de escopo/precedência, referências, resumos hierárquicos, cache, deduplicação, compressão e recuperação orientada à tarefa.

Cada técnica é aprovada, rejeitada ou adiada por métricas de aplicabilidade, compatibilidade, implementação/manutenção, artefato, precisão, cobertura, latência, tokens, interpretação, rastreabilidade, fragmentação, recuperação incompleta e regressão. Tendência, analogia ou benefício presumido NÃO autorizam adoção. Ausência de ganho líquido implica rejeição, sem afastar índice/grafo determinísticos obrigatórios. Embeddings, banco vetorial, reranking por modelo, armazenamento ou serviço externo só PODEM entrar se superarem índice local, grafo, busca textual e metadados; devem ser opcionais, substituíveis e justificadamente open source/gratuitos/offline ou, se cloud, com manutenção, privacidade e custo resumidamente explicados ao desenvolvedor antes da decisão.

Baseline mede tempo de recuperação, tokens carregados, precisão, cobertura, taxa de regras relevantes, irrelevância, falha de precedência, retrabalho, latência, indexação e recursos em tarefas simples, extensas, transversais, conflitantes e com especialização local. Técnica só se torna normativa por benefício recorrente superior a custo/risco, sem perda de precisão, completude, legibilidade, rastreabilidade, determinismo ou autoridade. Adoção é incremental, compatível, reversível e reavaliável.

### 18.2 Preservação e suficiência

Fonte canônica continua `AGENTS.md`/associados; índice, mapa, resumo, grafo, chunk e cache são derivados, apontam à origem e NÃO a substituem. Geração, condensação, roteamento e atualização NÃO DEVEM diluir força, alcance, exceção ou precedência; validação detecta desaparecimento, redução modal, quebra de referência e omissão. Unidade recuperável conserva sujeito, modalidade, escopo, restrição, exceção, precedência, dependência e aplicação; microconceito centralizado usa ID estável sem exigir buscas frágeis.

Roteamento seleciona por contexto, escopo, papel, cenário, fase, linguagem, componente, artefato e operação, mas carrega globais, precedências, dependências, exceções e decisões anteriores suficientes. Planejamento potencialmente repetido consulta também o Registro Decisório de Recusas de §13.6; o índice normativo localiza regras e o índice decisório localiza precedentes contextuais, sem intercâmbio de autoridade. Visão geral compacta preserva objetivo e impactos transversais. Antes de agir com contexto parcial, verificar completude; baixa confiança, conflito, rota ausente ou fragmentação aciona expansão ou leitura integral. Norma não recuperada NÃO é norma inexistente. Metadado compacto PODE declarar escopo, prioridade, dependência, artefato, linguagem, fase, tarefa e sinônimo quando ganho demonstrado, sem duplicar a norma. Match exato, ID, escopo e precedência prevalecem sobre similaridade.

Sobreengenharia é proibida: formato artificial, fragmentação excessiva, ilegibilidade, dependência de ferramenta e navegação maior que o ganho bloqueiam adoção. `AGENTS.md` permanece Markdown de entrada; formatos associados alternativos só PODEM ser mais adequados à lógica normativa, leves e legíveis nos consumidores. Texto discursivo/justificativo permanece natural quando condensação prejudicar entendimento.

### 18.3 Indexador e grafo global

Arquivo estruturado canônico em localização estável DEVE representar, sem copiar conteúdo, todos os nós normativos, paths, relações, tipos, custos e metadados mínimos. Cada nó tem ID estável, path com caixa exata, papel, entradas/saídas e é exclusivamente: **folha** (terminal sem derivação), **derivação** (encaminha e não é terminal) ou **híbrido** (conteúdo terminal e deriva).

Cada aresta é **imediata** — leitura do nó cessa no link e conteúdo posterior é excluído do caminho — ou **passiva** — deriva após leitura integral. Posição/tipo seguem dependência semântica; imediata só é válida quando nada posterior for necessário. Automação rejeita nó inexistente, ID duplicado, link quebrado, papel incompatível, aresta sem tipo, ciclo não autorizado, rota inalcançável, folha com saída, derivação terminal e ambiguidade. Custo/badge NÃO DEVE poluir fonte sob `src/`.

### 18.4 Tokenização e custos

Script canônico DEVE inspecionar fontes, validar/simular grafo, calcular caminhos, atualizar índice, gerar mapa visual e métricas README. DEVERIA atuar como conector de biblioteca open source mantida/confiável em vez de reimplementar tokenizer, salvo impossibilidade comprovada. Para cada alvo, usa tokenizer oficial ou equivalente bit a bit e registra modelo, tokenizer, versão, encoding e serialização. Múltiplos alvos têm resultados separados; estimativa NÃO é exata. Mudança de modelo/vocabulário/encoding/biblioteca invalida contagens.

Contagem reproduz somente conteúdo efetivamente transmitido. Em aresta imediata, custo inclui início até link inclusive mais predecessores; em passiva, nó integral mais predecessores; folha/híbrido terminal inclui seu conteúdo integral; mesmo nó por rota/condição distinta mantém custos distintos. Caminhos acumulam raiz→derivação→terminal, respeitando ordem, compartilhamento e não duplicação contextual.

Execução exibe progresso ultrassucinto com etapa, estado, arquivo/nó e falha. Resumo final apresenta, separadamente para folha e híbrido terminal, mínimo, média e máximo de caminhos válidos; inclusão, rotas múltiplas e ponderação são determinísticas/documentadas. README contém região preexistente inequivocamente demarcada e exclusivamente gerenciada com métricas, tokenizer, versão, data/commit e link ao mapa; conteúdo adjacente NÃO é reformatado/movido. Mapa `.md` sob documentação gerada centralizada mostra nós, papéis, arestas, caminhos e custos e explica custo até derivação, imediato, passivo, híbrido, folha e variação por rota. Índice, mapa, tabela e cache possuem origem, versão, geração determinística e validação de obsolescência.

### 18.5 Workflow e segurança

Push que altere `src/**/AGENTS.md`, normativo/roteador `.md` em qualquer profundidade ou script, tokenizer, configuração, índice/gerador capaz de mudar resultados DEVE acionar workflow específico. Ele valida grafo, recalcula, atualiza índice/mapa/README e registra alterações. Filtro evita arquivo alheio; commit automático tem marcador anti-recursão sem dispensar mudança material posterior. Concorrência, branch, push obsoleto e divergência DEVEM impedir sobrescrita, parcial ou artefato de revisão antiga.

Grafo inválido, tokenizer indisponível, divergência, derivado obsoleto ou fonte alterada sem regeneração é falha bloqueante. O mesmo script roda localmente com resultado equivalente e integra hooks oficiais. Alteração de AGENTS, RCF ou fonte que afete roteamento invalida/regenera derivados; obsoleto NÃO orienta execução.

Operação é local, reproduzível, cross-platform e independente de serviço pago/remoto. Conteúdo privado, código, documento ou metadado do consumidor NÃO DEVE sair para serviço externo sem norma e configuração explícitas. Indexação respeita escopo, exclusão, segredo e inelegível. Economia de tokens NÃO DEVE impor custo financeiro, computacional ou operacional global superior.

Decisão normativa desta revisão: adotar parcialmente princípios determinísticos de RAG — unidades recuperáveis, IDs, metadados mínimos, busca lexical/por ID, filtros de precedência, roteamento, grafo, cache validado e fallback integral — porque são compatíveis com a arquitetura vigente e verificáveis. Embeddings, banco vetorial, similaridade semântica, expansão automática e reranking por modelo NÃO são adotados; permanecem candidatos condicionados a baseline e ganho líquido futuro, sem impedir o índice/grafo obrigatório.

## 19. Sintaxe lógica normativa condicionada

### 19.1 Decisão e gate

Nenhum token lógico novo é aprovado nesta revisão: não existe corpus medido suficiente para demonstrar ganho líquido recorrente superior ao aprendizado, parsing, manutenção, ambiguidade e migração. Linguagem natural com modalidade RFC 2119 e referências `MN-*` permanece canônica. FT-051 DEVE comparar o padrão vigente com candidatos; somente resultado mensurável PODE aprovar subconjunto mínimo, por nova decisão normativa rastreável antes de qualquer parser/migração. Preferência estética, analogia com programação ou economia presumida NÃO autorizam adoção.

A avaliação mede bytes, tokens, tempo de leitura, precisão, ambiguidades, erro de aplicação, legibilidade humana, facilidade de edição, validação e manutenção em corpus com condição simples/encadeada, exceção, `AND|OR|XOR|NOT`, precedência, loop finito, desvio, aninhamento, conflito documental e caso em que linguagem natural é superior. Para cada trecho candidato, forma compacta DEVE conservar sujeito, modalidade, escopo, condição, exceção, precedência e resultado. Ausência de ganho ou aumento de risco rejeita o token.

### 19.2 Contrato de eventual subconjunto aprovado

Podem ser avaliados `IF`, `ELSEIF`, `ELSE`, `ENDIF`, `WHILE`, `ENDWHILE`, `FOR`, `ENDFOR`, `GOTO`, `AND`, `OR`, `XOR`, `NOT` e somente equivalentes estritamente necessários. Sinônimo, alias, forma redundante ou operador sem uso comprovado NÃO integra o padrão. Token aprovado deve ter identidade visual distinta de linguagem natural, exemplo, código e ID; definição central única; gramática, aridade, escopo, precedência, associatividade, agrupamento, delimitadores, fechamento, composição, aninhamento, erro e expansão natural inequívocos.

Construção válida admite uma interpretação e NÃO depende de entonação, implícito, whitespace informal ou inferência. `IF/ELSEIF/ELSE` exige condição verificável, alternativas compreensíveis e bloco explícito. `OR` é inclusivo, `XOR` exclusivo; expressão cuja precedência possa variar usa agrupamento obrigatório. `WHILE/FOR` só representa repetição finita, controlada e verificável com limite/término/interrupção; laço indefinido é proibido. `GOTO` só roteia para ID/path estável e validável e NÃO cria fluxo opaco, ciclo, salto sem contexto ou espaguete. Cada bloco define início/fim, sentenças controladas e normas externas ainda aplicáveis.

Aninhamento tem limite proporcional à legibilidade; quando piorar compreensão/custo, segrega-se em microconceito. Token organiza fluxo, mas NÃO substitui sujeito, obrigação, condição material, exceção, justificativa ou validação. Representação DEVE ser humana e parseável sem treinamento externo, compatível com Markdown, links, listas, tabelas, blocos, linters e ferramentas, distinguível de código executável e usar o menor custo sintático compatível com segurança. Texto discursivo, contexto histórico, exemplo explicativo ou conceito prejudicado por condensação permanece natural.

Toda construção aprovada DEVE expandir deterministicamente para linguagem natural equivalente. Migração é incremental, revisável, reversível e individualmente validada, começando em alta repetição/baixo risco; conversão global automática é proibida. Legado e novo coexistem sem conflito; ausência da sintaxe nova não reduz validade. Se ultrapassar convenção editorial, parser detecta token desconhecido, bloco aberto, operador/destino inválido, aninhamento, ciclo e ambiguidade; formatter proporcional preserva conteúdo e aplica whitespace/indentação canônicos. Validação futura detecta perda de cláusula, exceção, operador ou fechamento.

A aprovação futura DEVE atualizar este RCF com decisão, gramática, tabela, semântica, precedência, exemplos válidos/inválidos, estilo, migração, compatibilidade, validação e inaplicabilidade antes de FT de código. Até isso ocorrer, FT-052 NÃO DEVE implementar parser ou formatter.

## 20. Matriz de reconstrução e gates de conclusão

### 20.1 Origem → contrato permanente

| Origem material | Contrato canônico |
|---|---|
| `github:jcempro/agents.md#9` | §§13.1–13.5, 14.1, 16, 18 e proteção inicial |
| atualização resiliente | §§0.0.2, 14.1–14.2 |
| scripts resilientes/padronizados | §§4.0, 13.5, 14.1 |
| solicitações faseadas e segmentação | §§0.0.1, 13.4 |
| intervenção mínima e codificação | §§15.1–15.2 |
| modularização e roteamento | §§16, 18.2–18.3 |
| papéis, cenários técnicos e recursos | §§0.0.3–0.0.4, 16 |
| documentação nativa | §15.3 |
| hash material por sentença RCF | §15.4 |
| workflows distribuíveis | §14.3 |
| arquitetura multilíngue | §17 |
| RAG, grafo, tokenização e mapa | §18 |
| sintaxe lógica | §19 |
| registro indexado de decisões recusadas | §§13.6, 18.2 e 20.2 |
| reavaliação de `github:jcempro/agents.md#2` | §20.3 |

Esta matriz é bidirecional: toda implementação posterior DEVE apontar à seção; toda seção com implementação DEVE apontar ao artefato/teste e, após §15.4 materializado, ao commit causal. O relatório de FT registra arquivos, conceitos centralizados, duplicações removidas, referências, contratos preservados, lacunas, testes, limites, não regressão e métricas de bytes/tokens/rotas.

### 20.2 Aceite das fases

FT normativa só conclui quando requisito, detalhe, exceção, motivação, relação e critério das origens estiverem no RCF sem duplicação desnecessária e as FTs posteriores estiverem coerentes. Registro temporário e contextos são removidos somente depois da auditoria bidirecional. FT de `src/` comprova equivalência RCF→Norma Operacional, autoridade, descoberta, rotas e métricas, sem implementar código. Para §13.6, a fase `src/` cria diretório, índice, schema, modelo e somente registros historicamente comprovados; valida manualmente estrutura e vínculos e não marca solicitação inteira por parcela recusada. A fase de código integra validação proporcional ao mecanismo oficial para detectar inconsistências estruturais e referências, sem automatizar equivalência semântica, mudança material ou rejeição. FT de código comprova contratos comuns, atualizador, TypeScript/distribuição dual, runtimes, workflows, grafo/tokenização/mapa, rastreabilidade, corpus, cross-platform, reprodutibilidade, privacidade, segurança e ausência de fluxo paralelo.

Validação automática DEVE detectar nomes oficiais alterados, script/comando/workflow duplicado, fluxo paralelo, gatilho substituído, publicação local proibida, hook contornado, extensão fora do ponto, norma adaptada ao código, Princípio Estruturante degradado, ciclo/órfão/profundidade, duplicação semântica, temporário retido/removido indevidamente, compactação com perda, diagnóstico suprimido, processo desacoplado opaco, promoção incompatível, exceção sem vínculo/reversibilidade/remoção, runtime/artefato divergente, hash material inválido, derivado obsoleto e as inconsistências estruturais do Registro Decisório enumeradas em §13.6. Quando automação integral for impossível, verificação determinística documentada é obrigatória.

### 20.3 Gate terminal da issue #2

`github:jcempro/agents.md#2` somente DEVE ser reavaliada após todas as demais unidades de §§13–19 estarem implementadas, validadas e refletidas no estado real. A avaliação compara issue, código, normas, releases e correções posteriores; determina com fundamentos verificáveis se a proposta permanece aplicável, pertinente e necessária. Independentemente do resultado, DEVE publicar comentário técnico conciso, inequívoco e incisivo na issue; nota `0–10` PODE destacar relevância, impacto, validade ou prioridade sem prolixidade. Esse gate NÃO autoriza reavaliação, comentário ou mutação remota durante a fase RCF.
