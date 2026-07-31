const Button = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
  }

  return (
    <button className={`rounded-lg px-4 py-2 font-medium transition ${variants[variant]} ${className}`.trim()}>
      {children}
    </button>
  )
}

export default Button
