# FT-059 — Integração e auditoria do release mínimo

## Escopo e baseline

- Baseline público: `3ec9eb5` / release `v0.0.22`.
- Entradas integradas: FT-056–FT-058, FT-060–FT-063 e RCF §20.2.
- O relatório verifica o artefato real; conteúdo local de decisões recusadas, `constructor/`, testes e infraestrutura interna permanecem fora da distribuição.

## Auditoria estrutural

- `src/`: 83 arquivos físicos e 83 entradas no manifesto positivo; zero fonte sem perfil, entrada fantasma ou destino duplicado.
- `dist/release.json`: 115 arquivos declarados; zero path de `constructor/`, `test/`, `.github/`, avaliações, projeção RCF ou estado local de recusas.
- Delta contra o baseline: somente `.ia.rules/agents.inc.md` e `.ia.rules/config/repository.json`; nenhuma remoção.
- `repository.json` e `agents.inc.md` possuem perfil `consumer-core`, hash no manifesto de atualização, presença no mapa, ZIP e consumidor limpo.

## Norma, runtime e consumidor limpo

- `AGENTS.md`: 338 tokens por `tiktoken 0.13.0`/`o200k_base`, abaixo do teto de 500.
- `agents.inc.md`: SHA-256 LF `4bd38947f9071855ecb4ae9fa9bae6a9f1fd802117f134373a66a029d4d95024` e 7.364 tokens, preservando integralmente o corpo anterior.
- Grafo: 36 nós, 35 rotas e aresta passiva condicional `core.agents → core.agents-full`.
- Consumidor limpo carrega metadados distribuídos, executa `agent:status`, autentica os dois novos arquivos e valida cabeçalhos de todos os JavaScript publicados; ausência de `repository.json` bloqueia.
- Mutação upstream usa `requireAuthorization` único; ausência/falso retornam `AUTORIZACAO_EXPLICITA_EXIGIDA`/exit 2 e verdadeiro libera o fluxo antes da leitura de segredo ou rede.

## Reprodutibilidade e pacote

- Duas execuções independentes produziram `agents-v0.0.22.zip` com SHA-256 `96123B0A2CF410C2893F7E6A6B4733AF90C981B66FD688678E802EAE25251ADC` e 311.461 bytes.
- `npm pack --dry-run --json`: 101 entradas, 209.845 bytes compactados, 860.128 bytes descompactados; os metadados e o auxiliar estão presentes, sem internos proibidos.
- `agent:typecheck`: 28 fontes; `agent:verify`: 111 arquivos indexados; `agent:test`: 18 suítes.

## Diagnósticos controlados

- `agent:release` sem versão explícita rejeitou corretamente o commit não semântico com `VERSAO_NAO_INFERIVEL`; o fechamento usa versão explícita.
- O primeiro `npm pack` foi bloqueado somente pelo sandbox ao tentar escrever no cache externo do npm; a repetição aprovada concluiu com sucesso.

## Fechamento

Rastreabilidade RCF, release explícita, vínculo das quatro FTs de issue, encerramento idempotente das issues e convergência `dev`/`main` permanecem como gates terminais deste mesmo ciclo.
