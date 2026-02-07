from __future__ import annotations

import logging
import time
from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException

from app.schemas.api import QueryRequest, QueryResponse, DashboardSpec
from app.services.db import db_service
from app.services.llm import llm_service
from app.utils.json_tools import normalize_dashboard_spec, replace_query_placeholders
from app.utils.sql_guard import filter_safe_queries

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health")
def health_check() -> Dict[str, str]:
    return {"status": "ok"}


@router.post("/api/query", response_model=QueryResponse)
async def handle_query(request: QueryRequest) -> QueryResponse:
    start_time = time.time()

    try:
        llm_result = await llm_service.process_query(request.message, request.currentChaos)
    except Exception as exc:
        logger.exception("LLM processing failed")
        raise HTTPException(status_code=502, detail="LLM processing failed") from exc

    sql_queries: List[str] = llm_result.get("sqlQueries", []) if isinstance(llm_result, dict) else []
    safe_queries = filter_safe_queries(sql_queries)

    if len(safe_queries) < len(sql_queries):
        logger.warning("Unsafe SQL queries were filtered", extra={"total": len(sql_queries), "safe": len(safe_queries)})

    query_results: List[Any] = []
    for sql in safe_queries:
        try:
            data = db_service.query(sql)
            query_results.append(data)
        except Exception:
            logger.exception("SQL execution failed", extra={"sql": sql})
            query_results.append([])

    raw_spec = llm_result.get("dashboardSpec", {}) if isinstance(llm_result, dict) else {}
    normalized_spec_dict = normalize_dashboard_spec(raw_spec)
    hydrated_spec = replace_query_placeholders(normalized_spec_dict, query_results)

    # Carry forward chaos state if LLM omitted it
    if request.currentChaos and not hydrated_spec.get("chaos"):
        hydrated_spec["chaos"] = request.currentChaos

    intent = llm_result.get("intent", "unknown") if isinstance(llm_result, dict) else "unknown"
    assistant_message = llm_result.get("assistantMessage", "") if isinstance(llm_result, dict) else ""

    elapsed_ms = int((time.time() - start_time) * 1000)
    response = QueryResponse(
        dashboardSpec=DashboardSpec.model_validate(hydrated_spec),
        assistantMessage=assistant_message,
        intent=intent,
        queryMetadata={
            "executionTimeMs": elapsed_ms,
            "sqlQueriesRequested": len(sql_queries),
            "sqlQueriesExecuted": len(safe_queries),
        },
    )

    return response
