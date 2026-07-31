const Modal = ({ title, children, isOpen = false }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-semibold text-slate-100">{title}</h2>
        <div className="text-slate-300">{children}</div>
      </div>
    </div>
  )
}

export default Modal
