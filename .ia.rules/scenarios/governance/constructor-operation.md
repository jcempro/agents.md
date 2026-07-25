# Cenário técnico de operação do Construtor

Identidade normativa: `scenario.constructor-operation`; cenário técnico; tipo: folha. Aplicar cumulativamente com `role.constructor` quando o repositório mantiver, construir, validar, empacotar, atualizar, distribuir ou publicar a Norma Operacional. Depende de `../../core/authority.md`, `../../core/contracts.md`, `../../meta/build.md` e do RCF do produto.

## 1. Dois eixos independentes

Papel determina quando uma regra ou mecanismo é carregado; perfil de distribuição determina se e para onde sua fonte é publicada. Recurso aplicável somente ao Construtor NÃO é automaticamente interno: norma, cenário, contrato, workflow ou runtime reutilizável por qualquer repositório que exerça esse papel integra `consumer-scenario`. `builder-internal` designa exclusivamente conteúdo necessário ao desenvolvimento deste construtor canônico, sem efeito operacional ou contratual no consumidor.

`AGENTS.md` permanece norma global comum aos papéis Final e Construtor. Especialização técnica é roteada por este cenário e pelo papel, sem retirar do arquivo global os invariantes necessários à interpretação de ambos.

## 2. Fonte e localização

`src/` contém exclusivamente entradas declaradas que produzam efeito direto no artefato distribuído. Cada arquivo DEVE possuir identidade, finalidade, perfil positivo, destino, propriedade, condição e validação. Existência, extensão, posição histórica ou uso local não constituem elegibilidade.

Estudo, avaliação, experimento, protótipo, histórico, decisão temporária, documentação de apoio e configuração exclusiva do construtor ficam fora de `src/`, preferencialmente sob `./constructor/` quando formarem coleção própria. A raiz PODE abrigar outros namespaces internos coerentes e convenções transversais, preservadas as autoridades especiais de `/AGENTS.md` e `/.ia.rules/`. Excluir do release sem reavaliar localização física é não conforme.

## 3. Perfis positivos

- `consumer-core`: norma e contrato comuns indispensáveis;
- `consumer-runtime`: runtime reutilizável necessário no destino;
- `consumer-scenario`: papel, cenário, capacidade, workflow ou adaptação reutilizável carregada sob condição;
- `consumer-bootstrap`: entrada inicial explicitamente autorizada;
- `generated-release`: artefato materializado exclusivamente pelo pipeline;
- `builder-internal`: classificação negativa, proibida em `src/`, dist, package, ZIP, release, update e publish.

Um arquivo PODE possuir mais de um perfil positivo somente quando cada efeito e destino forem materialmente comprovados. Condição de carga NÃO substitui perfil; perfil NÃO substitui condição. Manifesto manual é autoridade positiva e aplica `CT-7` e `CT-9`.

## 4. Build, release e atualização

Build, dist, package, archive, release, publish e update DEVEM consumir a mesma seleção positiva ou projeções derivadas verificavelmente equivalentes. Varredura por extensão, cópia recursiva de `src/`, exclusão por denylist ou filtragem posterior NÃO constituem seleção. Entrada não declarada em `src/`, perfil desconhecido, destino inseguro, referência quebrada, arquivo ausente, excedente ou `builder-internal` no payload bloqueiam antes da publicação.

O pipeline DEVE preservar contratos públicos, caminhos destinados ao consumidor, hooks, assinaturas e compatibilidade. Remoção é limitada ao conteúdo comprovadamente indevido; mudança adicional exige FT proprietária. Configuração física exclusiva deste construtor não é fonte do consumidor; projeção mínima só é gerada quando contrato público demonstrar necessidade.

## 5. Reclassificação e validação

Classificação examina finalidade, consumidor, efeito no artefato, perfil, destino e referências. Arquivo inadequado ao release tem localização arquitetural reavaliada e todas as referências atualizadas. Movimento DEVE ser atômico, rastreável e preservador; histórico não autoriza manter path incorreto.

Validação comprova inventário exaustivo de `src/`, manifestação positiva, ausência de internos, igualdade entre seleção e payload, integridade de referências, scripts, workflows, índices e documentação, além de package/ZIP/update reais. Cenário Construtor distribuído condicionalmente DEVE permanecer íntegro; material exclusivo deste construtor NÃO DEVE ser publicado.
