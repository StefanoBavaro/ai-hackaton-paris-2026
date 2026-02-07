"use client"

import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CandlestickData {
    date: string
    open: number
    high: number
    low: number
    close: number
}

interface CandlestickChartProps {
    ticker: string
    data: CandlestickData[]
}

export function CandlestickChart({ ticker, data }: CandlestickChartProps) {
    // Simple "candlestick" approximation using BarChart for hackathon speed
    // A true candlestick would use a custom shape, but this shows intent
    const chartData = data.map(d => ({
        ...d,
        isUp: d.close >= d.open,
        // For the bar, we show the range [min(open, close), max(open, close)]
        range: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
        wick: [d.low, d.high]
    }))

    return (
        <Card className="col-span-full h-[450px]">
            <CardHeader>
                <CardTitle className="text-lg font-medium">{ticker} - Candlestick Chart</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            minTickGap={30}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip />
                        <Bar dataKey="range" fill="#8884d8">
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.isUp ? '#10b981' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
