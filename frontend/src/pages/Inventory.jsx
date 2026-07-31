import { useState, useMemo } from 'react'
import {
  Box,
  Plus,
  Filter,
  Grid,
  List as ListIcon,
  Search,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Barcode,
} from 'lucide-react'
import Header from '../components/common/Header'
import SearchBar from '../components/common/SearchBar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import { initialProducts } from '../services/mockData'

const Inventory = () => {
  const [products, setProducts] = useState(initialProducts)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortBy, setSortBy] = useState('name') // 'name' | 'stock' | 'price'
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [viewingProduct, setViewingProduct] = useState(null)

  // Form state
  const [form, setForm] = useState({
    name: '',
    category: 'Staples & Grains',
    stock: 20,
    reorderPoint: 15,
    unit: '1kg Pack',
    costPrice: 100,
    sellingPrice: 120,
    sku: '',
  })

  // Categories list
  const categories = ['All', 'Staples & Grains', 'Dairy', 'Beverages', 'Household', 'Snacks', 'Personal Care']
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Critical']

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
        const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus

        return matchesSearch && matchesCategory && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'stock') return a.stock - b.stock
        if (sortBy === 'price') return b.sellingPrice - a.sellingPrice
        return a.name.localeCompare(b.name)
      })
  }, [products, searchQuery, selectedCategory, selectedStatus, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  }, [filteredProducts, currentPage])

  // Add Product Submit
  const handleAddProduct = (e) => {
    e.preventDefault()
    const marginPercent = (((form.sellingPrice - form.costPrice) / form.sellingPrice) * 100).toFixed(1)
    const newProd = {
      id: `PRD-${Math.floor(113 + Math.random() * 800)}`,
      name: form.name,
      category: form.category,
      stock: Number(form.stock),
      reorderPoint: Number(form.reorderPoint),
      unit: form.unit,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      margin: `${marginPercent}%`,
      sku: form.sku || `SKU-${Math.floor(890135 + Math.random() * 1000)}`,
      status: Number(form.stock) === 0 ? 'Out of Stock' : Number(form.stock) <= Number(form.reorderPoint) ? 'Low Stock' : 'In Stock',
      hsnCode: '2106',
      supplier: 'Primary Wholesale Depot',
      expiryDate: '2027-12-31',
      barcode: `890105800${Math.floor(100 + Math.random() * 900)}`,
    }

    setProducts([newProd, ...products])
    setIsAddModalOpen(false)
    setForm({ name: '', category: 'Staples & Grains', stock: 20, reorderPoint: 15, unit: '1kg Pack', costPrice: 100, sellingPrice: 120, sku: '' })
  }

  // Edit Product Submit
  const handleEditProduct = (e) => {
    e.preventDefault()
    setProducts(
      products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: editingProduct.name,
              category: editingProduct.category,
              stock: Number(editingProduct.stock),
              sellingPrice: Number(editingProduct.sellingPrice),
              status: Number(editingProduct.stock) === 0 ? 'Out of Stock' : Number(editingProduct.stock) <= p.reorderPoint ? 'Low Stock' : 'In Stock',
            }
          : p
      )
    )
    setEditingProduct(null)
  }

  // Delete Product Submit
  const handleDeleteProduct = () => {
    setProducts(products.filter((p) => p.id !== deletingProduct.id))
    setDeletingProduct(null)
  }

  const tableColumns = ['SKU & Product', 'Category', 'Stock Level', 'Price (MRP)', 'Margin', 'Status', 'Actions']
  const tableRows = paginatedProducts.map((p) => [
    <div key={p.id} className="flex flex-col">
      <span className="font-semibold text-[#F8FAFC]">{p.name}</span>
      <span className="text-[11px] font-mono text-[#00D9FF]">{p.sku}</span>
    </div>,
    p.category,
    <div key={`${p.id}-stock`} className="flex items-center gap-2">
      <span className="font-bold text-[#F8FAFC]">{p.stock}</span>
      <span className="text-[11px] text-[#94A3B8]">/ reorder {p.reorderPoint}</span>
    </div>,
    <span key={`${p.id}-price`} className="font-bold text-[#F8FAFC]">₹{p.sellingPrice}</span>,
    <Badge tone="success" key={`${p.id}-margin`}>{p.margin}</Badge>,
    <Badge
      tone={
        p.status === 'In Stock'
          ? 'success'
          : p.status === 'Low Stock'
          ? 'warning'
          : p.status === 'Critical'
          ? 'danger'
          : 'neutral'
      }
      key={`${p.id}-status`}
    >
      {p.status}
    </Badge>,
    <div key={`${p.id}-actions`} className="flex items-center gap-1.5">
      <button
        onClick={() => setViewingProduct(p)}
        className="rounded-lg p-1 text-[#94A3B8] hover:bg-[#1F2937] hover:text-[#00D9FF] transition"
        title="View Product Details"
      >
        <Eye className="h-4 w-4" />
      </button>
      <button
        onClick={() => setEditingProduct(p)}
        className="rounded-lg p-1 text-[#94A3B8] hover:bg-[#1F2937] hover:text-[#38BDF8] transition"
        title="Edit Item"
      >
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => setDeletingProduct(p)}
        className="rounded-lg p-1 text-[#94A3B8] hover:bg-[#1F2937] hover:text-[#EF4444] transition"
        title="Delete Item"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>,
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="Inventory & Stock Management"
        description="Monitor item stock levels, set automated reorder thresholds, and adjust prices."
        badge="Stock Control"
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Add New Item
          </Button>
        }
      />

      {/* Stock Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Total SKUs</p>
          <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC]">{products.length} Items</h2>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Low Stock Alerts</p>
          <h2 className="mt-2 text-2xl font-bold text-[#F59E0B]">
            {products.filter((p) => p.status === 'Low Stock' || p.status === 'Critical').length} Items
          </h2>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Out of Stock</p>
          <h2 className="mt-2 text-2xl font-bold text-[#EF4444]">
            {products.filter((p) => p.status === 'Out of Stock').length} Items
          </h2>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Stock Valuation</p>
          <h2 className="mt-2 text-2xl font-bold text-[#00D9FF]">₹4,12,500</h2>
        </Card>
      </div>

      {/* Filters, Search & View Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#1F2937] bg-[#111827]/70 p-4">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <SearchBar
            placeholder="Search SKU code, item name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full sm:w-auto rounded-xl border border-[#1F2937] bg-[#030712] px-3 py-2 text-xs text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full sm:w-auto rounded-xl border border-[#1F2937] bg-[#030712] px-3 py-2 text-xs text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-[#1F2937] bg-[#030712] px-3 py-2 text-xs text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="stock">Sort: Stock (Low-High)</option>
            <option value="price">Sort: Price (High-Low)</option>
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

      {/* Main View Display: Table or Grid */}
      {viewMode === 'table' ? (
        <Card title="Stock Registry" subtitle={`Showing ${paginatedProducts.length} of ${filteredProducts.length} filtered items.`}>
          <Table columns={tableColumns} rows={tableRows} emptyMessage="No products found matching filters." />
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProducts.map((p) => (
            <Card key={p.id} hoverEffect className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono text-[#00D9FF]">{p.sku}</span>
                  <Badge
                    tone={
                      p.status === 'In Stock'
                        ? 'success'
                        : p.status === 'Low Stock'
                        ? 'warning'
                        : p.status === 'Critical'
                        ? 'danger'
                        : 'neutral'
                    }
                  >
                    {p.status}
                  </Badge>
                </div>
                <h3 className="mt-2 text-base font-bold text-[#F8FAFC] line-clamp-1">{p.name}</h3>
                <p className="text-xs text-[#94A3B8]">{p.category} • {p.unit}</p>
              </div>

              <div className="flex items-center justify-between border-t border-[#1F2937] pt-3">
                <div>
                  <p className="text-[10px] uppercase text-[#94A3B8]">Stock Level</p>
                  <p className="text-sm font-bold text-[#F8FAFC]">{p.stock} units</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-[#94A3B8]">Selling Price</p>
                  <p className="text-sm font-bold text-[#00D9FF]">₹{p.sellingPrice}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1F2937]/50">
                <Button variant="ghost" size="sm" onClick={() => setViewingProduct(p)}>
                  <Eye className="h-3.5 w-3.5" /> Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditingProduct(p)}>
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => setDeletingProduct(p)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-[#1F2937] pt-4 text-xs text-[#94A3B8]">
        <span>
          Page {currentPage} of {totalPages} ({filteredProducts.length} items total)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Modal 1: Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Product to Stock Registry">
        <form onSubmit={handleAddProduct} className="space-y-4">
          <Input
            label="Product Name"
            placeholder="e.g. Aashirvaad Whole Wheat Atta 10kg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#00D9FF]"
              >
                {categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Input
              label="SKU Code"
              placeholder="SKU-890135"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Stock Level"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
            <Input
              label="Reorder Threshold"
              type="number"
              value={form.reorderPoint}
              onChange={(e) => setForm({ ...form, reorderPoint: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Cost Price (₹)"
              type="number"
              value={form.costPrice}
              onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
              required
            />
            <Input
              label="Selling Price (₹)"
              type="number"
              value={form.sellingPrice}
              onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
              required
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Product</Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Edit Product Modal */}
      <Modal isOpen={Boolean(editingProduct)} onClose={() => setEditingProduct(null)} title="Edit Stock Item">
        {editingProduct ? (
          <form onSubmit={handleEditProduct} className="space-y-4">
            <Input
              label="Product Name"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Stock Level"
                type="number"
                value={editingProduct.stock}
                onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                required
              />
              <Input
                label="Selling Price (₹)"
                type="number"
                value={editingProduct.sellingPrice}
                onChange={(e) => setEditingProduct({ ...editingProduct, sellingPrice: e.target.value })}
                required
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditingProduct(null)}>Cancel</Button>
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
          </form>
        ) : null}
      </Modal>

      {/* Modal 3: Delete Confirmation Modal */}
      <Modal isOpen={Boolean(deletingProduct)} onClose={() => setDeletingProduct(null)} title="Confirm Product Deletion">
        {deletingProduct ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-4 text-xs text-[#EF4444]">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>
                Are you sure you want to remove <strong>{deletingProduct.name}</strong> ({deletingProduct.sku}) from stock registry?
              </span>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeletingProduct(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDeleteProduct}>Confirm Delete</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Modal 4: View Product Details */}
      <Modal isOpen={Boolean(viewingProduct)} onClose={() => setViewingProduct(null)} title="Product Information & Barcode">
        {viewingProduct ? (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F8FAFC]">{viewingProduct.name}</h3>
                <p className="text-xs text-[#00D9FF] font-mono">{viewingProduct.sku}</p>
              </div>
              <Badge tone="success">{viewingProduct.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[#94A3B8]">
              <div>
                <span className="block text-[10px] uppercase">Category</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{viewingProduct.category}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">HSN Code</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{viewingProduct.hsnCode}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Cost Price</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">₹{viewingProduct.costPrice}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Selling Price</span>
                <span className="font-semibold text-[#00D9FF] text-xs">₹{viewingProduct.sellingPrice}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Supplier</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{viewingProduct.supplier}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Expiry Date</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{viewingProduct.expiryDate}</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-[#94A3B8] mb-2 flex items-center justify-center gap-1">
                <Barcode className="h-4 w-4 text-[#00D9FF]" /> EAN-13 Barcode Preview
              </p>
              <div className="font-mono text-lg tracking-[0.3em] font-bold text-[#F8FAFC]">
                ||| ||| || |||| | ||||
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8] mt-1 block">{viewingProduct.barcode}</span>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

export default Inventory


