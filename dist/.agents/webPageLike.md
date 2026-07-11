# webPageLike.md — Cenário Web Page Like

Este arquivo é extensão normativa especializada do `AGENTS.md` §17. Aplica-se somente aos projetos classificados pelos escopos abaixo, cumulativamente com `AGENTS.md`, RCFs e demais cenários pertinentes. Herda integralmente as diretrizes gerais de cenários (`AGENTS.md` §17.1), sem repeti-las. Regra deste arquivo especializa a regra geral apenas em seu escopo; RCF específico prevalece na matéria do projeto conforme a hierarquia global.

As tecnologias, combinações, comandos, valores e estruturas aqui definidos são padrões oficiais do cenário quando a condição correspondente existir. Não constituem regra global para projetos externos ao cenário.

## 1. Web Page Like

### 1.1 Definição

Classifica-se como **Web Page Like** o projeto cuja entrega principal seja consumida por navegador ou engine web e cuja arquitetura possa envolver conteúdo estático, aplicação cliente, componentes, bibliotecas frontend, recursos gerados ou combinações dessas modalidades.

Este cenário padroniza arquitetura, interface operacional, stacks admitidas, build, distribuição, publicação e comportamento de interface. Constitui contrato público para desenvolvedores, automações, CI/CD e IA; reduz ambiguidades, divergências, decisões repetitivas e consumo computacional/contextual.

### 1.2 Escopo

Abrange, quando compatível:

- páginas estáticas;
- aplicações cliente e SPA;
- widgets e componentes reutilizáveis;
- bibliotecas frontend;
- módulos WebAssembly;
- sites gerados estaticamente;
- projetos híbridos;
- sites/blogs baseados em templates.

Cenários de gerador, hospedagem e conteúdo editorial aplicam-se cumulativamente quando pertinentes.

### 1.3 Evolução tecnológica e limites

Stacks podem evoluir, coexistir ou ser substituídas sem mudar a interface pública quando tecnicamente possível, inclusive bundler, React/Preact, Rust/WASM, gerador estático, pipeline e CSS/Sass/módulos.

Este cenário não impede evolução nem novas tecnologias, não substitui RCF específico e define contratos públicos e padrões oficiais, não implementação interna imutável. Entretanto, as combinações, comandos, capacidades e comportamentos aqui normatizados são obrigatórios quando o projeto se enquadrar na linha, capacidade ou condição correspondente; equivalência abstrata não autoriza removê-los.

### 1.4 Combinações tecnológicas normativas

|   # | Linguagem  | UI   | Framework | Estilos      | Build | Jekyll | Rust/WASM | Dev | Prod | Lib | Bundle | Offline |
| --: | ---------- | ---- | --------- | ------------ | ----- | :----: | :-------: | :-: | :--: | :-: | :----: | :-----: |
|   1 | JavaScript | HTML | —         | CSS          | —     |   ❌   |    ❌     | ✅  |  ❌  | ❌  |   ❌   |   ❌    |
|   2 | JavaScript | HTML | —         | SCSS         | —     |   ❌   |    ❌     | ✅  |  ❌  | ❌  |   ❌   |   ❌    |
|   3 | JavaScript | HTML | —         | CSS          | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|   4 | JavaScript | HTML | —         | SCSS         | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|   5 | TypeScript | HTML | —         | CSS          | —     |   ❌   |    ❌     | ✅  |  ❌  | ❌  |   ❌   |   ❌    |
|   6 | TypeScript | HTML | —         | SCSS         | —     |   ❌   |    ❌     | ✅  |  ❌  | ❌  |   ❌   |   ❌    |
|   7 | TypeScript | HTML | —         | CSS          | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|   8 | TypeScript | HTML | —         | SCSS         | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|   9 | TypeScript | HTML | —         | CSS          | Vite  |   ❌   |    ✅     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  10 | TypeScript | HTML | —         | SCSS         | Vite  |   ❌   |    ✅     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  11 | TypeScript | TSX  | React     | CSS          | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  12 | TypeScript | TSX  | React     | SCSS         | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  13 | TypeScript | TSX  | React     | CSS Modules  | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  14 | TypeScript | TSX  | React     | SCSS Modules | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  15 | TypeScript | TSX  | React     | CSS          | Vite  |   ❌   |    ✅     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  16 | TypeScript | TSX  | React     | SCSS         | Vite  |   ❌   |    ✅     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  17 | TypeScript | TSX  | React     | CSS Modules  | Vite  |   ❌   |    ✅     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  18 | TypeScript | TSX  | React     | SCSS Modules | Vite  |   ❌   |    ✅     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  19 | TypeScript | TSX  | Preact    | CSS          | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  20 | TypeScript | TSX  | Preact    | SCSS         | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  21 | TypeScript | TSX  | Preact    | CSS Modules  | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  22 | TypeScript | TSX  | Preact    | SCSS Modules | Vite  |   ❌   |    ❌     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  23 | TypeScript | TSX  | Preact    | CSS          | Vite  |   ❌   |    ✅     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  24 | TypeScript | TSX  | Preact    | SCSS         | Vite  |   ❌   |    ✅     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  25 | TypeScript | TSX  | Preact    | CSS Modules  | Vite  |   ❌   |    ✅     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  26 | TypeScript | TSX  | Preact    | SCSS Modules | Vite  |   ❌   |    ✅     | ✅  |  ✅  | ✅  |   ✅   |   ✅    |
|  27 | JavaScript | HTML | —         | CSS          | —     |   ✅   |    ❌     | ✅  |  ✅  | ❌  |   ❌   |   ❌    |
|  28 | JavaScript | HTML | —         | SCSS         | —     |   ✅   |    ❌     | ✅  |  ✅  | ❌  |   ❌   |   ❌    |
|  29 | JavaScript | HTML | —         | CSS          | Vite  |   ✅   |    ❌     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  30 | JavaScript | HTML | —         | SCSS         | Vite  |   ✅   |    ❌     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  31 | TypeScript | HTML | —         | CSS          | Vite  |   ✅   |    ❌     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  32 | TypeScript | HTML | —         | SCSS         | Vite  |   ✅   |    ❌     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  33 | TypeScript | HTML | —         | CSS          | Vite  |   ✅   |    ✅     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  34 | TypeScript | HTML | —         | SCSS         | Vite  |   ✅   |    ✅     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  35 | TypeScript | TSX  | React     | CSS          | Vite  |   ✅   |    ❌     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  36 | TypeScript | TSX  | React     | SCSS         | Vite  |   ✅   |    ❌     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  37 | TypeScript | TSX  | React     | CSS          | Vite  |   ✅   |    ✅     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  38 | TypeScript | TSX  | React     | SCSS         | Vite  |   ✅   |    ✅     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  39 | TypeScript | TSX  | Preact    | CSS          | Vite  |   ✅   |    ❌     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  40 | TypeScript | TSX  | Preact    | SCSS         | Vite  |   ✅   |    ❌     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  41 | TypeScript | TSX  | Preact    | CSS          | Vite  |   ✅   |    ✅     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |
|  42 | TypeScript | TSX  | Preact    | SCSS         | Vite  |   ✅   |    ✅     | ✅  |  ✅  | ❌  |   ✅   |   ✅    |

