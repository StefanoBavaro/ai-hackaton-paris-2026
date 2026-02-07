interface DataTableProps {
  type: "table"
  columns: string[]
  rows: Array<Record<string, string | number>>
  note?: string
}

export function DataTable({ columns, rows, note }: DataTableProps) {
  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="pb-2 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="py-3 text-foreground/90">
                    {row[col.toLowerCase().replace(/\s+/g, "_")]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="text-xs italic text-muted-foreground">{note}</p>}
    </div>
  )
}
