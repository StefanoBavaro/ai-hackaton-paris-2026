interface MetricCardProps {
  type: "metric_card"
  label: string
  value: string
  sublabel?: string
}

export function MetricCard({ label, value, sublabel }: MetricCardProps) {
  return (
    <div className="border-t border-border/50 pt-4">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-3xl font-medium tracking-tight text-foreground">{value}</p>
      {sublabel && <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{sublabel}</p>}
    </div>
  )
}