**Legenda**

- **Dev:** desenvolvimento.
- **Prod:** build de produção.
- **Lib:** geração de biblioteca reutilizável.
- **Bundle:** empacotamento distribuível.
- **Offline:** capacidade de gerar bundle completamente autocontido, incorporando, quando tecnicamente possível, todos os assets necessários (CSS, imagens, fontes, SVG, WASM, workers, manifestos, JSON, entre outros), eliminando dependências externas.

---

### 1.5 Interface operacional npm

Todo projeto Web Page Like deverá disponibilizar interface npm uniforme por `package.json`, ainda que sua implementação interna varie. Essa interface é API pública e deve permanecer estável.

Hierarquia obrigatória:

1. comandos universais;
2. comandos de grupo;
3. comandos especializados;
4. comandos específicos da implementação.

Quanto mais geral, maior a reutilização. Ao adicionar comando: reutilizar universal → grupo → composição → criar novo somente se nenhuma alternativa atender. Proibido comando redundante que apenas reflita tecnologia interna.

Exemplos inadequados quando já houver comandos semanticamente equivalentes:

```text
vite-dev
react-build
jekyll-build
publish-react
```

A implementação não determina a interface pública. Exemplo:

```text
Hoje:   npm run build → Vite
Amanhã: npm run build → outro bundler
```

A interface permanece `npm run build`; o mecanismo é interno.

Comandos universais obrigatórios sempre que tecnicamente aplicáveis:

```text
dev
live
build
clean
lint
format
test
check
publish
release
prepare
```

Comandos de grupo obrigatórios quando a capacidade correspondente existir:

```text
build:dev
build:prod
build:dist
build:bundle
build:offline
build:lib
build:types
build:docs

dev:watch
dev:live
dev:debug
dev:profile

publish:test
publish:beta
publish:live
publish:github
publish:pages
```

Comando composto deve reutilizar comandos existentes. Exemplo normativo:

```text
release → clean → check → build → publish
```

### 1.6 Operações Git por npm

Operações Git recorrentes deverão ser abstraídas por comandos npm sempre que tecnicamente possível, reduzindo comandos repetitivos, erros e processamento da IA:

```text
commit
push
pull
sync
status
fetch
rebase
branch
```

`commit` deverá aceitar a mensagem por parâmetro e executar a sequência configurada, inclusive `git add`, `git commit` e `git push` quando esse for o contrato. A abstração não pode ocultar falhas, descartar alterações, forçar push sem configuração explícita, contornar proteção de branch nem executar ação destrutiva sem confirmação ou norma.

### 1.7 Parâmetros e artefatos padronizados

Padronizar, sempre que possível e segundo configuração oficial do cenário/projeto:

- portas de desenvolvimento;
- parâmetros, nomes e ordem;
- variáveis de ambiente;
- targets de build/publicação;
- estrutura dos artefatos;
- diretórios de saída (`dist`, `build`, `release` ou equivalente definido);
- comportamento de desenvolvimento, produção, biblioteca, bundle e offline.

Diferença exclusivamente tecnológica deve permanecer transparente ao usuário. O RCF pode fixar valores adicionais; não pode renomear a interface pública sem necessidade técnica comprovada.

### 1.8 Dependências e configuração

Ajustar, conforme a stack, `package.json`, lockfiles, `Gemfile`, compilador, gerador estático, bundler e workflows de CI/CD. Respeitar hospedagem e ambiente de build. Arquivo ignorado não é fonte normativa nem alvo padrão, salvo regra de negócio nele contida, referência normativa explícita, necessidade comprovada ou solicitação autorizada.

### 1.9 Aprimoramento progressivo e independência estrutural

Navegação, leitura e conteúdo essenciais não podem depender exclusivamente de JavaScript quando HTML, CSS ou mecanismos nativos oferecerem o comportamento fundamental:

- HTML: estrutura e semântica;
- CSS/Sass: apresentação e estados;
- recursos nativos: interação básica;
- JavaScript/TypeScript: aprimoramento, coordenação ou fallback controlado.

Ausência, falha ou bloqueio de JavaScript não pode impedir conteúdo estaticamente entregável. Código cliente novo prioriza TypeScript quando compatível, com configuração coerente, tipagem estrita quando aplicável e saída compatível com navegadores/hospedagem do projeto.

### 1.10 Validação visual, responsividade e acessibilidade

Validar estados, temas e dimensões relevantes: textos, fundos, bordas, ícones, controles, foco, interação, ativo/inativo, expandido/recolhido, desktop, mobile, teclado, contraste e ausência de overflow horizontal. Tokens/cores não óbvios recebem comentário curto de uso. Alvos interativos devem servir a clique e toque.

### 1.11 Componentização frontend

Componentes reutilizáveis deverão ser adotados quando reduzirem duplicação e melhorarem isolamento, teste ou manutenção.

Em aplicações compatíveis com componentes de cliente, deverão ser priorizados:

- componentes tipados, preferencialmente `.tsx`;
- estilos em `.scss` ou módulos quando houver ganho real de encapsulamento;
- contratos explícitos de propriedades e eventos;
- componentes pequenos, sem fragmentação artificial.

Em sites baseados em templates, a componentização poderá permanecer em Liquid, HTML, includes, partials ou mecanismo equivalente. Não se deverá introduzir runtime de componentes apenas para substituir composição estática que já seja suficiente.

Antes de adotar Vite ou bundler análogo, deverão ser validados:

- compatibilidade com o gerador e o tema;
- compatibilidade com a hospedagem;
- custo de manutenção;
- impacto no build;
- impacto na depuração;
- benefício efetivo sobre compilação mais simples.

Se a adoção não trouxer vantagem proporcional, deverá ser mantida alternativa simples, como compilação TypeScript por `tsc`, saída JavaScript estática e componentes de template no próprio gerador.

---

### 1.12 Tema claro e escuro

Quando o projeto possuir alternância de tema, a implementação principal deverá utilizar CSS ou Sass e Custom Properties.

O seletor de tema deverá:

- possuir dimensões discretas;
- ter menor destaque que o conteúdo principal;
- funcionar em desktop e mobile;
- identificar modo claro e escuro por ícones ou rótulos compreensíveis;
- utilizar, quando adotado pelo projeto, ícone de sol para o modo claro e lua para o modo escuro;
- possuir transição visual suave, sem prejudicar usuários sensíveis a movimento;
- preservar foco visível e contraste validado.

Deverá ser reutilizada a biblioteca de ícones padrão do projeto. Quando o tema já utilizar Font Awesome e não houver norma em contrário, ele poderá ser adotado como padrão; biblioteca equivalente não deverá ser adicionada apenas para esse controle.

Todos os componentes deverão permanecer legíveis e funcionais nos dois modos.

A preferência poderá ser persistida por TypeScript ou JavaScript, respeitando privacidade e política de armazenamento do projeto. Na ausência de preferência salva, o padrão será **escuro**, salvo regra superior, identidade visual ou configuração específica em contrário.

A falha da persistência não deverá impedir a renderização da página nem expor estado ilegível.

---

### 1.13 Menus e conteúdo colapsável

A implementação de menus deverá priorizar HTML semântico, CSS/Sass, seletores estruturais e estados nativos.

JavaScript ou TypeScript poderá ser utilizado como aprimoramento para:

- montagem dinâmica;
- posicionamento;
- sincronização de estado;
- fechamento por interação externa;
- acessibilidade adicional;
- compatibilidade entre navegadores.

Não deverá ser o único mecanismo para abrir, fechar, expandir ou recolher quando houver alternativa nativa adequada.

