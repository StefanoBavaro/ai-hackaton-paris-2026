# GenUI Analytics — Backend Data Specification

This document describes the expected JSON data structures for each chart/artifact type in the GenUI Analytics system. The LLM backend generates **JSON specs**, not JSX—ensuring determinism, security, and visual consistency.

## Architecture Overview

```
┌──────────────┐     ┌─────────────────┐     ┌────────────────┐
│   User       │     │   LLM Backend   │     │   Frontend     │
│   Query      │ ──▶ │   (generates    │ ──▶ │   Renderer     │
│              │     │   JSON specs)   │     │   (React)      │
└──────────────┘     └─────────────────┘     └────────────────┘
```

## Response Structure

Each assistant response contains:

```typescript
interface AssistantResponse {
  chainOfThought: ThoughtStep[]    // Reasoning steps (collapsible)
  document: Document               // The rendered artifact
  suggestedPrompts: string[]       // Follow-up suggestions
}

interface ThoughtStep {
  thought: string                  // Natural language explanation
  sql?: string                     // Optional: SQL that was executed
  status?: string                  // Optional: Status message
}

interface Document {
  title: string                    // Artifact headline (serif)
  subtitle?: string                // Italic description
  sections: Section[]              // Content sections
}

interface Section {
  heading?: string                 // Section label (uppercase)
  blocks: UIBlock[]                // Content blocks
}
```

---

## Block Types & Data Formats

### 1. Metric Card

Single KPI display with label, value, and optional sublabel.

```json
{
  "type": "metric_card",
  "label": "Total Revenue",
  "value": "$502.8M",
  "sublabel": "Annualized Aggregate"
}
```

### 2. Metric Grid

Multiple KPIs in a responsive grid (2-4 columns).

```json
{
  "type": "metric_grid",
  "metrics": [
    {
      "label": "Total Revenue",
      "value": "$502.8M",
      "sublabel": "Annualized Aggregate"
    },
    {
      "label": "Order Volume",
      "value": "163,452",
      "sublabel": "Total Transactions"
    },
    {
      "label": "Active Markets",
      "value": "21",
      "sublabel": "Countries Represented"
    }
  ]
}
```

### 3. Geographic Map

Bubble map with data points positioned by lat/lng.

```json
{
  "type": "map",
  "bubbles": [
    {
      "id": "poland",
      "name": "Poland",
      "lat": 51.92,
      "lng": 19.15,
      "value": 56900000,
      "label": "Revenue: $56.9M",
      "sublabel": "Orders: 18,092"
    }
  ]
}
```

**Notes:**
- `value` determines bubble size (square root scaling)
- `lat`/`lng` in decimal degrees (WGS84)
- `label` and `sublabel` shown in tooltip on click

### 4. Bar Chart

Vertical bar chart with optional highlight.

```json
{
  "type": "bar_chart",
  "data": [
    { "label": "JAN", "value": 8.3 },
    { "label": "FEB", "value": 7.8 },
    { "label": "OCT", "value": 24.8, "highlight": true },
    { "label": "NOV", "value": 16.2 }
  ],
  "highlightLabel": "OCT"
}
```

**Notes:**
- `highlight: true` or matching `highlightLabel` renders in accent color
- Values are relative (units determined by context)

### 5. Data Table

Simple table with columns and rows.

```json
{
  "type": "table",
  "columns": ["Country", "Revenue", "Orders"],
  "rows": [
    { "country": "Venezuela", "revenue": "$57.1M", "orders": "19,234" },
    { "country": "Poland", "revenue": "$56.9M", "orders": "18,092" }
  ],
  "note": "Optional footnote text"
}
```

**Notes:**
- Column names map to row keys (lowercased, spaces → underscores)
- `note` renders as italic footnote below table

### 6. Distribution Table

Table with progress bar visualization for shares/percentages.

```json
{
  "type": "distribution_table",
  "rows": [
    {
      "region": "Western Region",
      "staff": 9,
      "orders": 163452,
      "revenue": "$1,297,469,491",
      "share": 63.9
    },
    {
      "region": "Southern Region",
      "staff": 7,
      "orders": 127338,
      "revenue": "$731,438,234",
      "share": 36.1
    }
  ],
  "note": "Staff counts represent unique employees..."
}
```

