interface SparklineTableProps {
  type: "sparkline_table"
  columns: string[]
  rows: Array<{
    label: string
    values: string[]
    trend: "up" | "down" | "flat"
  }>
}

export function SparklineTable({ columns, rows }: SparklineTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="pb-2 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Country
            </th>
            {columns.map((col, index) => (
              <th
                key={index}
                className="pb-2 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                {col}
              </th>
            ))}
            <th className="pb-2 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Seasonal Trend
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="py-3 font-medium text-foreground">{row.label}</td>
              {row.values.map((value, valIndex) => (
                <td key={valIndex} className="py-3 text-foreground/80">
                  {value}
                </td>
              ))}
              <td className="py-3">
                <SparklineSVG trend={row.trend} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SparklineSVG({ trend }: { trend: "up" | "down" | "flat" }) {
  const paths = {
    up: "M0,20 Q15,18 30,15 T60,5",
    down: "M0,5 Q15,8 30,15 T60,20",
    flat: "M0,12 Q15,10 30,14 T60,12",
  }

  return (
    <svg viewBox="0 0 60 24" className="h-5 w-16 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
      <path d={paths[trend]} />
    </svg>
  )
}
