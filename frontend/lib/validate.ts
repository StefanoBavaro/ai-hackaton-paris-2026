import type { DashboardSpec, Block, APIResponse } from "./types"

/** Known block types from the registry (CONTRACT.md). */
const KNOWN_BLOCK_TYPES = new Set([
  "executive-summary",
  "kpi-card",
  "line-chart",
  "candlestick-chart",
  "event-timeline",
  "correlation-matrix",
])

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

/** Validate a single block has { type: string, props: object }. */
export function validateBlock(block: unknown, index: number): string[] {
  const errors: string[] = []
  if (block == null || typeof block !== "object") {
    errors.push(`Block ${index}: not an object.`)
    return errors
  }
  const b = block as Record<string, unknown>
  if (typeof b.type !== "string" || b.type.trim() === "") {
    errors.push(`Block ${index}: missing or invalid "type" (must be a non-empty string).`)
  } else if (!KNOWN_BLOCK_TYPES.has(b.type)) {
    errors.push(`Block ${index}: unknown type "${b.type}".`)
  }
  if (b.props == null || typeof b.props !== "object" || Array.isArray(b.props)) {
    errors.push(`Block ${index}: missing or invalid "props" (must be an object).`)
  }
  return errors
}

/** Validate the full DashboardSpec shape. */
export function validateDashboardSpec(spec: unknown): ValidationResult {
  const errors: string[] = []

  if (spec == null || typeof spec !== "object") {
    return { valid: false, errors: ["dashboardSpec is not an object."] }
  }

  const s = spec as Record<string, unknown>

  if (!Array.isArray(s.blocks)) {
    return { valid: false, errors: ["dashboardSpec.blocks is not an array."] }
  }

  for (let i = 0; i < s.blocks.length; i++) {
    errors.push(...validateBlock(s.blocks[i], i))
  }

  if (s.chaos !== undefined && s.chaos !== null) {
    if (typeof s.chaos !== "object" || Array.isArray(s.chaos)) {
      errors.push("dashboardSpec.chaos must be an object if present.")
    }
  }

  return { valid: errors.length === 0, errors }
}

/** Validate the full API response shape. Returns a safe, typed response or error messages. */
export function validateAPIResponse(data: unknown): { response: APIResponse | null; errors: string[] } {
  const errors: string[] = []

  if (data == null || typeof data !== "object") {
    return { response: null, errors: ["API returned a non-object response."] }
  }

  const d = data as Record<string, unknown>

  if (typeof d.assistantMessage !== "string") {
    errors.push("Missing assistantMessage in API response.")
  }

  if (d.dashboardSpec !== undefined) {
    const specResult = validateDashboardSpec(d.dashboardSpec)
    errors.push(...specResult.errors)
  }

  if (errors.length > 0) {
    return { response: null, errors }
  }

  return { response: data as APIResponse, errors: [] }
}
