# Contexto-mestre — FT-056 a FT-059

identidade=CTX-FT-056-MASTER
ordem=1
fase=multifase
estado=ativo
origem=../../requests/FT-056/request.md
objetivo=Segregar integralmente fonte distribuível, artefato publicado e conteúdo interno do construtor sem regressão.

## Mapa

1. FT-056: RCF, taxonomia, invariantes, transição e aceite.
2. FT-057: Norma Operacional em `AGENTS.md`, associados e fonte distribuível.
3. FT-058: reorganização física, referências, scripts, manifests, build, release e publish.
4. FT-059: integração, auditoria integral, release mínimo e fechamento.

## Invariantes

- `src/` contém somente fonte com efeito direto e necessário no produto distribuído.
- Exclusão do payload não basta: localização interna também é reavaliada.
- `AGENTS.md` raiz e `.ia.rules/` ativo mantêm autoridade e proteção próprias.
- Outros conteúdos internos podem usar a raiz ou namespace arquiteturalmente adequado.
- Nenhum comportamento ou contrato público muda, salvo retirada de artefato indevido do payload.
- Fases são sequenciais e exigem autorização humana nova após cada fase normativa.

## Estado real inicial

- branch `dev`, worktree limpo, HEAD `4f87c30164b9598d6f913141e2ca885e3f407592`;
- `src/` possui 70 arquivos, incluindo fonte normativa, runtime, configuração e `core/evaluations/logical-syntax.md`;
- `dist/` rastreado possui 61 arquivos e ainda reflete geração anterior à FT-051/FT-054;
- `logical-syntax.md` é avaliação interna comprovada;
- `core/rcf-projection.md` e `roles/constructor.md` exigem classificação arquitetural específica;
- FT-052 cobre transversalmente package/allowlist e validação, mas FT-058 especializará esta solicitação sem duplicação;
- `agent:verify` possui falha EOL conhecida em `archive.js`, pertencente à FT-052.

## Integração e aceite global

Auditar cada arquivo de `src/` por finalidade, consumidor, efeito, perfil e referências; atualizar todos os vínculos; gerar release; inspecionar pacote/ZIP; validar scripts, workflows, documentação, índices e ausência de conteúdo exclusivamente interno. Conclusão global pertence à FT-059.
