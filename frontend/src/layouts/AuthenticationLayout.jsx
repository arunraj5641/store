const AuthenticationLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,217,255,0.16),_transparent_45%),#030712] text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        {children}
      </main>
    </div>
  )
}

export default AuthenticationLayout
