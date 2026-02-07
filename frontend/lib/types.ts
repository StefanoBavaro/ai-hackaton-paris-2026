export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  dashboardSpec?: DashboardSpec
  suggestedPrompts?: string[]
}

export interface DashboardSpec {
  blocks: Array<{
    type: string
    props: any
  }>
  chaos?: {
    rotation?: number
    fontFamily?: string
    animation?: string | null
    theme?: string
  }
}
