# Build

Build recebe source/target somente da configuração central, limpa apenas o target declarado e injeta/valida banner de autoria, upstream e licença em toda saída comentável. Configuração web usa path versionado cacheável; offline incorpora somente o necessário.

Subordinado a `./cli.md` e `MN-VAL`. Abrange build, dist, package e archive. Declara entrada, raiz-fonte, raiz publicada, exclusões, dependências e reprodutibilidade; execução DEVE validar antes/depois, limpar somente alvo declarado e produzir artefato autônomo sem fonte interna indevida. Hook/adaptador PODE especializar target, compilador ou hospedagem sem alterar contrato público. Carregar somente para build, dist, package, archive ou validação correspondente.
