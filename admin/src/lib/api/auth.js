import apiClient from '@/lib/api/client'
import useAuthStore from '@/store/authStore'
import { isMockMode, isNetworkError, mockData } from '@/lib/api/mockData'

export const authApi = {
  login: async (email, password) => {
    if (isMockMode) {
      const payload = {
        admin: { ...mockData.admin, email: email || mockData.admin.email },
        accessToken: mockData.auth.accessToken,
        refreshToken: mockData.auth.refreshToken,
      }
      useAuthStore.getState().setAuth(payload.admin, payload.accessToken, payload.refreshToken)
      return payload
    }

    try {
      const response = await apiClient.post('/admin/auth/login', { email, password })
      const payload = response.data?.data
      useAuthStore
        .getState()
        .setAuth(payload.admin, payload.accessToken, payload.refreshToken)
      return payload
    } catch (error) {
      if (isNetworkError(error)) {
        const payload = {
          admin: { ...mockData.admin, email: email || mockData.admin.email },
          accessToken: mockData.auth.accessToken,
          refreshToken: mockData.auth.refreshToken,
        }
        useAuthStore.getState().setAuth(payload.admin, payload.accessToken, payload.refreshToken)
        return payload
      }
      throw error
    }
  },

  logout: async () => {
    const { refreshToken } = useAuthStore.getState()
    try {
      if (refreshToken) {
        await apiClient.post('/admin/auth/logout', { refreshToken })
      }
    } finally {
      useAuthStore.getState().clearAuth()
    }
  },

  me: async () => {
    const response = await apiClient.get('/admin/auth/me')
    return response.data?.data?.admin
  },
}
