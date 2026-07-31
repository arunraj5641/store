import { Store, LogOut, User, Bell, Sparkles } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#1F2937] bg-[#030712]/80 px-6 py-3.5 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.15)] transition duration-300 group-hover:scale-105 group-hover:bg-[#00D9FF]/20">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider uppercase text-[#F8FAFC]">Kirana OS</span>
              <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse" title="System Operational" />
            </div>
            <p className="text-[11px] text-[#94A3B8]">AI Store Operations</p>
          </div>
        </Link>

        {/* Right action items */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/notifications"
                className="relative rounded-xl border border-[#1F2937] bg-[#111827] p-2 text-[#94A3B8] transition hover:border-[#374151] hover:text-[#F8FAFC]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#00D9FF]" />
              </Link>
              <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00D9FF]/20 text-xs font-semibold text-[#00D9FF]">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="text-xs font-medium text-[#F8FAFC]">{user?.name || 'Store Manager'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-xs font-semibold text-[#94A3B8] transition hover:border-[#EF4444]/40 hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="rounded-xl border border-[#1F2937] bg-[#111827] px-4 py-2 text-xs font-semibold text-[#F8FAFC] transition hover:border-[#00D9FF]/40 hover:text-[#00D9FF]"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#00D9FF] px-4 py-2 text-xs font-semibold text-[#030712] transition hover:bg-[#38BDF8] shadow-[0_0_15px_rgba(0,217,255,0.3)]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar

