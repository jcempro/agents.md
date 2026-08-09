# Documentação nativa e rastreabilidade material

Identidade normativa: `resource.traceability`; contrato de recurso; tipo: folha. Ler ao criar/alterar unidade técnica, RCF implementável, commit material ou sincronização RCF↔artefato. Depende de `../core/authority.md`, `../core/contracts.md` e `MN-VAL`.

## 1. Comentários cumulativos

Três categorias são independentes e cumulativas: cabeçalho de arquivo, documentação de declaração e comentário interno de lógica. Concisão, otimização, geração, transpilação ou política contra excesso NÃO dispensam obrigação aplicável nem permitem substituição entre categorias.

Cabeçalho de arquivo é obrigatório em fonte humana editável e produto final comentável. Declara, com dados existentes e configuração canônica, licença/link/resumo, autoria/contato, upstream/origem e RCF aplicável; dado ausente não é inferido. Build preserva ou injeta o banner mínimo em derivado comentável.

Classe, função, método, procedure, interface, tipo personalizado ou equivalente em fonte humana editável possui documentação imediatamente associada à declaração/assinatura, na sintaxe nativa adequada. Conforme aplicabilidade material, o mínimo útil declara finalidade/contrato, parâmetros, retorno, efeitos, exceções, restrições, condições, contexto/momento, justificativa e reutilização. Repetição do identificador ou descrição óbvia derivável do código é proibida. Exceção limita-se a construção inequivocamente trivial por critério objetivo do RCF do projeto, verificável sem julgamento subjetivo.

Comentário interno é seletivo, conciso e suficiente para explicar lógica não óbvia, intenção, ordem necessária, proteção, prevenção de falha, decisão arquitetural ou razão. Fluxo de aproximadamente 25 linhas ou mais recebe orientação quando não for inequivocamente compreensível; prolixidade e ausência quase total diante de complexidade são não conformes. `FIX`, `BUG`, `PROTEÇÃO` ou equivalente só identifica semântica verdadeira; prevenção relevante é justificada mesmo sem bug anterior.

Fonte humana editável acumula as três categorias aplicáveis. Derivado, gerado, compilado, empacotado, otimizado ou minificado PODE remover documentação de declaração e comentário interno, preservando o banner quando suportado, e NÃO comprova conformidade da fonte. Ao tocar código desconforme, a IA corrige as declarações, blocos e trechos alterados, sem revisão global alheia e sem manter violação local.

Validação proporcional detecta fonte humana elegível sem cabeçalho ou documentação obrigatória e inspeciona comentários onde houver complexidade objetiva. Derivado, gerado, linguagem/formato sem comentários e exceção trivial formalmente declarada não recebem falso positivo; exceção implícita ou baseada apenas em nome curto é inválida.

## 2. Assinatura material

Cada sentença, item ou parágrafo de RCF que defina unidade implementável termina na mesma linha com `[xxxxxxx]`, hash abreviado causal do commit material. Antes da implementação usa marcador explícito de pendência definido pelo gerador, nunca hash inventado. Alteração puramente normativa preserva hash material anterior; no construtor, commit da fonte normativa é causal quando o produto implementado é a própria Norma.

Mapa sentença↔artefato declara RCF/path/âncora, identidade estável da sentença, artefatos, FT, estado `pending|materialized|synchronized`, commit material e commit de sincronização. Hash integral é validado no Git; sete caracteres são projeção humana. Ambiguidade, commit inexistente, referência obsoleta ou artefato não relacionado falha.

## 3. Fluxo sem autorreferência

Ordem obrigatória:

1. criar commit material sem inventar o próprio hash;
2. hook/script calcula diferenças e atualiza somente sentenças RCF causalmente afetadas;
3. criar commit exclusivo de sincronização;
4. validar round trip sentença→commit→artefato e pull/branch antes de prosseguir.

Commit de sincronização possui marcador de finalidade e não aciona nova sincronização sem mudança material posterior. Concorrência, revisão obsoleta, história reescrita ou alteração simultânea do RCF bloqueiam atualização automática. Nenhum workflow sobrescreve trabalho recente para completar assinatura.

## 4. Aceite

Validar formato, existência, causalidade, artefato, FT, estado, preservação de hash quando código não mudou, pendência sem hash falso, ausência de autorreferência/recursão e round trip bidirecional.
