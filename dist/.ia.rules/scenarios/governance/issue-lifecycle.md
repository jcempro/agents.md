# Cenário — Ciclo de issue e FTs correlacionadas

Aplica-se ao construtor após aceite humano inequívoco conforme o contrato de inbox. Identidade estável: `github:<owner>/<repo>#<numero>`; título, semelhança textual, ordem ou menção não criam vínculo.

CONTRADIÇÃO DETECTADA: cenário legado de upstream determina uma FT por issue vs FT normativa mais FT de código exigidas pela evolução aprovada — Aplicando esta especialização mais nova apenas a demandas comportamentais e preservando identidade, idempotência e o restante do ciclo legado.

## Segregação e estado

Demanda comportamental aprovada cria uma FT `implementacao_normativa` e uma FT `implementacao_codigo`, distintas em ID, `criado_em`, objetivo, escopo, dependências, estado e aceite. A FT técnica inicia pendente, aponta à norma futura e exige conclusão normativa mais autorização humana posterior. FT genérica legada é reclassificada sem renumeração e recebe a complementar ausente. `agents:in-development` indica ciclo ativo, não código iniciado; comentário de correlação lista ambas.

## Encerramento

Issue só PODE fechar após vínculo formal e conclusão de todas as FTs necessárias ao escopo, com tarefas, aceite e validações satisfeitos e sem pendência interna. Uma issue com várias FTs aguarda todas; uma FT ligada a várias issues exige decisão individual; relação referencial não autoriza efeito. Melhoria externa ao escopo origina registro separado.

Antes do fechamento, registrar comentário com FTs, síntese, validações, commits/PRs/artefatos e impedimentos aplicáveis; então sincronizar label/estado. Issue já fechada é sucesso idempotente. Reexecução não duplica comentário, label ou fechamento; falha parcial registra efeitos e ponto de retomada. Permissão ausente, vínculo ambíguo, FT suspensa/cancelada, aceite incompleto ou pendência mantém aberta com motivo. Release é especialização em lote para FTs concluídas vinculadas à versão e não enfraquece estas precondições.
