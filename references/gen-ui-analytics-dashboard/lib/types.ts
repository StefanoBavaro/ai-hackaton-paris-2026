export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  chainOfThought?: ThoughtStep[]
  document?: Document
  suggestedPrompts?: string[]
}

export interface ThoughtStep {
  thought: string
  sql?: string
  status?: string
}

export interface Document {
  title: string
  subtitle?: string
  sections: Section[]
}

export interface Section {
  heading?: string
  blocks: UIBlock[]
}

export type UIBlock =
  | MetricCardBlock
  | MetricGridBlock
  | MapBlock
  | BarChartBlock
  | TableBlock
  | RichTextBlock
  | SparklineTableBlock
  | TwoColumnTextBlock
  | DistributionTableBlock
  | RankingTableBlock

export interface MetricCardBlock {
  type: "metric_card"
  label: string
  value: string
  sublabel?: string
}

export interface MetricGridBlock {
  type: "metric_grid"
  metrics: Array<{
    label: string
    value: string
    sublabel?: string
  }>
}

export interface MapBlock {
  type: "map"
  bubbles: Array<{
    id: string
    name: string
    lat: number
    lng: number
    value: number
    label: string
    sublabel?: string
  }>
}

export interface BarChartBlock {
  type: "bar_chart"
  data: Array<{
    label: string
    value: number
    highlight?: boolean
  }>
  highlightLabel?: string
}

export interface TableBlock {
  type: "table"
  columns: string[]
  rows: Array<Record<string, string | number>>
  note?: string
}

export interface RichTextBlock {
  type: "rich_text"
  content: string
  highlights?: Array<{
    text: string
    color?: string
  }>
}

export interface SparklineTableBlock {
  type: "sparkline_table"
  columns: string[]
  rows: Array<{
    label: string
    values: string[]
    trend: "up" | "down" | "flat"
  }>
}

export interface TwoColumnTextBlock {
  type: "two_column_text"
  left: string
  right: string
  highlights?: Array<{ text: string }>
}

export interface DistributionTableBlock {
  type: "distribution_table"
  rows: Array<{
    region: string
    staff: number
    orders: number
    revenue: string
    share: number
  }>
  note?: string
}

export interface RankingTableBlock {
  type: "ranking_table"
  title?: string
  rows: Array<{
    label: string
    value: string
  }>
}
