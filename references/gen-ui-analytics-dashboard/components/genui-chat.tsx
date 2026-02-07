"use client"

import { useState } from "react"
import { ChatInput } from "./chat/chat-input"
import { ChatMessage } from "./chat/chat-message"
import { SuggestedPrompts } from "./chat/suggested-prompts"
import type { Message } from "@/lib/types"
import { mockResponses } from "@/lib/mock-data"

export function GenUIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (query: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate API response with mock data
    setTimeout(() => {
      const mockResponse = getMockResponse(query)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: query,
        chainOfThought: mockResponse.chainOfThought,
        document: mockResponse.document,
        suggestedPrompts: mockResponse.suggestedPrompts,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleClearChat = () => {
    setMessages([])
  }

  const getMockResponse = (query: string) => {
    const lowerQuery = query.toLowerCase()
    if (lowerQuery.includes("region") || lowerQuery.includes("sales")) {
      return mockResponses.salesByRegion
    }
    if (lowerQuery.includes("seasonal") || lowerQuery.includes("pattern")) {
      return mockResponses.seasonalPatterns
    }
    return mockResponses.salesByRegion
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <header className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-accent">Mash</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask questions of business data in MotherDuck using a{" "}
              <span className="rounded bg-muted px-1.5 py-0.5 text-foreground/80">Gemini-like interface.</span>
            </p>
          </div>
          <button
            onClick={handleClearChat}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear Chat
          </button>
        </header>

        {/* Messages */}
        <div className="space-y-8">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="font-serif italic">Analyzing your data...</span>
            </div>
          )}
        </div>

        {/* Suggested prompts after assistant message */}
        {messages.length > 0 &&
          messages[messages.length - 1].role === "assistant" &&
          messages[messages.length - 1].suggestedPrompts && (
            <SuggestedPrompts prompts={messages[messages.length - 1].suggestedPrompts!} onSelect={handleSubmit} />
          )}

        {/* Input */}
        <div className="sticky bottom-6 mt-12">
          <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
