interface RichTextProps {
  type: "rich_text"
  content: string
  highlights?: Array<{
    text: string
    color?: string
  }>
}

export function RichText({ content, highlights }: RichTextProps) {
  let processedContent = content

  // Process highlights
  if (highlights) {
    highlights.forEach((highlight) => {
      processedContent = processedContent.replace(
        highlight.text,
        `<span class="font-medium text-accent">${highlight.text}</span>`,
      )
    })
  }

  return (
    <div
      className="prose prose-sm max-w-none font-serif leading-relaxed text-foreground/80"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}
