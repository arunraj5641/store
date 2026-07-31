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
import { fetchAllPages } from '../services/api/pagination'

const emptySale = () => ({ product_id: '', sale_date: new Date().toISOString().slice(0, 10), quantity_sold: '' })

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
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [form, setForm] = useState(emptySale)
  const [editingSale, setEditingSale] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingSaleId, setDeletingSaleId] = useState(null)

  const loadSales = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const response = await salesService.list({ page, per_page: 20, product_id: productId || undefined, start_date: startDate || undefined, end_date: endDate || undefined })
      if (response.meta?.total_pages > 0 && page > response.meta.total_pages) {
        setPage(response.meta.total_pages)
        return
      }

      setSales(response.data.sales_histories || []); setMeta(response.meta)
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load sales.') } finally { setLoading(false) }
  }, [page, productId, startDate, endDate])

  useEffect(() => { loadSales() }, [loadSales])
  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      setProductsLoading(true)
      setProductsError('')
      try {
        const allProducts = await fetchAllPages(inventoryService.list, 'products')
        if (isMounted) setProducts(allProducts)
      } catch (requestError) {
        if (isMounted) setProductsError(requestError.response?.data?.message || 'Unable to load products for sales.')
      } finally {
        if (isMounted) setProductsLoading(false)
      }
    }

    loadProducts()
    return () => { isMounted = false }
  }, [])

  const saleForm = (sale) => ({
    product_id: String(sale.product_id),
    sale_date: sale.sale_date,
    quantity_sold: String(sale.quantity_sold),
  })

  const resetFilters = () => {
    setPage(1)
    setProductId('')
    setStartDate('')
    setEndDate('')
  }

  const openCreateForm = () => {
    setEditingSale(null)
    setForm(emptySale())
    setIsFormOpen(true)
  }

  const submitSale = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    try {
      const payload = { ...form, product_id: Number(form.product_id), quantity_sold: Number(form.quantity_sold) }
      if (editingSale) await salesService.update(editingSale.sales_id, { sale_date: payload.sale_date, quantity_sold: payload.quantity_sold })
      else await salesService.create(payload)
      setIsFormOpen(false); setEditingSale(null); setForm(emptySale())
      if (!editingSale && page !== 1) setPage(1)
      else await loadSales()
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save sale.') } finally { setIsSaving(false) }
  }

  const deleteSale = async (sale) => {
    if (!window.confirm('Delete this sale record?')) return
    setDeletingSaleId(sale.sales_id)
    setError('')
    try { await salesService.remove(sale.sales_id); await loadSales() } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete sale.') } finally { setDeletingSaleId(null) }
  }

  const hasActiveFilters = Boolean(productId || startDate || endDate)
  const showPagination = meta && meta.total_pages > 1
  const canCreateSale = products.length > 0 && !productsLoading
  const productName = (id) => products.find((product) => product.product_id === id)?.product_name || `Product #${id}`
  const rows = sales.map((sale) => [sale.sales_id, productName(sale.product_id), sale.sale_date, sale.quantity_sold, <div key={sale.sales_id} className="flex gap-1"><Button variant="ghost" size="sm" disabled={deletingSaleId === sale.sales_id} onClick={() => { setEditingSale(sale); setForm(saleForm(sale)); setIsFormOpen(true) }}><Edit2 className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" isLoading={deletingSaleId === sale.sales_id} onClick={() => deleteSale(sale)}><Trash2 className="h-3.5 w-3.5 text-[#EF4444]" /></Button></div>])

  return <div className="space-y-8 animate-fade-in">
    <Header title="Sales History" description="Record and review product-level sales." badge="Live API" actions={<Button variant="primary" size="sm" disabled={!canCreateSale} onClick={openCreateForm}><Plus className="h-3.5 w-3.5" /> Record Sale</Button>} />
    <div className="grid gap-3 xl:grid-cols-[1fr_180px_180px_auto] xl:items-center">
      <select value={productId} disabled={productsLoading} onChange={(event) => { setPage(1); setProductId(event.target.value) }} className="rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm">
        <option value="">{productsLoading ? 'Loading products...' : 'All products'}</option>
        {products.map((product) => <option key={product.product_id} value={product.product_id}>{product.product_name}</option>)}
      </select>
      <Input type="date" value={startDate} onChange={(event) => { setPage(1); setStartDate(event.target.value) }} />
      <Input type="date" value={endDate} onChange={(event) => { setPage(1); setEndDate(event.target.value) }} />
      {hasActiveFilters ? <Button variant="outline" size="sm" onClick={resetFilters}>Clear</Button> : null}
    </div>
    {productsError ? <p className="text-xs text-[#EF4444]">{productsError}</p> : null}
    {loading ? <LoadingSpinner label="Loading sales..." /> : error ? <ErrorState description={error} onRetry={loadSales} /> : sales.length === 0 ? <EmptyState title="No sales found" description={hasActiveFilters ? 'No sales match the selected product or date range.' : canCreateSale ? 'Record a sale against one of your products.' : 'Create a product before recording sales.'} action={hasActiveFilters ? <Button variant="outline" onClick={resetFilters}>Clear filters</Button> : canCreateSale ? <Button variant="primary" onClick={openCreateForm}>Record Sale</Button> : null} /> : <Card title="Sales records" subtitle={`${meta?.total || sales.length} sales`}><Table columns={['Sale ID', 'Product', 'Sale date', 'Quantity', 'Actions']} rows={rows} /></Card>}
    {showPagination ? <div className="flex justify-between text-xs text-[#94A3B8]"><span>Page {meta.page} of {meta.total_pages}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={page >= meta.total_pages} onClick={() => setPage(page + 1)}>Next</Button></div></div> : null}
    <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingSale ? 'Update Sale' : 'Record Sale'}><form className="space-y-4" onSubmit={submitSale}>{!editingSale ? <select required value={form.product_id} disabled={productsLoading} onChange={(event) => setForm({ ...form, product_id: event.target.value })} className="w-full rounded-xl border border-[#1F2937] bg-[#111827] px-3 py-2 text-sm"><option value="">Select product</option>{products.map((product) => <option key={product.product_id} value={product.product_id}>{product.product_name}</option>)}</select> : <p className="text-sm text-[#94A3B8]">{productName(editingSale.product_id)}</p>}<Input label="Sale date" type="date" value={form.sale_date} onChange={(event) => setForm({ ...form, sale_date: event.target.value })} required /><Input label="Quantity sold" type="number" min="1" value={form.quantity_sold} onChange={(event) => setForm({ ...form, quantity_sold: event.target.value })} required /><div className="flex justify-end gap-2"><Button variant="ghost" disabled={isSaving} onClick={() => setIsFormOpen(false)}>Cancel</Button><Button type="submit" variant="primary" isLoading={isSaving}>Save Sale</Button></div></form></Modal>
  </div>
}

export default Sales
