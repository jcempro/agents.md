# Cenário Publicação de Conteúdo

Extensão de `./AGENTS.md` §17; aplicar `MN-2119`, `MN-DENS`, `MN-PRES`, `MN-API`, `MN-DEF`, `MN-OUT`, `MN-CMD`, `MN-VAL` e `MN-REF`. Só se aplica quando RCF declarar publicação de artigo, página, post, documentação ou outra classe pública nomeada. Fora dessa condição, `publish`/`publicar`, workflow, manifesto e hook deste cenário NÃO DEVEM existir nem consumir processamento.

## 1. Escopo e independência

`publish`/`publicar` representa somente a publicação de conteúdo de Negócio. Pode usar comando, manifesto temporário, sinalizador, gatilho ou arquitetura equivalente, conforme RCF. NÃO DEVE criar ou alterar versão, tag, asset, release, `latest`, nota de release ou commit `release:`; o cenário Release é independente e não é dependência implícita.

## 2. Integração e extensão

Fluxo DEVE compor somente mecanismos já aplicáveis do repositório: build, hospedagem, CI, cache, SEO, feed, índice, agendamento, distribuição e validação de disponibilidade. Cada especialização DEVE ocorrer por hook formal e manter idempotência, estado auditável, retry limitado e fallback seguro. Sinalizador temporário, quando adotado, pertence exclusivamente ao fluxo de conteúdo, tem ciclo de vida documentado e NÃO DEVE ser confundido com gatilho de release.

## 3. Segurança, privacidade e validação

Segredo, dado privado e conteúdo não elegível NÃO DEVEM ser publicados. Falha anterior à disponibilidade DEVE bloquear dependente externo; falha posterior DEVE registrar recuperação sem duplicar publicação. Validar conteúdo, caminho público, build, cache, metadado, feed/SEO e estado final no destino real. Cenário Web/hospedagem e RCF PODEM adicionar requisitos de acessibilidade, privacidade e desempenho.
