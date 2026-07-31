const EmptyState = ({ title, description }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center text-slate-400">
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  )
}

export default EmptyState
