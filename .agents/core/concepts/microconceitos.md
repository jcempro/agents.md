# Núcleo — Microconceitos normativos

Extensão direta de `./AGENTS.md` §2. Identificadores são estáveis; citação incorpora integralmente somente a seção identificada e suas dependências explícitas, conforme `MN-REF`. Proximidade no arquivo NÃO autoriza carregar outro conceito.

## MN-2119 — modalidade exclusiva

Norma usa somente: **DEVE**, **NÃO DEVE**, **DEVERIA**, **NÃO DEVERIA**, **PODE**, **RECOMENDA-SE** e **OPCIONAL**. Flexão plural é admitida. Texto sem esses termos é descritivo, salvo contrato literal. Modalidade, condição, exceção, autoridade e efeito NÃO DEVEM ser inferidos.

## MN-DENS — densidade sem perda

Maximizar informação por caractere, coesão, reutilização e referências; remover somente forma redundante. Concisão NÃO DEVE remover regra, restrição, exceção, prioridade, dependência, valor, exemplo delimitador, contexto, rastreabilidade ou nuance. Microconceito substitui repetição somente quando conservar integralmente escopo e força.

## MN-PRES — preservação e ambiguidade

Alteração DEVE preservar autoria manual, contratos, compatibilidade, comportamento, comentários corretos e correções defensivas. Dúvida exige a menor alteração compatível; conflito insolúvel exige `AMBIGUIDADE INSOLUVEL: <ponto>. Preservando original.`. Regressão exige solicitação humana explícita e confirmação.

## MN-ROLE — identidade e autoridade

Repositório de execução é somente o aberto fisicamente; função de construtor, consumidor, upstream ou dupla função exige evidência autoritativa. Apenas `./AGENTS.md` é norma raiz; homônimo sob fonte/artefato só assume função explicitamente declarada. Construtor mantém fonte distribuível sem ela reger/sincronizar sua raiz; consumidor obedece à cópia materializada. Upstreams do consumidor, de AGENTS.md e de dependência são distintos; upstream de AGENTS.md resolve por configuração explícita → metadado oficial → origem declarada → sucessor → destino canônico validado → candidato configurado. Candidato, fork, mirror, homônimo ou proximidade NÃO provam autoridade.

## MN-EXT — núcleo gerenciado e extensão local

Consumidor NÃO DEVE especializar núcleo gerenciado por edição, cópia oficial simulada, patch oculto ou reescrita pós-sincronização. Especialização usa somente `agents.local.md`, `./.agents/local/`, `./.agents/hooks/` ou adaptador declarado: é subordinada, carregada quando aplicável e excluída de descoberta, lock, remoção e sobrescrita. Colisão não gerenciada, autoria ambígua ou customização detectada DEVE abortar. `--force` só repõe gerenciado por origem validada com backup; não converte customização em regra. RCF que declare repositório construtor PODE autorizar edição da fonte distribuível, distinta da governança ativa. Terceiro importado só PODE ser processado após incorporação definitiva.

## MN-IA-OPT — custo simultâneo

Toda atuação da IA DEVE minimizar simultaneamente tokens lidos, tokens emitidos, custo computacional e tempo de processamento, sem reduzir precisão, contexto, rastreabilidade, aderência ao RCF, validação ou qualidade. Cache válido, leitura seletiva, composição e saída orientada à decisão são obrigatórios quando reduzem custo líquido.

## MN-PREP — preparo de entrada

Entrada bruta acima de 50 linhas, 8192 bytes ou 2 arquivos DEVE passar por preparo automatizado quando existir parser/comando determinístico que preserve toda informação exigida; ausência ou perda material DEVE ser registrada e exige leitura integral. O preparo DEVE condensar estrutura/redundância, preservar informação útil, erro, aviso, diagnóstico e autocorreção. Biblioteca só PODE entrar com licença compatível, manutenção verificável e redução mensurada do custo total.

## MN-OUT — envelope de saída