Conteúdo colapsável somente deverá ser criado quando houver ganho real de navegação. Se o conteúdo puder ser exibido integralmente sem prejuízo, não deverá ser escondido atrás de menu desnecessário.

Quando aplicável, o menu deverá:

- manter no máximo um painel principal aberto por contexto;
- utilizar camada externa que cubra a viewport;
- ofuscar visualmente o conteúdo abaixo, preferencialmente com `backdrop-filter` e fallback seguro;
- manter o próprio menu sem obstrução;
- permitir fechamento pelo controle explícito;
- permitir fechamento pela camada externa quando tecnicamente viável;
- fechar após seleção de item quando o fluxo assim exigir;
- preservar navegação por teclado e foco;
- impedir aprisionamento ou perda de foco.

Itens deverão suportar a composição conceitual:

```text
[ícone | rótulo]
```

O alinhamento deverá permanecer uniforme mesmo quando o ícone estiver ausente.

---

### 1.14 Retorno ao topo

Quando a extensão da página justificar, deverá ser implementado controle de retorno ao topo.

O controle deverá:

- permanecer no canto inferior direito ou em posição equivalente definida pelo layout;
- ser exibido somente após rolagem significativa;
- permanecer oculto no topo;
- não obstruir conteúdo, navegação ou controles do navegador;
- funcionar em desktop e mobile;
- possuir tamanho adequado para toque e clique;
- oferecer rótulo acessível;
- respeitar preferências de redução de movimento.

O aspecto visual deverá ser implementado prioritariamente em CSS/Sass. Quando CSS não for suficiente para observar a rolagem e sincronizar o estado, deverá ser utilizado TypeScript leve.

O retorno deverá ser suave quando permitido pela preferência do usuário e imediato quando `prefers-reduced-motion` assim recomendar.

---

### 1.15 Carregamento global

Quando houver componente global de carregamento — por exemplo, `carregandoPagina` — ele deverá conter:

- animação central ou indicador equivalente;
- barra de progresso fixa no topo;
- largura correspondente à viewport;
- altura padrão de `0.5rem`, salvo regra visual específica;
- visual coerente com o tema;
- exibição e ocultação sincronizadas com o estado global.

A barra não deverá participar da animação central do loader.

O progresso deverá:

- acompanhar DOM e recursos da página quando tecnicamente viável;
- distinguir progresso real de estimativa quando isso afetar comportamento;
- degradar de forma segura quando um recurso não puder ser rastreado;
- funcionar em conexões lentas e dispositivos limitados;
- respeitar a baseline de navegadores do projeto, adotando como mínimo navegadores de 2018 ou posteriores quando nenhuma baseline mais recente estiver definida;
- permanecer leve;
- evitar dependência externa quando solução local for suficiente.

O loader não deverá:

- ocultar indefinidamente a página;
- bloquear fallback `noscript`;
- impedir acesso em caso de erro parcial;
- depender de recurso externo indispensável.

Páginas de erro deverão possuir fallback local mínimo equivalente e não deverão importar biblioteca apenas para reproduzir o loader.

---

### 1.16 Fallback sem JavaScript

Quando o projeto fornecer fallback `noscript`, ele deverá abranger todas as páginas relevantes, inclusive páginas de erro.

O fallback deverá:

- usar somente HTML e CSS;
- preservar cabeçalho, conteúdo institucional e rodapé vigentes quando eles forem estaticamente representáveis;
- preservar logotipo, textos, links, ordem estrutural e classes visuais relevantes;
- manter geometria, espaçamento, cores e tipografia compatíveis com o tema;
- permitir rolagem vertical nativa até o rodapé;
- evitar overflow horizontal;
- herdar fundo e tokens do tema padrão;
- permanecer legível, responsivo e acessível;
- não ser ocultado ou bloqueado pelo loader de JavaScript.

Divergências serão permitidas quando o elemento depender tecnicamente de JavaScript, cookies, armazenamento local ou serviço indisponível sem script.

Controles de tema, busca, consentimento e menus exclusivamente dinâmicos não deverão ser exibidos no fallback, salvo quando houver implementação funcional sem JavaScript ou exigência específica de RCF.

Mídia destacada, masthead e demais elementos visuais deverão seguir os tokens e proporções definidos pelo projeto, sem codificar valores locais como regra universal.

A validação visual deverá comparar as páginas principais e de erro com JavaScript desativado.

---

### 1.17 Página 404

Uma página 404 personalizada deverá ser implementada apenas quando suportada e aplicável ao projeto ou à plataforma.

Quando existir, deverá:

- ser editável por fonte claramente identificada;
- reutilizar o CSS principal do tema;
- evitar duplicação de estilos globais;
- limitar CSS e JavaScript locais ao conteúdo específico, ao fallback mínimo e a interações indispensáveis;
- manter cabeçalho, fallback sem JavaScript e rodapé coerentes com a origem vigente do tema;
- preservar conteúdo, links, logotipo, ordem estrutural e classes relevantes dos fragmentos compartilhados;
- sincronizar automaticamente fragmentos gerados quando o pipeline permitir;
- sanitizar conteúdo importado, removendo recursos pesados, inseguros ou indevidos;
- evitar dependência de cookies ou armazenamento local;
- não carregar gerenciador de consentimento, analytics ou recurso equivalente sem necessidade explícita;
- não expor seletor visual de tema por padrão; qualquer exceção deverá ser exigida por RCF específico e manter a mesma política de acessibilidade, persistência e privacidade do restante do site;
- permanecer útil mesmo quando recursos auxiliares falharem.

Uma fonte parcial, como `404.main.html` ou nome equivalente, poderá conter apenas a região editável e ser utilizada para gerar o artefato final. Essa estrutura é opcional e não deverá ser criada quando a plataforma não utilizar página 404 personalizada.

Um terminal ou apresentação visual especial somente deverá ser adotado quando previsto pela identidade do projeto ou por RCF específico; sua aparência não constitui requisito universal.

---

### 1.18 Compactação de HTML

Quando houver compactação de HTML, ela deverá ser aplicada somente ao artefato final de produção.

A etapa deverá:

- incluir páginas geradas e arquivos HTML estáticos copiados;
- remover linhas vazias desnecessárias;
- remover espaços e tabulações no início e no fim de linhas comuns;
- preservar integralmente o conteúdo interno de `script`, `style`, `pre`, `textarea` e `template`;
- preservar quebras entre linhas não vazias;
- não transformar todo o documento em uma única linha;
- não minificar JavaScript, CSS ou Base64 como efeito colateral;
- não adicionar dependência externa quando hook local testável cumprir o contrato com menor risco.

Toda alteração do compactador deverá possuir teste de regressão com blocos sensíveis.

---

## 2. Web Page Like com gerador estático ou hospedagem de páginas

### 2.1 Aplicabilidade

Este cenário complementa **§1 Web Page Like** para projetos que utilizem Jekyll ou gerador equivalente, temas baseados em templates e hospedagem como GitHub Pages.

Suas regras somente deverão ser aplicadas quando compatíveis com a plataforma adotada. Elas não poderão contrariar as diretrizes gerais, o cenário Web Page Like nem restrições da hospedagem.

---

### 2.2 Toolchain e compatibilidade

Antes de introduzir ou alterar bundler, framework de cliente ou runtime de componentes, deverão ser validados:

- compatibilidade com o gerador;
- compatibilidade com a hospedagem;
- compatibilidade com o tema vigente;
- custo operacional;
- impacto no build remoto;
- impacto em links, base paths e assets;
- necessidade de configuração adicional para ambientes de projeto e usuário.

Em projetos predominantemente estáticos, a solução padrão deverá permanecer simples:

- templates no mecanismo nativo do gerador;
- estilos em CSS ou Sass;
- TypeScript compilado para JavaScript estático quando necessário;
- ausência de bundler quando ele não agregar benefício proporcional.

Vite ou equivalente poderá ser padronizado quando a validação demonstrar vantagem arquitetural, compatibilidade integral e redução de complexidade total. A decisão deverá ser registrada e revista quando a arquitetura mudar.

---

### 2.3 Dependências do gerador

Dependências deverão ser mantidas nos manifestos correspondentes, como `package.json`, arquivos de lock e `Gemfile`.

O ambiente local e o ambiente de CI/CD deverão utilizar versões compatíveis. O build destinado à hospedagem deverá respeitar plugins, versões e limitações efetivamente suportados pela plataforma.

Não se deverá introduzir plugin incompatível com o modo de publicação sem fornecer pipeline alternativo controlado.

---

### 2.4 Página 404 em hospedagem estática

Quando a plataforma exigir arquivo 404 na raiz, o artefato final deverá ocupar a localização esperada, normalmente `404.html`.

Quando aplicável ao gerador e à hospedagem, a página deverá:

- ser entregue sem front matter quando precisar permanecer arquivo estático puro;
- herdar o CSS principal compilado do tema, com caminho resolvido pela configuração do projeto;
- evitar cópia integral do CSS;
- utilizar recursos locais mínimos;
- permanecer editável por arquivo-fonte parcial quando essa composição reduzir risco;
- refletir os fragmentos vigentes de cabeçalho e rodapé;
- não depender de recursos que a própria rota de erro possa não conseguir carregar.

Em blogs, a página poderá carregar assincronamente publicações recentes a partir de JSON ou feed interno, mas somente após o conteúdo principal e o loader terem sido liberados.

As publicações recentes:

- não deverão ser compiladas diretamente no HTML-fonte da 404 quando o requisito for atualização dinâmica;
- não poderão bloquear ou invalidar o restante da página;
- deverão utilizar criação segura de DOM e `textContent` para dados textuais;
- deverão falhar de forma silenciosa ou controlada.

---

### 2.5 Sincronização de fallback sem JavaScript

