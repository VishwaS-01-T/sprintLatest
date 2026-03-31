import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      admin: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (admin, accessToken, refreshToken) =>
        set({
          admin,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          admin: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      updateTokens: (accessToken, refreshToken) =>
        set((state) => ({
          ...state,
          accessToken,
          refreshToken,
        })),

      hasPermission: (permission) => {
        const admin = get().admin
        if (!admin?.role?.permissions) return false
        return admin.role.permissions.includes(permission)
      },
    }),
    {
      name: 'sprint-shoes-admin-auth',
      partialize: (state) => ({
        admin: state.admin,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export default useAuthStore
