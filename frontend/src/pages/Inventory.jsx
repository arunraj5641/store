import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Boxes, PackageCheck, PackageX, PencilLine } from 'lucide-react'
import Header from '../components/common/Header'
import SearchBar from '../components/common/SearchBar'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import inventoryService from '../services/inventory'
import { fetchAllPages } from '../services/api/pagination'
import { PROTECTED_ROUTES } from '../constants/routes'

const PAGE_SIZE = 10
const numberFormatter = new Intl.NumberFormat('en-IN')

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'low', label: 'Low Stock' },
  { key: 'critical', label: 'Critical' },
  { key: 'out', label: 'Out of Stock' },
]

const stockStatus = (product) => {
  if (product.current_stock <= 0) {
    return {
      key: 'out',
      label: 'Out of Stock',
      tone: 'neutral',
      dot: 'bg-[#94A3B8]',
      text: 'text-[#94A3B8]',
      bar: 'bg-[#94A3B8]',
    }
  }

  const criticalThreshold = Math.max(1, Math.floor(product.reorder_threshold * 0.5))
  if (product.current_stock <= criticalThreshold) {
    return {
      key: 'critical',
      label: 'Critical',
      tone: 'danger',
      dot: 'bg-[#EF4444]',
      text: 'text-[#EF4444]',
      bar: 'bg-[#EF4444]',
    }
  }

  if (product.current_stock <= product.reorder_threshold) {
    return {
      key: 'low',
      label: 'Low',
      tone: 'warning',
      dot: 'bg-[#F59E0B]',
      text: 'text-[#F59E0B]',
      bar: 'bg-[#F59E0B]',
    }
  }

  return {
    key: 'good',
    label: 'Good',
    tone: 'success',
    dot: 'bg-[#10B981]',
    text: 'text-[#10B981]',
    bar: 'bg-[#10B981]',
  }
}

const stockFill = (product) => {
  if (product.current_stock <= 0) return 0
  if (product.reorder_threshold <= 0) return 100
  return Math.min((product.current_stock / Math.max(product.reorder_threshold * 2, 1)) * 100, 100)
}

const MetricCard = ({ icon: Icon, label, value, detail, tone = 'primary' }) => {
  const toneClasses = {
    primary: 'border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF]',
    success: 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]',
    warning: 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]',
    danger: 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]',
    neutral: 'border-[#94A3B8]/30 bg-[#94A3B8]/10 text-[#94A3B8]',
  }

  return (
    <Card hoverEffect className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">{label}</p>
          <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC]">{value}</h2>
          {detail ? <p className="mt-1 truncate text-xs text-[#64748B]">{detail}</p> : null}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}

const StatusIndicator = ({ product }) => {
  const status = stockStatus(product)

  return (
    <div className="min-w-40">
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
        <span className={`text-sm font-semibold ${status.text}`}>{status.label}</span>
        {status.key !== 'good' ? <Badge tone={status.tone}>Low Stock</Badge> : null}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#030712]">
        <div className={`h-full rounded-full ${status.bar}`} style={{ width: `${stockFill(product)}%` }} />
      </div>
    </div>
  )
}

