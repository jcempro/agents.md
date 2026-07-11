# agents-governance

Governanca operacional portavel para agentes IA. O target construtivo fica em `src/`; releases sao gerados em `dist/`.

## Operacao

- `npm run agent:status`: resume capacidades canonicas.
- `npm run agent:index`: gera `index.json` minificado a partir de `src/`.
- `npm run agent:dist`: gera `dist/`, `dist/release.json` e pacote `agents-v<versao>.zip`.
- `npm run agent:verify`: valida scripts, indexador e dist.
- `npm run agent:agents`: executa atualizacao automatica da governanca operacional.
- `npm run agent:handoff`: gera [handoff.md](handoff.md) a partir de `continue.ia`.

## Normas

- [RCF.md](RCF.md): contrato material do projeto.
- [agents.md](agents.md): governanca operacional aplicavel a este workspace.
- [src/agents.md](src/agents.md): artefato normativo distribuivel.
- [src/.agents/.autoupdate.md](src/.agents/.autoupdate.md): contrato de atualizacao automatica.
- [src/.agents/webPageLike.md](src/.agents/webPageLike.md): cenario Web Page Like.
