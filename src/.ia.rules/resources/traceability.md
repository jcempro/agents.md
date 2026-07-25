# Documentação nativa e rastreabilidade material

Identidade normativa: `resource.traceability`; contrato de recurso; tipo: folha. Ler ao criar/alterar unidade técnica, RCF implementável, commit material ou sincronização RCF↔artefato. Depende de `../core/authority.md`, `../core/contracts.md` e `MN-VAL`.

## 1. Documentação de unidade

Classe, função, procedure, type, interface ou equivalente possui, quando suportado, cabeçalho nativo da linguagem somente na fonte. O mínimo útil declara responsabilidade, comportamento, contexto/momento, justificativa técnica, restrição e reutilização. Repetição do nome ou descrição óbvia derivável do código é proibida. Artefato compilado/minificado exclui essa documentação, preservando somente banner global obrigatório.

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
