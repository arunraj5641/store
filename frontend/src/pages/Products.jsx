import { useCallback, useEffect, useState } from 'react'
import { Edit2, Eye, Plus, Trash2 } from 'lucide-react'
import Header from '../components/common/Header'
import SearchBar from '../components/common/SearchBar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import inventoryService from '../services/inventory'

const emptyProduct = { product_name: '', category: '', current_stock: '', reorder_threshold: '' }
const productStatus = (product) => product.current_stock <= product.reorder_threshold ? 'Low Stock' : 'In Stock'

const Products = () => {
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyProduct)
  const [editingProduct, setEditingProduct] = useState(null)
  const [viewingProduct, setViewingProduct] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await inventoryService.list({ page, per_page: 20, search: search || undefined, category: category || undefined })
      setProducts(response.data.products)
      setMeta(response.meta)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load products.')
    } finally {
      setLoading(false)
    }
  }, [page, search, category])

  useEffect(() => { loadProducts() }, [loadProducts])

  const submitProduct = async (event) => {
    event.preventDefault()
    try {
      const payload = { ...form, current_stock: Number(form.current_stock), reorder_threshold: Number(form.reorder_threshold) }
      if (editingProduct) await inventoryService.update(editingProduct.product_id, payload)
      else await inventoryService.create(payload)
      setIsFormOpen(false)
      setEditingProduct(null)
      setForm(emptyProduct)
      loadProducts()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save product.')
    }
  }

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.product_name}?`)) return
    try {
      await inventoryService.remove(product.product_id)
      loadProducts()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete product.')
    }
  }

  const columns = ['Product', 'Category', 'Stock', 'Reorder level', 'Status', 'Actions']
  const rows = products.map((product) => [
    <div key={product.product_id}><p className="font-semibold text-[#F8FAFC]">{product.product_name}</p><p className="text-[11px] text-[#00D9FF]">#{product.product_id}</p></div>,
    product.category,
    product.current_stock,
    product.reorder_threshold,
    <Badge key={`status-${product.product_id}`} tone={productStatus(product) === 'Low Stock' ? 'warning' : 'success'}>{productStatus(product)}</Badge>,
    <div key={`actions-${product.product_id}`} className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => setViewingProduct(product)}><Eye className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => { setEditingProduct(product); setForm(product); setIsFormOpen(true) }}><Edit2 className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => deleteProduct(product)}><Trash2 className="h-3.5 w-3.5 text-[#EF4444]" /></Button></div>,
  ])

  return <div className="space-y-8 animate-fade-in">
    <Header title="Products & Inventory" description="Manage the products owned by your store." badge="Live API" actions={<Button variant="primary" size="sm" onClick={() => { setEditingProduct(null); setForm(emptyProduct); setIsFormOpen(true) }}><Plus className="h-3.5 w-3.5" /> Add Product</Button>} />
    <div className="flex flex-col gap-3 sm:flex-row"><SearchBar placeholder="Search product name..." value={search} onChange={(event) => { setPage(1); setSearch(event.target.value) }} /><Input placeholder="Filter category" value={category} onChange={(event) => { setPage(1); setCategory(event.target.value) }} /></div>
    {loading ? <LoadingSpinner label="Loading products..." /> : error ? <ErrorState description={error} onRetry={loadProducts} /> : products.length === 0 ? <EmptyState title="No products found" description="Create your first product to begin managing inventory." action={<Button variant="primary" onClick={() => setIsFormOpen(true)}>Add Product</Button>} /> : <Card title="Product catalog" subtitle={`${meta?.total || products.length} products`}><Table columns={columns} rows={rows} /></Card>}
    {meta ? <div className="flex items-center justify-between text-xs text-[#94A3B8]"><span>Page {meta.page} of {meta.total_pages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= meta.total_pages} onClick={() => setPage(page + 1)}>Next</Button></div></div> : null}
    <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingProduct ? 'Update Product' : 'Add Product'}><form className="space-y-4" onSubmit={submitProduct}><Input label="Product name" value={form.product_name} onChange={(event) => setForm({ ...form, product_name: event.target.value })} required /><Input label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required /><div className="grid grid-cols-2 gap-3"><Input label="Current stock" type="number" min="0" value={form.current_stock} onChange={(event) => setForm({ ...form, current_stock: event.target.value })} required /><Input label="Reorder threshold" type="number" min="0" value={form.reorder_threshold} onChange={(event) => setForm({ ...form, reorder_threshold: event.target.value })} required /></div><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button><Button type="submit" variant="primary">Save Product</Button></div></form></Modal>
    <Modal isOpen={Boolean(viewingProduct)} onClose={() => setViewingProduct(null)} title="Product details">{viewingProduct ? <dl className="grid grid-cols-2 gap-4 text-sm"><div><dt className="text-[#94A3B8]">Category</dt><dd>{viewingProduct.category}</dd></div><div><dt className="text-[#94A3B8]">Current stock</dt><dd>{viewingProduct.current_stock}</dd></div><div><dt className="text-[#94A3B8]">Reorder threshold</dt><dd>{viewingProduct.reorder_threshold}</dd></div></dl> : null}</Modal>
  </div>
}

export default Products
