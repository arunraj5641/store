const Badge = ({ children, tone = 'neutral' }) => {
  const tones = {
    neutral: 'bg-slate-800 text-slate-200',
    success: 'bg-emerald-500/15 text-emerald-400',
    warning: 'bg-amber-500/15 text-amber-400',
    danger: 'bg-rose-500/15 text-rose-400',
  }

  return <span className={`rounded-full px-3 py-1 text-sm font-medium ${tones[tone]}`}>{children}</span>
}

export default Badge
