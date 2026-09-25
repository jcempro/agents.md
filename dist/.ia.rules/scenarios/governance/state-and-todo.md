# Estado, memória e governança de TODO

Identidade normativa: `scenario.governance.state-and-todo`; cenário técnico; tipo: folha. Ler diante de estado, memória, correção, retomada, migração ou `TODO.ia.md`. Depende de `../../core/authority.md`, `../../core/routing.md`, `../../roles/final.md`, `./request-lifecycle.md`, `MN-STATE`, `MN-PRES` e do RCF aplicável.

## 1. Arquivos canônicos e índices

Na raiz, `handoff.md` é o único resumo global de solicitações em andamento e `.ia.rules/continue.ia` é o único estado operacional global; ambos permanecem mínimos e apontam por ID ao detalhe. `.ia.rules/state/` contém históricos, índices, requests, contextos e detalhes segmentados, sem equivalente funcional concorrente. FT ativa ou tecnicamente concluída ainda pendente de validação mantém identidade, resultado, pendência e retomada; validação concluída exige retirada imediata do estado global. `memory.md`, `fix.md` e `FT.implementados.md` continuam índices especializados sob demanda. Acumulação, changelog e arquivo morto em superfície global são violações.

Migração DEVE produzir primeiro a matriz `conteúdo antigo → destino → hash/evidência`, gravar/validar histórico antes de retirar, preservar IDs, estado ativo/retomável e comprovar cardinalidade, ordem, links, hashes, duplicação e resíduos. Operação é transacional, idempotente, retomável e falha fechada diante de classificação, colisão ou integridade incerta; convivência temporária declara mapa legado→novo e condição de remoção. Histórico Git só substitui cópia quando o blob/commit íntegro for recuperável e suficiente; conteúdo operacional NÃO justifica manter história na superfície corrente.

Retenção automática é configurável, determinística, idempotente e auditável. Antes de excluir, produz dry-run com razão e referências; nunca remove solicitação ativa, pendente de validação, referenciada, ligada a issue aberta/release pendente ou necessária à rastreabilidade. Prazo deriva de ciclo real documentado, não de constante arbitrária.

## 2. Evidência ambiental e retentativa

Resultado ambiental material aplica `../../resources/long-running.md` e registra identidade estável não secreta, contexto relevante, comando/entrada, projeto/hash, data, código/erro, condição, hipótese e próxima retentativa. Generalização ou especialização exige evidência reiterada, amostra, contraexemplos e limite de aplicação. Reprodução equivalente em dois ambientes independentes interrompe troca de máquina até mudança material.

## 3. TODO canônico

`TODO.ia.md` canônico DEVE permanecer perene somente na raiz. A seção `# RCF — Governança da TO-DO` permanece imutável no topo até marcador operacional explícito. Antes da inicialização a forma interna é livre; depois dela, a frente conserva somente status, síntese mínima, ID do histórico e FTs, reduzindo ao menos 70% quando materialmente possível. Homônimo legado só PODE persistir temporariamente como projeção identificada ou histórico sem valor operacional.

Item operacional usa isoladamente ⬜, 📌, 📜, ⚖️, ⏳, 🔄, 🔎 ou ✅ para não iniciada, FT registrada, normatizada, equalizada, em desenvolvimento, retomada após correção, em reavaliação ou implementada pendente de validação humana. Checkbox da frente raiz e o item literal sempre desmarcado `- [ ] Equalizar e executar as TO-DOs como frentes convergentes de um único objetivo` são exceções. Adaptador legado PODE projetar estado textual apenas enquanto parser oficial não aceitar emoji, sem alterar semântica.

Ciclo mínimo é ⬜ → ⏳ → ✅; estado intermediário só se aplica quando verdadeiro. Após aprovação humana efetiva, a tarefa é removida integralmente; ✅ NÃO significa aprovada ou encerrada. Pedido para executar TODO inicia pela Equalização; “continuar” retoma o estado canônico sem reiniciar. Conflito material insolúvel ou possível inadequação exige consulta humana. TO-DO é normatizada com rastreabilidade, e a execução interrompe antes da implementação para autorização nova, informando pendências, dependências, ordem e impedimentos.

## 4. Validação

Parser, renderização e migração DEVEM testar raiz/subordinação, conteúdo livre pré-inicialização, resumo correlacional, redução, status/transição, adaptador legado, delta/hash, retomada, governança/Equalizer imutáveis e remoção somente após aprovação. TODO NÃO se converte por si em issue, FT, RCF ou autorização. Automação não reescreve o histórico original; altera somente a fila resumida por transição autorizada.