Quando o gerador utilizar fragmento compartilhado para conteúdo `noscript`, sua fonte deverá estar em include, partial ou componente claramente definido pelo projeto.

O artefato 404 compilado deverá receber automaticamente, quando possível, os mesmos fragmentos de conteúdo e estilo renderizados na página principal.

A sincronização não deverá depender de cópia manual recorrente.

---

## 3. Sites e blogs com conteúdo editorial

### 3.1 Aplicabilidade

Este cenário complementa os anteriores para projetos que publiquem artigos, posts, sermões, ensaios, notícias ou conteúdo editorial equivalente.

Suas regras não deverão ser aplicadas a páginas sem conteúdo editorial quando não houver relação funcional.

---

### 3.2 Conteúdo agendado

O projeto poderá manter área separada para conteúdo concluído que aguarda publicação futura, convencionalmente denominada `_scheduled` ou equivalente.

Deverá existir distinção inequívoca entre:

- rascunho em desenvolvimento;
- conteúdo aprovado e agendado;
- conteúdo publicado.

Conteúdo agendado:

- não deverá aparecer no build público padrão;
- não deverá ser acessível por URL direta antes da data;
- deverá resultar em 404 ou indisponibilidade equivalente;
- deverá permanecer isolado até a publicação efetiva;
- deverá possuir data futura em metadado ou convenção de nome verificável.

A data determinará elegibilidade e momento de migração para conteúdo público.

---

### 3.3 Workflow de publicação agendada

Quando houver conteúdo agendado, deverá existir workflow específico para verificar sua elegibilidade.

A execução deverá ocorrer ao menos diariamente, em horário definido pela zona de publicação do projeto. Quando adotado o padrão `00:01`, a conversão para a zona utilizada pelo executor deverá ser explícita.

O workflow deverá:

1. verificar a área de agendados;
2. identificar itens cuja data seja igual ou anterior à data de publicação e ainda não tenham sido publicados;
3. preparar o conteúdo;
4. compilar o artefato necessário;
5. atualizar a saída pública;
6. publicar;
7. validar disponibilidade;
8. registrar o estado final.

Nenhum conteúdo poderá ser exposto antes da data configurada.

Em projetos hospedados no GitHub, o fluxo poderá ser executado por GitHub Actions, respeitando permissões mínimas e proteção de ambiente.

---

### 3.4 Workflow de publicação e distribuição

Toda publicação efetiva que exija distribuição externa deverá acionar o fluxo correspondente, tanto para publicação imediata quanto para conteúdo proveniente da área de agendados.

A distribuição externa somente poderá iniciar após:

- compilação concluída;
- publicação concluída;
- validação de disponibilidade do conteúdo.

Falha em etapa anterior deverá impedir a distribuição, sem produzir estado parcial silencioso.

Workflows dependentes somente deverão executar quando a etapa anterior tiver:

- encerrado;
- produzido estado final conhecido;
- disponibilizado os dados necessários.

---

### 3.5 Distribuição em redes sociais

Quando o projeto adotar distribuição social automática, ela deverá ser executada apenas quando houver nova publicação elegível.

No perfil que exigir Facebook, Instagram e X, cada plataforma deverá possuir tratamento próprio. O conjunto poderá ser alterado por regra específica do projeto sem afetar os princípios desta seção.

Antes de criar integração própria, deverão ser pesquisadas e avaliadas soluções open source, ferramentas de automação e métodos oficiais.

A prioridade será:

1. solução open source madura, mantida e compatível;
2. método oficial da plataforma;
3. alternativa previamente configurada;
4. fallback controlado.

Cada integração deverá publicar, conforme disponibilidade e regras da plataforma:

- título;
- resumo curto;
- imagem destacada;
- hashtags;
- link canônico.

Cada workflow deverá possuir:

- configuração própria;
- segredos isolados;
- tratamento de erro específico;
- persistência de estado ou idempotência;
- múltiplas tentativas com limite;
- recuperação controlada;
- fallback quando aplicável;
- registro do resultado final.

Não será permitido:

- travamento indefinido;
- repetição ilimitada;
- encerramento abrupto sem registro;
- duplicação de publicação por ausência de idempotência;
- wrapper desnecessário sobre integração já adequada.

A execução deverá terminar por sucesso ou por esgotamento controlado das alternativas previstas.

---

### 3.6 Listagens de posts

Grades, colunas e cards deverão respeitar integralmente a largura disponível.

Títulos, excertos e metadados:

- não deverão impor largura mínima indevida;
- não deverão provocar overflow horizontal;
- deverão ser validados, no mínimo, em viewport de `320px` quando essa largura fizer parte da baseline do projeto.

Na home, o perfil editorial padrão deverá exibir no máximo seis cards por página, salvo regra específica.

Artigos relacionados deverão:

- aparecer sob o título `Relacionados` ou equivalente definido pelo idioma do projeto;
- compilar no máximo seis itens;
- não repetir o artigo atual.

Artigos recentes deverão:

