const Header = ({ title, description, actions, badge }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {badge ? (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-[#00D9FF]">
              {badge}
            </span>
          </div>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-[#94A3B8]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-3 shrink-0">{actions}</div> : null}
    </div>
  )
}

export default Header

