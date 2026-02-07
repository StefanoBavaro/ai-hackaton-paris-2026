"use client"

import type { Message } from "@/lib/types"
import { ChainOfThought } from "./chain-of-thought"
import { DocumentArtifact } from "../artifacts/document-artifact"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-md rounded-2xl bg-muted px-5 py-3 text-sm">{message.content}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message.chainOfThought && <ChainOfThought steps={message.chainOfThought} />}
      {message.document && <DocumentArtifact document={message.document} />}
    </div>
  )
}
