# Contrato de Subagents

Identidade normativa: `resource.subagents`; recurso; tipo: folha. Ler ao avaliar, delegar, criar, validar, instalar, atualizar, cancelar ou encerrar Subagent. Depende de `../core/contracts.md` CT-10–CT-12, `../core/routing.md`, `MN-UNIT`, `MN-DISC`, `MN-EVID`, `MN-TRUST` e do RCF aplicável.

## 1. Elegibilidade e autoridade

Subagent recebe objetivo independente, isolável e verificável somente quando paralelismo ou isolamento demonstrar ganho líquido. Trabalho pequeno, sequencial, fortemente acoplado, dependente de decisão intermediária, portador de lock abandonável ou com coordenação mais cara permanece no Agent primário. Delegação NÃO amplia autoridade, escrita, rede, ferramentas, dados, orçamento, repositório ou duração.

O primário conserva percepção global, síntese, decisões sensíveis e resposta ao usuário. Subagent NÃO DEVE duplicar monitoração, competir pela mesma mutação, persistir após a finalidade, criar nova delegação sem contrato ou alegar conclusão global. Concorrência exige destinos independentes ou coordenação explícita e determinística.

## 2. Descritor e ciclo de vida

Descritor aplica `../core/formats/subagent-descriptor.v1.schema.json` e DEVE declarar objetivo, gatilhos positivos/negativos, ferramentas, permissões, leitura, escrita, autoridade, entradas, saída compacta, orçamento, duração/timeout, cancelamento, retorno ao primário, dependências, concorrência, condições de parada, estado, efeitos, validação, origem, licença, confiança, versão, cliente/destino, precedência, atualização e remoção.

Descoberta carrega somente identidade, descrição/gatilhos e path; corpo entra após ativação. Estados aplicam CT-6. Cancelamento, timeout, erro ou término DEVEM liberar recurso próprio, devolver estado/evidência compactos e impedir continuação órfã; falha não é sucesso parcial. Capacidade essencial permanece funcional sem Subagent.

## 3. Aceite

Testes cobrem seleção positiva/negativa/limítrofe, escopo, privilégio, orçamento, timeout, cancelamento, retorno, parada, concorrência, ausência de duplicação e operação sem hook. Comparação usa `MN-EVID` contra primário, Script e Cenário; ausência de ganho mantém execução centralizada.
