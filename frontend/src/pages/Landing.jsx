import { ArrowRight, BarChart3, Box, Sparkles, Store, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="space-y-12 pb-8">
      {/* Top Banner Header */}
      <header className="relative overflow-hidden rounded-3xl border border-[#1F2937] bg-[#111827]/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-[#1F2937]/80">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#00D9FF]/10 blur-3xl" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#00D9FF]">
              <Zap className="h-3.5 w-3.5" /> Kirana OS
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC] sm:text-3xl lg:text-4xl">
              Take control of your store with AI-assisted operations.
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="rounded-xl border border-[#1F2937] bg-[#030712] px-5 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-200 hover:border-[#00D9FF]/50 hover:text-[#00D9FF] hover:bg-[#111827]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#00D9FF] px-5 py-2.5 text-sm font-semibold text-[#030712] transition-all duration-200 hover:bg-[#38BDF8] hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section + Store Command Center Split */}
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Main Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#1F2937] bg-gradient-to-br from-[#111827] via-[#030712] to-[#111827] p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col justify-between group">
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#00D9FF]/15 blur-3xl transition-opacity group-hover:opacity-80" />
          
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 px-3.5 py-1.5 text-xs font-semibold text-[#00D9FF]">
              <Sparkles className="h-4 w-4 animate-pulse text-[#00D9FF]" />
              New AI-ready storefront foundation
            </p>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl lg:text-5xl leading-tight">
              Modern SaaS for daily kirana operations.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
              Inventory, products, sales, customers, and analytics—all from one thoughtfully designed platform.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#00D9FF] px-6 py-3.5 text-sm font-bold text-[#030712] transition-all duration-200 hover:bg-[#38BDF8] hover:shadow-[0_0_25px_rgba(0,217,255,0.45)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-[#1F2937] bg-[#111827]/80 px-6 py-3.5 text-sm font-semibold text-[#F8FAFC] transition-all duration-200 hover:border-[#00D9FF]/40 hover:text-[#00D9FF] hover:bg-[#1F2937]"
            >
              Explore demo
            </Link>
          </div>
        </div>

        {/* Store Command Center Card */}
        <div className="rounded-3xl border border-[#1F2937] bg-[#111827]/80 p-8 shadow-2xl backdrop-blur-xl flex flex-col justify-between hover:border-[#374151] transition duration-300">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.15)]">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#F8FAFC]">Store command center</p>
                <p className="text-xs text-[#94A3B8]">Everything you need, in one view.</p>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-[#94A3B8]">
              <li className="flex items-center gap-3 rounded-2xl border border-[#1F2937] bg-[#030712]/60 px-4 py-3.5 transition hover:border-[#00D9FF]/30 hover:text-[#F8FAFC]">
                <CheckCircle2 className="h-4 w-4 text-[#00D9FF] shrink-0" />
                <span>Real-time inventory visibility</span>
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-[#1F2937] bg-[#030712]/60 px-4 py-3.5 transition hover:border-[#00D9FF]/30 hover:text-[#F8FAFC]">
                <CheckCircle2 className="h-4 w-4 text-[#00D9FF] shrink-0" />
                <span>Smart sales monitoring</span>
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-[#1F2937] bg-[#030712]/60 px-4 py-3.5 transition hover:border-[#00D9FF]/30 hover:text-[#F8FAFC]">
                <CheckCircle2 className="h-4 w-4 text-[#00D9FF] shrink-0" />
                <span>Customer relationship tools</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#1F2937] pt-4 text-xs text-[#94A3B8]">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" /> Live Status
            </span>
            <span>Kirana OS Ready</span>
          </div>
        </div>
      </section>

      {/* Feature Section Grid */}
      <section className="grid gap-6 md:grid-cols-3">
        {[
          { icon: Box, title: 'Inventory', copy: 'Track stock, reorder points, and product availability.' },
          { icon: BarChart3, title: 'Analytics', copy: 'Understand sales trends with polished, actionable insights.' },
          { icon: Sparkles, title: 'AI Assistant', copy: 'Prepare for future AI-powered workflows and automation.' },
        ].map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#00D9FF]/40 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,217,255,0.1)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] transition duration-300 group-hover:scale-110 group-hover:bg-[#00D9FF]/20">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-[#F8FAFC]">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{copy}</p>
          </div>
        ))}
      </section>

      {/* Footer Banner */}
      <footer className="flex flex-col sm:flex-row items-center justify-between rounded-3xl border border-[#1F2937] bg-[#111827]/60 px-6 py-4 text-xs text-[#94A3B8] gap-3">
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#00D9FF]" />
          Premium authentication and experience foundation for the next phase.
        </span>
        <span className="text-[11px] text-[#94A3B8]/80 font-mono">Build 2026.07</span>
      </footer>
    </div>
  )
}

export default Landing

