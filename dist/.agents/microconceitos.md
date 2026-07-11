# Microconceitos normativos

Extensão direta de `AGENTS.md` §2.5. Identificadores são estáveis; referência a um identificador incorpora integralmente seu conteúdo. Todo arquivo que o cite DEVE ser carregado com este documento antes de aplicar a regra.

## MN-2119 — modalidade exclusiva

Norma usa somente: **DEVE**, **NÃO DEVE**, **DEVERIA**, **NÃO DEVERIA**, **PODE**, **RECOMENDA-SE** e **OPCIONAL**. Flexão plural é admitida. Texto sem esses termos é descritivo, salvo contrato literal. Modalidade, condição, exceção, autoridade e efeito NÃO DEVEM ser inferidos.

## MN-DENS — densidade sem perda

Maximizar informação por caractere, coesão, reutilização e referências; remover somente forma redundante. Concisão NÃO DEVE remover regra, restrição, exceção, prioridade, dependência, valor, exemplo delimitador, contexto, rastreabilidade ou nuance. Microconceito substitui repetição somente quando conservar integralmente escopo e força.

## MN-PRES — preservação e ambiguidade

Alteração DEVE preservar autoria manual, contratos, compatibilidade, comportamento, comentários corretos e correções defensivas. Dúvida exige a menor alteração compatível; conflito insolúvel exige `AMBIGUIDADE INSOLUVEL: <ponto>. Preservando original.`. Regressão exige solicitação humana explícita e confirmação.

## MN-IA-OPT — custo simultâneo

Toda atuação da IA DEVE minimizar simultaneamente tokens lidos, tokens emitidos, custo computacional e tempo de processamento, sem reduzir precisão, contexto, rastreabilidade, aderência ao RCF, validação ou qualidade. Cache válido, leitura seletiva, composição e saída orientada à decisão são obrigatórios quando reduzem custo líquido.

## MN-PREP — preparo de entrada

Volume relevante de texto, código, log, diagnóstico, markup, dado estruturado, build ou artefato equivalente DEVE passar por preparo automatizado antes da leitura pela IA quando tecnicamente viável. O preparo DEVE condensar estrutura e redundância, preservar informação útil, erros, avisos, diagnóstico e contexto de autocorreção, e produzir resultado determinístico. Bibliotecas abertas só PODEM ser usadas quando estáveis, mantidas e proporcionais.

## MN-OUT — envelope de saída

`to-ia`/`agent:filter` é a interface única de saída para IA. DEVE normalizar UTF-8/LF, remover ANSI e controles, deduplicar consecutivos, classificar, ordenar, limitar e persistir integral excedente sem inferência semântica ou LLM. Formato: JSON Lines UTF-8 sem vazio; primeiro registro `{v,command,status,exit,totalLines,totalBytes,shown,truncated,artifact,sha256}`; demais registros `{level,code,message}` e, quando aplicável, `{path,line,value}`. Ordem: `fatal,error,warning,change,result,metric,info`; `debug` é persistido, nunca exibido. Limites: 50 linhas e 8192 bytes; prevalece o primeiro. Excedente DEVE ser salvo em `.agents/cache/outputs/<YYYYMMDD.HHMM.SS>-<comando>-<sha256-12>.log`, sem versionamento, com hash no envelope. Falha do filtro DEVE bloquear exposição, retornar `4`, persistir bruto e emitir somente `FILTER_FAILURE`.

## MN-CMD — encapsulamento de comando

Comando de terminal, shell, CLI, subprocesso ou fallback que possa emitir saída extensa DEVE ser executado por `to-ia`; execução direta é vedada. O encapsulador DEVE abstrair SO, shell, ferramenta, linguagem e formato quando o ecossistema o permitir; aceitar entradas compatíveis, normalizar saída e centralizar lógica. Novo comando sem encapsulamento DEVE receber encapsulamento antes do uso.

## MN-API — contrato operacional

API `agent:*` DEVE ser local, determinística, não interativa, reutilizável e versionada. Cada comando DEVE declarar finalidade, sintaxe, entradas/tipos, defaults, limites, timeout, retry, lotes, paginação, concorrência, pré/pós-condições, dependências, efeitos, idempotência, destrutividade/confirmação, schema/filtro, persistência, códigos, falhas e fallback. Lacuna retorna `PARAMETRO_NORMATIVO_AUSENTE:<nome>` e código `4`. Status: `available` integral; `degraded` seguro com perda opcional declarada; `n/a` dispensado por autoridade; `noncompliant` ausente, inseguro ou sem contrato/filtro. IA DEVE usar `available`; PODE usar `degraded` se a perda for irrelevante; NÃO DEVE usar `noncompliant`.

## MN-DEF — defaults operacionais

Na ausência de regra mais específica: timeout local 30 s, rede 120 s, operação pesada 900 s; retry idempotente transitório 2 vezes com 1 s/3 s, demais 0; concorrência 1 para mutação e até 4 para leituras declaradas paralelizáveis; códigos 0/1/2/3/4/130 = sucesso/falha/entrada inválida/indisponível/não conformidade ou filtro/interrupção; entrada UTF-8, path relativo, ordenação estável, locale neutro e data `YYYYMMDD.HHMM.SS`. Override DEVE declarar valor, escopo e autoridade.

## MN-STATE — FT e retomada

Fluxo: solicitação → intenção → FT → plano → execução incremental → memória → validação → commit → push → próxima etapa. FT possui identidade, escopo, objetivo, prioridade, status, datas, etapas, tarefas, decisões, verificações, falhas, pendências e próximo ponto. Planejamento precede implementação; conclusão atualiza memória, valida, commita e publica quando possível. Interrupção registra `[INTERROMPIDO_POR_LIMITACAO_DE_RECURSOS]`.

## MN-VAL — validação e sincronização

Alteração DEVE comprovar ausência de regressão, reprodutibilidade, produto final autônomo, dependências corretas e critérios específicos. Mudança de regra, arquitetura, fluxo, UI ou documentação DEVE sincronizar RCF, memória, implementação e artefatos derivados aplicáveis. Não declarar conclusão sem evidência.

## MN-REF — referência cruzada

Referência usa identificador e seção estáveis. Agregador contém somente referências. Referência circular, destino ausente, exceção sem autoridade ou valor essencial abstraído é não conformidade.

## W-MTX-42 — matriz Web gerativa

Matriz possui exatamente 42 linhas e capacidades `Dev,Prod,Lib,Bundle,Offline`. Grupo A, sem Jekyll (26): JavaScript/HTML/sem framework/CSS|SCSS/sem build (2; somente Dev); mesmo perfil/Vite (2; todas); TypeScript/HTML/sem framework/CSS|SCSS/sem build (2; somente Dev); TypeScript/HTML/sem framework/CSS|SCSS/Vite/sem WASM (2; todas); mesmo perfil/com WASM (2; todas); TypeScript/TSX/React/Vite/estilos CSS|SCSS|CSS Modules|SCSS Modules/WASM não|sim (8; todas); mesmo produto com Preact (8; todas). Grupo B, com Jekyll (16): JavaScript/HTML/CSS|SCSS/sem build/sem WASM (2; Dev+Prod); mesmo perfil/Vite (2; Dev+Prod+Bundle+Offline); TypeScript/HTML/CSS|SCSS/Vite/WASM não|sim (4; mesmas capacidades); TypeScript/TSX/React|Preact/CSS|SCSS/Vite/WASM não|sim (8; mesmas capacidades). `Offline` incorpora assets necessários quando tecnicamente viável.
