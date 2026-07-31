const Sidebar = () => {
  return (
    <aside className="hidden w-72 border-r border-slate-800 bg-slate-950/70 p-6 lg:block">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">AI Kirana</p>
        <p className="mt-2 text-sm text-slate-400">Store management foundation</p>
      </div>
      <nav className="space-y-2 text-sm text-slate-300">
        <div className="rounded-lg bg-cyan-500/10 px-3 py-2 text-cyan-300">Dashboard</div>
        <div className="rounded-lg px-3 py-2">Inventory</div>
        <div className="rounded-lg px-3 py-2">Products</div>
        <div className="rounded-lg px-3 py-2">Sales</div>
        <div className="rounded-lg px-3 py-2">Customers</div>
      </nav>
    </aside>
  )
}

export default Sidebar
