# Solicitação — Revisão da estrutura do construtor e segregação correta entre fontes distribuíveis e artefatos internos

origem=prompt direto
recebido_em=2026-07-25T19:58:12-03:00
sha256_payload_lf=5e7659087019b750f350be621aff29a327502dfd95c265d959936c677d22bc30
fts=FT-056,FT-057,FT-058,FT-059
rcf_destino=RCF.md §§0, 9, 10 e 20
estado=em_incorporacao

Leia integralmente o contexto, o RCF do construtor e `AGENTS.md` antes de modificar qualquer estrutura. Inspecione o estado real do repositório; não presuma organização, caminhos ou finalidade dos arquivos.

## Objetivo

Revisar integralmente a organização do construtor para garantir que o processo de `release` e `publish` distribua **exclusivamente** artefatos úteis aos Repositórios Finais.

Arquivos, diretórios, documentação, estudos, avaliações, experimentos, materiais de apoio, históricos ou conteúdos destinados exclusivamente ao desenvolvimento do próprio construtor NÃO DEVEM integrar o artefato distribuído.

Caso tais recursos atualmente estejam localizados sob `src/`, reavalie rigorosamente sua localização arquitetural e mova-os para local mais apropriado quando isso produzir maior aderência normativa.

## Problema identificado

Existem arquivos cuja finalidade é claramente interna ao construtor, como por exemplo:

```text
src/.ia.rules/core/evaluations/logical-syntax.md
```

Esse tipo de conteúdo não possui utilidade operacional para os Repositórios Finais.

Sua permanência sob `src/` sugere incorretamente que integra o conjunto de fontes destinadas à geração do conteúdo distribuído.

## Requisitos

### 1. Finalidade de `src/`

Normatize que `src/` representa exclusivamente as fontes destinadas à construção dos artefatos distribuídos (`dist`, `release` ou equivalente).

Todo conteúdo localizado em `src/` DEVE possuir finalidade direta na geração do produto final.

Arquivos internos ao desenvolvimento do construtor NÃO DEVEM permanecer nesse diretório.

### 2. Conteúdo interno

Avalie todos os diretórios sob `src/`.

Quando determinado arquivo:

- servir apenas ao desenvolvimento do construtor;
- documentar estudos;
- registrar avaliações;
- armazenar experimentos;
- conter decisões temporárias;
- apoiar apenas o desenvolvimento interno;
- não produzir qualquer efeito no artefato distribuído;

ele DEVE ser realocado para localização mais apropriada fora de `src/`.

A nova estrutura DEVE refletir claramente a separação entre:

- fonte distribuível;
- infraestrutura do construtor;
- documentação interna;
- experimentação;
- avaliações;
- histórico.

### 3. Release mínimo

O processo de release DEVE distribuir somente recursos efetivamente necessários aos Repositórios Finais.

É PROIBIDO publicar:

- estudos;
- avaliações;
- documentos internos;
- material de apoio exclusivo do construtor;
- experimentos;
- protótipos;
- arquivos mortos;
- diretórios sem função operacional no destino.

### 4. Reavaliação arquitetural

A simples exclusão do release NÃO é suficiente.

Sempre que um arquivo for considerado inadequado para distribuição, sua localização dentro do construtor também DEVE ser reavaliada.

A organização física do repositório DEVE refletir a responsabilidade arquitetural de cada artefato.

### 5. Diretório raiz

Normatize explicitamente que arquivos internos ao construtor podem localizar-se diretamente sob `/` (ou outro local arquiteturalmente adequado), desde que isso produza maior organização.

A restrição existente aplica-se especificamente a:

- `AGENTS.md`;
- `.ia.rules`;

que permanecem protegidos pelas normas atuais.

Essa restrição NÃO DEVE ser interpretada como proibição de utilização do diretório raiz para outros conteúdos internos do construtor.

### 6. Compatibilidade

A reorganização NÃO DEVE:

- alterar comportamento do construtor;
- romper scripts;
- quebrar workflows;
- invalidar referências;
- alterar contratos públicos;
- modificar o conteúdo distribuído, exceto pela remoção dos artefatos indevidos.

Toda referência afetada DEVE ser atualizada.

### 7. Validação

Após a reorganização, valide:

- estrutura de diretórios;
- geração do release;
- conteúdo publicado;
- workflows;
- scripts;
- referências;
- documentação;
- índices.

Confirme que nenhum artefato exclusivamente interno continua sendo distribuído.

## Critérios de aceite

Considerar concluído somente quando:

- `src/` contiver exclusivamente fontes destinadas ao produto distribuído;
- conteúdos internos do construtor estiverem segregados em localização arquiteturalmente adequada;
- o release distribuir apenas recursos úteis aos Repositórios Finais;
- referências, scripts, workflows e documentação permanecerem íntegros;
- a nova organização refletir claramente a separação entre infraestrutura do construtor e conteúdo distribuível;
- o RCF e `AGENTS.md` estabelecerem explicitamente essa distinção como norma permanente.
