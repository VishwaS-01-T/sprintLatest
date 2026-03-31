import apiClient from '@/lib/api/client'
import {
  getMockInventoryAlerts,
  isMockMode,
  isNetworkError,
} from '@/lib/api/mockData'

export const inventoryApi = {
  list: async (params = {}) => {
    if (isMockMode) return getMockInventoryAlerts(params.limit || 10)
    const response = await apiClient.get('/admin/inventory', { params })
    return response.data?.data
  },

  alerts: async (limit = 50) => {
    if (isMockMode) return getMockInventoryAlerts(limit)
    try {
      const response = await apiClient.get('/admin/inventory/alerts', { params: { limit } })
      return response.data?.data
    } catch (error) {
      if (isNetworkError(error)) return getMockInventoryAlerts(limit)
      throw error
    }
  },
}
