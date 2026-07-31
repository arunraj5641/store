import { useState, useMemo } from 'react'
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  DollarSign,
  Eye,
  Check,
  CreditCard,
  Grid,
  List as ListIcon,
} from 'lucide-react'
import Header from '../components/common/Header'
import SearchBar from '../components/common/SearchBar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Avatar from '../components/ui/Avatar'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewMode, setViewMode] = useState('table')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Form State
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    creditLimit: 3000,
  })

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [customers, searchQuery, statusFilter])

  const handleAddCustomer = (e) => {
    e.preventDefault()
    if (!customerForm.name || !customerForm.phone) return

    const newCust = {
      id: `CUST-0${customers.length + 1}`,
      name: customerForm.name,
      phone: customerForm.phone,
      email: customerForm.email || 'customer@kirana.store',
      address: customerForm.address || 'Local Customer',
      creditDue: 0,
      creditLimit: Number(customerForm.creditLimit),
      totalVisits: 1,
      totalSpent: 0,
      loyaltyPoints: 50,
      status: 'Clear Balance',
      lastVisit: 'Today',
    }

    setCustomers([newCust, ...customers])
    setIsAddModalOpen(false)
    setCustomerForm({ name: '', phone: '', email: '', address: '', creditLimit: 3000 })
  }

  // Clear Udhar Payment
  const handleClearUdhar = (cust) => {
    setCustomers(
      customers.map((c) => (c.id === cust.id ? { ...c, creditDue: 0, status: 'Clear Balance' } : c))
    )
    setSelectedCustomer(null)
  }

  const columns = ['Customer', 'Contact Phone', 'Udhar Due Balance', 'Credit Limit', 'Visits', 'Status', 'Actions']
  const rows = filteredCustomers.map((c) => [
    <div key={c.id} className="flex items-center gap-2.5">
      <Avatar name={c.name} size="sm" />
      <div>
        <span className="font-bold text-[#F8FAFC] block">{c.name}</span>
        <span className="text-[10px] text-[#94A3B8]">{c.id}</span>
      </div>
    </div>,
    c.phone,
    <span
      key={`${c.id}-due`}
      className={`font-bold ${c.creditDue > 0 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}
    >
      ₹{c.creditDue}
    </span>,
    `₹${c.creditLimit}`,
    `${c.totalVisits} visits`,
    <Badge
      tone={
        c.status === 'Clear Balance'
          ? 'success'
          : c.status === 'Udhar Active'
          ? 'warning'
          : 'danger'
      }
      key={`${c.id}-status`}
    >
      {c.status}
    </Badge>,
    <Button key={`${c.id}-act`} variant="ghost" size="sm" onClick={() => setSelectedCustomer(c)}>
      <Eye className="h-3.5 w-3.5" /> View Ledger
    </Button>,
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="Customer Directory & Store Credit (Udhar)"
        description="Digital credit ledger, loyalty points tracking, and instant WhatsApp payment reminders."
        badge="CRM & Ledger"
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" /> Add Customer
          </Button>
        }
      />

      {/* Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Total Registered</p>
          <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC]">{customers.length} Customers</h2>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Total Udhar Outstanding</p>
          <h2 className="mt-2 text-2xl font-bold text-[#F59E0B]">
            ₹{customers.reduce((acc, c) => acc + c.creditDue, 0)}
          </h2>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Active Udhar Accounts</p>
          <h2 className="mt-2 text-2xl font-bold text-[#00D9FF]">
            {customers.filter((c) => c.creditDue > 0).length} Customers
          </h2>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Loyalty Issued</p>
          <h2 className="mt-2 text-2xl font-bold text-[#10B981]">1,460 Points</h2>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4">
        <SearchBar
          placeholder="Search by customer name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#1F2937] bg-[#030712] px-3 py-2 text-xs text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
          >
            <option value="All">All Statuses</option>
            <option value="Udhar Active">Udhar Active</option>
            <option value="Clear Balance">Clear Balance</option>
            <option value="Overdue Alert">Overdue Alert</option>
          </select>

          <div className="flex items-center rounded-xl border border-[#1F2937] bg-[#030712] p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'table' ? 'bg-[#00D9FF] text-[#030712]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title="Table View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'grid' ? 'bg-[#00D9FF] text-[#030712]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title="Grid Cards View"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customers Main View */}
      {viewMode === 'table' ? (
        <Card title="Customer Ledger Directory">
          <Table columns={columns} rows={rows} emptyMessage="No customers found." />
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((c) => (
            <Card key={c.id} hoverEffect className="flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} size="md" />
                  <div>
                    <h3 className="font-bold text-[#F8FAFC] text-sm">{c.name}</h3>
                    <p className="text-xs text-[#94A3B8]">{c.phone}</p>
                  </div>
                </div>
                <Badge
                  tone={
                    c.status === 'Clear Balance'
                      ? 'success'
                      : c.status === 'Udhar Active'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {c.status}
                </Badge>
              </div>

              <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-3 text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase text-[#94A3B8] block">Udhar Balance</span>
                  <span className={`font-extrabold text-sm ${c.creditDue > 0 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
                    ₹{c.creditDue}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase text-[#94A3B8] block">Credit Limit</span>
                  <span className="font-semibold text-[#F8FAFC]">₹{c.creditLimit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#1F2937] pt-3">
                <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(c)}>
                  <Eye className="h-3.5 w-3.5" /> View Ledger
                </Button>
                <a
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(c.name)},%20your%20Udhar%20balance%20at%20Kirana%20Store%20is%20₹${c.creditDue}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#10B981] hover:underline"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal 1: Customer Details & Udhar Settlement Modal */}
      <Modal isOpen={Boolean(selectedCustomer)} onClose={() => setSelectedCustomer(null)} title="Customer Profile & Udhar Ledger">
        {selectedCustomer ? (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-3">
                <Avatar name={selectedCustomer.name} size="md" />
                <div>
                  <h3 className="text-base font-bold text-[#F8FAFC]">{selectedCustomer.name}</h3>
                  <p className="text-xs text-[#94A3B8]">{selectedCustomer.phone}</p>
                </div>
              </div>
              <Badge tone={selectedCustomer.creditDue > 0 ? 'warning' : 'success'}>
                {selectedCustomer.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[#94A3B8]">
              <div>
                <span className="block text-[10px] uppercase">Email</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Store Address</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{selectedCustomer.address}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Total Purchases</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">₹{selectedCustomer.totalSpent} ({selectedCustomer.totalVisits} visits)</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Loyalty Points</span>
                <span className="font-semibold text-[#00D9FF] text-xs">{selectedCustomer.loyaltyPoints} Points</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-[#94A3B8] block">Current Udhar Credit Balance</span>
                <span className={`text-xl font-bold ${selectedCustomer.creditDue > 0 ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
                  ₹{selectedCustomer.creditDue}
                </span>
                <span className="text-[11px] text-[#94A3B8] block">Limit: ₹{selectedCustomer.creditLimit}</span>
              </div>
              {selectedCustomer.creditDue > 0 ? (
                <Button variant="primary" size="sm" onClick={() => handleClearUdhar(selectedCustomer)}>
                  <Check className="h-3.5 w-3.5" /> Record Settlement
                </Button>
              ) : (
                <Badge tone="success">Fully Settled</Badge>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setSelectedCustomer(null)}>Close</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Modal 2: Add Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Customer">
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Suresh Kumar"
            value={customerForm.name}
            onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            placeholder="+91 98765 43210"
            value={customerForm.phone}
            onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
            required
          />
          <Input
            label="Email (Optional)"
            type="email"
            placeholder="suresh@gmail.com"
            value={customerForm.email}
            onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
          />
          <Input
            label="Address"
            placeholder="e.g. #12, 5th Cross, Main Road"
            value={customerForm.address}
            onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
          />
          <Input
            label="Udhar Credit Limit (₹)"
            type="number"
            value={customerForm.creditLimit}
            onChange={(e) => setCustomerForm({ ...customerForm, creditLimit: e.target.value })}
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Profile</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Customers
