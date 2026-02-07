import { defineCatalog } from '@json-render/core'
import { schema } from '@json-render/react'
import { z } from 'zod'

export const catalog = defineCatalog(schema, {
    components: {
        'executive-summary': {
            props: z.object({
                content: z.string(),
            }),
            description: 'A summary card for the current financial data.',
        },
        'kpi-card': {
            props: z.object({
                ticker: z.string(),
                metric: z.string(),
                value: z.string(),
                change: z.string(),
                changeDirection: z.enum(['up', 'down']),
                comparisonBenchmark: z.string().optional(),
            }),
            description: 'A small card showing a single financial metric.',
        },
        'line-chart': {
            props: z.object({
                title: z.string(),
                data: z.array(z.any()),
                xKey: z.string(),
                yKeys: z.array(z.string()),
            }),
            description: 'A line chart for comparing multiple tickers over time.',
        },
        'candlestick-chart': {
            props: z.object({
                ticker: z.string(),
                data: z.array(z.any()),
            }),
            description: 'A candlestick chart for OHLC data.',
        },
        'event-timeline': {
            props: z.object({
                events: z.array(z.any()),
            }),
            description: 'A chronological timeline of company events.',
        },
        'correlation-matrix': {
            props: z.object({
                tickers: z.array(z.string()),
                data: z.array(z.array(z.number())),
                period: z.string(),
            }),
            description: 'A heatmap matrix showing correlations between tickers.',
        },
    },
    actions: {}, // Required property based on lint feedback
})
