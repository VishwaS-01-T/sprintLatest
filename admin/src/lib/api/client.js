import axios from 'axios'
import useAuthStore from '@/store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise = null

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { refreshToken, updateTokens, clearAuth } = useAuthStore.getState()
      if (!refreshToken) {
        clearAuth()
        throw new Error('No refresh token available')
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/admin/auth/refresh`, {
          refreshToken,
        })

        const payload = response.data?.data || {}
        if (!payload.accessToken || !payload.refreshToken) {
          clearAuth()
          throw new Error('Invalid refresh token response')
        }

        updateTokens(payload.accessToken, payload.refreshToken)
        return payload.accessToken
      } catch (error) {
        clearAuth()
        throw error
      }
    })().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const token = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
