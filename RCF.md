# RCF — Criação e Reconstrução da Governança Operacional e dos Cenários

## Apendice - GESTAO DE CONTEXTO (RFC_COMPLIANT)

- O Agente DEVE executar `/compact` para comprimir o histórico sob alto volume de mensagens (12+). Quando a plataforma não expuser `/compact`, `agent:compress` DEVE gerar projeção resumida e retomável a partir da memória canônica, atualizar somente derivados autorizados e NÃO DEVE apagar FT dentro da retenção.

## 0. Finalidade, escopo e autoridade

> Target Construtivo: `./src/`.
>
> Topologia obrigatória: raiz do repositório `./`; estrutura-fonte `./src/`; raiz do artefato publicado `./dist/`. `./` organiza e governa, `./src/` contém o produto-fonte e `./dist/` é a superfície distribuível; a raiz da aplicação é declarada pelo cenário e, em Web Page Like, coincide com `./dist/` e com `/` público. Esses domínios NÃO são equivalentes.

Este RCF define as regras de negócio necessárias para reconstruir, validar e evoluir a arquitetura normativa composta por:

- [objetivo] `AGENTS.md`: governança operacional global da IA ;
- [!objetivo] `agents.local.md`: extensão local opcional [referência];
- [!objetivo] `continue.ia` ou `continue.dev`: memória operacional oficial [referência];
- [objetivo] arquivos especializados de cenário, inicialmente `webPageLike.md` e outros;
- [secundário] RCFs globais/específicos, README e demais documentos subordinados <sup>1</sup>.

Seu objetivo não é reproduzir texto literal, mas preservar integralmente comportamento normativo, domínios, precedências, contratos, exceções, rastreabilidade e extensibilidade. Qualquer implementação conforme este RCF deve ser semanticamente equivalente ou superior, nunca mais fraca.

