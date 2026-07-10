# AGENTS.md — Governança Operacional Global

**RCF (Rule & Contract Framework):** autoridade normativa única do projeto (Single Source of Truth) sobre requisitos, contratos, negócio, arquitetura, engenharia, operação, governança e suas relações; referência oficial para construção, evolução, validação e manutenção.

**AGENTS.md:** autoridade operacional local sobre a atuação da IA: define ou referencia métodos, políticas, fluxos, capacidades, restrições, responsabilidades, convenções e metadados aplicáveis à interpretação, construção, validação, manutenção e evolução do projeto; PODE evoluir semanticamente conforme plataforma, ecossistema ou mantenedora.

## 0. Finalidade, autoridade e portabilidade

**0.1 — Finalidade** Este arquivo normatiza a operação da IA/Codex sem alterar instruções intrínsecas da plataforma e DEVE ser reutilizável entre repositórios sem adaptação.

**0.2 — Portabilidade** São proibidos URLs, nomes próprios, paths físicos exclusivos e regras particulares de repositório. São permitidos paths relativos e conceitos universais do ecossistema — como `.gitignore`, `AGENTS.md`, `agents.local.md`, `continue.ia`, `continue.dev`, RCF, `src`, `dist`, build, cache, branch, commit e CI/CD — desde que independentes de localização ou estrutura exclusiva.

**0.3 — Especialidade** Este arquivo governa método de trabalho, raciocínio operacional, cache, FT, codificação, distribuição, transpilação, build e validação. Não substitui o RCF nem define negócio.

**0.4 — Compartimentação normativa** Cada documento exerce autoridade somente no próprio domínio:

- **RCF e cenários:** definem **o que o projeto DEVE fazer**;
- **`AGENTS.md` e auxiliares:** definem **como a IA DEVE processá-lo**.

Os domínios cooperam, mas não se incorporam, substituem ou sobrepõem; a autoridade de um termina onde começa a competência do outro.

**0.5 — Autoridade da IA** No domínio de [0.4], o `AGENTS.md` DEVE ser explícito, determinístico e vinculante sobre nomenclatura, paths relativos, cache, proporções humano/máquina, auxiliares, artefatos intermediários, codificação, distribuição, transpilação, build, validação e equivalentes; regula processamento por IA, não negócio.

**0.6 — Limite de autoridade** O `AGENTS.md` NÃO DEVE criar, limitar, reinterpretar ou alterar comportamento funcional, cálculo, permissão, critério comercial ou regra do RCF/cenários; PODE apenas referenciá-los e normatizar o método técnico de implementação, verificação ou documentação. Aplicar a diretriz abaixo.

**0.7 — Fronteiras exemplificadas**

- O RCF define **o cálculo do imposto**; o `AGENTS.md`, **como implementá-lo, validá-lo e documentá-lo**.
- O RCF exige **um relatório**; o `AGENTS.md`, **seus artefatos, nomenclatura, cache e fluxo de produção**.
- O RCF define **proporções do negócio**; o `AGENTS.md`, **proporções entre processamento automatizado e intervenção humana**.
- O RCF define **o resultado funcional**; o `AGENTS.md`, **o método operacional para produzi-lo e validá-lo**.

**0.8 — Extensão local** `agents.local.md`, quando existente, é incluído pelo AGENTS global e contém somente particularidades não replicáveis do repositório. Regra, conceito ou refinamento reutilizável pertence ao AGENTS global.

**0.9 — Código de terceiros** Conteúdo importado, como `node_modules/` e equivalentes, não é alvo de análise de manutenção, edição ou programação. Torna-se elegível somente após incorporação definitiva ao código pertencente ao repositório.

**0.10 — Localização normativa** `AGENTS.md`, `agents.local.md`, `continue.ia`/`continue.dev` e equivalentes PODEM residir na raiz ou, preferencialmente, em `./.agents/`; essa estrutura pertence ao domínio de IA de [0.4] e PODE ser normatizada conforme [0.5].

**0.11 — Regressão de compartimentação** DEVE ser considerada inaplicável, por regressão arquitetural, alteração que remova, enfraqueça, transfira ou converta:

1. regra de processamento por IA em regra do projeto; ou
2. regra de negócio em norma do `AGENTS.md`.

### Diretriz de alteração das RCFs pela IA

A IA PODE alterar RCFs para atender solicitações, implementações ou ajustes, mas DEVE obter confirmação humana sobre ambiguidades/riscos de interpretação e possíveis regressões, mesmo que IDE ou equivalente suprima ou rejeite o questionamento.

**0.12 — Atualização automática da governança operacional** Todo repositório regido por este arquivo DEVE disponibilizar `agent:agents` (§18.2); em Node.js, `npm run agent:agents`. `npm run agents:update` PODE permanecer como alias compatível. Se inexistente, a operação DEVE ser criada na adoção desta norma; sua criação ou reparo DEVE observar `./.agents/.autoupdate.md`, quando existente e aplicável.

**Domínio normativo:** somente `./AGENTS.md`, `./.agents/` e suas importações governam a IA. Homônimos aninhados em `src`, `dist` ou estrutura equivalente são artefatos do produto: PODEM ser lidos, validados ou editados, mas NÃO DEVEM orientar, complementar, substituir ou contaminar a governança da IA, salvo determinação explícita superior.

## 1. Domínios normativos e precedência

### 1.1 Separação de matéria

- **AGENTS:** soberano sobre a governança intrínseca e subordinados operacionais diretos; RCF NÃO DEVE reescrevê-los, convertê-los em regra local ou particularizá-los.
- **RCF:** soberano sobre arquitetura, comportamento, negócio, contratos, requisitos e correlatos; PODE ser modularizado em `.md` para indexação seletiva e menor reprocessamento.
- **Exceção:** arquivos locais criados pelo RCF para regras de negócio submetem-se ao RCF, sem alterar o AGENTS global.
- **Compatibilização:** AGENTS define **como executar**; RCF define **o que o projeto exige**. Aplicar ambos. AGENTS não altera negócio; RCF não altera a identidade operacional do AGENTS.

