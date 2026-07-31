import { useState } from 'react'

export const BarChart = ({ data = [], height = 220 }) => {
  const [hovered, setHovered] = useState(null)

  if (!data.length) return null

  const maxValue = Math.max(...data.map((d) => d.value)) || 1

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <div className="flex h-full items-end gap-2 sm:gap-3 pt-6 pb-6 border-b border-[#1F2937]">
        {data.map((item, index) => {
          const heightPercent = Math.max((item.value / maxValue) * 100, 8)
          const isHovered = hovered === index

          return (
            <div
              key={index}
              className="relative flex flex-1 flex-col items-center justify-end h-full group"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHovered ? (
                <div className="absolute -top-7 z-20 rounded-md border border-[#00D9FF]/40 bg-[#030712] px-2 py-1 text-[10px] font-semibold text-[#00D9FF] shadow-lg whitespace-nowrap animate-fade-in">
                  {item.label}: {item.formattedValue || item.value}
                </div>
              ) : null}

              {/* Bar element */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg transition-all duration-300 ${
                  isHovered
                    ? 'bg-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.6)]'
                    : 'bg-gradient-to-t from-[#00D9FF]/20 to-[#38BDF8]/60 hover:to-[#00D9FF]'
                }`}
              />

              {/* Label */}
              <span className="absolute -bottom-6 text-[10px] font-medium text-[#94A3B8] truncate w-full text-center">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const AreaChart = ({ data = [], height = 220 }) => {
  if (!data.length) return null

  const maxValue = Math.max(...data.map((d) => d.value)) || 1
  const width = 500
  const chartHeight = 180

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width
    const y = chartHeight - (item.value / maxValue) * (chartHeight - 30) - 15
    return { x, y, ...item }
  })

  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`
  }, '')

  const areaD = `${pathD} L ${width},${chartHeight} L 0,${chartHeight} Z`

  return (
    <div className="w-full overflow-hidden" style={{ height: `${height}px` }}>
      <svg viewBox={`0 0 ${width} ${chartHeight}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        {/* Fill Area */}
        <path d={areaD} fill="url(#areaGradient)" />

        {/* Line Stroke */}
        <path d={pathD} fill="none" stroke="url(#strokeGradient)" strokeWidth="3" strokeLinecap="round" />

        {/* Data Circles */}
        {points.map((point, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              className="fill-[#030712] stroke-[#00D9FF] stroke-2 transition-all group-hover:r-6 group-hover:fill-[#00D9FF]"
            />
          </g>
        ))}
      </svg>
      <div className="flex justify-between pt-2 text-[10px] font-medium text-[#94A3B8]">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  )
}

export const DonutChart = ({ data = [] }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0) || 1
  let cumulativePercent = 0

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent)
    const y = Math.sin(2 * Math.PI * percent)
    return [x, y]
  }

  const colors = ['#00D9FF', '#38BDF8', '#10B981', '#F59E0B', '#EF4444']

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="-1 -1 2 2" className="w-full h-full -rotate-90 transform">
          {data.map((item, index) => {
            const startPercent = cumulativePercent
            const slicePercent = item.value / total
            cumulativePercent += slicePercent

            const [startX, startY] = getCoordinatesForPercent(startPercent)
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent)
            const largeArcFlag = slicePercent > 0.5 ? 1 : 0

            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(' ')

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            )
          })}
          {/* Inner cutout for donut */}
          <circle cx="0" cy="0" r="0.65" className="fill-[#111827]" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xs text-[#94A3B8]">Total</span>
          <span className="text-sm font-bold text-[#F8FAFC]">{total}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 text-xs">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-[#94A3B8] w-28 truncate">{item.label}</span>
            <span className="font-bold text-[#F8FAFC]">{item.formattedValue || `${item.value}%`}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default { BarChart, AreaChart, DonutChart }
