import json
import pytest
from app.api.routes import _finalize_spec

def test_finalize_spec_hydrates_correctly():
    agent_result = {
        "dashboardSpec": {
            "blocks": [
                {
                    "type": "line-chart",
                    "props": {
                        "title": "Hydration Test",
                        "data": "QUERY_RESULT_0"
                    }
                }
            ]
        },
        "sqlQueries": ["SELECT 1"]
    }
    
    # Mock db_service.query to return dummy data
    from app.services.db import db_service
    original_query = db_service.query
    db_service.query = lambda sql: [{"test": 123}]
    
    try:
        hydrated_spec, sql_queries, safe_queries = _finalize_spec(agent_result, None)
        assert hydrated_spec["blocks"][0]["props"]["data"] == [{"test": 123}]
    finally:
        db_service.query = original_query

def test_placeholder_regex():
    from app.utils.json_tools import PLACEHOLDER_RE
    assert PLACEHOLDER_RE.match("QUERY_RESULT_0")
    assert PLACEHOLDER_RE.match("QUERY_RESULT_10")
    assert not PLACEHOLDER_RE.match("QUERY_RESULT")
    assert not PLACEHOLDER_RE.match("RESULT_0")

def test_parse_json_with_prefix():
    from app.utils.json_tools import parse_json_from_text
    text = "Sure, here is your data: { \"intent\": \"test\", \"assistantMessage\": \"hello\" }"
    parsed = parse_json_from_text(text)
    assert parsed["intent"] == "test"
    assert parsed["assistantMessage"] == "hello"

def test_parse_json_with_markdown():
    from app.utils.json_tools import parse_json_from_text
    text = "Here it is:\n```json\n{ \"intent\": \"test\" }\n```"
    parsed = parse_json_from_text(text)
    assert parsed["intent"] == "test"