### 1.2 Ordem aplicável

Após instruções superiores da plataforma, resolver conflitos conforme a matéria:

1. **Governança operacional:** `AGENTS.md` → RCF global → RCF específicos → `README.md` → `continue.ia`/`continue.dev` → demais documentos formais.
2. **Projeto, arquitetura e negócio:** RCF global → RCF específicos → `README.md` → `continue.ia`/`continue.dev` → demais documentos; o AGENTS permanece obrigatório quanto ao método, sem substituir a norma material.
3. **Regra local não replicável:** `agents.local.md`, limitada pelo AGENTS global e pelos RCFs aplicáveis.

Conflitos transversais DEVEM ser resolvidos sem alterar o comportamento do projeto nem o conteúdo intrínseco do AGENTS; persistindo ambiguidade, aplicar §12.5.

## 2. Edição normativa e densidade textual

Esta seção é a autoridade global para edição de RCFs, AGENTS, `agents.local.md`, `continue.ia`/`continue.dev`, README e documentação análoga; substitui regras editoriais inferiores conflitantes.

### 2.1 Regra de ouro

Maximizar a informação por caractere mediante normas coesas, baixo acoplamento, mínima redundância, máxima reutilização e microtextos reutilizáveis, referenciáveis e de alta densidade informacional; eliminar introduções extensas, floreios, preenchimentos, repetições e explicações óbvias, preservando integralmente regras, restrições, exceções, prioridades, precedências, condicionantes, dependências, precisão, profundidade, contexto, rastreabilidade, nuances interpretativas, exemplos, analogias, contraexemplos e referências úteis. Priorizar referências internas e microexplicações sempre que reduzirem tokens sem perda semântica, sobretudo em documentos destinados a máquinas ou IAs. **Concisão reduz somente a forma, nunca a substância; toda redução que suprima significado, rigor ou rastreabilidade é degradação, não otimização.**

### 2.2 Perfis obrigatórios

- `AGENTS.md`, `agents.local.md`, `continue.ia`/`continue.dev` e associados: **90% máquina/IA; 10% humano** — sintaxe diretiva, estrutural e maximamente densa.
- RCFs: **75% máquina/IA; 25% humano** — alta densidade técnica com contexto humano mínimo suficiente.
- README e documentação análoga: **50% máquina/IA; 50% humano** — equilíbrio entre didática e indexação limpa.

### 2.3 Preservação de autoria e rastreabilidade editorial

- Alterações manuais do desenvolvedor NÃO DEVEM regredir.
- Marcação de processamento por IA aplica-se exclusivamente a conteúdo editorial, documentação destinada a consumo humano ou artefato textual de FT com escopo `Negócio`, quando houver geração ou transformação semântica.
- Não aplicar marcadores de IA a `AGENTS.md`, `agents.local.md`, RCFs, `continue.ia`/`continue.dev`, código, configurações, manifestos, workflows ou artefatos técnicos/normativos análogos, salvo exigência explícita do RCF aplicável.
- Correções exclusivamente ortográficas, gramaticais, tipográficas, de links ou metadados não exigem marcação.
- O cenário/RCF aplicável define formato, granularidade e persistência da marcação, que DEVE ser invisível ao leitor, pesquisável por automação e neutra para renderização, build e publicação.
- Cabeçalhos, comentários úteis e convenções DEVEM ser preservados; comentário só muda se ficar incorreto ou enganoso.

### 2.4 Vocabulário normativo — RFC 2119

Termos em maiúsculas são normativos: **DEVE/DEVEM** = obrigação; **NÃO DEVE/NÃO DEVEM** = proibição; **DEVERIA/DEVERIAM** = recomendação forte, dispensável somente por motivo documentado; **NÃO DEVERIA/NÃO DEVERIAM** = desaconselhamento forte; **PODE/PODEM** = permissão. Formulações equivalentes (`obrigatório`, `proibido`, `somente`, `vedado`) mantêm a mesma força. Novas redações e trechos alterados DEVEM preferir esse vocabulário; termos não capitalizados são descritivos, salvo imperativo inequívoco.

## 3. Mapa de arquivos, leitura e cache

Manter em contexto um mapa estrutural ultra-sucinto dos **arquivos úteis**: somente fontes, normas, configurações e artefatos necessários ao desenvolvimento e à retomada.

- Excluir do mapa builds, transpilações, compilações, testes intermediários, temporários, lixo e artefatos sem valor histórico.
- Avaliar arquivos novos/modificados para distinguir alterações manuais e atualizar o mapa quando úteis.
- Ler fisicamente apenas arquivo indispensável ausente do contexto ou divergente da versão física.
- Em contexto parcial, processar somente faltantes/modificados necessários.
- Não reler, reanalisar ou reexecutar norma, arquivo, comando, tentativa, verificação, planejamento ou raciocínio já suficiente, salvo mudança observável, nova evidência, decurso relevante, atualização de versão ou ganho concreto esperado.
- Persistir no contexto disponível: AGENTS, RCFs, FTs, decisões, arquivos já analisados, alterações, comandos falhos e resultados. `continue.ia`/`continue.dev` é a memória durável; o cache da IA é complementar, nunca substituto.
- Otimização não autoriza superficialidade: quando o contexto for insuficiente, executar toda leitura, análise e validação necessárias para maximizar eficiência, desempenho, acerto, segurança e aderência, buscando erro nulo.

## 4. Modelo de execução orientado por estado

Ciclo obrigatório:

`Solicitação → intenção → FT → planejamento/atualização → execução incremental → atualização contínua do continue → validação → commit → push → próxima etapa`

Antes de implementar:

