from __future__ import annotations

import re
from typing import Iterable, List

ALLOWED_TABLES = {"stock_prices", "financial_metrics", "news"}

DISALLOWED_KEYWORDS = re.compile(
    r"\b(insert|update|delete|drop|alter|create|copy|export|import|attach|detach|pragma|set)\b",
    re.IGNORECASE,
)

TABLE_PATTERN = re.compile(r"\b(from|join)\s+([a-zA-Z_][\w\.]*)", re.IGNORECASE)


def is_safe_sql(sql: str) -> bool:
    if not sql or not isinstance(sql, str):
        return False

    stripped = sql.strip()
    if not stripped:
        return False

    if ";" in stripped.rstrip(";"):
        return False

    if DISALLOWED_KEYWORDS.search(stripped):
        return False

    if not re.match(r"^\s*(select|with)\b", stripped, re.IGNORECASE):
        return False

    tables = [match[1] for match in TABLE_PATTERN.findall(stripped)]
    for table in tables:
        base = table.split(".")[-1]
        if base not in ALLOWED_TABLES:
            return False

    return True


def filter_safe_queries(queries: Iterable[str]) -> List[str]:
    return [q for q in queries if is_safe_sql(q)]
