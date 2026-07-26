# FT-052 — Relatório da Fase 3

## Escopo e resultado

A implementação técnica integral exigida pela FT-050/FT-051 foi concluída sem iniciar a FT-059, reservada à Fase 4. A Fase 3 cobre base TypeScript, atualização, distribuição, workflows oficiais, grafo normativo exato, rastreabilidade RCF, guardas contra degradação e auditoria multiplataforma.

As decisões `DEC-20260725-001` e `DEC-20260725-002` foram respeitadas: não existe parser/formatter de sintaxe lógica, nem embeddings, banco vetorial ou reranking. O encerramento desses controles representa avaliação e recusa normativa, não implementação disfarçada.

## Inventário e distribuição

- Manifesto-fonte: 81 entradas positivamente selecionadas.
- Runtimes distribuídos: 28 fontes TypeScript, 28 artefatos JavaScript CommonJS minificados e 1 script Python.
- Artefato: 113 arquivos, incluindo os pares TypeScript/JavaScript exigidos.
- Volume dos runtimes Node no artefato auditado: 373.494 bytes TypeScript e 193.415 bytes JavaScript.
- Conteúdo interno proibido: zero entrada sob `constructor/`, `test/`, `.github/` ou `.ia.rules/state/decisions/` no ZIP.
- O registro de recusas permanece exclusivamente no estado local do Construtor e nunca integra manifesto, pacote, ZIP ou release.

## Resiliência e compatibilidade

- Baseline executado localmente em Node.js 24.18.0: 16 suítes aprovadas.
- Matriz remota Node.js 24 / Python 3.14: Windows, Ubuntu e macOS aprovados no run `30182524514`.
- O corpus cobre inventário integral, sintaxe dos artefatos, caminhos com espaços, nomes Unicode, payload mínimo, handoff autenticado, adulteração, atualização transacional, backup, rollback, customização, grafo, rastreabilidade e workflows.
- Falhas cross-platform encontradas e corrigidas na causa: hash do gerador dependente de CRLF, hash do catálogo de workflows dependente de EOL e checkout raso incompatível com rastreabilidade histórica.
- Workflows internos do construtor foram alinhados ao baseline Node.js 24.

## Reprodutibilidade, segurança e custo

- Duas gerações consecutivas do ZIP no commit `bbdec4c` produziram o mesmo SHA-256 `BEB0759EE517AAEB5439245CB40BD9E572FA18DD29C5466DA802E0F29EA215A2` e 306.931 bytes.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilidade.
- `agent:security`: `SECURITY_OK`, sem achados; o falso positivo causado pela inspeção da própria assinatura foi eliminado.
- `npm pack --dry-run`: 63 entradas, sem documentação, avaliação, teste, decisão ou infraestrutura interna.
- Grafo: 35 nós, 34 arestas e 34 rotas terminais; corpus integral de 35.190 tokens; redução contextual média de 76,26%.

## Rastreabilidade

RCF, fontes, artefatos, testes e workflows foram vinculados por commits materiais em duas fases. O mapa local contém 245 unidades materiais e valida round trip, hash integral, últimos sete caracteres no texto humano e causalidade por artefato.

O gate terminal da issue #2 permanece separado: sua reavaliação e o comentário remoto somente ocorrem depois da baixa de todos os demais controles do TODO. A issue #9 integra a FT-050 e será vinculada ao release da Fase 3 pelo ciclo oficial.
