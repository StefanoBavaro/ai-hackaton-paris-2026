interface RankingTableProps {
  type: "ranking_table"
  title?: string
  rows: Array<{
    label: string
    value: string
  }>
}

export function RankingTable({ title, rows }: RankingTableProps) {
  return (
    <div>
      {title && <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">{title}</h4>}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="pb-2 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Country
            </th>
            <th className="pb-2 text-right text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="py-2.5 text-foreground/90">{row.label}</td>
              <td className="py-2.5 text-right text-foreground/80">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
