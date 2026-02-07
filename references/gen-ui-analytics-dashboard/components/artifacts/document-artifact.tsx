import type { Document } from "@/lib/types"
import { RenderBlock } from "./render-block"
import { Share2 } from "lucide-react"

interface DocumentArtifactProps {
  document: Document
}

export function DocumentArtifact({ document }: DocumentArtifactProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* Document Header */}
      <header className="border-b border-border/50 px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground">{document.title}</h2>
            {document.subtitle && (
              <p className="mt-2 max-w-2xl font-serif text-sm italic leading-relaxed text-muted-foreground">
                {document.subtitle}
              </p>
            )}
          </div>
          <button className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Document Sections */}
      <div className="divide-y divide-border/30">
        {document.sections.map((section, index) => (
          <section key={index} className="px-8 py-6">
            {section.heading && (
              <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {section.heading}
              </h3>
            )}
            <div className="space-y-6">
              {section.blocks.map((block, blockIndex) => (
                <RenderBlock key={blockIndex} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
