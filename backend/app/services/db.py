from __future__ import annotations

import logging
from typing import Any, Dict, List

import duckdb

from app.core.config import settings

logger = logging.getLogger(__name__)


class DuckDBService:
    def __init__(self, db_path: str = settings.db_path) -> None:
        self.db_path = db_path

    def query(self, sql: str, params: Any = None) -> List[Dict[str, Any]]:
        conn = duckdb.connect(self.db_path)
        try:
            if params is not None:
                result = conn.execute(sql, params)
            else:
                result = conn.execute(sql)
            df = result.fetchdf()
            # use to_json to handle NaN/NaT -> null conversion reliably
            import json as json_mod
            return json_mod.loads(df.to_json(orient="records", date_format="iso"))
        except Exception as exc:
            logger.exception("DuckDB query failed", extra={"sql": sql})
            raise exc
        finally:
            conn.close()

    def execute(self, sql: str, params: Any = None) -> None:
        conn = duckdb.connect(self.db_path)
        try:
            if params is not None:
                conn.execute(sql, params)
            else:
                conn.execute(sql)
        finally:
            conn.close()


db_service = DuckDBService()
