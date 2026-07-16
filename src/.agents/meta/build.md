# Build

Subordinado a `./cli.md` e `MN-VAL`. Abrange build, dist, package e archive. Declara entrada, raiz-fonte, raiz publicada, exclusões, dependências e reprodutibilidade; execução DEVE validar antes/depois, limpar somente alvo declarado e produzir artefato autônomo sem fonte interna indevida. Hook/adaptador PODE especializar target, compilador ou hospedagem sem alterar contrato público. Carregar somente para build, dist, package, archive ou validação correspondente.
