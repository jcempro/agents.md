# Descoberta, roteamento e recuperação normativa

Identidade normativa: `core.routing`; núcleo; tipo: folha. Ler antes de usar contexto parcial, índice, busca, grafo, cache ou métrica de tokens. Depende de `./authority.md`, `./contracts.md`, `./concepts/microconceitos.md` e `../normative-index.json`.

## 1. Autoridade e índice

`AGENTS.md` é o entrypoint canônico mínimo e `../agents.inc.md` preserva seu corpo operacional integral como auxiliar de fallback; ambos conservam autoridade conjunta, sem tornar o auxiliar leitura inicial. Índice, grafo, mapa, resumo, chunk, custo e cache são derivados ou manifestos de descoberta, apontam à origem e NÃO a substituem. `../normative-index.json` é o manifesto estruturado canônico; seu schema é `./formats/normative-index.v1.schema.json`.

Antes de criar solução, consultar o índice por correspondência exata de ID, finalidade, gatilho, papel, cenário, fase, linguagem, componente, artefato e operação. Em nova solicitação, após capturar a fonte, consultar também o índice local de recusas por chave semântica/finalidade/efeito antes de análise substantiva; esse índice aponta somente recusa expressa ainda não implementada e não possui autoridade normativa. Match exato, ID, escopo e precedência prevalecem sobre sinônimo. Correspondência torna leitura integral do módulo e dependências obrigatória. Módulo não carregado continua obrigatório quando seu gatilho ocorrer.

Rota mínima carrega: entrypoint; núcleo global; índice; papéis cumulativos ativos; cenários e recursos disparados; dependências expressas; precedências, exceções e decisões anteriores necessárias. Particularidade local é adicionada após o núcleo e antes da ação. Mudança de rota, perda de contexto, conflito, regra não localizada, baixa confiança, fragmentação, índice/cache inválido, escopo ambíguo ou auditoria de preservação acionam `../agents.inc.md` integral; fora desses gatilhos, o auxiliar NÃO DEVE ser relido.

## 2. Grafo

Cada nó possui ID estável, path com caixa exata, classe, papel, entradas, saídas, gatilhos e tipo exclusivo:

- `leaf`: terminal, sem aresta de saída;
- `derivation`: encaminha e não é terminal;
- `hybrid`: contém norma terminal e deriva.

Aresta `immediate` encerra leitura do nó no link declarado; conteúdo posterior não integra o caminho. Aresta `passive` deriva somente após leitura integral. Manifesto DEVE declarar condição, ordem e motivo. Aresta imediata só é válida quando nada posterior for necessário.

Validação rejeita nó/path inexistente, ID duplicado, referência quebrada, papel incompatível, aresta sem tipo/condição, ciclo não autorizado, rota inalcançável, leaf com saída, derivation terminal, profundidade excessiva, sobreposição ambígua, responsabilidade incerta e duplicação sem referência. Custo ou badge não polui fonte em `src/`.

## 3. Recuperação e decisão RAG

São adotados: unidades semânticas recuperáveis, IDs estáveis, metadados mínimos, busca lexical/por ID, filtros de precedência/escopo, roteamento, grafo, cache validado, deduplicação e fallback integral. Não são adotados: embeddings, banco vetorial, similaridade semântica, expansão automática, reranking por modelo ou serviço externo. Adoção futura exige baseline, ganho líquido recorrente, privacidade, reversibilidade, fonte aberta/gratuita/offline preferencial e decisão normativa anterior.

Unidade recuperável conserva sujeito, modalidade, escopo, restrição, exceção, precedência, dependência e aplicação. Resumo hierárquico preserva objetivo e impacto transversal. Fragmentação artificial, overlap sem fundamento, formato ilegível, dependência de ferramenta ou navegação maior que o ganho são proibidos.

## 4. Tokenização e métricas

Indexador futuro é conector de tokenizer oficial ou equivalente bit a bit, não implementação improvisada. Métrica registra modelo, tokenizer, versão, encoding e serialização; cada alvo tem resultado próprio. Mudança desses elementos invalida cache.

Custo reproduz conteúdo transmitido: aresta immediate inclui predecessores e nó até o link; passive inclui predecessores e nó integral; leaf/hybrid terminal inclui conteúdo integral. Rotas distintas permanecem separadas.

Para folhas e híbridos terminais separadamente, índice, mapa, região gerenciada do README e saída CLI usam a mesma série, com um custo inteiro por rota válida, e apresentam contagem, mínimo, média aritmética, mediana, desvio padrão populacional e máximo. Mediana é o centro ordenado ou a média dos dois centros; desvio é a raiz da média dos desvios quadráticos, vale `0` para série unitária e `n/a` para série vazia. Média, mediana e desvio arredondam somente a exibição a duas casas; mínimo/máximo permanecem inteiros. Inclusão e rotas múltiplas são determinísticas. Mapa e região README declaram origem, versão, commit, semântica estatística e obsolescência.

## 5. Workflow e segurança planejados

Alteração de fonte normativa, roteador, índice, gerador, tokenizer ou configuração capaz de mudar resultado DEVE invalidar derivados e acionar validação equivalente local/CI. Concorrência, branch obsoleta, divergência ou artefato de revisão anterior bloqueiam gravação. Commit automático usa marcador anti-recursão sem dispensar nova mudança material.

Operação é local, reproduzível, cross-platform e independente de serviço pago/remoto. Código, conteúdo privado, documento ou metadado do consumidor não saem para serviço externo sem RCF e configuração explícitos. A implementação executável deste contrato exige FT e autorização próprias.

## 6. Papel e distribuição

Roteamento possui eixos independentes: `roles` controla carga normativa; perfil de distribuição controla presença no produto. O papel Construtor deriva obrigatoriamente para `../scenarios/governance/constructor-operation.md` nas operações de fonte, classificação, build, dist, package, archive, update, release ou publish. Um nó `constructor` PODE integrar o produto como `consumer-scenario`; somente finalidade exclusiva deste construtor, sem efeito reutilizável, permite `builder-internal`.

Índice normativo contém apenas módulos distribuíveis. Estudo, avaliação, projeção de auditoria ou documento interno do Construtor não é nó, aresta nem fallback do consumidor; referência histórica externa não o reintroduz na rota.

## 7. Sintaxe

Linguagem natural com modalidade RFC 2119 e referências `MN-*` permanece canônica. Nenhum token lógico novo está aprovado. A decisão vigente está no RCF e no registro local de recusa; ausência de tokenizer oficial e perdas semânticas documentadas impedem comprovar ganho líquido. Parser, formatter ou migração são proibidos até nova decisão no RCF anterior à implementação.
