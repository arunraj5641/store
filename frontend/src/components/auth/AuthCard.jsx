import { Store } from 'lucide-react'
import { Link } from 'react-router-dom'

const AuthCard = ({ title, subtitle, children, footer }) => {
  return (
    <section className="w-full max-w-md rounded-3xl border border-[#1F2937] bg-[#111827]/90 p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl animate-slide-up border-t-[#00D9FF]/30">
      <div className="mb-6 flex flex-col items-start">
        <Link to="/" className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#00D9FF]">
          <Store className="h-3.5 w-3.5" />
          Kirana OS
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-sm leading-6 text-[#94A3B8]">{subtitle}</p> : null}
      </div>
      {children}
      {footer ? (
        <div className="mt-6 border-t border-[#1F2937] pt-5 text-center text-xs text-[#94A3B8]">
          {footer}
        </div>
      ) : null}
    </section>
  )
}

export default AuthCard

