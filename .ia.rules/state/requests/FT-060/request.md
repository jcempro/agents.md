# Fonte integral — github:jcempro/agents.md#2

- Capturado em: 2026-07-25T22:45:43-03:00
- URL: https://github.com/jcempro/agents.md/issues/2
- Título: `[AGENTS] Distribuir os metadados exigidos pela validação de cabeçalhos`
- Corpo SHA-256 (UTF-8 da API): `068B655D63C0C33ADA8C78FF96DACA816C9AE6ECCF6010ACB64F10D38E7F1F15`
- FTs: FT-060, FT-062
- RCF: configuração, cabeçalhos, atualização, distribuição e evolução upstream
- Estado de incorporação: preservado; aguardando RCF

## Corpo

## Contexto

Consumidores da release v0.0.18 recebem os scripts gerenciados com o cabeçalho upstream correto e executam `agent:verify` pelo runtime distribuído.

## Lacuna

`loadConfiguration` carrega `config/repository.json` como fonte opcional de `metadata`, e `assertCodeBanner` exige esses valores. O manifesto da release distribui `config/core.json` e `config/schema.json`, mas omite `config/repository.json`; por isso todo consumidor sem configuração preexistente falha no primeiro script com `CABECALHO_CODIGO_INVALIDO`.

O canal automatizado também falha antes da publicação: `agent:upstream:publish ... --authorize` encerra com `requireAuthorization is not defined` na release v0.0.18.

## Condições

Instalação ou atualização limpa da governança v0.0.18 em repositório consumidor, seguida de `agent:verify`. A falha ocorre antes de a validação alcançar o código do produto.

## Proposta

Incluir `config/repository.json` no conjunto fechado de configuração distribuída e no manifesto de governança, preservando seu hash e sua instalação transacional. Adicionar teste de consumidor limpo que carregue a configuração materializada e execute a validação de todos os cabeçalhos gerenciados.

Restaurar a função de autorização usada por `upstream-share.js` ou substituir sua chamada por validação equivalente coberta por teste.

## Reutilização

A correção atende todos os consumidores da governança, impede dependência de arquivo residual do repositório construtor e restaura o canal canônico de contribuições autorizadas.

## Referência

Release v0.0.18; `configuration.js` lê `core.json`, `repository.json` e `agents.local.json`; `repo-tools.js` exige `metadata` no cabeçalho; o manifesto v2 omite `repository.json`; `upstream-share.js` referencia função de autorização ausente.

## Impacto

Desbloqueia `agent:verify` e `agent:test` nos consumidores sem alterar o núcleo local, sem inferir autoria e sem enfraquecer a validação de licença. Restaura a publicação rastreável de propostas upstream.

## Aceite

- O artefato publicado contém `config/repository.json` declarado e autenticado pelo manifesto.
- Atualização limpa materializa o arquivo.
- `agent:verify` em consumidor sem configuração residual ultrapassa a verificação dos scripts gerenciados.
- `agent:upstream:publish <proposta> --authorize` publica ou detecta duplicata sem erro de referência.
- Edição local continua detectável pela transação.
