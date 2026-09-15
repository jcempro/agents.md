---
name: context-cost-audit
description: Audit end-to-end context cost across normative routes, state, memory, recovery, and resume when token savings must preserve every material atom. Do not use for isolated file counts or runtime/model optimization.
---

# Context cost audit

Read `.ia.rules/resources/context-cost-audit.md` and the applicable refused-decision index before designing an experiment.

1. Establish the observed baseline from effective read paths, including cold context, legitimate reuse, state, memory, recovery, and resume.
2. Record tokenizer, model, encoding, serialization, repository revision, source hashes, workload and weights. Missing metadata invalidates comparison.
3. Model candidates as reversible loading plans. Every candidate and combination must preserve the baseline set of material atoms and relations; reject it before ranking if either set changes.
4. Measure each candidate alone, then all configured combinations. Report local regressions, interaction gain, risk and Pareto status; do not hide a regressed scenario behind aggregate savings.
5. Keep synthesis and recommendation with the primary agent. A Subagent may run only an independent experiment and returns evidence, never the global decision.
6. Write the reproducible report without applying a recommendation. A material recommendation requires a later FT with authorization, migration, rollback and acceptance criteria.

Use `scripts/context_cost_audit.py` for deterministic measurement and report generation. Read [the experiment contract](references/experiment-contract.md) when preparing or reviewing its JSON input.
