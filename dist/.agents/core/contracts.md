# Contratos de composição e extensibilidade

Extensão de `AGENTS.md` §§17–18. Cenário é composição tipada de capacidades; herança só PODE existir em cadeia única comprovadamente estável. Cenário de borda, inclusive Web Page Like, NÃO DEVE simular herança múltipla: DEVE declarar capacidades, ordem e adaptações.

## CT-1 — Camadas

Camadas permitidas: núcleo → capacidade reutilizável → cenário composto → adaptador local. Cada camada DEVE expor contrato estável, dependências explícitas, entrada/saída validável, eventos e falhas; camada intermediária PODE repassar operação somente se registrar entrada, saída, alteração e evento. Estado compartilhado NÃO DEVE ser exposto mutável: API DEVE fornecer getter imutável e setter/ação validada, auditável e limitada pelo contrato.

## CT-2 — Tipos e plugabilidade

Capacidade/script plugável DEVE declarar `id`, `kind`, `version`, `requires`, `provides`, `events`, `validate`, `execute` e `dispose` quando aplicável. Validador DEVE rejeitar tipo, versão, dependência, variável ou método não declarado antes da execução. Implementação local só PODE ampliar por adaptador/hook e NÃO DEVE substituir contrato gerenciado.

## CT-3 — Eventos e hooks

Evento percorre núcleo → capacidades ordenadas → cenário → adaptador local → retorno inverso de observação; nenhuma camada PODE absorver, renomear ou impedir propagação sem contrato explícito. Hook recebe contexto congelado e resultado estruturado; não altera versão, artefato, metadado ou estado gerenciado fora de setter/ação autorizada. Falha identifica camada, evento e contrato; passthrough sem observação é vedado quando houver estado, efeito externo ou dependência posterior.
