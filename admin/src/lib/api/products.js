import apiClient from '@/lib/api/client'
import {
  getMockProductById,
  getMockProducts,
  isMockMode,
  isNetworkError,
} from '@/lib/api/mockData'

export const productsApi = {
  list: async (params = {}) => {
    if (isMockMode) return getMockProducts(params)
    try {
      const response = await apiClient.get('/admin/products', { params })
      return response.data?.data
    } catch (error) {
      if (isNetworkError(error)) return getMockProducts(params)
      throw error
    }
  },

  get: async (productId) => {
    if (isMockMode) return getMockProductById(productId)
    try {
      const response = await apiClient.get(`/admin/products/${productId}`)
      return response.data?.data?.product
    } catch (error) {
      if (isNetworkError(error)) return getMockProductById(productId)
      throw error
    }
  },

  create: async (data) => {
    if (isMockMode) {
      return {
        id: `mock-created-${Date.now()}`,
        ...data,
      }
    }
    const response = await apiClient.post('/admin/products', data)
    return response.data?.data?.product
  },

  update: async (productId, data) => {
    if (isMockMode) {
      return {
        id: productId,
        ...data,
      }
    }
    const response = await apiClient.put(`/admin/products/${productId}`, data)
    return response.data?.data?.product
  },

  archive: async (productId) => {
    if (isMockMode) return { success: true, productId }
    const response = await apiClient.delete(`/admin/products/${productId}`)
    return response.data
  },

  updateStatus: async (productId, status) => {
    if (isMockMode) return { id: productId, status }
    const response = await apiClient.patch(`/admin/products/${productId}/status`, { status })
    return response.data?.data?.product
  },

  bulkUpdateStatus: async (productIds, status) => {
    if (isMockMode) return { success: true, productIds, status }
    const response = await apiClient.post('/admin/products/bulk/status', {
      productIds,
      status,
    })
    return response.data
  },

  bulkToggleFeatured: async (productIds, featuredProduct) => {
    if (isMockMode) return { success: true, productIds, featuredProduct }
    const response = await apiClient.post('/admin/products/bulk/feature', {
      productIds,
      featuredProduct,
    })
    return response.data
  },

  bulkToggleNewArrival: async (productIds, newArrival) => {
    if (isMockMode) return { success: true, productIds, newArrival }
    const response = await apiClient.post('/admin/products/bulk/new-arrival', {
      productIds,
      newArrival,
    })
    return response.data
  },

  createVariant: async (productId, data) => {
    if (isMockMode) return { id: `mock-variant-${Date.now()}`, productId, ...data }
    const response = await apiClient.post(`/admin/products/${productId}/variants`, data)
    return response.data?.data?.variant
  },

  updateVariant: async (productId, variantId, data) => {
    if (isMockMode) return { id: variantId, productId, ...data }
    const response = await apiClient.put(
      `/admin/products/${productId}/variants/${variantId}`,
      data,
    )
    return response.data?.data?.variant
  },

  deleteVariant: async (productId, variantId) => {
    if (isMockMode) return { success: true, productId, variantId }
    const response = await apiClient.delete(`/admin/products/${productId}/variants/${variantId}`)
    return response.data
  },

  addImages: async (productId, images) => {
    if (isMockMode) return { productId, images }
    const response = await apiClient.post(`/admin/products/${productId}/images`, {
      images,
    })
    return response.data?.data
  },

  updateSpecification: async (productId, data) => {
    if (isMockMode) return { productId, ...data }
    const response = await apiClient.put(`/admin/products/${productId}/specification`, data)
    return response.data?.data?.specification
  },

  createSizeGuide: async (productId, data) => {
    if (isMockMode) return { id: `mock-size-${Date.now()}`, productId, ...data }
    const response = await apiClient.post(`/admin/products/${productId}/size-guides`, data)
    return response.data?.data?.sizeGuide
  },

  analytics: async () => {
    if (isMockMode) return { topProducts: [] }
    const response = await apiClient.get('/admin/products/analytics')
    return response.data?.data
  },
}
