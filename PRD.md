Product Requirements Document: FinanceFlip Dashboard
1. Overview
1.1 Product Vision
FinanceFlip is a conversational portfolio analytics dashboard that generates real-time financial visualizations through natural language. It combines serious financial analysis with playful UI manipulation, demonstrating the power of GenUI while creating a memorable hackathon demo.
1.2 Target Audience

Hackathon judges and attendees
Developers interested in GenUI/LLM applications
Finance professionals curious about conversational analytics

1.3 Success Metrics

Dashboard generation time < 500ms from query submission
100% accuracy in chaos command execution
Positive audience reaction to humor elements
Clear demonstration of technical capabilities


2. Core Features
2.1 Conversational Dashboard Generation
User Story: As a user, I want to ask financial questions in natural language and instantly see relevant visualizations.
Functional Requirements:

Chat interface accepts text input
System parses queries to extract:

Ticker symbols (e.g., AAPL, MSFT, GOOGL)
Time periods (YTD, Q4 2024, last 6 months, etc.)
Comparison requests (vs SPY, vs each other)
Metric types (returns, volatility, correlation)


Generates appropriate dashboard blocks based on query intent
Supports follow-up refinement ("add TSLA", "show only last month")

Query Examples:

"Show me AAPL performance this quarter"
"Compare MSFT vs GOOGL vs SPY year-to-date"
"What's my tech portfolio volatility?"
"Show me events that impacted AAPL in Q4"

Non-Functional Requirements:

Response time: < 500ms for cached queries, < 2s for complex new queries
Support 5+ concurrent queries without degradation


2.2 Dashboard Block Types
User Story: As a user, I want to see different types of financial data visualized appropriately.
Block Types & Specifications:
Executive Summary Block
json{
  "type": "executive-summary",
  "content": "Generated narrative summary",
  "tone": "professional" | "casual" | "technical"
}

AI-generated 2-3 sentence summary
Highlights key findings and comparisons
Updates when data changes

KPI Card Block
json{
  "type": "kpi-card",
  "ticker": "AAPL",
  "metric": "YTD Return",
  "value": "+24.5%",
  "change": "+2.1%",
  "changeDirection": "up" | "down",
  "comparisonBenchmark": "SPY: +18.3%"
}

Large prominent value
Color-coded change indicator (green/red)
Optional benchmark comparison

Line Chart Block
json{
  "type": "line-chart",
  "title": "Portfolio Performance",
  "data": [{date: "2024-01-01", AAPL: 150, MSFT: 380}],
  "xKey": "date",
  "yKeys": ["AAPL", "MSFT", "SPY"],
  "yAxisLabel": "Price ($)",
  "showLegend": true
}

Multi-series support (up to 5 tickers)
Responsive dimensions
Tooltip on hover with all series values

Candlestick Chart Block
json{
  "type": "candlestick-chart",
  "ticker": "AAPL",
  "data": [{date: "2024-01-01", open: 150, high: 155, low: 148, close: 153}],
  "showVolume": true
}

OHLC visualization
Optional volume bars below
Date range selector

Event Timeline Block
json{
  "type": "event-timeline",
  "events": [
    {
      "date": "2024-01-15",
      "ticker": "AAPL",
      "type": "earnings",
      "title": "Q4 Earnings Beat Expectations",
      "summary": "Revenue up 12% YoY",
      "sentiment": "positive" | "negative" | "neutral",
      "priceImpact": "+3.2%"
    }
  ]
}

Chronological event list
Color-coded by sentiment
Shows price impact
Clickable for details

Correlation Matrix Block
json{
  "type": "correlation-matrix",
  "tickers": ["AAPL", "MSFT", "GOOGL"],
  "data": [[1.0, 0.85, 0.72], [0.85, 1.0, 0.68], ...],
  "period": "90d"
}

Heatmap visualization
Symmetric matrix
Values from -1 to +1

Functional Requirements:

All blocks render within 100ms once data available
Responsive to container width
Consistent styling across block types
Smooth transitions when updating


2.3 Chaos Mode Features
User Story: As a demo presenter, I want to surprise the audience with humorous UI manipulations to show the flexibility of GenUI.
Chaos Commands:
CommandEffectImplementation"flip the dashboard"Rotate 180°transform: rotate(180deg)"comic sans mode"Change fontfontFamily: 'Comic Sans MS'"make it wobble"Shake animationCSS keyframe animation"rainbow mode"Cycle colorsAnimated gradient background"matrix mode"Green terminal themeDark bg + green text + monospace"party mode"All effects at onceCombine multiple effects"professional mode"Reset allClear all chaos state
Functional Requirements:

Chaos commands detected via keyword matching in LLM
Effects apply with 300ms CSS transition
Multiple effects can stack
Dashboard remains functional during chaos
Text remains readable (even upside down)

