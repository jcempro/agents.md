# Solicitação remota — FT-103

Origem: issue `jcempro/agents.md#12`, aberta por `JeanCarloEM` em 2026-09-15T19:08:13Z e consultada em 2026-09-15T16:23:16-03:00.
URL: https://github.com/jcempro/agents.md/issues/12
Evidência JSON (`gh issue view 12`): SHA-256 `e2c8d662b14009621471230f48e98331f20800723d745adf81b59336fe77a866`.
Estado remoto observado: aberta, aprovada e em desenvolvimento; comentário oficial vincula a implementação à FT-103.
Estado local: implementação autorizada pelo prompt humano de 2026-09-15; release/publicação permanece pendente de versão explícita.

## Título

Atualizador falha em consumidores com package.json type=module

## Falha

Em um repositório consumidor cujo `package.json` contém `"type": "module"`, o comando oficial abaixo falha antes de verificar ou aplicar atualização:

```text
npm run agents:update -- --check
ReferenceError: module is not defined in ES module scope
at .ia.rules/scenarios/release/scripts/package-registry.js
```

## Causa observada

O runtime distribuído define uma fronteira CommonJS em `.ia.rules/core/runtime/scripts/package.json`, mas `repo-tools.js` requer `../../../scenarios/release/scripts/package-registry`. Esse módulo fica fora da fronteira, herda o tipo ESM do consumidor e, ao executar `module.exports`, falha.

## Impacto

`agents:update` fica indisponível para consumidores ESM. A correção local do artefato gerenciado não é adequada porque quebra a propriedade e a convergência da governança instalada.

## Critérios de aceite

- Manter todo artefato CommonJS distribuído sob fronteira CommonJS válida, independentemente do `type` do consumidor.
- Testar `agents:update -- --check` em fixture consumidora com `"type": "module"`.
- Validar requires que atravessem as subárvores de runtime e cenários.
- Corrigir pela fonte TypeScript, manifesto/build e nova release do construtor.

## Complementações remotas preservadas

- 2026-09-15T19:08:24Z, `github-actions`: alta recomendação técnica; lacuna reproduzível, reutilizável e com evidências suficientes; decisão manual exigida. Marcador `agents-inbox:282d3604d34e0373`.
- 2026-09-15T19:16:21Z, `github-actions`: implementação iniciada na FT-103. Marcador `agents-development:12:FT-103`.

## Delimitação local

O contrato material já existe em `RCF.md` §6: runtime CommonJS distribuído deve levar fronteira própria e não herdar `type` incompatível do consumidor. A FT-103 implementa esse requisito sem ampliar comportamento. O `update:agents --check` prévio falhou com `Runtime da release falhou com codigo 2`; a falha é registrada como evidência de pré-condição e não autoriza atualização material automática.
