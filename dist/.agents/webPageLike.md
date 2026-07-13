# webPageLike.md — Cenário Web Page Like

Extensão de `AGENTS.md` §17; aplicar `MN-2119`, `MN-DENS`, `MN-PRES`, `MN-IA-OPT`, `MN-VAL`, `MN-REF` e, para interface, `MN-API`, `MN-DEF`, `MN-OUT`, `MN-CMD`. RCF específico prevalece na matéria do projeto. Valores e stacks abaixo são padrões oficiais somente quando a condição existir.

## 1. Web Page Like

### 1.1–1.3 Definição e evolução

Abrange entrega consumida por navegador/engine: página estática, app cliente/SPA, widget, componente, biblioteca frontend, WASM, gerado, híbrido ou template. Este cenário DEVE padronizar arquitetura, interface, stack, build, distribuição, publicação e UI sem imobilizar mecanismo interno. Stack PODE evoluir se a interface pública permanecer; combinação, capacidade ou comportamento aplicável NÃO DEVE ser removido por equivalência abstrata.

### 1.4 Matriz tecnológica

Aplicar `W-MTX-42`; ele expande exatamente 42 combinações, capacidades e incorporação offline. `Dev`, `Prod`, `Lib`, `Bundle` e `Offline` são contratos, não sugestões.

### 1.5–1.8 Interface, Git e configuração

`package.json` é API pública. Hierarquia: universal → grupo → especializado → implementação; comando novo DEVE reutilizar a camada anterior e NÃO DEVE revelar tecnologia interna. Universais aplicáveis: `dev`, `live`, `build`, `clean`, `lint`, `format`, `test`, `check`, `publish`, `release`, `prepare`; grupos: `build:dev|prod|dist|bundle|offline|lib|types|docs`, `dev:watch|live|debug|profile`, `publish:test|beta|live|github|pages`. `publish` pertence exclusivamente ao cenário Publicação de Conteúdo; `release` pertence exclusivamente ao cenário Release; um NÃO DEVE compor, acionar ou especializar o outro. Git recorrente DEVERIA expor `commit`, `push`, `pull`, `sync`, `status`, `fetch`, `rebase`, `branch`; `commit` NÃO DEVE ocultar falha, descartar mudança, forçar publicação ou executar destruição sem autoridade.

Porta, parâmetro, variável, target, artefato, diretório e modos DEVEM ser estáveis e transparentes; RCF PODE especializá-los. Manifesto, lock, compilador, gerador, bundler e CI/CD DEVEM permanecer compatíveis com hospedagem. Ignorado NÃO DEVE ser fonte normativa sem autoridade explícita.

Raiz do repositório, raiz da aplicação e raiz publicada DEVEM obedecer `AGENTS.md` §0.13. Em Web Page Like, raiz da aplicação e raiz publicada são o `/` público; estrutura-fonte `src`/equivalente permanece interna. Build DEVE projetar a fonte para essa raiz sem expor prefixo, caminho, comentário ou recurso interno. Framework ou hospedagem que imponha estrutura diversa DEVE declarar a exceção, preservar o `/` público e validar o artefato real.

### 1.9–1.11 Estrutura e interface

Conteúdo/navegação essencial NÃO DEVE depender apenas de JS: HTML estrutura, CSS/Sass apresentação/estado, nativo interação básica, JS/TS aprimoramento/fallback. Código cliente novo DEVERIA usar TS compatível. Validação DEVE cobrir estado, tema, desktop/mobile, teclado, foco, contraste, toque e overflow; alvo interativo DEVE suportar clique/toque. Componente DEVE ser adotado se reduzir duplicação/isolamento/teste/manutenção; em cliente, preferir TSX, contrato explícito e escopo proporcional; em template, include/partial é suficiente e runtime extra NÃO DEVE ser introduzido. Bundler só PODE entrar após compatibilidade, custo, build, depuração e vantagem comprovada; alternativa simples DEVE permanecer quando proporcional.

### 1.12 Tema