Technical Constraints:

No performance degradation with effects applied
Effects must work across all block types
Animations should be smooth (60fps)


2.4 Data Management
User Story: As a developer, I need realistic financial data that's fast to query.
DuckDB Schema:
sqlCREATE TABLE stock_prices (
    ticker VARCHAR,
    date DATE,
    open DECIMAL(10,2),
    high DECIMAL(10,2),
    low DECIMAL(10,2),
    close DECIMAL(10,2),
    volume BIGINT,
    PRIMARY KEY (ticker, date)
);

CREATE TABLE journal_entries (
    entry_id VARCHAR PRIMARY KEY,
    ticker VARCHAR,
    date DATE,
    entry_type VARCHAR, -- earnings, acquisition, scandal, product_launch, regulatory
    title VARCHAR,
    summary TEXT,
    sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
    price_impact_pct DECIMAL(5,2),
    metadata JSON
);

CREATE TABLE portfolio_holdings (
    ticker VARCHAR,
    shares INTEGER,
    cost_basis DECIMAL(10,2),
    purchase_date DATE
);
```

**Seed Data Requirements**:
- 5-7 major tech stocks (AAPL, MSFT, GOOGL, TSLA, NVDA, META, AMZN)
- 1 year of daily price history
- SPY benchmark data for comparisons
- 20-30 journal entries per ticker with diverse event types
- Realistic price movements and correlations

**Query Performance Targets**:
- Price range queries: < 50ms
- Aggregations (returns, volatility): < 100ms
- Join queries (prices + events): < 150ms

---

## 3. User Flow

### 3.1 Primary Flow - Dashboard Generation
```
1. User lands on page
   → Empty chat interface with example queries
   
2. User types: "Show me AAPL vs MSFT performance this quarter"
   → Message appears in chat
   → Loading indicator shows
   
3. System processes (< 2s total)
   → LLM parses query → extracts tickers, timeframe, intent
   → SQL queries execute in parallel
   → Executive summary generates
   → Dashboard spec created
   
4. Dashboard renders
   → Blocks appear with stagger animation
   → Executive summary at top
   → 2 KPI cards (AAPL, MSFT)
   → Line chart comparing both
   → Event timeline showing relevant events
   
5. User asks follow-up: "Add GOOGL"
   → Dashboard updates with GOOGL data
   → New KPI card added
   → Chart series added
   → Summary regenerated
```

### 3.2 Chaos Mode Flow
```
1. User has dashboard visible
   
2. User types: "flip it upside down"
   → LLM detects chaos command
   → Returns updated spec with rotation: 180
   
3. Dashboard animates
   → 300ms smooth rotation
   → Content inverts but remains functional
   
4. User types: "now comic sans"
   → Font changes with transition
   
5. User types: "okay professional mode"
   → All effects clear
   → Dashboard returns to normal
```

---

## 4. Technical Architecture

### 4.1 Tech Stack

**Frontend**:
- React 18 with TypeScript
- Next.js 14 (App Router)
- json-renderer from Vercel for dynamic block rendering
- Recharts for charts
- Tailwind CSS for styling
- Framer Motion for animations

**Backend**:
- Next.js API routes
- DuckDB (node-duckdb) for data storage
- Claude Sonnet 4.5 via Anthropic API

**Deployment**:
- Vercel (frontend + API)
- DuckDB file stored in project (< 50MB)

### 4.2 System Architecture
```
┌─────────────────┐
│   User Browser  │
│                 │
│  Chat Interface │
│       +         │
│  Dashboard View │
└────────┬────────┘
         │
         │ HTTP/WebSocket
         │
┌────────▼────────────────────────────────┐
│         Next.js Backend                 │
│                                         │
│  ┌─────────────┐      ┌──────────────┐ │
│  │  API Route  │◄────►│  LLM Service │ │
│  │  /api/query │      │   (Claude)   │ │
│  └──────┬──────┘      └──────────────┘ │
│         │                               │
│         │                               │
│  ┌──────▼──────────┐                   │
│  │ Query Processor │                   │
│  │ - Parse intent  │                   │
│  │ - Generate SQL  │                   │
│  │ - Build spec    │                   │
│  └──────┬──────────┘                   │
│         │                               │
│  ┌──────▼──────────┐                   │
│  │    DuckDB       │                   │
│  │  - stock_prices │                   │
│  │  - journal_*    │                   │
│  └─────────────────┘                   │
└─────────────────────────────────────────┘
4.3 API Specification
POST /api/query
Request:
json{
  "message": "Show me AAPL vs MSFT this quarter",
  "conversationHistory": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ],
  "currentDashboard": { /* existing spec if any */ }
}
Response:
json{
  "dashboardSpec": {
    "layout": "grid",
    "blocks": [ /* block array */ ],
    "theme": "professional",
    "chaosEffects": {
      "rotation": 0,
      "fontFamily": "Inter",
      "animation": null
    }
  },
  "assistantMessage": "Here's the comparison of AAPL vs MSFT...",
  "queryMetadata": {
    "executionTime": 487,
    "sqlQueriesRun": 3,
    "cacheHit": false
  }
}
Error Response:
json{
  "error": "Unable to parse query",
  "message": "Could you specify which ticker symbols you're interested in?",
  "suggestions": ["Try: 'AAPL performance'", "Try: 'Compare MSFT vs GOOGL'"]
}
```

---

## 5. LLM Integration

### 5.1 System Prompt
```
You are a financial dashboard assistant. Your job is to:
1. Parse user queries to extract financial intent
2. Generate appropriate dashboard specifications
3. Create executive summaries of financial data
4. Detect and execute chaos mode commands

