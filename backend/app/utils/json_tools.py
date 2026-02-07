from __future__ import annotations

import json
import re
from typing import Any, Dict, List

PLACEHOLDER_RE = re.compile(r"^QUERY_RESULT_(\d+)$")


def parse_json_from_text(text: str) -> Dict[str, Any]:
    if not text:
        raise ValueError("Empty LLM response")

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start_idx = text.find("{")
        end_idx = text.rfind("}") + 1
        if start_idx == -1 or end_idx == 0:
            raise
        snippet = text[start_idx:end_idx]
        return json.loads(snippet)


def normalize_dashboard_spec(spec: Any) -> Dict[str, Any]:
    if not isinstance(spec, dict):
        return {"blocks": []}

    blocks = spec.get("blocks")
    if not isinstance(blocks, list):
        blocks = []

    normalized_blocks: List[Dict[str, Any]] = []
    for block in blocks:
        if not isinstance(block, dict):
            continue
        block_type = block.get("type")
        if not block_type:
            continue
        if "props" in block and isinstance(block.get("props"), dict):
            normalized_blocks.append({"type": block_type, "props": block["props"]})
            continue
        props = {k: v for k, v in block.items() if k != "type"}
        normalized_blocks.append({"type": block_type, "props": props})

    chaos = spec.get("chaos")
    if chaos is not None and not isinstance(chaos, dict):
        chaos = None

    normalized = {"blocks": normalized_blocks}
    if chaos is not None:
        normalized["chaos"] = chaos
    return normalized


def replace_query_placeholders(value: Any, query_results: List[Any]) -> Any:
    if isinstance(value, str):
        match = PLACEHOLDER_RE.match(value)
        if match:
            idx = int(match.group(1))
            return query_results[idx] if idx < len(query_results) else []
        return value

    if isinstance(value, list):
        return [replace_query_placeholders(item, query_results) for item in value]

    if isinstance(value, dict):
        return {k: replace_query_placeholders(v, query_results) for k, v in value.items()}

    return value
