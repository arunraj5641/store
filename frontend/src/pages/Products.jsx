import { useState, useMemo } from 'react'
import {
  ShoppingBag,
  Plus,
  Grid,
  List as ListIcon,
  Search,
  Eye,
  Edit2,
  Trash2,
  Tag,
  Barcode,
  Package,
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

const Products = () => {
  const [products, setProducts] = useState(initialProducts)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const categories = ['All', 'Staples & Grains', 'Dairy', 'Beverages', 'Household', 'Snacks', 'Personal Care']

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, searchQuery])

  const tableColumns = ['Product ID', 'Name', 'Category', 'MRP Price', 'Profit Margin', 'Status', 'Actions']
  const tableRows = filteredProducts.map((p) => [
    <span key={p.id} className="font-mono text-xs text-[#00D9FF]">{p.id}</span>,
    p.name,
    p.category,
    <span key={`${p.id}-price`} className="font-bold text-[#F8FAFC]">₹{p.sellingPrice}</span>,
    <Badge tone="success" key={`${p.id}-margin`}>{p.margin}</Badge>,
    <Badge tone={p.status === 'In Stock' ? 'success' : 'warning'} key={`${p.id}-status`}>{p.status}</Badge>,
    <Button key={`${p.id}-btn`} variant="ghost" size="sm" onClick={() => setSelectedProduct(p)}>
      <Eye className="h-3.5 w-3.5" /> Details
    </Button>,
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="Product Catalog & Margins"
        description="Browse all store SKUs, profit margin percentages, supplier pricing, and barcodes."
        badge="Product Directory"
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Button>
        }
      />

      {/* Category Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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

      {/* Search & Layout View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          placeholder="Search products by title, SKU, barcode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Badge tone="primary">{filteredProducts.length} Products</Badge>
          <div className="flex items-center rounded-xl border border-[#1F2937] bg-[#030712] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'grid' ? 'bg-[#00D9FF] text-[#030712]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-lg p-1.5 transition ${
                viewMode === 'table' ? 'bg-[#00D9FF] text-[#030712]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
              title="Table View"
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Display */}
      {viewMode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => (
            <Card
              key={p.id}
              hoverEffect
              className="flex flex-col justify-between space-y-4 border-[#1F2937] group cursor-pointer"
              onClick={() => setSelectedProduct(p)}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#00D9FF]">{p.sku}</span>
                  <Badge tone="success">{p.margin} Margin</Badge>
                </div>
                <h3 className="mt-3 text-base font-bold text-[#F8FAFC] group-hover:text-[#00D9FF] transition line-clamp-1">
                  {p.name}
                </h3>
                <p className="mt-1 text-xs text-[#94A3B8]">{p.category} • {p.unit}</p>
              </div>

              <div className="flex items-center justify-between border-t border-[#1F2937] pt-3">
                <div>
                  <span className="text-[10px] uppercase text-[#94A3B8]">MRP Price</span>
                  <p className="text-lg font-extrabold text-[#F8FAFC]">₹{p.sellingPrice}</p>
                </div>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); }}>
                  <Eye className="h-3.5 w-3.5" /> Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card title="Product Table Directory">
          <Table columns={tableColumns} rows={tableRows} />
        </Card>
      )}

      {/* Product Details Drawer / Modal */}
      <Modal isOpen={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} title="Product Information & HSN">
        {selectedProduct ? (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#F8FAFC]">{selectedProduct.name}</h3>
                <p className="text-xs text-[#00D9FF] font-mono">{selectedProduct.sku}</p>
              </div>
              <Badge tone="success">{selectedProduct.margin} Margin</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[#94A3B8]">
              <div>
                <span className="block text-[10px] uppercase">Category</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{selectedProduct.category}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Unit Package</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{selectedProduct.unit}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Wholesale Cost Price</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">₹{selectedProduct.costPrice}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Retail Selling Price</span>
                <span className="font-semibold text-[#00D9FF] text-xs">₹{selectedProduct.sellingPrice}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Supplier Name</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{selectedProduct.supplier}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">HSN Code</span>
                <span className="font-semibold text-[#F8FAFC] text-xs">{selectedProduct.hsnCode}</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#1F2937] bg-[#030712] p-4 text-center">
              <p className="text-[10px] uppercase tracking-wider text-[#94A3B8] mb-2 flex items-center justify-center gap-1">
                <Barcode className="h-4 w-4 text-[#00D9FF]" /> EAN-13 Barcode Symbol
              </p>
              <div className="font-mono text-lg tracking-[0.3em] font-bold text-[#F8FAFC]">
                ||| |||| | ||| |||| |
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8] mt-1 block">{selectedProduct.barcode}</span>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Product Entry">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setIsAddModalOpen(false)
          }}
          className="space-y-4"
        >
          <Input label="Product Name" placeholder="e.g. Parle-G Gold Biscuits 1kg" required />
          <Input label="Category" placeholder="e.g. Snacks" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cost Price (₹)" type="number" placeholder="105" required />
            <Input label="Selling Price (₹)" type="number" placeholder="120" required />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Product</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Products


