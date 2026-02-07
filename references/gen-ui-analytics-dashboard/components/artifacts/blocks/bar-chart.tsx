"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts"

interface BarChartBlockProps {
  type: "bar_chart"
  data: Array<{
    label: string
    value: number
    highlight?: boolean
  }>
  highlightLabel?: string
}

export function BarChartBlock({ data, highlightLabel }: BarChartBlockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Compute colors in JS to avoid CSS variable issues with Recharts
  const defaultColor = "#a8a29e" // stone-400
  const highlightColor = "#991b1b" // red-800

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#78716c" }} tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded bg-foreground px-2 py-1 text-xs text-background">
                    {payload[0].payload.label}
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="value"
            radius={[2, 2, 0, 0]}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.highlight || entry.label === highlightLabel || hoveredIndex === index
                    ? highlightColor
                    : defaultColor
                }
                className="transition-colors"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
