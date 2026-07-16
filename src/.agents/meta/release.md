# Release operacional

Subordinado a `./cli.md`, `../scenarios/release/scenario.md`, `MN-EXT` e `MN-VAL`. Abrange versão, metadado, notas, tag, asset, GitHub/fornecedor, marcador e convergência. `release:publish` DEVE aceitar versão explícita, `--dry-run`, `--help` e extensões declaradas; prepara commits isolados, envia somente gatilho autorizado e confirma estado remoto quando cliente/API estiver disponível. Segredo não integra log, asset ou metadado.
