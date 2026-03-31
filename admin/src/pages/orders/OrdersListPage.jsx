import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createColumnHelper } from '@tanstack/react-table'
import { RefreshCcw } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import DataTable from '@/components/shared/DataTable'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import StatusBadge from '@/components/shared/StatusBadge'
import { useBulkUpdateOrderStatus, useOrders } from '@/hooks/useOrders'
import { orderStatuses } from '@/lib/constants/orderStatus'
import { formatCurrency, formatDateTime } from '@/lib/utils'

const columnHelper = createColumnHelper()

function OrdersListPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    status: '',
  })
  const { data, isLoading, refetch, isRefetching } = useOrders(filters)
  const { mutate: bulkUpdateStatus, isPending: isBulkPending } = useBulkUpdateOrderStatus()

  const orders = data?.orders || []

  const columns = useMemo(
    () => [
      columnHelper.accessor('orderNumber', {
        header: 'Order',
        cell: ({ row }) => (
          <div>
            <p className="font-semibold text-slate-900">{row.original.orderNumber}</p>
            <p className="text-xs text-slate-500">{formatDateTime(row.original.placedAt)}</p>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'customer',
        header: 'Customer',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-slate-800">
              {row.original.customer?.firstName} {row.original.customer?.lastName}
            </p>
            <p className="text-xs text-slate-500">{row.original.customer?.email}</p>
          </div>
        ),
      }),
      columnHelper.accessor('totalAmount', {
        header: 'Total',
        cell: (info) => <span className="font-semibold text-slate-900">{formatCurrency(info.getValue())}</span>,
      }),
      columnHelper.accessor('orderStatus', {
        header: 'Order Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('paymentStatus', {
        header: 'Payment',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor('fulfillmentStatus', {
        header: 'Fulfillment',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Link
            to={`/orders/${row.original.id}`}
            className="rounded-lg border border-brand-200 bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700"
          >
            View Details
          </Link>
        ),
      }),
    ],
    [],
  )

  if (isLoading) {
    return <LoadingSpinner label="Loading orders..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Monitor order lifecycle, payment status, and fulfillment queues."
        actions={
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            <span className="inline-flex items-center gap-1">
              <RefreshCcw className="h-4 w-4" /> Refresh
            </span>
          </button>
        }
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="text-sm text-slate-600">
            Status Filter
            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              className="ml-2 rounded-lg border border-slate-200 px-2 py-1 text-sm"
            >
              <option value="">All</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            disabled={isBulkPending || !orders.length}
            onClick={() => {
              const orderIds = orders.slice(0, 3).map((order) => order.id)
              if (orderIds.length) {
                bulkUpdateStatus({ orderIds, status: 'PROCESSING' })
              }
            }}
            className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 disabled:opacity-60"
          >
            Mark Top 3 As Processing
          </button>
        </div>

        <DataTable
          columns={columns}
          data={orders}
          searchPlaceholder="Search by order number, customer, or email"
          onSearch={(search) => setFilters((prev) => ({ ...prev, search }))}
        />
      </div>
    </div>
  )
}

export default OrdersListPage