Se a edição/alteração a ser feita em AGENTS.md`ou cenários for alterar algo que já esteja rigoroso, bem incisiva ou mais rigorosa, incisiva e especializada do que a proposta atual de edição/alteração, não regreda, exceto se explicitamente solicitado e, neste caso, prefira adicionar ponto(s) de exceção se for possível, mantendo aderência ao minimo de tokens e a Regra de Ouro.

**<sup>1</sup> Secundário:** neste caso específico, o _target_ é o RCF localizado no root do próprio repositório, atualizar sua especificação conforme solicitações explícitas do desenvolvedor, preservando e consolidando todos os aprimoramentos já incorporados, vedando regressões. Sempre que modificações no **Target Construtivo** alterarem, ampliarem, restringirem ou impactarem regras de negócio, garantir seu espelhamento integral, consistente e sincronizado no próprio RCF.

### 0.0.1 Projeção RCF → fonte normativa

O RCF é a especificação de maior explicação do produto normativo em `./src/`: DEVE registrar finalidade, motivação, domínio, limites, exceções, alternativas rejeitadas, precedência, transição e critérios de validação suficientes para preservar interpretação e permitir correção posterior. `src/AGENTS.md` é a projeção operacional concisa dessa especificação: DEVE ser aderente, referenciável e não introduzir negócio autônomo. Portanto, solicitação de ajuste, aprimoramento, correção ou melhoria que toque regra, cenário, capacidade, script, hook, contrato, caminho, build, atualização ou validação DEVE atualizar RCF e fonte na mesma FT; o RCF DEVE conservar o contexto adicional e AGENTS DEVE conservar a instrução executável correspondente. Divergência entre ambos bloqueia conclusão, build distribuível e atualização.

**referência**: a normatização correspondente deve ser feita, mas a criação do arquivo não.

### 0.0 Topologia, segregação e precedência arquitetural

A raiz do repositório contém exclusivamente governança ativa, documentação, manifesto, automação e infraestrutura transversal. Implementação, código-fonte e recursos internos DEVEM permanecer em `./src/` ou estrutura-fonte equivalente; essa estrutura NÃO é a raiz da aplicação. Exceção exige imposição verificável de framework, convenção obrigatória do ecossistema, gerador ou compilador. Conveniência NÃO constitui exceção. `./dist/` contém somente o artefato distribuível/publicado e NÃO DEVE depender de `./src/` em caminho, manifesto ou runtime. Em cenário Web Page Like, raiz da aplicação e `./dist/`/saída declarada correspondem ao `/` público percebido pelo usuário e NÃO DEVEM expor fonte interna. AGENTS possui precedência operacional: RCF somente especializa o produto sem deslocar a governança ativa, inverter os roots ou reduzir esta segregação. Neste repositório produtor, `./src/AGENTS.md` e associados são a fonte construtiva da governança distribuível, não a governança ativa desta execução; sua manutenção é autorizada pela FT do produto. Após materialização no consumidor, tornam-se núcleo gerenciado: não aceitam edição local para alterar comportamento, que DEVE usar `agents.local.md`, `./.agents/local/`, `./.agents/hooks/` ou adaptador subordinado e preservável. O espelho local entre governança ativa e fonte distribuível somente valida o pacote produzido; NÃO altera consumidor e NÃO participa do `agents:update` de outro repositório.

### 0.1 Regra de ouro ao criar, editar e refatorar

Maximizar a informação por caractere mediante normas coesas, baixo acoplamento, mínima redundância, máxima reutilização e microtextos reutilizáveis, referenciáveis e de alta densidade informacional; eliminar introduções extensas, floreios, preenchimentos, repetições e explicações óbvias, preservando integralmente regras, restrições, exceções, prioridades, precedências, condicionantes, dependências, precisão, profundidade, contexto, rastreabilidade, nuances interpretativas, exemplos, analogias, contraexemplos e referências úteis. Priorizar referências internas e microexplicações sempre que reduzirem tokens sem perda semântica, sobretudo em documentos destinados a máquinas ou IAs. **Concisão reduz somente a forma, nunca a substância; toda redução que suprima significado, rigor ou rastreabilidade é degradação, não otimização.**

### 0.2 Perfil editorial

Aplicar **75% máquina/IA; 25% humano**:

- sintaxe normativa, - consisão, elevado rigor, insicividade determinística, modular e indexável;
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

**IMPORTANTE:** Distinguir rigorosamente o domínio normativo de IA do repositório do domínio de negócio. `./AGENTS.md`, `./.agents/` e demais importações, pertencem ao repositório enquanto projeto e constituem as únicas normas, diretrizes e metadados válidos para orientar a atuação da IA. Já `./src/AGENTS.md`, `./src/.agents/` e demais importações, aninhadadas sob `src`, `dist` ou outra estrutura equivalente, pertencem ao objeto de negócio produzido ou mantido pelo repositório e, embora possam possuir estrutura, nomenclatura ou conteúdo semelhantes, devem ser tratados exclusivamente como artefatos do projeto. A IA poderá lê-los, validá-los, compará-los, gerar, editar, refatorar ou manter seu conteúdo, porém jamais deverá interpretá-los como normas aplicáveis à sua própria atuação, incorporá-los ao seu contexto normativo, alterar seu comportamento com base neles ou permitir que influenciem, substituam, complementem ou contaminem as diretrizes vigentes do domínio normativo, salvo determinação explícita em sentido contrário.

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

### 1.4 Extensão local

`agents.local.md`, quando existir, contém apenas particularidades operacionais não replicáveis do repositório. No consumidor, é a via mandatória para especializar comportamento de governança gerenciada, com `./.agents/local/`, `./.agents/hooks/` ou adaptador declarado; essas extensões são carregadas subordinadamente e preservadas pela atualização. Não pode receber regra potencialmente global, substituir RCF ou alterar diretamente `AGENTS.md`/associado gerenciado.

### 1.5 Precedência

Após instruções superiores da plataforma:

1. **Governança operacional:** `AGENTS.md` → RCF global → RCF específico → README → memória operacional → demais documentos.
2. **Projeto/negócio:** RCF global → RCF específico → README → memória operacional → demais documentos; `AGENTS.md` permanece obrigatório quanto ao método.
3. **Regra local:** `agents.local.md`, limitada pelo `AGENTS.md` e RCFs.

Regra específica prevalece sobre geral somente em seu escopo e sem contrariar norma superior.

### 1.6 Composição de cenários e extensões executáveis

Especialização DEVE usar composição antes de herança. Herança única PODE existir quando contrato, estado, ciclo de vida e substituibilidade forem estáveis; herança múltipla NÃO DEVE ser usada para agregar capacidades de borda. `Web Page Like` permanece cenário de consumo final, porém DEVE compor capacidades Web independentes — interface de navegador, saída estática, hospedagem, publicação editorial e outras aplicáveis — em ordem declarada, sem assumir Jekyll, GitHub Pages, gerador, hospedagem ou VCS exclusivos. Capacidade estática, hospedagem GitHub Pages, Jekyll e Git de sites DEVEM poder existir isoladamente, ser combinadas quando compatíveis e validar a combinação real.

Núcleo reutilizável fica em `./.agents/core/`; cenário fica em `./.agents/scenarios/<domínio>/<nome>/`, com `scenario.md`, `scripts/`, recursos e contratos somente daquele escopo. Script transversal fica em `core/runtime/scripts/`; script de cenário fica no diretório do cenário. Repositório consumidor especializa somente por `agents.local.md`, `./.agents/local/`, `./.agents/hooks/` ou adaptador declarado, nunca movendo comportamento local ao núcleo distribuído.

Capacidade ou script plugável DEVE declarar identidade, tipo, versão, dependências requeridas/oferecidas, eventos, validação, execução e descarte quando aplicável. Interface deve validar método, variável e versão antes do uso; estado NÃO DEVE ser exposto mutável, devendo usar getter imutável e setter/ação validada, auditável e autorizada. Camada intermediária só PODE fazer passthrough quando observar entrada, saída, alteração e evento. Eventos/hooks DEVEM alcançar núcleo, capacidades, cenário e adaptador final; camada intermediária NÃO DEVE isolá-los, absorvê-los ou renomeá-los sem contrato. Falha DEVE identificar camada, evento e contrato, sem impedir a observação das demais camadas quando isso não violar segurança ou consistência.

---

## 2. Arquitetura documental obrigatória

### 2.1 Artefatos

A arquitetura deve suportar:

```text
AGENTS.md
├── agents.local.md              # opcional; particularidades locais
├── continue.ia | continue.dev   # exatamente um arquivo canônico
└── .agents/
    ├── core/                     # conceitos, contratos, atualização e runtime transversal
    │   ├── contracts.md
    │   └── runtime/scripts/
    └── scenarios/<domínio>/<nome>/
        ├── scenario.md
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

