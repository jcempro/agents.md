# Atualização

`update:agents` é o comando NPM canônico all-in-one; `agent:autoupdate`, `agents:autoupdate`, `agent:agents` e `agents:update` são aliases transitórios que apenas delegam à implementação `shared:update:agents`.

Subordinado a `./cli.md`, `../core/update/scenario.md` e `MN-EXT`. Abrange descoberta, lock, download, handoff, validação, transação, merge de manifesto e commit exclusivo. Manifesto remoto versionado define exaustivamente o gerenciado; lock anterior apenas converte/limpa legado comprovado. Bootstrap valida runtime manifestado e passa bastão com estado autenticado; a release fornece código/dependências e o repositório é somente target. Divergência em path gerenciado gera backup e converge; extensão local permanece intocada. Mudança estrutural usa descritor de linguagem, marcador, parser único e conversor permanente.
