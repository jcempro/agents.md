# Autor: JeanCarloEM.com
# Site do Autor: https://jeancarloem.com
# Repositorio: https://github.com/jcempro/agents.md
# Licenca: Mozilla Public License 2.0
# Site da Licenca: https://www.mozilla.org/MPL/2.0/
# Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
# Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

"""Valida o grafo normativo e materializa custos exatos com tiktoken."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import statistics
import subprocess
import sys
from typing import Any
import re

import tiktoken

SCHEMA = "agents-normative-index/v1"
ENCODING = "o200k_base"
MODEL = "gpt-4o"
TOKENIZER_VERSION = "0.13.0"
README_START = "<!-- agents:normative-metrics:start -->"
README_END = "<!-- agents:normative-metrics:end -->"


def repository_root(start: Path) -> Path:
    """Localiza a raiz por AGENTS.md para execução equivalente em fonte ou release."""
    for candidate in (start, *start.parents):
        if (candidate / "AGENTS.md").is_file() and (candidate / "package.json").is_file():
            return candidate
    raise RuntimeError("RAIZ_REPOSITORIO_NAO_ENCONTRADA")


def governance_root(root: Path) -> Path:
    """Seleciona fonte distribuível no construtor e governança ativa no consumidor."""
    source = root / "src" / ".ia.rules"
    return source if (source / "normative-index.json").is_file() else root / ".ia.rules"


def exact_path(root: Path, relative: str) -> Path:
    """Resolve caminho relativo com caixa exata e bloqueia escape da raiz normativa."""
    if not relative or "\\" in relative or relative.startswith("/") or ".." in Path(relative).parts:
        raise RuntimeError(f"GRAFO_PATH_INSEGURO:{relative}")
    current = root
    for part in Path(relative).parts:
        names = {entry.name for entry in current.iterdir()}
        if part not in names:
            raise RuntimeError(f"GRAFO_PATH_AUSENTE_OU_CAIXA:{relative}")
        current = current / part
    if not current.is_file():
        raise RuntimeError(f"GRAFO_PATH_NAO_ARQUIVO:{relative}")
    return current


def sha256(data: bytes) -> str:
    """Calcula identidade estável para detectar obsolescência sem serviço externo."""
    return hashlib.sha256(data).hexdigest()


def git_value(root: Path, args: list[str], fallback: str) -> str:
    """Obtém metadado Git determinístico e usa fallback explícito fora de repositório."""
    result = subprocess.run(
        ["git", *args],
        cwd=root,
        check=False,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip() if result.returncode == 0 and result.stdout.strip() else fallback


def load_index(index_path: Path) -> dict[str, Any]:
    """Carrega o manifesto canônico sem aceitar schema ou estrutura incompatível."""
    try:
        data = json.loads(index_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise RuntimeError(f"GRAFO_INDICE_INVALIDO:{error}") from error
    if data.get("schema") != SCHEMA or data.get("id") != "agents.normative-index":
        raise RuntimeError("GRAFO_INDICE_INVALIDO")
    if not isinstance(data.get("nodes"), list) or not isinstance(data.get("edges"), list):
        raise RuntimeError("GRAFO_ESTRUTURA_INVALIDA")
    return data


def validate_graph(data: dict[str, Any], source_root: Path) -> tuple[dict[str, Any], dict[str, list[dict[str, Any]]]]:
    """Valida identidades, papéis estruturais, arestas, ciclos e alcançabilidade."""
    nodes: dict[str, Any] = {}
    paths: set[str] = set()
    for node in data["nodes"]:
        node_id = str(node.get("id", ""))
        relative = str(node.get("path", ""))
        node_type = node.get("type")
        if not node_id or node_id in nodes:
            raise RuntimeError(f"GRAFO_NO_DUPLICADO:{node_id}")
        if relative in paths:
            raise RuntimeError(f"GRAFO_PATH_DUPLICADO:{relative}")
        if node_type not in {"leaf", "derivation", "hybrid"}:
            raise RuntimeError(f"GRAFO_TIPO_INVALIDO:{node_id}")
        exact_path(source_root, relative)
        nodes[node_id] = node
        paths.add(relative)

    outgoing: dict[str, list[dict[str, Any]]] = {node_id: [] for node_id in nodes}
    orders: set[tuple[str, int]] = set()
    for edge in data["edges"]:
        source, target = edge.get("from"), edge.get("to")
        mode, condition, order = edge.get("mode"), edge.get("condition"), edge.get("order")
        if source not in nodes or target not in nodes:
            raise RuntimeError(f"GRAFO_ARESTA_ORFA:{source}->{target}")
        if mode not in {"immediate", "passive"} or not condition or not isinstance(order, int) or order < 1:
            raise RuntimeError(f"GRAFO_ARESTA_INVALIDA:{source}->{target}")
        if mode == "immediate" and not edge.get("at"):
            raise RuntimeError(f"GRAFO_IMEDIATA_SEM_MARCADOR:{source}->{target}")
        key = (source, order)
        if key in orders:
            raise RuntimeError(f"GRAFO_ORDEM_AMBIGUA:{source}:{order}")
        orders.add(key)
        outgoing[source].append(edge)

    for node_id, node in nodes.items():
        degree = len(outgoing[node_id])
        if node["type"] == "leaf" and degree:
            raise RuntimeError(f"GRAFO_FOLHA_COM_SAIDA:{node_id}")
        if node["type"] in {"derivation", "hybrid"} and not degree:
            raise RuntimeError(f"GRAFO_DERIVACAO_SEM_SAIDA:{node_id}")
        outgoing[node_id].sort(key=lambda edge: edge["order"])

    root_id = data.get("root")
    if root_id not in nodes:
        raise RuntimeError("GRAFO_RAIZ_INVALIDA")
    visiting: set[str] = set()
    visited: set[str] = set()

    def visit(node_id: str) -> None:
        """Detecta ciclo por pilha ativa e acumula nós alcançáveis a partir da raiz."""
        if node_id in visiting:
            raise RuntimeError(f"GRAFO_CICLO_NAO_AUTORIZADO:{node_id}")
        if node_id in visited:
            return
        visiting.add(node_id)
        for edge in outgoing[node_id]:
            visit(edge["to"])
        visiting.remove(node_id)
        visited.add(node_id)

    visit(root_id)
    unreachable = sorted(set(nodes) - visited)
    if unreachable:
        raise RuntimeError(f"GRAFO_NO_INALCANCAVEL:{','.join(unreachable)}")
    return nodes, outgoing


def tokenize_nodes(nodes: dict[str, Any], source_root: Path) -> tuple[Any, dict[str, dict[str, Any]]]:
    """Conta o conteúdo UTF-8 efetivamente transmitido com encoding oficial declarado."""
    encoding = tiktoken.get_encoding(ENCODING)
    tokenized: dict[str, dict[str, Any]] = {}
    for node_id in sorted(nodes):
        file_path = exact_path(source_root, nodes[node_id]["path"])
        text = file_path.read_text(encoding="utf-8").replace("\r\n", "\n")
        tokenized[node_id] = {
            "bytes": len(text.encode("utf-8")),
            "guard": normative_signature(text),
            "sha256": sha256(text.encode("utf-8")),
            "text": text,
            "tokens": len(encoding.encode(text)),
        }
    print(f"[tokens] {len(tokenized)} nós; último={sorted(tokenized)[-1]}", file=sys.stderr)
    return encoding, tokenized


def normative_signature(text: str) -> dict[str, int]:
    """Conta elementos de força cuja redução exige aceite explícito antes da regeneração."""
    return {
        "exceptions": len(re.findall(r"\b(?:exceto|exceção|salvo|ressalvad[oa])\b", text, flags=re.IGNORECASE)),
        "modalities": len(re.findall(r"\b(?:DEVE|DEVEM|PODE|PODEM)\b", text, flags=re.IGNORECASE)),
        "prohibitions": len(re.findall(r"\b(?:NÃO\s+DEVE|NÃO\s+DEVEM|PROIBID[OA]S?)\b", text, flags=re.IGNORECASE)),
        "references": len(re.findall(r"(?:`[^`]+`|\[[^\]]+\]\([^)]+\)|\bMN-[A-Z0-9-]+\b)", text)),
    }


def validate_degradation(data: dict[str, Any], tokenized: dict[str, dict[str, Any]], accepted: bool) -> None:
    """Bloqueia redução silenciosa de modalidade, proibição, exceção ou referência."""
    if accepted:
        return
    for node in data["nodes"]:
        previous = node.get("guard")
        if not previous:
            continue
        current = tokenized[node["id"]]["guard"]
        reduced = [key for key in current if int(current[key]) < int(previous.get(key, 0))]
        if reduced:
            raise RuntimeError(f"GRAFO_DEGRADACAO_NORMATIVA:{node['id']}:{','.join(reduced)}")


def edge_cost(edge: dict[str, Any], source: dict[str, Any], encoding: Any) -> int:
    """Calcula leitura integral passiva ou prefixo inclusivo de derivação imediata."""
    if edge["mode"] == "passive":
        return int(source["tokens"])
    marker = str(edge["at"])
    position = source["text"].find(marker)
    if position < 0:
        raise RuntimeError(f"GRAFO_MARCADOR_IMEDIATO_AUSENTE:{edge['from']}->{edge['to']}")
    prefix = source["text"][: position + len(marker)]
    return len(encoding.encode(prefix))


def calculate_paths(
    data: dict[str, Any],
    nodes: dict[str, Any],
    outgoing: dict[str, list[dict[str, Any]]],
    tokenized: dict[str, dict[str, Any]],
    encoding: Any,
) -> list[dict[str, Any]]:
    """Enumera rotas terminais sem duplicar nó já carregado no mesmo contexto."""
    results: list[dict[str, Any]] = []

    def walk(node_id: str, route: list[str], loaded: set[str], accumulated: int, segments: list[dict[str, Any]]) -> None:
        """Percorre cada condição como rota distinta e registra folha ou híbrido terminal."""
        node = nodes[node_id]
        full_increment = 0 if node_id in loaded else int(tokenized[node_id]["tokens"])
        full_cost = accumulated + full_increment
        full_segments = [*segments, {"id": node_id, "mode": "terminal", "tokens": full_increment}]
        current_route = [*route, node_id]
        current_loaded = {*loaded, node_id}
        if node["type"] in {"leaf", "hybrid"}:
            results.append({
                "id": f"path-{len(results) + 1:03d}",
                "nodes": current_route,
                "segments": full_segments,
                "terminal": node_id,
                "terminalType": node["type"],
                "tokens": full_cost,
            })
        for edge in outgoing[node_id]:
            increment = 0 if node_id in loaded else edge_cost(edge, tokenized[node_id], encoding)
            walk(
                edge["to"],
                current_route,
                current_loaded,
                accumulated + increment,
                [*segments, {
                    "condition": edge["condition"],
                    "from": node_id,
                    "mode": edge["mode"],
                    "to": edge["to"],
                    "tokens": increment,
                }],
            )

    walk(data["root"], [], set(), 0, [])
    return results


def summarize(paths: list[dict[str, Any]]) -> dict[str, dict[str, int | float | None]]:
    """Resume seis métricas por classe terminal sobre o conjunto completo de rotas."""
    summary: dict[str, dict[str, int | float | None]] = {}
    for kind in ("leaf", "hybrid"):
        values = [int(item["tokens"]) for item in paths if item["terminalType"] == kind]
        summary[kind] = {
            "count": len(values),
            "min": min(values) if values else None,
            "average": round(statistics.fmean(values), 2) if values else None,
            "median": round(statistics.median(values), 2) if values else None,
            "populationStandardDeviation": round(statistics.pstdev(values), 2) if values else None,
            "max": max(values) if values else None,
        }
    return summary


def display_metric(value: int | float | None) -> str:
    """Preserva zero como métrica válida e usa n/a somente para série vazia."""
    return "n/a" if value is None else str(value)


def source_digest(data: dict[str, Any], tokenized: dict[str, dict[str, Any]], script_path: Path) -> str:
    """Combina topologia e hashes das fontes para invalidar todo derivado obsoleto."""
    topology = {
        "edges": data["edges"],
        "nodes": [{key: value for key, value in node.items() if key not in {"bytes", "guard", "sha256", "tokens"}} for node in data["nodes"]],
        "root": data["root"],
    }
    material = json.dumps(topology, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    material += json.dumps({node_id: value["sha256"] for node_id, value in sorted(tokenized.items())}, sort_keys=True)
    script_text = script_path.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\r", "\n")
    material += sha256(script_text.encode("utf-8")) + TOKENIZER_VERSION + ENCODING + MODEL
    return sha256(material.encode("utf-8"))


def render_map(data: dict[str, Any], paths: list[dict[str, Any]], summary: dict[str, Any], generation: dict[str, Any]) -> str:
    """Gera mapa Mermaid e tabelas legíveis sem transformar derivado em autoridade."""
    lines = [
        "# Mapa normativo gerado",
        "",
        f"Origem: `{generation['sourceDigest']}`; revisão: `{generation['commit']}`; "
        f"tokenizer: `tiktoken {TOKENIZER_VERSION}` / `{ENCODING}` / `{MODEL}`.",
        "",
        "Custos são tokens acumulados do conteúdo efetivamente carregado. Aresta passiva lê o nó integral; "
        "imediata lê até seu marcador inclusivo; folha e híbrido terminal incluem conteúdo integral; rotas distintas "
        "permanecem separadas e um nó compartilhado não é contado duas vezes na mesma rota.",
        "",
        "```mermaid",
        "flowchart TD",
    ]
    for node in data["nodes"]:
        label = f"{node['id']}\\n{node['type']}\\n{node['tokens']} tokens"
        lines.append(f'  {node["id"].replace(".", "_").replace("-", "_")}["{label}"]')
    for edge in data["edges"]:
        source = edge["from"].replace(".", "_").replace("-", "_")
        target = edge["to"].replace(".", "_").replace("-", "_")
        lines.append(f'  {source} -->|"{edge["mode"]}: {edge["condition"]}"| {target}')
    lines.extend([
        "```",
        "",
        "## Resumo",
        "",
        "O desvio padrão é populacional e considera uma observação por rota válida.",
        "",
        "| Terminal | Rotas | Mínimo | Média | Mediana | Desvio padrão | Máximo |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ])
    for kind, label in (("leaf", "Folha"), ("hybrid", "Híbrido")):
        row = summary[kind]
        lines.append(
            f"| {label} | {row['count']} | {display_metric(row['min'])} | "
            f"{display_metric(row['average'])} | {display_metric(row['median'])} | "
            f"{display_metric(row['populationStandardDeviation'])} | {display_metric(row['max'])} |"
        )
    lines.extend(["", "## Caminhos", "", "| ID | Rota | Terminal | Tokens |", "|---|---|---|---:|"])
    for item in paths:
        lines.append(f"| {item['id']} | {' → '.join(item['nodes'])} | {item['terminalType']} | {item['tokens']} |")
    return "\n".join(lines) + "\n"


def render_readme_region(summary: dict[str, Any], generation: dict[str, Any], map_link: str) -> str:
    """Materializa somente a região delimitada com métricas e origem rastreável."""
    leaf, hybrid = summary["leaf"], summary["hybrid"]
    return "\n".join([
        README_START,
        "### Métricas do grafo normativo",
        "",
        f"Tokenizer exato: `tiktoken {TOKENIZER_VERSION}` (`{ENCODING}`, alvo `{MODEL}`); "
        f"revisão `{generation['commit']}`; fonte `{generation['sourceDigest'][:12]}`. "
        f"[Mapa completo]({map_link}).",
        "",
        "O desvio padrão é populacional e considera uma observação por rota válida.",
        "",
        "| Terminal | Rotas | Mínimo | Média | Mediana | Desvio padrão | Máximo |",
        "|---|---:|---:|---:|---:|---:|---:|",
        f"| Folha | {leaf['count']} | {display_metric(leaf['min'])} | "
        f"{display_metric(leaf['average'])} | {display_metric(leaf['median'])} | "
        f"{display_metric(leaf['populationStandardDeviation'])} | {display_metric(leaf['max'])} |",
        f"| Híbrido | {hybrid['count']} | {display_metric(hybrid['min'])} | "
        f"{display_metric(hybrid['average'])} | {display_metric(hybrid['median'])} | "
        f"{display_metric(hybrid['populationStandardDeviation'])} | {display_metric(hybrid['max'])} |",
        README_END,
    ])


def replace_region(text: str, replacement: str) -> str:
    """Substitui exclusivamente marcadores preexistentes e rejeita região ambígua."""
    if text.count(README_START) != 1 or text.count(README_END) != 1:
        raise RuntimeError("README_REGIAO_GERENCIADA_INVALIDA")
    start = text.index(README_START)
    end = text.index(README_END) + len(README_END)
    return f"{text[:start]}{replacement}{text[end:]}"


def materialize(root: Path, write: bool, check: bool, accept_normative_change: bool = False) -> dict[str, Any]:
    """Calcula derivados, grava atomicamente quando autorizado e detecta obsolescência."""
    rules = governance_root(root)
    source_root = rules.parent
    index_path = rules / "normative-index.json"
    data = load_index(index_path)
    nodes, outgoing = validate_graph(data, source_root)
    encoding, tokenized = tokenize_nodes(nodes, source_root)
    validate_degradation(data, tokenized, accept_normative_change)
    paths = calculate_paths(data, nodes, outgoing, tokenized, encoding)
    summary = summarize(paths)
    digest = source_digest(data, tokenized, Path(__file__).resolve())
    previous_generation = data.get("generation", {})
    same_source = previous_generation.get("sourceDigest") == digest
    generation = {
        "commit": previous_generation.get("commit") if same_source else git_value(root, ["rev-parse", "--short=7", "HEAD"], "uncommitted"),
        "commitDate": previous_generation.get("commitDate") if same_source else git_value(root, ["show", "-s", "--format=%cI", "HEAD"], "unknown"),
        "encoding": ENCODING,
        "model": MODEL,
        "script": ".ia.rules/scenarios/governance/scripts/normative-graph.py",
        "serialization": "UTF-8; CRLF normalizado para LF; arquivo integral por nó",
        "sourceDigest": digest,
        "tokenizer": "tiktoken",
        "tokenizerVersion": TOKENIZER_VERSION,
    }
    for node in data["nodes"]:
        node.update({
            "bytes": tokenized[node["id"]]["bytes"],
            "guard": tokenized[node["id"]]["guard"],
            "sha256": tokenized[node["id"]]["sha256"],
            "tokens": tokenized[node["id"]]["tokens"],
        })
    data.update({
        "generated": True,
        "generation": generation,
        "metrics": summary,
        "paths": paths,
    })
    index_text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    map_path = rules / "generated" / "normative-map.md"
    map_text = render_map(data, paths, summary, generation)
    readme_path = root / "README.md"
    readme_original = readme_path.read_text(encoding="utf-8")
    map_link = (map_path.relative_to(root)).as_posix()
    readme_text = replace_region(readme_original, render_readme_region(summary, generation, map_link))
    expected = {index_path: index_text, map_path: map_text, readme_path: readme_text}
    stale = [path for path, content in expected.items() if not path.is_file() or path.read_text(encoding="utf-8") != content]
    if write:
        for path, content in expected.items():
            path.parent.mkdir(parents=True, exist_ok=True)
            temporary = path.with_name(f"{path.name}.agents-{os.getpid()}.tmp")
            temporary.write_text(content, encoding="utf-8", newline="\n")
            temporary.replace(path)
        stale = []
    if check and stale:
        raise RuntimeError(f"GRAFO_DERIVADO_OBSOLETO:{','.join(path.relative_to(root).as_posix() for path in stale)}")
    return {"metrics": summary, "paths": len(paths), "sourceDigest": digest, "stale": [str(path) for path in stale]}


def main(argv: list[str] | None = None) -> int:
    """Executa CLI local/CI com saída curta e código não zero em falha normativa."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--accept-normative-change", action="store_true")
    args = parser.parse_args(argv)
    root = repository_root(Path(__file__).resolve())
    result = materialize(root, args.write, args.check, args.accept_normative_change)
    print("| tipo | mínimo | média | mediana | desvio padrão | máximo |")
    print("|---|---:|---:|---:|---:|---:|")
    for kind in ("leaf", "hybrid"):
        row = result["metrics"][kind]
        print(
            f"| {kind} | {display_metric(row['min'])} | {display_metric(row['average'])} | "
            f"{display_metric(row['median'])} | {display_metric(row['populationStandardDeviation'])} | "
            f"{display_metric(row['max'])} |"
        )
    print(json.dumps({"code": "NORMATIVE_GRAPH_OK", "paths": result["paths"], "sourceDigest": result["sourceDigest"]}))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:  # noqa: BLE001 - fronteira CLI deve classificar toda falha.
        print(f"NORMATIVE_GRAPH_ERROR:{error}", file=sys.stderr)
        raise SystemExit(1)