Diretório de cenário DEVE ser a unidade coesa de distribuição: sua norma, scripts, testes, assets e metadados ficam aninhados nele, salvo componente comprovadamente transversal promovido a `core/`. Índice DEVE mapear caminho, tipo, dependências e camada; build DEVE preservar a relação sem vazar `src/`; atualizador DEVE descobrir recursivamente conteúdo gerenciado, preservar extensões locais e rejeitar colisão ambígua.

### 2.3 Proibição de duplicação

Regra deve existir em um único nível:

- multicenário comprovada → item 17;
- cenário específico reutilizável → arquivo de cenário;
- projeto específico → RCF;
- operação local específica → `agents.local.md`;
- estado de execução → memória operacional.

Repetição só é admitida como microresumo com referência explícita à autoridade original.

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
Solicitação → intenção → FT → planejamento → execução incremental
→ atualização contínua da memória → validação → commit → push → próxima etapa
```

Antes de implementar: identificar intenção; localizar/criar FT; classificar continuação, ampliação, dependência ou nova FT; identificar etapa/tarefa; atualizar planejamento; executar do estado registrado.

### 3.6 Seção 5 — Frentes de Trabalho

Cada solicitação pertence a exatamente uma FT; várias podem coexistir.

Campos mínimos:

- id permanente `FT-NNN`;
- nome, objetivo, prioridade, status;
- escopo `Técnico` ou `Negócio`;
- início, última atualização, conclusão;
- etapas, tarefas e estado de retomada.

Escopos:

- **Técnico/The Engine:** constrói ou corrige mecanismo, estrutura ou sistema.
- **Negócio/The Substance:** produz conteúdo/informação que trafega na estrutura.

FT pode ser segregada em subarquivo versionado quando reduzir contexto; padrões do `.gitignore` não podem ocultá-la.

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

- identidade, escopo, objetivo, prioridade, status e `YYYYMMDD.HHMM.SS`;
- etapa/tarefa atuais e listas completas;
- progresso, próximo ponto, raciocínio objetivo;
- decisões, verificações, comandos, pendências, limitações;
- hipóteses descartadas, falhas, causas e decisões antirretrabalho.

Nunca registrar apenas posição; usar FT, etapa e tarefa identificadas.

Atualizar continuamente, não só em conclusões.

Aprendizado de ambiente:

- `MACHINE_ID`;
- `DATA_REF` em `YYYYMMDD.HHMM.SS`;
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
- marcações `PRESERVADO`, `FIX-BUG`, `PROTECAO`;
- estilo determinístico, sem “eu”, “você”, “nós”, “talvez”, “provavelmente”;
- ambiguidade: interpretação mais restritiva, menor alteração, maior preservação; insolúvel → `AMBIGUIDADE INSOLUVEL: <ponto>. Preservando original.`;
- validação objetiva e documentação correlata.

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

Aplicar `MN-CLI` e `MN-META`. Script reutilizável DEVE declarar contrato comum, `--help`, parâmetro tipado/default, saída, erro, modo local/CI, configuração, compatibilidade, hook/adaptador e código `0/1/2/3/4/130`; argumento desconhecido falha, salvo `--` documentado para extensão. Conteúdo gerenciado NÃO DEVE receber edição local para especialização; configuração, hook e adaptador locais DEVEM residir fora dele, permanecer subordinados e NÃO DEVEM ser sobrescritos por atualização. Metaarquivos gerenciados ficam em `./.agents/meta/<contexto>.md`, são indexados/distribuídos recursivamente e segmentam `cli`, `build`, `release`, `publish`, `maintenance`, `update`, `validation` e `ia` quando aplicáveis. Cada comando carrega somente `cli` e o contexto pertinente; README/RCF referenciam, sem repetir contratos. Release inclui scripts, metaarquivos, manifesto, dependências declaradas, hooks e exemplo mínimo, mas NÃO inclui dependência instalada salvo autonomia expressa.
- **Qualidade:** `agent:test`, `agent:test:<grupo>`, `agent:lint`, `agent:format`, `agent:typecheck`, `agent:benchmark`, `agent:security`, `agent:analyze`.
- **Dependências:** `agent:deps`, `agent:update-deps`, `agent:licenses`.
- **Documentação/governança:** `agent:index`, `agent:map`, `agent:handoff`, `agent:docs`, `agent:rcf`, `agent:agents`.
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

- reside em Markdown independente;
- é extensão direta do AGENTS, não RCF;
- permanece genérico para sua categoria;
- declara definição, escopo, aplicabilidade, limites, dependências, contratos, regras, exceções, precedência, segurança, privacidade, acessibilidade, desempenho, compatibilidade, validações e conclusão;
- referencia regras gerais em vez de copiá-las.

### 4.4 Carregamento

Antes de implementar:

1. classificar projeto/entrega;
2. localizar cenários no índice;
3. carregar integralmente arquivos e dependências;
4. aplicar cumulativamente AGENTS, cenários e RCF;
5. registrar cenários aplicados e dispensas na memória.

Arquivo ausente, ilegível, divergente ou com dependência irresolvida é falha normativa; inferência silenciosa é proibida.

### 4.5 Índice inicial

O índice deve registrar:

- **Web Page Like** → `webPageLike.md` §1;
- **Web Page Like com gerador estático/hospedagem** → `webPageLike.md` §2; depende de §1;
- **Sites/blogs com conteúdo editorial** → `webPageLike.md` §3; depende de §1 e §2 quando aplicável.
- **Release** → `release.md`; aplica-se somente a versão/tag/asset/release publicável.
- **Publicação de Conteúdo** → `publish.md`; aplica-se somente a artefato de Negócio publicável e depende do cenário técnico/RCF pertinente.

Novo cenário exige somente novo arquivo, nova linha no índice, dependências e validação de não duplicidade.

---

## 5. Contrato de `webPageLike.md`

O arquivo herda o item 17 e contém três cenários cumulativos: Web Page Like, gerador/hospedagem e conteúdo editorial.

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

Componente como `carregandoPagina` contém indicador central e barra fixa superior de `0.5rem`, separada da animação.

Progresso acompanha DOM/recursos quando possível, distingue real/estimado, degrada seguramente, suporta conexões lentas e baseline mínima de navegadores de 2018 na ausência de outra, permanece leve e local.

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

Workflow ao menos diário, na zona de publicação; `00:01` quando adotado deve converter fuso explicitamente.

Fluxo: verificar → selecionar elegíveis → preparar → compilar → atualizar público → publicar → validar → registrar.

### 5.3.2 Distribuição

Distribuição externa somente após compilação, publicação e disponibilidade validadas. Dependentes exigem estado final conhecido.

Social automática, quando adotada, trata Facebook, Instagram e X separadamente no perfil correspondente. Prioridade:

1. open source madura;
2. método oficial;
3. alternativa configurada;
4. fallback.

Publicar título, resumo, imagem, hashtags e link. Exigir segredos isolados, idempotência, retries limitados, recuperação, fallback e registro. Proibir loop infinito, duplicação e wrapper desnecessário.

### 5.3.3 Listagens

Sem overflow; validar em `320px` quando parte da baseline.

Padrões:

- home: máximo 6 cards;
- relacionados: título `Relacionados`, máximo 6, sem artigo atual;
- recentes: título `Recentes`, 6 itens por JSON/feed, após conteúdo essencial, contêiner vazio no HTML quando dinâmico, cards reutilizados, `textContent`, sem cookies/localStorage, falha não bloqueante.

### 5.3.4 Autores

Metadado `article_authors` ordenado:

- obrigatórios: `name`, `bio`;
- opcionais: `url`, `avatar`;
- entrada incompleta não renderiza;
- sem autor válido, sem bloco;
- avatar ausente → ilustração local;
- primeiro autor destacado;
- adicionais compactos;
- três ou mais → composição densa;
- semântica `Person`;
- sem migração forçada de posts antigos.

### 5.3.5 Formatação editorial

Quando houver indentação:

- padrão `4em`;
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

Notas de rodapé devem apontar, retornar, funcionar por teclado e mobile. Referências/Bibliografia devem ser geradas de notas/metadados quando possível; ABNT é padrão quando adotado ou quando não houver outro.

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
8. gerar `webPageLike.md` conforme §5;
9. validar a matriz de 42 linhas;
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

- substituir número concreto essencial por abstração;
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
- nenhum valor essencial foi abstraído.

### 7.2 Compartimentação

Confirmar:

- AGENTS governa IA;
- item 17 governa arquitetura de cenários;
- `webPageLike.md` governa Web;
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
- agendamento, social, listagens, autores, editorial, IA, referências e privacidade.

### 7.5 Critério de aceitação

A reconstrução só é concluída quando todas as respostas forem “sim”:

1. O documento resultante preserva integralmente a norma?
2. AGENTS e RCF permanecem em domínios distintos?
3. O item 17 está livre de Web Page Like?
4. `webPageLike.md` contém toda regra Web?
5. Novos cenários exigem apenas novo arquivo e índice?
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
- `webPageLike.md` completo;
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

O processo deve ser resiliente, prevendo falhas de ambiente, inconsistências, erros temporários, conflitos e etapas parcialmente concluídas, utilizando validações, tratamentos adequados e retries quando aplicável.

## 11. Release Automático

Deve existir um comando NPM ou equivalente e um workflow de GitHub Actions capaz de gerar, versionar, compactar e publicar releases automaticamente.

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
