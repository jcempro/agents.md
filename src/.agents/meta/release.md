# Release operacional

`release` é o orquestrador all-in-one; branch, primária, remote, workflow, paths e hooks vêm da configuração central/CLI. `release:publish` permanece alias transitório.

Subordinado a `./cli.md`, `../scenarios/release/scenario.md`, `MN-EXT` e `MN-VAL`. Abrange versão, metadado, notas, tag, asset, GitHub/fornecedor, marcador e convergência. `release:publish` DEVE aceitar versão explícita, `--dry-run`, `--help` e extensões declaradas; prepara commits isolados, envia somente gatilho autorizado e confirma estado remoto quando cliente/API estiver disponível. Segredo não integra log, asset ou metadado.
