import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function StatCard({ title, value, icon: Icon, trend }) {
  const isPositive = trend ? trend.value >= 0 : true

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        {Icon ? (
          <span className="rounded-lg bg-brand-50 p-2 text-brand-600">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <p className="font-display text-2xl font-bold text-slate-900">{value}</p>
      {trend ? (
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
            )}
          >
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend.value)}%
          </span>
          <span>vs last period</span>
        </p>
      ) : null}
    </div>
  )
}

export default StatCard
