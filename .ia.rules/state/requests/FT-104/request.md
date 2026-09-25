# Solicitação remota preservada — FT-104 e FT-105

Origem: issue `github:jcempro/agents.md#14`, aberta em 2026-09-25T08:19:34Z e atualizada em 2026-09-25T08:27:10Z.
URL: https://github.com/jcempro/agents.md/issues/14
Título: `[AGENTS] Revisão editorial portável para documentos alterados`.
Estado observado: aberta, `agents:highly-recommended`, `agents:approved` e `agents:in-development`.
Correlação remota: `<!-- agents-development:14:FT-104 -->`.
FTs: FT-104 (RCF/Norma) e FT-105 (código/validação funcional).

## Original

Repositórios editoriais precisam revisar somente documentos materialmente alterados, aplicar políticas distintas a texto humano e síntese conversacional e produzir parecer auditável sem conceder escrita automática ao corpus. Falta contrato portável que una seleção mínima por diff, empacotamento determinístico, provedor opcional e achados estruturados sob permissões somente leitura.

A capacidade deve ser opt-in, funcionar no consumidor, limitar roots, quantidade e bytes antes de provedor e permanecer útil sem credencial. Symlink, traversal, remoção, arquivo fora dos roots, base inválida e lote excessivo devem ser excluídos ou diagnosticados. O fluxo não pode alterar corpus, Git, PR, issue ou publicação.

Interfaces propostas: `changedPaths(base, head) -> Change[]`; `classifyPath(path, policy) -> Selected | Excluded`; `prepareReviewPackage(selection, limits) -> Manifest + Prompt + Files`; `review(package, provider?) -> Findings | Pending`. O pacote contém manifesto versionado, hashes, limites, prompt normativo e cópias dos documentos selecionados. Achado identifica arquivo, região, severidade, norma, explicação e sugestão, sob revisão humana.

Separar seleção, política editorial, empacotamento e provedor permite reutilização por hooks, workflows e comandos locais. Roots, limites, rotas normativas e provedor são parâmetros do consumidor; ausência de provedor resulta em pendência, nunca aprovação fabricada. O aceite cobre alteração/não alteração, draft, página, renomeação, remoção, traversal, symlink, arquivo/lote excessivo, base inválida, ausência de provedor, corpus inalterado e sanitização.

## Anexo técnico sanitizado

O comentário de 2026-09-25T08:24:17Z exige seleção somente entre base/head validados; arquivo regular dentro de roots; `lstat` e `realpath`; rejeição de NUL, absoluto, `..`, symlink, não regular, escape físico, remoção, extensão e limites; base inválida bloqueia sem varredura total. Workflow usa `contents: read`, checkout/action por SHA, `persist-credentials: false`, nenhum `pull_request_target`, segredo, escrita ou push. O manifesto registra base/head, provedor pendente, limites, selecionados/excluídos, hashes e bytes. Testes comprovam traversal, escopo, remoção, provedor pendente, corpus imutável, quantidade/bytes e permissões.

## Equalização

A FT-104 criada pela automação é reclassificada sem renumeração como normativa; FT-105 é sua complementar de código. O provedor é opcional e não recebe conteúdo sem configuração/autorização explícita.
