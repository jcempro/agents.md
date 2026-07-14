# Cenário Release

Extensão de `AGENTS.md` §17; aplicar `MN-2119`, `MN-DENS`, `MN-PRES`, `MN-API`, `MN-DEF`, `MN-OUT`, `MN-CMD`, `MN-VAL` e `MN-REF`. Aplica-se somente a repositório que publique versões; fora desse escopo NÃO DEVE carregar script, comando, workflow ou custo adicional deste cenário.

## 1. Escopo e separação

Release identifica versão de software/framework, commit, tag, asset e registro remoto. `publish`/`publicar` são exclusivos do cenário Publicação de Conteúdo e NUNCA DEVEM acionar, nomear ou especializar release. Contrato público, customização e extensão devem usar hooks formais; fork/edição direta do mecanismo comum só são admitidos quando hook não expressar a necessidade e a autoridade registrar a exceção.

## 2. Versão e geração

Versão explícita DEVE ser validada e usada sem inferência. Ausente, a inferência DEVE ser determinística, auditável e obedecer evidência ordenada: marcador/tag alcançável → commits posteriores compatíveis com convenção do repositório → manifesto de versão coerente. `feat` incrementa minor, `fix`/`perf` patch e quebra explícita major; pré-release, histórico ambíguo, convenção ausente, tag divergente, candidato existente ou evidência insuficiente DEVEM falhar com confirmação requerida. Algoritmo, entradas, candidato, base e motivo DEVEM constar do metadado do release.

Build DEVE ser determinístico, validar antes/depois, gerar manifestos e notas locais em PT-BR sem dependência externa obrigatória e produzir asset versionado. Manifesto DEVE vincular versão, tag, commit, release anterior, arquivos, hash de notas e asset. Mesmo input e commit DEVEM gerar conteúdo lógico idêntico; relógio, ordem não estável, estado residual e rede NÃO DEVEM alterar o artefato.

## 3. Fluxo, rastreabilidade e hooks

Fluxo: validar versão/estado → hook `prepare` → build/notas/metadados → hook `verify` → tag → publicar asset/release como `latest` → hook `published` → commit `release:`. Falha DEVE impedir etapa dependente e manter vínculo auditável; tag/asset/release órfão DEVE ser detectado antes de nova execução. `latest` DEVE apontar somente ao release publicado mais recente; releases anteriores DEVEM preservar tag histórica.

`agent:release:publish <versão>`/alias equivalente, quando adotado, DEVE exigir versão explícita, branch de desenvolvimento e worktree limpo; DEVE preparar manifesto e artefato em commits isolados, criar commit exclusivo do gatilho `release`, enviá-lo ao remoto, aguardar workflow, comprovar tag/release e confirmar convergência na primária. `--dry-run` NÃO DEVE escrever, commitar, enviar ou acessar GitHub; `--no-watch` PODE encerrar após o envio do gatilho com estado pendente explícito. Alteração, tag, gatilho ou metadado preexistente DEVE bloquear sem sobrescrita. Falha anterior a tag/release PODE retomar somente versão com commit preparatorio reconhecido; deve reconstruir, revalidar e nunca reaproveitar estado parcial.

Gatilho automático, quando adotado, DEVE chamar-se `release` no root, aceitar extensão somente se o RCF autorizar, conter versão explícita validável, ser o único arquivo adicionado no commit e ser removido pelo commit `release:`. `agent:release:trigger` cria esse sinalizador; `agent:release` constrói o release local. Hook local opcional reside fora dos arquivos gerenciados, recebe evento/payload JSON, retorna efeito explícito e NÃO DEVE alterar versão, tag, asset ou metadado sem contrato declarado.

## 4. Segurança, compatibilidade e validação

Segredo NÃO DEVE aparecer em log, metadado ou asset. Git/rede DEVEM ter timeout, retry somente idempotente e confirmação para ação destrutiva. Migração de nomenclatura DEVE manter rastreabilidade; compatibilidade que permita `publish` significar release é vedada. Validar versão, tag inexistente, manifesto, ZIP, hashes, notas, hooks, limpeza do gatilho, commit `release:`, associação commit-tag-asset-release e atualização de `latest`.
