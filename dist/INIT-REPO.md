# Preâmbulo

Leia integralmente `./AGENTS.md`, seus associados, o RCF vigente, o conteúdo sob o título **Prompt** e o estado real do repositório antes de analisar ou alterar qualquer artefato.

NOTA: se este arquivo não for o próprio `RCF.md` E o título "Prompt" não possuir um texto de prompt reale útil, então, considere que o prompt real estará contido dentro do arquivo `RCF.md`.

Preserve todas as regras, restrições, exceções, precedências, nuances, decisões e contratos válidos já existentes.

Analise antes de implementar.

# 1. Objetivo

Inicialize, construa ou refatore integralmente este repositório e seu `RCF.md` conforme:

1. as diretrizes de edição e operação definidas em `./AGENTS.md`;
2. seus arquivos associados;
3. este pedido;
4. o conteúdo Markdown contido sob o título **Prompt**;
5. os ajustes adicionais declarados antes desse título, quando existirem.

O conteúdo sob o título **Prompt** DEVE ser tratado como fonte primária dos requisitos de negócio específicos a serem normatizados no novo `RCF.md`, subordinado apenas à precedência já estabelecida por `./AGENTS.md`.

# 2. Eficiência Contextual

A IA DEVE compactar progressivamente o contexto durante toda a execução.

A compactação DEVE minimizar:

- tokens lidos;
- tokens emitidos;
- memória contextual;
- repetição;
- custo computacional;
- tempo de processamento.

A compactação NÃO DEVE reduzir:

- precisão;
- cobertura;
- qualidade;
- rastreabilidade;
- regras;
- exceções;
- dependências;
- decisões;
- pendências;
- contexto necessário à etapa atual;
- capacidade de retomada determinística.

Conteúdo já consolidado DEVE ser substituído por referência compacta sempre que isso reduzir o custo líquido sem perda informacional.

# 3. Ordem Obrigatória

A execução DEVE seguir estritamente esta sequência:

1. carregar integralmente no contexto o conteúdo Markdown sob o título **Prompt**;
2. ler `./AGENTS.md`, seus associados, o RCF existente e o estado real do repositório;
3. analisar requisitos, conflitos, lacunas, precedências, artefatos existentes e impactos;
4. criar ou atualizar as FTs;
5. separar claramente:
   - normatização do projeto;
   - futura implementação do código;

6. detalhar as FTs em etapas, tarefas, dependências, riscos, arquivos previstos, testes e critérios de aceite;
7. compactar o contexto;
8. criar ou reescrever integralmente `RCF.md`;
9. criar ou refatorar `README.md`;
10. validar somente a etapa normativa;
11. remover o artefato transitório que contenha esta solicitação, quando aplicável;
12. criar commit documental;
13. executar push;
14. compactar novamente o contexto;
15. encerrar sem implementar código;
16. informar explicitamente que a continuidade depende de autorização do desenvolvedor.

# 4. Separação entre Norma e Código

As FTs DEVEM distinguir inequivocamente:

## 4.1 Frente normativa

DEVE abranger:

- análise;
- taxonomia;
- contratos;
- RCF global;
- sub-RCFs indispensáveis;
- README;
- schemas declarativos indispensáveis;
- validação documental;
- commit;
- push.

## 4.2 Frente de implementação

DEVE permanecer planejada, mas NÃO iniciada.

Ela PODE prever:

- arquitetura;
- código;
- bibliotecas;
- dependências;
- testes;
- builds;
- integrações;
- automações;
- CI/CD;
- publicação.

A simples criação da FT de implementação NÃO autoriza sua execução.

# 5. Tratamento do Arquivo que Contém esta Solicitação

Quando esta solicitação estiver inserida no próprio `RCF.md`:

1. seu conteúdo DEVE ser integralmente lido;
2. seus requisitos DEVEM ser consolidados no contexto;
3. o arquivo real DEVE ser totalmente reescrito;
4. esta solicitação transitória DEVE ser substituída pelo novo conteúdo normativo;
5. nenhum fragmento instrucional transitório DEVE permanecer no RCF final, salvo quando convertido em norma aplicável.

Quando esta solicitação estiver contida em outro arquivo do repositório:

1. o arquivo DEVE permanecer disponível até a conclusão e validação do novo `RCF.md`;
2. depois disso, DEVE ser eliminado quando sua única finalidade for transportar esta solicitação;
3. ele NÃO DEVE ser eliminado se possuir outra função válida;
4. a exclusão DEVE integrar o commit documental.

