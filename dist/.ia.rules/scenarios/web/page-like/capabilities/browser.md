# Capacidade WEB-BROWSER

Predicado: entrega executada ou consumida por navegador/engine web. Depende do roteador `../scenario.md`; aplicar `W-MTX-42`, `MN-API`, `MN-DEF`, `MN-OUT`, `MN-CMD` e `./.ia.rules/core/contracts.md`. Regra condicional deste módulo só se ativa quando RCF/configuração a declarar ou a interface existente já implementar o recurso; ausência de ambas NÃO autoriza introduzi-lo.

## 1. Produto, evolução e matriz

Abrange página estática, app cliente/SPA, widget, componente, biblioteca frontend, WASM, gerado, híbrido ou template. DEVE padronizar arquitetura, interface, stack, build, distribuição, publicação e UI sem fixar mecanismo interno. Stack PODE evoluir preservando interface pública; combinação, capacidade ou comportamento aplicável NÃO DEVE ser removido por equivalência abstrata.

É capacidade composta de borda, não classe-base: navegador, saída estática, hospedagem, editorial e demais capacidades DEVEM ser ordenadas conforme `./.ia.rules/core/contracts.md`. Jekyll, GitHub Pages, Git, gerador e hospedagem são independentes; coincidência de ferramenta NÃO prova dependência. `W-MTX-42` expande exatamente 42 combinações e os contratos `Dev,Prod,Lib,Bundle,Offline`.

## 2. Interface, Git, configuração e roots

`package.json` é API pública. Hierarquia: universal → grupo → especializado → implementação; comando novo DEVE reutilizar camada anterior e ocultar tecnologia interna. Universais condicionados à capacidade correspondente: `dev`, `live`, `build`, `clean`, `lint`, `format`, `test`, `check`, `publish`, `release`, `prepare`; grupos: `build:dev|prod|dist|bundle|offline|lib|types|docs`, `dev:watch|live|debug|profile`, `publish:test|beta|live|github|pages`. `publish` pertence somente à Publicação de Conteúdo; `release`, somente a Release; nenhum compõe, aciona ou especializa o outro. Git recorrente DEVERIA expor `commit|push|pull|sync|status|fetch|rebase|branch`; `commit` NÃO DEVE ocultar falha, descartar mudança, forçar publicação ou destruir sem autoridade.

Porta, parâmetro, variável, target, artefato, diretório e modo DEVEM ser estáveis/transparentes e PODEM ser especializados pelo RCF. Manifesto, lock, compilador, gerador, bundler e CI/CD DEVEM compatibilizar hospedagem. Ignorado NÃO DEVE ser fonte normativa sem autoridade. Roots obedecem `./AGENTS.md` §0.13: aplicação e artefato publicado correspondem ao `/` público; estrutura-fonte permanece interna. Build NÃO DEVE expor prefixo, path, comentário ou recurso interno. Estrutura imposta por framework/hospedagem exige exceção declarada e validação do artefato real.

## 3. Estrutura, interação e dependência

Conteúdo/navegação essencial NÃO DEVE depender só de JS: HTML estrutura; CSS/Sass apresenta/representa estado; nativo fornece interação básica; JS/TS aprimora/faz fallback. Código cliente novo DEVERIA usar TS compatível. Validar estado, tema, desktop/mobile, teclado, foco, contraste, toque e overflow; alvo interativo suporta clique/toque. Adotar componente somente se reduzir duplicação, acoplamento ou superfície de teste medidos no diff; em cliente, preferir TSX com contrato explícito, e em template, include/partial. Runtime extra é vedado sem requisito. Bundler só PODE entrar se compatibilidade, custo, build e depuração forem validados e o diff demonstrar redução de complexidade ou recurso impossível na alternativa simples.

## 4. Tema, menu e retorno

Tema DEVE usar CSS/Sass Custom Properties. Seletor declarado DEVE ser discreto, responsivo, compreensível, contrastado e focável; sol/lua PODE ser usado. Reutilizar biblioteca de ícone existente; Font Awesome só PODE ser padrão se já integrado. Ambos os modos DEVEM ser legíveis. Persistência exige política de privacidade; sem preferência, usar escuro salvo norma superior; falha de persistência NÃO DEVE bloquear renderização.

Menu DEVE priorizar HTML/CSS/nativo; JS/TS só aprimora montagem, estado, posição, fechamento ou acessibilidade. Colapso exige ganho documentado de espaço/navegação. Painel adotado DEVE ter camada de viewport com fallback, fechamento explícito/externo/por seleção quando o fluxo exigir, teclado/foco preservados e `[ícone | rótulo]` alinhado. Retorno ao topo só se ativa quando RCF/interface o declarar; DEVE surgir após rolagem configurada, ser não obstrutivo, acessível, responsivo e respeitar redução de movimento. CSS/Sass é padrão; TS leve exige estado não expressável por CSS/nativo.

## 5. Carregamento, fallback, 404 e compactação

Loader global declarado DEVE distinguir indicador central de barra superior, sincronizar estado/tema/ocultação e obter dimensão/identidade de token ou RCF. Progresso usa evento real de DOM/recurso; se usar tempo/contagem não correlacionada, DEVE rotular-se estimativa. Baseline de navegador e comportamento para conexão/dispositivo limitado DEVEM ser declarados antes da implementação. Loader NÃO DEVE ocultar indefinidamente, bloquear `noscript`, impedir acesso após erro parcial ou depender de externo indispensável; erro usa fallback local mínimo.

`noscript` declarado DEVE cobrir páginas/erros enumerados com HTML/CSS, preservar fragmentos estáticos de cabeçalho, conteúdo, rodapé, logo, link, ordem, classe e tema, permitir rolagem e impedir overflow; loader não o bloqueia. Controle só dinâmico exige equivalente funcional ou omissão. 404 declarada DEVE ter fonte identificável, CSS reutilizado, importação sanitizada, fragmentos compartilhados, utilidade sob falha e zero cookie/localStorage/consentimento/analytics; versão parcial só PODE omitir fragmento cuja dependência falhou, mantendo navegação mínima. Compactação atua somente em produção, inclui gerado/copiado, preserva `script|style|pre|textarea|template`, quebras não vazias e conteúdo interno, NÃO DEVE single-line/minificar JS, CSS ou Base64 incidentalmente e exige teste sensível.
