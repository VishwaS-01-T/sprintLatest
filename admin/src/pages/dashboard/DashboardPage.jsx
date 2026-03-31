import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Star,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts'
import PageHeader from '@/components/shared/PageHeader'
import StatCard from '@/components/shared/StatCard'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import StatusBadge from '@/components/shared/StatusBadge'
import { useDashboard, useLowInventoryAlerts } from '@/hooks/useDashboard'
import { formatCurrency, formatDateTime } from '@/lib/utils'

function DashboardPage() {
  const { data, isLoading, isError } = useDashboard()
  const { data: alertsData } = useLowInventoryAlerts()

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard..." />
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        Failed to load dashboard analytics.
      </div>
    )
  }

  const salesTrend = data.sales?.dailyBreakdown || []
  const topProducts = data.topProducts || []
  const lowInventory = alertsData?.lowStock || data.lowInventory || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Dashboard"
        description="Track revenue, orders, and inventory health in real time."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Sales Today" value={formatCurrency(data.salesToday)} icon={DollarSign} trend={{ value: 11.4 }} />
        <StatCard title="Orders Today" value={data.ordersToday || 0} icon={ShoppingBag} trend={{ value: 7.2 }} />
        <StatCard title="Active Customers" value={data.totalUsers || 0} icon={Users} trend={{ value: 4.8 }} />
        <StatCard title="Active Products" value={data.totalProducts || 0} icon={Package} trend={{ value: 3.1 }} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-900">Sales Trend</h2>
            <p className="text-xs text-slate-500">Last 30 days</p>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#1976d2"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-900">Top Products</h2>
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts.map((item) => ({
                  name: item.product?.name?.slice(0, 12) || 'Unknown',
                  revenue: Number(item.totalRevenue || 0),
                }))}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0f9d6e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-900">Low Stock Alerts</h2>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="space-y-2">
            {lowInventory.length ? (
              lowInventory.slice(0, 8).map((item) => (
                <div key={item.variantId} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{item.productName || item.variant?.product?.name}</p>
                    <p className="text-xs text-slate-500">SKU: {item.sku || item.variant?.sku}</p>
                  </div>
                  <StatusBadge status={Number(item.availableStock) <= 0 ? 'CANCELLED' : 'PENDING'} />
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No stock alerts right now.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-900">Top Sellers Snapshot</h2>
            <p className="text-xs text-slate-500">Revenue ranking</p>
          </div>

          <div className="space-y-2">
            {topProducts.length ? (
              topProducts.slice(0, 8).map((item, index) => (
                <div key={item.product?.id || index} className="rounded-xl border border-slate-100 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-slate-500">Qty Sold: {item.totalQuantity || 0}</p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-700">{formatCurrency(item.totalRevenue)}</p>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">Updated: {formatDateTime(new Date())}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No top products data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
