# Publicação de conteúdo

`publish` é orquestrador all-in-one e delega a `shared:lifecycle:publish`; hooks opcionais `publish.pre.js`, `publish.js` e `publish.post.js` recebem contexto congelado. Sem cenário/hook aplicável retorna `PUBLISH_NAO_APLICAVEL` sem mutação.

Subordinado a `./cli.md`, `../scenarios/content-publication/scenario.md` e `MN-EXT`; carregar somente quando RCF declarar conteúdo público. `publish` nunca cria versão, tag, asset ou release. Declara destino, disponibilidade, cache, rollback, hook e validação real.
