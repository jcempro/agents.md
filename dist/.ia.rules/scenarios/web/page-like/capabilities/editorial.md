# Capacidade WEB-EDITORIAL

Predicado: RCF classifica artefato publicável como artigo, post, sermão, ensaio, notícia ou editorial equivalente. Depende de `WEB-BROWSER` e de `WEB-STATIC` somente quando o predicado estático for verdadeiro.

## 1. Agenda e distribuição

`_scheduled`/equivalente DEVE separar rascunho, aprovado/agendado e publicado; agendado NÃO DEVE integrar build, URL ou listagem pública antes da data verificável. Workflow DEVE declarar cadência e zona editorial; corte temporal adotado converte fuso explicitamente e executa verificar → selecionar elegível → preparar → compilar → atualizar → publicar → validar → registrar. Distribuição externa começa somente após compilação, publicação e disponibilidade; falha anterior bloqueia.

Integração social declarada DEVE tratar plataforma/perfil individualmente, escolher open source mantida → oficial → configurada → fallback, mapear título/resumo/imagem/hashtag/link disponíveis, isolar segredo, ser idempotente, limitar tentativas, recuperar e registrar. NÃO DEVE travar, repetir sem limite, terminar sem registro, duplicar publicação ou ser adicionada sem destino, responsável e campos mapeáveis declarados.

## 2. Listagem, autor e formato

Grade/card NÃO DEVE causar overflow; validar menor viewport e breakpoints da baseline. Sem baseline, RCF DEVE declarar superfícies e critério responsivo antes da implementação. Home, relacionados e recentes DEVEM ter limite, paginação ou carregamento progressivo do template/RCF, compatíveis com leitura/desempenho/navegação; relacionado não repete atual. Recente por JSON/feed inicia após carga essencial, usa contêiner vazio se dinâmico, card comum, DOM seguro/`textContent`, zero cookie/localStorage e falha não bloqueante. Rótulo é semântico/localizado e pertence ao projeto.

Modelo de autor DEVE declarar identidade/resumo obrigatórios, campos opcionais, invalidez, fallback visual, destaque e compactação; nomes de campo e limiar visual pertencem ao adaptador/template. Conteúdo que credite pessoa/organização DEVE usar semântica de autoria; legado NÃO DEVE exigir migração.

Indentação editorial adotada usa CSS/Sass e token do projeto, excluindo título, lista, tabela, imagem, legenda, nota, blockquote e painel. Blockquote NÃO DEVE italicizar corpo automaticamente; subcitação PODE. Referência ocupa linha própria com `—` e estilo menor; contexto autoral exige fonte segura. Texto comum não recebe itálico padrão; itálico semântico/autoral sobrevive; nota é compacta. Número, rótulo, dimensão ou limiar visual só integra esta capacidade como contrato reutilizável verificável; escolha de template fica no RCF/token/configuração.

## 3. Autoria, IA e rigor

Revisão DEVE preservar estilo, vocabulário, ritmo, argumento, estrutura, pontuação, pausa, literatura e retórica; NÃO DEVE padronizar voz, substituir identidade ou corrigir peculiaridade intencional. Prioridade: identidade → intenção → problema real → clareza → organização. Alteração semântica por IA marca a menor região no fonte com comentário invisível, persistente, pesquisável e neutro, como `AI-PROCESSED:START/END`; reescrita, reorganização, expansão, resumo, simplificação, adaptação ou geração exige marcação; ortografia, gramática, tipografia, link e metadado não. Amostra de estilo segue original não marcado → rascunho original → publicado não marcado → correção mecânica → IA; assistido apenas complementa.

Exceto reflexão, testemunho, opinião, literatura ou poesia identificados, artigo DEVE buscar verificabilidade; fato, história, estatística, estudo, técnica, citação, tradução e controvérsia DEVERIAM ter fonte válida, rastreável e que sustente diretamente a alegação; fonte primária prevalece quando existir. Artigo técnico/sermão sujeito a fonte DEVE usar `Afirmação → referência imediata`, sem fonte distante ou incapaz de sustentar a frase. Nota DEVE ter mecanismo compatível, id estável, ida/retorno, teclado/mobile e baixa interferência. Referência/Bibliografia DEVERIA derivar de nota/metadado; padrão decorre da política/jurisdição/RCF; biblioteca exige compatibilidade, manutenção, acessibilidade e degradação que preserve conteúdo.

## 4. Privacidade e conclusão

Conteúdo essencial, 404, recente e fallback NÃO DEVEM depender de cookie/localStorage. Consentimento, analytics e equivalente só PODEM carregar por exigência e política compatível; 404/fallback DEVEM omitir, desativar ou silenciar. Conclusão exige conteúdo compilado/publicado, link/referência válida, ausência de overflow, fallback legível, 404 resiliente, workflow final conhecido, marcação de IA aplicável, correção relatada e validação superior.
