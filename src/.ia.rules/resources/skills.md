# Contrato de Skills

Identidade normativa: `resource.skills`; recurso; tipo: folha. Ler ao avaliar, criar, descobrir, carregar, validar, instalar, atualizar ou remover Skill. Depende de `../core/contracts.md` CT-10–CT-12, `../core/routing.md`, `MN-UNIT`, `MN-DISC`, `MN-EVID`, `MN-TRUST` e do RCF aplicável.

## 1. Elegibilidade e descoberta

Skill é procedimento recorrente, conhecido e estreito que demonstra ganho líquido sobre Agent primário, Cenário ou Script isolados. NÃO DEVE ser criada por equivalência nominal, por script existente, por semelhança tangencial, para duplicar autoridade ou para especializar um produto no núcleo generalista. Script mecânico permanece Script; Cenário amplo permanece Cenário.

Skill distribuível reside em raiz canônica declarada e contém `SKILL.md` com frontmatter compatível: `name`, `description` e somente metadados opcionais suportados pelo cliente comprovado. Nome e descrição DEVEM permitir gatilhos positivos, negativos e limítrofes; descoberta inicial carrega apenas esses metadados e o path. Corpo entra após ativação material e `scripts/`, `references/` e `assets/` entram individualmente quando condição explícita exigir, sempre a no máximo uma camada da raiz.

## 2. Contrato e recursos

Descritor extraído aplica `../core/formats/skill-descriptor.v1.schema.json` e declara finalidade, papéis, autoridade, entradas/saída, dependências, recursos, scripts, hooks, permissões, efeitos, limites, validação, origem, licença, confiança, versão, destinos/clientes, precedência, merge, atualização e remoção. Instrução DEVE ser completa, enxuta e portátil; referência quebrada, ciclo, cadeia profunda, recurso não declarado ou metadata incompatível bloqueia ativação.

Script associado executa apenas algoritmo determinístico e mantém contrato próprio. Asset ou referência não amplia autoridade. Hook é opcional conforme CT-12. Indisponibilidade de cliente, recurso ou pacote adicional degrada somente a capacidade opcional e DEVE ser relatada, nunca simulada.

## 3. Validação e segurança

Validação oficial do ecossistema ou equivalente bit a bit é gate. Testes DEVEM cobrir descoberta, ativação, não ativação, caso limítrofe, recursos sob demanda, uma camada, ausência de hook, path/caixa, schema, cliente suportado, origem/licença/integridade, prompt injection e privilégio mínimo. Comparação usa `MN-EVID`; ganho não comprovado mantém o mecanismo vigente.