Tema DEVE usar CSS/Sass Custom Properties. Seletor DEVE ser discreto, responsivo, compreensível, contrastado e focável; sol/lua PODE ser usado quando adotado. Biblioteca de ícone existente DEVE ser reutilizada; Font Awesome só PODE ser padrão se já usado. Ambos os modos DEVEM permanecer legíveis. Persistência PODE existir conforme privacidade; ausência de preferência DEVE usar escuro, salvo norma superior; falha de persistência NÃO DEVE bloquear renderização.

### 1.13–1.14 Menu e retorno

Menu DEVE priorizar HTML/CSS/nativo; JS/TS só PODE aprimorar montagem, estado, posição, fechamento ou acessibilidade. Colapso só DEVE existir com ganho. Quando aplicável: um painel principal, camada de viewport com fallback, fechamento explícito/externo/por seleção quando necessário, teclado/foco preservados e composição `[ícone | rótulo]` alinhada. Retorno ao topo, quando justificado, DEVE ser discreto, pós-rolagem, não obstrutivo, acessível, responsivo e compatível com redução de movimento; CSS/Sass é preferencial e TS leve é opcional.

### 1.15 Carregamento

Loader global DEVE separar indicador central de barra superior de `0.5rem`/equivalente, sincronizar estado, tema e ocultação. Progresso DEVE refletir DOM/recurso quando viável, distinguir estimativa relevante, degradar com segurança, suportar conexão/dispositivo limitado e baseline 2018 se ausente outra. NÃO DEVE ocultar indefinidamente, bloquear `noscript`, impedir acesso em erro parcial ou depender de externo indispensável. Erro DEVE usar fallback local mínimo.

### 1.16–1.18 Fallback, 404 e HTML

`noscript` aplicável DEVE cobrir páginas relevantes/erro com HTML/CSS, preservar cabeçalho, conteúdo, rodapé, logo, link, ordem, classe e tema quando estáticos, permitir rolagem, evitar overflow e não ser bloqueado por loader. Controle exclusivamente dinâmico NÃO DEVE aparecer sem equivalente funcional. 404, quando suportada, DEVE ter fonte identificável, reutilizar CSS, evitar duplicação, sanitizar importação, preservar fragmentos compartilhados, dispensar cookie/localStorage/consentimento/analytics e continuar útil sob falha; parcial PODE existir se reduzir risco. Compactação DEVE ocorrer só em produção, incluir gerado/copiado, preservar `script/style/pre/textarea/template`, quebras não vazias e conteúdo interno, NÃO DEVE single-line/minificar JS-CSS-Base64 incidentalmente, e DEVE ter teste sensível.

## 2. Gerador estático ou hospedagem

Aplicar §1. Antes de alterar bundler/framework/runtime, DEVE validar gerador, hospedagem, tema, custo, build remoto, link/base path/asset e configuração de ambiente. Estático DEVE preferir template nativo, CSS/Sass, TS estático e ausência de bundler quando suficiente; Vite/equivalente só PODE ser adotado com vantagem integral registrada. Dependência e versão DEVEM compatibilizar local/CI/plataforma; plugin incompatível NÃO DEVE entrar sem pipeline controlado.

404 de hospedagem DEVE ocupar caminho exigido, normalmente raiz, sem front matter se estática, reutilizar CSS resolvido, usar recurso local mínimo, refletir cabeçalho/rodapé e não depender da rota falha. Recente assíncrono PODE carregar após conteúdo/loader por JSON/feed interno, com DOM seguro e `textContent`, sem bloquear página. `noscript` compartilhado DEVE usar include/partial/componente e sincronizar automaticamente com 404 quando possível.

## 3. Sites e blogs editoriais

### 3.1–3.5 Agenda e distribuição

§§1–2 aplicam cumulativamente. `_scheduled`/equivalente DEVE separar rascunho, aprovado/agendado e publicado; agendado NÃO DEVE integrar build, URL pública ou aparecer antes da data verificável. Workflow DEVE executar ao menos diariamente na zona editorial, converter explicitamente `00:01` quando adotado e executar verificar → selecionar elegível → preparar → compilar → atualizar → publicar → validar → registrar. Distribuição externa só PODE iniciar após compilação, publicação e disponibilidade; falha anterior DEVE bloqueá-la.

