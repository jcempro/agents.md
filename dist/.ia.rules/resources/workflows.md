# Contrato de workflows distribuíveis

Identidade normativa: `resource.workflows`; contrato de recurso; tipo: folha. Ler antes de criar, distribuir, instalar, atualizar, acionar ou validar workflow para consumidor. Depende de `../core/authority.md`, `../core/contracts.md`, `./scripts.md` e do papel Construtor.

## 1. Autoridade e separação

Workflow destinado ao consumidor reside sob `.ia.rules/` na fonte/release e é distinto de workflow interno do construtor. O arquivo instalado em `.github/workflows/` é projeção gerenciada; sua origem, destino e integridade constam do manifesto. Repositório Final NÃO DEVE criar concorrente, trocar gatilho, publicar localmente, exigir acesso adicional, duplicar script ou contornar hook quando a finalidade já possuir workflow distribuído.

Workflow interno NÃO integra payload. Workflow distribuível, auxiliar, hook e adaptador aplicam Mecanismo Oficial, `CT-5` a `CT-8` e o mesmo contrato local/CI do script acionado. YAML orquestra; regra material reside em script reutilizável.

## 2. Manifesto

Índice humano/máquina de workflows é manifesto manual versionado com `generated=false`. Cada entrada declara:

- `id`, `version`, `purpose`, `scope` e `ownership`;
- `source`, `destination`, `sha256` quando materializado e `required`;
- `roles`, `triggers`, `concurrency`, `permissions` e `secrets`;
- `dependencies`, `runtime`, `script`, `hook`, `adapter` e `configuration`;
- `install`, `update`, `preserve`, `remove`, `rollback` e `validation`.

Permissão é mínima e justificada por efeito. Segredo é nome/referência, nunca valor. Gatilho, branch, path filter, concorrência e ambiente são explícitos; `workflow_dispatch` adicional não substitui gatilho oficial. Mudança incompatível exige nova versão e migração.

## 3. Instalação, acionamento e atualização

Instalação valida estrutura, destino seguro, Gitignore, colisão, customização, versão e integridade; simula, prepara tudo, grava atomicamente e reverte em falha. Repetição é idempotente. Customização legítima só existe em região/campo declarado e recebe merge semântico; divergência fora dela é preservada em backup e convergida pelo mecanismo oficial.

Hook oficial aciona workflow por arquivo-gatilho, evento ou adaptador declarado. Adaptador preserva entrada, autorização, commit/ref, saída, código e diagnóstico. Execução direta só ocorre quando o contrato a declarar; não reduz obrigatoriedade do workflow nem duplica lógica.

Atualização compara manifesto recebido/local, origem instalada, versão e hash; preserva campo autorizado e substitui gerenciado divergente após backup. Parcial, revisão obsoleta, concorrência, push divergente ou permissão insuficiente bloqueiam conclusão e deixam estado íntegro/retomável.

## 4. Segurança e aceite

Workflow usa ações fixadas por versão/commit conforme política, permissões mínimas, entradas limitadas, saída sanitizada, segredo mascarado, artifact elegível e rede somente necessária. Conteúdo privado não sai do repositório sem RCF/configuração explícitos.

Workflow criado, gerado, instalado, atualizado ou mantido em Repositório Final que execute Node.js, npm, npx, JavaScript ou TypeScript DEVE declarar e materializar Node.js 24 ou superior antes da primeira invocação. Manifesto, índice e matriz aplicáveis registram o piso; versão ausente, dinâmica abaixo de 24 ou regressão falham. Workflow sem execução Node NÃO DEVE instalar runtime inútil; runtime interno de action de terceiro, regido pela referência fixada, não satisfaz nem viola por si só o piso.

Validação comprova manifesto, distinção interno/distribuível, YAML válido, dependências, permissões, gatilho, filtro, concorrência, instalação, atualização, acionamento, equivalência local/CI, Node.js 24+ quando aplicável, rollback, integridade e ausência de fluxo concorrente.
