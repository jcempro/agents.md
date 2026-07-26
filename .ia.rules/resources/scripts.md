# Contrato de scripts, runtimes e distribuição multilíngue

Identidade normativa: `resource.scripts`; contrato de recurso; tipo: folha. Ler antes de criar, alterar, invocar, empacotar, distribuir ou atualizar script. Depende de `../core/authority.md`, `../core/contracts.md`, `../meta/cli.md`, `MN-CLI`, `MN-OUT` e do papel ativo.

## 1. Assinatura e interface

Todo script distribuível aplica `CT-5` e declara nome canônico, finalidade, sintaxe, parâmetros em ordem, tipos, defaults, configuração, pré/pós-condições, entradas/saídas, estados, efeitos, idempotência, destrutividade, timeouts, retries, concorrência, limites, eventos, callbacks, hooks, fallbacks, local/CI, plataformas, runtimes, logs, ajuda e códigos:

| Código | Significado canônico |
|---:|---|
| `0` | finalidade concluída e pós-condições válidas |
| `1` | falha operacional conclusiva |
| `2` | uso, parâmetro, entrada ou configuração inválida |
| `3` | pré-condição, conflito ou estado que exige ação externa |
| `4` | saída/contrato de IA, integridade ou segurança inválida |
| `130` | interrupção/cancelamento confirmado |

Entrada estruturada declara schema/versão e limites antes de leitura. Saída humana é curta e distingue progresso, informação, aviso, erro, resultado e ação. Saída de máquina é determinística, estruturada e persistente com contrato, correlação, etapa, operação sanitizada, horários, duração, resultado, código, erros, tentativas, fallbacks, artefatos e estado final. Ausência de saída NÃO significa sucesso.

## 2. Configuração, hooks e integração

Configuração repetida — valor, path, padrão, limite, nome e string — possui SSOT versionada sob `.ia.rules/config/`; precedência segue `MN-CLI`. Script não infere raiz-fonte, target, workflow, branch, runtime ou ativo da aplicação. Path resolve a partir da raiz declarada, nunca de cwd implícito.

Hook aplica `CT-6`, é descoberto somente no namespace/configuração oficial, recebe contexto validado, propaga argumentos/saída/código e não duplica lógica material. Fases canônicas são `pre`, `main`, `post`, `validate` e `rollback`; recurso PODE restringir o conjunto, não renomeá-lo. `post` só executa após `main` válido; falha de `post` invalida conclusão quando sua pós-condição for obrigatória. `rollback` é idempotente, limitado ao efeito da correlação e não mascara a causa original.

Callback é função de observação/decisão local declarada, sem autoridade para trocar contrato ou destino. Adaptador traduz ambiente/interface, preserva semântica e diagnóstico e não reimplementa finalidade. Fallback é rota oficial finita, ordenada, acionada somente por classe de falha declarada e registrada no resultado.

## 3. Resiliência e plataformas

Aplicar `CT-8`. Diferença de SO, shell, permissão, filesystem, separador, caixa, encoding, EOL, runtime, dependência, Git, rede ou release DEVE ser detectada. Comparação textual normativa normaliza UTF-8 e EOL somente quando contrato declarar equivalência; manifesto/hash binário permanece byte a byte. Comando indisponível aciona equivalente oficial seguro quando existente.

Operação longa desacoplada declara cwd, comando/argumentos sanitizados, PID/ID, início/fim/duração, código, log, estado, cancelamento, limpeza e retomada. Estados são os de `CT-6`; retomada lê estado, código e cauda antes do log integral e não repete conclusão. Processo que exige decisão intermediária, deixa lock abandonável ou torna polling mais caro que espera permanece acoplado.

## 4. Fontes e artefatos

Script Node.js tem TypeScript como fonte canônica; JavaScript manual em fonte é legado a converter. Fonte transpila para Node.js `24+`, com alvo ECMAScript estabilizado aproximadamente um ano antes da versão corrente e baseline revisado por necessidade/benefício. JavaScript distribuído é transpilado, validado, otimizado e minificado sem perda de contrato, interoperabilidade ou diagnóstico indispensável.

Release distribui TypeScript e JavaScript correspondentes com identidade, versão, finalidade e caminho lógico inequívocos. Matriz global e por recurso declara versões mínima, recomendada e máxima/faixa suportada; linguagem, runtime, compilador, transpilador, gerenciador, dependências, alvo, módulo, plataformas, shells e ambientes testados. Build é reproduzível e consumidor não é obrigado a reconstruir artefato pronto.

TypeScript obrigatório limita-se a Node.js. Python, Ruby, shell e outras linguagens são admitidas por ecossistema real; conversão artificial que reduza integração, compatibilidade, simplicidade ou confiabilidade é proibida. Recurso específico permanece no cenário; comum só é promovido após reutilização real ou ganho verificável.

## 5. Atualização e aceite

Antes de instalar/atualizar, detectar runtime, versão, plataforma, arquitetura, ferramenta, estrutura, customização e artefato. Metadados selecionam alternativa compatível mais estável e menos invasiva. Atualizador não instala runtime global, altera `PATH`, troca gerenciador, remove dependência ou reconfigura sistema sem norma, necessidade e autorização.

Incompatibilidade isolada usa artefato alternativo, atualização autorizada, versão funcional, desabilitação apenas do recurso ou falha local conclusiva. Aplicação usa temporário, backup, validação pré/pós e rollback. Aceite cobre assinatura, ajuda, códigos, schemas, hooks, fallbacks, estados, interrupção, equivalência fonte/artefato, linguagens, matriz, atualização seletiva, cross-platform, segurança, reprodutibilidade e ausência de parcial.
