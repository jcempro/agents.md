# Papel Repositório Construtor

Identidade normativa: `role.constructor`; papel: Construtor; tipo: folha. Ler somente ao manter `src/`, construir, validar, empacotar, atualizar, distribuir ou publicar a Norma Operacional. É cumulativo com `./final.md` e depende de `../core/authority.md`, `../core/contracts.md` e do RCF do produto.

## 1. Autoridades segregadas

`src/` é fonte canônica do produto; artefato construído é derivado; o `AGENTS.md` ativo rege a execução atual. Editar fonte NÃO altera a norma ativa, e editar artefato NÃO altera fonte. Exceção cíclica do núcleo ativo exige solicitação humana explícita, registro técnico, correção autoritativa simultânea em `src/`, regeneração, validação e encerramento da exceção.

Núcleo contém somente autoridade, precedência, domínios, invariantes, contratos transversais, roteamento e referências indispensáveis. Papel, cenário e recurso coesos ficam em módulos quando sua dispensa reduz Custo Líquido; divisão sem fronteira semântica ou ganho verificável é proibida.

## 2. Fases e autorização

Solicitação comportamental do construtor segue, em FTs e estados distintos:

1. RCF;
2. Norma Operacional em `src/`;
3. código, scripts, hooks, workflows e geradores;
4. validação e integração.

Criação/conciliação de FTs forma commit anterior à norma. Conclusão de uma fase NÃO autoriza a seguinte. Após cada fase normativa validada e commitada, a execução DEVE interromper, informar pendências e aguardar autorização humana explícita.

## 3. Fonte, recursos e distribuição

Regra exclusiva de geração, compilação, validação, empacotamento, versão, release, atualização, distribuição ou estrutura-fonte pertence a este papel. Scripts Node.js têm TypeScript como fonte canônica e JavaScript como artefato transpilado conforme `../resources/scripts.md`; demais linguagens permanecem permitidas por contexto real. Workflows distribuíveis seguem `../resources/workflows.md`; atualização segue `../core/update/scenario.md`.

Release DEVE ser reproduzível, declarar matriz de runtimes/toolchain, manter equivalência fonte→artefato, distinguir conteúdo interno/distribuível, publicar somente allowlist manifestada e bloquear divergência, parcial ou derivado obsoleto. Nenhum contrato normativo autoriza implementar recurso antes da FT e autorização correspondentes.

## 4. Aceite

Conformidade exige autoridade segregada, fases respeitadas, índice coerente, módulos sem duplicação, recursos com contrato completo, artefatos derivados rastreáveis, consumidor preservado e validação equivalente local/CI.
