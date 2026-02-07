"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Play } from "lucide-react"
import type { ThoughtStep } from "@/lib/types"

interface ChainOfThoughtProps {
  steps: ThoughtStep[]
}

export function ChainOfThought({ steps }: ChainOfThoughtProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="border-l-2 border-border pl-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
      >
        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        Chain-of-thought
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="space-y-1.5">
              <p className="text-sm leading-relaxed text-foreground/80">{step.thought}</p>
              {step.sql && <SQLStep sql={step.sql} />}
              {step.status && <p className="font-serif text-sm italic text-muted-foreground">{step.status}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SQLStep({ sql }: { sql: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      {isExpanded ? <ChevronDown className="h-3 w-3" /> : <Play className="h-3 w-3" />}
      SQL statement executed
      {isExpanded && (
        <pre className="mt-2 block w-full overflow-x-auto rounded bg-muted p-2 text-left font-mono text-xs">{sql}</pre>
      )}
    </button>
  )
}