Arquivos externos ao repositório NÃO DEVEM ser excluídos.

# 6. Construção do `RCF.md`

O `RCF.md` DEVE ser integralmente criado ou reescrito para:

- aderir ao padrão de `./AGENTS.md`;
- normatizar todo o projeto;
- incorporar os requisitos sob **Prompt**;
- incorporar os ajustes adicionais aplicáveis;
- preservar regras válidas existentes;
- corrigir conflitos, ambiguidades e lacunas;
- remover redundâncias com normas superiores;
- permanecer determinístico, autossuficiente e rastreável;
- separar regras globais de especializações;
- evitar detalhes internos de implementação quando múltiplas soluções puderem cumprir o contrato.

Conteúdo do RCF anterior PODE ser:

- preservado;
- condensado;
- reorganizado;
- especializado;
- transferido ao README;
- removido quando já estiver integralmente coberto por `./AGENTS.md`.

A remoção NÃO DEVE eliminar:

- regra específica;
- restrição;
- exceção;
- decisão arquitetural;
- contrato;
- requisito funcional;
- requisito não funcional;
- compatibilidade;
- rastreabilidade;
- nuance válida.

# 7. `README.md`

Um `README.md` DEVE existir na raiz.

Quando inexistente, DEVE ser criado.

Quando existente, DEVE ser refatorado somente quando necessário para cumprir este contrato.

Ele DEVE ser ultrassucinto, informativo e não normativo.

## 7.1 Descrição

O início do README DEVE conter descrição compacta do repositório, adequada também ao campo **About** do GitHub.

A descrição DEVE:

- identificar claramente o projeto;
- explicar sua finalidade;
- evitar prolixidade;
- não anunciar como implementado o que ainda for apenas planejado.

## 7.2 Referências normativas

O README DEVE conter links para:

- `RCF.md`;
- `AGENTS.md`.

Cada link DEVE possuir explicação ultrassucinta:

- `RCF.md`: normas, contratos e requisitos do projeto;
- `AGENTS.md`: processo, precedência e modus operandi da IA no repositório.

## 7.3 Badges e indicadores

O README DEVE conter badges ou indicadores adequados ao contexto do projeto.

Eles DEVEM representar, quando aplicável:

- validações do repositório;
- status `pass` ou `fail`;
- licença;
- linguagens;
- versões;
- sistemas operacionais;
- client-side;
- server-side;
- workers;
- runtimes;
- builds;
- cobertura;
- pacote;
- release;
- manutenção;
- compatibilidade;
- outros indicadores relevantes.

Badges referentes a capacidades ainda não implementadas DEVEM ser:

- omitidos;
- ou identificados inequivocamente como planejados, pendentes ou não disponíveis.

Nenhum badge DEVE indicar aprovação, cobertura, compatibilidade ou disponibilidade não verificada.

O badge principal de validação DEVE apontar para o workflow ou mecanismo real correspondente quando este existir.

## 7.4 Evolução dos badges

O RCF DEVE normatizar que badges e indicadores do README:

- DEVEM acompanhar a evolução do escopo;
- DEVEM ser atualizados quando linguagens, runtimes, plataformas, builds, testes, licenças ou status mudarem;
- NÃO DEVEM permanecer obsoletos;
- NÃO DEVEM apresentar informação enganosa;
- DEVEM ser removidos quando deixarem de representar o estado real.

## 7.5 Autoria e licença

Ao final, o README DEVE conter seção apropriada com:

- nome do autor;
- link para seu site;
- e-mail, quando disponível e autorizado;
- nome da licença;
- link para o texto integral da licença;
- texto ultrassucinto de licença ou atribuição comumente usado em cabeçalhos de código.

A IA NÃO DEVE inventar:

- nome;
- e-mail;
- site;
- licença;
- URL;
- titularidade.

Dados ausentes DEVEM ser recuperados do repositório ou registrados como pendência.

# 8. Badges Antes da Implementação

Quando workflows, testes, pacotes ou builds ainda não existirem:

- o README NÃO DEVE exibir status de aprovação fictício;
- o RCF DEVE normatizar os badges futuros;
- as FTs de implementação DEVEM prever sua criação;
- indicadores estáticos PODEM informar estado documental, planejamento ou licença quando verdadeiros;
- indicadores dinâmicos somente DEVEM ser adicionados após existir fonte real verificável.

# 9. FTs

As FTs DEVEM ser criadas ou atualizadas antes da edição normativa.

Elas DEVEM contemplar, quando aplicável:

- leitura e consolidação;
- análise do repositório;
- refatoração do RCF;
- sub-RCFs;
- README;
- badges;
- autoria;
- licença;
- schemas;
- validação documental;
- remoção do arquivo transitório;
- commit documental;
- push;
- futura implementação;
- testes;
- workflows;
- bibliotecas;
- builds;
- publicação.

Cada FT DEVE declarar:

- identificador;
- nome;
- objetivo;
- prioridade;
- status;
- escopo;
- não escopo;
- dependências;
- etapas;
- tarefas;
- arquivos previstos;
- riscos;
- testes;
- critérios de aceite;
- ordem de execução;
- vínculo com o RCF.

A FT normativa DEVE ser concluída nesta execução.

A FT de código DEVE permanecer pendente de autorização explícita.

# 10. Validação Documental

Antes do commit, a IA DEVE validar:

- aderência a `./AGENTS.md`;
- precedência;
- cobertura do conteúdo sob **Prompt**;
- incorporação dos ajustes anteriores;
- preservação das regras válidas;
- ausência de redundância desnecessária;
- ausência de contradições;
- separação entre norma e implementação;
- completude do RCF;
- existência e concisão do README;
- validade dos links internos;
- veracidade dos badges;
- autoria;
- licença;
- rastreabilidade entre requisitos, FTs e RCF;
- ausência da solicitação transitória no artefato final;
- ausência de implementação antecipada.

A IA NÃO DEVE declarar como realizada qualquer validação não executada.

# 11. Commit e Push

Após concluir e validar a etapa normativa, a IA DEVE obrigatoriamente:

1. revisar o diff;
2. confirmar que somente alterações documentais e normativas autorizadas foram incluídas;
3. criar commit;
4. utilizar mensagem sucinta e descritiva;
5. executar push para o destino configurado;
6. verificar o resultado;
7. registrar hash, branch, remote e status.

A IA NÃO DEVE:

- incluir implementação de código no commit;
- incluir segredos;
- ignorar falha do push;
- declarar sucesso quando o push não tiver sido confirmado.

Se commit ou push forem impedidos por:

- ausência de repositório Git;
- falta de remote;
- autenticação;
- proteção de branch;
- permissão;
- conflito;
- indisponibilidade externa;

a IA DEVE:

- preservar todo o trabalho;
- registrar o impedimento exato;
- fornecer os comandos necessários;
- NÃO simular conclusão.

# 12. Compactação Após o Push

Após commit e push, ou após registrar impedimento externo, a IA DEVE compactar novamente o contexto.

A compactação final DEVE preservar:

- FTs;
- estado da norma;
- decisões;
- arquivos alterados;
- commit;
- push;
- impedimentos;
- pendências;
- ponto exato de retomada;
- condição para iniciar a implementação.

# 13. Proibição de Implementação Antecipada

Nesta execução, a IA NÃO DEVE:

- implementar código funcional;
- escolher definitivamente bibliotecas;
- instalar dependências;
- importar bibliotecas;
- alterar arquitetura executável;
- criar builds;
- criar pacote;
- implementar testes de código;
- implementar workflows de código;
- iniciar CI/CD funcional;
- publicar releases;
- executar a FT de implementação.

Bibliotecas e tecnologias PODEM ser mencionadas nas FTs ou no RCF apenas como:

- requisitos de avaliação;
- alternativas;
- critérios;
- decisões pendentes;
- direções não vinculantes.

# 14. Continuidade

A implementação de código, seleção definitiva de tecnologia, instalação de dependências, importação de bibliotecas, criação de builds e execução das FTs técnicas somente PODEM começar após solicitação nova, explícita e inequívoca do desenvolvedor.

Ao término desta execução, a IA DEVE informar expressamente:

> A etapa normativa foi concluída. Para prosseguir, o desenvolvedor deve autorizar explicitamente o início da etapa de implementação do código.

Essa mensagem NÃO DEVE ser interpretada como autorização automática.

# 15. Saída Final

A resposta final DEVE ser ultrassucinta e conter:

- RCF criado ou refatorado;
- sub-RCFs criados, quando existirem;
- README criado ou refatorado;
- FTs criadas ou atualizadas;
- arquivo transitório removido, quando aplicável;
- validações executadas;
- commit;
- push;
- impedimentos;
- pendências;
- confirmação de que nenhum código funcional foi implementado;
- solicitação explícita de autorização para continuar.

# Prompt

<INSERIR AQUI O PROMPT MARKDOWN ESPECÍFICO DO PROJETO>
