# Solicitação canônica — FT-086

- origem: anexo do prompt `cf9b6151-31f5-462f-b67a-154097821d74/pasted-text.txt`
- recebido_em: 2026-09-13
- sha256_origem: `9673395f1065f3e5a056550262b92e9682a257cd5fff6a41b86dcfaec6531efc`
- incorporação: integral; normatização FT-086; implementação FT-087; validação FT-088

## Conteúdo integral

continue, mas trate esta etapa como **correção normativa e estrutural sem regressão**: impeça o crescimento cumulativo de `continue.ia`, preserve corretamente o histórico de FTs e torne **permanente, explícita, forte e inequívoca** a segregação entre o `agents.md` consumido pelo repositório e o `agents.md` que constitui o próprio produto em desenvolvimento.

Ao editar normas, RCFs ou documentação normativa, aplique **máxima densidade informacional**: reduza agressivamente tokens, redundâncias e texto cerimonial **sem perder absolutamente nenhuma informação, nuance, condição, exceção, precedência, força, rigor, verificabilidade ou intensidade normativa**. Se concisão e preservação entrarem em conflito, prevalece a preservação integral.

## 1. Problema

O `continue.ia` atual possui mais de **2.000 linhas** e retém FTs concluídas há muito tempo. Isso viola um princípio já solicitado anteriormente: `continue.ia` NÃO deve crescer indefinidamente como arquivo histórico.

A situação indica uma ou mais possibilidades:

* a regra não foi implementada;
* foi implementada parcialmente/incorretamente;
* ficou ambígua ou normativamente fraca;
* deixou de ser obedecida;
* foi enfraquecida/removida em edições posteriores, o que também é expressamente proibido.

A tarefa NÃO visa substituir governança válida nem criar arbitrariamente uma nova arquitetura. Deve **localizar a regra existente, diagnosticar a falha, restaurar/reforçar sua força e corrigir a causa**, não apenas reduzir manualmente o arquivo atual.

## 2. Contexto crítico: este é um repositório construtor

Este repositório **desenvolve o mesmo produto normativo que utiliza para reger a si próprio**. Existem, portanto, dois `agents.md` nominalmente semelhantes, porém com identidade e autoridade distintas:

```text
/agents.md       → norma/produto consumido pelo repositório atual
./src/agents.md  → produto agents.md atualmente em desenvolvimento
```

Essa distinção é **arquitetural e normativa**, NÃO apenas de caminho.

### 2.1. `/agents.md`: norma corrente

`/agents.md`:

* rege efetivamente este repositório;
* representa a versão do produto atualmente adotada;
* está propositalmente uma ou mais versões atrás de `./src/`;
* é **somente leitura nesta tarefa**;
* **NÃO PODE ser editado**.

Sua autoridade limita-se ao contexto do repositório que o consome.

### 2.2. `./src/agents.md`: produto desenvolvido

`./src/agents.md`:

* pertence ao produto em desenvolvimento;
* representa release futura/superior;
* PODE conter conceitos, mecanismos e regras ainda inexistentes na versão consumida;
* NÃO rege automaticamente o repositório atual;
* NÃO DEVE ser rebaixado à versão de `/agents.md`.

Formalmente:

```text
/agents.md       = CURRENT/CONSUMED
./src/agents.md  = SOURCE/DEVELOPED
```

A coincidência de basename **NÃO implica identidade normativa**.

## 3. Fronteira absoluta entre os dois `agents.md`

Existe defasagem proposital entre as duas versões. Portanto, é PROIBIDO assumir:

```text
regra ∈ ./src/agents.md ⇒ regra ∈ /agents.md
regra ∈ /agents.md      ⇒ mesma regra/força/escopo ∈ ./src/agents.md
mesmo nome              ⇒ mesma versão/autoridade/contexto
```

É igualmente PROIBIDO:

* aplicar automaticamente ao repositório uma regra exclusiva de `./src/`;
* tratar `./src/agents.md` como norma corrente;
* usar `/agents.md` como representação do produto mais recente;
* inferir ausência/revogação em `./src/` porque algo não existe em `/agents.md`;
* usar `/agents.md` como justificativa/modelo para **regredir** evoluções válidas de `./src/`;
* aplicar retroativamente regras futuras apenas porque ambas as versões coexistem;
* copiar mecanicamente conceitos, precedências ou estruturas entre elas;
* resolver divergências sem primeiro determinar **arquivo, versão, papel, escopo e autoridade**.

A precedência é **contextual, NÃO global**.

## 4. Não regressão cruzada

A versão consumida mais antiga NÃO estabelece teto para o produto futuro:

```text
/agents.md mais antigo
NÃO autoriza
regressão de ./src/agents.md
```

Se `./src/` já contém regra, arquitetura, restrição ou mecanismo mais evoluído, ele DEVE ser preservado.

