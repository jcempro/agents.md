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

## CT-5 — Assinatura comum de recurso

Recurso oficial DEVE possuir identidade única e contrato versionado com `id`, `kind`, `version`, `purpose`, `trigger`, `roles`, `requires`, `provides`, `inputs`, `outputs`, `states`, `effects`, `idempotency`, `destructive`, `timeouts`, `retries`, `concurrency`, `limits`, `events`, `hooks`, `callbacks`, `fallbacks`, `platforms`, `runtimes`, `configuration`, `logs`, `help`, `exitCodes`, `validation` e `ownership`. Campo inaplicável permanece explícito como vazio/`none`, sem omissão ambígua. Especialização altera somente diferença material e referencia a assinatura-base.

Entrada e saída estruturadas DEVEM declarar schema e versão. Evolução é aditiva e compatível quando possível; ruptura exige versão nova, migração, período de transição, detecção inequívoca e rejeição segura. Identificador, parâmetro, evento, hook, callback, fallback, arquivo ou diretório funcionalmente equivalente NÃO DEVE coexistir sob sinônimo.

## CT-6 — Contexto e resultado de hook

Hook recebe contexto imutável com `contract`, `operation`, `phase`, `correlationId`, `cwd`, `sourceRoot`, `targetRoot`, `configuration`, `arguments`, `environment`, `state`, `artifacts` e `startedAt`; valores não aplicáveis são `null` ou coleção vazia conforme schema. Segredo é referência opaca, nunca valor. Hook retorna resultado com `contract`, `hook`, `phase`, `status`, `code`, `changed`, `artifacts`, `diagnostics`, `metrics`, `state`, `startedAt`, `finishedAt` e `durationMs`.

Estados permitidos são `pending`, `running`, `succeeded`, `failed`, `cancelled`, `interrupted` e `skipped`; `skipped` exige razão contratual. Hook NÃO DEVE alterar contexto, absorver erro, fabricar sucesso, executar fase alheia nem escrever fora dos destinos autorizados. Código, saída, diagnóstico e artefato propagam-se integralmente ao orquestrador.

## CT-7 — Manifesto declarativo

Manifesto oficial DEVE declarar `schema`, `id`, `version`, `generated`, `authority`, `scope`, `entries` e `integrity`. Cada entrada declara identidade, tipo, finalidade, origem, destino, propriedade, obrigatoriedade, condição, dependências, versão, política de atualização, preservação, remoção e hash/tamanho quando materializada. Path é relativo, normalizado, sem travessia, caixa ambígua, drive, URL ou resolução dependente de cwd.

Manifesto normativo manual usa `generated=false`, não inventa hash de artefato futuro e é fonte declarativa; manifesto derivado usa `generated=true`, aponta fonte/gerador/commit e NÃO recebe edição manual. Campo desconhecido é preservado somente quando schema o permitir. Ausência, duplicação, referência quebrada, versão incompatível, hash divergente ou autoridade incerta bloqueiam consumo.

## CT-8 — Resiliência e conclusão

Failsafe significa concluir a finalidade por rotas seguras. Falha previsível DEVE declarar detecção, causa e alternativas finitas ordenadas: retry limitado, backoff, equivalente oficial, execução em etapas, revalidação/reconstrução, temporário, checkpoint ou fallback compatível. Após esgotamento, recurso restaura ou preserva estado íntegro e informa causa, tentativas, incompatibilidades e ação necessária. Laço infinito, retry cego, sucesso inferido, diagnóstico suprimido ou parcial silencioso são proibidos.

## CT-9 — Elegibilidade e perfil de distribuição

Fonte distribuível DEVE constar de manifesto positivo manual com `path`, `profile`, `destination`, `purpose`, `roles`, `condition`, `ownership` e `validation`; perfis permitidos são `consumer-core`, `consumer-runtime`, `consumer-scenario`, `consumer-bootstrap` e `generated-release`. O manifesto é exaustivo para `src/`: entrada física não declarada, destino duplicado, perfil desconhecido ou classificação negativa bloqueia o build.

`builder-internal` é classificação de não distribuição e NÃO DEVE ocorrer em `src/`, manifesto positivo, dist, pacote, ZIP, release, publish ou update. Aplicabilidade exclusiva ao papel Construtor não basta para essa classificação: norma, cenário, capacidade, workflow ou runtime reutilizável por outro Construtor permanece `consumer-scenario`. Toda projeção derivada DEVE preservar identidade, perfil, destino e integridade da entrada manual.
