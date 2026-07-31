import { useState } from 'react'
import { BarChart3, TrendingUp, DollarSign, Calendar, ArrowUpRight, Award, AlertCircle } from 'lucide-react'
import Header from '../components/common/Header'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import { BarChart, AreaChart, DonutChart } from '../components/ui/Chart'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30D')

  // Revenue Chart Data
  const monthlyRevenueData = [
    { label: 'Jan', value: 124000, formattedValue: '₹1,24,000' },
    { label: 'Feb', value: 142000, formattedValue: '₹1,42,000' },
    { label: 'Mar', value: 158000, formattedValue: '₹1,58,000' },
    { label: 'Apr', value: 135000, formattedValue: '₹1,35,000' },
    { label: 'May', value: 172000, formattedValue: '₹1,72,000' },
    { label: 'Jun', value: 184250, formattedValue: '₹1,84,250' },
  ]

  // Category Donut Data
  const categoryDonutData = [
    { label: 'Staples & Grains', value: 42, formattedValue: '42%' },
    { label: 'Dairy', value: 28, formattedValue: '28%' },
    { label: 'Beverages', value: 16, formattedValue: '16%' },
    { label: 'Personal Care', value: 14, formattedValue: '14%' },
  ]

  // Top Products Table
  const topProductsColumns = ['Rank', 'Product Name', 'Category', 'Units Sold', 'Margin Rate', 'Total Revenue']
  const topProductsRows = [
    [<Badge key="r1" tone="primary">#1</Badge>, 'Aashirvaad Atta 5kg', 'Staples', '248 bags', '14.3%', <span key="v1" className="font-bold text-[#00D9FF]">₹60,760</span>],
    [<Badge key="r2" tone="neutral">#2</Badge>, 'Fortune Sunflower Oil 1L', 'Staples', '312 pouches', '14.8%', <span key="v2" className="font-bold text-[#00D9FF]">₹42,120</span>],
    [<Badge key="r3" tone="neutral">#3</Badge>, 'Amul Butter 500g', 'Dairy', '142 packs', '12.7%', <span key="v3" className="font-bold text-[#00D9FF]">₹39,050</span>],
    [<Badge key="r4" tone="neutral">#4</Badge>, 'Tata Tea Gold 500g', 'Beverages', '98 packs', '12.1%', <span key="v4" className="font-bold text-[#00D9FF]">₹32,340</span>],
  ]

  // Top Customers Table
  const topCustomersColumns = ['Rank', 'Customer Name', 'Store Visits', 'Udhar Status', 'Total Lifetime Spend']
  const topCustomersRows = [
    [<Badge key="c1" tone="success">VIP #1</Badge>, 'Vikram Singh', '45 visits', <Badge key="s1" tone="warning">Udhar Due</Badge>, <span key="t1" className="font-bold text-[#F8FAFC]">₹24,500</span>],
    [<Badge key="c2" tone="success">VIP #2</Badge>, 'Ramesh Patel', '32 visits', <Badge key="s2" tone="warning">Udhar Due</Badge>, <span key="t2" className="font-bold text-[#F8FAFC]">₹18,450</span>],
    [<Badge key="c3" tone="success">VIP #3</Badge>, 'Priya Sundaram', '18 visits', <Badge key="s3" tone="success">Clear</Badge>, <span key="t3" className="font-bold text-[#F8FAFC]">₹9,800</span>],
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="Store Analytics & Intelligence"
        description="Comprehensive sales trends, category performance, profit margins, and dead stock analytics."
        badge="Analytics Engine"
        actions={
          <div className="flex items-center gap-1 rounded-xl border border-[#1F2937] bg-[#030712] p-1">
            {['7D', '30D', '6M'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  timeRange === range
                    ? 'bg-[#00D9FF] text-[#030712]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Monthly Revenue</p>
          <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC]">₹1,84,250</h2>
          <Badge tone="success" className="mt-2">+12.5% vs May</Badge>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Average Gross Margin</p>
          <h2 className="mt-2 text-2xl font-bold text-[#00D9FF]">14.2%</h2>
          <p className="text-[11px] text-[#94A3B8] mt-1">Optimal margin rate</p>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Customer Retention</p>
          <h2 className="mt-2 text-2xl font-bold text-[#10B981]">82% Repeat</h2>
          <p className="text-[11px] text-[#94A3B8] mt-1">High neighborhood loyalty</p>
        </Card>
        <Card hoverEffect>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Dead Stock Risk</p>
          <h2 className="mt-2 text-2xl font-bold text-[#F59E0B]">14 SKUs</h2>
          <p className="text-[11px] text-[#94A3B8] mt-1">No movement in 30 days</p>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <Card title="Monthly Sales & Revenue Growth" subtitle="Historical gross revenue over the past 6 months.">
          <AreaChart data={monthlyRevenueData} height={230} />
        </Card>

        <Card title="Category Sales Distribution" subtitle="Percentage contribution by item category.">
          <DonutChart data={categoryDonutData} />
        </Card>
      </div>

      {/* Top Rankings Tables */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card title="Top Best-Selling Products" subtitle="Highest revenue generating items.">
          <Table columns={topProductsColumns} rows={topProductsRows} />
        </Card>

        <Card title="Highest Value Store Customers" subtitle="Rankings by lifetime store purchasing.">
          <Table columns={topCustomersColumns} rows={topCustomersRows} />
        </Card>
      </div>
    </div>
  )
}

export default Analytics

