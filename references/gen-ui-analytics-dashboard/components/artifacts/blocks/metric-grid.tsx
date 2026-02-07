interface MetricGridProps {
  type: "metric_grid"
  metrics: Array<{
    label: string
    value: string
    sublabel?: string
  }>
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {metrics.map((metric, index) => (
        <div key={index} className="border-t border-border/50 pt-4">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{metric.label}</p>
          <p className="mt-1 font-serif text-3xl font-medium tracking-tight text-foreground">{metric.value}</p>
          {metric.sublabel && (
            <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{metric.sublabel}</p>
          )}
        </div>
      ))}
    </div>
  )
}
