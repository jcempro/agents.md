#!/usr/bin/env python3
"""Mede custo contextual e valida equivalência integral de experimentos."""

from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import math
import sys
from pathlib import Path
from typing import Any


SCHEMA = "agents-context-cost-experiment/v1"
REPORT_SCHEMA = "agents-context-cost-report/v1"
METADATA_FIELDS = ("revision", "tokenizer", "tokenizerVersion", "encoding", "model", "serialization")


def canonical_json(value: Any) -> str:
    """Serializa JSON em forma estável para hash e saída reproduzível."""
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def sha256_text(value: str) -> str:
    """Calcula SHA-256 UTF-8 de texto canônico."""
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def exact_tokens(text: str, metadata: dict[str, Any]) -> int:
    """Conta tokens pelo encoding declarado e falha fechado sem tokenizer."""
    try:
        import tiktoken  # type: ignore
    except ImportError as error:
        raise ValueError("TOKENIZER_INDISPONIVEL") from error
    installed = getattr(tiktoken, "__version__", "desconhecida")
    if str(metadata["tokenizer"]) != "tiktoken" or str(metadata["tokenizerVersion"]) != installed:
        raise ValueError(f"TOKENIZER_DIVERGENTE:{metadata['tokenizer']}:{metadata['tokenizerVersion']}:{installed}")
    return len(tiktoken.get_encoding(str(metadata["encoding"])).encode(text))


def normalized_set(values: Any, label: str) -> tuple[str, ...]:
    """Valida conjunto textual sem duplicatas e o devolve ordenado."""
    if not isinstance(values, list) or any(not isinstance(value, str) or not value for value in values):
        raise ValueError(f"CONJUNTO_INVALIDO:{label}")
    if len(values) != len(set(values)):
        raise ValueError(f"CONJUNTO_DUPLICADO:{label}")
    return tuple(sorted(values))


def prepare_units(spec: dict[str, Any]) -> dict[str, dict[str, Any]]:
    """Valida unidades e materializa contagens exatas ou autenticadas."""
    units: dict[str, dict[str, Any]] = {}
    for position, source in enumerate(spec.get("units", [])):
        unit_id = source.get("id") if isinstance(source, dict) else None
        if not isinstance(unit_id, str) or not unit_id or unit_id in units:
            raise ValueError(f"UNIDADE_INVALIDA:{position}:{unit_id}")
        has_text = isinstance(source.get("text"), str)
        has_tokens = isinstance(source.get("tokens"), int) and source["tokens"] >= 0
        if has_text == has_tokens:
            raise ValueError(f"UNIDADE_CONTAGEM_AMBIGUA:{unit_id}")
        units[unit_id] = {
            "id": unit_id,
            "tokens": exact_tokens(source["text"], spec["metadata"]) if has_text else source["tokens"],
            "atoms": normalized_set(source.get("atoms"), f"{unit_id}:atoms"),
            "relations": normalized_set(source.get("relations"), f"{unit_id}:relations"),
        }
    if not units:
        raise ValueError("UNIDADES_AUSENTES")
    return units