Query Parsing:
- Extract ticker symbols (AAPL, MSFT, etc.)
- Identify time periods (YTD, Q4, last month, etc.)
- Determine visualization types needed
- Detect comparison requests

Dashboard Spec Generation:
- Choose appropriate block types for the query
- Order blocks logically (summary first, then KPIs, then charts)
- Limit to 6 blocks maximum for clarity
- Use consistent formatting

Chaos Commands (these override normal query parsing):
- "flip", "upside down", "rotate" → rotation: 180
- "comic sans" → fontFamily: "Comic Sans MS"
- "wobble", "shake" → animation: "wobble"
- "rainbow" → animation: "rainbow"
- "matrix mode" → theme: "matrix"
- "professional mode" → reset all effects

Output Format:
Return JSON only, no explanatory text.
```

### 5.2 Example LLM Interactions

**Example 1: Basic Query**
```
User: "Show me AAPL performance this quarter"

LLM Output:
{
  "intent": "performance_analysis",
  "tickers": ["AAPL"],
  "timeframe": "Q4-2024",
  "comparison": null,
  "dashboardSpec": {
    "blocks": [
      {
        "type": "executive-summary",
        "content": "AAPL gained 15.3% in Q4 2024, outperforming the S&P 500 by 3.2 percentage points. Strong iPhone 15 sales and services growth drove the rally."
      },
      {
        "type": "kpi-card",
        "ticker": "AAPL",
        "metric": "Q4 Return",
        "value": "+15.3%",
        "change": "+3.2%",
        "changeDirection": "up",
        "comparisonBenchmark": "SPY: +12.1%"
      },
      {
        "type": "line-chart",
        "title": "AAPL Price Performance - Q4 2024",
        "data": "QUERY_RESULT_1",
        "xKey": "date",
        "yKeys": ["AAPL", "SPY"]
      },
      {
        "type": "event-timeline",
        "events": "QUERY_RESULT_2"
      }
    ]
  },
  "sqlQueries": [
    "SELECT date, close as AAPL FROM stock_prices WHERE ticker='AAPL' AND date >= '2024-10-01' AND date <= '2024-12-31'",
    "SELECT * FROM journal_entries WHERE ticker='AAPL' AND date >= '2024-10-01' AND date <= '2024-12-31' ORDER BY date DESC"
  ]
}
```

**Example 2: Chaos Command**
```
User: "flip this dashboard upside down lol"

LLM Output:
{
  "intent": "chaos_command",
  "chaosType": "rotation",
  "assistantMessage": "Flipping it! 🙃",
  "dashboardUpdate": {
    "chaosEffects": {
      "rotation": 180
    }
  }
}
```

---

## 6. UI/UX Specifications

### 6.1 Layout
```
┌─────────────────────────────────────────────────────┐
│                    FinanceFlip 📊                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Dashboard Area                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  [Executive Summary Block]                  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   KPI Card   │  │   KPI Card   │                │
│  └──────────────┘  └──────────────┘                │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │          [Line Chart Block]                 │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │       [Event Timeline Block]                │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Chat Interface                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ User: Show me AAPL vs MSFT                  │   │
│  │ Assistant: Here's the comparison...         │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Type your query here...              ] [Send]    │
│                                                     │
└─────────────────────────────────────────────────────┘
6.2 Visual Design
Color Palette:

Primary: #2563eb (blue-600)
Success/Up: #10b981 (green-500)
Danger/Down: #ef4444 (red-500)
Background: #f9fafb (gray-50)
Surface: #ffffff
Text: #111827 (gray-900)
Text Secondary: #6b7280 (gray-500)

Typography:

Headings: Inter Bold, 24px/32px/20px
Body: Inter Regular, 16px
KPI Values: Inter Bold, 32px
Monospace (for numbers): JetBrains Mono

Spacing:

Block padding: 24px
Block gap: 16px
Container max-width: 1200px

Animations:

