<!-- Gerado por npm run agent:handoff. Nao editar manualmente. -->
# Implementacoes em andamento

Resumo operacional gerado de `.ia.rules/continue.ia`.

## FT-064 - Normatização do runtime de workflows e das métricas do grafo

Objetivo: Normatizar o piso Node.js 24+ para workflows destinados a Repositórios Finais e ampliar o resumo estatístico do grafo com mediana e desvio padrão populacional, sem antecipar código.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="3">Captura e conciliação</td>
<td>Preservar solicitação integral, origem, hash e evidências da CI</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Segregar FT normativa e FT técnica com dependência e aceite próprios</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Commitar exclusivamente criação e conciliação</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td rowspan="3">RCF</td>
<td>Definir aplicabilidade e piso Node.js 24+ sem instalar runtime inútil</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Definir mediana, desvio padrão populacional, precisão e conjuntos vazios</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Vincular validação, README, índice, mapa, CLI e diagnóstico de CI</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td rowspan="3">Norma Operacional</td>
<td>Projetar o piso de runtime em `resource.workflows`</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Auditar RCF → Norma sem código ou derivado antecipado</td>
<td><span style="color:#15803d">&#9679;</span> concluído</td>
</tr>
<tr>
<td>Validar, concluir e interromper antes da FT-065</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>

## FT-065 - Implementação das métricas estatísticas e verificação da matriz

Objetivo: Implementar mediana e desvio padrão populacional no gerador, índice, mapa, README e saída CLI; validar resultados e somente corrigir a matriz de runtime se a falha comprovadamente persistir.

<table>
<thead><tr><th>Etapa</th><th>Tarefa</th><th>Status</th></tr></thead>
<tbody>
<tr>
<td rowspan="3">Implementação estatística</td>
<td>Calcular mediana e desvio padrão populacional por tipo terminal</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Atualizar índice, mapa, região README e saída CLI deterministicamente</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Cobrir valores pares/ímpares, conjunto unitário, vazio e arredondamento</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="3">Validação de workflows</td>
<td>Comprovar o piso Node.js 24+ nos workflows distribuíveis aplicáveis</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Revalidar localmente e no histórico remoto a falha FONTE_SEM_PERFIL</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Corrigir somente se a falha persistir no estado corrente</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td rowspan="3">Integração</td>
<td>Regenerar derivados e sincronizar hashes/manifests aplicáveis</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Executar testes, verify e validação de obsolescência</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
<tr>
<td>Registrar resultado, commit material e rastreabilidade causal</td>
<td><span style="color:#64748b">&#9679;</span> pendente</td>
</tr>
</tbody>
</table>
