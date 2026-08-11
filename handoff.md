<!-- Gerado por npm run agent:handoff. Nao editar manualmente. -->
# Implementacoes em andamento

Resumo operacional gerado de `.ia.rules/continue.ia`.

## FT-072 - Atualizador resiliente e preservador de consumidores

Objetivo: Implementar o contrato equalizado da FT-071 no atualizador, mescla de package.json, seleção de gates, handoff, transação, backups, descoberta/migração de extensões e fallbacks, com sucesso material em todo estado programaticamente recuperável.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="4">Diagnóstico estrutural</td>
<td>Reproduzir Issue #11 em consumidor com produto próprio</td>
<td><span style="color:#ca8a04">&#9679;</span> em andamento</td>
</tr>
<tr>
<td>Auditar throws/exits/guardas e classificar recuperabilidade</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Auditar hooks, agents.local.md e equivalentes em layouts históricos</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Comparar superfícies da v0.1.2 ao candidato</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="4">Implementação preservadora</td>
<td>Corrigir autoridade/merge dos scripts e perfil do gate</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Preservar ou migrar toda customização autorizada sem perda</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Implementar fallbacks, retomada e reconciliação de estados recuperáveis</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Garantir transação, backup, idempotência e pós-condições exaustivas</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="4">Testes de matriz</td>
<td>Cobrir os cenários obrigatórios do TODO e da Issue #11</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Cobrir layouts/releases anteriores e atualização interrompida</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Cobrir Git limpo, sujo, commits locais e divergência sem perda</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Cobrir falha de estratégia seguida de fallback e irrecuperável real</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="3">Validação funcional</td>
<td>Executar build, typecheck, lint, test, verify, RCF e grafo</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Provar consumidor real/isolado e reexecução idempotente</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Auditar zero arquivo aplicável desatualizado e zero perda de dados</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="2">Fechamento</td>
<td>Commitar implementação e rastreabilidade causal</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Liberar integração final após verde global</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>

## FT-074 - Salvaguardas de contenção ao repositório corrente

Objetivo: Projetar a Norma da FT-073 e implementar salvaguardas programáticas que impeçam escrita ou Git fora da raiz autorizada, inclusive por traversal, symlink, junction, submódulo, nested repo, worktree, dependência ou múltiplas roots.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="3">Norma Operacional</td>
<td>Reforçar fonte AGENTS e módulos aplicáveis sem perda</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Regenerar núcleo ativo/índice e validar força modal</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Documentar comportamento e diagnósticos operacionais</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="3">Implementação</td>
<td>Resolver raiz Git, path real e fronteiras excluídas</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Aplicar guardas a operações de escrita/destrutivas/Git</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Preservar edição legítima interna e portabilidade</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="3">Testes</td>
<td>Cobrir toda a matriz obrigatória de fronteiras e links</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Comprovar integridade de terceiros e edição interna normal</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Executar gates globais e auditoria de regressão</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="2">Fechamento</td>
<td>Commitar implementação e sincronização causal</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Liberar integração final após verde global</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>

## FT-075 - Integração, comparação e release 0.1.3

Objetivo: Integrar todas as frentes, concluir os itens materiais regidos pelo equalizer, comparar diretamente o candidato à release oficial v0.1.2 e publicar v0.1.3 somente após prova de zero regressão funcional/normativa e preservação de customizações.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="4">Auditoria cumulativa</td>
<td>Revisar FTs ativas e critérios globais</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Comparar arquivos, features, scripts, APIs, hooks, fallbacks e customizações com v0.1.2</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Comparar força, explicitude e cobertura normativa com v0.1.2</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Corrigir qualquer perda antes de prosseguir</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="3">Provas finais</td>
<td>Executar todos os gates locais pertinentes</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Validar package/ZIP/release manifest e consumidores históricos</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Comprovar equalizer perene intacto e demais TODOs materialmente concluídos</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="3">Release</td>
<td>Publicar beta permitido somente se necessário</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Publicar e comprovar v0.1.3 como release final</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Vincular versão, artefatos, hashes e estado remoto</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="3">Convergência e registro</td>
<td>Concluir FTs e gerar handoff</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Convergir dev, primária e remotos</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Registrar análise, correções, testes, comparação, betas e release</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>
