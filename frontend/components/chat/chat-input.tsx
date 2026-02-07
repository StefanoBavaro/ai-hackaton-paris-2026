"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

interface ChatInputProps {
  onSubmit: (query: string) => void
  isLoading: boolean
}

export function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      onSubmit(query.trim())
      setQuery("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question about your data..."
        className="w-full rounded-full border border-border bg-card px-6 py-4 pr-14 text-sm shadow-sm transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!query.trim() || isLoading}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </form>
  )
}
