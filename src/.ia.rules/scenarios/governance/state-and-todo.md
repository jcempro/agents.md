# Estado, memória e governança de TODO

Identidade normativa: `scenario.governance.state-and-todo`; cenário técnico; tipo: folha. Ler diante de estado, memória, correção, retomada, migração ou `TODO.ia.md`. Depende de `../../core/authority.md`, `../../core/routing.md`, `../../roles/final.md`, `./request-lifecycle.md`, `MN-STATE`, `MN-PRES` e do RCF aplicável.

## 1. Arquivos canônicos e índices

No diretório canônico `.ia.rules/state/`, `continue.ia` é estado operacional, nunca histórico: contém somente FT ativa ou tecnicamente concluída ainda pendente de validação do desenvolvedor; esta permanece mínima, com identidade/TO-DO, resultado, pendência e retomada. Validação concluída exige retirada imediata. Acumulação, changelog, arquivo morto, catálogo integral ou retenção por rastreabilidade são violações. `memory.md` mantém aprendizado durável; `fix.md` roteia correção; `FT.implementados.md` indexa conclusões sem repetir história; histórico necessário fica íntegro em subarquivo pequeno, coeso e carregável por FT sob demanda. Índice DEVE decidir a rota antes do detalhe; partição adicional exige ganho medido.

Migração DEVE produzir primeiro a matriz `conteúdo antigo → destino → hash/evidência`, gravar/validar histórico antes de retirar, preservar estado ativo/retomável e comprovar cardinalidade, ordem, links, hashes, duplicação e resíduos. Operação é transacional, idempotente e falha fechada diante de classificação, colisão ou integridade incerta. Histórico Git NÃO substitui conteúdo operacional necessário; conteúdo operacional NÃO justifica manter história no estado corrente.

## 2. Evidência ambiental e retentativa

Resultado ambiental material aplica `../../resources/long-running.md` e registra identidade estável não secreta, contexto relevante, comando/entrada, projeto/hash, data, código/erro, condição, hipótese e próxima retentativa. Generalização ou especialização exige evidência reiterada, amostra, contraexemplos e limite de aplicação. Reprodução equivalente em dois ambientes independentes interrompe troca de máquina até mudança material.

## 3. TODO canônico

`TODO.ia.md` canônico DEVE permanecer perene em `.ia.rules/state/`. A seção `# RCF — Governança da TO-DO` permanece imutável no topo até marcador operacional explícito. Cada frente raiz sem indentação começa exatamente por `- [ ]` ou `- [x]`; todo conteúdo até a próxima raiz pertence à frente e mantém aninhamento visual inequívoco. A forma interna é livre e a hierarquia semântica prevalece. Exemplar na raiz é entrada legada a migrar sem perda e nunca segunda autoridade.

Item operacional usa isoladamente ⬜, 📌, 📜, ⚖️, ⏳, 🔄, 🔎 ou ✅ para não iniciada, FT registrada, normatizada, equalizada, em desenvolvimento, retomada após correção, em reavaliação ou implementada pendente de validação humana. Checkbox da frente raiz e o item literal sempre desmarcado `- [ ] Equalizar e executar as TO-DOs como frentes convergentes de um único objetivo` são exceções. Adaptador legado PODE projetar estado textual apenas enquanto parser oficial não aceitar emoji, sem alterar semântica.

Ciclo mínimo é ⬜ → ⏳ → ✅; estado intermediário só se aplica quando verdadeiro. Após aprovação humana efetiva, a tarefa é removida integralmente; ✅ NÃO significa aprovada ou encerrada. Pedido para executar TODO inicia pela Equalização; “continuar” retoma o estado canônico sem reiniciar. Conflito material insolúvel ou possível inadequação exige consulta humana. TO-DO é normatizada com rastreabilidade, e a execução interrompe antes da implementação para autorização nova, informando pendências, dependências, ordem e impedimentos.

## 4. Validação

Parser, renderização e migração futuros DEVEM testar raiz/subordinação, conteúdo livre, status/transição, adaptador legado, delta/hash, retomada, governança/Equalizer imutáveis e remoção somente após aprovação. TODO NÃO se converte por si em issue, FT, RCF ou autorização. Automação não reescreve conteúdo autoral além da equalização necessária e rastreável.
