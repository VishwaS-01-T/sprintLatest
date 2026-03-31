import apiClient from '@/lib/api/client'

export const inventoryApi = {
  list: async (params = {}) => {
    const response = await apiClient.get('/admin/inventory', { params })
    return response.data?.data
  },

  alerts: async (limit = 50) => {
    const response = await apiClient.get('/admin/inventory/alerts', { params: { limit } })
    return response.data?.data
  },
}
