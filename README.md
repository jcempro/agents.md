# agents-governance

Governança operacional portátil para agentes de IA, distribuída como contratos, cenários, configuração e runtime reutilizáveis. Este repositório exerce simultaneamente os papéis de Repositório Final, para a própria operação, e de Construtor, ao gerar e publicar a Norma.

[![Builder - matriz de runtimes](https://github.com/jcempro/agents.md/actions/workflows/runtime-matrix.yml/badge.svg?branch=dev)](https://github.com/jcempro/agents.md/actions/workflows/runtime-matrix.yml?query=branch%3Adev)
[![Builder - mapa normativo](https://github.com/jcempro/agents.md/actions/workflows/normative-graph.yml/badge.svg?branch=dev)](https://github.com/jcempro/agents.md/actions/workflows/normative-graph.yml?query=branch%3Adev)
[![Builder - rastreabilidade RCF](https://github.com/jcempro/agents.md/actions/workflows/rcf-trace.yml/badge.svg?branch=dev)](https://github.com/jcempro/agents.md/actions/workflows/rcf-trace.yml?query=branch%3Adev)
[![Release](https://github.com/jcempro/agents.md/actions/workflows/release.yml/badge.svg?branch=dev)](https://github.com/jcempro/agents.md/actions/workflows/release.yml?query=branch%3Adev)
[![Inbox de issues](https://github.com/jcempro/agents.md/actions/workflows/issues-inbox.yml/badge.svg)](https://github.com/jcempro/agents.md/actions/workflows/issues-inbox.yml)
[![Issues aprovadas](https://github.com/jcempro/agents.md/actions/workflows/approved-issues.yml/badge.svg)](https://github.com/jcempro/agents.md/actions/workflows/approved-issues.yml)
[![Node.js 24+](https://img.shields.io/badge/Node.js-24%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![OS: Ubuntu, macOS e Windows](https://img.shields.io/badge/OS-Ubuntu%20%7C%20macOS%20%7C%20Windows-4c566a)](#plataformas-runtimes-e-hooks)
[![Hooks: core, release, publish e dev-live](https://img.shields.io/badge/Hooks-core%20%7C%20release%20%7C%20publish%20%7C%20dev--live-6f42c1)](#plataformas-runtimes-e-hooks)
[![GitHub Release](https://img.shields.io/github/v/release/jcempro/agents.md?display_name=tag&sort=semver)](https://github.com/jcempro/agents.md/releases/latest)
[![Licença MPL-2.0](https://img.shields.io/github/license/jcempro/agents.md)](LICENSE)

Os badges de workflow são indicadores dinâmicos do GitHub: verde representa `passing`, vermelho representa `failing` e cinza/indisponível indica execução ausente, ignorada ou ainda sem resultado para o filtro apresentado. O clique abre o histórico correspondente; o badge não substitui a inspeção do job e de seus logs.

## Estado atual e arquitetura

| Superfície | Situação vigente |
| --- | --- |
| Versão publicada | `0.0.23`; a release mais recente é resolvida pelo badge e pelo link acima |
| Desenvolvimento | alterações em `dev`; uma FT concluída deve convergir para `main` antes do encerramento |
| Fonte distribuível | `src/` contém exclusivamente fontes com efeito direto e manifestado no produto |
| Infraestrutura interna | `constructor/`, `config/`, `test/` e workflows internos permanecem fora do payload |
| Produto publicado | `dist/` e o ZIP versionado contêm somente a allowlist raiz e a árvore `.ia.rules/` manifestada |
| Entrada normativa | `AGENTS.md` é o entrypoint curto; `.ia.rules/agents.inc.md` preserva o corpo integral sob carregamento condicionado |
| Configuração | `.ia.rules/config/` rege o consumidor; `config/` é exclusiva do Construtor |
| Estado operacional | `.ia.rules/continue.ia`; [handoff.md](handoff.md) é sua projeção gerada |

`src/` não é a raiz da aplicação nem um depósito de material interno. Estudos, avaliações, relatórios e experimentos do próprio Construtor ficam fora dela e nunca integram `dist/`, pacote ou release. A seleção do conteúdo publicado é positiva, perfilada e validada por manifesto, mapa de distribuição e hashes.

<!-- agents:normative-metrics:start -->
### Métricas do grafo normativo

Tokenizer exato: `tiktoken 0.13.0` (`o200k_base`, alvo `gpt-4o`); revisão `a9bdfdf`; fonte `76fc322168a7`. [Mapa completo](src/.ia.rules/generated/normative-map.md).

O desvio padrão é populacional e considera uma observação por rota válida.

| Terminal | Rotas | Mínimo | Média | Mediana | Desvio padrão | Máximo |
|---|---:|---:|---:|---:|---:|---:|
| Folha | 29 | 437 | 1588.79 | 1211 | 1430.75 | 7702 |
| Híbrido | 6 | 338 | 1174.83 | 1381.0 | 485.84 | 1617 |
<!-- agents:normative-metrics:end -->

## Contratos de scripts

O contrato tipado reutilizável fica em `.ia.rules/core/contracts.md`; os metaarquivos de CLI e contexto ficam em `.ia.rules/meta/`. O índice `.ia.rules/meta/index.json` relaciona scripts e contextos mínimos (`build`, `release`, `publish`, `maintenance`, `update`, `validation` ou `ia`). Especializações do consumidor pertencem a `agents.local.md`, `.ia.rules/local/` ou `.ia.rules/hooks/` e não são sobrescritas por `agents:update`.

No produto e no release, configuração central reside exclusivamente em `.ia.rules/config/`: `core.json` contém defaults portáteis e `schema.json` versiona o formato. A configuração exclusiva do construtor permanece infraestrutura raiz e não integra o payload. Precedência: CLI → ambiente/`AGENTS_CONFIG_JSON` → configuração local → repositório → core. Hooks de `publish` e `dev-live` usam `.ia.rules/hooks/<operacao>[.pre|.post].js`.

## Plataformas, runtimes e hooks

- A matriz do Construtor executa `npm test` em `ubuntu-latest`, `macos-latest` e `windows-latest`, com Node.js 24 e Python 3.14.
- Todo workflow distribuível que invoque Node.js, npm, npx, JavaScript ou TypeScript deve materializar Node.js 24 ou superior antes da primeira invocação. Workflow sem execução Node não instala runtime desnecessário.
- O release usa hooks opcionais em `.ia.rules/hooks/core.js` e `.ia.rules/hooks/release.js`, com os eventos `prepare`, `verify` e `published`.
- `publish` e `dev-live` usam cadeias independentes `pre` → `main` → `post`: `.ia.rules/hooks/<operacao>.pre.js`, `.ia.rules/hooks/<operacao>.js` e `.ia.rules/hooks/<operacao>.post.js`.
- Hook ausente não cria comportamento implícito. Sem hook principal, `publish` retorna `PUBLISH_NAO_APLICAVEL` e `dev-live` retorna `DEV_LIVE_NAO_APLICAVEL`.
- Hooks de `publish`/`dev-live` recebem `operation`, `args`, `configuration` e `rootDir`; hooks de release recebem o evento e o payload validado com `version`/`asset`. Falha interrompe as fases seguintes e preserva o código de erro.

## Uso rápido

- `npm run clean`: remove `dist/`, `index.json` e `handoff.md` gerados.
- `npm run check`: executa a verificação local completa.
- `npm run release -- <versao>`: executa o ciclo completo all-in-one e acompanha a comprovação remota.
- `npm run publish -- [args]`: executa o fluxo hookable de publicação de conteúdo; neste construtor retorna `PUBLISH_NAO_APLICAVEL` sem hook local.
- `npm run update:agents -- [--check|--dry-run]`: atualiza, commita e publica a governança; é o nome canônico.
- `npm run dev-live`: expõe a configuração/hook local padronizado em `127.0.0.1:4000` por padrão.
- `npm run release:trigger -- <versao>`: cria o gatilho transitório `release` para o workflow técnico.
- `npm run release:publish -- <versao>`: executa o ciclo completo de release e aguarda a comprovação remota.
- `npm run agent:status`: resume capacidades canônicas.
- `npm run agent:filter -- --run <comando> [args]`: entrega a saída do comando em JSONL compacto e ordenado para IA.
- `npm run agent:index`: gera `index.json` minificado a partir de `src/`.
- `npm run agent:dist`: gera `dist/`, `dist/package.json`, `dist/release.json` e pacote `agents-v<versao>.zip`.
- `npm run agent:verify`: valida scripts, indexador e dist.
- `npm run agent:autoupdate`: alias transitório de `update:agents`; `agents:autoupdate`, `agent:agents` e `agents:update` permanecem equivalentes durante a migração.

## Orquestradores all-in-one

`release`, `publish` e `update:agents` são as três entradas universais. Os comandos `agent:*` e `shared:*` são implementação operacional, diagnóstico ou compatibilidade; integrações devem chamar a entrada universal correspondente para não duplicar o fluxo.

| Comando | Finalidade | Efeito externo normal | Modo seguro |
| --- | --- | --- | --- |
| `npm run release -- <versão>` | construir, validar, versionar, publicar e comprovar uma release | commits, pushes, tag, GitHub Release, asset, fechamento de issues vinculadas e convergência de branches | `--dry-run` |
| `npm run publish -- [args]` | publicar conteúdo de Negócio pelo hook oficial do repositório | definido exclusivamente pelo hook `publish.js` aplicável | ausência do hook principal resulta em `PUBLISH_NAO_APLICAVEL` |
| `npm run update:agents -- [opções]` | convergir a governança gerenciada para a release autenticada | backup de divergências, atualização, commit e push da branch atual | `--check` ou `--dry-run` |

### `release`: release técnico completo

Pré-condições: branch `dev` por padrão, worktree limpo, versão semântica explícita e ainda não publicada, workflow `.github/workflows/release.yml`, remoto configurado e permissão de push. GitHub CLI autenticado é necessário para acompanhar e comprovar o resultado; sem `gh`, o gatilho é enviado e a observação remota fica pendente.

```powershell
# Apenas inspeciona branch, árvore, tag, workflow e configuração.
npm run release -- 0.0.24 --dry-run

# Executa o ciclo completo e acompanha o GitHub Actions.
npm run release -- 0.0.24

# Executa até o envio do gatilho, sem aguardar o workflow remoto.
npm run release -- 0.0.24 --no-watch

# Substitui, de forma explícita, defaults da configuração central.
npm run release -- 0.0.24 --branch dev --primary main --remote origin --workflow release.yml

# Exibe a assinatura aceita.
npm run release -- --help
```

O fluxo cria commits separados para versão e artefato, gera e valida `dist/`, envia o arquivo-gatilho `release`, publica tag/asset/GitHub Release, executa hooks, conclui issues vinculadas à versão e confirma a convergência `dev`/`main`. Uma execução interrompida depois do commit de preparação é retomada pelo mesmo comando e versão, sem repetir a etapa já comprovada.

Falhas comuns são conclusivas: `BRANCH_RELEASE_INVALIDA`, `WORKTREE_NAO_LIMPO`, `VERSAO_JA_PUBLICADA`, `WORKFLOW_RELEASE_AUSENTE` e `CONVERGENCIA_REMOTA_PENDENTE`. Não use `--force`, rebase destrutivo ou descarte de estado para contorná-las.

### `publish`: publicação de conteúdo por hooks

`publish` não significa release. O cenário somente se aplica quando o RCF do repositório declarar conteúdo de Negócio publicável e existir o hook principal `.ia.rules/hooks/publish.js`. Argumentos posteriores a `--` são entregues ao hook sem interpretação material pelo núcleo.

```powershell
# Neste Construtor, sem hook principal, retorna PUBLISH_NAO_APLICAVEL.
npm run publish

# Exemplo de argumentos definidos pelo repositório consumidor.
npm run publish -- --channel web --locale pt-BR
```

Exemplo mínimo de hook local:

```js
// .ia.rules/hooks/publish.js
module.exports = async function publish(context) {
  return {
    published: true,
    arguments: context.args,
    root: context.rootDir,
  };
};
```

Hooks `publish.pre.js` e `publish.post.js` podem preparar e verificar o processo, mas não substituem o hook principal nem devem duplicar build, hospedagem ou validação já oficiais.

### `update:agents`: convergência segura da governança

Sem opção, a atualização obtém uma release autenticada, valida manifesto, mapa e runtime, preserva divergências gerenciadas em ZIP, aplica a transição de forma transacional, commita somente o núcleo recebido e publica a branch atual. Extensões locais, hooks e conteúdo fora do escopo gerenciado são preservados.

```powershell
# Consulta a release e retorna sucesso se atual; retorna código 2 se desatualizado.
npm run update:agents -- --check

# Mostra origem e plano de alterações, sem escrever, commitar ou publicar.
npm run update:agents -- --dry-run

# Converge, valida, commita e publica.
npm run update:agents

# Reexecuta a convergência quando a origem válida precisa ser reaplicada.
npm run update:agents -- --force

# Exibe a assinatura aceita.
npm run update:agents -- --help
```

Falha de download, integridade, handoff ou validação encerra sem fallback para o runtime antigo. Quando houver backup, o caminho `agents-governance-backups/YYYY-MM-DD/` é informado para inspeção e exclusão humana posterior.

### Evolução upstream de AGENTS.md

`./AGENTS.md` na raiz rege este repositório construtor; `./src/AGENTS.md` é a aplicação-fonte distribuível e não a sincroniza automaticamente. Em um consumidor, `npm run agent:upstream:check -- --offline` identifica o estado sem rede. A configuração local opcional `.ia.rules/upstream.json` ou `package.json.ia.rulesUpstream` declara `role` (`consumer`, `constructor` ou `dual`), `upstreamRepository`, candidato, limites e cache; candidato não é destino autoritativo.

- `agent:upstream:prepare -- <evidence.json>` sanitiza e grava proposta revisável em extensão local.
- `agent:upstream:publish -- <proposal.json> --authorize` verifica destino, duplicação e token externo antes de criar issue; sem `--authorize`, nenhuma ação externa ocorre.
- `agent:upstream:assess -- <proposal.json>` produz grau e resposta concisa para mantenedor; `agent:upstream:apply-assessment` exige autorização e pode notificar colaboradores somente por opção explícita.
- `agent:test:upstream` verifica sanitização e template sem depender de rede.

### Inbox construtora de issues

`.github/workflows/issues-inbox.yml` recebe somente eventos `issues` de abertura, edição, reabertura ou rotulagem. O payload é sanitizado antes de criar `.ia.rules/local/upstream/inbox/`; o workflow publica essa inbox como artefato por 30 dias e não inclui credenciais ou cabeçalhos.

- `agent:inbox:event -- <evento.json>` valida, sanitiza e indexa um evento localmente.
- `agent:inbox:evaluate -- <registro.json>` produz `rejected`, `not_recommended`, `recommended` ou `highly_recommended`, sem efeito externo.
- `agent:inbox:process -- <evento.json> --role constructor` encadeia indexação e avaliação; `--authorize` é obrigatório para comentário e label.
- `agent:inbox:fetch -- <numero> --role constructor` permite a execução manual; `--dry-run` não emite efeito remoto.
- `agent:inbox:apply -- <avaliacao.json> --role constructor --authorize` comenta recusas e não-recomendações; nos graus recomendados adiciona somente o label configurado e uma justificativa técnica curta. Aceite, fechamento, alteração de fonte e release permanecem decisões humanas.
- `agent:inbox:approve -- --issue <numero> --role constructor --authorize` registra o aceite humano aplicando `agents:approved` e o comentário `Aprovada para implementação.` de forma idempotente. Labels de recomendação, isoladamente, nunca autorizam implementação; a FT é criada e correlacionada pela sincronização posterior.
- `agent:inbox:sync-approved -- --role constructor` baixa todas as issues abertas com `agents:approved` e persiste a inbox sanitizada. O runtime 0.0.19 ainda importa uma FT genérica por identidade `github:<repositorio>#<numero>`; o contrato vigente exige reclassificá-la sem renumeração e criar a FT normativa ou de código complementar.
- `agent:inbox:start -- --role constructor --authorize` deve ser executado após o push da correlação; `agents:in-development` indica ciclo da issue ativo, não início de código. O comentário futuro deve listar ambas as FTs e seus estados.
- `agent:inbox:bind-release -- <versao> --role constructor` vincula à versão FTs correlacionadas concluídas. `agent:inbox:complete-release -- <versao> --role constructor --authorize` comenta, marca `agents:fixed` e fecha somente quando todas as FTs necessárias ao escopo da issue estiverem concluídas; a adequação do runtime permanece nas FTs de código abertas.

O workflow `approved-issues.yml` executa o mesmo ciclo por label, agenda horária ou despacho manual. O workflow `release.yml` vincula as FTs antes do artefato e só finaliza o release após atualizar todas as issues corrigidas pela versão.
- `agent:test:inbox` testa sanitização, classificação e índice idempotente sem rede.

### Atualização segura da governança

`update:agents` usa o manifesto versionado recebido no ZIP do release ou na branch primária como definição completa do núcleo gerenciado. Antes de commitar, o atualizador também prepara `.gitignore`, `package.json` e arquivos análogos necessários para permitir o versionamento do núcleo gerenciado; no caso de `.gitignore`, usa bloco delimitado e preserva regras locais. Após download e extração únicos, o bootstrap valida o runtime manifestado e passa bastão ao `update-agents.js` da própria release por estado HMAC; esse processo carrega dependências da release, trata o repositório somente como target e retoma sem repetir rede ou fase. Falha de integridade encerra sem fallback ao runtime antigo. O estado local anterior é consultado apenas para converter formatos, gerar backup compactado de divergência e remover caminhos antes gerenciados; ele não conserva arquivo que a origem deixou de declarar. `agents.local.md`, `.ia.rules/local/`, `.ia.rules/hooks/` e adaptadores declarados nunca entram no lock, no plano de limpeza ou na sobrescrita.

A release inclui `release.json` apontando para `./.ia.rules/distribution/distribution-map-<versao>.json`. Esse mapa audita o payload completo, separa arquivos gerenciados, locais, opcionais, gerados e obsoletos e torna a atualização fail-safe: mapa inválido na release bloqueia antes de escrita; mapa local antigo ausente ou quebrado vira diagnóstico e não impede convergência para uma release válida.

Migração de upstream usa `.ia.rules/core/update/upstream.json`. O predecessor publica uma release-ponte com a mesma versão e os mesmos assets do sucessor; depois da instalação, `update:agents` consulta o sucessor sem gravar configuração durante `--check` ou `--dry-run`.
Consumidor cujo adaptador legado preserve os scripts antigos executa uma única vez `node .ia.rules/core/runtime/scripts/autoupdate.js`; o wrapper atualiza o núcleo, cria um segundo commit exclusivo para os aliases e publica a branch atual. Depois disso, `npm run update:agents` é a entrada canônica.

Cada alteração estrutural do formato traz um descritor de linguagem, marcador de variação e conversor histórico. Configurações equivalentes devem preferir o mesmo parser e descritor para manter transições verificáveis.

- `npm run agent:handoff`: gera [handoff.md](handoff.md) a partir de `.ia.rules/continue.ia`.

## Release

- `.github/workflows/release.yml`: executa release manual ou por commit contendo apenas `release` no root.
- Somente o arquivo `release` no root funciona como gatilho transitório; o workflow remove o arquivo e cria commit `release:`. `publish` fica reservado à Publicação de Conteúdo e este repositório não a aplica.
- `dist/release-note.txt` e o pacote versionado sao gerados localmente por `agent:release` antes da publicacao do GitHub Release marcado como latest.
- O ZIP contém somente arquivos raiz allowlisted e a árvore estrutural `.ia.rules/`; qualquer outro diretório ou path da árvore predecessora bloqueia `agent:verify`.
- Release publicado em `dev` converge a branch primária (`main`, senão `master`); conflito de merge interrompe o workflow.

### Convergência manual de `dev` para `main`

Use este procedimento somente após concluir a FT, com o worktree limpo e a validação integral aprovada. O caminho padrão é fast-forward; não use `--force`, rebase de `main` publicado ou descarte de alterações para contornar divergência.

```powershell
git switch dev
git pull --ff-only origin dev
npm run agent:verify
git switch main
git pull --ff-only origin main
git merge --ff-only dev
git push origin main
git switch dev
git merge-base --is-ancestor main dev
```

O último comando deve retornar sucesso: `main` está no mesmo commit de `dev` ou é ancestral dele. Se o fast-forward falhar, interrompa a publicação, revise a divergência, realize merge normal somente quando ela for compatível, resolva conflito explicitamente, execute novamente `npm run agent:verify` e só então envie `main`.

### Publicação assistida

`release:publish` exige versão explícita, branch `dev`, worktree limpo e workflow presente. O comando atualiza `package.json`, valida o artefato, cria commits separados de preparação e artefato e envia o commit exclusivo `release`; o GitHub Actions cria tag, asset e GitHub Release. Com GitHub CLI autenticado, o comando também acompanha o workflow e confirma a convergência `dev`/primária; sem ele, retorna após enviar o gatilho remoto.

```powershell
# Confere o plano sem alterar arquivos, Git ou GitHub.
npm run release:publish -- 0.0.2 --dry-run

# Publica e acompanha o workflow até a confirmação remota.
npm run release:publish -- 0.0.2

# Envia o gatilho, mas deixa a observação remota para outro operador.
npm run release:publish -- 0.0.2 --no-watch
```

O comando interrompe antes de escrever quando houver alteração local, tag existente, branch incorreta ou dependência remota ausente. Um release já preparado manualmente deve ser concluído ou removido antes de usar o ciclo all-in-one.

## Normas

- [RCF.md](RCF.md): contrato material do projeto.
- [AGENTS.md](AGENTS.md): governanca operacional aplicavel a este workspace.
- [src/AGENTS.md](src/AGENTS.md): fonte do artefato normativo distribuivel.
- [src/.ia.rules/core/update/scenario.md](src/.ia.rules/core/update/scenario.md): contrato de atualizacao automatica.
- [src/.ia.rules/scenarios/web/page-like/scenario.md](src/.ia.rules/scenarios/web/page-like/scenario.md): cenario Web Page Like.
- [src/.ia.rules/scenarios/release/scenario.md](src/.ia.rules/scenarios/release/scenario.md): cenario Release.
- [src/.ia.rules/scenarios/release/capabilities/package-registry.md](src/.ia.rules/scenarios/release/capabilities/package-registry.md): capacidade normativa opt-in de registro de pacote.
- [src/.ia.rules/scenarios/application-update/scenario.md](src/.ia.rules/scenarios/application-update/scenario.md): verificação normativa opt-in de atualização aplicacional.
- [src/.ia.rules/scenarios/governance/issue-lifecycle.md](src/.ia.rules/scenarios/governance/issue-lifecycle.md): segregação e encerramento idempotente de issues vinculadas.
- [src/.ia.rules/scenarios/content-publication/scenario.md](src/.ia.rules/scenarios/content-publication/scenario.md): cenario Publicação de Conteúdo.

## Autoria

[JeanCarloEM](https://www.jeancarloem.com)

## Repositório

[jcempro/agents.md](https://github.com/jcempro/agents.md), migrado de [JeanCarloEM/agents.md](https://github.com/JeanCarloEM/agents.md).

## Licença

Mozilla Public License 2.0 [MPL-2.0](https://choosealicense.com/pt/licenses/mpl-2.0/)

Este código-fonte está sujeito aos termos da Mozilla Public License, v. 2.0. Se uma cópia da MPL não foi distribuída com este arquivo, você pode obter uma em https://choosealicense.com/pt/licenses/mpl-2.0/.
