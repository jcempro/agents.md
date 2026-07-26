# Fonte integral — github:jcempro/agents.md#10

- Capturado em: 2026-07-25T22:45:43-03:00
- URL: https://github.com/jcempro/agents.md/issues/10
- Título: `Redução estrutural de AGENTS.md e carregamento sob demanda do contexto normativo`
- Corpo SHA-256 (UTF-8 da API): `34B41556B3A702755784277042167DA3CFA443D52C50B6DA842C09CCD238C6C4`
- FTs: FT-061, FT-063
- RCF: arquitetura normativa, roteamento, contexto, distribuição e compatibilidade
- Estado de incorporação: preservado; aguardando RCF

## Corpo

# TODO — Redução estrutural de `AGENTS.md` e carregamento sob demanda do contexto normativo

Leia integralmente o contexto, `RCF.md` e as normas existentes antes de iniciar. Analise a arquitetura atual, o fluxo de injeção de contexto das IAs e o custo efetivo de tokens antes de propor qualquer alteração.

## Objetivo

Redesenhar a estrutura de `AGENTS.md` para minimizar o custo recorrente de contexto imposto pelos clientes de IA que anexam automaticamente esse arquivo a cada solicitação, preservando integralmente o comportamento, a rastreabilidade e a capacidade de roteamento atualmente existentes.

A solução DEVE reduzir drasticamente o volume do arquivo `AGENTS.md` sem reduzir a informação efetivamente disponível quando ela for necessária.

## Fundamentação

Em diversos clientes de IA, `AGENTS.md` é automaticamente anexado ao prompt sem possibilidade de intervenção da própria IA.

Consequentemente, todo token presente nesse arquivo passa a compor o custo de praticamente todas as solicitações, inclusive quando:

- seu conteúdo já integra a memória ativa;
- o contexto permanece inalterado;
- nenhuma nova rota precisa ser carregada;
- nenhuma decisão depende de releitura do conteúdo completo.

Embora o próprio `AGENTS.md` já determine que seu conteúdo NÃO DEVE ser relido quando já fizer parte do contexto válido, essa orientação ocorre somente após o arquivo já ter sido anexado ao prompt, não eliminando o custo de transmissão e leitura inicial.

A solução deve atuar na causa estrutural do problema, e não apenas em sua utilização.

## Requisitos

### 1. Limite máximo de `AGENTS.md`

Normatize explicitamente que o arquivo `AGENTS.md` DEVE possuir, permanentemente, no máximo **500 tokens**.

Esse limite é mandatário.

Nenhuma evolução futura PODE extrapolar esse limite.

Caso novas regras excedam essa capacidade, elas DEVEM ser redistribuídas para arquivos auxiliares.

### 2. Nova responsabilidade de `AGENTS.md`

`AGENTS.md` DEVE tornar-se exclusivamente um ponto de entrada do contexto.

Seu conteúdo DEVE limitar-se ao estritamente necessário para:

- identificar o projeto;
- definir precedência;
- relembrar rapidamente o contexto;
- indicar os arquivos normativos relevantes;
- orientar o roteamento;
- informar quando a leitura complementar é realmente necessária.

Ele NÃO DEVE conter o corpo completo das normas.

### 3. Arquivo(s) complementar(es)

O conteúdo atualmente existente em `AGENTS.md` DEVE ser migrado para um ou mais arquivos auxiliares, por exemplo:

```text
.ia.rules/agents.inc.md
````

ou outra nomenclatura arquiteturalmente mais adequada.

Caso produza melhor organização, esse conteúdo PODE ser subdividido em múltiplos arquivos menores, organizados por responsabilidade, domínio ou rota.

Essa segmentação DEVE permanecer compatível com a arquitetura já definida em `RCF.md`.

Ela passa a receber as atribuições que antes pertencias ao agents.md, embora, ao agents.md como ponto de entrada permaneçam ativas as mesmas restrições de antes., quanto a edição, autoridade normativa como `modus operant` da IA, roteada para o seu equivalente `.ia.rules/agents.inc.md` entre outros, apenas o conteúdo direto de seu arquivo é que passa a ser delegado.

### 4. Carregamento sob demanda

Os arquivos auxiliares NÃO DEVEM ser considerados de leitura obrigatória.

`AGENTS.md` DEVE apenas indicar sua existência e estabelecer que sua leitura ocorre somente quando realmente necessária.

A decisão de carregamento DEVE permanecer sob responsabilidade da IA.

São exemplos válidos:

* mudança de rota;
* ausência do contexto necessário;
* perda de memória contextual;
* necessidade de consultar regras ainda não carregadas;
* resolução de conflitos normativos.

Na ausência dessas condições, a IA NÃO DEVE reler os arquivos auxiliares.

### 5. Preservação integral

A migração NÃO DEVE:

* eliminar regras;
* resumir normas;
* reduzir precisão;
* alterar precedências;
* modificar interpretação;
* perder exemplos relevantes;
* reduzir rastreabilidade.

Reduz-se apenas o conteúdo de `AGENTS.md`.

As normas completas permanecem preservadas nos arquivos auxiliares.

### 6. Arquitetura modular

Avalie se a divisão do conteúdo em múltiplos arquivos menores produz benefícios como:

* menor custo de carregamento;
* roteamento mais preciso;
* leitura seletiva;
* manutenção simplificada;
* menor acoplamento;
* maior reutilização.

Caso positivo, implemente essa segmentação.

Caso contrário, justifique tecnicamente a manutenção em arquivo único.

### 7. Compatibilidade

A reorganização NÃO DEVE alterar:

* comportamento do construtor;
* precedência normativa;
* resolução de rotas;
* mecanismos de contexto;
* integração com `RCF.md`;
* integração com `continue.ia`;
* workflows;
* scripts;
* geração do release;
* compatibilidade com clientes que reconhecem `AGENTS.md`.

### 8. Atualização normativa

Atualize toda a documentação necessária para refletir a nova arquitetura.

Sempre que houver referência ao conteúdo anteriormente localizado em `AGENTS.md`, ela DEVE passar a apontar para o(s) arquivo(s) auxiliar(es) correspondente(s).

### 9. Validação

Após a implementação, valide:

* quantidade de tokens de `AGENTS.md`;
* carregamento correto das rotas;
* resolução das referências;
* preservação das precedências;
* funcionamento do construtor;
* compatibilidade com clientes que anexam automaticamente `AGENTS.md`;
* inexistência de perda normativa.

## Critérios de aceite

A implementação somente será considerada concluída quando:

* `AGENTS.md` possuir, no máximo, **500 tokens**;
* atuar exclusivamente como ponto de entrada e roteamento;
* todo o conteúdo normativo anterior estiver preservado em arquivo(s) auxiliar(es);
* os arquivos auxiliares forem carregados apenas quando realmente necessários;
* nenhuma regra, precedência, nuance ou rastreabilidade tiver sido perdida;
* a nova arquitetura reduzir significativamente o custo recorrente de contexto sem alterar o comportamento funcional do construtor;
* a organização permanecer integralmente aderente às normas estabelecidas em `RCF.md`.
