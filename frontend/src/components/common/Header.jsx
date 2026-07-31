const Header = ({ title, description }) => {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">{title}</h1>
        {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
      </div>
    </div>
  )
}

export default Header