Inversamente, a evolução de `./src/` NÃO adquire autoridade retroativa sobre este repositório até ser formalmente adotada.

Não pode haver **evasão de fronteira normativa em nenhuma direção**.

## 5. Normatizar permanentemente essa distinção

Inspecione obrigatoriamente:

* `./src/agents.md`;
* RCF(s) aplicável(is) ao produto;
* normas correlatas de arquitetura/governança.

Se a distinção entre **norma consumida** e **produto desenvolvido**, especificamente para repositórios que constroem o próprio `agents.md`, estiver ausente, implícita, dispersa, ambígua ou insuficientemente rigorosa, **reforce-a agora**.

A finalidade é que esta explicação **NÃO precise ser repetida em solicitações futuras**.

A norma/RCF DEVE tornar inequívoco que, em um repositório construtor:

1. versão consumida e versão-fonte podem coexistir;
2. a consumida rege o repositório corrente;
3. a versão em `./src/` é produto em desenvolvimento, não autoridade corrente;
4. divergência entre ambas pode ser legítima por versão;
5. nenhuma diretiva atravessa essa fronteira por inferência;
6. versão anterior NÃO pode regredir a posterior;
7. versão posterior NÃO pode ser aplicada retroativamente sem adoção;
8. comparação exige identificar versão, papel, escopo e autoridade;
9. igualdade nominal NÃO significa identidade normativa.

Isso DEVE constituir **contrato normativo forte**, não mera observação explicativa.

Use `DEVE`, `NÃO DEVE`, `É PROIBIDO`, precedências e critérios verificáveis onde aplicáveis.

### 5.1. Alta densidade normativa

Ao reforçar `./src/agents.md` e RCF:

* centralize o conceito no menor ponto normativo adequado;
* prefira uma única definição forte + referências internas;
* elimine redundância real;
* una regras semanticamente equivalentes;
* NÃO replique esta explicação longa se uma formulação menor possuir igual cobertura;
* NÃO compacte mediante perda de força, escopo, exceções ou verificabilidade.

Objetivo:

```text
mínimo de tokens
+
máxima informação normativa
+
nenhuma perda semântica
```

## 6. Exemplo delimitador: `FT.implementados.md`

`FT.implementados.md` exemplifica concretamente a fronteira.

O conceito já PODE existir em `./src/`, enquanto `/agents.md`, por estar propositalmente atrás, ainda NÃO o possui.

Logo:

* NÃO imponha `FT.implementados.md` ao repositório corrente apenas porque existe em `./src/`;
* NÃO afirme que `/agents.md` já o normatiza sem evidência;
* NÃO use sua ausência em `/agents.md` para removê-lo, enfraquecê-lo ou regredi-lo em `./src/`;
* preserve-o como evolução do produto quando aplicável.

O exemplo delimita a regra geral; a segregação NÃO se limita a esse arquivo.

## 7. Inspeção obrigatória de `continue.ia`

Antes de corrigir:

1. leia a governança corrente relevante, especialmente `/agents.md`, `agents.local.md`, `continue.ia` e equivalentes;
2. mantenha `/agents.md` estritamente somente leitura;
3. inspecione separadamente `./src/agents.md`, RCFs e mecanismos relacionados como **produto de versão superior**;
4. localize regras atuais/históricas sobre:

   * ciclo de vida de FTs;
   * conteúdo de `continue.ia`;
   * conclusão e validação de TO-DOs;
   * histórico;
   * subroteamento;
   * economia de tokens/contexto;
   * não regressão;
5. determine por que FTs históricas permaneceram acumuladas;
6. identifique se a regra contra crescimento cumulativo:

   * existe e foi desobedecida;
   * existe, mas é fraca/ambígua;
   * foi implementada parcialmente;
   * foi removida/enfraquecida;
   * existe apenas na versão superior;
   * existe nos dois contextos com escopos diferentes.

NÃO confunda ausência de cumprimento com ausência da regra.

## 8. Contrato de `continue.ia`

`continue.ia` e análogos DEVEM representar **estado operacional corrente**, NÃO histórico cumulativo.

Uma FT PODE permanecer nele somente enquanto:

* ainda estiver ativa; ou
* estiver tecnicamente concluída, mas seu TO-DO/artefato correspondente **ainda aguardar validação do desenvolvedor**.

Quando ocorrer:

```text
implementação concluída
+
validação do desenvolvedor concluída
```

a FT DEVE sair do estado corrente.

`continue.ia` NÃO DEVE funcionar como:

* histórico permanente;
* changelog;
* arquivo morto;
* catálogo integral de FTs;
* registro cumulativo das implementações.

## 9. Crescimento contínuo é violação

É requisito explícito:

> `continue.ia` NÃO PODE crescer indefinidamente pela acumulação de FTs encerradas.

Seu tamanho PODE aumentar conforme trabalho realmente ativo, mas DEVE diminuir à medida que esse trabalho deixa o ciclo operacional.

Rastreabilidade NÃO autoriza retenção histórica dentro do arquivo corrente.

## 10. Concluído, mas pendente de validação

FT tecnicamente concluída cujo TO-DO ainda aguarde validação humana DEVE permanecer, porém em forma **mínima e operacional**, contendo apenas o necessário para:

* identificar FT e TO-DO;
* registrar conclusão técnica;
* registrar pendência de validação;
* permitir retomada objetiva se houver correção.

Histórico extenso, logs e decisões consolidadas NÃO DEVEM permanecer ali sem necessidade operacional.

## 11. FTs históricas

FT concluída **e validada** DEVE deixar o corpo principal de `continue.ia`.

Quando seu histórico precisar ser preservado, use o mecanismo válido para a **governança corrente**, organizado para evitar leitura de arquivos grandes:

```text
estado corrente pequeno
→ índice/rota mínima
→ subarquivo histórico específico sob demanda
```

Os históricos DEVEM, conforme já normatizado:

* ser pequenos;
* segmentados;
* semanticamente coesos;
* roteáveis;
* carregáveis apenas quando pertinentes.

É inadequado:

```text
continue.ia
→ milhares de linhas históricas
→ leitura integral para encontrar uma FT
```

Rastreabilidade e baixo custo de contexto DEVEM coexistir.

## 12. Não importar arquitetura futura indevidamente

Se mecanismos como `FT.implementados.md` pertencerem apenas à governança superior em `./src/`:

* NÃO os introduza automaticamente no repositório atual;
* use aqui o mecanismo histórico compatível com `/agents.md` e suas extensões válidas;
* preserve e aperfeiçoe separadamente a arquitetura futura em `./src/`.

## 13. Diagnóstico obrigatório da causa

Determine objetivamente se houve:

1. desobediência à norma;
2. ambiguidade/baixa força normativa;
3. implementação incompleta;
4. remoção;
5. enfraquecimento progressivo;
6. divergência entre norma e estado real;
7. diferença legítima entre releases;
8. confusão entre norma consumida e produto desenvolvido;
9. falha da própria norma em explicitar suficientemente essa segregação.

A correção DEVE atingir a **causa**.

Apenas encurtar `continue.ia` NÃO atende.

## 14. Correção do estado corrente

Classifique todas as FTs existentes em `continue.ia`:

* ativa;
* concluída, pendente de validação;
* concluída e validada.

Depois:

* mantenha somente as duas primeiras;
* para concluídas/validadas, preserve o histórico exigido no mecanismo correto da governança corrente;
* crie/ajuste subarquivos roteáveis quando já previstos;
* atualize o roteamento necessário;
* NÃO perca informação histórica obrigatória;
* NÃO introduza arquitetura exclusiva de release superior sem base normativa corrente.

A classificação DEVE ser semântica, NÃO baseada apenas em idade, linhas ou nomenclatura.

## 15. Reforço da governança corrente

`/agents.md` **NÃO PODE ser editado**.

Se for necessário reforçar o cumprimento corrente, use apenas superfícies permitidas pela própria governança, como `agents.local.md`, normas auxiliares ou mecanismos equivalentes.

O reforço DEVE tornar inequívoco, sem duplicação desnecessária, que:

* `continue.ia` contém estado corrente;
* somente FTs ativas ou pendentes de validação permanecem nele;
* concluídas/validadas DEVEM sair;
* histórico necessário é externalizado/subroteado;
* acumulação cumulativa é violação;
* rastreabilidade NÃO justifica arquivo corrente monolítico;
* histórico deve minimizar leitura/tokenização;
* futuras edições NÃO PODEM enfraquecer silenciosamente esse contrato.

## 16. Reforço do produto em `./src/` e do RCF

Inspecione `./src/agents.md` e RCFs separadamente da governança corrente.

Se necessário:

* reforce a proibição de crescimento cumulativo de estado operacional;
* preserve mecanismos futuros mais evoluídos;
* corrija qualquer possibilidade de regressão;
* normatize de forma permanente a fronteira entre `CURRENT/CONSUMED` e `SOURCE/DEVELOPED`.

O RCF aplicável DEVE, se ainda não o fizer com suficiente força, estabelecer de forma compacta que:

> em repositório que desenvolve o próprio mecanismo normativo que consome, a instância consumida e a instância-fonte são artefatos versionados distintos, com autoridades e escopos segregados.

A regra DEVE impedir explicitamente:

* shadowing/confusão conceitual;
* herança implícita;
* vazamento de autoridade;
* retroatividade;
* regressão por compatibilização;
* equivalência presumida por nome/caminho análogo.

