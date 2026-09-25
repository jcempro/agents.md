# Revisão editorial portável por diff

Identidade normativa: `resource.editorial-review`; recurso; tipo: folha. Ler ao solicitar revisão de documentos alterados, seleção por diff, pacote editorial ou parecer automatizado read-only. Não carregar para edição direta de um único texto já escolhido. Depende de `../core/authority.md`, `../core/contracts.md`, `./editorial-authoring.md` somente quando a política aplicável exigir seu corpo, `./scripts.md`, `./workflows.md`, `MN-PRES`, `MN-TRUST` e do RCF do consumidor.

## 1. Contrato e efeitos

A capacidade é opt-in e expõe quatro responsabilidades separadas: descobrir mudanças entre base/head validados; classificar path pela política do consumidor; preparar pacote determinístico; revisar por adaptador opcional. Configuração declara workspace, roots, extensões, classes editoriais, limites, política/prompt, diretório temporário autorizado e provedor. Nenhum default amplia roots ou transmite conteúdo.

Corpus, Git, branch, commit, pull request, issue e publicação são somente leitura. Únicos efeitos permitidos são temporários do pacote e saída diagnóstica declarada; resultado não aplica sugestão nem substitui aceite humano.

## 2. Seleção segura

Diff aceita somente base/head inequívocos e mudanças materiais suportadas. Base inválida bloqueia sem fallback para varredura integral. Path é normalizado e rejeitado se vazio, absoluto, contiver NUL/traversal, escapar root após resolução física, for symlink/não regular/removido, estiver fora de roots/extensões ou exceder tamanho. Renomeação usa destino validado e registra origem sem ler path removido.

Quantidade e bytes totais são calculados antes de cópia ou provedor; estouro bloqueia deterministicamente. Exclusão declara path sanitizado e razão estável. Política distingue texto humano, síntese conversacional e demais classes sem inferir classe por conteúdo privado além dos metadados autorizados.

## 3. Pacote e resultado

Pacote contém schema/versão, base/head, política, limites, prompt normativo, manifesto ordenado, selecionados/excluídos, bytes e SHA-256, mais cópias somente dos selecionados. Escrita é atômica em diretório temporário autorizado; falha remove parcial próprio. Mesmas entradas/configuração geram manifesto reproduzível, independentemente de timestamps ambientais.

Sem provedor configurado, `review` retorna `pending:provider_not_configured`. Provedor aplica CT-4, recebe somente pacote autorizado e valida schema/limites de resposta. Achado declara arquivo, região, severidade, norma, explicação e sugestão; path desconhecido, região inválida, saída excessiva ou campo não declarado invalida o resultado.

## 4. Workflow e aceite

Workflow distribuível usa `contents: read`, checkout sem credencial persistida, ações pinadas conforme política, timeout, concorrência e artifact temporário com retenção. `pull_request_target`, conteúdo/write, push, segredo implícito ou rede sem configuração são proibidos. Execução local e workflow chamam o mesmo script.

Testes cobrem alteração/não alteração, draft, página, renomeação, remoção, traversal, symlink, escape físico, base inválida, arquivo/lote excessivo, provedor ausente/falho, saída inválida, sanitização, reprodução byte a byte aplicável e hashes de corpus/Git inalterados.
