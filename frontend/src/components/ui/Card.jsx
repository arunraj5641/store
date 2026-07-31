const Card = ({
  title,
  subtitle,
  children,
  action,
  className = '',
  hoverEffect = false,
}) => {
  return (
    <section
      className={`rounded-2xl border border-[#1F2937] bg-[#111827]/90 p-6 shadow-lg shadow-black/40 backdrop-blur-md transition-all duration-300 ${
        hoverEffect
          ? 'hover:border-[#00D9FF]/40 hover:shadow-[0_0_25px_rgba(0,217,255,0.08)] hover:-translate-y-0.5'
          : ''
      } ${className}`.trim()}
    >
      {title || subtitle || action ? (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title ? (
              <h3 className="text-lg font-semibold text-[#F8FAFC]">{title}</h3>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-sm text-[#94A3B8]">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export default Card

