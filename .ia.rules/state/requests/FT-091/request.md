# Solicitação preservada — FT-091 a FT-094

Origem material: frente `Migrar ao construtor de agents.md as normas de edição redacional autoral e normalização semântico-fonética para TTS`, introduzida em `TODO.ia.md` por `f3f6806ba94eda52af10b21c46e435cd95f2e659` e refinada até `7d72d56ce1450d56d56a9a220d5aa3a92cbac5c1`.
Origem operacional: prompt humano `Implementar itens de TODO.ia.,md.`, recebido em 2026-09-15 (America/Sao_Paulo).
Repositório autorizado: `D:\trampo\agents`.
Fonte externa somente leitura: `D:\trampo\jeancarloem.com.blog`, revisão `9c8c997c38e3e3e53028598e5c33d53138433060`.
FTs: FT-091, FT-092, FT-093 e FT-094.
RCF de destino: `RCF.md`, seção nova de edição autoral e projeção semântico-fonética.
Estado de incorporação: fonte local versionada e equalizada; RCF/Norma pendentes no início desta solicitação.

## Fonte versionada e integridade

- O texto integral e seus refinamentos permanecem recuperáveis no histórico de `TODO.ia.md`; a projeção operacional canônica PODE ser compactada sem perda por este vínculo.
- `RCFs/leitura-acessivel-e-tts.md` conferiu com o SHA-256 declarado `A37E9747DD3375798C631945BFF2B0A7C6761A900508ADDBAC1A8F49C85970B9`.
- `.ia.rules/scenarios/web/page-like/capabilities/editorial.md` conferiu com `1098AE965511CB35DEB61D7E37E48151423C908A3702D82B8D93AB2A016D513D`.
- `docs/MODO-DE-USO-LEITURA-ACESSIVEL-E-TTS.md` existe na revisão e mediu `362B33E681F7BEC0AE266091C87DB527560CC13B5F3341BE0DEEEE36F3E78411`.
- `_plugins/jcem_zz_accessible_reading.rb` mediu `450214E663FCDC85ACB1D7F41D51F9DFBA74974118E86344DBCD71377B936DFC`, divergente do hash declarado, que não aparece em nenhuma revisão do arquivo.
- `assets/jcem/js/read-aloud.js` mediu `495E6CD82CFFCCDE6C91A135E7E5BF4DE32826854DC6EA8416BE5E8EC5B38155`, divergente do hash declarado, que não aparece em nenhuma revisão do arquivo.
- `.ia.rules/state/requests/FT-003/prompt-original.md` e `prompt-original.base64` não existem na revisão indicada.
- As divergências bloqueiam usar esses quatro artefatos como evidência autenticada de implementação, mas não invalidam as duas fontes normativas cujo conteúdo e hash conferiram.

## Decisões de equalização

- A capacidade comum é independente de Jekyll, navegador, sintetizador ou produto; especializações Web/TTS permanecem em módulos próprios.
- Edição autoral e normalização para fala são capacidades distintas e carregáveis separadamente, com contrato comum de preservação da fonte.
- Aspas citacionais, `blockquote`, parênteses e colchetes são mecanismos independentes; nenhum aciona, fecha, substitui ou renomeia outro.
- A fase atual cobre RCF e Norma Operacional. Código, hooks, distribuição, release e validação funcional exigem autorização humana posterior.

## Autorização funcional posterior

- Em 2026-09-15T12:43:43-03:00, o humano autorizou explicitamente implementar todas as FTs pendentes, incluindo FT-093 e FT-094.
- A mesma autorização exigiu commits intermediários contínuos para evitar alterações médias ou grandes sem histórico e rastreio.