`to-ia`/`agent:filter` é a interface única de saída para IA. DEVE normalizar UTF-8/LF, remover ANSI e controles, deduplicar consecutivos, classificar, ordenar, limitar e persistir integral excedente sem inferência semântica ou LLM. Formato: JSON Lines UTF-8 sem vazio; primeiro registro `{v,command,status,exit,totalLines,totalBytes,shown,truncated,artifact,sha256}`; demais registros `{level,code,message}` e, quando aplicável, `{path,line,value}`. Ordem: `fatal,error,warning,change,result,metric,info`; `debug` é persistido, nunca exibido. Limites: 50 linhas e 8192 bytes; prevalece o primeiro. Excedente DEVE ser salvo em `.agents/cache/outputs/<YYYYMMDD.HHMM.SS>-<comando>-<sha256-12>.log`, sem versionamento, com hash no envelope. Falha do filtro DEVE bloquear exposição, retornar `4`, persistir bruto e emitir somente `FILTER_FAILURE`.

## MN-CMD — encapsulamento de comando

Comando de terminal, shell, CLI, subprocesso ou fallback que possa emitir saída extensa DEVE executar por `to-ia`; execução direta é vedada. Encapsulador DEVE abstrair SO, shell, ferramenta, linguagem e formato quando houver runtime compatível declarado; aceitar entradas compatíveis, normalizar saída e centralizar lógica. Restrição obrigatória do ecossistema DEVE registrar a dispensa. Novo comando sem encapsulamento DEVE recebê-lo antes do uso.

## MN-API — contrato operacional

API `agent:*` DEVE ser local, determinística, não interativa, reutilizável e versionada. Cada comando DEVE declarar finalidade, sintaxe, entradas/tipos, defaults, limites, timeout, retry, lotes, paginação, concorrência, pré/pós-condições, dependências, efeitos, idempotência, destrutividade/confirmação, schema/filtro, persistência, códigos, falhas e fallback. Lacuna retorna `PARAMETRO_NORMATIVO_AUSENTE:<nome>` e código `4`. Status: `available` integral; `degraded` seguro com perda restrita a saída opcional não usada por pós-condição da tarefa; `n/a` dispensado por autoridade; `noncompliant` ausente, inseguro ou sem contrato/filtro. IA DEVE usar `available`; PODE usar `degraded` só sob essa restrição; NÃO DEVE usar `noncompliant`.

## MN-DEF — defaults operacionais

Na ausência de regra mais específica: timeout local 30 s, rede 120 s, operação pesada 900 s; retry idempotente transitório 2 vezes com 1 s/3 s, demais 0; concorrência 1 para mutação e até 4 para leituras declaradas paralelizáveis; códigos 0/1/2/3/4/130 = sucesso/falha/entrada inválida/indisponível/não conformidade ou filtro/interrupção; entrada UTF-8, path relativo, ordenação estável, locale neutro e data `YYYYMMDD.HHMM.SS`. Override DEVE declarar valor, escopo e autoridade.

## MN-STATE — FT e retomada

Fluxo: solicitação → intenção → FT → plano → execução incremental → memória → validação → commit → push → próxima etapa. FT possui `FT-NNN`, nome, escopo Técnico/Negócio, objetivo, prioridade, status, datas `YYYYMMDD.HHMM.SS`, etapas, tarefas, decisões, verificações, comandos, hipóteses descartadas, falhas, pendências e próximo ponto. Planejamento precede implementação; memória é contínua; conclusão atualiza estado, valida, commita e publica quando autorizada/possível. Interrupção registra `[INTERROMPIDO_POR_LIMITACAO_DE_RECURSOS]` e só remove a flag após retomada validada.

## MN-VAL — validação e sincronização

Alteração DEVE comprovar ausência de regressão, reprodutibilidade, produto final autônomo, dependências corretas e critérios específicos. Mudança de regra, arquitetura, fluxo, UI ou documentação DEVE sincronizar RCF, memória, implementação e artefatos derivados aplicáveis. Não declarar conclusão sem evidência.

## MN-REF — referência cruzada

