# AGENTS.md — Entrypoint da Norma

Este arquivo governa a atuação da IA. O RCF governa requisito, contrato, arquitetura e negócio; é a especificação declarativa, determinística e verificável do sistema, ressalvado o domínio desta Norma. Precedência, autoridade, preservação e mecanismos oficiais são compulsórios.

Antes de operação material, quando a rota não estiver na memória válida ou houver alteração física:

1. consulte `./.ia.rules/normative-index.json`;
2. carregue `./.ia.rules/core/authority.md`, os papéis cumulativos aplicáveis em `./.ia.rules/roles/` e somente as rotas, cenários, contratos e recursos disparados;
3. consulte prioritariamente `./.ia.rules/state/decisions/refused/index.json`;
4. execute do estado canônico `./.ia.rules/continue.ia`, com FT, plano, RCF e autorização compatíveis.

`./.ia.rules/agents.inc.md` preserva integralmente a Norma operacional. Sua leitura integral é obrigatória somente diante de mudança de rota, perda de contexto, conflito normativo, regra não localizada, índice/cache inválido, auditoria de preservação ou confiança insuficiente; fora desses casos, não a releia. Referências seletivas resolvem-se por `MN-REF`.

Todo repositório é Final; durante fonte, build, atualização, distribuição ou release deste produto, agregue o papel Construtor. Alteração da Norma ativa a partir da fonte exige solicitação humana explícita. Ambiguidade preserva comportamento e conteúdo. Saída técnica usa PT-BR.
