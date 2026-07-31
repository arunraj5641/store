const Table = ({ columns = [], rows = [], emptyMessage = 'No records found.' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#1F2937] bg-[#111827]/70 shadow-md">
      <table className="w-full border-collapse text-left text-sm text-[#F8FAFC]">
        <thead>
          <tr className="border-b border-[#1F2937] bg-[#030712]/50 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            {columns.map((column) => (
              <th key={column} className="px-5 py-3.5 whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1F2937]/70">
          {rows.length > 0 ? (
            rows.map((row, index) => (
              <tr
                key={index}
                className="transition-colors duration-150 hover:bg-[#1F2937]/40"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-5 py-4 whitespace-nowrap text-[#94A3B8] first:font-medium first:text-[#F8FAFC]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="px-5 py-8 text-center text-[#94A3B8]"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table