- aparecer sob o título `Recentes` ou equivalente;
- carregar, por padrão, os seis itens mais recentes a partir de JSON ou feed interno configurado;
- iniciar somente após o carregamento essencial e a liberação do loader;
- manter no HTML compilado apenas o título e o contêiner vazio quando a atualização precisar ser dinâmica;
- reutilizar estrutura e estilo dos cards de arquivo;
- utilizar APIs de DOM e `textContent` para dados textuais;
- não depender de cookies ou `localStorage`;
- falhar sem interferir na leitura do artigo ou nos relacionados.

---

### 3.7 Autores de artigo

Posts poderão declarar lista ordenada de autores por metadado equivalente a `article_authors`.

Cada entrada deverá possuir:

- `name`;
- `bio`.

Poderá possuir:

- `url`;
- `avatar`.

Entradas sem nome ou biografia não deverão ser renderizadas. O bloco inteiro não deverá existir quando não houver autor válido.

Na ausência de avatar, deverá ser utilizada ilustração local padrão.

A apresentação deverá:

- destacar o primeiro autor;
- exibir autores adicionais de forma compacta e responsiva;
- utilizar composição mais densa quando houver três ou mais autores;
- incluir semântica `Person` compatível com dados estruturados;
- não exigir alteração de posts existentes apenas para forçar exibição do componente.

---

### 3.8 Formatação de artigos

As regras desta subseção aplicam-se exclusivamente ao conteúdo textual do artigo, não à navegação, cabeçalho, rodapé, metadados, embeds ou componentes externos.

Quando o perfil editorial adotar indentação de primeira linha:

- cada parágrafo comum deverá iniciar com indentação visual;
- o valor padrão será `4em`, salvo token editorial específico;
- a aplicação deverá ocorrer por CSS/Sass no conteúdo renderizado;
- espaços manuais não deverão ser inseridos no Markdown;
- títulos, listas, tabelas, imagens, legendas, notas de rodapé, blockquotes e painéis de citação não deverão receber essa indentação.

Em blockquotes e painéis de citação:

- o texto principal não deverá ser itálico por padrão;
- subcitação entre aspas poderá ser itálica;
- não se deverá aplicar itálico automático ao bloco inteiro;
- referência distinta deverá ocupar linha própria;
- a referência deverá iniciar por `—`, e não por hífen simples;
- a referência deverá possuir tamanho inferior ao texto principal;
- autor identificável poderá receber contexto ultrassintético sobre sua posição à época da citação, desde que haja base segura.

No texto comum:

- não deverá haver itálico por padrão;
- citação inline entre aspas poderá ser itálica;
- itálico semântico ou autoral existente deverá ser preservado quando não houver conflito normativo.

Marcadores de notas de rodapé deverão permanecer compactos, proporcionais e sem espaço horizontal excessivo.

---

### 3.9 Preservação autoral

Quando houver revisão, reorganização, melhoria textual, ajuste semântico ou reescrita, deverão ser preservados:

- estilo do autor;
- vocabulário;
- ritmo;
- forma de argumentação;
- estrutura de raciocínio;
- pontuação;
- pausas intencionais;
- características literárias;
- recursos retóricos.

É proibido:

- padronizar artificialmente a voz;
- transformar textos distintos em um único padrão de IA;
- substituir a identidade autoral por formulação genérica;
- corrigir peculiaridade intencional como se fosse erro.

Antes da alteração, deverão ser considerados o parágrafo, a seção, o artigo completo e o contexto editorial disponível.

A prioridade será:

1. preservar identidade autoral;
2. preservar intenção;
3. corrigir problemas reais;
4. melhorar clareza;
5. melhorar organização sem descaracterização.

---

### 3.10 Rastreabilidade de processamento por IA

Conforme `AGENTS.md` §2.3, todo trecho editorial ou de FT `Negócio` modificado semanticamente por IA deverá receber marcação persistente, impedindo que conteúdo assistido seja confundido com amostra primária do estilo original do autor.

A marcação deverá:

- permanecer no arquivo-fonte;
- sobreviver a rebuilds;
- não ser exibida ao leitor;
- não alterar o conteúdo renderizado;
- ser legível por automação;
- permitir identificação futura da região processada.

A marcação será obrigatória para:

- reescrita;
- reorganização textual;
- expansão;
- resumo;
- simplificação;
- ajuste semântico;
- adaptação de estilo;
- geração parcial;
- geração integral.

Não será obrigatória para correções exclusivamente:

- ortográficas;
- gramaticais;
- tipográficas;
- de links;
- de metadados.

Quando apenas parte do texto for alterada, deverá ser marcada a menor região possível.

O formato preferencial será comentário invisível estável, simples e pesquisável, compatível com Markdown e o gerador, por exemplo:

```html
<!-- AI-PROCESSED:START -->
...
<!-- AI-PROCESSED:END -->
```

O projeto poderá definir formato equivalente, desde que ele não dependa de serviço externo, não altere a renderização e seja detectável por ferramentas.

