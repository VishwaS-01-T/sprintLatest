import apiClient from '@/lib/api/client'

export const ordersApi = {
  list: async (params = {}) => {
    const response = await apiClient.get('/admin/orders', { params })
    return response.data?.data
  },

  get: async (orderId) => {
    const response = await apiClient.get(`/admin/orders/${orderId}`)
    return response.data?.data?.order
  },

  updateStatus: async (orderId, status) => {
    const response = await apiClient.patch(`/admin/orders/${orderId}/status`, {
      status,
    })
    return response.data?.data?.order
  },

  timeline: async (orderId) => {
    const response = await apiClient.get(`/admin/orders/${orderId}/timeline`)
    return response.data?.data
  },

  bulkUpdateStatus: async (orderIds, status) => {
    const response = await apiClient.post('/admin/orders/bulk/status', {
      orderIds,
      status,
    })
    return response.data
  },

  fulfillmentQueue: async (params = {}) => {
    const response = await apiClient.get('/admin/orders/fulfillment-queue', { params })
    return response.data?.data
  },

  delayed: async (days = 5) => {
    const response = await apiClient.get('/admin/orders/delayed', { params: { days } })
    return response.data?.data
  },
}
