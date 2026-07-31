const Table = ({ columns = [], rows = [] }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300">
        <thead className="bg-slate-950/70">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 text-left font-medium uppercase tracking-wide text-slate-400">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`} className="border-t border-slate-800 bg-slate-900/60">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
