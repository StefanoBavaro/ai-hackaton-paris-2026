import pandas as pd
import numpy as np
from app.services.db import db_service

def test_nan_handling():
    # Insert a NaN value into a temporary table
    db_service.execute("CREATE TABLE test_nan (val DOUBLE)")
    db_service.execute("INSERT INTO test_nan VALUES (CAST('NaN' AS DOUBLE))")
    
    try:
        results = db_service.query("SELECT * FROM test_nan")
        assert len(results) == 1
        assert results[0]["val"] is None
    finally:
        db_service.execute("DROP TABLE test_nan")
