# Contratos de composição e extensibilidade

Extensão de `./AGENTS.md` §§17–18. Cenário é composição tipada de capacidades; herança só PODE existir em cadeia única comprovadamente estável. Cenário de borda, inclusive Web Page Like, NÃO DEVE simular herança múltipla: DEVE declarar capacidades, ordem e adaptações.

## CT-1 — Camadas

Camadas permitidas: núcleo → capacidade reutilizável → cenário composto → adaptador local. Cada camada DEVE expor contrato estável, dependências explícitas, entrada/saída validável, eventos e falhas; camada intermediária PODE repassar operação somente se registrar entrada, saída, alteração e evento. Estado compartilhado NÃO DEVE ser exposto mutável: API DEVE fornecer getter imutável e setter/ação validada, auditável e limitada pelo contrato.

## CT-2 — Tipos e plugabilidade

Capacidade/script plugável DEVE declarar `id`, `kind`, `version`, `requires`, `provides`, `events`, `validate`, `execute` e, se alocar estado/recurso, `dispose`. Validador DEVE rejeitar tipo, versão, dependência, variável ou método não declarado antes da execução. Implementação local só PODE ampliar por adaptador/hook e NÃO DEVE substituir contrato gerenciado.

## CT-3 — Eventos e hooks

Evento percorre núcleo → capacidades ordenadas → cenário → adaptador local → retorno inverso de observação; nenhuma camada PODE absorver, renomear ou impedir propagação sem contrato explícito. Hook recebe contexto congelado e resultado estruturado; não altera versão, artefato, metadado ou estado gerenciado fora de setter/ação autorizada. Falha identifica camada, evento e contrato; passthrough sem observação é vedado quando houver estado, efeito externo ou dependência posterior.

## CT-4 — Integração pública

Cliente externo DEVE declarar destino, método, autenticação externa, timeout, limite de resposta, cache, idempotência, retry, sanitização, schema e efeito. Leitura idempotente PODE retentar somente falha transitória; mutação exige autorização explícita e NÃO recebe retry implícito. HTTP não-2xx, rede, timeout, resposta maior, JSON inválido, rate limit e erro de servidor DEVEM retornar resultado estruturado e nunca sucesso inferido. Segredo NÃO integra log, cache, estado, proposta ou artefato.
