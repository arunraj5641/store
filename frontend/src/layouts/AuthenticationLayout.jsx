const AuthenticationLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#030712] px-4 py-12 text-[#F8FAFC]">
      {/* Background Glow Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-radial-auth opacity-90" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-25" />

      <main className="relative z-10 flex w-full max-w-md items-center justify-center animate-fade-in">
        {children}
      </main>
    </div>
  )
}

export default AuthenticationLayout

