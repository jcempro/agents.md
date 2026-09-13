# Solicitação — correção da atualização incompleta de governança

- Origem: prompt humano no Codex
- Recebido em: 2026-09-12T23:16:00-03:00
- Repositório autorizado: `D:\trampo\agents`
- Consumidor externo somente leitura: `D:\trampo\jeancarloem.com.blog`
- Evidência visual externa: `C:\Users\admin\AppData\Local\Temp\codex-clipboard-a5a13bb7-5386-4cd7-8a87-63112aecba05.png`
- SHA-256 da evidência visual: `32116ebd12049a3f92f83bb8de970bd67115aed1271321bda8cd68f814372ec7`

## Pedido integral

Diagnostique e corrija a atualização incompleta da governança distribuída pelo release `0.1.14-rc1`.

### Contexto e evidência

Em um repositório consumidor, após executar `npm run agents:update`, o commit resultante registrou alteração em apenas:

- `AGENTS.md`;
- `package.json`;
- `scripts/.agents/autoupdate.js`.

O consumidor está em `D:\trampo\jeancarloem.com.blog`. O print anexado comprova somente essa lista visual; identifique o commit e confirme seu diff por inspeção somente leitura.

A versão `0.1.14-rc1` aparenta possuir diversos arquivos e commits novos em relação ao release anterior. Portanto, há indício de que:

1. o release foi gerado ou publicado com payload incompleto;
2. o atualizador resolveu, selecionou ou aplicou arquivos incorretamente;
3. ambos os fluxos estão defeituosos.

NÃO presuma a causa nem considere que todo commit do construtor necessariamente altera arquivos distribuíveis.

### Fronteira obrigatória

- Escrever e operar Git exclusivamente na raiz Git corrente, que DEVE ser o repositório construtor autorizado de `agents.md`. Se não for, interromper.
- `D:\trampo\jeancarloem.com.blog` é evidência externa e PODE ser consultado somente em modo leitura.
- É VEDADO editar, restaurar, formatar, instalar, executar atualização, criar arquivos, fazer staging, commit, checkout, merge ou qualquer outra mutação no consumidor.
- Reproduzir somente em fixture, cópia descartável ou ambiente temporário controlado.
- Não publicar, substituir ou remover tag, release ou asset remoto sem autorização humana explícita.

### Execução

1. Ler integralmente a governança, RCF, estado canônico, FTs, decisões, manifestos e contratos aplicáveis. Criar ou reconciliar a FT necessária antes da correção.
2. No consumidor, confirmar por leitura: commit exato da atualização; versão anterior e versão instalada; diff completo; hashes dos três arquivos alterados; arquivos gerenciados presentes antes e depois; evidência disponível da execução de `npm run agents:update`.
3. No construtor: identificar o release anterior efetivamente instalado, sem inferi-lo pela ordem temporal; comparar esse release com `0.1.14-rc1`; classificar cada diferença como fonte, derivado, arquivo distribuível, interno, condicional ou excluído; confrontar fonte, build, `dist`, manifests, mapas, checksums, pacote e assets publicados; determinar exatamente quais arquivos o consumidor deveria ter recebido.
4. Reproduzir a atualização do release anterior para `0.1.14-rc1`, registrando URL, canal, versão e asset resolvidos; manifesto e hashes obtidos; seleção de arquivos e condições de perfil; downloads, staging, preservações, substituições e descartes; resultado e código de saída de cada gate.
5. Localizar a primeira divergência causal entre geração do payload; manifesto/mapa; empacotamento/publicação; resolução de versão/tag/canal/cache/asset; filtragem; hashes; e aplicação/preservação/limpeza.
6. Corrigir todas as causas comprovadas na fonte canônica, com diff mínimo. NÃO editar derivado manualmente; regenerá-lo pelo mecanismo oficial.
7. Se ambiental, registrar identificador estável não secreto, runtimes, ferramentas, hashes, comando e condições; retentar em outro equipamento apenas sem reprodução independente equivalente.

### Validação

Comprovar inventário/versão/hashes coerentes; atualização integral do release anterior para `0.1.14-rc1` em fixture limpa; alteração de todos e somente os gerenciados esperados; preservação local; segunda execução idempotente; falha explícita por incompatibilidades; regressão para o caso de apenas três arquivos; e consumidor original integralmente intocado.

Se o payload remoto estiver incorreto, concluir correção/validação locais, informar ações remotas e aguardar autorização antes de republicar.

### Relatório final

Informar causa-raiz e primeira divergência; releases/commits/manifests/assets/hashes; esperado versus efetivo; arquivos/derivados; testes; Git; confirmação de somente leitura; ações remotas; `COMMIT_SUGERIDO`; e `PENDENCIAS`.

## Complemento integral

Log informado pelo desenvolvedor:

```text
PS D:\trampo\jeancarloem.com.blog> npm run agents:update

> blog@1.0.0 agents:update
> node scripts/.agents/repo-tools.js agent:agents

{"v":1,"command":"agent:agents","status":"ok","exit":0,"totalLines":1,"totalBytes":57,"shown":1,"truncated":false,"artifact":"","sha256":"3ab38fd416ef92cd151eb5e44765a0c0fcf37689c345804105e5f63412fd8f7d"}
{"code":"TO_IA_INFO","level":"info","message":"Governanca operacional atualizada de release:v0.1.4-rc1."}
PS D:\trampo\jeancarloem.com.blog>
```

O complemento corrige factualmente a versão efetiva para `0.1.4-rc1`; não existe release remoto `v0.1.14-rc1` na evidência consultada.