1. identificar intenção, contexto e objetivos;
2. localizar a FT correspondente no `continue.ia`/`continue.dev`;
3. classificá-la como continuação, ampliação, dependência ou nova FT;
4. identificar etapa e tarefa atuais;
5. atualizar o planejamento quando necessário;
6. executar exatamente do estado registrado.

Não reiniciar análise, verificação ou planejamento concluído sem justificativa técnica objetiva. Concluir integralmente as pendências da FT correspondente antes de iniciar implementação posterior incompatível com ela.

## 5. Frentes de Trabalho (FT)

Toda solicitação pertence a exatamente uma FT; várias FTs podem coexistir.

### 5.1 Estrutura mínima

Cada FT DEVE conter:

- `id` permanente e imutável (`FT-001`, `FT-002`...);
- nome descritivo, evolutivo quando representar melhor o objetivo;
- objetivo sucinto, evolutivo quando representar melhor o contexto;
- prioridade e status;
- escopo `Técnico` ou `Negócio`;
- início, última atualização e conclusão em `YYYYMMDD.HHMM.SS`;
- planejamento integral de etapas e tarefas;
- estado de interrupção/retomada, quando aplicável.

Uma FT contém uma ou mais etapas; cada etapa, uma ou mais tarefas. Só conclui quando todas as etapas planejadas estiverem concluídas.

### 5.2 Escopo universal

1. **Técnico — estrutura/mecanismo (The Engine):** construir, programar, projetar, corrigir ou estruturar ferramenta, lógica ou sistema. Objetivo: fazer a engrenagem funcionar. Exemplos: software, cálculo estrutural, planilha automatizada, roteador, blueprint mecânico.
2. **Negócio — conteúdo/substância (The Substance):** preencher, comunicar, pesquisar ou produzir o material que trafega na estrutura. Objetivo: gerar informação/mensagem final. Exemplos: artigo, pesquisa histórica, relatório de vendas, roteiro, campanha.

### 5.3 Segregação

Quando reduzir contexto/processamento, cada FT PODE residir em subarquivo de diretório claramente nomeado na raiz; o arquivo DEVE permanecer versionado, com exceção explícita (`!`) se alcançado pelo `.gitignore`.

## 6. Codificação, Planejamento, implementações, alterações, etapas e tarefas

Antes de qualquer implementação — feature, correção, refatoração ou ajuste — o planejamento DEVE estar vigente no `continue.ia`/`continue.dev`. Alteração de requisito, regra, contrato ou comportamento DEVE ser consolidada previamente no RCF; mudança posterior de planejamento/requisito/solução DEVE atualizar `continue` e RCF antes da execução continuar. Código DEVE decorrer da documentação vigente, nunca o inverso.

### 6.1 Planejamento

O planejamento DEVE preceder a implementação; cada etapa DEVE registrar nome, posição `X/N`, objetivo sucinto e dependências. Exemplo:

```text
FT-003 — Centralização das Configurações
1/8 Levantamento
2/8 Estrutura JSON
3/8 Migração das Validações
4/8 Atualização da UI
5/8 Ajustes do Build
6/8 Testes
7/8 Documentação
8/8 Validação Final
```

O planejamento PODE ser expandido, reduzido, reorganizado, renumerado, dividido ou consolidado; toda mudança DEVE ser refletida imediatamente no `continue`. A lista prevista DEVE permanecer integral, e itens concluídos NÃO DEVEM ser removidos enquanto a FT estiver ativa.

Após a conclusão:

- resumir o registro integral com compressão médio-agressiva, sem omissão material;
- manter o histórico por **exatamente 15 dias**;
- remover integralmente FTs concluídas há mais de 15 dias.

### 6.2 Etapas

Toda implementação relevante DEVE ser dividida em etapas pequenas, independentes, verificáveis e proporcionais ao contexto.

Cada etapa:

- pertence obrigatoriamente a uma FT;
- possui nome e posição `X/N`;
- discrimina todas as tarefas previstas;
- termina em estado funcional: sistema executável e consistente, ainda que não implemente toda a FT ou todo o RCF.

### 6.3 Tarefas

Tarefa é a granularidade mínima de execução e retomada. Cada tarefa:

- pertence a uma etapa de uma FT;
- possui nome e posição `X/N`;
- DEVE ser prevista e discriminada;
- preferencialmente deixa estado funcional, sem obrigatoriedade equivalente à etapa.

### 6.4 Conclusão incremental

Ao concluir tarefa ou etapa:

1. validar consistência e impacto;
2. atualizar imediatamente o `continue.ia`/`continue.dev`;
3. aplicar commit conforme RCF; na ausência de regra completa, usar PT-BR, até 512 caracteres, distinguindo `fix`, melhoria/aprimoramento e ajuste;
4. executar commit e push imediatamente, quando tecnicamente possível;
5. só então iniciar o próximo item.

Regras adicionais:

- Não acumular várias etapas antes do commit.
- Commit de etapa DEVE representar estado funcional.
- Tarefa pequena/sutil — inclusive ajustes mínimos de texto/posição — PODE ser consolidada no fechamento da etapa sem validação, commit ou push próprios, se reduzir custo sem afetar rastreabilidade.
- Alteração moderada exige no mínimo 2 commits; agressiva, 4, sem substituir commits obrigatórios por etapa.

## 7. `continue.ia` / `continue.dev`: memória operacional oficial

O repositório DEVE conter **exatamente um** arquivo canônico, `continue.ia` ou `continue.dev`; referências legadas a `continua.ia` DEVEM convergir ao nome adotado. O arquivo complementa, sem substituir, a memória contextual da IA.

### 7.1 Formato

DEVE ser rastreável, indexável, segregável e legível por humanos/máquinas/IAs. Aceita sintaxe própria, YAML, JSON ou equivalente; XML NÃO DEVERIA ser usado sem justificativa. Compatibilidade com IDEs Continue/continue.dev é desejável, não obrigatória. Aplicar perfil 90/10.

