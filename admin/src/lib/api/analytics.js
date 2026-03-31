import apiClient from '@/lib/api/client'
import {
  getMockDashboard,
  getMockSales,
  isMockMode,
  isNetworkError,
} from '@/lib/api/mockData'

export const analyticsApi = {
  dashboard: async () => {
    if (isMockMode) return getMockDashboard()
    try {
      const response = await apiClient.get('/admin/analytics/dashboard')
      return response.data?.data
    } catch (error) {
      if (isNetworkError(error)) return getMockDashboard()
      throw error
    }
  },

  sales: async (params = {}) => {
    if (isMockMode) return getMockSales(params)
    try {
      const response = await apiClient.get('/admin/analytics/sales', { params })
      return response.data?.data
    } catch (error) {
      if (isNetworkError(error)) return getMockSales(params)
      throw error
    }
  },

  products: async () => {
    if (isMockMode) return { topProducts: getMockDashboard().topProducts }
    const response = await apiClient.get('/admin/analytics/products')
    return response.data?.data
  },
}
