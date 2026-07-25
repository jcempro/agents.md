# Registro temporário integral — `github:jcempro/agents.md#9`

- URL: https://github.com/jcempro/agents.md/issues/9
- Título: Reforma de principios e autoridade normativa perdidos de`AGENTS.md`, impedir desvios dos hooks, devaneios, divagações, e decisões autônomas não solicitadas
- Autor: `jcempro`
- Estado: `OPEN`
- Criada: `2026-07-22T17:42:37Z`
- Atualizada: `2026-07-23T02:20:39Z`
- Labels na captura: `agents:highly-recommended`, `agents:approved`, `agents:in-development`
- Capturada: `2026-07-25T18:27:43-03:00`
- SHA-256 do corpo remoto UTF-8/LF capturado antes da normalização editorial de whitespace: `B1352CBE8C041338D4FA8CCCC24D99CBDA60C6378DA3E5388F1252403CCE3616`
- Anexos aplicáveis: nenhum link de anexo ou imagem foi encontrado no corpo ou nos comentários.
- FTs: `FT-050`, `FT-051`, `FT-052`
- Destino normativo: `RCF.md`, seções produzidas pela `FT-050`

## Corpo integral

# Restaurar a autoridade normativa de `AGENTS.md` e impedir desvios dos mecanismos oficiais

## 1. Problema

Repositórios finais vêm criando fluxos próprios para releases, publicação, GitHub Pages e operações correlatas, ignorando, duplicando, substituindo, renomeando, reimplementando ou contornando scripts, comandos, hooks, gatilhos, nomenclaturas e pontos de extensão definidos por `AGENTS.md`.

Em casos mais graves, `AGENTS.md` ou documentos associados são alterados para acomodar a implementação divergente, invertendo a precedência normativa:

> **A implementação DEVE obedecer à norma; a norma JAMAIS PODE ser alterada apenas para legitimar, absorver, preservar ou ocultar desvios da implementação.**

A recorrência demonstra insuficiência na explicitação e proteção da autoridade, precedência, obrigatoriedade, extensibilidade controlada e não regressão de `AGENTS.md`, permitindo interpretações criativas, improvisações, decisões autônomas não solicitadas, atalhos, contornos, burlas, reinvenções locais e perda normativa cumulativa.

Os casos descritos nesta issue são exemplos comprovados, NÃO limites de escopo (e são apenas alguns exemplos de muitos).

## 2. Objetivo

Revisar `AGENTS.md` e, somente quando pertinente, seus documentos associados e mecanismos construtores para:

- reafirmar sua autoridade operacional obrigatória;
- subordinar inequivocamente a implementação à norma;
- tornar compulsório o uso dos mecanismos oficiais;
- permitir evolução exclusivamente por composição normatizada;
- impedir fluxos paralelos, substituições, duplicações e contornos;
- proteger princípios, contratos e nomenclaturas contra regressão;
- distinguir governança operacional de especificação arquitetural;
- otimizar tokens, leitura e processamento sem perda semântica;
- reduzir operações cognitivas ou temporais delegáveis a automação;
- preservar rastreabilidade suficiente para auditoria e reconstrução.

A revisão DEVE reintegrar conceitos historicamente acumulados, fundir regras sobrepostas, centralizar fundamentos comuns e substituir repetições por referências inequívocas. NÃO DEVE apenas acrescentar novas seções ao conteúdo existente.

## 3. Conceitos canônicos

Para eliminar repetição sem perda, adotar conceitos equivalentes aos seguintes:

- **Norma Operacional:** `/AGENTS.md` e associados, responsáveis por reger atuação da IA, processo, precedência, leitura, edição, validação, rastreabilidade, automação, scripts, hooks, comandos e FTs.
- **RCF:** `Reference Compliance Framework`, especificação arquitetural normativa e SSOT do sistema.
- **Repositório Normativo:** repositório que mantém, constrói, valida ou distribui a Norma Operacional.
- **Repositório Final:** repositório consumidor da Norma Operacional.
- **Mecanismo Oficial:** script, comando, hook, callback, adaptador, workflow, arquivo-gatilho, convenção, nomenclatura, contrato ou ponto de extensão normatizado.
- **Extensão Oficial:** especialização composta sobre Mecanismo Oficial sem substituir seu contrato ou fluxo principal.
- **Fluxo Paralelo:** mecanismo novo, duplicado, substitutivo ou funcionalmente equivalente que contorne Mecanismo Oficial.
- **Lacuna Oficial:** erro, falha, risco, insuficiência ou ausência comprovada de Mecanismo Oficial necessário.
- **Princípio Estruturante:** regra cuja remoção, relativização ou degradação altera autoridade, alcance ou comportamento fundamental da Norma Operacional.
- **Microtexto Normativo:** unidade curta, coesa, autônoma, referenciável e semanticamente estável.
- **Solicitação Não Rastreável:** solicitação recebida por prompt, chat, Codex, IDE ou meio equivalente ainda não integralmente registrada em fonte formal.
- **Custo Líquido:** relação entre tokens, bytes, tempo, processamento, navegação, manutenção, risco, precisão e reutilização.
- **REF-CNSTRUTOR-EDICAO-UNICA-EXCLUSIVA:** o próprio repositório construtor de `agents.md` (aquele repositório efetivamente aberto, cujo upstrem é diretamente ligado ao upstream do `agents.md`), a edição pode ocorrer em agents.md e associados mas limitada APENAS aos localizados em `src/` e não aos localizados na raiz do repositório (`/`), demais conteúdos da raiz podem ser editados livremente (salvo limitações adicionais impostas).

