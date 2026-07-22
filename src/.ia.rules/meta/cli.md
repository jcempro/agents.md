# CLI reutilizavel

Configuração comum reside em `./config/`, segue schema versionado e precedência CLI → ambiente → `agents.local.json` → `repository.json` → `core.json`. NPM reserva `shared:*` à implementação reutilizável e `agent:*`/`agents:*` à delegação filtrada da IA; parcial usa `:` hierárquico.

Subordinado a `./AGENTS.md` §18, `MN-CLI`, `MN-META` e `MN-OUT`. Todo script reutilizável carrega este arquivo primeiro e somente os contextos mapeados aplicáveis. Não redefine contratos dos microconceitos.
