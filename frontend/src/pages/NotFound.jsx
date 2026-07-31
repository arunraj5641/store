const NotFound = () => {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">404</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-100">Page not found</h1>
      <p className="mt-2 text-slate-400">The requested route is not available yet.</p>
    </section>
  )
}

export default NotFound