Cada conceito DEVE possuir definição única e canônica. Referências PODEM substituir repetições, mas NÃO PODEM ocultar regras, condições, exceções, dependências ou efeitos necessários à interpretação.

As nomenclaturas acima de conceitos canonicos foram escolhidas para contexto específico desta issue, mas para aplicação no repositório, podem e devem ser, melhor escolhidos, ao inegrar as normas tanto do RCF e `agents.md`, a fim de evitar potencial dubiedade ou má imperpretação com o histórico atual, passado ou futuro das normas.

## 4. Autoridade, precedência e domínios

### 4.1 Cláusula inicial permanente

`AGENTS.md` DEVE conter, imediatamente no início e em posição perene de máxima precedência interpretativa, cláusula equivalente a:

> No domínio operacional, `/AGENTS.md` e seus associados são obrigatórios, hierarquicamente prevalentes, determinísticos, rastreáveis, semanticamente íntegros e não regressivos. Seus Princípios Estruturantes, Mecanismos Oficiais, contratos, nomenclaturas, hooks e pontos de extensão DEVEM ser preservados e evoluir exclusivamente por composição normatizada. É PROIBIDO aos Repositórios Finais omitir, relativizar, neutralizar, duplicar, substituir, renomear, reimplementar, contornar ou burlar esses mecanismos, criar Fluxo Paralelo ou adaptar a norma à implementação divergente.

A cláusula constitui índice normativo, chave interpretativa e barreira contra degradação cumulativa; NÃO substitui as regras detalhadas.

### 4.2 Autoridade operacional

No respectivo domínio, `AGENTS.md` DEVE ser tratado como autoridade obrigatória e vinculante, jamais recomendação, orientação opcional ou texto adaptável pela implementação.

Todo agente e Repositório Final DEVE:

1. obedecer aos contratos aplicáveis;
2. reutilizar os Mecanismos Oficiais conforme finalidade e nomenclatura;
3. corrigir a implementação quando houver divergência;
4. preservar normas, contratos e efeitos práticos em qualquer revisão;
5. inspecionar o estado real antes de concluir que uma regra é inaplicável ou insuficiente.

Dúvida, desconhecimento ou aparente inadequação exige releitura do contexto aplicável, inspeção dos mecanismos e rastreamento das referências. NÃO autoriza improvisação, inferência livre ou solução unilateral.

Em conflito entre norma e implementação:

- a implementação DEVE ser corrigida, refeita ou descartada;
- a norma NÃO PODE ser enfraquecida para preservar código divergente;
- documentos normativos NÃO PODEM ser editados para legitimar decisão já tomada;
- alteração normativa somente PODE ocorrer quando a solicitação tiver por objeto explícito a própria normatização (e puder ser feita).

### 4.3 Distinção entre `AGENTS.md` e RCF

Imediatamente após a cláusula inicial, `AGENTS.md` DEVE definir:

- **`/AGENTS.md` e associados:** regem **como** a IA e o processo DEVEM operar, incluindo precedência, leitura, análise, edição, validação, rastreabilidade, scripts, hooks, automações, FTs e procedimentos operacionais.
- **RCF:** rege **o que o sistema é e deve fazer**, constituindo sua SSOT arquitetural declarativa, determinística e verificável, abrangendo requisitos, regras, modelos, contratos, componentes, comportamentos, restrições, convenções e critérios de conformidade em nível suficiente para que implementações conformes produzam substancialmente o mesmo sistema, independentemente de tecnologia, linguagem, framework, ferramenta, ambiente, fornecedor ou equipe.

`AGENTS.md` NÃO substitui a arquitetura do sistema; o RCF NÃO substitui a governança operacional. A precedência de `AGENTS.md` restringe-se ao seu domínio exclusivo.

