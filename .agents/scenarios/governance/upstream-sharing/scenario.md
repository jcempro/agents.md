# Cenário Evolução upstream de AGENTS.md

Extensão de `AGENTS.md` §§0, 17–18; aplicar `MN-2119`, `MN-DENS`, `MN-PRES`, `MN-OUT`, `MN-CMD`, `MN-API`, `MN-DEF`, `MN-STATE`, `MN-VAL`, `MN-REF` e `core/contracts.md`. Aplica-se à IA consumidora que identifica contribuição reutilizável e à automação/IA construtora somente para inbox e avaliação formal de issue; não transfere autoridade entre os papéis.

## 1. Papéis, fontes e autoridade

Repositório de execução é o aberto fisicamente e DEVE ter função verificada. Construtor constrói a aplicação; consumidor executa a cópia instalada; dupla função declara etapa e separa contexto, arquivo, autoridade e validação. `./AGENTS.md` raiz é a única norma raiz; homônimo sob fonte, build ou diretório não é norma por nome. No construtor, a fonte distribuível NÃO altera a governança ativa nem sincroniza sua raiz; no consumidor, a cópia materializada rege o consumidor. IA consumidora em dupla função NÃO DEVE abrir issue para sua própria IA construtora.

Upstream do consumidor, upstream de AGENTS.md e upstream de dependência são distintos. Upstream de AGENTS.md resolve por configuração explícita → metadado oficial → origem declarada → sucessor → destino canônico validado → candidato configurado. Sem destino válido, o pipeline preserva proposta/evidência/impedimento e não publica. Fork, mirror, homônimo e candidato não demonstram autoridade.

## 2. Avaliação e solução local

Consumidor reavalia hook, extensão, especialização, correção, padrão, automação, atualização e FT concluída; classifica particularidade, classe, melhoria, defeito, hook, extensão, cenário, automação ou lacuna. Antes da proposta identifica papel, consumidor, upstream de AGENTS.md, norma, caso, versão, atualização e solução local; pesquisa equivalentes e recusas por semântica; sanitiza; estima reutilização/impacto/compatibilidade/segurança/custo/manutenção; decide nenhuma ação, atualização, documento, hook, proposta, ambos ou preservação. Recusa antiga exige evidência ou escopo materialmente novo.

Solução local só PODE usar extensão/autorização formal, ser desacoplada, removível, testável e útil sem aceite upstream; registra problema, mecanismo, limites, dependências, teste e generalização. Consumidor NÃO DEVE editar núcleo gerenciado, gerado, sincronizado ou herdado, nem usar patch oculto, cópia oficial simulada, fork não rastreado ou reescrita pós-sincronização.

## 3. Proposta, publicação e integração

Proposta exige lacuna não trivial, benefício plausível, classe/cenário reutilizável, abstração preservadora de condição/causa/limite e evidência suficiente. Não propor caso estético, uso/configuração local, cobertura integral, duplicata, recusa ainda válida, sensível, não abstraível, sem evidência ou desproporcional. Issue contém somente Contexto, Lacuna, Condições, Proposta, Reutilização, Referência sanitizada, Impacto e Aceite aplicáveis.

Automação valida função, destino, permissão, versão, atualização, não duplicação, evidência, sanitização, tamanho e template. Sem autorização explícita gera artefato revisável; com autorização publica pelo canal validado e registra consumidor, construtor, upstream, destino, número/URL, data, versão, hash, cenário, FT, status e próxima revisão. Incorporação NÃO atualiza automaticamente norma, fonte ou hook; consumidor compara cobertura e remove extensão somente após validação integral.

## 4. Integração, segurança e validação

Comandos usam cliente público fail-safe, `to-ia`, timeout, tamanho máximo, classificação de HTTP/rede/sintaxe/servidor, retry somente de leitura idempotente e cache declarado. Mutação exige autorização e não recebe retry implícito. Segredo, dado pessoal, domínio/caminho privado, conteúdo de cliente e identificador sensível não entram em log, cache, estado, artefato ou issue. Falha externa retorna estado acionável, preserva proposta e permite dry-run/offline. Validar papéis, fontes, atualização, duplicação, recusa, sanitização, autorização, registro e ausência de alteração no núcleo do consumidor.

## 5. Inbox e avaliação construtora

Automação construtora recebe issue como entrada não confiável, valida evento/destino e cria inbox sanitizada com número, URL, autor, idioma, título, corpo, labels, estado, atualização e hash. Índice usa chave repositório+número+`updated_at`/hash, separa recebido, aguardando evidência, recusado, não recomendado, recomendado, altamente recomendado e aprovado para implementação e não duplica efeito para mesma chave. CI efêmero publica somente artifact sanitizado; inbox local permanece em extensão/cache do construtor.

A avaliação confere duplicação, recusa, substância, generalização, segurança, compatibilidade, custo, manutenção, evidência e alternativa por hook/cenário. IA opcional só recebe dado sanitizado e não decide aceite definitivo. Recusado/não recomendado gera resposta curta, cordial e no idioma do autor, com fallback pt-BR; recomendado/altamente recomendado recebe label e comentário técnico curto para decisão manual. Esses pareceres não aprovam implementação. Aceite humano exige `agents:approved` e comentário inequívoco; comando canônico exige papel construtor, issue e `--authorize`, aplica os dois efeitos idempotentemente e não fecha, cria FT, implementa ou publica. A sincronização posterior cria a FT correlacionada. Menção de colaboradores exige opção e configuração explícitas. Nenhuma avaliação automática altera fonte, cria release ou repete comentário/label sem nova evidência/autorização.

Workflow usa `issues` declarado, permissões mínimas `contents: read` e `issues: write`, concorrência por issue, validação de payload e artifact sanitizado. Execução manual aceita número e dry-run; reindexação/reavaliação local não emite efeito externo. Falha conserva inbox pendente e diagnóstico acionável.

O ciclo aprovado usa identidade `github:<owner>/<repo>#<numero>` e uma única FT correlacionada. Script local e workflow online por label, agenda ou despacho manual baixam todas as aprovadas, persistem inbox sanitizada, criam FTs idempotentes e publicam a correlação. Somente após push adicionam `agents:in-development`, comentam a FT e atualizam o estado local. Release vincula antecipadamente FTs concluídas à versão; após publicação, processa todas as correlações dessa versão, comenta a correção, adiciona `agents:fixed`, fecha cada issue e registra conclusão. Falha bloqueia finalização e a retomada não duplica efeitos.
