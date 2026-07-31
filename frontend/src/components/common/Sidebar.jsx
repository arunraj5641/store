import {
  LayoutDashboard,
  Box,
  ShoppingBag,
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  Bell,
  User,
  Settings,
  Store,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/inventory', label: 'Inventory', icon: Box },
    { to: '/products', label: 'Products', icon: ShoppingBag },
    { to: '/sales', label: 'Sales', icon: TrendingUp },
    { to: '/customers', label: 'Customers', icon: Users },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/assistant', label: 'AI Assistant', icon: Sparkles, badge: 'AI' },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-[#1F2937] bg-[#030712] p-4 lg:flex shrink-0">
      {/* Brand Header */}
      <div className="mb-6 flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.15)]">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-[#F8FAFC]">Kirana OS</h2>
            <p className="text-[11px] text-[#94A3B8]">v1.0 Pro Edition</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]/70">
          Navigation
        </p>
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.08)]'
                  : 'text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 transition-colors ${isActive ? 'text-[#00D9FF]' : 'group-hover:text-[#F8FAFC]'}`} />
                  <span>{label}</span>
                </div>
                {badge ? (
                  <span className="rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/20 px-1.5 py-0.5 text-[9px] font-bold text-[#00D9FF]">
                    {badge}
                  </span>
                ) : (
                  <ChevronRight className={`h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 ${isActive ? 'opacity-100 text-[#00D9FF]' : ''}`} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer Profile */}
      <div className="mt-auto border-t border-[#1F2937] pt-4">
        <div className="flex items-center justify-between rounded-xl border border-[#1F2937] bg-[#111827] p-2.5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00D9FF]/20 text-xs font-bold text-[#00D9FF]">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="truncate">
              <p className="truncate text-xs font-medium text-[#F8FAFC]">{user?.name || 'Store Owner'}</p>
              <p className="truncate text-[10px] text-[#94A3B8]">{user?.email || 'owner@kirana.store'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#1F2937] hover:text-[#EF4444] transition"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

