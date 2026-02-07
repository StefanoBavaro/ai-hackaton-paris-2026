from __future__ import annotations

import json
import re
from typing import Any, Dict, List

PLACEHOLDER_RE = re.compile(r"^QUERY_RESULT_(\d+)$")


import logging

logger = logging.getLogger(__name__)

def parse_json_from_text(text: str) -> Dict[str, Any]:
    if not text:
        raise ValueError("Empty LLM response")

    logger.debug("Parsing JSON from text (len=%d): %r", len(text), text[:200] + "..." if len(text) > 200 else text)

    # Fast path: try parsing the whole text
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Heuristic: find the last closing brace '}' and try backward from there
    # or find the first opening brace '{' and try forward. 
    # Let's try finding the *outermost* valid JSON object.
    
    # We'll try to find the start of the JSON object.
    # We iterate over all '{' positions.
    start_indices = [i for i, char in enumerate(text) if char == "{"]
    
    if not start_indices:
         raise json.JSONDecodeError("No '{' found", text, 0)
         
    # We also need to find the end. 
    end_indices = [i for i, char in enumerate(text) if char == "}"]
    if not end_indices:
         raise json.JSONDecodeError("No '}' found", text, 0)
    
    # Optimization: iterate start indices from first to last
    # Iterate end indices from last to first
    
    for start in start_indices:
        for end in reversed(end_indices):
            if end < start:
                break
            
            snippet = text[start : end + 1]
            try:
                # We found a valid JSON block
                return json.loads(snippet)
            except json.JSONDecodeError:
                continue
            
    # If standard attempts fail, try to use a regex to find a code block
    # (Already handled by strict subset parsing above effectively if clean)
            
    # Detailed failure for debugging
    raise json.JSONDecodeError(f"Could not extract JSON from text (tried {len(start_indices)} start positions)", text, 0)


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