### 7.2 Objetivos

- retomada praticamente exata após interrupção;
- mínimo reprocessamento e repetição;
- preservação de decisões, verificações e falhas;
- redução de processamento sem perda de qualidade.

### 7.3 Registro mínimo por FT

Registrar separadamente:

- id, nome, escopo, objetivo, prioridade e status;
- `YYYYMMDD.HHMM.SS` de início, última atualização e conclusão;
- etapa atual `X/N` e nome;
- lista integral de etapas;
- tarefas planejadas, atual/em execução e concluídas;
- progresso parcial e próximo ponto executável;
- linha de raciocínio adotada em forma objetiva e retomável;
- decisões arquiteturais;
- verificações concluídas;
- comandos relevantes;
- pendências, limitações e dependências;
- hipóteses descartadas;
- causas objetivas de falhas;
- decisões antirretrabalho.

Nunca registrar somente `3/12`. Registrar, no mínimo:

```text
FT-00X — <nome>
Etapa X/N — <nome>
Tarefa Y/M — <nome>
```

### 7.4 Atualização contínua

Atualizar durante toda a execução, não apenas ao concluir etapa/tarefa, incluindo:

- conclusão de tarefa ou etapa;
- evolução do planejamento;
- decisão relevante;
- hipótese descartada;
- verificação que elimina possibilidades;
- falha, causa e solução;
- qualquer dado que permita retomada sem reprocessamento.

### 7.5 Aprendizado de ambiente

Manter base concisa e dinâmica de problemas, tentativas, soluções e ajustes:

- `MACHINE_ID`: vincular cada registro à máquina/sistema. Tratar falha como local por padrão; classificá-la global somente com evidência de recorrência em múltiplas máquinas.
- `DATA_REF`: última atualização obrigatória em `YYYYMMDD.HHMM.SS`, permitindo expurgo de registros obsoletos.
- `CACHE`: manter no contexto quando disponível; reprocessar integralmente apenas após atualização da base ou quando um subarquivo dedicado exigir recarga.
- Bloquear repetição de ação historicamente falha/insuficiente. Retentar somente após decurso significativo, alteração documentada do ambiente, nova evidência ou atualização de versão.

## 8. Interrupção e retomada

Ao detectar iminente esgotamento de tempo, créditos, contexto ou trava de custo computacional:

1. interromper controladamente;
2. salvar no arquivo canônico todo progresso real, estado, decisões, histórico e pendências imediatas;
3. anexar ao id da tarefa atual a flag `[INTERROMPIDO_POR_LIMITACAO_DE_RECURSOS]` e resumo ultra-sucinto do próximo passo.

Na interação subsequente, antes de implementar:

1. procurar a flag;
2. carregar o estado e validar alterações manuais ocorridas durante a pausa;
3. se a nova solicitação equivaler a continuar, retomar imediatamente; caso contrário, apresentar resumo mínimo do ponto de parada e solicitar decisão de retomada;
4. remover a flag somente após retomada bem-sucedida.

Sem flag, localizar FT/etapa/tarefa e continuar do registro. Nova FT DEVE ser registrada, com objetivo, planejamento, etapas e tarefas, antes da execução; mudança significativa de escopo exige reorganização e registro objetivos.

## 9. Branches, commits, push e merge

- Todo desenvolvimento ocorre no branch `dev`.
- Ao concluir uma FT, realizar merge em `main` ou `master` somente se o sistema global estiver funcional; considerar outras FTs em andamento cujo estado torne o merge inseguro.
- Antes de alterar, verificar branch e working tree.

Se o branch atual não for `dev` e houver alterações unstaged, parar e solicitar escolha explícita, ignorando qualquer opção da IDE que dispense a pergunta:

1. alternar para `dev`, preservando seu conteúdo original;
2. criar/atualizar `dev` a partir do último commit de `main`/`master`;
3. alternar para `dev`, levando o estado atual e mesclando-o;
4. continuar no branch atual.

Quando tecnicamente possível, cada tarefa e, prioritariamente, cada etapa DEVEM terminar em commit seguido de push. Commit, push ou merge NÃO DEVEM ser declarados sem comprovação objetiva. Operações Git DEVEM usar a API do §18 quando houver comando equivalente, preservando integralmente as salvaguardas desta seção.

## 10. Implementação, regressão e sincronização

Nenhuma implementação DEVE regredir:

- arquitetura, negócio, UX ou API pública;
- build, cache, desempenho ou compatibilidade;
- CI/CD, GitHub Actions, GitHub Pages, publicação, workflows e pipelines;
- bundles offline;
- `_site`, `dist/` ou diretório equivalente de produto final.

Objetivo permanente: melhorar e evoluir. Regressão só é admissível mediante solicitação explícita do desenvolvedor; confirmar expressamente para eliminar possível incompreensão.

Sempre que arquitetura, regras, comportamento, build, fluxo, UX, UI, operadores, notações, recursos ou documentação mudarem, sincronizar automaticamente, conforme aplicabilidade:

- `AGENTS.md` e `agents.local.md`;
- README;
- RCFs pertinentes;
- `continue.ia`/`continue.dev`;
- implementação e UI afetadas.

## 11. Build, runtime e produto final

### 11.1 Restrições gerais

A implementação NÃO DEVE:

- alterar negócio sem autorização normativa;
- introduzir regressão;
- duplicar código;
- adicionar dependência desnecessária;
- aumentar complexidade sem benefício técnico;
- realizar refatoração ampla, reorganização gratuita ou mudança comportamental não solicitada.

Quando aplicável, a implementação DEVE preservar a versão ECMAScript definida, GitHub Pages/Actions, bundles offline, workflows, pipelines e diretório final (`_site`, `dist/` ou equivalente), conforme RCF.