Referência normativa DEVE nomear path estável e identificador/seção exatos. `./AGENTS.md` e `./.agents/` resolvem pela raiz normativa; outro path resolve pelo arquivo referenciador. Resolução DEVE verificar existência, caixa, ciclo e dependências antes da aplicação. Agregador contém somente índice, predicado, dependência e path; proximidade, nome legado ou analogia NÃO incorporam conteúdo. Roteador é carregado primeiro; predicados usam somente RCF/configuração/entrega autoritativa; dependências formam fecho transitivo ordenado. Módulo falso NÃO DEVE ser aberto; predicado sem evidência, ciclo ou destino ausente bloqueia. Arquivo selecionado é carregado integralmente.

## MN-SCEN — composição e carregamento de cenário

Cenário é especialização reutilizável subordinada ao RCF. Reutilização segue universal → grupo → composição → parâmetro → criação; herança só PODE ser cadeia única estável, e borda compõe capacidades ordenadas. Unidade reside em `./.agents/scenarios/<domínio>/<nome>/`; `scenario.md` é norma atômica ou roteador estável. Mais de um predicado independente exige módulos coesos no próprio diretório; roteador declara identidade, predicados, paths, dependências e ordem sem repetir regras. Módulo declara um predicado, escopo, limites, contratos, exceções, precedência, segurança, privacidade, acessibilidade, desempenho, compatibilidade e validação. Antes de implementar, classificar entrega, resolver `MN-REF`, aplicar cumulativamente e registrar módulos/dispensas/evidência. Falha normativa não admite inferência.

## MN-CLI — contrato comum de script

Script reutilizável DEVE declarar nome/finalidade, sintaxe, parâmetros tipados, obrigatoriedade/default, configuração, modos local/CI, efeitos, idempotência, ajuda, extensões, compatibilidade, logs, erros e códigos `0/1/2/3/4/130`. `--help` DEVE ser não mutável; argumento desconhecido DEVE retornar `2`, salvo `--` documentado para extensão. Configuração segue CLI → ambiente → arquivo local declarado → default; segredo NÃO DEVE ser logado. Saída IA atravessa `to-ia`; runtime disponível e path relativo seguro são obrigatórios, salvo restrição de ecossistema registrada.

## MN-META — metaarquivo contextual

Metaarquivo gerenciado reside em `./.agents/meta/<contexto>.md`, é subordinado a AGENTS/microconceitos e contém somente regra do grupo. Contexto DEVE ter nome estável, comandos, dependências, configuração, hooks, extensões, validação e precedência sem duplicação. `index.json` mapeia script, entry e contextos mínimos; script carrega somente `cli` e contextos aplicáveis. Distribuição/indexação DEVEM incluí-lo recursivamente. Arquivo inaplicável NÃO DEVE ser carregado; especialização segue `MN-EXT`.

## W-MTX-42 — matriz Web gerativa

Matriz possui exatamente 42 linhas e capacidades `Dev,Prod,Lib,Bundle,Offline`. Grupo A, sem Jekyll (26): JavaScript/HTML/sem framework/CSS|SCSS/sem build (2; somente Dev); mesmo perfil/Vite (2; todas); TypeScript/HTML/sem framework/CSS|SCSS/sem build (2; somente Dev); TypeScript/HTML/sem framework/CSS|SCSS/Vite/sem WASM (2; todas); mesmo perfil/com WASM (2; todas); TypeScript/TSX/React/Vite/estilos CSS|SCSS|CSS Modules|SCSS Modules/WASM não|sim (8; todas); mesmo produto com Preact (8; todas). Grupo B, com Jekyll (16): JavaScript/HTML/CSS|SCSS/sem build/sem WASM (2; Dev+Prod); mesmo perfil/Vite (2; Dev+Prod+Bundle+Offline); TypeScript/HTML/CSS|SCSS/Vite/WASM não|sim (4; mesmas capacidades); TypeScript/TSX/React|Preact/CSS|SCSS/Vite/WASM não|sim (8; mesmas capacidades). `Offline` DEVE incorporar assets necessários; licença incompatível, sandbox do navegador ou limite de artefato declarado PODE dispensar item, com condição e fallback registrados.