Integração social adotada DEVE tratar cada plataforma/perfil, priorizar open source madura → oficial → configurada → fallback, publicar título/resumo/imagem/hashtag/link conforme disponível, isolar segredo, ser idempotente, limitar tentativa, recuperar e registrar. NÃO DEVE travar, repetir indefinidamente, terminar sem registro, duplicar publicação ou envolver integração adequada sem ganho.

### 3.6–3.8 Listagem, autor e formato

Grade/card NÃO DEVE causar overflow; conteúdo DEVE validar `320px`/equivalente quando baseline. Home e relacionados DEVEM limitar-se a 6/equivalente; relacionado NÃO DEVE repetir atual. Recentes DEVE usar até 6/equivalente por JSON/feed após carga essencial, contêiner inicial vazio quando dinâmico, card reutilizado, DOM seguro/`textContent`, sem cookie/localStorage e falha não bloqueante. `article_authors` válido exige `name`/`bio`; `url`/`avatar` são opcionais; inválido NÃO renderiza; sem avatar usa ilustração local; primeiro destaca, adicionais compactam, três ou mais densificam, semântica é `Person` e post legado NÃO DEVE exigir migração.

Formato textual exclusivo do artigo: indentação, se adotada, DEVE usar CSS/Sass `4em`/equivalente salvo token e excluir título/lista/tabela/imagem/legenda/nota/blockquote/painel. Blockquote NÃO DEVE italicizar corpo automaticamente; subcitação PODE; referência DEVE ocupar linha própria com `—`, menor; contexto autoral só PODE existir com base segura. Texto comum NÃO DEVE italicizar por padrão; itálico semântico/autoral DEVE sobreviver; nota DEVE ser compacta.

### 3.9–3.15 Autoria, IA e rigor

Revisão DEVE preservar estilo, vocabulário, ritmo, argumentação, estrutura, pontuação, pausa, literatura e retórica; NÃO DEVE padronizar voz, substituir identidade ou corrigir peculiaridade intencional. Prioridade: identidade → intenção → problema real → clareza → organização. Alteração semântica por IA DEVE marcar a menor região no fonte com comentário invisível, persistente, pesquisável e neutro, por exemplo `AI-PROCESSED:START/END`; reescrita, reorganização, expansão, resumo, simplificação, adaptação ou geração exige marcação; correção ortográfica/gramatical/tipográfica/link/metadado não. Amostra de estilo DEVE priorizar original não marcado → rascunho original → publicado não marcado → correção mecânica → IA; assistido só PODE complementar.

Exceto reflexão/testemunho/opinião/literatura/poesia identificada, artigo DEVE buscar verificabilidade; fato, história, estatística, estudo, técnica, citação, tradução e controvérsia DEVERIAM ter fonte válida, confiável, rastreável e proporcional. Artigo técnico/sermão aplicável DEVE seguir `Afirmação → referência imediata`; NÃO DEVE concentrar fonte distante ou citar fonte que não sustente a alegação. Nota DEVE ter mecanismo compatível, id estável, ida/retorno, teclado/mobile e baixa interferência. Referência/Bibliografia DEVERIA derivar de nota/metadado; ABNT DEVE ser padrão se nenhum outro existir; biblioteca DEVE ser compatível, mantida, acessível e degradar sem invalidar conteúdo.

### 3.16–3.17 Privacidade e conclusão

Conteúdo essencial, 404, recente e fallback NÃO DEVEM depender de cookie/localStorage. Consentimento, analytics e equivalente só PODEM carregar por exigência e política compatível; 404/fallback DEVEM omiti-los, desativá-los ou silenciá-los. Conclusão exige conteúdo compilado/publicado, link/referência válida, sem overflow, fallback legível, 404 resiliente, workflow final conhecido, marcação de IA aplicável, correção relatada e validação superior.
