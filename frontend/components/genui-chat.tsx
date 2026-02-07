"use client"

import { useState } from "react"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessage } from "@/components/chat/chat-message"
import { SuggestedPrompts } from "@/components/chat/suggested-prompts"
import type { Message, ChaosState } from "@/lib/types"
import { validateAPIResponse } from "@/lib/validate"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const DEFAULT_CHAOS: ChaosState = {
    rotation: 0,
    fontFamily: "Inter",
    animation: null,
    theme: "professional",
}

export function GenUIChat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentChaos, setCurrentChaos] = useState<ChaosState>(DEFAULT_CHAOS)

    const handleSubmit = async (query: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: query,
        }
        setMessages((prev) => [...prev, userMessage])
        setIsLoading(true)

        try {
            const response = await fetch(`${API_URL}/api/query`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: query,
                    currentChaos,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to fetch from backend")
            }

            const data = await response.json()

            // Validate the API response against the contract
            const { response: validated, errors } = validateAPIResponse(data)

            if (!validated) {
                const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: `The server returned an unexpected response.\n${errors.map(e => `• ${e}`).join("\n")}`,
                }
                setMessages((prev) => [...prev, errorMessage])
                return
            }

            // Persist chaos: merge incoming chaos on top of current state
            // CONTRACT.md: "Chaos state persists across queries unless explicitly overridden"
            if (validated.dashboardSpec?.chaos) {
                setCurrentChaos((prev) => ({ ...prev, ...validated.dashboardSpec!.chaos }))
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: validated.assistantMessage,
                dashboardSpec: validated.dashboardSpec,
                suggestedPrompts: validated.suggestedPrompts,
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error("Error submitting query:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm sorry, I encountered an error while processing your request. Please ensure the backend server is running.",
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearChat = () => {
        setMessages([])
        setCurrentChaos(DEFAULT_CHAOS)
    }

    return (
        <div className="min-h-screen bg-canvas">
            <div className="mx-auto max-w-6xl px-6 py-8">
                {/* Header */}
                <header className="mb-12 flex items-start justify-between">
                    <div>
                        <h1 className="font-serif text-3xl font-medium tracking-tight text-accent italic">FinanceFlip Dashboard</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ask financial questions in natural language. Powered by DuckDB and Claude 4.5.
                        </p>
                    </div>
                    <button
                        onClick={handleClearChat}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground underline"
                    >
                        Reset Dashboard
                    </button>
                </header>

                {/* Messages */}
                <div className="space-y-12">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                            <span className="font-serif italic text-blue-600">Generating your dashboard...</span>
                        </div>
                    )}
                </div>

                {/* Suggested prompts */}
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
