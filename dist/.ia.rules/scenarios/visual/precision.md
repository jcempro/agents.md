# Precisão visual para imagem, PDF e Web

Identidade normativa: `scenario.visual.precision`; cenário técnico; tipo: folha. Ler ao compreender, comparar, corrigir ou validar imagem, PDF, frame, página renderizada ou interface visual. Depende de `../../core/authority.md`, `../../core/contracts.md`, `../../resources/scripts.md`, `MN-EVID`, `MN-PRES` e do cenário técnico do produto quando aplicável.

## 1. Evidência regional

Trabalho visual DEVE ler pedido/normas, inspecionar o original em resolução preservada e páginas/frames relevantes, usar zoom/crop regional e OCR somente como apoio e manter ledger `arquivo/página/viewport/coordenada ou região → observação → regra violada → esperado → correção → evidência posterior`. Texto, seta, descrição ou inferência de geometria oculta NÃO comprovam compreensão. Estado corrigido exige captura/render novo; intenção ambígua exige aprovação humana.

## 2. Web e unidades

Web visual DEVE testar matriz representativa de viewport, zoom, densidade, tema, fonte e conteúdo, preservando reflow, acessibilidade, função e responsividade. `%`, `em`, `rem`, `fr`, `min/max/clamp`, `vh/vw/dvh/dvw` são preferidos quando materialmente adequados. `px`/`pt` só PODEM entrar por necessidade estrita, justificativa e prova de responsividade/acessibilidade; escolha local NÃO DEVE tornar-se regra global.

Captura, render, crop, dimensão, contraste, diff e inspeção de metadados DEVEM ser Scripts quando mecanizáveis; IA interpreta evidência e NÃO DEVE fabricar medição. Skill visual exige procedimento generalista e ganho comprovado; Subagent visual exige isolamento ou execução longa útil. Ferramenta opcional ausente não autoriza validação falsa nem dependência oculta.

## 3. Aceite

Aceite cobre ledger completo, vínculo regional antes/depois, original preservado, render posterior, matriz aplicável, acessibilidade, ausência de regressão funcional e limites da automação. Evidência textual ou OCR isolada é insuficiente.
