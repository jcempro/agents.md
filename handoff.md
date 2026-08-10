<!-- Gerado por npm run agent:handoff. Nao editar manualmente. -->
# Implementacoes em andamento

Resumo operacional gerado de `.ia.rules/continue.ia`.

## FT-070 - Correção do manifesto de handoff da release 0.1.2

Objetivo: Eliminar a falha pública em consumidor canônico já instalado, garantindo que o manifesto selecionado para o handoff declare e valide integralmente update-agents.js e suas dependências transitivas antes da atualização.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="3">Reprodução e causa</td>
<td>Validar o ZIP público e o manifesto efetivamente selecionado</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Reproduzir a atualização a partir de consumidor canônico v0.1.2</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Identificar a divergência fonte, build, manifesto ou descoberta</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td rowspan="3">Implementação</td>
<td>Corrigir a fonte TypeScript e o gerador aplicável</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Regenerar artefatos e manifestos sem redução do bootstrap legado</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Acrescentar regressão para manifesto selecionado no handoff</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td rowspan="3">Validação funcional</td>
<td>Executar build, typecheck, lint, testes, verify, RCF e grafo</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Ensaiar consumidor v0.0.13 e consumidor canônico v0.1.2</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Comprovar atualização e checagem idempotente públicas</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="3">Republicação e integração</td>
<td>Sincronizar rastreabilidade e concluir a FT</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Apagar/republicar exclusivamente release e tag v0.1.2 pelo pipeline oficial</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Convergir dev, primária e remotos e comprovar asset</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>
