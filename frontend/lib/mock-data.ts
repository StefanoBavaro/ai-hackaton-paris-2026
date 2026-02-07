import type { ThoughtStep, Document } from "./types"

interface MockResponse {
  chainOfThought: ThoughtStep[]
  document: Document
  suggestedPrompts: string[]
}

export const mockResponses: Record<string, MockResponse> = {
  salesByRegion: {
    chainOfThought: [
      {
        thought:
          "I will first start by querying the total sales and order volume summarized by country to identify our key geographic markets and prepare the data for regional analysis.",
        sql: "SELECT country, SUM(revenue) as total_revenue, COUNT(*) as order_count FROM orders GROUP BY country ORDER BY total_revenue DESC",
      },
      {
        thought:
          "I will now query the sales performance by the internal company regions (Southern and Western) to provide an executive summary of how our two primary sales domains are performing.",
        sql: "SELECT region, COUNT(DISTINCT employee_id) as staff, SUM(order_count) as orders, SUM(revenue) as revenue FROM sales_by_region GROUP BY region",
      },
      {
        thought:
          "I will now fetch monthly revenue trends for the top five countries (Venezuela, Poland, Finland, Belgium, and Brazil) to identify if the current regional leaders have consistent growth patterns or any seasonal fluctuations.",
        sql: "SELECT country, DATE_TRUNC('month', order_date) as month, SUM(revenue) as monthly_revenue FROM orders WHERE country IN ('Venezuela', 'Poland', 'Finland', 'Belgium', 'Brazil') GROUP BY country, month ORDER BY country, month",
      },
      {
        thought:
          "I will now generate the Sales Analysis by Region report to provide a visual overview of geographic and regional performance.",
        status: "Generating Sales Analysis by Region Research...",
      },
    ],
    document: {
      title: "Global Sales Distribution Analysis",
      subtitle:
        "A comprehensive audit of Eastlake geographic clusters, regional management performance, and market penetration across 21 active territories.",
      sections: [
        {
          blocks: [
            {
              type: "metric_grid",
              metrics: [
                {
                  label: "Total Revenue",
                  value: "$502.8M",
                  sublabel: "Annualized Aggregate",
                },
                {
                  label: "Order Volume",
                  value: "163,452",
                  sublabel: "Total Transactions",
                },
                {
                  label: "Active Markets",
                  value: "21",
                  sublabel: "Countries Represented",
                },
                {
                  label: "Sales Presence",
                  value: "1,000",
                  sublabel: "Unique Customers",
                },
              ],
            },
          ],
        },
        {
          heading: "Geographic Market Maturity",
          blocks: [
            {
              type: "map",
              bubbles: [
                {
                  id: "venezuela",
                  name: "Venezuela",
                  lat: 6.42,
                  lng: -66.59,
                  value: 57100000,
                  label: "Revenue: $57.1M",
                  sublabel: "Orders: 19,234",
                },
                {
                  id: "poland",
                  name: "Poland",
                  lat: 51.92,
                  lng: 19.15,
                  value: 56900000,
                  label: "Revenue: $56.9M",
                  sublabel: "Orders: 18,092",
                },
                {
                  id: "finland",
                  name: "Finland",
                  lat: 61.92,
                  lng: 25.75,
                  value: 48100000,
                  label: "Revenue: $48.1M",
                  sublabel: "Orders: 15,678",
                },
                {
                  id: "belgium",
                  name: "Belgium",
                  lat: 50.5,
                  lng: 4.47,
                  value: 41000000,
                  label: "Revenue: $41.0M",
                  sublabel: "Orders: 13,456",
                },
                {
                  id: "brazil",
                  name: "Brazil",
                  lat: -14.24,
                  lng: -51.93,
                  value: 39700000,
                  label: "Revenue: $39.7M",
                  sublabel: "Orders: 12,890",
                },
                {
                  id: "usa",
                  name: "United States",
                  lat: 37.09,
                  lng: -95.71,
                  value: 35000000,
                  label: "Revenue: $35.0M",
                  sublabel: "Orders: 11,234",
                },
                {
                  id: "italy",
                  name: "Italy",
                  lat: 41.87,
                  lng: 12.57,
                  value: 28500000,
                  label: "Revenue: $28.5M",
                  sublabel: "Orders: 9,876",
                },
              ],
            },
          ],
        },
        {
          blocks: [
            {
              type: "distribution_table",
              rows: [
                {
                  region: "Western Region",
                  staff: 9,
                  orders: 163452,
                  revenue: "$1,297,469,491",
                  share: 63.9,
                },
                {
                  region: "Southern Region",
                  staff: 7,
                  orders: 127338,
                  revenue: "$731,438,234",
                  share: 36.1,
                },
              ],
              note: "Note: Staff counts represent unique employees associated with territories in each region. Total orders may reflect overlap in shared territories.",
            },
            {
              type: "ranking_table",
              title: "Top 5 Markets by Country",
              rows: [
                { label: "Venezuela", value: "$57.1M" },
                { label: "Poland", value: "$57.0M" },
                { label: "Finland", value: "$48.1M" },
                { label: "Belgium", value: "$41.0M" },
                { label: "Brazil", value: "$39.7M" },
              ],
            },
          ],
        },
        {
          heading: "Market Analysis Narrative",
          blocks: [
            {
              type: "rich_text",
              content:
                "The current distribution reveals a significant concentration of volume in South American and European markets. Venezuela leads with $57.1M in revenue, followed closely by Poland at $56.9M. While the Western Region dominates internal management metrics, our customer density is highest in Italy and Sweden (47 and 46 unique customers respectively), despite those countries appearing lower on the revenue-per-order scale.",
              highlights: [{ text: "Venezuela" }, { text: "Poland" }],
            },
          ],
        },
      ],
    },
    suggestedPrompts: [
      "Which territories have the highest sales per employee?",
      "What are the seasonal patterns in our top-performing countries?",
      "How do customer acquisition costs vary by region?",
      "Which products drive the most revenue in each region?",
    ],
  },
  seasonalPatterns: {
    chainOfThought: [
      {
        thought:
          "I will query the monthly sales trends for the top five countries by revenue (Venezuela, Poland, Finland, Belgium, and Brazil) to identify seasonal spikes or recurring dips across the fiscal years.",
        sql: "SELECT country, EXTRACT(MONTH FROM order_date) as month, SUM(revenue) as monthly_revenue FROM orders WHERE country IN ('Venezuela', 'Poland', 'Finland', 'Belgium', 'Brazil') GROUP BY country, month ORDER BY country, month",
      },
      {
        thought:
          "I will now generate the Seasonal Sales Pattern analysis to highlight the significant fourth-quarter surges across our primary markets.",
        status: "Generating Seasonal Sales Analysis Report...",
      },
    ],
    document: {
      title: "Seasonal Sales Patterns: Top Markets",
      subtitle:
        "Analysis of monthly revenue cycles for the five highest-grossing countries. Data indicates a profound Q3-Q4 surge, with October consistently representing the fiscal peak across all geographies.",
      sections: [
        {
          blocks: [
            {
              type: "metric_grid",
              metrics: [
                {
                  label: "Peak Month",
                  value: "October",
                  sublabel: "Consistent Across Top 5 Nations",
                },
                {
                  label: "Peak vs. Trough",
                  value: "4.3x",
                  sublabel: "Oct Revenue vs. Feb Revenue",
                },
                {
                  label: "Q4 Concentration",
                  value: "42%",
                  sublabel: "Of Total Annual Revenue",
                },
              ],
            },
          ],
        },
        {
          heading: "Monthly Revenue Trend by Country (Aggregate)",
          blocks: [
            {
              type: "sparkline_table",
              columns: ["Jan–Feb", "Mar–Apr", "May–Jun", "Jul–Aug", "Sep–Oct", "Nov–Dec"],
              rows: [
                {
                  label: "Venezuela",
                  values: ["$2.3B", "$2.3B", "$2.6B", "$6.9B", "$9.0B", "$4.0B"],
                  trend: "up",
                },
                {
                  label: "Poland",
                  values: ["$2.1B", "$2.2B", "$2.5B", "$6.5B", "$8.5B", "$3.8B"],
                  trend: "up",
                },
                {
                  label: "Finland",
                  values: ["$1.9B", "$2.0B", "$2.2B", "$5.9B", "$7.6B", "$3.4B"],
                  trend: "up",
                },
              ],
            },
          ],
        },
        {
          heading: "Analysis of the October Peak",
          blocks: [
            {
              type: "two_column_text",
              left: "The data reveals an extraordinary synchronization in purchasing behavior across disparate geographic regions. Regardless of the market—be it the South American hub of Venezuela or the North European market of Finland—revenue follows a rigid cyclicality. The first half of the year (Q1-Q2) remains relatively flat, with February consistently marking the lowest activity point (e.g., Venezuela at $1.07B vs. October's $4.67B).",
              right:
                'This suggests that Eastlake\'s product portfolio is highly sensitive to year-end procurement cycles. A massive "inflection point" occurs in July, where revenue nearly doubles, accelerating into the absolute peak in October. Sales Operations should note that inventory requirements for the October peak are roughly 400% higher than those needed in the spring quarters.',
              highlights: [{ text: "South American hub of Venezuela" }, { text: "North European market of Finland" }],
            },
          ],
        },
        {
          heading: "Aggregate Monthly Volume (Top 5 Combined)",
          blocks: [
            {
              type: "bar_chart",
              data: [
                { label: "JAN", value: 8.3 },
                { label: "FEB", value: 7.8 },
                { label: "MAR", value: 8.5 },
                { label: "APR", value: 8.9 },
                { label: "MAY", value: 9.2 },
                { label: "JUN", value: 10.1 },
                { label: "JUL", value: 15.2 },
                { label: "AUG", value: 18.4 },
                { label: "SEP", value: 21.3 },
                { label: "OCT", value: 24.8, highlight: true },
                { label: "NOV", value: 16.2 },
                { label: "DEC", value: 12.4 },
              ],
              highlightLabel: "OCT",
            },
          ],
        },
      ],
    },
    suggestedPrompts: [
      "What drives the October peak specifically?",
      "How can we smooth out Q1 revenue dips?",
      "Which product categories peak in different months?",
      "Compare seasonal patterns by customer segment",
    ],
  },
}
