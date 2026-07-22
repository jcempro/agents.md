# Cenário — Verificação de atualização aplicacional

Aplica-se somente quando RCF/configuração declarem detecção de versão para software distribuído. É distinto da atualização da governança: ausência da capacidade NÃO adiciona runtime, rede, polling, UI ou ação.

## Componentes e ciclo

Papéis plugáveis: fornecedor de versão, `provider`, `version-source`, `comparison-strategy`, `cache-adapter`, `scheduler`, verificador, política, `notification-adapter`, `update-action`, `event-observer`, `interceptor` e `factory`. Cada implementação declara identidade, versão contratual, requisitos/capacidades, validação, execução, eventos e descarte. Provider HTTP, release, branch, tag, API, manifesto ou customizado entra sem alterar o núcleo.

Ciclo: identidade local imutável → consulta limitada → validação da resposta → comparação declarada → estado → cache permitido → evento estruturado → apresentação → ação autorizada. Estados mínimos: `atualizada`, `atualizacao_disponivel`, `origem_indisponivel`, `resposta_invalida`, `offline`, `politica_bloqueada`, `erro_controlado`. Detecção, notificação e ação NÃO se confundem.

## Política e validação

Configuração versionada define provider/origem, identidade, estratégia, timeout, tamanho, frequência/polling, retry/backoff, cache/TTL, offline, observabilidade, notificações e ações. Consulta idempotente PODE retentar falha transitória; mutação não retenta implicitamente. Falha externa degrada só a capacidade. Segredo e dado sensível não entram em artefato, cache, log, telemetria ou UI. Atualização automática exige política e autorização explícitas; dry-run/offline não acessa rede nem escreve. Aceite técnico futuro exige parser/schema comum, todos os estados e dois adapters arquiteturalmente distintos.
