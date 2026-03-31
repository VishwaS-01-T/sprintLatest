import apiClient from '@/lib/api/client'

export const productsApi = {
  list: async (params = {}) => {
    const response = await apiClient.get('/admin/products', { params })
    return response.data?.data
  },

  get: async (productId) => {
    const response = await apiClient.get(`/admin/products/${productId}`)
    return response.data?.data?.product
  },

  create: async (data) => {
    const response = await apiClient.post('/admin/products', data)
    return response.data?.data?.product
  },

  update: async (productId, data) => {
    const response = await apiClient.put(`/admin/products/${productId}`, data)
    return response.data?.data?.product
  },

  archive: async (productId) => {
    const response = await apiClient.delete(`/admin/products/${productId}`)
    return response.data
  },

  updateStatus: async (productId, status) => {
    const response = await apiClient.patch(`/admin/products/${productId}/status`, { status })
    return response.data?.data?.product
  },

  bulkUpdateStatus: async (productIds, status) => {
    const response = await apiClient.post('/admin/products/bulk/status', {
      productIds,
      status,
    })
    return response.data
  },

  bulkToggleFeatured: async (productIds, featuredProduct) => {
    const response = await apiClient.post('/admin/products/bulk/feature', {
      productIds,
      featuredProduct,
    })
    return response.data
  },

  bulkToggleNewArrival: async (productIds, newArrival) => {
    const response = await apiClient.post('/admin/products/bulk/new-arrival', {
      productIds,
      newArrival,
    })
    return response.data
  },

  createVariant: async (productId, data) => {
    const response = await apiClient.post(`/admin/products/${productId}/variants`, data)
    return response.data?.data?.variant
  },

  updateVariant: async (productId, variantId, data) => {
    const response = await apiClient.put(
      `/admin/products/${productId}/variants/${variantId}`,
      data,
    )
    return response.data?.data?.variant
  },

  deleteVariant: async (productId, variantId) => {
    const response = await apiClient.delete(`/admin/products/${productId}/variants/${variantId}`)
    return response.data
  },

  addImages: async (productId, images) => {
    const response = await apiClient.post(`/admin/products/${productId}/images`, {
      images,
    })
    return response.data?.data
  },

  updateSpecification: async (productId, data) => {
    const response = await apiClient.put(`/admin/products/${productId}/specification`, data)
    return response.data?.data?.specification
  },

  createSizeGuide: async (productId, data) => {
    const response = await apiClient.post(`/admin/products/${productId}/size-guides`, data)
    return response.data?.data?.sizeGuide
  },

  analytics: async () => {
    const response = await apiClient.get('/admin/products/analytics')
    return response.data?.data
  },
}
