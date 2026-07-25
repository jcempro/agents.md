# Origem preservada — FT-053

- origem: solicitação humana anexada em `2026-07-25`
- identidade: `attachment:f3a0c754-b749-4c54-892d-ca9c1c7b7978/pasted-text.txt`
- sha256: `CBF43AC8EE637A90B2ECB0DE6D377E75EDCABCAE81162C25E6EAA2351F4A8FB7`
- capturado_em: `2026-07-25T19:21:54-03:00`
- fts: `FT-053`, `FT-054`, `FT-055`
- destinos: `RCF.md`; `src/AGENTS.md`; `src/.ia.rules/`; implementação e validação técnica futuras
- estado_incorporacao: `preservado_para_fase_rcf`

---

# Solicitação — Registro indexado de decisões recusadas

Leia integralmente o contexto e os normativos aplicáveis antes de alterar o repositório. Inspecione o estado real, preserve convenções existentes e implemente somente após análise.

## Objetivo

Normatize e implemente um diretório canônico, rastreável e indexado destinado ao registro de solicitações, propostas, decisões ou implementações:

- recusadas;
- parcialmente recusadas;
- adiadas por inviabilidade, inadequação ou insuficiência;
- ainda em andamento, mas que já contenham partes recusadas, descartadas ou condicionadas.

O objetivo é preservar o histórico decisório e prevenir retrabalho, repetição de análises já realizadas e retomadas desinformadas.

Esse mecanismo NÃO DEVE impedir reavaliações futuras. Ele DEVE fornecer contexto suficiente para que, antes de reabrir uma questão, a IA ou o responsável determine se:

1. houve mudança material que justifique nova análise;
2. a decisão anterior ainda permanece válida;
3. a evolução do projeto tornou a proposta novamente pertinente;
4. a questão pode ser descartada imediatamente por continuar incompatível, superada, redundante ou já resolvida por outro meio.

## Requisitos normativos

1. Defina no RCF aplicável e em `AGENTS.md`, quando pertinente, a obrigatoriedade de consultar esse registro antes de:
   - retomar proposta anteriormente rejeitada;
   - reapresentar solução equivalente;
   - reconstruir implementação descartada;
   - reanalisar questão substancialmente idêntica;
   - ampliar item em andamento por caminho já recusado.

2. A consulta prévia NÃO DEVE transformar decisão histórica em proibição permanente.

3. Toda reavaliação DEVE considerar:
   - fundamentos da decisão anterior;
   - estado do projeto no momento da decisão;
   - evolução arquitetural, normativa e funcional posterior;
   - fatos, requisitos ou limitações novos;
   - custo estimado da reanálise;
   - probabilidade de produzir conclusão diferente;
   - risco de regressão ou repetição de retrabalho.

4. Na ausência de mudança material, a IA DEVE preservar a decisão anterior ou justificar tecnicamente por que uma reanálise ainda é proporcional.

5. Quando a questão estiver manifestamente superada, incompatível ou reproduzir hipótese já rejeitada sem fato novo, a IA PODE descartá-la de imediato, registrando a referência à decisão anterior.

6. Nenhum registro DEVE ser removido apenas porque a decisão mudou. Alterações posteriores DEVEM atualizar seu estado e preservar o histórico, a justificativa original e a razão da revisão.

## Estrutura

Crie um diretório único, canônico e adequadamente nomeado, alinhado à arquitetura existente. Não presuma caminho sem antes inspecionar as convenções do repositório.

O diretório DEVE conter:

- índice geral;
- registros individuais ou agrupados por contexto, conforme produzir maior coesão;
- estrutura estável para solicitações concluídas, parciais e em andamento;
- referências cruzadas para FTs, issues, commits, RCFs, arquivos e implementações relacionadas.

Evite fragmentação excessiva. Uma decisão PODE permanecer em registro compartilhado quando pertencer ao mesmo contexto e puder ser localizada inequivocamente.

## Índice canônico

O índice DEVE ser direto, conciso e suficiente para localizar e avaliar cada registro sem reler todo o acervo.

Para cada item, registre, quando aplicável:

- identificador estável;
- título objetivo;
- estado;
- escopo;
- data;
- decisão;
- grau da recusa;
- motivo resumido;
- registro detalhado correspondente;
- artefatos relacionados;
- condição de reavaliação;
- última revisão;
- situação atual.

Estados mínimos:

- `RECUSADO`;
- `PARCIALMENTE_RECUSADO`;
- `ADIADO`;
- `EM_ANDAMENTO_COM_RESTRICOES`;
- `REABERTO`;
- `SUPERADO`;
- `SUBSTITUIDO`;
- `ACEITO_APOS_REAVALIACAO`.

A nomenclatura PODE ser ajustada às convenções existentes, desde que mantenha equivalência semântica e determinismo.

## Conteúdo de cada registro

Cada decisão DEVE preservar, de forma densa e verificável:

1. solicitação ou proposta original;
2. contexto e objetivo;
3. parte aceita, quando houver;
4. parte recusada ou adiada;
5. fundamentos técnicos, normativos ou arquiteturais;
6. alternativas consideradas;
7. impactos e riscos identificados;
8. condição necessária para reavaliação;
9. referências rastreáveis;
10. evolução posterior da decisão;
11. conclusão vigente.

Não registre mera negativa sem fundamento suficiente para orientar análise futura.

## Solicitações em andamento

Quando uma solicitação ainda estiver em execução, mas algum caminho, requisito ou implementação tiver sido recusado:

- registre apenas a parcela recusada ou condicionada;
- preserve a relação com a FT ou tarefa ativa;
- não marque a solicitação integral como rejeitada;
- deixe explícito o que continua válido e em andamento;
- atualize o registro quando a execução alterar sua pertinência.

## Integração operacional

A IA DEVE:

1. consultar o índice durante o planejamento de solicitações potencialmente repetidas;
2. relacionar novas propostas às decisões semanticamente equivalentes;
3. evitar reconstruir solução recusada sem mudança material;
4. atualizar o registro quando uma decisão for confirmada, revista, superada ou substituída;
5. manter consistência com FTs, issues, RCFs, `AGENTS.md`, `continue.ia` e demais fontes aplicáveis;
6. registrar referências suficientes para impedir perda contextual.

Quando tecnicamente proporcional, implemente validação ou automação para detectar:

- identificadores duplicados;
- links quebrados;
- estados inválidos;
- registros sem índice;
- entradas indexadas sem arquivo correspondente;
- decisões reabertas sem justificativa;
- registros obsoletos sem revisão após mudanças relevantes.

## Limites

O mecanismo NÃO DEVE:

- criar lista negra permanente de ideias;
- impedir inovação ou revisão legítima;
- converter decisão contextual em regra universal;
- substituir RCFs, FTs ou issues;
- registrar toda sugestão trivial sem valor histórico;
- produzir burocracia superior ao retrabalho evitado;
- usar o histórico para rejeitar automaticamente proposta materialmente diferente.

## Execução

1. Inspecione a estrutura e os normativos existentes.
2. Escolha o diretório e os formatos mais aderentes ao repositório.
3. Normatize o mecanismo no RCF aplicável.
4. Atualize `AGENTS.md` e demais artefatos necessários.
5. Crie o diretório, o índice e o modelo canônico de registro.
6. Migre decisões recusadas já rastreáveis apenas quando houver evidência suficiente; NÃO invente histórico.
7. Valide estrutura, referências, estados e integração operacional.
8. Atualize a documentação e a rastreabilidade.
9. Apresente relatório final conciso com arquivos alterados, decisões estruturais, validações e pendências reais.

## Critérios de aceite

Considere concluído somente quando:

- existir diretório canônico e indexado;
- recusas totais, parciais e pertinentes a trabalhos em andamento puderem ser registradas sem ambiguidade;
- o histórico preservar fundamentos, contexto, evolução e estado atual;
- a consulta prévia estiver normatizada;
- reavaliações permanecerem permitidas, mas condicionadas à ponderação técnica;
- propostas manifestamente superadas puderem ser descartadas com referência rastreável;
- o mecanismo evitar retrabalho sem restringir evolução legítima;
- índices, registros, links, estados e integrações estiverem validados;
- nenhuma decisão histórica tiver sido inventada ou transformada indevidamente em proibição permanente.