### 7. Ranking Table

Simple two-column ranking list.

```json
{
  "type": "ranking_table",
  "title": "Top 5 Markets by Country",
  "rows": [
    { "label": "Venezuela", "value": "$57.1M" },
    { "label": "Poland", "value": "$57.0M" },
    { "label": "Finland", "value": "$48.1M" }
  ]
}
```

### 8. Sparkline Table

Table with inline sparkline trends.

```json
{
  "type": "sparkline_table",
  "columns": ["Jan–Feb", "Mar–Apr", "May–Jun", "Jul–Aug", "Sep–Oct", "Nov–Dec"],
  "rows": [
    {
      "label": "Venezuela",
      "values": ["$2.3B", "$2.3B", "$2.6B", "$6.9B", "$9.0B", "$4.0B"],
      "trend": "up"
    },
    {
      "label": "Poland",
      "values": ["$2.1B", "$2.2B", "$2.5B", "$6.5B", "$8.5B", "$3.8B"],
      "trend": "up"
    }
  ]
}
```

**Notes:**
- `trend`: "up" | "down" | "flat" determines sparkline shape
- Values are display strings (pre-formatted)

### 9. Rich Text

Narrative paragraph with optional highlights.

```json
{
  "type": "rich_text",
  "content": "The current distribution reveals a significant concentration of volume in South American and European markets. Venezuela leads with $57.1M in revenue.",
  "highlights": [
    { "text": "Venezuela" },
    { "text": "South American" }
  ]
}
```

**Notes:**
- Highlighted text rendered in accent color with medium weight
- Content supports basic text (HTML sanitized on frontend)

### 10. Two-Column Text

Side-by-side narrative analysis (McKinsey-style).

```json
{
  "type": "two_column_text",
  "left": "The data reveals an extraordinary synchronization in purchasing behavior across disparate geographic regions...",
  "right": "This suggests that Eastlake's product portfolio is highly sensitive to year-end procurement cycles...",
  "highlights": [
    { "text": "South American hub of Venezuela" },
    { "text": "North European market of Finland" }
  ]
}
```

---

## Complete Response Example

```json
{
  "chainOfThought": [
    {
      "thought": "I will first query the total sales summarized by country.",
      "sql": "SELECT country, SUM(revenue) FROM orders GROUP BY country"
    },
    {
      "thought": "I will now generate the regional analysis.",
      "status": "Generating Sales Analysis Report..."
    }
  ],
  "document": {
    "title": "Global Sales Distribution Analysis",
    "subtitle": "A comprehensive audit of geographic clusters and market penetration.",
    "sections": [
      {
        "blocks": [
          {
            "type": "metric_grid",
            "metrics": [
              { "label": "Total Revenue", "value": "$502.8M" },
              { "label": "Order Volume", "value": "163,452" }
            ]
          }
        ]
      },
      {
        "heading": "Geographic Market Maturity",
        "blocks": [
          {
            "type": "map",
            "bubbles": [
              {
                "id": "poland",
                "name": "Poland",
                "lat": 51.92,
                "lng": 19.15,
                "value": 56900000,
                "label": "Revenue: $56.9M"
              }
            ]
          }
        ]
      },
      {
        "heading": "Market Analysis Narrative",
        "blocks": [
          {
            "type": "rich_text",
            "content": "Venezuela leads with $57.1M in revenue...",
            "highlights": [{ "text": "Venezuela" }]
          }
        ]
      }
    ]
  },
  "suggestedPrompts": [
    "What are the seasonal patterns in our top markets?",
    "Which products drive the most revenue?"
  ]
}
```

---

## Design Principles

1. **LLM outputs JSON, never JSX** — Ensures security and consistency
2. **Progressive disclosure** — Chain-of-thought is collapsible metadata
3. **Tufte-style aesthetics** — High data-ink ratio, minimal chart junk
4. **Executive-report layout** — Each response is a deliverable, not a message
5. **Semantic structure** — Sections and blocks compose into documents

---

## TypeScript Types

Full type definitions available in `lib/types.ts` for frontend integration.
