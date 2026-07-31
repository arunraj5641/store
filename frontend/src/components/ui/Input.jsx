const Input = ({ label, placeholder = '', type = 'text', className = '' }) => {
  return (
    <label className={`flex flex-col gap-2 text-sm text-slate-300 ${className}`.trim()}>
      <span>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-0 focus:border-cyan-500"
      />
    </label>
  )
}

export default Input