Evite pseudorrigor e repetição. **Quanto menor a formulação com mesma cobertura e força, melhor.**

## 17. Regra permanente de resolução de contexto

Antes de aplicar regra proveniente de qualquer `agents.md` em um repositório construtor, a IA DEVE determinar:

```text
qual arquivo?
qual versão?
qual papel?
qual escopo?
qual autoridade?
```

Sem essas respostas, equivalência NÃO PODE ser presumida.

Essa regra DEVE ficar suficientemente normatizada para que futuras IAs **não necessitem receber novamente esta explicação**.

## 18. Não regressão

É PROIBIDO:

* editar `/agents.md`;
* reduzir rastreabilidade válida;
* apagar histórico obrigatório;
* enfraquecer normas;
* adaptar norma para legitimar estado incorreto;
* usar `/agents.md` para regredir `./src/`;
* usar `./src/agents.md` como autoridade corrente;
* misturar contratos exclusivos de releases diferentes;
* eliminar informação material para reduzir tokens;
* aumentar texto normativo sem ganho real de informação/força.

## 19. Validação separada dos dois contextos

### Repositório corrente

Confirme que:

* `/agents.md` permaneceu intacto;
* `continue.ia` ficou coerente com a governança corrente;
* FTs concluídas/validadas saíram do estado operacional;
* pendentes de validação ficaram compactas;
* histórico obrigatório foi preservado e subroteado;
* regra futura não foi importada indevidamente.

### Produto em desenvolvimento

Confirme que:

* `./src/agents.md` foi tratado como produto;
* nenhuma evolução foi removida/enfraquecida;
* mecanismos futuros continuam íntegros;
* o crescimento cumulativo está suficientemente vedado;
* a segregação entre produto e norma consumida ficou explícita;
* RCF e produto permitem a uma IA futura reconhecer essa fronteira autonomamente.

## 20. Autoauditoria normativa

Antes de concluir, confirme silenciosamente:

1. nenhuma informação ou força normativa foi perdida;
2. `/agents.md` NÃO foi alterado;
3. nenhuma regra atravessou contextos implicitamente;
4. nenhuma evolução de `./src/` regrediu;
5. nenhuma regra futura foi aplicada retroativamente;
6. a defasagem intencional foi preservada;
7. `continue.ia` contém somente estado realmente corrente;
8. histórico pode ser localizado sem leitura monolítica desnecessária;
9. a causa do crescimento foi eliminada;
10. `./src/agents.md` e RCF distinguem explicitamente os dois contextos;
11. a distinção independe de nova explicação externa;
12. as alterações normativas possuem a **menor quantidade possível de tokens para igual cobertura, rigor e exigibilidade**;
13. qualquer texto que possa ser removido/fundido sem perda semântica foi eliminado;
14. nenhuma compactação ocultou exceção, precedência, nuance ou obrigação.

## 21. Critério absoluto de aceite

A tarefa somente estará concluída quando:

1. a causa do crescimento de `continue.ia` estiver identificada e corrigida;
2. o arquivo representar somente estado operacional corrente;
3. FTs concluídas/validadas tiverem destino histórico correto;
4. a recorrência estiver normativamente impedida;
5. `/agents.md` permanecer intacto;
6. `/agents.md` e `./src/agents.md` tiverem sido tratados como entidades distintas;
7. nenhuma diretiva tiver atravessado a fronteira sem adoção/base normativa;
8. nenhuma evolução de `./src/` tiver regredido;
9. conceitos exclusivos da release futura, como `FT.implementados.md` quando aplicável, permanecerem no contexto correto;
10. `./src/agents.md` e RCF possuírem distinção suficientemente explícita, forte e permanente para repositórios construtores;
11. uma futura IA puder distinguir autonomamente **norma consumida** de **produto desenvolvido**;
12. normas/RCFs alterados estejam em **máxima densidade informacional**, sem redundância removível e sem perda de força, rigor, escopo ou informação.

## Saída final

Implemente diretamente no repositório.

Ao concluir, relate de forma **ultrassucinta**:

* causa encontrada;
* estado final de `continue.ia`;
* destino das FTs históricas;
* reforço operacional realizado;
* confirmação de que `/agents.md` NÃO foi alterado;
* diferenças relevantes encontradas em `./src/agents.md`;
* reforços feitos em `./src/agents.md` e RCF;
* mecanismo que tornou permanente a segregação;
* validações executadas.

NÃO considere a redução de linhas, isoladamente, prova de correção.

NÃO considere igualdade nominal dos `agents.md` igualdade normativa.

NÃO conclua enquanto a separação **CURRENT/CONSUMED ≠ SOURCE/DEVELOPED** ainda depender de explicação externa.


