<!-- Gerado por npm run agent:handoff. Nao editar manualmente. -->
# Implementacoes em andamento

Resumo operacional gerado de `.agents/continue.ia`.

## FT-005 - Release automatico aderente ao RCF

Objetivo: Implementar comandos locais e workflow de release/publicacao alinhados ao RCF, incluindo gatilho publish, release-note e commit release.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="2">Lacunas normativas de release</td>
<td>Auditar RCF, scripts ativos e ausencia de workflow</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Delimitar comandos canonicos faltantes para release/publicacao</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td rowspan="3">Superficie local de release</td>
<td>Implementar clean/repair reais em repo-tools</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Implementar agent:release, agent:publish e agent:deploy com versionamento local</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Gerar release-note.txt e pacote versionado em dist</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td rowspan="2">Workflow GitHub Actions</td>
<td>Criar detector de commit publish e finalizador release</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Criar .github/workflows/release.yml para manual/push</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td rowspan="3">Validacao e sincronizacao</td>
<td>Atualizar README e memoria canonica</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Executar validacoes locais dos scripts e comandos</td>
<td><span style="color:#ca8a04">&#9679;</span> em andamento</td>
</tr>
<tr>
<td>Consolidar aderencia residual e registrar pendencias reais</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>
