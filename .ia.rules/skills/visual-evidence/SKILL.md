---
name: visual-evidence
description: Validate or correct images, PDFs, or responsive Web interfaces when regional before/after evidence and measurable geometry are required. Do not use for text-only or purely semantic review.
---

# Visual evidence

Inspect the original at preserved resolution before proposing a correction. Record a compact ledger linking `evidence → element → discrepancy → expected state → criterion`.

Use `.ia.rules/core/runtime/scripts/visual-evidence.js` for deterministic dimensions, crops, contrast, pixel diffs, PDF geometry, and fluid-unit checks. Load only the relevant page, frame, or region. OCR and descriptions are supporting evidence, never substitutes for visual inspection.

For Web work, test a representative matrix of viewport, zoom, density, theme, font, and content. Prefer fluid layout units; accept fixed `px` or `pt` only with a documented need and responsive/accessibility evidence.

After an authorized change, capture or render a new artifact and attach it to the same ledger entry. If visual intent remains ambiguous, stop for human direction.
