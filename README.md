# agents-governance

Governanca operacional portavel para agentes IA. `./` organiza o repositorio e a governanca ativa; `src/` contem a fonte interna distribuivel; `dist/` e a raiz do artefato publicado. `src/` nao e a raiz da aplicacao: em Web Page Like, a aplicacao coincide com `dist/` e com o `/` percebido pelo usuario.

## Contratos de Scripts

Os contratos reutilizaveis ficam em `.agents/meta/`: `cli` e o contexto minimo (`build`, `release`, `publish`, `maintenance`, `update`, `validation` ou `ia`). O indice `.agents/meta/index.json` relaciona scripts e contextos. Especializacoes do consumidor pertencem a `agents.local.md`, `.agents/local/` ou `.agents/hooks/` e nao sao sobrescritas por `agents:update`.

## Operacao

- `npm run clean`: remove `dist/`, `index.json` e `handoff.md` gerados.
- `npm run check`: executa a verificacao local completa.
- `npm run release -- <versao>`: gera `dist/`, `release-note.txt` e `agents-v<versao>.zip`.
- `npm run release -- <versao>`: gera o release local; sem versão, infere somente quando a evidência é determinística.
- `npm run release:trigger -- <versao>`: cria o gatilho transitório `release` para o workflow técnico.
- `npm run release:publish -- <versao>`: executa o ciclo completo de release e aguarda a comprovação remota.
- `npm run agent:status`: resume capacidades canonicas.
- `npm run agent:filter -- --run <comando> [args]`: entrega a saída do comando em JSONL compacto e ordenado para IA.
- `npm run agent:index`: gera `index.json` minificado a partir de `src/`.
- `npm run agent:dist`: gera `dist/`, `dist/package.json`, `dist/release.json` e pacote `agents-v<versao>.zip`.
- `npm run agent:verify`: valida scripts, indexador e dist.
- `npm run agent:agents`: executa atualizacao automatica da governanca operacional pela superficie filtrada, mesclando somente scripts/dependencias declarados em `agentsGovernance` no `package.json` anfitriao.
- `npm run agent:handoff`: gera [handoff.md](handoff.md) a partir de `.agents/continue.ia`.

## Release

- `.github/workflows/release.yml`: executa release manual ou por commit contendo apenas `release` no root.
- Somente o arquivo `release` no root funciona como gatilho transitório; o workflow remove o arquivo e cria commit `release:`. `publish` fica reservado à Publicação de Conteúdo e este repositório não a aplica.
- `dist/release-note.txt` e o pacote versionado sao gerados localmente por `agent:release` antes da publicacao do GitHub Release marcado como latest.
- Release publicado em `dev` converge a branch primária (`main`, senão `master`); conflito de merge interrompe o workflow.

### Publicação assistida

`release:publish` exige versão explícita, branch `dev`, worktree limpo e workflow presente. O comando atualiza `package.json`, valida o artefato, cria commits separados de preparação e artefato e envia o commit exclusivo `release`; o GitHub Actions cria tag, asset e GitHub Release. Com GitHub CLI autenticado, o comando também acompanha o workflow e confirma a convergência `dev`/primária; sem ele, retorna após enviar o gatilho remoto.

```powershell
# Confere o plano sem alterar arquivos, Git ou GitHub.
npm run release:publish -- 0.0.2 --dry-run

# Publica e acompanha o workflow até a confirmação remota.
npm run release:publish -- 0.0.2

# Envia o gatilho, mas deixa a observação remota para outro operador.
npm run release:publish -- 0.0.2 --no-watch
```

O comando interrompe antes de escrever quando houver alteração local, tag existente, branch incorreta ou dependência remota ausente. Um release já preparado manualmente deve ser concluído ou removido antes de usar o ciclo all-in-one.

## Normas

- [RCF.md](RCF.md): contrato material do projeto.
- [AGENTS.md](AGENTS.md): governanca operacional aplicavel a este workspace.
- [src/AGENTS.md](src/AGENTS.md): fonte do artefato normativo distribuivel.
- [src/.agents/core/update/scenario.md](src/.agents/core/update/scenario.md): contrato de atualizacao automatica.
- [src/.agents/scenarios/web/page-like/scenario.md](src/.agents/scenarios/web/page-like/scenario.md): cenario Web Page Like.
- [src/.agents/scenarios/release/scenario.md](src/.agents/scenarios/release/scenario.md): cenario Release.
- [src/.agents/scenarios/content-publication/scenario.md](src/.agents/scenarios/content-publication/scenario.md): cenario Publicação de Conteúdo.
