# Cenário Web Page Like — roteador

Extensão de `./AGENTS.md` §17. Aplicar `MN-SCEN`, `MN-REF`, `MN-2119`, `MN-DENS` e `MN-PRES`. RCF específico prevalece na matéria do produto; este arquivo contém somente roteamento e NÃO incorpora regra dos módulos.

## Predicados e ordem

| ID | Predicado autoritativo | Módulo | Dependências |
| --- | --- | --- | --- |
| `WEB-BROWSER` | entrega é executada ou consumida por navegador/engine web | `./capabilities/browser.md` | nenhuma |
| `WEB-STATIC` | RCF/configuração declara gerador, hospedagem estática ou publicação como arquivos sem runtime de servidor | `./capabilities/static-hosting.md` | `WEB-BROWSER` |
| `WEB-EDITORIAL` | RCF declara artigo, post, sermão, ensaio, notícia ou outra classe editorial nomeada | `./capabilities/editorial.md` | `WEB-BROWSER`; `WEB-STATIC` somente se verdadeiro |

Resolver na ordem da tabela. Evidência válida é declaração do RCF, configuração autoritativa ou contrato da entrega; extensão, nome de ferramenta, arquivo isolado ou analogia NÃO tornam predicado verdadeiro. Predicado falso dispensa o módulo sem abri-lo. Predicado indeterminado, dependência ausente/circular ou módulo ilegível DEVE bloquear a aplicação com a evidência faltante.

## Precedência e registro

Módulo selecionado aplica integralmente após suas dependências. Regra comum permanece em AGENTS/microconceito/contrato; regra do produto permanece no RCF. Memória DEVE registrar ID, resultado, evidência e dispensa. Contradição usa o formato de `AGENTS.md` §17.
