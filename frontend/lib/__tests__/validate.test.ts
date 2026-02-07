/**
 * Contract validation tests — runnable with `npx tsx lib/__tests__/validate.test.ts`
 * No test framework needed; uses Node assert.
 */
import assert from "node:assert"
import { validateBlock, validateDashboardSpec, validateAPIResponse } from "../validate"

// ── validateBlock ────────────────────────────────────────────────

// valid block
assert.deepStrictEqual(
  validateBlock({ type: "kpi-card", props: { ticker: "AAPL" } }, 0),
  [],
  "valid block should produce no errors"
)

// missing type
assert.ok(
  validateBlock({ props: {} }, 0).some(e => e.includes('"type"')),
  "missing type should error"
)

// unknown type
assert.ok(
  validateBlock({ type: "unknown-widget", props: {} }, 0).some(e => e.includes("unknown type")),
  "unknown block type should error"
)

// missing props
assert.ok(
  validateBlock({ type: "kpi-card" }, 0).some(e => e.includes('"props"')),
  "missing props should error"
)

// props is array (invalid)
assert.ok(
  validateBlock({ type: "kpi-card", props: [1, 2] }, 0).some(e => e.includes('"props"')),
  "array props should error"
)

// null block
assert.ok(
  validateBlock(null, 0).length > 0,
  "null block should error"
)

// ── validateDashboardSpec ────────────────────────────────────────

// valid spec
{
  const r = validateDashboardSpec({
    blocks: [
      { type: "executive-summary", props: { content: "hello" } },
      { type: "line-chart", props: { title: "t", data: [], xKey: "x", yKeys: ["y"] } },
    ],
    chaos: { rotation: 5, theme: "matrix" },
  })
  assert.strictEqual(r.valid, true, "valid spec should pass")
  assert.strictEqual(r.errors.length, 0)
}

// empty blocks is valid
{
  const r = validateDashboardSpec({ blocks: [] })
  assert.strictEqual(r.valid, true, "empty blocks array is valid")
}

// blocks not array
{
  const r = validateDashboardSpec({ blocks: "oops" })
  assert.strictEqual(r.valid, false)
}

// chaos is array (invalid)
{
  const r = validateDashboardSpec({ blocks: [], chaos: [1] })
  assert.strictEqual(r.valid, false)
}

// null spec
{
  const r = validateDashboardSpec(null)
  assert.strictEqual(r.valid, false)
}

// ── validateAPIResponse ──────────────────────────────────────────

// valid full response
{
  const { response, errors } = validateAPIResponse({
    assistantMessage: "Here is the data.",
    dashboardSpec: {
      blocks: [{ type: "kpi-card", props: { ticker: "AAPL", metric: "Price", value: "$150", change: "+2%", changeDirection: "up" } }],
      chaos: { rotation: 0 },
    },
    intent: "price_check",
    queryMetadata: { executionTimeMs: 100, sqlQueriesRequested: 1, sqlQueriesExecuted: 1 },
  })
  assert.ok(response !== null, "valid response should parse")
  assert.strictEqual(errors.length, 0)
}

// missing assistantMessage
{
  const { response, errors } = validateAPIResponse({ dashboardSpec: { blocks: [] } })
  assert.strictEqual(response, null)
  assert.ok(errors.some(e => e.includes("assistantMessage")))
}

// response with no dashboardSpec is fine
{
  const { response, errors } = validateAPIResponse({ assistantMessage: "No data." })
  assert.ok(response !== null)
  assert.strictEqual(errors.length, 0)
}

// malformed block inside response
{
  const { response, errors } = validateAPIResponse({
    assistantMessage: "Bad block",
    dashboardSpec: { blocks: [{ type: "kpi-card" }] },
  })
  assert.strictEqual(response, null)
  assert.ok(errors.some(e => e.includes('"props"')))
}

// ── Chaos persistence logic ──────────────────────────────────────

// Simulate the merge behavior used in GenUIChat
{
  const prev = { rotation: 5, fontFamily: "Inter", animation: null, theme: "professional" }
  const incoming = { theme: "matrix" }
  const merged = { ...prev, ...incoming }
  assert.strictEqual(merged.rotation, 5, "rotation should persist")
  assert.strictEqual(merged.fontFamily, "Inter", "fontFamily should persist")
  assert.strictEqual(merged.theme, "matrix", "theme should be overridden")
  assert.strictEqual(merged.animation, null, "animation should persist")
}

// Override only animation
{
  const prev = { rotation: 0, fontFamily: "Comic Sans", animation: null, theme: "matrix" }
  const incoming = { animation: "wobble" }
  const merged = { ...prev, ...incoming }
  assert.strictEqual(merged.theme, "matrix", "theme persists")
  assert.strictEqual(merged.animation, "wobble", "animation overridden")
}

console.log("All contract validation tests passed.")