def prepare_spec(spec: dict[str, Any]) -> dict[str, Any]:
    """Valida o contrato completo e devolve uma representação executável."""
    if not isinstance(spec, dict) or spec.get("schema") != SCHEMA:
        raise ValueError("EXPERIMENTO_SCHEMA_INVALIDO")
    metadata = spec.get("metadata")
    if not isinstance(metadata, dict) or any(not str(metadata.get(field, "")).strip() for field in METADATA_FIELDS):
        raise ValueError("EXPERIMENTO_METADATA_INCOMPLETA")
    units = prepare_units(spec)
    scenarios = []
    scenario_ids = set()
    for position, source in enumerate(spec.get("scenarios", [])):
        scenario_id = source.get("id") if isinstance(source, dict) else None
        reads = source.get("reads") if isinstance(source, dict) else None
        weight = source.get("weight", 1) if isinstance(source, dict) else None
        if not isinstance(scenario_id, str) or not scenario_id or scenario_id in scenario_ids:
            raise ValueError(f"CENARIO_INVALIDO:{position}:{scenario_id}")
        if not isinstance(reads, list) or not reads or any(unit not in units for unit in reads):
            raise ValueError(f"CENARIO_LEITURA_INVALIDA:{scenario_id}")
        if not isinstance(weight, (int, float)) or not math.isfinite(weight) or weight <= 0:
            raise ValueError(f"CENARIO_PESO_INVALIDO:{scenario_id}")
        scenario_ids.add(scenario_id)
        scenarios.append({"id": scenario_id, "reads": reads, "weight": weight})
    if not scenarios:
        raise ValueError("CENARIOS_AUSENTES")
    candidates = []
    candidate_ids = set()
    for position, source in enumerate(spec.get("candidates", [])):
        candidate_id = source.get("id") if isinstance(source, dict) else None
        if not isinstance(candidate_id, str) or not candidate_id or candidate_id in candidate_ids:
            raise ValueError(f"CANDIDATO_INVALIDO:{position}:{candidate_id}")
        cache = source.get("cache", "none")
        risk = source.get("risk")
        if cache not in ("none", "scenario", "session") or not isinstance(risk, (int, float)) or risk < 0:
            raise ValueError(f"CANDIDATO_CONTRATO_INVALIDO:{candidate_id}")
        snapshots = []
        for snapshot_source in source.get("snapshots", []):
            snapshot_id = snapshot_source.get("id")
            replaces = snapshot_source.get("replaces")
            if not isinstance(snapshot_id, str) or not snapshot_id or snapshot_id in units:
                raise ValueError(f"SNAPSHOT_INVALIDO:{candidate_id}:{snapshot_id}")
            if not isinstance(replaces, list) or not replaces or any(unit not in units for unit in replaces):
                raise ValueError(f"SNAPSHOT_SUBSTITUICAO_INVALIDA:{candidate_id}:{snapshot_id}")
            has_text = isinstance(snapshot_source.get("text"), str)
            has_tokens = isinstance(snapshot_source.get("tokens"), int) and snapshot_source["tokens"] >= 0
            if has_text == has_tokens:
                raise ValueError(f"SNAPSHOT_CONTAGEM_AMBIGUA:{snapshot_id}")
            snapshots.append({
                "id": snapshot_id,
                "replaces": tuple(replaces),
                "tokens": exact_tokens(snapshot_source["text"], metadata) if has_text else snapshot_source["tokens"],
                "atoms": normalized_set(snapshot_source.get("atoms"), f"{snapshot_id}:atoms"),
                "relations": normalized_set(snapshot_source.get("relations"), f"{snapshot_id}:relations"),
            })
        candidate_ids.add(candidate_id)
        candidates.append({"id": candidate_id, "cache": cache, "risk": risk, "summary": str(source.get("summary", "")), "snapshots": snapshots})
    if len(candidates) > 12:
        raise ValueError("CANDIDATOS_EXCESSIVOS")
    return {"metadata": metadata, "units": units, "scenarios": scenarios, "candidates": candidates, "sources": spec.get("sources", [])}


def material(reads: list[str], units: dict[str, dict[str, Any]]) -> tuple[set[str], set[str]]:
    """Obtém os conjuntos materiais disponíveis após uma sequência de leituras."""
    atoms: set[str] = set()
    relations: set[str] = set()
    for unit_id in reads:
        atoms.update(units[unit_id]["atoms"])
        relations.update(units[unit_id]["relations"])
    return atoms, relations


