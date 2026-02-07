from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json

from llm import process_query
from db import db_service

app = FastAPI(title="FinanceFlip API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify the actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    message: str
    currentChaos: Optional[Dict[str, Any]] = None

@app.post("/api/query")
async def handle_query(request: QueryRequest):
    try:
        # 1. Process query with LLM
        result = await process_query(request.message, request.currentChaos)

        # 2. Execute SQL queries
        query_results = []
        sql_queries = result.get("sqlQueries", [])
        
        for sql in sql_queries:
            try:
                data = db_service.query(sql)
                query_results.append(data)
            except Exception as e:
                print(f"SQL Execution Error: {e}")
                query_results.append([])

        # 3. Replace placeholders in dashboardSpec
        spec = result.get("dashboardSpec", {})
        spec_str = json.dumps(spec)
        
        for i, data in enumerate(query_results):
            placeholder = f'"QUERY_RESULT_{i}"'
            # Convert data to JSON string for replacement
            data_json = json.dumps(data)
            spec_str = spec_str.replace(placeholder, data_json)

        final_spec = json.loads(spec_str)

        return {
            "dashboardSpec": final_spec,
            "assistantMessage": result.get("assistantMessage", ""),
            "intent": result.get("intent", "unknown")
        }

    except Exception as e:
        print(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}
