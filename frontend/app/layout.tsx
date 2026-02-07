import type React from "react"
import type { Metadata } from "next"
import { Inter, Newsreader } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const newsreader = Newsreader({
    subsets: ["latin"],
    style: ["normal", "italic"],
    weight: ["400", "500", "600"],
    variable: "--font-serif"
})

export const metadata: Metadata = {
    title: "FinanceFlip — Conversational Dashboard",
    description: "Real-time financial visualizations through natural language",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${newsreader.variable} font-sans antialiased`}>
                {children}
            </body>
        </html>
    )
}