---

### 3.11 Referência de estilo

Ao utilizar textos do repositório como amostra de estilo linguístico ou editorial, trechos marcados como processados por IA não deverão ser considerados fonte primária.

A prioridade será:

1. conteúdo original sem marcação de IA;
2. rascunhos originais sem marcação;
3. artigos publicados sem marcação;
4. conteúdo revisado apenas ortográfica ou gramaticalmente;
5. conteúdo processado por IA.

A análise deverá observar:

- vocabulário recorrente;
- estrutura argumentativa;
- estilo literário;
- estilo técnico;
- pontuação;
- transições;
- ritmo;
- padrões de ênfase.

Conteúdo assistido por IA poderá ser utilizado apenas como contexto complementar.

---

### 3.12 Rigor acadêmico e verificabilidade

Exceto quando explicitamente classificado como reflexão pessoal, testemunho, opinião, narrativa literária ou poesia, todo artigo deverá buscar rigor documental e verificabilidade.

Afirmações relevantes deverão ser associadas, quando houver fonte disponível, a referências:

- válidas;
- verificáveis;
- confiáveis;
- rastreáveis;
- proporcionais à natureza da afirmação.

Sempre que possível, deverão receber fonte:

- afirmações factuais;
- dados históricos;
- estatísticas;
- estudos;
- argumentos técnicos;
- citações;
- traduções não triviais;
- afirmações controversas.

A presença de referência não substitui avaliação crítica da fonte.

---

### 3.13 Citações e referências imediatas

Artigos técnicos e artigos em formato de sermão deverão seguir, quando aplicável, o princípio:

```text
Afirmação → referência imediata
```

A referência deverá ser inserida junto à ocorrência que sustenta, preferencialmente por mecanismo compatível com Markdown, o gerador e notas de rodapé.

Deverá ser evitado:

- concentrar todas as fontes apenas ao final;
- deixar afirmação relevante sem referência quando houver fonte verificável;
- usar uma única referência distante para sustentar sequência heterogênea de alegações;
- citar fonte que não sustente efetivamente a afirmação.

O comportamento visual deverá, quando suportado, aproximar-se de sistemas de referência como o da Wikipédia, sem copiar dependências desnecessárias.

---

### 3.14 Notas de rodapé

O projeto deverá oferecer suporte a notas de rodapé por mecanismo nativo ou amplamente adotado e compatível com o gerador e a hospedagem.

Deverão ser evitados:

- implementação manual repetitiva;
- soluções incompatíveis com o pipeline;
- identificadores instáveis;
- navegação sem retorno à ocorrência.

Os marcadores deverão ser discretos e de baixa interferência visual.

Cada ocorrência deverá:

- apontar para sua nota correspondente;
- permitir retorno ao ponto exato da chamada;
- permanecer acessível por teclado;
- possuir comportamento previsível em dispositivos móveis.

Quando a tecnologia suportar, o cursor ou foco poderá exibir resumo curto da referência.

---

### 3.15 Bibliografia e referências

Artigos com fontes deverão possuir suporte a seções de **Referências** e, quando aplicável, **Bibliografia**.

Sempre que viável, essas seções deverão ser geradas a partir das notas de rodapé e metadados já utilizados, reduzindo duplicação e divergência.

A bibliografia deverá seguir ABNT quando esse for o padrão editorial do projeto ou quando não houver outro padrão normativo definido.

As referências deverão apontar para seus itens bibliográficos correspondentes quando a arquitetura de citação adotar essa separação.

Bibliotecas, plugins ou ferramentas deverão ser preferencialmente:

- compatíveis com o gerador, a hospedagem e o CI/CD;
- consolidados;
- amplamente utilizados;
- ativamente mantidos;
- acessíveis;
- capazes de degradar sem invalidar o conteúdo.

---

### 3.16 Privacidade e armazenamento no conteúdo editorial

Componentes editoriais, páginas 404, listagens recentes e fallbacks não deverão depender de cookies ou `localStorage` para disponibilizar conteúdo essencial.

Gerenciadores de consentimento, analytics e integrações equivalentes somente deverão ser carregados quando exigidos pelo projeto e compatíveis com sua política de privacidade.

Na página 404 e no fallback sem JavaScript, recursos dependentes de consentimento ou armazenamento deverão ser omitidos, desativados ou silenciados de forma explícita.

---

### 3.17 Critérios de conclusão

Uma alteração abrangida por este cenário somente deverá ser considerada concluída quando, conforme aplicável:

- o conteúdo estiver publicado ou compilado corretamente;
- links e referências estiverem válidos;
- listagens não causarem overflow;
- fallback sem JavaScript estiver legível;
- página 404 não bloquear em caso de falha auxiliar;
- workflows produzirem estado final conhecido;
- marcações de IA tiverem sido inseridas nas regiões semanticamente processadas;
- correções textuais tiverem sido relatadas;
- conformidade com regras superiores e específicas tiver sido verificada.
