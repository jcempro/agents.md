# Triagem e memória local de recusas ainda não implementadas

Identidade normativa: `scenario.governance.refused-decisions`; cenário técnico; tipo: folha. Aplicar em toda nova solicitação, após identificar/preservar sua fonte e antes de análise substantiva, decomposição, FT ou solução. Abrange papéis Final e Construtor. Depende de `request-lifecycle.md`, `../../core/routing.md`, `MN-STATE`, `MN-PRES` e do RCF aplicável.

## 1. Autoridade, localização e exclusão

Cada repositório mantém, somente quando houver entrada elegível, seu acervo em `.ia.rules/state/decisions/refused/`. O acervo é estado local, versionado e contextual: NÃO integra `src/`, dist, pacote, release, manifesto, mapa, update ou upstream e NÃO é copiado entre repositórios. Release distribui este contrato, nunca índice, schema, modelo ou registro local. Build/update ignoram e preservam o diretório; publicação que o contenha é inválida.

O acervo auxilia triagem e NÃO substitui RCF, FT, issue, `continue.ia`, Git ou fonte original. RCF/implementação descrevem o que existe; este cenário registra somente o expressamente recusado que continua ausente e pode reaparecer.

## 2. Gate de inclusão e não inundação

Entrada exige cumulativamente:

1. recusa expressa, fundamentada e rastreável;
2. matéria recusada ainda materialmente ausente;
3. risco razoável de nova solicitação por prompt, issue, TODO ou equivalente;
4. evidência suficiente de contexto, alcance e decisão;
5. custo de registro inferior ao retrabalho evitável.

Não implementação isolada, backlog aceito, item pendente, hipótese nunca decidida, capacidade existente, matéria implementada, sugestão trivial ou alternativa incidental NÃO entram. Em trabalho ativo, registrar somente a parcela recusada/condicionada, a parte aceita e a FT/tarefa que prossegue; nunca marcar o todo como recusado.

## 3. Índice, estados e registro

`index.json` usa schema `agents-refused-decisions-index/v1` e cada entrada declara: `id` estável `DEC-AAAAMMDD-NNN`, `semanticKey`, `title`, `status`, `scope`, `decidedAt`, `decision`, `refusalDegree`, `summaryReason`, `record`, `relatedArtifacts`, `reconsiderationCondition`, `lastReviewedAt`, `currentSituation`, `absenceConfirmed` sempre `true` e `ownership` sempre `repository-local`.

Estados fechados: `RECUSADO`, `PARCIALMENTE_RECUSADO`, `RECUSADO_PARA_RECONSIDERACAO`, `EM_ANDAMENTO_COM_RESTRICOES`, `REABERTO`, `SUPERADO`, `SUBSTITUIDO`, `ACEITO_APOS_REAVALIACAO`. `ADIADO` é inválido. `RECUSADO_PARA_RECONSIDERACAO` exige recusa vigente, benefício potencial identificado e condição técnica concreta; tempo, preferência ou oportunidade vaga não bastam. Graus: `TOTAL`, `PARCIAL`, `CONDICIONAL`, `NAO_APLICAVEL`.

Registro detalhado preserva solicitação/referência íntegra, contexto/objetivo, parte aceita, parcela recusada/condicionada, fundamentos, alternativas, impactos/riscos, condição de reavaliação, referências, evolução e conclusão vigente. Negativa sem fundamento, história inferida ou migração sem evidência são proibidas.

## 4. Triagem prioritária e reavaliação

Para cada nova solicitação:

1. ler somente o índice;
2. comparar chave semântica, finalidade, efeito, pressupostos, escopo, restrições e artefatos;
3. sem candidato, prosseguir pelo ciclo normal;
4. com candidato, ler integralmente o registro e confirmar recusa expressa e ausência;
5. avaliar mudança em requisito, evidência, dependência, arquitetura, contrato, risco, custo, capacidade, ambiente ou restrição;
6. sendo equivalente e sem mudança material suficiente, encerrar a triagem com ID e fundamento vigente, sem reanálise ou nova FT;
7. havendo diferença material, justificar e executar reavaliação proporcional, atualizando estado/evolução.

Insistência, reformulação ou passagem do tempo não são mudança material. Automação só aponta candidatos; equivalência e suficiência da mudança exigem julgamento técnico. O acervo não cria lista negra nem impede inovação materialmente distinta.

## 5. Retenção, remoção e validação

Enquanto a parcela recusada permanecer ausente, confirmação, reabertura, superação, substituição ou aceite após reavaliação atualizam o mesmo registro; esses estados não autorizam remoção. `REABERTO` exige fato novo/justificativa; `ACEITO_APOS_REAVALIACAO` permanece até implementação; `SUPERADO`/`SUBSTITUIDO` preservam motivo/destino.

Após implementação e validação da matéria, atualizar primeiro a evolução e autoridades permanentes; depois remover índice/registro em commit rastreável. Git preserva recusa e revisões. Implementação parcial remove somente a parcela materializada.

Validação manual desta fase rejeita ID/chave duplicado, `ADIADO`, estado/grau inválido, campo/path/link ausente, órfão, `absenceConfirmed` falso, recusa não expressa, matéria implementada, reabertura sem justificativa, transição sem evolução e qualquer registro sob `src/` ou payload. Validação executável pertence a FT própria e não automatiza equivalência semântica.
