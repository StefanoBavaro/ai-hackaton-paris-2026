
import pytest
from app.utils.json_tools import parse_json_from_text
import json

def test_parse_json_clean():
    assert parse_json_from_text('{"a": 1}') == {"a": 1}

def test_parse_json_markdown():
    assert parse_json_from_text('```json\n{"a": 1}\n```') == {"a": 1}

def test_parse_json_with_text():
    assert parse_json_from_text('Here is json\n{"a": 1}') == {"a": 1}
    assert parse_json_from_text('{"a": 1}\nend') == {"a": 1}
    assert parse_json_from_text('start\n{"a": 1}\nend') == {"a": 1}

def test_parse_json_stray_braces():
    # Case 6 from repro
    assert parse_json_from_text('My answer is { \n {"a": 1}') == {"a": 1}
    # Case 7 from repro
    assert parse_json_from_text('{"a": 1} \n bye }') == {"a": 1}

def test_parse_json_nested():
    # Ensure nested braces don't break it
    assert parse_json_from_text('{"a": {"b": 2}}') == {"a": {"b": 2}}
    assert parse_json_from_text('text {"a": {"b": 2}} text') == {"a": {"b": 2}}

def test_parse_json_multiple_candidates():
    # It should pick the outermost valid one.
    # Text: { invalid } { "valid": 1 }
    # Our logic tries every start brace.
    # First start brace: "{ invalid } { "valid": 1 }" -> invalid
    #                    "{ invalid }" -> invalid (if not valid json)
    # Second start brace: "{ "valid": 1 }" -> valid
    # So it should find the second one if the first one fails.
    
    assert parse_json_from_text('Foo { bar } {"a": 1}') == {"a": 1}

def test_failure():
    with pytest.raises(json.JSONDecodeError):
        parse_json_from_text("no json here")
    with pytest.raises(json.JSONDecodeError):
        parse_json_from_text("{ incomplete ")