Block entrance: Fade + slide up, 300ms ease-out
Chaos transitions: 300ms ease-in-out
Hover states: 150ms ease

6.3 Responsive Behavior

Desktop (> 1024px): 2-column grid for KPI cards
Tablet (768-1024px): Single column, full-width charts
Mobile (< 768px): Stack all blocks vertically, condensed KPIs


7. Demo Script for Hackathon
7.1 Opening (30 seconds)
"I'm going to show you FinanceFlip - a conversational dashboard that generates financial visualizations in real-time. Watch how fast this is."
7.2 Core Demo (90 seconds)

Type: "Show me AAPL vs MSFT performance this quarter"

Point out speed of generation
Highlight executive summary
Show different block types


Type: "Add GOOGL to the comparison"

Demonstrate iteration
Show dashboard updates smoothly


Type: "What events impacted these stocks?"

Event timeline appears
Show sentiment indicators



7.3 Chaos Mode (45 seconds)

Type: "Now flip the entire dashboard"

Dashboard rotates 180°
Audience reaction


Type: "Comic sans mode"

Font changes
Laugh


Type: "Make it wobble"

Shake animation
Show it's still functional


Type: "Okay, professional mode"

Everything resets
Back to serious



7.4 Technical Highlight (30 seconds)
"Under the hood: DuckDB for sub-100ms queries, Claude for natural language parsing, json-renderer for dynamic UI generation. The entire stack is deployed on Vercel."
7.5 Closing (15 seconds)
"GenUI lets us build interfaces that are both powerful and playful. Thanks!"

8. Development Timeline
Phase 1: Foundation (Day 1)

 Set up Next.js project with TypeScript
 Integrate json-renderer
 Create basic chat interface
 Set up DuckDB with schema
 Generate seed data (stock prices + journal entries)

Phase 2: Core Features (Day 2)

 Implement LLM query parsing
 Build SQL query generator
 Create all 6 block type components
 Implement dashboard rendering from spec
 Add executive summary generation

Phase 3: Polish & Chaos (Day 3)

 Implement all chaos mode effects
 Add animations and transitions
 Performance optimization
 Responsive design
 Error handling

Phase 4: Demo Prep (Day 4)

 Create demo dataset with interesting events
 Write and rehearse demo script
 Record backup video
 Deploy to Vercel
 Prepare slides (if needed)


9. Success Criteria
Must Have (MVP)

✅ Parse 5+ query types accurately
✅ Generate dashboard in < 2s
✅ Render all 6 block types correctly
✅ 3+ chaos mode effects working
✅ Responsive on desktop
✅ Deployed and stable

Nice to Have

Streaming dashboard generation (blocks appear as ready)
Voice input via Web Speech API
Export dashboard as PNG
Share dashboard via URL
Dark mode theme
Additional chart types (bar, pie)

Won't Have (Out of Scope)

Real-time market data
User authentication
Saved dashboards
Multi-user collaboration
Mobile app


10. Risk Mitigation
RiskProbabilityImpactMitigationLLM rate limits during demoMediumHighCache common queries, have offline modeDuckDB performance issuesLowHighPre-aggregate metrics, test with realistic datajson-renderer limitationsMediumMediumFallback to hardcoded componentsChaos effects cause rendering bugsMediumLowThorough testing, graceful degradationAPI latency during demoMediumHighDeploy to Vercel's fastest region, have backup video

11. Open Questions

Should we support custom date ranges (e.g., "Jan 15 to Feb 20") or stick to presets?

Recommendation: Start with presets, add custom if time permits


How many tickers can be compared simultaneously?

Recommendation: Max 5 for chart readability


Should chaos mode effects persist across queries?

Recommendation: Yes, until "professional mode" is requested


Do we need a tutorial/onboarding flow?

Recommendation: No, just show example queries on empty state


Should executive summary update when data changes, or only on new query?

Recommendation: Update on every dashboard change for consistency




12. Appendix
12.1 Example Queries to Support

"Show me AAPL performance this quarter"
"Compare MSFT vs GOOGL vs SPY year-to-date"
"What's the correlation between AAPL and MSFT?"
"Show me all earnings events for tech stocks in Q4"
"What's my portfolio volatility?"
"Which stock performed best last month?"
"Show me TSLA with volume"
"Compare my portfolio to SPY"

12.2 Chaos Commands to Support

flip, upside down, rotate, invert
comic sans, change font
wobble, shake, wiggle
rainbow, colorful
matrix, matrix mode, hacker mode
party mode, chaos mode
professional mode, normal, reset

12.3 Dependencies
json{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "recharts": "^2.10.0",
    "framer-motion": "^10.16.0",
    "@anthropic-ai/sdk": "^0.20.0",
    "duckdb": "^0.9.0",
    "tailwindcss": "^3.4.0",
    "@vercel/json-renderer": "latest"
  }
}