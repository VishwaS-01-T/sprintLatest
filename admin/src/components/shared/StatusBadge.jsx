import { cn } from '@/lib/utils'

const statusClasses = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
  ARCHIVED: 'bg-amber-50 text-amber-700 border-amber-200',
  DISCONTINUED: 'bg-rose-50 text-rose-700 border-rose-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-violet-50 text-violet-700 border-violet-200',
  SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  FAILED: 'bg-rose-50 text-rose-700 border-rose-200',
  REFUNDED: 'bg-purple-50 text-purple-700 border-purple-200',
}

function StatusBadge({ status }) {
  if (!status) return null

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold',
        statusClasses[status] || 'bg-slate-100 text-slate-700 border-slate-200',
      )}
    >
      {String(status).replace(/_/g, ' ')}
    </span>
  )
}

export default StatusBadge
