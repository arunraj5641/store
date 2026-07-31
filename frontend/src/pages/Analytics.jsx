import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, BarChart3, Lightbulb, Package, Sparkles } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Table from '../components/ui/Table'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { AreaChart, BarChart, DonutChart } from '../components/ui/Chart'
import apiClient from '../services/api/client'
import forecastsService from '../services/forecasts'
import inventoryService from '../services/inventory'
import salesService from '../services/sales'
import { fetchAllPages } from '../services/api/pagination'

const numberFormatter = new Intl.NumberFormat('en-IN')

const RANGE_OPTIONS = [
  { label: '7D', value: '7d', days: 7, description: 'last 7 days' },
  { label: '30D', value: '30d', days: 30, description: 'last 30 days' },
  { label: '6M', value: '6m', months: 6, description: 'last 6 months' },
]

const unwrap = (response) => response.data
const listRecommendations = async (params) => unwrap(await apiClient.get('/v1/recommendations', { params }))

const dateKey = (date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const rangeDatesFor = (range) => {
  const today = new Date()
  const startDate = new Date(today)

  if (range.months) startDate.setMonth(startDate.getMonth() - range.months)
  else startDate.setDate(startDate.getDate() - range.days + 1)

  return {
    startDate: dateKey(startDate),
    endDate: dateKey(today),
  }
}

const datePart = (value) => {
  if (!value) return ''
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  return dateKey(new Date(value))
}

const isWithinRange = (value, startDate, endDate) => {
  const key = datePart(value)
  return Boolean(key && key >= startDate && key <= endDate)
}

const formatDateLabel = (value) => (
  new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(new Date(`${value}T00:00:00`))
)

const formatMonthLabel = (value) => (
  new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(new Date(`${value}-01T00:00:00`))
)

const percentOf = (value, total) => (total > 0 ? `${((value / total) * 100).toFixed(1)}%` : '0%')

const priorityTone = (priority) => {
  if (priority === 'urgent') return 'danger'
  if (priority === 'high') return 'warning'
  if (priority === 'medium') return 'primary'
  if (priority === 'low') return 'success'
  return 'neutral'
}

const MetricCard = ({ label, value, detail, tone = 'neutral' }) => (
  <Card hoverEffect>
    <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">{label}</p>
    <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC]">{value}</h2>
    {detail ? <Badge tone={tone} className="mt-2">{detail}</Badge> : null}
  </Card>
)

