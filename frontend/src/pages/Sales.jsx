import { useState, useMemo } from 'react'
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  Download,
  Plus,
  Printer,
  FileText,
  Check,
  Search,
  Filter,
} from 'lucide-react'
import Header from '../components/common/Header'
import SearchBar from '../components/common/SearchBar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { BarChart } from '../components/ui/Chart'
import { initialOrders } from '../services/mockData'

const Sales = () => {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false)

  // New Sale Form
  const [saleForm, setSaleForm] = useState({
    customerName: '',
    phone: '',
    itemsText: '',
    total: '',
    paymentMode: 'UPI (PhonePe)',
  })

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesPayment =
        selectedPaymentMode === 'All' || ord.paymentMode.toLowerCase().includes(selectedPaymentMode.toLowerCase())
      const matchesSearch =
        ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesPayment && matchesSearch
    })
  }, [orders, selectedPaymentMode, searchQuery])

  // Mock Sales Bar Chart Data
  const salesChartData = [
    { label: '8 AM', value: 3400, formattedValue: '₹3,400' },
    { label: '10 AM', value: 8900, formattedValue: '₹8,900' },
    { label: '12 PM', value: 6200, formattedValue: '₹6,200' },
    { label: '2 PM', value: 4500, formattedValue: '₹4,500' },
    { label: '4 PM', value: 9800, formattedValue: '₹9,800' },
    { label: '6 PM', value: 14200, formattedValue: '₹14,200' },
    { label: '8 PM', value: 18500, formattedValue: '₹18,500' },
  ]

  const handleCreateSale = (e) => {
    e.preventDefault()
    if (!saleForm.customerName || !saleForm.total) return

    const newOrder = {
      id: `ORD-${Math.floor(8943 + Math.random() * 100)}`,
      customerName: saleForm.customerName,
      phone: saleForm.phone || '+91 98765 00000',
      items: saleForm.itemsText ? saleForm.itemsText.split(',') : ['General Store Billing'],
      itemsCount: saleForm.itemsText ? saleForm.itemsText.split(',').length : 1,
      total: Number(saleForm.total),
      paymentMode: saleForm.paymentMode,
      status: saleForm.paymentMode.includes('Udhar') ? 'Pending Settlement' : 'Completed',
      date: 'Just Now',
      invoiceNo: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      gstAmount: (Number(saleForm.total) * 0.05).toFixed(2),
    }

    setOrders([newOrder, ...orders])
    setIsNewSaleModalOpen(false)
    setSaleForm({ customerName: '', phone: '', itemsText: '', total: '', paymentMode: 'UPI (PhonePe)' })
  }

  const columns = ['Order ID', 'Time / Date', 'Customer', 'Payment Mode', 'Total Amount', 'Status', 'Actions']
  const rows = filteredOrders.map((ord) => [
    <span key={ord.id} className="font-mono text-xs text-[#00D9FF]">{ord.id}</span>,
    ord.date,
    ord.customerName,
    ord.paymentMode,
    <span key={`${ord.id}-total`} className="font-bold text-[#F8FAFC]">₹{ord.total}</span>,
    <Badge key={`${ord.id}-status`} tone={ord.status === 'Completed' ? 'success' : 'warning'}>
      {ord.status}
    </Badge>,
    <Button key={`${ord.id}-action`} variant="ghost" size="sm" onClick={() => setSelectedOrder(ord)}>
      <FileText className="h-3.5 w-3.5" /> Receipt
    </Button>,
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="POS Sales & Transaction History"
        description="Daily billing counter receipts, digital payment reconciliations, and Tax invoices."
        badge="Billing POS"
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsNewSaleModalOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> New POS Billing
          </Button>
        }
      />

      {/* Sales KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Gross Revenue Today</p>
          <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC]">₹24,850</h2>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">UPI Payments</p>
          <h2 className="mt-2 text-2xl font-bold text-[#00D9FF]">74% Ratio</h2>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Avg Ticket Size</p>
          <h2 className="mt-2 text-2xl font-bold text-[#10B981]">₹620</h2>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Pending Udhar Sales</p>
          <h2 className="mt-2 text-2xl font-bold text-[#F59E0B]">₹1,650</h2>
        </Card>
      </div>

      {/* Hourly Billing Bar Chart */}
      <Card title="Hourly Sales Distribution" subtitle="Today's billing volume spikes across store hours.">
        <BarChart data={salesChartData} height={180} />
      </Card>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4">
        <SearchBar
          placeholder="Search Order ID, Customer name, Invoice #..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={selectedPaymentMode}
            onChange={(e) => setSelectedPaymentMode(e.target.value)}
            className="rounded-xl border border-[#1F2937] bg-[#030712] px-3 py-2 text-xs text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
          >
            <option value="All">All Payment Modes</option>
            <option value="UPI">UPI (Google Pay / PhonePe)</option>
            <option value="Cash">Cash</option>
            <option value="Card">Debit / Credit Card</option>
            <option value="Udhar">Udhar / Store Credit</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <Card title="Completed & Pending Sales Receipts" subtitle={`Showing ${filteredOrders.length} orders`}>
        <Table columns={columns} rows={rows} emptyMessage="No transactions found." />
      </Card>

      {/* Modal 1: Receipt Details Drawer Modal */}
      <Modal isOpen={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} title="POS Tax Invoice Receipt">
        {selectedOrder ? (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div>
                <span className="font-mono text-[#00D9FF] text-sm font-bold">{selectedOrder.invoiceNo}</span>
                <p className="text-[11px] text-[#94A3B8]">{selectedOrder.date}</p>
              </div>
              <Badge tone={selectedOrder.status === 'Completed' ? 'success' : 'warning'}>
                {selectedOrder.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[#94A3B8]">
              <div>
                <span className="block text-[10px] uppercase">Customer Name</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{selectedOrder.customerName}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Phone Number</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{selectedOrder.phone}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Payment Mode</span>
                <span className="font-semibold text-[#00D9FF] text-xs">{selectedOrder.paymentMode}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">GST Tax (5%)</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">₹{selectedOrder.gstAmount}</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 space-y-2">
              <p className="font-semibold text-[#F8FAFC] mb-2 border-b border-[#1F2937] pb-1">Items Purchased</p>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span>• {item}</span>
                  <span className="font-semibold text-[#F8FAFC]">1 x unit</span>
                </div>
              ))}
              <div className="border-t border-[#1F2937] pt-2 mt-2 flex items-center justify-between font-bold text-sm text-[#F8FAFC]">
                <span>Total Amount Paid</span>
                <span className="text-[#00D9FF]">₹{selectedOrder.total}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-3.5 w-3.5" /> Print Receipt
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedOrder(null)}>
                Close Invoice
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Modal 2: Create New Sale POS Modal */}
      <Modal isOpen={isNewSaleModalOpen} onClose={() => setIsNewSaleModalOpen(false)} title="New Counter Sale / POS Billing">
        <form onSubmit={handleCreateSale} className="space-y-4">
          <Input
            label="Customer Name"
            placeholder="e.g. Ramesh Patel"
            value={saleForm.customerName}
            onChange={(e) => setSaleForm({ ...saleForm, customerName: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+91 98765 43210"
            value={saleForm.phone}
            onChange={(e) => setSaleForm({ ...saleForm, phone: e.target.value })}
          />
          <Input
            label="Items Purchased (Comma separated)"
            placeholder="e.g. Atta 5kg, Fortune Oil 1L"
            value={saleForm.itemsText}
            onChange={(e) => setSaleForm({ ...saleForm, itemsText: e.target.value })}
          />
          <Input
            label="Total Bill Amount (₹)"
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
            <Button variant="ghost" onClick={() => setIsNewSaleModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              <Check className="h-4 w-4" /> Issue Receipt
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Sales