DEVE priorizar menor build, instalação, download, consumo, latência e carregamento; maior autonomia final; e evolução do RCF sem perda de princípios.

### 11.2 Segregação runtime/build

O diretório final DEVE ser autônomo e conter somente artefatos/assets finais, scripts necessários e dependências indispensáveis ao runtime; recurso exclusivo de desenvolvimento, build, transpilação, bundling, minificação, otimização, geração de assets, documentação, lint, testes ou automação NÃO DEVE integrá-lo nem ser nele instalado.

Sempre que tecnicamente possível, incorporar ao artefato final os recursos resolvidos na compilação, eliminando dependência de runtime e materializando somente partes usadas. Exemplo: se apenas alguns SVGs, ícones, fontes, CSS, componentes ou templates da Font Awesome forem usados, incorporar somente esses itens; não incluir a biblioteca integral nem mantê-la em runtime quando o build absorveu sua função. Aplicar o mesmo princípio a toda biblioteca/framework, preservando funcionalidade.

### 11.3 CDN

O RCF decide sobre CDN. Em silêncio ou incongruência:

- produto deliberadamente online: CDN é padrão quando a URL compartilhada puder aproveitar cache do navegador;
- preferir incorporação local parcial/customizada quando reduzir tamanho, latência ou banda;
- bundle offline: manter todos os recursos necessários localmente e evitar rede por definição;
- bundle não é necessariamente offline; o RCF DEVE explicitar a finalidade quando não inequívoca.

## 12. Padrões de implementação

### 12.1 Análise

- Idioma obrigatório: PT-BR.
- Antes de alterar: detectar falhas, prevenir regressões, validar impacto e entregar solução final.
- Não apresentar hipótese como conclusão sem validação.
- Aplicar rigor, minúcia, melhores práticas e codificação defensiva contra bugs/falhas previsíveis.

### 12.2 Alteração

Objetivo: diff mínimo.

Preservar estrutura, fluxo, comentários úteis, contratos, convenções e compatibilidade. Permitida somente refatoração cirúrgica: localizada, mesmo objetivo e mesmo contrato. Documentar motivo, objetivo, impacto e validação. Após estabilização, manter apenas comentários necessários.

### 12.3 Bugs e proteções

Código aparentemente redundante pode conter correção não documentada. Na dúvida, preservar e marcar:

```text
// PRESERVADO: potencial correção de bug não documentada
```

Correção/prevenção nova DEVE usar, em uma linha salvo necessidade estrita:

```text
// FIX-BUG: <descrição mínima>
// PROTECAO: <descrição mínima>
```

Não remover sem análise: `catch` vazio, tratamento de erro ou validação existente.

### 12.4 Estilo

- Proibidos pronomes autorreferenciais/interlocutórios: “eu”, “você”, “nós”.
- Evitar “talvez”, “pode ser”, “provavelmente” e adjetivos subjetivos.
- Priorizar declarações determinísticas, baixa redundância, baixo acoplamento e baixo custo cognitivo.

### 12.5 Ambiguidade

Aplicar a interpretação mais restritiva, de menor alteração e maior preservação. Em conflito interno, prevalece a regra que menos altera comportamento. Se insolúvel, registrar exatamente:

```text
AMBIGUIDADE INSOLUVEL: <ponto>. Preservando original.
```

## 13. Validação

Comprovar objetivamente, conforme finalidade e RCF:

- ausência de regressões;
- produto final autônomo;
- presença exclusiva de dependências de runtime no diretório final;
- ausência de dependências de desenvolvimento no produto final;
- preservação de comportamento após incorporação de recursos no build;
- independência dos bundles;
- funcionamento de GitHub Pages, Actions, publicação, workflows e pipelines;
- reprodutibilidade do build;
- redução do tamanho final sempre que tecnicamente possível;
- funcionamento dos critérios específicos previstos pelo RCF, inclusive exemplos como links de ajuda, painel retrátil sem JavaScript, validações centralizadas e hierarquia `Global → Sessão → Execução`, quando existentes.

## 14. Documentação e RCF

Os RCFs pertinentes DEVEM normatizar, quando aplicável:

- segregação runtime/build;
- proibição de dependência de desenvolvimento no produto final, salvo justificativa técnica explícita;
- centralização das regras de validação em arquivo único;
- hierarquia de configuração `Global → Sessão → Execução`;
- gestão de implementações por FT no arquivo canônico;
- atualização contínua da memória operacional, inclusive ao concluir tarefas;
- sincronização entre implementação, UI, documentação, AGENTS e RCF quando arquitetura, operadores, notações, recursos ou fluxos mudarem.

## 15. “Implementações em andamento”

A raiz DEVE conter um `.md` gerado por `agent:handoff` (§18.2) a partir do `continue.ia`/`continue.dev`, nunca editado manualmente e linkado no README. Finalidade exclusiva: resumo visual ultra-sucinto das FTs ativas; omitir escopo `Negócio`, salvo regra diversa do RCF.

### 15.1 Conteúdo

- texto introdutório curto antes da listagem;
- subtítulo próprio por FT;
- objetivo resumido;
- escopo, quando o RCF determinar sua exibição;
- nenhuma informação alheia ao progresso.

### 15.2 Tabela

Usar HTML, não tabela Markdown, para permitir `rowspan`/`colspan`:

- uma linha por etapa, com nome;
- tarefas vinculadas, individualizadas por nome;
- status de etapa e tarefa limitado a `pendente`, `em andamento` ou `concluído`;
- ícone/emoji com cor correspondente e mapeamento único definido pelo gerador;
- dentro da tabela, somente nome da etapa, nome da tarefa e ícone de status.

O detalhamento da memória operacional NÃO DEVE ser reproduzido nesse arquivo.

## 16. Saída final

Toda entrega DEVE incluir:

```text
COMMIT_SUGERIDO: <texto PT-BR, objetivo, suficientemente detalhado, máximo 512 caracteres; separar fix, melhoria/aprimoramento e ajuste quando aplicável>
PENDENCIAS: <informar explicitamente etapas, tarefas ou pendências restantes; usar “nenhuma” quando concluído>
```

## 17. Cenários

Cenário é especialização normativa reutilizável por tipo de projeto, repositório, entrega ou contexto. A lista é aberta, cumulativa e não exaustiva; novo cenário DEVE residir em arquivo especializado e ser indexado em §17.3, sem ampliar estruturalmente o `AGENTS.md` nem duplicar governança.

Esta seção contém somente regras comuns, arquitetura de carregamento e índice; regra específica DEVE residir no arquivo do cenário.

Valores, limites ou escolhas concretas de projeto, produto ou cenário — inclusive números, proporções, portas, comandos, ferramentas, bibliotecas, URLs/URIs, paths, diretórios, arquivos, formatos, horários, timeouts, retries, tamanhos, quotas, lotes, paginação, concorrência, thresholds, ícones e plataformas — DEVEM ser definidos explicitamente pelo RCF ou cenário competente e tecnicamente justificados. Convenções exclusivamente operacionais da IA PODEM ser definidas neste `AGENTS.md` ou, se locais e não replicáveis, em `agents.local.md`. Silêncio, ausência, expressões abertas (`adequado`, `razoável`, `quando necessário`) ou mera possibilidade técnica NÃO autorizam escolha, estimativa ou preenchimento por inferência; aplicar §12.5, preservando o estado vigente.

Regra de cenário somente PODE migrar ao núcleo quando comprovadamente aplicável a múltiplos cenários e livre de particularidade tecnológica, local ou de negócio.

### 17.1 Diretrizes gerais dos cenários

#### 17.1.1 Finalidade, alcance e extensibilidade

Aplicar estas diretrizes a todo cenário técnica e semanticamente pertinente, sem substituir, contrariar ou enfraquecer disposições superiores, RCFs, requisitos específicos, plataforma, ambiente ou contrato de distribuição.

Cenários PODEM coexistir e DEVEM ser aplicados cumulativamente. Regra específica somente restringe/especializa regra geral quando:

1. estiver dentro do escopo declarado;
2. for tecnicamente justificada;
3. não contradizer norma superior;
4. preservar, tanto quanto possível, o objetivo original.

Dispensa exige incompatibilidade real, irrelevância ou custo desproporcional verificável; preferência ou conveniência não bastam.

Novo cenário DEVE declarar: finalidade, aplicabilidade, limites, cumulatividade, dependências, contratos públicos, artefatos, regras, exceções, precedência local, segurança, privacidade, acessibilidade, desempenho, compatibilidade, validações e conclusão. Regra multicenário pertence a esta seção; particularidade de cenário, ao arquivo; de projeto, ao RCF ou `agents.local.md` (§1).

#### 17.1.2 Precedência e contradições

Aplicar §1.2. No mesmo nível, regra específica prevalece somente no próprio escopo. Contradição material NÃO DEVE ser ocultada; registrar:

```text
CONTRADIÇÃO DETECTADA: <origem> vs <regra> — Aplicando a regra de maior precedência.
```

#### 17.1.3 Objetivos normativos

Toda decisão de cenário DEVE, conforme aplicável:

1. preservar conformidade normativa;
2. maximizar reutilização;
3. maximizar generalização sem apagar requisitos reais;
4. reduzir comandos, fluxos e interfaces distintos;
5. eliminar duplicidade funcional;
6. privilegiar composição;
7. reduzir decisões recorrentes;
8. reduzir processamento humano, automático e por IA;
9. reduzir tokens e contexto;
10. permitir evolução tecnológica sem quebra desnecessária de interface;
11. preservar acessibilidade, segurança, privacidade, desempenho e manutenibilidade.

Simplificação NÃO DEVE remover capacidade obrigatória, ocultar erro, reduzir rastreabilidade ou concentrar responsabilidades incompatíveis.

#### 17.1.4 Ordem de generalização

Antes de criar interface, comando, componente, biblioteca, workflow ou convenção:

1. reutilizar solução universal existente;
2. reutilizar solução do grupo funcional;
3. compor soluções existentes;
4. especializar por parâmetro ou configuração;
5. criar solução somente quando as anteriores não satisfizerem o requisito.

NÃO DEVE ser criada variação que apenas reflita implementação interna com semântica pública idêntica.

#### 17.1.5 Interface pública estável

Toda interface exposta a pessoas, automações, CI/CD ou IA é API pública: nomenclatura semântica, previsível e estável; implementação interna variável; incompatibilidade somente por necessidade técnica real, com justificativa, documentação e transição compatível quando viável.

A intenção pública DEVE permanecer estável; o mecanismo interno PODE evoluir.

#### 17.1.6 Composição e não duplicação

Fluxos compostos DEVEM reutilizar operações existentes sem copiar lógica; PODEM coordenar, parametrizar e tratar falhas, mas NÃO DEVEM manter implementações divergentes.

#### 17.1.7 Escolha tecnológica e proporcionalidade

Não adotar tecnologia por preferência, popularidade ou mera possibilidade. Avaliar requisito, arquitetura, hospedagem/publicação, desenvolvimento local, CI/CD, custo operacional/cognitivo, manutenção, segurança, privacidade, acessibilidade, peso ao cliente, degradação segura e alternativa local/nativa.

Preferir a solução mais simples que cumpra integralmente o contrato. Avaliar solução madura antes de implementação própria; não adicionar dependência quando solução local pequena, testável e menos arriscada cumprir o mesmo contrato. Não duplicar bibliotecas equivalentes; reutilizar a padrão salvo incompatibilidade comprovada.

#### 17.1.8 Processos existentes e validação local

