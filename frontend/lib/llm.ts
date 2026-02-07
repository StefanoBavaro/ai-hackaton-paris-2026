import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export const SYSTEM_PROMPT = `
You are a financial dashboard assistant. Your job is to:
1. Parse user queries to extract financial intent.
2. Generate appropriate dashboard specifications in structured JSON.
3. Create executive summaries of financial data.
4. Detect and execute chaos mode commands.

DATABASE SCHEMA:
- stock_prices (ticker, date, open, high, low, close, volume)
- journal_entries (entry_id, ticker, date, entry_type, title, summary, sentiment_score, price_impact_pct, metadata)
- portfolio_holdings (ticker, shares, cost_basis, purchase_date)

TICKERS: AAPL, MSFT, GOOGL, TSLA, NVDA, META, AMZN, SPY (benchmark).

COMPONENTS:
- executive-summary: { content: string }
- kpi-card: { ticker: string, metric: string, value: string, change: string, changeDirection: 'up' | 'down', comparisonBenchmark?: string }
- line-chart: { title: string, data: any[], xKey: string, yKeys: string[] }
- event-timeline: { events: any[] }

CHAOS COMMANDS:
- "flip", "upside down" -> rotation: 180
- "comic sans" -> fontFamily: "Comic Sans MS"
- "wobble" -> animation: "wobble"
- "rainbow" -> animation: "rainbow"
- "matrix mode" -> theme: "matrix"
- "professional mode" -> reset all effects

OUTPUT FORMAT:
Return a JSON object with:
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
`;

export async function processQuery(message: string, currentChaos: any = {}) {
    const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022', // Using Sonnet as 4.5 might not be available yet or as a placeholder
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    try {
        return JSON.parse(content);
    } catch (e) {
        console.error('Failed to parse Claude response:', content);
        throw new Error('Invalid response from AI');
    }
}
