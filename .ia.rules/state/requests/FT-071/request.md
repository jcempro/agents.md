# Solicitação preservada — FT-071 a FT-075

Origem: prompt humano e Issue `github:jcempro/agents.md#11`.
Recebido em: 2026-08-11 (America/Sao_Paulo).
Issue consultada em: 2026-08-11.
FTs: FT-071, FT-072, FT-073, FT-074 e FT-075.
RCFs de destino: RCF.md §§ 0.0.2, 0.0.3, 1.1, 1.4, 3.11, 3.14, 4.0, 13, 14, 15, 17 e 20.
Estado de incorporação: preservada; pendente de auditoria bidirecional e conclusão.

## Prompt humano integral

# Issue #11, FTs, Equalizer e release 0.1.3

É TERMINANTEMENTE PROIBIDA qualquer regressão, remoção/perda de feature, compatibilidade ou comportamento, eliminação/degradação normativa, redução de força, intensidade, incisividade ou explicitude — inclusive progressivamente entre versões/commits. Refatoração, síntese ou reorganização NÃO autorizam enfraquecimento semântico.

## Issue #11

Avalie integralmente:

https://github.com/jcempro/agents.md/issues/11

Determine:
- pertinência real da issue;
- existência ou não de defeito;
- aderência/divergência da resposta do mantenedor ao comportamento real;
- qualquer risco ou problema correlato que mereça correção.

Verifique especialmente se o update pode substituir, remover, ignorar ou perder hooks, `agents.local.md` ou equivalentes/customizações autorizadas, inclusive quando migrados, renomeados ou localizados em paths antigos/novos. Mudança de path NÃO autoriza perda. Corrija estruturalmente qualquer risco comprovado.

## Execução conjunta

- Continue e conclua todas as FTs em andamento aplicáveis.
- Execute integralmente o item `equalizer` de `TODO.ia.md`, incluindo dependências, testes e critérios de aceite, até conclusão definitiva.
- NÃO reduza escopo, requisitos ou normas para adequá-los ao estado atual da implementação.

## Garantias

Preserve cumulativamente:
- zero regressão;
- zero falha conhecida introduzida;
- zero perda de feature;
- zero perda de customização válida;
- zero redução de compatibilidade;
- zero enfraquecimento normativo;
- retrocompatibilidade e comportamento fail-safe/resiliente vigentes.

## Validação e release

Ao final, compare o candidato diretamente com a última release oficial, verificando features, scripts, APIs, hooks, customizações, compatibilidade, fallbacks, testes e força/explicitude normativa.

Se houver qualquer perda, regressão, redução funcional ou normativa, NÃO publique; corrija primeiro.

Se forem necessárias versões intermediárias de validação, use somente:

```text
0.1.3-beta
0.1.3-beta-a
...
0.1.3-beta-z
```

Publique `0.1.3` somente após comprovar:
- issue #11 devidamente analisada/corrigida;
- hooks/customizações preservados;
- FTs concluídas;
- `equalizer` concluído;
- testes pertinentes aprovados;
- ausência comprovada de regressão, perda, redução ou enfraquecimento funcional/normativo.

Ao concluir, registre objetivamente análise da issue, correções, FTs, `equalizer`, testes, comparação com a release anterior, betas eventualmente publicados e release final.

## Issue #11 integral

Título: `[AGENTS] Preservar scripts do produto e distinguir o gate da Norma em consumidores construtores`

Estado na consulta: aberta.
Autor: `JeanCarloEM`.
Criada em: `2026-08-10T02:25:52Z`.
Atualizada em: `2026-08-10T22:25:18Z`.
Label na consulta: `agents:highly-recommended`.

### Corpo

## Contexto
Um Repositório Final pode construir, testar e publicar seu próprio produto enquanto apenas consome a Norma Operacional instalada. Nesse papel cumulativo, os comandos do produto e os comandos namespaced da governança precisam coexistir sem trocar suas autoridades.

## Lacuna
A atualização oficial substitui scripts públicos preexistentes do produto, como build, check, test e prepare, por rotinas que constroem e verificam a distribuição da própria Norma. Em seguida, o gate gerenciado presume uma árvore-fonte exclusiva do construtor canônico da Norma e exige nela o manifesto de distribuição, embora o consumidor mantenha nesse local apenas a fonte do seu produto. A atualização deixa de ser preservadora e o gate permanece inaplicável ao produto.