def apply_snapshots(reads: list[str], units: dict[str, dict[str, Any]], candidates: tuple[dict[str, Any], ...]) -> tuple[list[str], dict[str, dict[str, Any]]]:
    """Aplica snapshots sem sobreposição e preserva o catálogo original."""
    output = list(reads)
    available = dict(units)
    replaced: set[str] = set()
    for candidate in candidates:
        for snapshot in candidate["snapshots"]:
            overlap = replaced.intersection(snapshot["replaces"])
            if overlap:
                raise ValueError(f"SNAPSHOT_CONFLITO:{candidate['id']}:{','.join(sorted(overlap))}")
            positions = [index for index, unit_id in enumerate(output) if unit_id in snapshot["replaces"]]
            if not positions:
                continue
            replaced.update(snapshot["replaces"])
            first = min(positions)
            output = [unit_id for unit_id in output if unit_id not in snapshot["replaces"]]
            output.insert(first, snapshot["id"])
            available[snapshot["id"]] = snapshot
    return output, available


def evaluate_variant(prepared: dict[str, Any], selected: tuple[dict[str, Any], ...]) -> dict[str, Any]:
    """Mede uma combinação, verifica equivalência e registra regressões locais."""
    cache_order = {"none": 0, "scenario": 1, "session": 2}
    cache = max((candidate["cache"] for candidate in selected), key=lambda value: cache_order[value], default="none")
    session_seen: set[str] = set()
    scenarios = []
    equivalent = True
    weighted_baseline = 0.0
    weighted_variant = 0.0
    for scenario in prepared["scenarios"]:
        baseline_atoms, baseline_relations = material(scenario["reads"], prepared["units"])
        baseline_tokens = sum(prepared["units"][unit_id]["tokens"] for unit_id in scenario["reads"])
        reads, available = apply_snapshots(scenario["reads"], prepared["units"], selected)
        variant_atoms, variant_relations = material(reads, available)
        same = baseline_atoms == variant_atoms and baseline_relations == variant_relations
        equivalent = equivalent and same
        seen = session_seen if cache == "session" else set()
        variant_tokens = 0
        for unit_id in reads:
            if cache != "none" and unit_id in seen:
                continue
            variant_tokens += available[unit_id]["tokens"]
            seen.add(unit_id)
        weighted_baseline += baseline_tokens * scenario["weight"]
        weighted_variant += variant_tokens * scenario["weight"]
        scenarios.append({
            "id": scenario["id"], "weight": scenario["weight"], "baselineTokens": baseline_tokens,
            "variantTokens": variant_tokens, "deltaTokens": variant_tokens - baseline_tokens,
            "atomCoverage": 1 if baseline_atoms == variant_atoms else len(variant_atoms.intersection(baseline_atoms)) / max(1, len(baseline_atoms)),
            "relationCoverage": 1 if baseline_relations == variant_relations else len(variant_relations.intersection(baseline_relations)) / max(1, len(baseline_relations)),
            "equivalent": same,
        })
    savings = weighted_baseline - weighted_variant
    risk = sum(float(candidate["risk"]) for candidate in selected)
    regressions = [scenario["id"] for scenario in scenarios if scenario["deltaTokens"] > 0]
    return {
        "id": "+".join(candidate["id"] for candidate in selected) or "baseline",
        "candidates": [candidate["id"] for candidate in selected], "cache": cache,
        "equivalent": equivalent, "weightedBaselineTokens": weighted_baseline,
        "weightedTokens": weighted_variant, "weightedSavings": savings,
        "savingsPercent": 0 if weighted_baseline == 0 else savings * 100 / weighted_baseline,
        "risk": risk, "regressions": regressions, "scenarios": scenarios,
    }


def pareto(results: list[dict[str, Any]]) -> list[str]:
    """Retorna variantes equivalentes não dominadas em economia e risco."""
    eligible = [result for result in results if result["equivalent"] and not result["regressions"]]
    frontier = []
    for candidate in eligible:
        dominated = any(
            other is not candidate
            and other["weightedSavings"] >= candidate["weightedSavings"]
            and other["risk"] <= candidate["risk"]
            and (other["weightedSavings"] > candidate["weightedSavings"] or other["risk"] < candidate["risk"])
            for other in eligible
        )
        if not dominated:
            frontier.append(candidate["id"])
    return frontier


