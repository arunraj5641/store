import { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle2, Info, Sparkles, Check, Trash2 } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { initialNotifications } from '../services/mockData'

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Low Stock', 'Payments', 'Udhar', 'AI Insights', 'System']

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter(
    (n) => selectedCategory === 'All' || n.category === selectedCategory
  )

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleToggleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const handleDelete = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="Notifications & Activity Log"
        description="Real-time system events, inventory replenishment alerts, payment settlements, and AI recommendations."
        badge={`${unreadCount} Unread`}
        actions={
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <Check className="h-3.5 w-3.5" /> Mark All as Read
          </Button>
        }
      />

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1F2937]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'border border-[#00D9FF]/40 bg-[#00D9FF] text-[#030712] shadow-[0_0_15px_rgba(0,217,255,0.3)]'
                : 'border border-[#1F2937] bg-[#111827] text-[#94A3B8] hover:border-[#374151] hover:text-[#F8FAFC]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(({ id, title, time, read, category, tone, message }) => (
            <Card
              key={id}
              hoverEffect
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 ${
                !read ? 'border-l-[#00D9FF] bg-[#111827]' : 'border-l-transparent bg-[#111827]/60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1F2937] ${
                    tone === 'warning'
                      ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                      : tone === 'success'
                      ? 'bg-[#10B981]/10 text-[#10B981]'
                      : tone === 'danger'
                      ? 'bg-[#EF4444]/10 text-[#EF4444]'
                      : 'bg-[#00D9FF]/10 text-[#00D9FF]'
                  }`}
                >
                  {tone === 'warning' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : tone === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : tone === 'primary' ? (
                    <Sparkles className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm font-bold ${!read ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'}`}>
                      {title}
                    </h3>
                    <Badge tone={tone}>{category}</Badge>
                    {!read ? <span className="h-2 w-2 rounded-full bg-[#00D9FF]" /> : null}
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{message}</p>
                  <span className="text-[10px] text-[#94A3B8]/70 block">{time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Button variant="ghost" size="sm" onClick={() => handleToggleRead(id)}>
                  {read ? 'Mark Unread' : 'Mark Read'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(id)}>
                  <Trash2 className="h-3.5 w-3.5 text-[#EF4444]" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12 text-[#94A3B8] text-sm">
            No notifications in this category.
          </Card>
        )}
      </div>
    </div>
  )
}

export default Notifications

