"use client"

import type { Message } from "@/lib/types"
import { DashboardRenderer } from "../dashboard/dashboard-renderer"

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
            <div className="text-sm text-foreground/90 whitespace-pre-wrap">
                {message.content}
            </div>
            {message.dashboardSpec && (
                <DashboardRenderer spec={message.dashboardSpec} />
            )}
        </div>
    )
}
