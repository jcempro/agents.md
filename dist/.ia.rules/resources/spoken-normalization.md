# Normalização semântico-fonética para fala

Identidade normativa: `resource.spoken-normalization`; recurso; tipo: folha. Ler ao preparar representação falada, normalizar TTS, pronúncia, notas ou delimitadores editoriais. Não carregar para revisão exclusivamente redacional. Depende de `../core/authority.md`, `MN-PRES`, `MN-DISC`, do RCF aplicável e de `./editorial-authoring.md` somente quando a própria tarefa também transformar o texto autoral.

## 1. Pipeline e acessibilidade

O fluxo é `original → detecção/classificação contextual → representação própria para fala → adaptador TTS`. A normalização pt-BR DEVE ser contextual quando ambígua, determinística quando possível, extensível, testável e desacoplada do sintetizador; regex pode detectar candidato e NÃO DEVE substituir a classificação requerida.

HTML semântico, ordem de leitura e árvore de acessibilidade DEVEM permanecer completos sem JavaScript, voz ou serviço externo. TTS é opcional/progressivo; semântica nativa precede ARIA. Modos `continuous`, `summary` e `full`, quando definidos pelo adaptador, preservam ocorrência visual, regras de expansão, posição e unidade durante a troca.

## 2. Classificação linguística

`vs`, `vs.`, variações de caixa e `x`/`X` só PODEM virar `versus` em confronto/comparação; multiplicação, dimensão, variável, identificador e símbolo técnico permanecem. Romano exige validação formal e contexto para cardinal/ordinal em século, capítulo, volume, enumeração, soberano ou título; sequência de `I,V,X,L,C,D,M` não é convertida cegamente.

Aspas citacionais, `blockquote`, parênteses e colchetes são mecanismos distintos: nenhum PODE acionar, substituir, fechar ou rebatizar outro. Citação realmente delimitada por aspas verbaliza `abre aspas ... fecha aspas`; realce, ironia, sarcasmo e uso não citacional não. Parênteses/colchetes pertinentes verbalizam o próprio par e preservam tipo, ordem e aninhamento. Código, URL, sintaxe, metadado, fórmula ou estrutura não editorial mantém sua semântica; par incompleto, cruzado ou indeterminado preserva conteúdo, diagnostica e exige revisão.

Nota, `<sup>` ou equivalente pronunciado NUNCA DEVE anunciar apenas número/glifo: usa marcador humano; chamadas adjacentes formam conjunto natural sem alterar ordem/identificadores nem confundir modos de referência. Referência bíblica DEVE ser classificada antes e NUNCA lida como horário; livro numerado, capítulo, versículo, intervalo, abreviação e versão seguem sintaxe autenticada, enquanto horário real permanece horário. Exemplo herdado é revalidado e não vira hardcode.

Idioma/BCP 47, voz ausente, forma falada local revisada, tabela, imagem, gráfico, citação, referência, navegação, aviso, sumário, pausa e controles DEVEM preservar o contrato aplicável. Pronúncia especial exige fonte confiável/revisão identificada; IPA pode ser evidência e NÃO DEVE ser fala crua.

## 3. Contrato e aceite

A capacidade DEVE declarar identidade, entrada/saída, versão, idempotência, efeitos, diagnóstico, limites/timeout, validação e hook futuro, mas operar sem hook. Validação percorre `original → normalização → payload efetivo → pronúncia esperada`; regex/texto intermediário isolado não basta. Testes positivos, negativos, aninhados, cruzados e regressivos cobrem todos os mecanismos e exclusões; amostra auditiva registra ferramenta, versão, voz/idioma, entrada, sequência, resultado e limite, sem substituir escuta humana.
