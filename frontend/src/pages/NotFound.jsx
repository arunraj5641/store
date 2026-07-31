import { Link } from 'react-router-dom'
import { ArrowLeft, Store } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] shadow-[0_0_30px_rgba(0,217,255,0.2)] mb-6">
        <Store className="h-8 w-8" />
      </div>
      <span className="rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#00D9FF]">
        404 Error
      </span>
      <h1 className="mt-4 text-3xl font-extrabold text-[#F8FAFC] sm:text-4xl">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-[#94A3B8]">
        The route you are trying to access does not exist or has been relocated in the store workspace.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00D9FF] px-5 py-2.5 text-xs font-bold text-[#030712] transition hover:bg-[#38BDF8]"
      >
        <ArrowLeft className="h-4 w-4" /> Return Home
      </Link>
    </div>
  )
}

export default NotFound