Antes de iniciar servidor, watcher ou processo, verificar instância adequada em execução. Não encerrar, reiniciar ou substituir processo existente sem necessidade técnica ou autorização, especialmente se puder pertencer a outra atividade. Preferir ambiente ativo e registrar limitações frente à produção.

#### 17.1.9 Correções textuais incidentais

Ao alterar texto no escopo autorizado, corrigir erros ortográficos, gramaticais e tipográficos apenas na região modificada, sem reescrita extrínseca, alteração semântica não solicitada ou perda de terminologia/voz. Informar, ao final, arquivos corrigidos, natureza da correção e eventual reorganização ou mudança semântica.

### 17.2 Organização dos cenários

#### 17.2.1 Arquivos especializados

Cada cenário DEVE residir em Markdown independente, nomeado no índice (§17.3) e resolvido relativamente ao diretório do `AGENTS.md`, salvo convenção superior explícita.

Arquivos de cenário são extensões diretas do `AGENTS.md`, não RCFs/extensões locais; DEVEM ser genéricos, reutilizáveis e livres de particularidade exclusiva de projeto. Regras locais pertencem ao RCF ou `agents.local.md`.

Um arquivo PODE conter cenário-base e especializações cumulativas do mesmo domínio se reduzir fragmentação sem acoplamento indevido; cenários independentes DEVEM usar arquivos distintos.

#### 17.2.2 Estrutura mínima

Cada arquivo DEVE conter:

- identificação inequívoca do cenário;
- relação normativa com `AGENTS.md` §17;
- definição, escopo, aplicabilidade e limites;
- dependências e especializações cumulativas;
- contratos, padrões, regras, exceções e prioridades;
- critérios de segurança, privacidade, acessibilidade, desempenho e compatibilidade pertinentes;
- validações e critérios de conclusão;
- referências internas estáveis.

Regras dos §§17.1–17.2 NÃO DEVEM ser repetidas, mas referenciadas; regra comum a múltiplos arquivos DEVE ser centralizada em §17.1 somente se atender ao critério de generalização.

#### 17.2.3 Carregamento e aplicação

Antes de implementar:

1. classificar o projeto, entrega e solicitação;
2. identificar no índice todos os cenários potencialmente aplicáveis;
3. carregar integralmente cada arquivo indicado e suas dependências;
4. aplicar cumulativamente `AGENTS.md`, cenários e RCFs conforme §1.2;
5. registrar na memória operacional os cenários efetivamente aplicados e eventual dispensa justificada.

Leitura parcial somente é permitida quando o arquivo integral já estiver validamente em cache e não tiver sido alterado. Arquivo ausente, ilegível, divergente do índice ou com dependência irresolvida constitui falha de integridade normativa; não substituir seu conteúdo por inferência silenciosa.

#### 17.2.4 Evolução e manutenção

Adicionar cenário exige somente:

1. criar seu arquivo especializado;
2. registrar uma entrada no índice;
3. declarar dependências e relação cumulativa;
4. validar ausência de duplicidade, contradição e particularidade local.

Não criar nova estrutura no `AGENTS.md` para cada cenário. Alterar §§17.1–17.2 somente quando surgir regra comprovadamente comum ou necessidade arquitetural transversal.

Ao mover regra entre núcleo e cenário, preservar integralmente conteúdo, força normativa, exceções, exemplos, prioridades, dependências e referências; atualizar todos os vínculos na mesma alteração.

Regra nova potencialmente reutilizável DEVERIA integrar seção geral — preferencialmente §17 ou o núcleo — em vez de cenário específico. Regra existente com alcance multicenário/amplo DEVE ser continuamente avaliada para extração ao §17 ou núcleo.

### 17.3 Cenários disponíveis

Leia e analise os subarquivos apenas se, e quando, for aplicável ao projeto/repositório atual.

