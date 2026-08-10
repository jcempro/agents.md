# Solicitação humana — FT-069

Origem: prompt direto no Codex
Recebido em: 2026-08-09T22:25:58-03:00
Identidade: codex-thread:019fe943-35cd-7ce1-a7f8-a20f28b75253
FTs: FT-069
RCFs de destino: RCF.md §0.0.2 e §4.0
Estado de incorporação: pendente

## Relato inicial

os repositório finais estão reclamando: a atualização v0.1.1 instalou somente o novo AGENTS.md, mas não materializou .ia.rules nem o comando canônico update:agents. O atualizador legado retorna incorretamente “sem alterações”, e isso ocorre mesmo com --force: `{"v":1,"command":"agent:agents","status":"error","exit":2,"totalLines":1,"totalBytes":69,"shown":1,"truncated":false,"artifact":"","sha256":"f9e8fea4425a7f23c82aa6c5540b86f80112b3b00926c75122adea4904b55b4a"}`
`{"code":"TO_IA_INFO","level":"info","message":"Falha ao atualizar governanca operacional: PARAMETRO_INVALIDO:force"}`.

## Complemento sobre detecção

sugiro que “sem alterações” não se baseie em apenas um arquivo, indice ou mapa, mas em uma varredura mais profunda.

## Autorização e release

concluso, e funcional, lance o release 0.1.2
