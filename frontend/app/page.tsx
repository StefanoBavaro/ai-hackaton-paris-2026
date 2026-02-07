"use client"

import { GenUIChat } from "@/components/genui-chat"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="w-full max-w-5xl items-center justify-between font-mono text-sm">
                <GenUIChat />
            </div>
        </main>
    )
}
