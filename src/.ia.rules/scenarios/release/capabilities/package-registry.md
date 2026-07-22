# Capacidade Release — Registro de pacote

Aplica-se somente quando RCF e configuração declarem um registro como destino do release. Subordina-se ao cenário Release, a `MN-CLI`, `MN-EXT`, `MN-VAL` e aos contratos públicos; repositório sem declaração retorna `n/a` sem adapter, rede, permissão ou custo.

Especializa a ordem do cenário Release somente quando ativa: a publicação/confirmação do registro ocorre antes da tag e do release externo; as demais regras, inclusive `published`, gatilho, limpeza e convergência, permanecem preservadas.

## Contrato

Componente `package-registry` DEVE declarar identidade, versão, registro, acesso, autenticação externa, requisitos, capacidades, comandos, efeitos, validação e descarte. Eventos: `prepare-package` valida versão, manifesto, allowlist, identidade e produz metadado congelado; `verify-package` comprova arquivo/digest; `publish-package` publica exatamente o mesmo pacote uma vez; `confirm-package` consulta versão, digest e canal/dist-tag idempotentemente. Adapter de fornecedor não integra o núcleo e PODE representar NPM, PyPI, RubyGems, crates.io ou equivalente.

Ordem: versão/gatilho → suíte/`prepare` → empacotamento único → validação/`verify` → `prepare-package` → `verify-package` → `publish-package` → `confirm-package` → tag → release/asset externo → `published` → limpeza/convergência. Falha bloqueia dependentes e conserva retomada. Publicação mutável não retenta implicitamente; confirmação idempotente segue política de leitura. Segredo, token e OTP não persistem; Trusted Publishing/OIDC é estratégia do adapter, e bootstrap de identidade exige exceção local autorizada.

`publish`/`agent:publish` permanecem exclusivos de conteúdo; comando homônimo do fornecedor não altera a taxonomia. Dry-run não acessa rede, escreve, empacota, publica ou confirma. Aceite técnico futuro prova pacote único, ordem registro antes do release externo, falha bloqueante, ausência de retry mutável, confirmação idempotente e adapter de referência sem acoplamento.