## Condições
O problema ocorre quando o consumidor possui package.json e source root próprios, mantém a governança somente na raiz operacional instalada e executa update:agents seguido de agent:verify. A reprodução independe do domínio do produto e persiste após a atualização oficial que introduz o manifesto de distribuição na raiz operacional.

## Proposta
Fazer o merge semântico do package.json preservar scripts pertencentes ao produto e instalar a operação gerenciada somente em comandos namespaced ou pontos de extensão declarados. Fazer agent:verify distinguir o construtor canônico da Norma de um Repositório Final que constrói outro produto: no primeiro, validar a distribuição-fonte completa; no segundo, validar integridade da governança instalada e delegar ou compor o gate do produto, sem exigir layout-fonte da Norma. O manifesto deve ser resolvido pela autoridade e pelo perfil aplicáveis, nunca pela coincidência do nome src.

## Reutilização
A correção atende bibliotecas, aplicações, CLIs e sites que usam Node e npm para seu próprio ciclo técnico e simultaneamente consomem a mesma governança. Evita que cada consumidor mantenha restauração manual, bypass de gate ou workflow concorrente.

## Referência
Reprodução sanitizada: executar o verificador do produto com sucesso; aplicar update:agents; observar a substituição dos scripts do produto; executar agent:verify; observar que o gate procura o manifesto da Norma dentro da fonte do produto e encerra antes de validar o artefato real.

## Impacto
Sem a correção, a atualização pode quebrar build, CI, prepack e primeira publicação de qualquer pacote consumidor. Também produz falso bloqueio global ou incentiva contorno do mecanismo oficial, com risco de publicar artefato diferente do validado.

## Aceite
Teste de integração com um consumidor que possua scripts próprios de build, check, test e prepare; update:agents preserva integralmente esses valores ou os compõe por contrato explícito; comandos agent:* continuam disponíveis; agent:verify não exige fonte da Norma no source root do produto; o gate do produto é executado ou declarado separadamente sem sucesso inferido; repetição da atualização é idempotente; backup permanece ignorado e recuperável.

### Comentário automatizado

Autor: `github-actions`.
Criado em: `2026-08-10T02:26:04Z`.

Alta recomendação técnica: a proposta demonstra lacuna reproduzível, benefício amplo e critérios de aceite verificáveis; requer decisão manual do mantenedor. Motivo: a lacuna é reproduzível, reutilizável e possui evidências suficientes.

Marcador: `<!-- agents-inbox:b3ae590c69eaa6e3 -->`.

### Resposta do mantenedor

Autor: `JeanCarloEM`.
Criado em: `2026-08-10T21:53:46Z`.

O problema parece ser exatamente o que você declarou: "A atualização oficial substitui scripts públicos preexistentes do produto, como build, check, test e prepare, por rotinas que constroem e verificam a distribuição da própria Norma".

O objetivo da atualização é, de fato, atualizar e substituir todos os scripts preexistentes relacionados às rotinas definidas pela norma AGENTS.md. As formas autorizadas para que o repositório consumidor customize ou estenda esse comportamento são exclusivamente aquelas já normatizadas, como hooks ou AGENTS.local, devidamente identificados para essa finalidade.

Assim, se o seu repositório alterou scripts pertencentes à própria norma AGENTS.md, não há, nesse aspecto, falha, bug ou insuficiência no AGENTS.md, mas uma violação do contrato de uso do produto distribuído por este repositório. Scripts, arquivos e mecanismos associados ao AGENTS.md não devem ser alterados, exceto — e somente — nos pontos explicitamente autorizados pela própria norma.

Se, por outro lado, o problema estiver relacionado a algum desses pontos de extensão autorizados, então a issue apresentada é insuficiente para caracterizar e permitir a análise do problema: faltam evidências, casos reproduzíveis, cenários concretos, contexto de execução e exemplos reais que demonstrem onde e como o comportamento esperado deixou de ser atendido.

## Observação sobre o ciclo remoto

A tentativa de registrar aceite remoto pelo comando oficial foi bloqueada pelo controle de autorização externa, pois o prompt manda avaliar, corrigir e publicar, mas não ordena explicitamente comentar ou rotular a Issue. Nenhum efeito remoto foi aplicado. A Issue permanece fonte referencial da solicitação direta; seu fechamento/rotulagem não será inferido sem autorização específica.
