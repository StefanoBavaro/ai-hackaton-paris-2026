"use client"

interface SuggestedPromptsProps {
  prompts: string[]
  onSelect: (prompt: string) => void
}

export function SuggestedPrompts({ prompts, onSelect }: SuggestedPromptsProps) {
  return (
    <div className="mt-8">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Suggested follow-up prompts:
      </p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(prompt)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground/80 transition-all hover:border-foreground/20 hover:bg-muted"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