def build_report(spec: dict[str, Any]) -> dict[str, Any]:
    """Executa baseline, isolados e todas as combinações configuradas."""
    prepared = prepare_spec(spec)
    baseline = evaluate_variant(prepared, ())
    results = []
    candidates = prepared["candidates"]
    for size in range(1, len(candidates) + 1):
        for selected in itertools.combinations(candidates, size):
            try:
                results.append(evaluate_variant(prepared, selected))
            except ValueError as error:
                results.append({"id": "+".join(item["id"] for item in selected), "candidates": [item["id"] for item in selected], "equivalent": False, "error": str(error), "weightedSavings": 0, "risk": sum(float(item["risk"]) for item in selected), "regressions": []})
    valid = [result for result in results if result.get("equivalent") and not result.get("regressions")]
    ranking = [result["id"] for result in sorted(valid, key=lambda item: (-item["weightedSavings"], item["risk"], item["id"]))]
    recommendation = ranking[0] if ranking and next(item for item in results if item["id"] == ranking[0])["weightedSavings"] > 0 else None
    return {
        "schema": REPORT_SCHEMA, "metadata": prepared["metadata"], "sources": prepared["sources"],
        "inputSha256": sha256_text(canonical_json(spec)), "baseline": baseline,
        "experiments": results, "pareto": pareto(results), "ranking": ranking,
        "recommendation": {"candidate": recommendation, "applied": False, "requiresLaterFt": recommendation is not None},
    }


def render_markdown(report: dict[str, Any]) -> str:
    """Projeta o relatório canônico em Markdown legível."""
    metadata = report["metadata"]
    lines = [
        "# Auditoria experimental de custo contextual", "",
        f"Revisão: `{metadata['revision']}`. Tokenizer: `{metadata['tokenizer']} {metadata['tokenizerVersion']}` / `{metadata['encoding']}` / `{metadata['model']}`.",
        f"Entrada: `{report['inputSha256']}`. Serialização: {metadata['serialization']}.", "",
        "## Resultados", "", "| Variante | Equivalente | Economia ponderada | Economia | Risco | Regressões |", "|---|---:|---:|---:|---:|---|",
    ]
    for result in report["experiments"]:
        lines.append(f"| {result['id']} | {'sim' if result.get('equivalent') else 'não'} | {result.get('weightedSavings', 0):.2f} | {result.get('savingsPercent', 0):.2f}% | {result.get('risk', 0):.2f} | {', '.join(result.get('regressions', [])) or 'nenhuma'} |")
    lines.extend(["", f"Pareto: {', '.join(report['pareto']) or 'nenhum candidato válido'}.", f"Ranking: {', '.join(report['ranking']) or 'nenhum candidato válido'}.", "", "## Recomendação", ""])
    recommendation = report["recommendation"]["candidate"]
    lines.append(f"Melhor combinação mensurada: `{recommendation}`. A recomendação não foi aplicada e exige FT posterior." if recommendation else "Nenhuma mudança material recomendada pelos experimentos válidos.")
    lines.extend(["", "O JSON correspondente preserva deltas por cenário, cobertura de átomos/relações, riscos e metadados reproduzíveis.", ""])
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    """Executa a CLI, grava saídas opcionais e imprime o relatório JSON."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("experiment", type=Path)
    parser.add_argument("--json", dest="json_path", type=Path)
    parser.add_argument("--markdown", dest="markdown_path", type=Path)
    arguments = parser.parse_args(argv)
    spec = json.loads(arguments.experiment.read_text(encoding="utf-8"))
    report = build_report(spec)
    output = json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if arguments.json_path:
        arguments.json_path.parent.mkdir(parents=True, exist_ok=True)
        arguments.json_path.write_text(output, encoding="utf-8", newline="\n")
    if arguments.markdown_path:
        arguments.markdown_path.parent.mkdir(parents=True, exist_ok=True)
        arguments.markdown_path.write_text(render_markdown(report), encoding="utf-8", newline="\n")
    sys.stdout.write(output)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1) from error
