/** Chaos state persists across queries unless explicitly overridden. */
export interface ChaosState {
  rotation?: number
  fontFamily?: string
  animation?: string | null
  theme?: string
}

/** A single renderable block: { type, props }. */
export interface Block {
  type: string
  props: Record<string, unknown>
}

/** The full dashboard spec returned by the backend. */
export interface DashboardSpec {
  blocks: Block[]
  chaos?: ChaosState
}

export interface QueryMetadata {
  executionTimeMs: number
  sqlQueriesRequested: number
  sqlQueriesExecuted: number
}

/** Shape of POST /api/query response per CONTRACT.md. */
export interface APIResponse {
  dashboardSpec?: DashboardSpec
  assistantMessage: string
  intent?: string
  queryMetadata?: QueryMetadata
  suggestedPrompts?: string[]
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  dashboardSpec?: DashboardSpec
  suggestedPrompts?: string[]
}
