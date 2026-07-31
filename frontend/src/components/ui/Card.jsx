const Card = ({ title, children, className = '' }) => {
  return (
    <section className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm ${className}`.trim()}>
      {title ? <h3 className="mb-4 text-lg font-semibold text-slate-100">{title}</h3> : null}
      {children}
    </section>
  )
}

export default Card
