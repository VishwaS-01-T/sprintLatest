import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ordersApi } from '@/lib/api/orders'

export function useOrders(filters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.list(filters),
    staleTime: 60 * 1000,
  })
}

export function useOrder(orderId) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.get(orderId),
    enabled: Boolean(orderId),
  })
}

export function useOrderTimeline(orderId) {
  return useQuery({
    queryKey: ['order', orderId, 'timeline'],
    queryFn: () => ordersApi.timeline(orderId),
    enabled: Boolean(orderId),
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, status }) => ordersApi.updateStatus(orderId, status),
    onSuccess: (_, variables) => {
      toast.success('Order status updated')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId, 'timeline'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order status')
    },
  })
}

export function useBulkUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderIds, status }) => ordersApi.bulkUpdateStatus(orderIds, status),
    onSuccess: () => {
      toast.success('Order statuses updated')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order statuses')
    },
  })
}
