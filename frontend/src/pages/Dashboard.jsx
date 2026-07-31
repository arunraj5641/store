import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Table from '../components/ui/Table'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import inventoryService from '../services/inventory'
import salesService from '../services/sales'
import { fetchAllPages } from '../services/api/pagination'

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [recentSales, setRecentSales] = useState([])
  const [todaySales, setTodaySales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const today = new Date().toISOString().slice(0, 10)
      const [allProducts, recentSalesResponse, todaySalesRecords] = await Promise.all([
        fetchAllPages(inventoryService.list, 'products'),
        salesService.list({ page: 1, per_page: 20 }),
        fetchAllPages(salesService.list, 'sales_histories', {
          start_date: today,
          end_date: today,
        }),
      ])

      setProducts(allProducts)
      setRecentSales(recentSalesResponse.data.sales_histories || [])
      setTodaySales(todaySalesRecords)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const productName = (id) => products.find((product) => product.product_id === id)?.product_name || `Product #${id}`
  const lowStock = products.filter((product) => product.current_stock <= product.reorder_threshold)
  const salesToday = useMemo(
    () => todaySales.reduce((total, sale) => total + sale.quantity_sold, 0),
    [todaySales],
  )
  const rows = recentSales.map((sale) => [
    sale.sales_id,
    productName(sale.product_id),
    sale.sale_date,
    sale.quantity_sold,
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="Store Command Center"
        description="Live inventory and sales data from your store."
        badge="Live API"
      />

      {loading ? (
        <LoadingSpinner label="Loading dashboard..." />
      ) : error ? (
        <ErrorState description={error} onRetry={load} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card hoverEffect>
              <p className="text-xs uppercase text-[#94A3B8]">Products</p>
              <h2 className="mt-2 text-2xl font-bold">{products.length}</h2>
            </Card>
            <Card hoverEffect>
              <p className="text-xs uppercase text-[#94A3B8]">Units sold today</p>
              <h2 className="mt-2 text-2xl font-bold text-[#00D9FF]">{salesToday}</h2>
            </Card>
            <Card hoverEffect>
              <p className="text-xs uppercase text-[#94A3B8]">Low-stock products</p>
              <h2 className="mt-2 text-2xl font-bold text-[#F59E0B]">{lowStock.length}</h2>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card title="Recent sales">
              <Table
                columns={['Sale ID', 'Product', 'Date', 'Quantity']}
                rows={rows}
                emptyMessage="No sales recorded yet."
              />
            </Card>
            <Card title="Low-stock alerts">
              {lowStock.length ? (
                <div className="space-y-3">
                  {lowStock.map((product) => (
                    <div
                      key={product.product_id}
                      className="flex justify-between gap-3 rounded-xl border border-[#1F2937] p-3 text-sm"
                    >
                      <span>{product.product_name}</span>
                      <Badge tone="warning">
                        {product.current_stock} / reorder {product.reorder_threshold}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={AlertTriangle}
                  title="No low-stock alerts"
                  description="All product stock levels are above their thresholds."
                />
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