Essa distinção é Princípio Estruturante e JAMAIS PODE ser removida, neutralizada, relativizada, simplificada com perda ou deslocada para posição que favoreça interpretação incorreta.

## 5. Preservação semântica e não regressão

Toda revisão parcial, cirúrgica, ampla, estrutural ou total DEVE preservar integralmente:

- autoridade e precedência;
- separação de domínios;
- contratos e nomenclaturas;
- proibições e exceções;
- hooks e pontos de extensão;
- modus operandi;
- incisividade;
- rastreabilidade;
- força normativa;
- efeitos práticos;
- intenção interpretativa.

Condensação somente é válida sem perda semântica. Havendo risco de ambiguidade, omissão, enfraquecimento ou simplificação degradante, a explicitação DEVE ser preservada ou ampliada.

Otimização de tokens JAMAIS PODE reduzir rigor, minúcia, clareza, incisividade, explicitabilidade, exigibilidade, previsibilidade ou resistência a interpretações desviantes.

A norma DEVE padronizar vocabulário, preferencialmente em maiúsculas:

- `DEVE`: obrigação;
- `NÃO DEVE`: proibição;
- `PODE`: faculdade condicionada;
- `É PROIBIDO`: vedação absoluta;
- `JAMAIS PODE`: proibição estrutural e irrenunciável.
- outros que sejam justificaveis para indicar: exclusividade, exepcionalidade alta ou algo próximo disso, ênfase e intencidade...

Microconceitos e Microtextos Normativos DEVEM ser curtos, inequívocos, reutilizáveis e semanticamente estáveis. Redundância sem função DEVE ser eliminada; reforço mínimo necessário à exigibilidade DEVE ser preservado.

Aplique também multiplos arquivos para indivisualizar, agrupar e compartimentalizar contextos e escopos - evitando leitura de arquivos estensos desnecessariamente, criando inclusão por roteamento, APENAS quando, e se, necessário.

Os Princípios Estruturantes DEVEM ser marcados como permanentes, irremovíveis e não regressivos. Toda edição futura DEVE validar expressamente que nenhum deles foi removido, diluído, relativizado, subordinado, abreviado com perda, tornado facultativo ou substituído.

> **Perda paulatina, gradual ou cumulativa de conteúdo, rigor, autoridade, exigibilidade ou efeito prático é absolutamente inadmissível.**

## 6. Uso compulsório dos Mecanismos Oficiais

Todo Mecanismo Oficial DEVE ser reutilizado conforme finalidade, contrato e nomenclatura.

É PROIBIDO:

- substituir, duplicar, neutralizar ou renomear;
- reimplementar ou contornar o fluxo principal;
- criar Fluxo Paralelo ou funcionalmente equivalente;
- alterar nomenclatura por conveniência local;
- tratar ausência de especialização como autorização para romper o modelo;
- considerar correção funcional do resultado suficiente para legitimar processo incompatível.

### 6.1 Exemplo concreto, sem limitação de alcance

Quando `AGENTS.md` estabelecer fluxo all-in-one com:

- comandos-raiz `release` e `publish`;
- respectivos subcomandos especializados;
- criação controlada de arquivo temporário ou provisório na raiz;
- `push` desse arquivo como gatilho;
- execução exclusiva do workflow no GitHub Actions;

esse modus operandi constitui contrato obrigatório destinado, inclusive, a permitir acionamento sem acesso direto à interface ou execução manual das Actions.

Sem autorização normativa expressa, o Repositório Final NÃO PODE:

- criar workflow concorrente (caso já seja entregue pelo `agents.md`);
- substituir o gatilho por `workflow_dispatch` ou equivalente;
- publicar diretamente da máquina local;
- exigir acesso adicional do usuário;
- duplicar scripts existentes;
- renomear comandos;
- contornar hooks;
- inventar mecanismo alternativo quando houver Extensão Oficial.

`release`, `publish`, arquivos-gatilho e GitHub Actions são exemplos da regra geral, não seus limites.

O construtor de `agents.md` deve normatizar e expor devidamente as regras, diretrizes e caracterisicas de cada script, formas de uso, mantendo a adeência as regras de leitura minima de tokens necessárias, ou seja, a IA deve precisar ler apenas o que for necessário, se for ncessário e quando for necessário, tais manifestos podem estar segregados e desacoplados - isso deve se aplicar a cada script.

## 7. Expansões e especializações

Evolução, ampliação e complementação permanecem permitidas, inclusive por novos scripts, subcomandos, adaptadores, callbacks, validações, integrações ou comportamentos de domínio.

Toda expansão DEVE:

1. preservar o fluxo principal;
2. utilizar Mecanismos Oficiais aplicáveis;
3. integrar-se por hooks, composição, subcomandos, callbacks, adaptadores, arquivos-gatilho, `agents.local.md` ou contratos equivalentes;
4. respeitar nomenclaturas e precedências;
5. evitar duplicação e arquitetura concorrente;
6. permanecer compatível com contratos comuns.

É PROIBIDO usar necessidade específica para reinventar o mecanismo, substituir o ponto oficial, reimplementar o fluxo principal, alterar a arquitetura normativa, duplicar comandos ou converter extensão em substituição.

A necessidade de expansão NÃO autoriza reinvenção. A necessidade de complemento NÃO autoriza substituição. A ausência de comportamento específico NÃO autoriza desvio.

Havendo mais de uma opção oficial, a escolha DEVE seguir os critérios normatizados.

## 8. Lacunas oficiais e exceção provisória

### 8.1 Verificação

Diante de possível Lacuna Oficial, a IA DEVE:

1. validar o problema contra o estado oficial e atual do Repositório Normativo (`agents.md`);
2. não confiar apenas em cópia local potencialmente desatualizada;
3. comparar versões, contratos, scripts e documentação;
4. recomendar atualização da fonte local quando houver divergência (ao desenvolvedor);
5. confirmar que a deficiência permanece após a atualização.

### 8.2 Issue normativa

Issue no Repositório Normativo (`agents.md`) somente PODE ser criada quando o problema:

- for comprovadamente atual;
- for generalizável a múltiplos Repositórios Finais;
- decorrer do Mecanismo Oficial, não de particularidade local;
- estiver documentado com reprodução, impacto, riscos e limitações;
- incluir correções, código ou estratégias aderentes à Norma Operacional.

Problema estritamente local NÃO autoriza issue normativa.

Criada a issue, ela DEVE apenas ser registrada. É PROIBIDO iniciá-la, tratá-la, movimentá-la, atribuí-la, implementá-la, encerrá-la ou dar-lhe andamento.

FTs efetivamente dependentes da lacuna, sem alternativa aderente, DEVEM ser suspensas. FTs independentes ou executáveis pelos mecanismos existentes DEVEM prosseguir prioritariamente.

### 8.3 Correção provisória extrema

Somente quando a suspensão impedir materialmente a continuidade e não existir solução aderente, PODE ser aplicada correção provisória de código.

A exceção DEVE:

- ser extrema, temporária, restritiva e demonstrada;
- limitar-se ao mínimo indispensável;
- preservar o modus operandi oficial;
- não criar arquitetura, nomenclatura ou fluxo concorrente;
- não alterar norma local para substituir `AGENTS.md`;
- ser testada antes da retomada;
- ser documentada e vinculada em `AGENTS.local.md`;
- ser explicitamente reversível;
- possuir critério objetivo de remoção.

Nesse caso, a issue normativa DEVE ser criada somente após implementação, validação e comprovação funcional da correção provisória, incluindo as estratégias utilizadas devidamente generalizadas e expurgadas de dados sensíveis.

Quando a solução oficial for incorporada, nova FT DEVE remover a exceção, converter ou integrar a solução ao mecanismo oficial, restaurar plena aderência e eliminar resíduos de `AGENTS.local.md`.

## 9. Arquitetura normativa e custo de leitura

`AGENTS.md` DEVE perseguir continuamente a melhor relação tecnicamente alcançável entre:

`bytes/tokens × densidade informacional × compreensibilidade × custo de recuperação`

Faixas recomendadas DEVEM acompanhar práticas modernas compatíveis com Codex/ChatGPT — IA primária, mas não única destinatária — sem transformar valores conjunturais em limites rígidos superiores à preservação normativa.

Tamanho reduzido e densidade máxima permanecem obrigatórios, mas NÃO PODEM ser obtidos mediante perda de regra, alcance, contexto, exceção, nuance, rigor, explicitude, rastreabilidade ou previsibilidade.

### 9.1 Modularização e leitura seletiva

A Norma Operacional DEVE adotar Microtextos Normativos equivalentes a microfunções:

- um conceito ou contrato delimitado por unidade;
- significado coeso, autônomo e estável;
- referência inequívoca à fonte canônica;
- reutilização sem duplicação;
- carregamento seletivo;
- rastreabilidade completa.

Quando mais eficiente, os microtextos PODEM compor estrutura hierárquica ou grafo de dependências. Essa estrutura DEVE:

- manter raiz normativa mínima e obrigatória;
- declarar pré-requisitos e dependências;
- impedir ciclos, referências órfãs e cadeias excessivas;
- permitir carregamento por tarefa, contexto, escopo e finalidade;
- preservar regras gerais em níveis comuns;
- carregar especializações somente quando aplicáveis;
- impedir que detalhes locais contaminem o contexto global;
- reduzir tokens efetivamente lidos sem reduzir a norma disponível;
- evitar que economia de tokens produza dispersão ou navegação mais cara.

Para cada tarefa, a IA DEVE ler somente:

1. núcleo global obrigatório;
2. índices e contratos de roteamento;
3. normas efetivamente aplicáveis;
4. dependências expressamente referenciadas.

O acervo físico PODE exceder faixas ideais quando a cobertura exigir; o trajeto efetivo de leitura DEVE permanecer seletivo, proporcional e determinístico.

`AGENTS.md` e associados PODEM ser segregados em diretórios únicos e estáveis por domínio, contexto, escopo, finalidade, precedência, dependência, aplicabilidade ou frequência de leitura.

### 9.2 RCF construtor

O RCF construtor possui finalidade distinta e complementar:
O termo RCF construtor é apenas um termo usado para referi-se ao RCF do repositório construtor de `agents.md` (**REF-CNSTRUTOR-EDICAO-UNICA-EXCLUSIVA:**).

- `AGENTS.md` é o produto operacional condensado para consumo recorrente;
- o RCF construtor é o contrato capaz de reproduzi-lo, auditá-lo, contestá-lo e reconstruí-lo desde zero.

O RCF construtor PODE e DEVE ser relativamente maior, privilegiando completude, explicitação e capacidade reconstrutiva. DEVE registrar regras, intenções, exceções, invariantes, relações, critérios e razões normativas, preencher lacunas previsíveis e permitir recuperação de conceitos omitidos ou enfraquecidos.

Sua maior extensão NÃO autoriza prolixidade ou duplicação inútil. Densidade, modularidade e leitura seletiva permanecem obrigatórias, subordinadas à completude reconstrutiva.

### 9.3 Objetivos e métricas

Máxima densidade com mínimos tokens e máxima completude com rigor integral são objetivos simultâneos:

- se reduzir tokens causar perda normativa, a preservação prevalece;
- se a mesma informação puder ser preservada com menos bytes ou melhor estrutura, a otimização é obrigatória.

A evolução DEVE considerar:

- tokens totais e efetivamente lidos por tarefa;
- densidade normativa;
- duplicação semântica;
- quantidade e profundidade das dependências;
- custo de navegação e recuperação;
- aderência comportamental;
- incidência de interpretações incorretas;
- capacidade de reconstrução;
- estabilidade entre revisões.

## 10. Automação de operações mecânicas

A IA DEVE manter verificação breve e permanente:

> Isto exige julgamento da IA ou pode ser mecanizado com menor Custo Líquido?

A verificação NÃO DEVE tornar-se reflexão extensa ou mais cara que a tarefa.

Operações mecânicas, repetitivas, determinísticas ou predominantemente transformacionais — como filtragem, ordenação, extração, agregação, comparação, conversão, validação, normalização, indexação e geração — DEVEM ser delegadas a script quando houver ganho líquido real.

O script DEVE:

- ser proporcional ao uso;
- possuir entrada e saída estáveis;
- produzir resultado determinístico e validável;
- falhar explicitamente;
- limitar volumes e recursos;
- preservar erros, avisos e diagnóstico útil;
- gerar conteúdo condensado para análise;
- evitar dependências desnecessárias;
- respeitar convenções, hooks e nomenclaturas oficiais;
- ser reutilizável quando houver recorrência.

A IA NÃO DEVE:

- repetir operação já automatizada;
- criar script descartável quando houver equivalente;
- transferir julgamento normativo, arquitetural ou semântico predominante;
- gastar mais para automatizar do que para executar, salvo benefício estrutural ou recorrência provável;
- permitir que a própria autoanálise se torne custo relevante.

Após validar script local, DEVE-se verificar se solução equivalente existe no Repositório Normativo. Se existir, a solução local DEVE ser conciliada com ela.

Issue de promoção somente PODE ser criada quando o script for reutilizável, generalizável, aplicável a múltiplos Repositórios Finais, independente de particularidades locais e pertencente ao domínio operacional. A issue DEVE demonstrar problema, custo evitado, implementação, integração, testes, riscos e sanitização dos dados, permanecendo apenas registrada.

## 11. Persistência de solicitações não rastreáveis

Toda Solicitação Não Rastreável que origine correção, melhoria, recurso, refatoração, investigação, norma ou FT DEVE ser registrada antes da execução material relevante.

O registro DEVE preservar:

- íntegra literal da solicitação e complementações;
- anexos, conteúdos colados e referências;
- origem, data e identificador estável;
- FTs relacionadas;
- estado de normatização;
- RCFs de destino;
- histórico mínimo de incorporação.

Os registros DEVEM utilizar localização canônica e exclusiva sob `.ia.rules/`, conforme convenção oficial ou estrutura equivalente:

```text
.ia.rules/requests/pending/<data>-<id>-<slug>/
├── request.md
├── attachments/
└── index.yml
````

É PROIBIDA criação arbitrária de estrutura pelo Repositório Final quando houver convenção oficial.

Cada FT DEVE referenciar o identificador e o caminho do registro; o registro DEVE listar todas as FTs vinculadas.

Os arquivos DEVEM:

* ser versionados no Git;
* integrar commits temporários ou intermediários;
* receber exceção restrita no `.gitignore`, se necessária;
* permanecer enquanto houver conteúdo não incorporado aos RCFs;
* não depender exclusivamente do histórico efêmero da ferramenta.

A exceção no `.gitignore` NÃO PODE expor caches, credenciais, logs ou outros conteúdos internos.

O registro DEVE ser removido assim que requisitos, regras, exceções, anexos relevantes, nuances, critérios e intenção estiverem integralmente incorporados aos RCFs canônicos.

Antes da remoção:

1. validar que nenhum conteúdo útil permanece exclusivo;
2. atualizar as FTs com referências definitivas;
3. remover texto e anexos temporários;
4. registrar a remoção no commit de normatização.

A remoção NÃO DEVE aguardar implementação, testes, release ou conclusão das FTs. É PROIBIDO remover antes da normatização integral, reter sem necessidade, manter cópias residuais, substituir prematuramente a íntegra por resumo ou registrar somente a interpretação da IA.

## 12. Compactação contínua do contexto

A Norma Operacional DEVE exigir compactação contínua, preventiva e segura do contexto, ou mecanismo equivalente, sempre que houver ganho líquido sem risco material à tarefa.

A compactação DEVE ser avaliada:

* periodicamente;
* após marcos relevantes;
* depois da persistência de decisões;
* antes de operações extensas;
* diante de redundância ou conteúdo substituído por fonte canônica;
* antes do limiar crítico da janela.

Antes de compactar, a IA DEVE confirmar que:

1. haverá redução de Custo Líquido;
2. nenhuma informação necessária será perdida;
3. nenhuma operação indivisível será interrompida;
4. decisões, restrições, exceções e pendências permanecerão;
5. a retomada será determinística.

Conforme aplicabilidade, DEVEM ser preservados:

* objetivo e escopo;
* solicitação ainda não normatizada;
* restrições e proibições;
* decisões e justificativas necessárias;
* FTs, etapas e estados;
* arquivos alterados ou pendentes;
* erros e diagnósticos relevantes;
* validações executadas e pendentes;
* comandos, hooks e contratos;
* referências, riscos, bloqueios e próximos passos.

Conteúdo integralmente persistido em RCF, FT, issue, `TODO.ia.md`, `continue.ia`, registro temporário ou outra SSOT DEVE ser substituído por referência compacta quando sua recuperação for confiável.

É PROIBIDO compactar de modo que elimine conteúdo não persistido, suprima exceções, converta obrigação em resumo facultativo, preserve interpretação no lugar da fonte, exija reconstrução especulativa, provoque releitura integral ou tenha custo superior à economia.

Cada compactação DEVE produzir estado mínimo, denso e verificável, distinguindo fatos, fontes, decisões, trabalho concluído, pendências, riscos e referências de retomada.

## 13. Custo temporal e execução desacoplada

Quando o ambiente cobrar ou limitar tempo ativo da IA, a Norma Operacional DEVE considerar o custo de aguardar scripts, APIs, consultas, builds, testes, integrações ou comandos externos.

Flood de console DEVE permanecer filtrado. Quando houver vantagem e segurança, processos demorados DEVEM ser executados de forma desacoplada, com:

* acompanhamento resumido para o desenvolvedor;
* saída diagnóstica persistente;
* comando e argumentos sanitizados;
* diretório, início e PID ou identificador;
* término, duração e código de saída;
* estado inequívoco: `executando`, `concluído`, `falhou`, `cancelado` ou `interrompido`;
* meios de cancelamento, limpeza e retomada quando aplicáveis.

A IA NÃO DEVE permanecer ativa apenas para espera passiva quando sua participação não for necessária - exceto se sua espera não gerar custos/cobrança, consumo de créditos, de horário, ou equivalente.

Execução desacoplada somente PODE ocorrer quando o processo:

* sobreviver corretamente à sessão;
* não exigir interação imediata da IA;
* não expuser segredos à rede/internet;
* possuir estado e saída verificáveis;
* puder preservar erros/falhas/kill/debug gerados (incluindo pelo próprio comando/script) para verificação posterior pela IA (quando da retomada) em algum path/registro previavemente estipulado;
* não gerar processo órfão;
* se necessitar se retomado explicitamente, ter indicador ou saída visual clara para o desenvolvedor quando ao término (com sucesso,falha,erro, kill...);
* respeitar hooks e contratos oficiais.

É PROIBIDO ocultar falhas, iniciar processo sem verificação de conclusão, abandonar locks ou temporários, registrar credenciais, perder `stderr`, considerar ausência de saída como sucesso, desacoplar operação dependente de decisões intermediárias ou realizar polling cujo custo anule o benefício.

Na retomada, a IA DEVE verificar o estado real, ler primeiro resumo, código de saída e trechos finais, consultar o log integral somente quando necessário, distinguir falha de script, ambiente ou tarefa e evitar reexecutar operação concluída.

## 14. Encadeamento e unificação de comandos

Quando a solicitação exigir vários comandos, a análise DEVE considerar o custo agregado.

Comandos dependentes ou habitualmente sequenciais DEVEM ser consolidados em orquestrador quando isso melhorar reprodutibilidade, medição, interrupção segura, retomada, diagnóstico, filtragem, logs ou códigos de saída.

O orquestrador DEVE registrar, por etapa:

* identificador e comando sanitizado;
* início, fim e duração;
* resultado e código de saída;
* motivo de interrupção;
* localização dos logs.

Estimativas ou histórico de duração DEVEM orientar a escolha entre execução síncrona e desacoplada.

Encadeamento recorrente DEVE tornar-se script unificador. Quando generalizável, reutilizável por múltiplos Repositórios Finais e pertencente ao domínio operacional, DEVE integrar os Mecanismos Oficiais e adotar nomenclatura `shared:*`.

Se ainda não existir no Repositório Normativo, PODE ser criada issue contendo generalização, custo evitado, encadeamento, nome `shared:*`, integração, execução desacoplada, logs, estados, erros, cancelamento, retomada, implementação sanitizada, testes e critérios de aceite.

Encadeamento estritamente local permanece no Repositório Final. A issue normativa criada DEVE apenas ser registrada.

## 15. Ordem de implementação

A correção DEVE:

1. ler o núcleo normativo, índices, RCF construtor e documentos associados aplicáveis;
2. mapear precedência, conceitos, Mecanismos Oficiais e duplicações;
3. identificar regras ausentes, dispersas, contraditórias ou enfraquecidas;
4. consolidar conceitos canônicos e Princípios Estruturantes;
5. reintegrar autoridade, distinção `AGENTS.md` × RCF e não regressão;
6. consolidar uso, extensão e tratamento de Lacunas Oficiais;
7. reorganizar arquitetura de leitura e relação com o RCF construtor;
8. integrar automação, rastreabilidade temporária, compactação e custo temporal;
9. alterar somente os documentos responsáveis por cada domínio;
10. substituir duplicações por referências canônicas;
11. implementar validações e testes;
12. comprovar preservação dos contratos preexistentes;
13. validar o trajeto seletivo de leitura;
14. emitir relatório final rastreável.

## 16. Validação

A solução DEVE detectar ou impedir:

* alteração de nomenclaturas normatizadas;
* scripts, comandos ou workflows duplicados;
* Fluxos Paralelos;
* substituição de gatilhos;
* publicação local proibida;
* contorno de hooks;
* extensão fora do ponto oficial;
* alteração normativa para legitimar código;
* remoção ou diluição de Princípio Estruturante;
* referências órfãs, cíclicas ou excessivamente profundas;
* duplicação semântica;
* retenção ou remoção indevida de solicitações temporárias;
* compactação com perda de estado;
* automação que suprima diagnóstico;
* execução desacoplada sem estado verificável;
* promoção incompatível de scripts;
* exceção provisória sem vínculo, reversibilidade ou critério de remoção.

Quando validação automática integral não for viável, DEVE existir verificação determinística equivalente e documentada.

## 17. Relatório final

O relatório DEVE registrar:

* arquivos alterados;
* conceitos centralizados;
* duplicações removidas;
* referências introduzidas;
* regras e contratos preservados;
* incompatibilidades e Lacunas Oficiais encontradas;
* testes e resultados;
* limitações remanescentes;
* evidências de não regressão;
* redução obtida em bytes, tokens, duplicação e trajeto efetivo de leitura.

Cada alteração DEVE ser rastreável ao problema, requisito ou Princípio Estruturante correspondente.

## 18. Critérios de aceite

* [ ] `AGENTS.md` está declarado obrigatório e prevalente em seu domínio.
* [ ] A implementação está inequivocamente subordinada à norma.
* [ ] A distinção permanente entre `AGENTS.md` e RCF está definida.
* [ ] A cláusula inicial de autoridade e não regressão foi incorporada.
* [ ] Princípios Estruturantes estão protegidos contra remoção ou diluição.
* [ ] Alteração normativa para legitimar implementação divergente está proibida.
* [ ] Mecanismos Oficiais e respectivas nomenclaturas possuem uso compulsório.
* [ ] Fluxos paralelos, substitutivos, duplicados ou equivalentes estão proibidos.
* [ ] `release`, `publish`, arquivos-gatilho e GitHub Actions permanecem preservados conforme seus contratos.
* [ ] Expansões ocorrem somente por Extensão Oficial.
* [ ] Lacunas são verificadas contra o estado oficial atual.
* [ ] Issues normativas exigem atualidade e generalização e permanecem apenas registradas.
* [ ] FTs bloqueadas e independentes recebem tratamento distinto.
* [ ] Exceções provisórias são mínimas, testadas, reversíveis e vinculadas a `AGENTS.local.md`.
* [ ] Revisões futuras validam perda, diluição, supressão ou substituição.
* [ ] Condensação está subordinada à preservação semântica integral.
* [ ] Microconceitos e Microtextos Normativos possuem definição canônica.
* [ ] A arquitetura permite leitura seletiva sem ciclos, órfãos ou duplicação.
* [ ] O RCF construtor preserva capacidade integral de reconstrução.
* [ ] Tokens totais e efetivamente lidos são medidos separadamente.
* [ ] Operações mecânicas vantajosas são delegadas a scripts determinísticos.
* [ ] Promoção normativa de scripts exige generalização comprovada.
* [ ] Solicitações Não Rastreáveis são preservadas até sua normatização integral.
* [ ] Registros temporários são versionados, bidirecionalmente rastreáveis e removidos no marco correto.
* [ ] Compactação preserva estado suficiente para retomada determinística.
* [ ] Processos demorados podem ser desacoplados com logs, estados e controle verificáveis.
* [ ] A IA não permanece em espera passiva desnecessária (quando isso gera custos, ou consome crédito/horas/tokens e análogos).
* [ ] Encadeamentos recorrentes são unificados e, quando generalizáveis, expostos como `shared:*`.
* [ ] Validações detectam mecanismos, workflows, comandos, extensões e nomenclaturas divergentes.
* [ ] Nenhuma regra, exceção, dependência, nuance ou consequência prática foi perdida.
* [ ] A refatoração reduziu efetivamente volume, duplicação e custo de leitura sem enfraquecimento normativo.

## Comentários e atividade material na captura

1. `2026-07-22T17:42:54Z`, `github-actions`, https://github.com/jcempro/agents.md/issues/9#issuecomment-5049462251 — “Alta recomendação técnica: a proposta demonstra lacuna reproduzível, benefício amplo e critérios de aceite verificáveis; requer decisão manual do mantenedor. Motivo: a lacuna é reproduzível, reutilizável e possui evidências suficientes.” Marcador `<!-- agents-inbox:5d6a16ac1034506e -->`.
2. `2026-07-22T17:43:23Z`, `github-actions`, https://github.com/jcempro/agents.md/issues/9#issuecomment-5049466710 — “Implementação iniciada. FT: FT-050.” Marcador `<!-- agents-development:9:FT-050 -->`.
3. O mesmo comentário técnico do item 1 foi repetido, sem conteúdo material novo, com os marcadores e instantes: `dbdba677253e2d40` (`2026-07-22T17:46:54Z`), `a85a2d6dc48261d9` (`2026-07-22T19:23:00Z`), `db720a1db2930a84` (`2026-07-22T19:35:57Z`), `bc358853fd68e83b` (`2026-07-22T20:31:37Z`), `4472276e184b9f1e` (`2026-07-22T20:41:18Z`), `784733cc70cad79c` (`2026-07-22T21:39:04Z`), `7d5a6fd3f2169262` (`2026-07-22T22:52:18Z`), `d3822aa4855488ac` (`2026-07-22T22:52:40Z`), `c921295978afa712` (`2026-07-22T22:54:18Z`), `f3021ef6c45c689a` (`2026-07-23T01:55:57Z`) e `2f4e91211096dccf` (`2026-07-23T02:20:38Z`).

Este arquivo é temporário e DEVE ser removido no commit da normatização após a auditoria confirmar que nenhuma substância permanece exclusiva nele.
