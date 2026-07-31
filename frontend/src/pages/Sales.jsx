import { useCallback, useEffect, useState } from 'react'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import salesService from '../services/sales'
import inventoryService from '../services/inventory'

const emptySale = { product_id: '', sale_date: new Date().toISOString().slice(0, 10), quantity_sold: '' }

const Sales = () => {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [productId, setProductId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptySale)
  const [editingSale, setEditingSale] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const loadSales = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const response = await salesService.list({ page, per_page: 20, product_id: productId || undefined, start_date: startDate || undefined, end_date: endDate || undefined })
      setSales(response.data.sales_histories); setMeta(response.meta)
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load sales.') } finally { setLoading(false) }
  }, [page, productId, startDate, endDate])

  useEffect(() => { loadSales() }, [loadSales])
  useEffect(() => { inventoryService.list({ per_page: 100 }).then((response) => setProducts(response.data.products)).catch(() => {}) }, [])

  const submitSale = async (event) => {
    event.preventDefault()
    try {
      const payload = { ...form, product_id: Number(form.product_id), quantity_sold: Number(form.quantity_sold) }
      if (editingSale) await salesService.update(editingSale.sales_id, { sale_date: payload.sale_date, quantity_sold: payload.quantity_sold })
      else await salesService.create(payload)
      setIsFormOpen(false); setEditingSale(null); setForm(emptySale); loadSales()
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save sale.') }
  }

  const deleteSale = async (sale) => {
    if (!window.confirm('Delete this sale record?')) return
    try { await salesService.remove(sale.sales_id); loadSales() } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete sale.') }
  }

  const productName = (id) => products.find((product) => product.product_id === id)?.product_name || `Product #${id}`
  const rows = sales.map((sale) => [sale.sales_id, productName(sale.product_id), sale.sale_date, sale.quantity_sold, <div key={sale.sales_id} className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => { setEditingSale(sale); setForm({ ...sale, product_id: String(sale.product_id) }); setIsFormOpen(true) }}><Edit2 className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => deleteSale(sale)}><Trash2 className="h-3.5 w-3.5 text-[#EF4444]" /></Button></div>])

  return <div className="space-y-8 animate-fade-in">
    <Header title="Sales History" description="Record and review product-level sales." badge="Live API" actions={<Button variant="primary" size="sm" onClick={() => { setEditingSale(null); setForm(emptySale); setIsFormOpen(true) }}><Plus className="h-3.5 w-3.5" /> Record Sale</Button>} />
    <div className="grid gap-3 sm:grid-cols-3"><select value={productId} onChange={(event) => { setPage(1); setProductId(event.target.value) }} className="rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm"><option value="">All products</option>{products.map((product) => <option key={product.product_id} value={product.product_id}>{product.product_name}</option>)}</select><Input type="date" value={startDate} onChange={(event) => { setPage(1); setStartDate(event.target.value) }} /><Input type="date" value={endDate} onChange={(event) => { setPage(1); setEndDate(event.target.value) }} /></div>
    {loading ? <LoadingSpinner label="Loading sales..." /> : error ? <ErrorState description={error} onRetry={loadSales} /> : sales.length === 0 ? <EmptyState title="No sales found" description="Record a sale against one of your products." /> : <Card title="Sales records"><Table columns={['Sale ID', 'Product', 'Sale date', 'Quantity', 'Actions']} rows={rows} /></Card>}
    {meta ? <div className="flex justify-between text-xs text-[#94A3B8]"><span>Page {meta.page} of {meta.total_pages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= meta.total_pages} onClick={() => setPage(page + 1)}>Next</Button></div></div> : null}
    <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingSale ? 'Update Sale' : 'Record Sale'}><form className="space-y-4" onSubmit={submitSale}>{!editingSale ? <select required value={form.product_id} onChange={(event) => setForm({ ...form, product_id: event.target.value })} className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm"><option value="">Select product</option>{products.map((product) => <option key={product.product_id} value={product.product_id}>{product.product_name}</option>)}</select> : <p className="text-sm text-[#94A3B8]">{productName(editingSale.product_id)}</p>}<Input label="Sale date" type="date" value={form.sale_date} onChange={(event) => setForm({ ...form, sale_date: event.target.value })} required /><Input label="Quantity sold" type="number" min="1" value={form.quantity_sold} onChange={(event) => setForm({ ...form, quantity_sold: event.target.value })} required /><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setIsFormOpen(false)}>Cancel</Button><Button type="submit" variant="primary">Save Sale</Button></div></form></Modal>
  </div>
}

export default Sales
