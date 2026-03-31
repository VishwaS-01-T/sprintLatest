import apiClient from '@/lib/api/client'
import useAuthStore from '@/store/authStore'

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/admin/auth/login', { email, password })
    const payload = response.data?.data
    useAuthStore
      .getState()
      .setAuth(payload.admin, payload.accessToken, payload.refreshToken)
    return payload
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