const SummaryTile = ({ label, value, detail }) => (
  <div className="rounded-xl border border-[#1F2937] bg-[#030712]/40 p-4">
    <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">{label}</p>
    <p className="mt-2 text-xl font-bold text-[#F8FAFC]">{value}</p>
    {detail ? <p className="mt-1 text-xs text-[#64748B]">{detail}</p> : null}
  </div>
)

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [forecasts, setForecasts] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const selectedRange = useMemo(
    () => RANGE_OPTIONS.find((range) => range.value === timeRange) || RANGE_OPTIONS[1],
    [timeRange],
  )

  const selectedDates = useMemo(() => rangeDatesFor(selectedRange), [selectedRange])

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [allProducts, rangeSales, allForecasts, allRecommendations] = await Promise.all([
        fetchAllPages(inventoryService.list, 'products'),
        fetchAllPages(salesService.list, 'sales_histories', {
          start_date: selectedDates.startDate,
          end_date: selectedDates.endDate,
        }),
        fetchAllPages(forecastsService.list, 'forecasts'),
        fetchAllPages(listRecommendations, 'recommendations'),
      ])

      setProducts(allProducts)
      setSales(rangeSales)
      setForecasts(
        allForecasts.filter((forecast) => (
          isWithinRange(forecast.forecast_date, selectedDates.startDate, selectedDates.endDate)
        )),
      )
      setRecommendations(
        allRecommendations.filter((recommendation) => (
          isWithinRange(recommendation.created_at, selectedDates.startDate, selectedDates.endDate)
        )),
      )
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load analytics.')
    } finally {
      setLoading(false)
    }
  }, [selectedDates.endDate, selectedDates.startDate])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  const productsById = useMemo(
    () => new Map(products.map((product) => [product.product_id, product])),
    [products],
  )

  const productName = useCallback(
    (id) => productsById.get(id)?.product_name || `Product #${id}`,
    [productsById],
  )

  const productCategory = useCallback(
    (id) => productsById.get(id)?.category || 'Uncategorized',
    [productsById],
  )

  const totalUnitsSold = useMemo(
    () => sales.reduce((total, sale) => total + sale.quantity_sold, 0),
    [sales],
  )

  const lowStockProducts = useMemo(
    () => products
      .filter((product) => product.current_stock <= product.reorder_threshold)
      .sort((a, b) => (a.current_stock - a.reorder_threshold) - (b.current_stock - b.reorder_threshold)),
    [products],
  )

  const salesTrendData = useMemo(() => {
    const totalsByPeriod = sales.reduce((totals, sale) => {
      const key = timeRange === '6m' ? sale.sale_date.slice(0, 7) : sale.sale_date
      totals.set(key, (totals.get(key) || 0) + sale.quantity_sold)
      return totals
    }, new Map())

    return [...totalsByPeriod.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([period, value]) => ({
        label: timeRange === '6m' ? formatMonthLabel(period) : formatDateLabel(period),
        value,
        formattedValue: `${numberFormatter.format(value)} units`,
      }))
  }, [sales, timeRange])

  const topSellingProducts = useMemo(() => {
    const totalsByProduct = sales.reduce((totals, sale) => {
      totals.set(sale.product_id, (totals.get(sale.product_id) || 0) + sale.quantity_sold)
      return totals
    }, new Map())

    return [...totalsByProduct.entries()]
      .map(([productId, units]) => ({
        product_id: productId,
        product_name: productName(productId),
        category: productCategory(productId),
        units,
      }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5)
  }, [productCategory, productName, sales])

  const categorySales = useMemo(() => {
    const totalsByCategory = sales.reduce((totals, sale) => {
      const category = productCategory(sale.product_id)
      totals.set(category, (totals.get(category) || 0) + sale.quantity_sold)
      return totals
    }, new Map())
    let accumulatedPercent = 0
    const sortedCategories = [...totalsByCategory.entries()]
      .sort(([, leftUnits], [, rightUnits]) => rightUnits - leftUnits)

    return sortedCategories.map(([category, units], index) => {
      const value = index === sortedCategories.length - 1
        ? Number((100 - accumulatedPercent).toFixed(1))
        : Number(((units / totalUnitsSold) * 100).toFixed(1))
      accumulatedPercent += value

      return {
        label: category,
        value,
        formattedValue: `${numberFormatter.format(units)} units (${percentOf(units, totalUnitsSold)})`,
        units,
      }
    })
  }, [productCategory, sales, totalUnitsSold])

  const totalForecastedDemand = useMemo(
    () => forecasts.reduce((total, forecast) => total + forecast.predicted_demand, 0),
    [forecasts],
  )

  const forecastRows = useMemo(() => {
    const totalsByProduct = forecasts.reduce((totals, forecast) => {
      const existing = totals.get(forecast.product_id) || { count: 0, demand: 0 }
      totals.set(forecast.product_id, {
        count: existing.count + 1,
        demand: existing.demand + forecast.predicted_demand,
      })
      return totals
    }, new Map())

    return [...totalsByProduct.entries()]
      .map(([productId, summary]) => ({
        product_id: productId,
        product_name: productName(productId),
        count: summary.count,
        demand: summary.demand,
      }))
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 5)
  }, [forecasts, productName])

  const recommendationPriorityRows = useMemo(() => {
    const totalsByPriority = recommendations.reduce((totals, recommendation) => {
      totals.set(recommendation.priority, (totals.get(recommendation.priority) || 0) + 1)
      return totals
    }, new Map())

    return ['urgent', 'high', 'medium', 'low']
      .map((priority) => ({ priority, total: totalsByPriority.get(priority) || 0 }))
      .filter((row) => row.total > 0)
  }, [recommendations])

  const pendingRecommendations = recommendations.filter((recommendation) => recommendation.status === 'pending').length
  const highPriorityRecommendations = recommendations.filter((recommendation) => (
    recommendation.priority === 'urgent' || recommendation.priority === 'high'
  )).length
  const uniqueProductsSold = new Set(sales.map((sale) => sale.product_id)).size
  const topProduct = topSellingProducts[0]
  const topCategory = categorySales[0]

  const insights = useMemo(() => {
    const generatedInsights = []

    if (totalUnitsSold === 0) {
      generatedInsights.push({
        tone: 'warning',
        title: 'No sales in selected range',
        detail: `No sales records were found for the ${selectedRange.description}.`,
      })
    } else if (topProduct) {
      generatedInsights.push({
        tone: 'success',
        title: `${topProduct.product_name} leads demand`,
        detail: `${numberFormatter.format(topProduct.units)} units sold in the ${selectedRange.description}.`,
      })
    }

    if (topCategory) {
      generatedInsights.push({
        tone: 'primary',
        title: `${topCategory.label} is the strongest category`,
        detail: `${topCategory.formattedValue} of selected-range sales came from this category.`,
      })
    }

    if (lowStockProducts.length > 0) {
      generatedInsights.push({
        tone: 'warning',
        title: `${numberFormatter.format(lowStockProducts.length)} low-stock products need review`,
        detail: 'Low stock is based on the current inventory snapshot.',
      })
    }

    if (totalForecastedDemand > totalUnitsSold && forecasts.length > 0) {
      generatedInsights.push({
        tone: 'primary',
        title: 'Forecasted demand is ahead of recorded sales',
        detail: `${numberFormatter.format(totalForecastedDemand)} forecasted units versus ${numberFormatter.format(totalUnitsSold)} sold units.`,
      })
    }

    if (highPriorityRecommendations > 0) {
      generatedInsights.push({
        tone: 'danger',
        title: `${numberFormatter.format(highPriorityRecommendations)} high-priority recommendations`,
        detail: 'Review urgent and high-priority recommendations for the selected range.',
      })
    }

    if (!generatedInsights.length) {
      generatedInsights.push({
        tone: 'neutral',
        title: 'No action needed from current analytics',
        detail: 'Sales, forecasts, inventory, and recommendations are quiet for this range.',
      })
    }

    return generatedInsights
  }, [
    forecasts.length,
    highPriorityRecommendations,
    lowStockProducts.length,
    selectedRange.description,
    topCategory,
    topProduct,
    totalForecastedDemand,
    totalUnitsSold,
  ])

  const topProductsRows = topSellingProducts.map((product, index) => [
    <Badge key={`rank-${product.product_id}`} tone={index === 0 ? 'primary' : 'neutral'}>#{index + 1}</Badge>,
    product.product_name,
    product.category,
    `${numberFormatter.format(product.units)} units`,
    percentOf(product.units, totalUnitsSold),
  ])

  const lowStockRows = lowStockProducts.slice(0, 5).map((product) => [
    product.product_name,
    product.category,
    numberFormatter.format(product.current_stock),
    numberFormatter.format(product.reorder_threshold),
    <Badge key={`stock-${product.product_id}`} tone="warning">Low Stock</Badge>,
  ])

  const forecastTableRows = forecastRows.map((forecast) => [
    forecast.product_name,
    numberFormatter.format(forecast.count),
    `${numberFormatter.format(forecast.demand)} units`,
  ])

  const recommendationRows = recommendationPriorityRows.map((row) => [
    <Badge key={row.priority} tone={priorityTone(row.priority)}>{row.priority}</Badge>,
    numberFormatter.format(row.total),
    percentOf(row.total, recommendations.length),
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="Store Analytics & Intelligence"
        description="Comprehensive sales trends, category performance, inventory risk, forecast demand, and recommendation analytics."
        badge="Analytics Engine"
        actions={
          <div className="flex items-center gap-1 rounded-xl border border-[#1F2937] bg-[#030712] p-1">
            {RANGE_OPTIONS.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  timeRange === range.value
                    ? 'bg-[#00D9FF] text-[#030712]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <LoadingSpinner label="Loading analytics..." />
      ) : error ? (
        <ErrorState description={error} onRetry={loadAnalytics} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <MetricCard
              label="Units Sold"
              value={numberFormatter.format(totalUnitsSold)}
              detail={selectedRange.label}
              tone="primary"
            />
            <MetricCard
              label="Products Sold"
              value={numberFormatter.format(uniqueProductsSold)}
              detail={`${numberFormatter.format(sales.length)} sale records`}
              tone="success"
            />
            <MetricCard
              label="Low Stock SKUs"
              value={numberFormatter.format(lowStockProducts.length)}
              detail="Current snapshot"
              tone={lowStockProducts.length ? 'warning' : 'success'}
            />
            <MetricCard
              label="Forecasted Demand"
              value={numberFormatter.format(totalForecastedDemand)}
              detail={`${numberFormatter.format(forecasts.length)} forecasts`}
              tone="neutral"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
            <Card title="Sales Trend" subtitle={`Recorded units sold for the ${selectedRange.description}.`}>
              {salesTrendData.length > 1 ? (
                <AreaChart data={salesTrendData} height={230} />
              ) : salesTrendData.length === 1 ? (
                <BarChart data={salesTrendData} height={230} />
              ) : (
                <EmptyState
                  icon={BarChart3}
                  title="No sales trend available"
                  description="No sales records exist for the selected range."
                />
              )}
            </Card>

            <Card title="Sales by Category" subtitle={`Category contribution for the ${selectedRange.description}.`}>
              {categorySales.length ? (
                <DonutChart data={categorySales} />
              ) : (
                <EmptyState
                  icon={Package}
                  title="No category sales"
                  description="Category distribution will appear after sales are recorded."
                />
              )}
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card title="Top Best-Selling Products" subtitle="Highest unit volume in the selected range.">
              <Table
                columns={['Rank', 'Product Name', 'Category', 'Units Sold', 'Share']}
                rows={topProductsRows}
                emptyMessage="No product sales found for this range."
              />
            </Card>

            <Card title="Low Stock Summary" subtitle="Current inventory products at or below reorder threshold.">
              <Table
                columns={['Product Name', 'Category', 'Current Stock', 'Reorder Level', 'Status']}
                rows={lowStockRows}
                emptyMessage="No products are currently below reorder threshold."
              />
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card title="Forecast Summary" subtitle={`Forecasts dated in the ${selectedRange.description}.`}>
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <SummaryTile label="Forecasts" value={numberFormatter.format(forecasts.length)} />
                <SummaryTile label="Predicted Demand" value={numberFormatter.format(totalForecastedDemand)} detail="units" />
                <SummaryTile
                  label="Average Demand"
                  value={numberFormatter.format(forecasts.length ? Math.round(totalForecastedDemand / forecasts.length) : 0)}
                  detail="units per forecast"
                />
              </div>
              <Table
                columns={['Product Name', 'Forecasts', 'Predicted Demand']}
                rows={forecastTableRows}
                emptyMessage="No forecasts found for this range."
              />
            </Card>

            <Card title="Recommendation Summary" subtitle={`Recommendations created in the ${selectedRange.description}.`}>
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <SummaryTile label="Total" value={numberFormatter.format(recommendations.length)} />
                <SummaryTile label="Pending" value={numberFormatter.format(pendingRecommendations)} />
                <SummaryTile label="High Priority" value={numberFormatter.format(highPriorityRecommendations)} />
              </div>
              <Table
                columns={['Priority', 'Count', 'Share']}
                rows={recommendationRows}
                emptyMessage="No recommendations found for this range."
              />
            </Card>
          </div>

          <Card title="AI Store Insights" subtitle={`Generated from real store data for the ${selectedRange.description}.`}>
            <div className="grid gap-3 lg:grid-cols-2">
              {insights.map((insight) => (
                <div key={insight.title} className="flex gap-3 rounded-xl border border-[#1F2937] bg-[#030712]/40 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF]">
                    {insight.tone === 'danger' ? <AlertCircle className="h-4 w-4" /> : insight.tone === 'neutral' ? <Sparkles className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#F8FAFC]">{insight.title}</p>
                      <Badge tone={insight.tone}>{insight.tone}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-[#94A3B8]">{insight.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

export default Analytics
