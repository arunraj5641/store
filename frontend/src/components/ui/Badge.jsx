const Badge = ({ children, tone = 'neutral', icon: Icon, dot = true, className = '' }) => {
  const tones = {
    neutral: 'bg-[#111827] text-[#94A3B8] border-[#1F2937] dot-bg-[#94A3B8]',
    primary: 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30 dot-bg-[#00D9FF]',
    secondary: 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30 dot-bg-[#38BDF8]',
    success: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 dot-bg-[#10B981]',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 dot-bg-[#F59E0B]',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30 dot-bg-[#EF4444]',
  }

  const selectedTone = tones[tone] || tones.neutral

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors ${selectedTone} ${className}`.trim()}
    >
      {dot && !Icon ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      ) : null}
      {Icon ? <Icon className="h-3 w-3" /> : null}
      {children}
    </span>
  )
}

export default Badge