const Inventory = () => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadInventory = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const allProducts = await fetchAllPages(inventoryService.list, 'products')
      setProducts(allProducts)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load inventory.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInventory()
  }, [loadInventory])

  const productsWithStatus = useMemo(
    () => products.map((product) => ({ ...product, stock_status: stockStatus(product) })),
    [products],
  )

  const summary = useMemo(() => {
    const lowStock = productsWithStatus.filter((product) => ['low', 'critical', 'out'].includes(product.stock_status.key))
    return {
      units: productsWithStatus.reduce((total, product) => total + product.current_stock, 0),
      good: productsWithStatus.filter((product) => product.stock_status.key === 'good').length,
      low: lowStock.length,
      critical: productsWithStatus.filter((product) => product.stock_status.key === 'critical').length,
      out: productsWithStatus.filter((product) => product.stock_status.key === 'out').length,
    }
  }, [productsWithStatus])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return productsWithStatus.filter((product) => {
      const matchesSearch = !query || product.product_name.toLowerCase().includes(query)
      const matchesFilter = filter === 'all' || product.stock_status.key === filter || (
        filter === 'low' && ['low', 'critical', 'out'].includes(product.stock_status.key)
      )

      return matchesSearch && matchesFilter
    })
  }, [filter, productsWithStatus, search])

  const totalPages = Math.max(Math.ceil(filteredProducts.length / PAGE_SIZE), 1)
  const pageProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasActiveFilters = Boolean(search.trim() || filter !== 'all')
  const showPagination = filteredProducts.length > PAGE_SIZE

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const resetFilters = () => {
    setSearch('')
    setFilter('all')
    setPage(1)
  }

  const rows = pageProducts.map((product) => [
    <div key={`product-${product.product_id}`} className="min-w-52">
      <p className="font-semibold text-[#F8FAFC]">{product.product_name}</p>
      <p className="mt-1 text-[11px] text-[#94A3B8]">{product.category}</p>
    </div>,
    <span key={`stock-${product.product_id}`} className="font-bold text-[#F8FAFC]">
      {numberFormatter.format(product.current_stock)}
    </span>,
    numberFormatter.format(product.reorder_threshold),
    <StatusIndicator key={`status-${product.product_id}`} product={product} />,
    <span key={`gap-${product.product_id}`} className={product.current_stock <= product.reorder_threshold ? 'font-semibold text-[#F59E0B]' : 'text-[#94A3B8]'}>
      {product.current_stock <= product.reorder_threshold
        ? `${numberFormatter.format(product.reorder_threshold - product.current_stock)} below reorder`
        : `${numberFormatter.format(product.current_stock - product.reorder_threshold)} above reorder`}
    </span>,
    <Link
      key={`edit-${product.product_id}`}
      to={PROTECTED_ROUTES.products}
      className="inline-flex items-center gap-1.5 rounded-xl border border-[#1F2937] px-3 py-1.5 text-xs font-semibold text-[#00D9FF] transition-colors hover:border-[#00D9FF]/40 hover:bg-[#00D9FF]/10"
    >
      <PencilLine className="h-3.5 w-3.5" />
      Edit in Products
    </Link>,
  ])

  return (
    <div className="space-y-5 animate-fade-in">
      <Header
        title="Inventory Control"
        description="Monitor stock levels, reorder thresholds, and replenishment risk."
        badge="Live API"
        actions={
          <Link
            to={PROTECTED_ROUTES.products}
            className="inline-flex items-center justify-center rounded-xl border border-[#1F2937] px-3 py-1.5 text-xs font-semibold text-[#F8FAFC] transition-colors hover:border-[#00D9FF]/50 hover:bg-[#00D9FF]/5 hover:text-[#00D9FF]"
          >
            Manage Products
          </Link>
        }
      />

      {loading ? (
        <LoadingSpinner label="Loading inventory..." />
      ) : error ? (
        <ErrorState description={error} onRetry={loadInventory} />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard icon={Boxes} label="Current Stock" value={numberFormatter.format(summary.units)} detail={`${numberFormatter.format(products.length)} SKUs`} />
            <MetricCard icon={PackageCheck} label="Good Stock" value={numberFormatter.format(summary.good)} detail="Above reorder level" tone="success" />
            <MetricCard icon={AlertTriangle} label="Low Stock" value={numberFormatter.format(summary.low)} detail="Needs attention" tone="warning" />
            <MetricCard icon={AlertTriangle} label="Critical" value={numberFormatter.format(summary.critical)} detail="At or below half reorder" tone="danger" />
            <MetricCard icon={PackageX} label="Out of Stock" value={numberFormatter.format(summary.out)} detail="Zero units" tone="neutral" />
          </div>

          <Card className="p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <SearchBar
                placeholder="Search product name..."
                value={search}
                onChange={(event) => { setPage(1); setSearch(event.target.value) }}
              />
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => { setPage(1); setFilter(item.key) }}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                      filter === item.key
                        ? 'border-[#00D9FF]/40 bg-[#00D9FF] text-[#030712]'
                        : 'border-[#1F2937] bg-[#111827] text-[#94A3B8] hover:border-[#374151] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                {hasActiveFilters ? <Button variant="outline" size="sm" onClick={resetFilters}>Clear</Button> : null}
              </div>
            </div>
          </Card>

          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No inventory items found"
              description={hasActiveFilters ? 'No products match the selected stock filter or search.' : 'Create products before tracking stock in inventory.'}
              action={hasActiveFilters ? <Button variant="outline" onClick={resetFilters}>Clear filters</Button> : null}
            />
          ) : (
            <Card title="Stock Levels" subtitle={`${numberFormatter.format(filteredProducts.length)} products in view`} className="p-5">
              <Table
                columns={['Product', 'Current Stock', 'Reorder Level', 'Stock Status', 'Stock Gap', 'Edit']}
                rows={rows}
              />
            </Card>
          )}

          {showPagination ? (
            <div className="flex items-center justify-between text-xs text-[#94A3B8]">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

export default Inventory
