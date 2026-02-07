import { defineRegistry } from '@json-render/react'
import { catalog } from './catalog'
import { ExecutiveSummary } from '@/components/dashboard/executive-summary'
import { KPICard } from '@/components/dashboard/kpi-card'
import { LineChart } from '@/components/dashboard/line-chart'
import { EventTimeline } from '@/components/dashboard/event-timeline'
import { CandlestickChart } from '@/components/dashboard/candlestick-chart'
import { CorrelationMatrix } from '@/components/dashboard/correlation-matrix'

export const { registry } = defineRegistry(catalog, {
    components: {
        'executive-summary': ({ props }) => <ExecutiveSummary { ...props } />,
        'kpi-card': ({ props }) => <KPICard { ...props } />,
        'line-chart': ({ props }) => <LineChart { ...props } />,
        'event-timeline': ({ props }) => <EventTimeline { ...props } />,
        'candlestick-chart': ({ props }) => <CandlestickChart { ...props } />,
        'correlation-matrix': ({ props }) => <CorrelationMatrix { ...props } />,
    },
})
