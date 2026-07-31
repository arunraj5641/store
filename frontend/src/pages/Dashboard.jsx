import { useState } from 'react'
import {
  TrendingUp,
  Box,
  Users,
  Sparkles,
  ArrowUpRight,
  Plus,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Check,
} from 'lucide-react'
import Header from '../components/common/Header'
import SearchBar from '../components/common/SearchBar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { AreaChart, BarChart } from '../components/ui/Chart'
import { initialProducts, initialOrders, initialNotifications } from '../services/mockData'

const Dashboard = () => {
  const [orders, setOrders] = useState(initialOrders)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [chartPeriod, setChartPeriod] = useState('7D')
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isUdharModalOpen, setIsUdharModalOpen] = useState(false)

  // New Sale Form State
  const [saleForm, setSaleForm] = useState({
    customerName: '',
    itemsText: '',
    total: '',
    paymentMode: 'UPI (PhonePe)',
  })

  // Quick Stats
  const kpis = [
    { title: "Today's Revenue", value: '₹24,850', change: '+14.2%', tone: 'success', icon: TrendingUp, detail: 'vs. yesterday ₹21,750' },
    { title: 'Total Billing Sales', value: '482 orders', change: '+8.5%', tone: 'success', icon: ShoppingBag, detail: 'Avg basket: ₹620' },
    { title: 'Active Inventory', value: '1,420 items', change: '8 Low Stock', tone: 'warning', icon: Box, detail: 'Needs replenishment' },
    { title: 'Registered Customers', value: '684 users', change: '+22 this week', tone: 'primary', icon: Users, detail: 'Udhar active: ₹1,650' },
  ]

  // Chart Data per Period
  const chartData = {
    '7D': [
      { label: 'Mon', value: 18500, formattedValue: '₹18,500' },
      { label: 'Tue', value: 22400, formattedValue: '₹22,400' },
      { label: 'Wed', value: 19800, formattedValue: '₹19,800' },
      { label: 'Thu', value: 24850, formattedValue: '₹24,850' },
      { label: 'Fri', value: 28100, formattedValue: '₹28,100' },
      { label: 'Sat', value: 34200, formattedValue: '₹34,200' },
      { label: 'Sun', value: 31000, formattedValue: '₹31,000' },
    ],
    '30D': [
      { label: 'Week 1', value: 142000, formattedValue: '₹1,42,000' },
      { label: 'Week 2', value: 168000, formattedValue: '₹1,68,000' },
      { label: 'Week 3', value: 155000, formattedValue: '₹1,55,000' },
      { label: 'Week 4', value: 184250, formattedValue: '₹1,84,250' },
    ],
  }

  // Handle Create Quick Sale
  const handleCreateSale = (e) => {
    e.preventDefault()
    if (!saleForm.customerName || !saleForm.total) return

    const newOrder = {
      id: `ORD-${Math.floor(8943 + Math.random() * 100)}`,
      customerName: saleForm.customerName,
      phone: '+91 98765 00000',
      items: saleForm.itemsText ? saleForm.itemsText.split(',') : ['Kirana Store Items'],
      itemsCount: saleForm.itemsText ? saleForm.itemsText.split(',').length : 1,
      total: Number(saleForm.total),
      paymentMode: saleForm.paymentMode,
      status: 'Completed',
      date: 'Just Now',
      invoiceNo: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      gstAmount: (Number(saleForm.total) * 0.05).toFixed(2),
    }

    setOrders([newOrder, ...orders])
    setSaleForm({ customerName: '', itemsText: '', total: '', paymentMode: 'UPI (PhonePe)' })
    setIsNewSaleModalOpen(false)
  }

  const recentSalesColumns = ['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status']
  const recentSalesRows = orders.map((ord) => [
    <span key={ord.id} className="font-mono text-xs text-[#00D9FF]">{ord.id}</span>,
    ord.customerName,
    <span key={`${ord.id}-items`} className="text-xs truncate max-w-[150px] inline-block">{ord.items.join(', ')}</span>,
    <span key={`${ord.id}-total`} className="font-bold text-[#F8FAFC]">₹{ord.total}</span>,
    ord.paymentMode,
    <Badge
      key={`${ord.id}-status`}
      tone={ord.status === 'Completed' ? 'success' : 'warning'}
    >
      {ord.status}
    </Badge>,
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="Store Command Center"
        description="Real-time performance metrics, POS sales terminal, inventory alerts, and AI insights."
        badge="Live Dashboard"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddProductModalOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Add Product
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsNewSaleModalOpen(true)}>
              <ShoppingBag className="h-3.5 w-3.5" /> New POS Billing
            </Button>
          </div>
        }
      />

      {/* Quick Action Chips Bar */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <button
          onClick={() => setIsNewSaleModalOpen(true)}
          className="flex items-center gap-3 rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-3.5 text-left text-xs font-semibold text-[#F8FAFC] transition duration-200 hover:border-[#00D9FF]/40 hover:bg-[#111827] hover:shadow-[0_0_15px_rgba(0,217,255,0.15)] group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] group-hover:bg-[#00D9FF] group-hover:text-[#030712] transition">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold">New Sale</p>
            <p className="text-[10px] text-[#94A3B8] font-normal">Quick POS Entry</p>
          </div>
        </button>

        <button
          onClick={() => setIsAddProductModalOpen(true)}
          className="flex items-center gap-3 rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-3.5 text-left text-xs font-semibold text-[#F8FAFC] transition duration-200 hover:border-[#00D9FF]/40 hover:bg-[#111827] hover:shadow-[0_0_15px_rgba(0,217,255,0.15)] group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-[#030712] transition">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold">Add Product</p>
            <p className="text-[10px] text-[#94A3B8] font-normal">SKU Entry</p>
          </div>
        </button>

        <button
          onClick={() => setIsUdharModalOpen(true)}
          className="flex items-center gap-3 rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-3.5 text-left text-xs font-semibold text-[#F8FAFC] transition duration-200 hover:border-[#00D9FF]/40 hover:bg-[#111827] hover:shadow-[0_0_15px_rgba(0,217,255,0.15)] group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] group-hover:bg-[#F59E0B] group-hover:text-[#030712] transition">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold">Record Udhar</p>
            <p className="text-[10px] text-[#94A3B8] font-normal">Customer Credit</p>
          </div>
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 p-3.5 text-left text-xs font-semibold text-[#00D9FF]">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#00D9FF] text-[#030712]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="font-bold">AI Co-pilot</p>
            <p className="text-[10px] text-[#00D9FF]/80 font-normal">Active & Monitoring</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ title, value, change, tone, icon: Icon, detail }) => (
          <Card key={title} hoverEffect className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">{title}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#00D9FF]/20 bg-[#00D9FF]/10 text-[#00D9FF]">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-[#F8FAFC]">{value}</h2>
              <Badge tone={tone}>{change}</Badge>
            </div>
            <p className="mt-2 text-[11px] text-[#94A3B8]">{detail}</p>
          </Card>
        ))}
      </div>

      {/* Main Grid: Revenue Interactive Chart + AI Insights & Low Stock */}
      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <Card
          title="Revenue & Sales Velocity"
          subtitle="Daily sales performance and transaction throughput."
          action={
            <div className="flex items-center gap-1 rounded-xl border border-[#1F2937] bg-[#030712] p-1">
              {['7D', '30D'].map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    chartPeriod === period
                      ? 'bg-[#00D9FF] text-[#030712]'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          }
        >
          <div className="pt-2">
            <AreaChart data={chartData[chartPeriod]} height={220} />
          </div>
        </Card>

        {/* AI Co-pilot Insights & Low Stock Warning */}
        <div className="space-y-6">
          <Card
            title="AI Co-pilot Insights"
            subtitle="Automated recommendations for inventory & margins."
            className="border-[#00D9FF]/30 bg-gradient-to-b from-[#111827] to-[#030712]"
          >
            <div className="space-y-3">
              <div className="rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00D9FF]">
                  <Sparkles className="h-4 w-4" /> Demand Surge Warning
                </div>
                <p className="mt-1.5 text-xs text-[#F8FAFC] leading-relaxed">
                  Fortune Sunflower Oil 1L stock projected to run out in 18 hours due to weekend rush.
                </p>
                <Button variant="primary" size="sm" className="mt-3 w-full" onClick={() => setIsAddProductModalOpen(true)}>
                  Quick Replenish Stock
                </Button>
              </div>

              <div className="rounded-xl border border-[#1F2937] bg-[#030712]/60 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F8FAFC]">
                  <TrendingUp className="h-4 w-4 text-[#10B981]" /> Margin Suggestion
                </div>
                <p className="mt-1.5 text-xs text-[#94A3B8] leading-relaxed">
                  Bundle Basmati Rice 5kg with Ghee 500g to increase average basket size by 12%.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Transactions & Activity Feed Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <Card
          title="Recent Store Transactions"
          subtitle="Live stream of POS terminal billing receipts."
          action={
            <Button variant="ghost" size="sm" onClick={() => setIsNewSaleModalOpen(true)}>
              New POS Entry <ArrowUpRight className="h-3 w-3" />
            </Button>
          }
        >
          <Table columns={recentSalesColumns} rows={recentSalesRows} />
        </Card>

        {/* Notifications Panel */}
        <Card title="Activity Feed" subtitle="Real-time system events and alerts.">
          <div className="space-y-3">
            {notifications.slice(0, 3).map((ntf) => (
              <div key={ntf.id} className="flex items-start gap-3 rounded-xl border border-[#1F2937] bg-[#030712]/60 p-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#1F2937] bg-[#111827] text-[#00D9FF]">
                  {ntf.tone === 'warning' ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
                  ) : ntf.tone === 'success' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                  ) : (
                    <Bell className="h-3.5 w-3.5 text-[#00D9FF]" />
                  )}
                </div>
                <div className="overflow-hidden text-xs">
                  <p className="font-semibold text-[#F8FAFC] truncate">{ntf.title}</p>
                  <p className="text-[11px] text-[#94A3B8] truncate">{ntf.message}</p>
                  <span className="text-[10px] text-[#94A3B8]/70 mt-1 inline-block">{ntf.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Modal 1: Quick POS Sale Entry */}
      <Modal
        isOpen={isNewSaleModalOpen}
        onClose={() => setIsNewSaleModalOpen(false)}
        title="Create New POS Sale"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSale} className="space-y-4">
          <Input
            label="Customer Name"
            placeholder="e.g. Ramesh Patel"
            value={saleForm.customerName}
            onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })}
            required
          />
          <Input
            label="Items Purchased (Comma separated)"
            placeholder="e.g. Atta 5kg, Sunflower Oil 1L"
            value={saleForm.itemsText}
            onChange={(e) => setSaleForm({ ...saleForm, itemsText: e.target.value })}
          />
          <Input
            label="Total Amount (₹)"
            type="number"
            placeholder="e.g. 650"
            value={saleForm.total}
            onChange={(e) => setSaleForm({ ...saleForm, total: e.target.value })}
            required
          />
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Payment Mode
            </label>
            <select
              value={saleForm.paymentMode}
              onChange={(e) => setSaleForm({ ...saleForm, paymentMode: e.target.value })}
              className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3.5 py-2.5 text-sm text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
            >
              <option value="UPI (PhonePe)">UPI (PhonePe)</option>
              <option value="UPI (Google Pay)">UPI (Google Pay)</option>
              <option value="Cash">Cash</option>
              <option value="Card">Debit / Credit Card</option>
              <option value="Udhar / Credit">Udhar / Store Credit</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsNewSaleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Check className="h-4 w-4" /> Complete Sale
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Quick Add Product */}
      <Modal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        title="Add Product to Inventory"
        maxWidth="max-w-md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setIsAddProductModalOpen(false)
          }}
          className="space-y-4"
        >
          <Input label="Product Name" placeholder="e.g. Basmati Rice 5kg" required />
          <Input label="Category" placeholder="e.g. Staples & Grains" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Stock Level" type="number" placeholder="50" required />
            <Input label="Reorder Point" type="number" placeholder="15" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cost Price (₹)" type="number" placeholder="320" required />
            <Input label="Selling Price (₹)" type="number" placeholder="380" required />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAddProductModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Record Udhar */}
      <Modal
        isOpen={isUdharModalOpen}
        onClose={() => setIsUdharModalOpen(false)}
        title="Record Customer Udhar / Credit"
        maxWidth="max-w-md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setIsUdharModalOpen(false)
          }}
          className="space-y-4"
        >
          <Input label="Customer Name" placeholder="e.g. Vikram Singh" required />
          <Input label="Phone Number" placeholder="+91 98765 00000" required />
          <Input label="Credit Amount (₹)" type="number" placeholder="450" required />
          <Input label="Notes / Items" placeholder="e.g. Milk & Grocery credit for July" />
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsUdharModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Record Credit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Dashboard


