import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '@/components/shared/PageHeader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import StatusBadge from '@/components/shared/StatusBadge'
import { useOrder, useOrderTimeline, useUpdateOrderStatus } from '@/hooks/useOrders'
import { orderStatuses } from '@/lib/constants/orderStatus'
import { formatCurrency, formatDateTime } from '@/lib/utils'

function OrderDetailPage() {
  const { orderId } = useParams()
  const { data: order, isLoading, isError } = useOrder(orderId)
  const { data: timeline } = useOrderTimeline(orderId)
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateOrderStatus()

  const parsedAddress = useMemo(() => {
    const value = order?.addresses?.shippingAddress
    if (!value) return null
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }, [order?.addresses?.shippingAddress])

  if (isLoading) {
    return <LoadingSpinner label="Loading order details..." />
  }

  if (isError || !order) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        Failed to load order.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed ${formatDateTime(order.placedAt)} by ${order.customer?.email}`}
        actions={
          <select
            value={order.orderStatus}
            disabled={isUpdatingStatus}
            onChange={(event) => updateStatus({ orderId: order.id, status: event.target.value })}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">Order Summary</h2>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-slate-500">Order Status</p>
                <StatusBadge status={order.orderStatus} />
              </div>
              <div>
                <p className="text-slate-500">Payment Status</p>
                <StatusBadge status={order.paymentStatus} />
              </div>
              <div>
                <p className="text-slate-500">Fulfillment</p>
                <StatusBadge status={order.fulfillmentStatus} />
              </div>
              <div>
                <p className="text-slate-500">Total Amount</p>
                <p className="font-semibold text-slate-900">{formatCurrency(order.totalAmount)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">Ordered Items</h2>
            <div className="mt-4 space-y-2">
              {order.items?.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-100 p-3 text-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{item.productNameSnapshot}</p>
                      <p className="text-xs text-slate-500">
                        Size {item.size} • {item.color} • Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">{formatCurrency(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">Timeline</h2>
            <div className="mt-4 space-y-2 text-sm">
              {timeline?.timeline?.length ? (
                timeline.timeline.map((entry, index) => (
                  <div key={`${entry.event}-${index}`} className="rounded-xl border border-slate-100 px-3 py-2">
                    <p className="font-semibold text-slate-800">{entry.event.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(entry.at)}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No timeline events available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">Customer</h2>
            <div className="mt-3 space-y-1 text-sm text-slate-700">
              <p className="font-medium">
                {order.customer?.firstName} {order.customer?.lastName}
              </p>
              <p>{order.customer?.email}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">Shipping Address</h2>
            {parsedAddress ? (
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p className="font-medium">{parsedAddress.fullName}</p>
                <p>{parsedAddress.phone}</p>
                <p>{parsedAddress.addressLine1}</p>
                {parsedAddress.addressLine2 ? <p>{parsedAddress.addressLine2}</p> : null}
                <p>
                  {parsedAddress.city}, {parsedAddress.state} {parsedAddress.postalCode}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No address snapshot available.</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-slate-900">Billing</h2>
            <div className="mt-3 space-y-1 text-sm text-slate-700">
              <p>Subtotal: {formatCurrency(order.subtotal)}</p>
              <p>Tax: {formatCurrency(order.taxAmount)}</p>
              <p>Shipping: {formatCurrency(order.shippingCost)}</p>
              <p>Discount: {formatCurrency(order.discountAmount)}</p>
              <p className="font-semibold text-slate-900">Total: {formatCurrency(order.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
