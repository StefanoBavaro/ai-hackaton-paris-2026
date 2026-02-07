import os
import json
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """
You are a financial dashboard assistant. Your job is to:
1. Parse user queries to extract financial intent.
2. Generate appropriate dashboard specifications in structured JSON.
3. Create executive summaries of financial data.
4. Detect and execute chaos mode commands.

DATABASE SCHEMA:
- stock_prices (ticker: VARCHAR, date: TIMESTAMP, open: DOUBLE, high: DOUBLE, low: DOUBLE, close: DOUBLE, volume: BIGINT)
- financial_metrics (ticker: VARCHAR, report_period: DATE, market_cap: DOUBLE, pe_ratio: DOUBLE, pb_ratio: DOUBLE, current_ratio: DOUBLE, debt_to_equity: DOUBLE, revenue_growth: DOUBLE, net_income_growth: DOUBLE, free_cash_flow_yield: DOUBLE)
- news (ticker: VARCHAR, date: TIMESTAMP, title: VARCHAR, author: VARCHAR, source: VARCHAR, url: VARCHAR, sentiment: DOUBLE)

TICKERS: AAPL, MSFT, TSLA (Full real data available).

COMPONENTS:
- executive-summary: { content: string }
- kpi-card: { ticker: string, metric: string, value: string, change: string, changeDirection: 'up' | 'down', comparisonBenchmark?: string }
- line-chart: { title: string, data: any[], xKey: string, yKeys: string[] }
- candlestick-chart: { ticker: string, data: any[] }
- event-timeline: { events: any[] }
- correlation-matrix: { tickers: string[], data: number[][], period: string }

CHAOS COMMANDS:
- "flip", "upside down" -> rotation: 180
- "comic sans" -> fontFamily: "Comic Sans MS"
- "wobble" -> animation: "wobble"
- "rainbow" -> animation: "rainbow"
- "matrix mode" -> theme: "matrix"
- "professional mode" -> reset all effects

OUTPUT FORMAT:
Return ONLY a JSON object with:
{
  "intent": string,
  "sqlQueries": string[],
  "assistantMessage": string,
  "dashboardSpec": {
    "blocks": Array<{ type: string, props: any }>,
    "chaos": {
      "rotation": number,
      "fontFamily": string,
      "animation": string | null,
      "theme": string
    }
  }
}

Use "QUERY_RESULT_0", "QUERY_RESULT_1", etc. as placeholders in the spec for data that will be replaced by the results of the corresponding SQL queries.
"""

async def process_query(message: str, current_chaos: dict = None):
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": message}],
    )

    content = response.content[0].text
    try:
        # Robustly handle potential non-JSON prefix/suffix
        start_idx = content.find('{')
        end_idx = content.rfind('}') + 1
        if start_idx != -1 and end_idx != -1:
            json_str = content[start_idx:end_idx]
            return json.loads(json_str)
        return json.loads(content)
    except Exception as e:
        print(f"Failed to parse Claude response: {content}\n{e}")
        raise ValueError("Invalid response from AI")
