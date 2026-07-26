# Solicitação preservada — FT-064/FT-065

- origem: prompt humano nesta tarefa
- recebido_em: 2026-07-25T23:53:07-03:00
- contexto_ide: `e:\DOWNLOADS\TODO-publicacao-pages-indexacao-capas-metadados.md`
- fts: FT-064, FT-065
- destinos_normativos: `RCF.md` §§14.3 e 18.4; `src/.ia.rules/resources/workflows.md`
- estado: preservada para incorporação normativa bidirecional

## Conteúdo integral

Continue, e após:

- Normatizar que qualquer workflow criado por qualquer repositório final deve ser pelo menos Node24+.
- A tabela `Métricas do grafo normativo` em readme.md, bem como o script que a atualize deve incluir `mediana` e `desvio padrão`.
- Verificar se os erros das workflow ainda persistem e se for o caso, corrigí-las:

- Builder - matriz de runtime

  ```shell
  Run npm test
    npm test
    shell: /bin/bash -e {0}
    env:
      pythonLocation: /Users/runner/hostedtoolcache/Python/3.14.6/arm64
      PKG_CONFIG_PATH: /Users/runner/hostedtoolcache/Python/3.14.6/arm64/lib/pkgconfig
      Python_ROOT_DIR: /Users/runner/hostedtoolcache/Python/3.14.6/arm64
      Python2_ROOT_DIR: /Users/runner/hostedtoolcache/Python/3.14.6/arm64
      Python3_ROOT_DIR: /Users/runner/hostedtoolcache/Python/3.14.6/arm64

  > agents-governance@0.0.22 test
  > npm run agent:test


  > agents-governance@0.0.22 agent:test
  > node .ia.rules/core/runtime/scripts/repo-tools.js agent:test

  {"v":1,"command":"agent:test","status":"error","exit":1,"totalLines":2,"totalBytes":111,"shown":2,"truncated":false,"artifact":"","sha256":"90073797e0a26177b0195cc376570d04ba6ed5bc54c07889957c859e3d2976fe"}
  {"code":"TO_IA_INFO","level":"info","message":"{\"code\":\"TYPECHECK_OK\",\"config\":\"config/tsconfig.json\",\"sources\":28}"}
  {"code":"TO_IA_INFO","level":"info","message":"FONTE_SEM_PERFIL:.ia.rules/agents.inc.md"}
  Error: Process completed with exit code 1.
  ```

  ```shell
  > agents-governance@0.0.22 test
  > npm run agent:test


  > agents-governance@0.0.22 agent:test
  > node .ia.rules/core/runtime/scripts/repo-tools.js agent:test

  {"v":1,"command":"agent:test","status":"error","exit":1,"totalLines":2,"totalBytes":111,"shown":2,"truncated":false,"artifact":"","sha256":"90073797e0a26177b0195cc376570d04ba6ed5bc54c07889957c859e3d2976fe"}
  {"code":"TO_IA_INFO","level":"info","message":"{\"code\":\"TYPECHECK_OK\",\"config\":\"config/tsconfig.json\",\"sources\":28}"}
  {"code":"TO_IA_INFO","level":"info","message":"FONTE_SEM_PERFIL:.ia.rules/agents.inc.md"}
  Error: Process completed with exit code 1.
  ```

  ```shell
  > agents-governance@0.0.22 test
  > npm run agent:test


  > agents-governance@0.0.22 agent:test
  > node .ia.rules/core/runtime/scripts/repo-tools.js agent:test

  {"v":1,"command":"agent:test","status":"error","exit":1,"totalLines":2,"totalBytes":111,"shown":2,"truncated":false,"artifact":"","sha256":"90073797e0a26177b0195cc376570d04ba6ed5bc54c07889957c859e3d2976fe"}
  {"code":"TO_IA_INFO","level":"info","message":"{\"code\":\"TYPECHECK_OK\",\"config\":\"config/tsconfig.json\",\"sources\":28}"}
  {"code":"TO_IA_INFO","level":"info","message":"FONTE_SEM_PERFIL:.ia.rules/agents.inc.md"}
  Error: Process completed with exit code 1.
  ```

## Complemento diagnóstico anterior à execução normativa

- A falha original está comprovada no run `30184182023`, commit `7943694`, em macOS, Windows e Ubuntu.
- A causa foi `.ia.rules/agents.inc.md` presente na fonte e ainda ausente do manifesto positivo.
- O run posterior `30184818261`, commit `315a334`, concluiu com sucesso nas três plataformas, inclusive `npm test` e o gate de diff.
- A matéria não corresponde às recusas `DEC-20260725-001` ou `DEC-20260725-002`.
