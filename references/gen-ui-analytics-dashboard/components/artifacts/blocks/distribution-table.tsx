interface DistributionTableProps {
  type: "distribution_table"
  rows: Array<{
    region: string
    staff: number
    orders: number
    revenue: string
    share: number
  }>
  note?: string
}

export function DistributionTable({ rows, note }: DistributionTableProps) {
  const maxShare = Math.max(...rows.map((r) => r.share))

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-2 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Region
              </th>
              <th className="pb-2 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Staff
              </th>
              <th className="pb-2 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Orders
              </th>
              <th className="pb-2 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Revenue Share
              </th>
              <th className="pb-2 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Distribution
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="py-3 font-medium text-foreground">{row.region}</td>
                <td className="py-3 text-foreground/80">{row.staff}</td>
                <td className="py-3 text-foreground/80">{row.orders.toLocaleString()}</td>
                <td className="py-3 text-foreground/80">{row.revenue}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-accent/60" style={{ width: `${(row.share / maxShare) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{row.share.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="text-xs italic text-muted-foreground">{note}</p>}
    </div>
  )
}