| Cenário                                                     | Arquivo/seção                                               | Dependências                       | Aplicabilidade resumida                                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| Web Page Like                                               | [`./.agents/webPageLike.md` §1](./.agents/webPageLike.md#1) | —                                  | Entrega principal consumida por navegador ou engine web.                                    |
| Web Page Like com gerador estático ou hospedagem de páginas | [`./.agents/webPageLike.md` §2](./.agents/webPageLike.md#2) | Web Page Like                      | Gerador estático, templates ou hospedagem de páginas.                                       |
| Sites e blogs com conteúdo editorial                        | [`./.agents/webPageLike.md` §3](./.agents/webPageLike.md#3) | Web Page Like; §2 quando aplicável | Publicação de artigos, posts, sermões, ensaios, notícias ou conteúdo editorial equivalente. |

Novos cenários DEVEM ser acrescentados somente a esta tabela, preservando §17.2.

## 18. API operacional do repositório

### 18.1 Contrato fechado

Todo repositório regido por este arquivo DEVE expor API operacional local, determinística, não interativa e reutilizável pela interface nativa do ecossistema, com os nomes canônicos de §18.2. Objetivos: reduzir contexto, tokens, processamento por LLM, tempo, comandos, erro e acoplamento.

A matriz de §18.2 é o catálogo mínimo obrigatório. Cada comando presume-se aplicável e DEVE existir exatamente com o nome indicado. A dispensa somente PODE ocorrer por impossibilidade ou irrelevância objetiva, declarada pelo RCF, cenário ou `agents.local.md`; silêncio, ausência de implementação ou decisão da IA NÃO constituem dispensa. `agent:status` DEVE enumerar todos os comandos de §18.2 como `available`, `degraded` ou `n/a`, informando invocação, motivo e autoridade da exceção. Alias PODE coexistir, mas NÃO substitui o nome canônico.

Havendo comando `available`/`degraded` equivalente, a IA DEVE usá-lo antes de compor comandos do sistema, Git ou ecossistema. Desvio somente PODE ocorrer por inaplicabilidade declarada, indisponibilidade, insuficiência contratual ou falha comprovada; causa e fallback DEVEM ser registrados, e recorrência DEVE gerar correção/ampliação da API.

Cada comando DEVE possuir contrato explícito, versionado e consultável, contendo: finalidade; sintaxe; entradas e tipos; obrigatoriedade; valores aceitos; defaults; limites; timeouts; retries/backoff; lotes, paginação e concorrência; pré/pós-condições; dependências; efeitos colaterais; idempotência; classificação destrutiva e confirmação; schema de saída; truncamento/persistência do resultado integral; códigos de retorno; falhas e fallback. Nenhum desses elementos PODE depender de inferência. Valor ausente, contraditório ou aberto torna o comando não conforme; a IA NÃO DEVE inventá-lo, devendo aplicar §§12.5 e 17.

Os comandos DEVEM:

- encapsular operações recorrentes, determinísticas ou mecânicas e, conforme contrato, filtros, validações, retries, tratamento de erro, paralelização, paginação, sumarização e consolidação;
- produzir saída compacta, estável e acionável, omitindo progresso, transferências, arquivos inalterados, repetição e logs sem valor;
- retornar somente resultado, diagnóstico, métricas, resumo e erros relevantes; ao exceder limite declarado, persistir a saída integral e retornar localização, tamanho, hash e resumo;
- usar códigos de retorno automatizáveis e preservar salvaguardas, especialmente §§0 e 9–13;
- ser idempotentes quando o contrato não exigir efeito cumulativo; operação destrutiva NÃO DEVE ampliar escopo nem suprimir confirmação obrigatória.

Sequência recorrente, mecanicamente componível ou custosa em comandos/contexto DEVE ser consolidada. A API DEVE evoluir continuamente para deslocar trabalho mecânico da LLM sem ocultar erro, decisão, valor ou rastreabilidade.

### 18.2 Matriz mínima obrigatória

Todas as implementações de comandos com finalide única de ser usada pela IA, ou que tenham baixo uso contextual para o desenvolvedor, devem localizar-se de forma aninhada e heirarquia em `./scripts/.agents/`. Caso, opte-se por biblioteca, a localização dela uará será o padrão definido pelo repositório.

Todos os comandos abaixo DEVEM existir exatamente como nomeados, salvo dispensa conforme §18.1:

- **Workspace:** `agent:setup` preparar ambiente; `agent:doctor` diagnosticar ambiente/dependências/configuração; `agent:repair` corrigir inconsistências conhecidas; `agent:clean` remover caches/temporários/artefatos definidos; `agent:status` resumir workspace e expor capacidades; `agent:context` gerar contexto executivo para IA; `agent:workspace` gerar snapshot consolidado.
- **Sistema operacional:** `agent:pwd` diretório atual; `agent:ls` arquivos relevantes; `agent:tree` árvore resumida; `agent:find` localizar arquivos; `agent:search` pesquisar conteúdo estruturado; `agent:grep` filtrar texto; `agent:head`/`agent:tail` exibir extremos de arquivo; `agent:view` exibir conteúdo filtrado; `agent:stat` metadados; `agent:size` tamanho consolidado; `agent:hash` hashes; `agent:diff-file` comparar arquivos; `agent:logs` filtrar/resumir logs; `agent:process` listar processos do projeto; `agent:kill` encerrá-los sob salvaguardas; `agent:ports` portas usadas; `agent:compress`/`agent:extract` compactar/extrair.
- **Git:** `agent:git-status` estado; `agent:git-fetch` referências remotas; `agent:git-pull` sincronizar remoto; `agent:git-push` publicar; `agent:git-sync` sincronização completa; `agent:git-add` adicionar alterações; `agent:git-commit` criar commit conforme norma; `agent:git-branch` branches; `agent:git-switch` alternância; `agent:git-tag` tags; `agent:git-log` histórico resumido; `agent:git-show` detalhes de commit; `agent:git-history` histórico consolidado; `agent:git-diff` comparar revisões/arquivos; `agent:git-blame` autoria; `agent:git-reset` reset controlado; `agent:git-restore` restaurar; `agent:git-clean` limpar não versionados; `agent:git-stash` stash; `agent:git-prune` remover referências obsoletas; `agent:git-gc` otimizar repositório; `agent:git-last-release` localizar último commit `release:`; `agent:git-release-notes` gerar Release Notes; `agent:git-changelog` consolidar histórico entre revisões.
- **Build/publicação:** `agent:build` build; `agent:verify` validação integral; `agent:dist` distribuição final; `agent:package` empacotamento; `agent:release` Release completo; `agent:publish` publicação; `agent:deploy` deploy; `agent:rollback` rollback.
- **Qualidade:** `agent:test` testes integrais; `agent:test:<grupo>` subconjunto nominal; `agent:lint` lint; `agent:format` formatação; `agent:typecheck` tipos; `agent:benchmark` benchmarks; `agent:security` segurança; `agent:analyze` análise estática.
- **Dependências:** `agent:deps` auditoria; `agent:update-deps` atualização; `agent:licenses` licenças.
- **Documentação/governança:** `agent:index` índices; `agent:map` mapas/grafos; `agent:handoff` handoff e “Implementações em andamento”; `agent:docs` documentação derivada; `agent:rcf` artefatos RCF; `agent:agents` artefatos AGENTS.
- **Dados:** `agent:parse-data` processar arquivos volumosos; `agent:summarize` sumários estruturados; `agent:convert` converter formatos; `agent:validate-data` validar dados estruturados; `agent:index-data` indexar grandes conjuntos; `agent:query-data` consultar dados deterministicamente.

Novos comandos PODEM ser adicionados conforme §18.1. Operações equivalentes DEVEM compartilhar núcleo/composição, nunca lógica divergente. Remoção, renomeação ou dispensa de comando canônico exige alteração normativa da autoridade competente e transição compatível quando tecnicamente viável.
