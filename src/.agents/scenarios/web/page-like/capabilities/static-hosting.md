# Capacidade WEB-STATIC

Predicado: RCF/configuração declara gerador, hospedagem estática ou publicação como arquivos sem runtime de servidor. Depende de `WEB-BROWSER`.

Antes de alterar bundler, framework ou runtime, DEVE validar gerador, hospedagem, tema, custo, build remoto, link/base path/asset e ambiente. Estático DEVE preferir template nativo, CSS/Sass, TS estático e ausência de bundler quando cobrirem os requisitos; Vite/equivalente só PODE entrar se a validação demonstrar recurso obrigatório ausente ou menor complexidade total. Dependência/versão DEVEM compatibilizar local, CI e plataforma; plugin incompatível exige pipeline controlado declarado.

404 DEVE ocupar o path exigido pelo contrato de hospedagem, usar raiz somente quando esse contrato exigir, omitir front matter se for arquivo estático, reutilizar CSS resolvido, usar recurso local mínimo, refletir cabeçalho/rodapé e não depender da rota falha. Recente assíncrono declarado PODE carregar após conteúdo/loader por JSON/feed interno, com DOM seguro/`textContent`, sem bloquear. `noscript` compartilhado DEVE usar include/partial/componente e sincronizar automaticamente com 404 quando a stack fornecer fonte comum; sem fonte comum, a duplicação exige teste de paridade.
