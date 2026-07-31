import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  Lightbulb,
  Package,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import apiClient from '../services/api/client'
import inventoryService from '../services/inventory'
import salesService from '../services/sales'
import { fetchAllPages } from '../services/api/pagination'
import { PROTECTED_ROUTES } from '../constants/routes'

const numberFormatter = new Intl.NumberFormat('en-IN')
const compactNumberFormatter = new Intl.NumberFormat('en-IN', { notation: 'compact' })

const unwrap = (response) => response.data

const listRecommendations = async (params) => unwrap(await apiClient.get('/v1/recommendations', { params }))
const listFestivals = async (params) => unwrap(await apiClient.get('/v1/festivals', { params }))
const listNotifications = async (params) => unwrap(await apiClient.get('/v1/notifications', { params }))

const dateKey = (date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addDays = (date, days) => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

const formatDate = (value) => {
  if (!value) return 'Not set'
  return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

const formatDateTime = (value) => {
  if (!value) return 'Not set'
  return new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date(value))
}

const priorityTone = (priority) => {
  if (priority === 'urgent') return 'danger'
  if (priority === 'high') return 'warning'
  if (priority === 'medium') return 'primary'
  return 'neutral'
}

const KpiCard = ({ icon: Icon, label, value, detail, tone = 'primary' }) => {
  const toneClasses = {
    primary: 'border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF]',
    warning: 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]',
    success: 'border-[#22C55E]/30 bg-[#22C55E]/10 text-[#22C55E]',
    danger: 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]',
    neutral: 'border-[#94A3B8]/30 bg-[#94A3B8]/10 text-[#94A3B8]',
  }

  return (
    <Card hoverEffect className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase text-[#94A3B8]">{label}</p>
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

const SalesTrendChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1)
  const width = 640
  const height = 188
  const paddingX = 24
  const paddingTop = 14
  const paddingBottom = 34
  const chartHeight = height - paddingTop - paddingBottom

  const points = data.map((item, index) => {
    const x = paddingX + (index / Math.max(data.length - 1, 1)) * (width - paddingX * 2)
    const y = paddingTop + (1 - item.value / maxValue) * chartHeight
    return { ...item, x, y }
  })

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const areaPath = `${linePath} L ${width - paddingX} ${height - paddingBottom} L ${paddingX} ${height - paddingBottom} Z`
  const labelIndexes = [0, 7, 14, 21, 29]

  return (
    <div className="h-56 w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="dashboardSalesArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((line) => (
          <line
            key={line}
            x1={paddingX}
            x2={width - paddingX}
            y1={paddingTop + chartHeight * line}
            y2={paddingTop + chartHeight * line}
            stroke="#1F2937"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill="url(#dashboardSalesArea)" />
        <path d={linePath} fill="none" stroke="#00D9FF" strokeLinecap="round" strokeWidth="3" />
        {points.map((point, index) => (
          <circle key={point.date} cx={point.x} cy={point.y} r={index % 5 === 0 ? 4 : 2.5} fill="#030712" stroke="#00D9FF" strokeWidth="2" />
        ))}
        {labelIndexes.map((index) => {
          const point = points[index]
          if (!point) return null
          return (
            <text key={point.date} x={point.x} y={height - 8} textAnchor="middle" className="fill-[#94A3B8] text-[10px]">
              {point.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

const TopProductsChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const width = Math.max((item.value / maxValue) * 100, 7)

        return (
          <div key={item.product_id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs">
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="truncate font-medium text-[#F8FAFC]">{index + 1}. {item.label}</span>
                <span className="shrink-0 font-semibold text-[#00D9FF]">{numberFormatter.format(item.value)}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#030712]">
                <div className="h-full rounded-full bg-[#00D9FF]" style={{ width: `${width}%` }} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const LowStockAlerts = ({ products }) => (
  products.length ? (
    <div className="max-h-80 space-y-3 overflow-auto pr-1">
      {products.map((product) => (
        <div
          key={product.product_id}
          className="flex items-start justify-between gap-3 rounded-xl border border-[#1F2937] bg-[#030712]/40 p-3 text-sm"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-[#F8FAFC]">{product.product_name}</p>
            <p className="mt-1 text-[11px] text-[#94A3B8]">{product.category}</p>
          </div>
          <Badge tone="warning" className="shrink-0">
            {numberFormatter.format(product.current_stock)} / reorder {numberFormatter.format(product.reorder_threshold)}
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
  )
)

const RecentSalesSummary = ({ rows }) => (
  <div className="overflow-hidden rounded-xl border border-[#1F2937] bg-[#111827]/70">
    <table className="w-full border-collapse text-left text-xs text-[#F8FAFC]">
      <thead>
        <tr className="border-b border-[#1F2937] bg-[#030712]/50 font-semibold uppercase tracking-wider text-[#94A3B8]">
          {['Sale ID', 'Product', 'Date', 'Quantity'].map((column) => (
            <th key={column} className="whitespace-nowrap px-3 py-2.5">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#1F2937]/70">
        {rows.length ? (
          rows.map((row) => (
            <tr key={row.id} className="transition-colors duration-150 hover:bg-[#1F2937]/40">
              <td className="whitespace-nowrap px-3 py-2.5 font-medium text-[#F8FAFC]">{row.id}</td>
              <td className="max-w-48 truncate px-3 py-2.5 text-[#94A3B8]">{row.product}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[#94A3B8]">{row.date}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[#94A3B8]">{row.quantity}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="px-3 py-6 text-center text-[#94A3B8]">
              No sales recorded yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

const ActivityList = ({ icon: Icon, title, items, emptyMessage }) => (
  <div className="min-w-0">
    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
      <Icon className="h-4 w-4 text-[#00D9FF]" />
      <span>{title}</span>
    </div>
    {items.length ? (
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-[#1F2937] bg-[#030712]/40 p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="line-clamp-2 text-xs font-medium text-[#F8FAFC]">{item.title}</p>
              {item.badge ? <Badge tone={item.badgeTone || 'neutral'}>{item.badge}</Badge> : null}
            </div>
            {item.detail ? <p className="mt-1 text-[11px] text-[#94A3B8]">{item.detail}</p> : null}
          </div>
        ))}
      </div>
    ) : (
      <p className="rounded-xl border border-dashed border-[#1F2937] bg-[#030712]/30 p-4 text-xs text-[#94A3B8]">
        {emptyMessage}
      </p>
    )}
  </div>
)

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [salesLast30Days, setSalesLast30Days] = useState([])
  const [recentSales, setRecentSales] = useState([])
  const [recentRecommendations, setRecentRecommendations] = useState([])
  const [recentNotifications, setRecentNotifications] = useState([])
  const [highPriorityCount, setHighPriorityCount] = useState(0)
  const [upcomingFestivalCount, setUpcomingFestivalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const today = new Date()
      const startDate = dateKey(addDays(today, -29))
      const endDate = dateKey(today)

      const [
        allProducts,
        salesRecords,
        recentSalesResponse,
        highPriorityResponse,
        upcomingFestivalsResponse,
        recentRecommendationsResponse,
        notificationsResponse,
      ] = await Promise.all([
        fetchAllPages(inventoryService.list, 'products'),
        fetchAllPages(salesService.list, 'sales_histories', { start_date: startDate, end_date: endDate }),
        salesService.list({ page: 1, per_page: 5 }),
        listRecommendations({ page: 1, per_page: 1, priority: 'high' }),
        listFestivals({ page: 1, per_page: 1 }),
        listRecommendations({ page: 1, per_page: 5 }),
        listNotifications({ page: 1, per_page: 5 }),
      ])

      setProducts(allProducts)
      setSalesLast30Days(salesRecords)
      setRecentSales(recentSalesResponse.data?.sales_histories || [])
      setHighPriorityCount(highPriorityResponse.meta?.total || 0)
      setUpcomingFestivalCount(upcomingFestivalsResponse.meta?.total || 0)
      setRecentRecommendations(recentRecommendationsResponse.data?.recommendations || [])
      setRecentNotifications(notificationsResponse?.data?.notifications || [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const productName = useCallback(
    (id) => products.find((product) => product.product_id === id)?.product_name || `Product #${id}`,
    [products],
  )

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.current_stock <= product.reorder_threshold),
    [products],
  )

  const salesTotalLast30Days = useMemo(
    () => salesLast30Days.reduce((total, sale) => total + sale.quantity_sold, 0),
    [salesLast30Days],
  )

  const salesToday = useMemo(() => {
    const today = dateKey(new Date())
    return salesLast30Days.reduce(
      (total, sale) => total + (sale.sale_date === today ? sale.quantity_sold : 0),
      0,
    )
  }, [salesLast30Days])

  const salesTrend = useMemo(() => {
    const today = new Date()
    const totalsByDate = salesLast30Days.reduce((totals, sale) => {
      totals[sale.sale_date] = (totals[sale.sale_date] || 0) + sale.quantity_sold
      return totals
    }, {})

    return Array.from({ length: 30 }, (_, index) => {
      const date = addDays(today, index - 29)
      const key = dateKey(date)

      return {
        date: key,
        label: formatDate(key),
        value: totalsByDate[key] || 0,
      }
    })
  }, [salesLast30Days])

  const topSellingProducts = useMemo(() => {
    const totalsByProduct = salesLast30Days.reduce((totals, sale) => {
      totals[sale.product_id] = (totals[sale.product_id] || 0) + sale.quantity_sold
      return totals
    }, {})

    return Object.entries(totalsByProduct)
      .map(([productId, value]) => ({
        product_id: Number(productId),
        label: productName(Number(productId)),
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [productName, salesLast30Days])

  const latestRecommendation = recentRecommendations[0]

  const salesActivity = recentSales.slice(0, 5).map((sale) => ({
    id: `sale-${sale.sales_id}`,
    title: productName(sale.product_id),
    detail: `${numberFormatter.format(sale.quantity_sold)} units on ${formatDate(sale.sale_date)}`,
  }))

  const recommendationActivity = recentRecommendations.map((recommendation) => ({
    id: `recommendation-${recommendation.recommendation_id}`,
    title: productName(recommendation.product_id),
    detail: `${numberFormatter.format(recommendation.recommended_quantity)} units recommended`,
    badge: recommendation.priority,
    badgeTone: priorityTone(recommendation.priority),
  }))

  const notificationActivity = recentNotifications.map((notification) => ({
    id: `notification-${notification.notification_id}`,
    title: notification.message,
    detail: formatDateTime(notification.created_at),
    badge: notification.is_read ? 'Read' : 'Unread',
    badgeTone: notification.is_read ? 'neutral' : 'primary',
  }))

  const recentSalesRows = recentSales.map((sale) => ({
    id: sale.sales_id,
    product: productName(sale.product_id),
    date: formatDate(sale.sale_date),
    quantity: numberFormatter.format(sale.quantity_sold),
  }))

  const hasSalesChartData = salesTotalLast30Days > 0
  const hasTopProducts = topSellingProducts.length > 0

  return (
    <div className="space-y-5 animate-fade-in">
      <Header
        title="Store Dashboard"
        description="Live inventory, sales, recommendations, and activity from your store."
        badge="Live API"
      />

      {loading ? (
        <LoadingSpinner label="Loading dashboard..." />
      ) : error ? (
        <ErrorState description={error} onRetry={load} />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
            <KpiCard icon={Package} label="Total Products" value={numberFormatter.format(products.length)} detail="Active catalog" />
            <KpiCard icon={ShoppingCart} label="Units Sold Today" value={numberFormatter.format(salesToday)} detail="From today's sales records" tone="success" />
            <KpiCard icon={AlertTriangle} label="Low Stock Products" value={numberFormatter.format(lowStockProducts.length)} detail="At or below threshold" tone="warning" />
            <KpiCard icon={ShoppingCart} label="Sales (Last 30 Days)" value={numberFormatter.format(salesTotalLast30Days)} detail="Units sold" tone="success" />
            <KpiCard icon={Sparkles} label="High Priority Recommendations" value={numberFormatter.format(highPriorityCount)} detail="Needs attention" tone="danger" />
            <KpiCard icon={CalendarDays} label="Upcoming Festivals" value={numberFormatter.format(upcomingFestivalCount)} detail="From calendar" tone="neutral" />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
            <Card
              title="Sales Trend"
              subtitle={`${compactNumberFormatter.format(salesTotalLast30Days)} units across the last 30 days`}
              className="p-5"
            >
              {hasSalesChartData ? (
                <SalesTrendChart data={salesTrend} />
              ) : (
                <EmptyState
                  icon={TrendingUp}
                  title="No sales in the last 30 days"
                  description="Sales trend will appear after sales records are added."
                />
              )}
            </Card>

            <Card title="Top 5 Selling Products" subtitle="Last 30 days by units sold" className="p-5">
              {hasTopProducts ? (
                <TopProductsChart data={topSellingProducts} />
              ) : (
                <EmptyState
                  icon={TrendingDown}
                  title="No product sales yet"
                  description="Top selling products will appear after sales records are added."
                />
              )}
            </Card>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Card
              title="Recent Sales"
              subtitle="Latest 5 sales records"
              className="p-4"
              action={
                <Link
                  to={PROTECTED_ROUTES.sales}
                  className="inline-flex items-center rounded-lg border border-[#1F2937] px-3 py-1.5 text-xs font-semibold text-[#00D9FF] transition-colors hover:border-[#00D9FF]/40 hover:bg-[#00D9FF]/10"
                >
                  View All
                </Link>
              }
            >
              <RecentSalesSummary rows={recentSalesRows} />
            </Card>

            <Card title="Low-stock Alerts" subtitle="Products at or below reorder threshold" className="p-5">
              <LowStockAlerts products={lowStockProducts} />
            </Card>
          </div>

          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.8fr]">
            <Card title="Quick AI Insights" subtitle="Latest recommendation summary" className="p-5">
              {latestRecommendation ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF]">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#F8FAFC]">{productName(latestRecommendation.product_id)}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#94A3B8]">
                        Reorder {numberFormatter.format(latestRecommendation.recommended_quantity)} units. Priority is {latestRecommendation.priority}; current status is {latestRecommendation.status}.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={priorityTone(latestRecommendation.priority)}>{latestRecommendation.priority}</Badge>
                    <Badge tone="neutral">{latestRecommendation.status}</Badge>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={Sparkles}
                  title="No recommendation available"
                  description="AI insights will appear after a recommendation exists."
                />
              )}
            </Card>

            <Card title="Recent Activity" subtitle="Latest records from store operations" className="p-5">
              <div className="grid gap-5 lg:grid-cols-3">
                <ActivityList
                  icon={ShoppingCart}
                  title="Latest Sales"
                  items={salesActivity}
                  emptyMessage="No sales recorded yet."
                />
                <ActivityList
                  icon={Sparkles}
                  title="Latest Recommendations"
                  items={recommendationActivity}
                  emptyMessage="No recommendations yet."
                />
                <ActivityList
                  icon={Bell}
                  title="Latest Notifications"
                  items={notificationActivity}
                  emptyMessage="No notifications available."
                />
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
