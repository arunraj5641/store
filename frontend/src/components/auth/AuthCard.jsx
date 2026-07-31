import { Link } from 'react-router-dom'

const AuthCard = ({ title, subtitle, children, footer }) => {
  return (
    <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/85 p-8 shadow-2xl shadow-slate-950/40">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Kirana OS</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-100">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
      </div>
      {children}
      {footer ? <div className="mt-6 text-sm text-slate-400">{footer}</div> : null}
    </section>
  )
}

export default AuthCard
