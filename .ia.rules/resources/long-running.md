# Execução longa e economia do Agent primário

Identidade normativa: `resource.long-running`; recurso; tipo: folha. Ler diante de comando longo, timeout, espera, polling, cancelamento, retomada, processo órfão ou delegação de monitoração. Depende de `../core/contracts.md` CT-8 e CT-12, `./scripts.md`, `./subagents.md`, `MN-DEF`, `MN-EVID` e do RCF aplicável.

## 1. Evidência temporal

Cada execução medida DEVE registrar início, término, duração, código, timeout, comando/entrada sanitizados, hash/versão do projeto, runtime, ambiente e máquina somente na medida relevante. Perfil por comando e ambiente conserva amostra, percentis, margem e mudança material; timeout deriva dessa evidência. Timeout NÃO DEVE ser classificado como falha funcional sem inspeção do processo, estado e artefato.

Identidade ambiental usa identificador estável e não secreto obtido por API suportada, SO/kernel/build, arquitetura, runtime/toolchain, virtualização/container e hardware somente quando relevantes. Nome livre de host, segredo, serial sensível ou dado pessoal desnecessário são proibidos. Evidência liga comando, projeto/hash, data, código/erro, condição, hipótese e próxima retentativa.

## 2. Espera, retomada e delegação

Operação longa DEVE preferir espera/evento do executor. Sem suporte, polling começa no intervalo derivado do histórico e usa backoff limitado, mantendo atualização ao usuário e detecção terminal. Polling curto/fixo, espera duplicada e releitura integral repetida são proibidos. Retomada lê estado, código e cauda antes do log integral, não repete conclusão e trata cancelamento, lock, limpeza e órfão.

Subagent de espera/validação longa só PODE entrar com isolamento real, trabalho útil paralelo e retorno compacto que reduzam custo do primário. Ação mecânica permanece Script hookable; Skill interpreta somente procedimento leve. Reprodução equivalente em dois ambientes independentes interrompe novas trocas de máquina até mudança material; mudança relevante reabre teste sem apagar histórico.

## 3. Aceite

Validar sucesso, falha, timeout, cancelamento, retomada, órfão, lock, limpeza, ausência de polling excessivo, classificação correta e retorno compacto. Generalização de duração ou falha exige amostra, contraexemplos e limite de aplicabilidade.
