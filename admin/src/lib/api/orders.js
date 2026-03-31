import apiClient from '@/lib/api/client'
import {
  getMockOrderById,
  getMockOrderTimeline,
  getMockOrders,
  isMockMode,
  isNetworkError,
} from '@/lib/api/mockData'

export const ordersApi = {
  list: async (params = {}) => {
    if (isMockMode) return getMockOrders(params)
    try {
      const response = await apiClient.get('/admin/orders', { params })
      return response.data?.data
    } catch (error) {
      if (isNetworkError(error)) return getMockOrders(params)
      throw error
    }
  },

  get: async (orderId) => {
    if (isMockMode) return getMockOrderById(orderId)
    try {
      const response = await apiClient.get(`/admin/orders/${orderId}`)
      return response.data?.data?.order
    } catch (error) {
      if (isNetworkError(error)) return getMockOrderById(orderId)
      throw error
    }
  },

  updateStatus: async (orderId, status) => {
    if (isMockMode) return { ...getMockOrderById(orderId), orderStatus: status }
    const response = await apiClient.patch(`/admin/orders/${orderId}/status`, {
      status,
    })
    return response.data?.data?.order
  },

  timeline: async (orderId) => {
    if (isMockMode) return getMockOrderTimeline(orderId)
    try {
      const response = await apiClient.get(`/admin/orders/${orderId}/timeline`)
      return response.data?.data
    } catch (error) {
      if (isNetworkError(error)) return getMockOrderTimeline(orderId)
      throw error
    }
  },

  bulkUpdateStatus: async (orderIds, status) => {
    if (isMockMode) return { success: true, orderIds, status }
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
