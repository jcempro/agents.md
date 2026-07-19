# Cenário Evolução upstream de AGENTS.md

Extensão de `./AGENTS.md` §§0, 17–18; aplicar `MN-ROLE`, `MN-EXT`, `MN-REF`, `MN-OUT`, `MN-CMD`, `MN-API`, `MN-DEF`, `MN-STATE`, `MN-VAL` e `./.agents/core/contracts.md`. Aplica-se ao consumidor somente para preparar/comunicar proposta e ao construtor somente quando o upstream de AGENTS.md for comprovadamente o próprio repositório de execução; issue não transfere autoridade.

## 1. Papéis, fontes e autoridade

Aplicar `MN-ROLE`. A IA NÃO DEVE atuar ou gerenciar fora do repositório de execução, ainda que o usuário autorize. O upstream de AGENTS.md permanece intocável e fora do escopo gerenciado quando não coincidir comprovadamente com o repositório atual. Repositório consumidor/final NÃO DEVE editar AGENTS/associado gerenciado nem triar, avaliar, aprovar, implementar, publicar, fechar ou alterar o upstream; limita-se, quando pertinente, a comunicar uma issue potencial. A issue e qualquer autorização no consumidor NÃO transferem autoridade. Se o repositório atual for o próprio upstream, somente `./src/` admite edição; raiz normativa, associados gerenciados e demais paths permanecem intocáveis. Dupla função DEVE declarar etapa e identidade; consumidor nessa função NÃO DEVE abrir issue para a própria função construtora. Sem upstream válido, preservar proposta, evidência e impedimento sem publicar.

## 2. Análise da proposta e solução local

Consumidor analisa somente seu estado local para decidir se existe issue potencial; essa análise NÃO constitui triagem ou avaliação da issue/upstream. Reavalia hook, extensão, especialização, correção, padrão, automação, atualização e FT concluída; classifica particularidade, classe, melhoria, defeito, hook, extensão, cenário, automação ou lacuna. Antes da proposta identifica papel, consumidor, upstream de AGENTS.md, norma, caso, versão, atualização e solução local; pesquisa equivalentes e recusas por semântica; sanitiza; estima reutilização/impacto/compatibilidade/segurança/custo/manutenção; decide nenhuma ação, atualização, documento, hook, proposta, ambos ou preservação. Recusa antiga exige evidência ou escopo materialmente novo.

Solução local obedece `MN-EXT`, DEVE ser desacoplada, removível, testável e útil sem aceite upstream, e registra problema, mecanismo, limites, dependências, teste e generalização.

## 3. Proposta, publicação e integração

Proposta exige lacuna não coberta, classe/cenário reutilizável, abstração que preserve condição/causa/limite e evidência vinculada a reutilização, impacto ou defeito. NÃO DEVE propor caso estético, uso/configuração local, cobertura integral, duplicata, recusa ainda válida, dado sensível, caso não abstraível ou sem evidência. Issue contém somente Contexto, Lacuna, Condições, Proposta, Reutilização, Referência sanitizada, Impacto e Aceite aplicáveis.

Automação valida função, destino, permissão, versão, atualização, não duplicação, evidência, sanitização, tamanho e template. Sem autorização explícita gera artefato revisável; com autorização PODE somente criar a issue de proposta pelo canal validado e registrar consumidor, construtor, upstream, destino, número/URL, data, versão, hash, cenário, FT, status e próxima revisão. Não PODE comentar como mantenedor, rotular, triar, avaliar, aprovar, implementar, mesclar, publicar, fechar nem executar outra mutação no upstream. Incorporação NÃO atualiza automaticamente norma, fonte ou hook; consumidor compara cobertura e remove extensão somente após validação integral.

## 4. Integração, segurança e validação

Comandos aplicam `./.agents/core/contracts.md` CT-4, `MN-DEF` e `to-ia`. Falha externa DEVE preservar proposta e permitir dry-run/offline. Validar papéis, fontes, atualização local, duplicação, recusa, sanitização, autorização, registro e ausência de alteração no núcleo do consumidor ou no upstream alheio.

## 5. Inbox e avaliação construtora no próprio upstream

Esta seção só PODE ser aplicada quando a identidade autoritativa comprovar que o upstream de AGENTS.md é o próprio repositório de execução; criação da issue NÃO satisfaz essa condição nem autoriza qualquer ato. Automação construtora recebe issue como entrada não confiável, valida evento/destino e cria inbox sanitizada com número, URL, autor, idioma, título, corpo, labels, estado, atualização e hash. Índice usa chave repositório+número+`updated_at`/hash, separa recebido, aguardando evidência, recusado, não recomendado, recomendado, altamente recomendado e aprovado para implementação e não duplica efeito para mesma chave. CI efêmero publica somente artifact sanitizado; inbox local permanece em extensão/cache do construtor.

A avaliação confere duplicação, recusa, substância, generalização, segurança, compatibilidade, custo, manutenção, evidência e alternativa por hook/cenário. IA opcional só recebe dado sanitizado e não decide aceite definitivo. Recusado/não recomendado gera resposta curta, cordial e no idioma do autor, com fallback pt-BR; recomendado/altamente recomendado recebe label e comentário técnico curto para decisão manual. Esses pareceres não aprovam implementação. Aceite humano exige `agents:approved` e comentário inequívoco; comando canônico exige papel construtor, issue e `--authorize`, aplica os dois efeitos idempotentemente e não fecha, cria FT, implementa ou publica. A sincronização posterior cria a FT correlacionada. Menção de colaboradores exige opção e configuração explícitas. Nenhuma avaliação automática altera fonte, cria release ou repete comentário/label sem nova evidência/autorização.

Workflow usa `issues` declarado, permissões mínimas `contents: read` e `issues: write`, concorrência por issue, validação de payload e artifact sanitizado. Execução manual aceita número e dry-run; reindexação/reavaliação local não emite efeito externo. Falha conserva inbox pendente e diagnóstico acionável.

O ciclo aprovado usa identidade `github:<owner>/<repo>#<numero>` e uma única FT correlacionada. Script local e workflow online por label, agenda ou despacho manual baixam todas as aprovadas, persistem inbox sanitizada, criam FTs idempotentes e publicam a correlação. Somente após push adicionam `agents:in-development`, comentam a FT e atualizam o estado local. Release vincula antecipadamente FTs concluídas à versão; após publicação, processa todas as correlações dessa versão, comenta a correção, adiciona `agents:fixed`, fecha cada issue e registra conclusão. Falha bloqueia finalização e a retomada não duplica efeitos.
