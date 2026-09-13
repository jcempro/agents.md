# Solicitação — persistência da atualização parcial em v0.1.4-rc2

- Origem: prompt humano no Codex
- Recebido em: 2026-09-13T18:22:22-03:00
- Repositório autorizado: `D:\trampo\agents`
- Consumidor externo somente leitura: `D:\trampo\jeancarloem.com.blog`
- Correlação: FT-084, FT-085 e `github:jcempro/agents.md#11`

## Pedido integral

O problema apontado anteriormente, de que o script de atualização NÃO estava funcional, não atualizando todos os arquivos permanece. O diretório `D:\trampo\jeancarloem.com.blog` de outro repositório que NÃO deve ser modificado, mas apenas lido demonstra claramente que, mesmo após executar o comando de atualização do agents apropriado, ele concluiu com sucesso MAS não efetivou a atualização de mais do que 2 arquivos, persistindo o problema anteriormente aberto e que foi falsamente atribuído como resolvido.

```text
PS D:\trampo\jeancarloem.com.blog> npm run agents:update

> blog@1.0.0 agents:update
> node scripts/.agents/repo-tools.js agent:agents

{"v":1,"command":"agent:agents","status":"ok","exit":0,"totalLines":1,"totalBytes":57,"shown":1,"truncated":false,"artifact":"","sha256":"cd9a519f58c3c3025a7cedd42c6942c17c0853c15cbbb0b6cac53ef1addff505"}
{"code":"TO_IA_INFO","level":"info","message":"Governanca operacional atualizada de release:v0.1.4-rc2."}
PS D:\trampo\jeancarloem.com.blog>
```

## Triagem e fronteira

- A evidência nova é materialmente distinta da FT-084: ela comprova o comportamento do release corretivo `v0.1.4-rc2`, não apenas o defeito de `v0.1.4-rc1`.
- O consumidor externo permanece estritamente somente leitura; toda reprodução deve ocorrer em fixture ou temporário controlado.
- Nenhum release, tag ou asset remoto será publicado, substituído ou removido pela IA.
- A correção deve validar o comando completo de uma única invocação a partir do estado legado real, não somente o entrypoint sucessor isolado.

## Evidência confirmada em leitura

- Commit: `ec94192f7e84fd1e7e148cc79742ad1d620552ea` (`ajuste: sincroniza governanca v0.1.4-rc2`).
- Arquivos alterados: `AGENTS.md` e `scripts/.agents/update-agents.js`.
- O `package.json` permaneceu com `agents:update` chamando `scripts/.agents/repo-tools.js agent:agents`.
- O `repo-tools.js` legado chama diretamente `scripts/.agents/update-agents.js`.
- A execução substituiu esse próprio módulo pelo entrypoint corretivo, mas o processo corrente continuou com o módulo predecessor já carregado e encerrou com código zero.
