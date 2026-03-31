import apiClient from '@/lib/api/client'

export const analyticsApi = {
  dashboard: async () => {
    const response = await apiClient.get('/admin/analytics/dashboard')
    return response.data?.data
  },

  sales: async (params = {}) => {
    const response = await apiClient.get('/admin/analytics/sales', { params })
    return response.data?.data
  },

  products: async () => {
    const response = await apiClient.get('/admin/analytics/products')
    return response.data?.data
  },
}
