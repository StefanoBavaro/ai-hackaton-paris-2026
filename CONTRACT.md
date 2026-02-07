# Backend ↔ Frontend Contract (GenUI)

This contract defines the interface between the FastAPI backend and the Next.js frontend for rendering GenUI dashboard components.

## Overview
- The user asks a question in the frontend.
- The backend uses an LLM to parse intent, generate SQL, and build a dashboard spec.
- The frontend renders the dashboard spec using a JSON renderer registry.

## API Endpoints
### `POST /api/query`
Request:
```
{
  "message": "Show me AAPL vs MSFT performance this quarter",
  "currentChaos": {
    "rotation": 0,
    "fontFamily": "Inter",
    "animation": null,
    "theme": "professional"
  }
}
```

Response:
```
{
  "dashboardSpec": {
    "blocks": [
      { "type": "executive-summary", "props": { "content": "..." } },
      { "type": "kpi-card", "props": { "ticker": "AAPL", "metric": "YTD Return", "value": "+12%", "change": "+2%", "changeDirection": "up" } },
      { "type": "line-chart", "props": { "title": "Performance", "data": [], "xKey": "date", "yKeys": ["AAPL", "MSFT"] } }
    ],
    "chaos": {
      "rotation": 0,
      "fontFamily": "Inter",
      "animation": null,
      "theme": "professional"
    }
  },
  "assistantMessage": "Here is the comparison...",
  "intent": "performance_analysis",
  "queryMetadata": {
    "executionTimeMs": 123,
    "sqlQueriesRequested": 2,
    "sqlQueriesExecuted": 2
  }
}
```

### `GET /health`
Response:
```
{ "status": "ok" }
```

## Dashboard Spec Contract
### Shape
- `dashboardSpec` is an object with:
  - `blocks`: array of `{ type: string, props: object }`
  - `chaos`: optional chaos effects (see below)

### Block Registry
The `type` field must map to a registered GenUI component in the frontend registry.

Supported block types and required props:
- `executive-summary`
  - `content: string`
- `kpi-card`
  - `ticker: string`
  - `metric: string`
  - `value: string`
  - `change: string`
  - `changeDirection: "up" | "down"`
  - `comparisonBenchmark?: string`
- `line-chart`
  - `title: string`
  - `data: any[]`
  - `xKey: string`
  - `yKeys: string[]`
- `candlestick-chart`
  - `ticker: string`
  - `data: any[]`
- `event-timeline`
  - `events: Array<{ date: string, ticker: string, entry_type: string, title: string, summary: string, sentiment_score: number, price_impact_pct: number }>`
- `correlation-matrix`
  - `tickers: string[]`
  - `data: number[][]`
  - `period: string`

### Chaos State
`dashboardSpec.chaos` may include:
- `rotation?: number`
- `fontFamily?: string`
- `animation?: string | null`
- `theme?: string`

Chaos state persists across queries unless explicitly overridden by a chaos command.

## Placeholder Hydration
The backend uses placeholders to insert SQL results:
- LLM outputs placeholders like `QUERY_RESULT_0` in `props`.
- The backend replaces placeholders with query results before responding to the frontend.

## Error Contract
Errors are returned as standard FastAPI errors. Example:
```
{
  "detail": "LLM processing failed"
}
```

## Frontend Expectations
- The frontend treats `assistantMessage` as the chat response.
- The frontend renders each `block` by mapping `type` to a GenUI component.
- `suggestedPrompts` is optional and may be added in future responses.
