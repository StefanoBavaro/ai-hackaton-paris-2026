interface TwoColumnTextProps {
  type: "two_column_text"
  left: string
  right: string
  highlights?: Array<{ text: string }>
}

export function TwoColumnText({ left, right, highlights }: TwoColumnTextProps) {
  const processText = (text: string) => {
    let processed = text
    if (highlights) {
      highlights.forEach((highlight) => {
        processed = processed.replace(highlight.text, `<span class="font-medium text-accent">${highlight.text}</span>`)
      })
    }
    return processed
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div
        className="font-serif text-sm leading-relaxed text-foreground/80"
        dangerouslySetInnerHTML={{ __html: processText(left) }}
      />
      <div
        className="font-serif text-sm leading-relaxed text-foreground/80"
        dangerouslySetInnerHTML={{ __html: processText(right) }}
      />
    </div>
  )
}
