# agents-governance

Governanca operacional portavel para agentes IA. O target construtivo fica em `src/`; releases sao gerados em `dist/`.

## Operacao

- `npm run clean`: remove `dist/`, `index.json` e `handoff.md` gerados.
- `npm run check`: executa a verificacao local completa.
- `npm run release -- <versao>`: gera `dist/`, `release-note.txt` e `agents-v<versao>.zip`.
- `npm run release -- <versao>`: gera o release local; sem versão, infere somente quando a evidência é determinística.
- `npm run release:trigger -- <versao>`: cria o gatilho transitório `release` para o workflow técnico.
- `npm run agent:status`: resume capacidades canonicas.
- `npm run agent:filter -- --run <comando> [args]`: entrega a saída do comando em JSONL compacto e ordenado para IA.
- `npm run agent:index`: gera `index.json` minificado a partir de `src/`.
- `npm run agent:dist`: gera `dist/`, `dist/release.json` e pacote `agents-v<versao>.zip`.
- `npm run agent:verify`: valida scripts, indexador e dist.
- `npm run agent:agents`: executa atualizacao automatica da governanca operacional pela superficie filtrada.
- `npm run agent:handoff`: gera [handoff.md](handoff.md) a partir de `.agents/continue.ia`.

## Release

- `.github/workflows/release.yml`: executa release manual ou por commit contendo apenas `release` no root.
- O arquivo `release` e extensões autorizadas funcionam apenas como gatilho transitório; o workflow remove o arquivo e cria commit `release:`. `publish` fica reservado à Publicação de Conteúdo e este repositório não a aplica.
- `dist/release-note.txt` e o pacote versionado sao gerados localmente por `agent:release` antes da publicacao do GitHub Release marcado como latest.

## Normas

- [RCF.md](RCF.md): contrato material do projeto.
- [agents.md](agents.md): governanca operacional aplicavel a este workspace.
- [src/agents.md](src/agents.md): artefato normativo distribuivel.
- [src/.agents/.autoupdate.md](src/.agents/.autoupdate.md): contrato de atualizacao automatica.
- [src/.agents/webPageLike.md](src/.agents/webPageLike.md): cenario Web Page Like.
- [src/.agents/release.md](src/.agents/release.md): cenario Release.
- [src/.agents/publish.md](src/.agents/publish.md): cenario Publicação de Conteúdo.
