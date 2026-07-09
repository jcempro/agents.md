# 1. Atualização e sincronização normativa

## 1.1 Obrigação, fonte e interface


O comando deve atualizar o `AGENTS.md` canônico e todos os arquivos de cenário gerenciados a partir de `https://github.com/JeanCarloEM/agents.md`. A URL é norma do domínio operacional da IA (§0.4–0.5), não regra de negócio. RCF ou cenário pode definir implementação equivalente, cache, credenciais e integração ao toolchain, mas não remover, desativar ou redirecionar esta fonte sem alteração explícita do `AGENTS.md` global.

A implementação deve preferir runtime e bibliotecas já disponíveis, evitar dependência adicional quando a biblioteca-padrão bastar e jamais executar código obtido remotamente; somente arquivos normativos e metadados validados podem ser materializados.

## 1.2 Seleção da origem

Resolver a origem nesta ordem:

1. **Release latest:** se existir release cuja tag seja `latest` ou que o GitHub identifique como *Latest*, usar obrigatoriamente seu artefato normativo válido; tag `latest` prevalece quando ambas as formas divergirem.
2. **Branch:** somente quando a inexistência de release latest for confirmada, usar o branch canônico `main` ou, se inexistente, `master`.

Regras:

- release latest identificado, porém ambíguo, inconsistente, indisponível após retries ou inválido, causa falha; é proibido substituí-lo silenciosamente pelo branch;
- no release, preferir `.zip` declarado pelo manifesto; sem declaração, selecionar o único arquivo compactado cuja estrutura valide este contrato; múltiplos candidatos válidos sem critério inequívoco causam falha;
- registrar versão/tag do release ou commit SHA do branch; impedir downgrade em relação ao estado local, salvo opção explícita e auditável;
- autenticação GitHub é opcional; token, quando usado, nunca pode ser persistido, impresso ou incorporado a URL/log.

## 1.3 Indexação e descoberta

O comando deve usar, quando válido:

- `release.json`, no root do release;
- `index.json`, no root do repositório/branch.

O indexador é auxiliar, não pressuposto. Sua ausência não pode impedir atualização. Sua presença exige JSON válido, paths relativos seguros, arquivos existentes e correspondência entre índice e conteúdo; referência inexistente, duplicada, externa à origem ou materialmente incompleta constitui inconsistência.

Sem indexador — ou para auditá-lo — executar descoberta:

1. enumerar recursivamente o artefato do release ou a árvore do branch;
2. determinar a raiz normativa por: declaração explícita → root do release → `./src/` → diretório que contenha o `AGENTS.md` canônico → menor árvore coerente;
3. localizar o `AGENTS.md` por declaração; na ausência, por nome case-insensitive e validação de título, estrutura e referências; em branch, preferir a versão sob `./src/`; em release, a versão do root normativo;
4. localizar cenários pelos paths do índice da Seção 17, declarações de extensão do `AGENTS.md` §17 e diretório comum inferido; incluir arquivos novos válidos, ainda que não conhecidos localmente;
5. excluir README, RCF, licença, release notes, temporários, fontes auxiliares e gerados não normativos, salvo declaração inequívoca no indexador.

Se índice e descoberta divergirem, reconciliar somente quando a classificação for inequívoca; persistindo dúvida, abortar sem alterar o estado local.

## 1.4 Mapeamento e escopo da sincronização

- Mapear o `AGENTS.md` remoto para o arquivo canônico ativo localizado conforme §0.10.
- Preservar, relativamente ao diretório do `AGENTS.md` local, a estrutura dos cenários a partir da raiz normativa remota, incluindo novos arquivos e subdiretórios.
- Substituir somente arquivos gerenciados por este atualizador.
- Nunca alterar `agents.local.md`, RCFs, `continue.ia`, `continue.dev`, README, código, configurações ou arquivos do projeto por inferência.
- Remover arquivo de cenário ausente na origem somente se o estado local comprovar que foi criado/gerenciado pelo atualizador; arquivo não gerenciado jamais pode ser apagado.
- Alteração manual em arquivo gerenciado desde a última sincronização deve interromper a atualização e produzir diff; `--force` somente pode prosseguir após criar backup recuperável e registrar a sobrescrita.

Manter estado minificado em `./.agents/agents-update.lock.json`, contendo, no mínimo: fonte, modo (`release`/`branch`), versão/tag/commit, instante, raiz remota, arquivos locais gerenciados e hashes SHA-256. O estado serve a idempotência, detecção de edição, downgrade, limpeza segura e retomada; não substitui `continue.ia`/`continue.dev`.

## 1.5 Transação, segurança e validação

A atualização deve:

1. usar HTTPS, timeout, retries limitados e backoff;
2. baixar para diretório temporário externo aos destinos finais;
3. bloquear path absoluto, `..`, *zip slip*, symlink, hardlink, destino duplicado e arquivo fora da raiz normativa;
4. validar manifesto, tipo, tamanho razoável, UTF-8, hashes fornecidos, referências internas e avisos de licença;
5. aceitar por padrão somente Markdown e indexadores JSON; outro tipo exige declaração normativa explícita e validação própria;
6. confirmar que o arquivo principal continua sendo `AGENTS.md`, contém sua identidade normativa e resolve os cenários indexados;
7. comparar origem, destino e estado; nenhuma diferença deve resultar em sucesso idempotente sem reescrita;
8. preparar todas as mudanças antes de substituir qualquer arquivo;
9. aplicar troca atômica, atualizar o lock por último e restaurar o estado anterior em qualquer falha;
10. deixar working tree, arquivos normativos e lock coerentes ou integralmente inalterados; atualização parcial é proibida.

O comando não deve criar commit, push ou merge automaticamente; essas operações seguem §§6 e 9.

## 1.6 Modos e execução

A interface deve oferecer, no mínimo:

- `agents:update`: descobrir, validar e aplicar;
- `agents:update -- --check`: verificar atualização sem escrever e retornar estado distinguível entre atualizado, desatualizado e erro;
- `agents:update -- --dry-run`: exibir origem, versão, arquivos e operações previstas sem escrever;
- `agents:update -- --force`: sobrescrever conflito local somente conforme §1.4.

Em mecanismo não npm, preservar opções semanticamente equivalentes.

Executar `--check`:

- na adoção deste `AGENTS.md`;
- antes da primeira implementação de nova FT, salvo verificação válida já armazenada no contexto atual;
- antes de alterar `AGENTS.md` ou cenários;
- quando solicitado pelo desenvolvedor ou indicado por mudança da fonte.

Atualização disponível deve ser aplicada antes da implementação, desde que os arquivos gerenciados estejam limpos; conflito, falha de rede, origem inválida ou FT incompatível deve ser registrado em `continue.ia`/`continue.dev` e resolvido sem sobrescrita silenciosa.