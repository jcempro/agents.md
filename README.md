# agents-governance

Governanca operacional portavel para agentes IA. O target construtivo fica em `src/`; releases sao gerados em `dist/`.

## Operacao

- `npm run clean`: remove `dist/`, `index.json` e `handoff.md` gerados.
- `npm run check`: executa a verificacao local completa.
- `npm run release -- <versao>`: gera `dist/`, `release-note.txt` e `agents-v<versao>.zip`.
- `npm run publish -- <versao>`: cria o gatilho transitório `publish` para o workflow de release.
- `npm run agent:status`: resume capacidades canonicas.
- `npm run agent:index`: gera `index.json` minificado a partir de `src/`.
- `npm run agent:dist`: gera `dist/`, `dist/release.json` e pacote `agents-v<versao>.zip`.
- `npm run agent:verify`: valida scripts, indexador e dist.
- `npm run agent:agents`: executa atualizacao automatica da governanca operacional.
- `npm run agent:handoff`: gera [handoff.md](handoff.md) a partir de `.agents/continue.ia`.

## Release

- `.github/workflows/release.yml`: executa release manual ou por commit contendo apenas `publish` no root.
- O arquivo `publish` e variantes por extensao funcionam apenas como gatilho transitório; o workflow remove o arquivo e cria commit `release:`.
- `dist/release-note.txt` e o pacote versionado sao gerados localmente por `agent:release` antes da publicacao do GitHub Release marcado como latest.

## Normas

- [RCF.md](RCF.md): contrato material do projeto.
- [agents.md](agents.md): governanca operacional aplicavel a este workspace.
- [src/agents.md](src/agents.md): artefato normativo distribuivel.
- [src/.agents/.autoupdate.md](src/.agents/.autoupdate.md): contrato de atualizacao automatica.
- [src/.agents/webPageLike.md](src/.agents/webPageLike.md): cenario Web Page Like.
