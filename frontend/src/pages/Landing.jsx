import { ArrowRight, BarChart3, Box, Sparkles, Store } from 'lucide-react'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Kirana OS</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-100 sm:text-4xl">Take control of your store with AI-assisted operations.</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/login" className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">Login</Link>
            <Link to="/signup" className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Get started</Link>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(0,217,255,0.16),_transparent_35%),#0f172a] p-8 shadow-2xl shadow-slate-950/30">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
            <Sparkles className="h-4 w-4" /> New AI-ready storefront foundation
          </p>
          <h2 className="mt-6 text-4xl font-semibold text-slate-100 sm:text-5xl">Modern SaaS for daily kirana operations.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">Inventory, products, sales, customers, and analytics—all from one thoughtfully designed platform.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Start free <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/login" className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">Explore demo</Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300"><Store className="h-5 w-5" /></div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Store command center</p>
              <p className="text-sm text-slate-400">Everything you need, in one view.</p>
            </div>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-slate-400">
            <li className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">Real-time inventory visibility</li>
            <li className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">Smart sales monitoring</li>
            <li className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">Customer relationship tools</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Box, title: 'Inventory', copy: 'Track stock, reorder points, and product availability.' },
          { icon: BarChart3, title: 'Analytics', copy: 'Understand sales trends with polished, actionable insights.' },
          { icon: Sparkles, title: 'AI Assistant', copy: 'Prepare for future AI-powered workflows and automation.' },
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300 w-fit"><Icon className="h-5 w-5" /></div>
            <h3 className="mt-4 text-lg font-semibold text-slate-100">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
          </div>
        ))}
      </section>

      <footer className="rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-4 text-sm text-slate-500">
        Premium authentication and experience foundation for the next phase.
      </footer>
    </div>
  )
}

export default Landing
