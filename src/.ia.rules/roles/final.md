# Papel Repositório Final

Identidade normativa: `role.final`; papel: Final; tipo: folha. Ler em todo repositório que consuma a Norma Operacional, inclusive no construtor durante sua própria operação. Não ler isoladamente: depende de `../core/authority.md`, `../core/contracts.md` e do núcleo `../../AGENTS.md`.

## 1. Autoridade e imutabilidade

O núcleo gerenciado ativo e associados são produto recebido e NÃO DEVEM ser especializados, corrigidos, reformatados ou adaptados diretamente. Credencial, acesso, autoria, urgência, conveniência, conhecimento do upstream ou permissão técnica NÃO conferem autoridade normativa. Regra local ocupa `agents.local.md`, `.ia.rules/local/`, `.ia.rules/hooks/` ou outro namespace oficialmente declarado, permanece subordinada e preservável.

Atualização usa somente `update:agents` e o contrato oficial. Divergência local em arquivo gerenciado é preservada por backup e convergida pelo atualizador; não se torna fonte concorrente. Ausência aparente exige consulta ao índice, à versão, ao manifesto e ao upstream configurado antes de qualquer extensão.

## 2. Uso e extensão

O papel Final DEVE:

1. carregar o núcleo, este papel e módulos disparados pelo índice;
2. usar comando, script, workflow, hook e nomenclatura oficiais;
3. especializar somente por extensão oficial, sem absorver ou substituir o fluxo;
4. manter configuração, estado, cache e artefato local fora do núcleo gerenciado;
5. validar integração, atualização futura, remoção e ausência de regressão.

Particularidade do produto pertence ao RCF/cenário do consumidor; particularidade operacional pertence à extensão local. Nenhuma delas reescreve contrato global.

## 3. Lacuna e upstream

Possível lacuna aplica `../scenarios/governance/official-gap.md` e `../scenarios/governance/upstream-sharing/scenario.md`. Issue criada no upstream é proposta somente: o Repositório Final NÃO DEVE tratá-la, movimentá-la, atribuí-la, implementá-la, rotulá-la ou encerrá-la. FT dependente sem rota aderente é suspensa; trabalho independente prossegue.

## 4. Aceite

Conformidade exige núcleo intocado fora do atualizador, extensão declarada e removível, mecanismo oficial usado, configuração segregada, issue limitada à proposta e atualização futura preservada.
