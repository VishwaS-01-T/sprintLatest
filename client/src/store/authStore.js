import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth store — persisted to localStorage.
 * Stores isLoggedIn, JWT tokens, and user profile fields.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,          // full user object from /me
      userPhone: '',       // 10-digit local phone (without +91)
      userName: '',        // display name
      accessToken: '',
      refreshToken: '',

      /**
       * Called on successful login or registration.
       * Accepts { phone, accessToken, refreshToken, userData? }
       */
      login: ({ phone = '', accessToken = '', refreshToken = '', userData = null }) =>
        set({
          isLoggedIn: true,
          user: userData,
          userPhone: userData?.phoneNumber
            ? userData.phoneNumber.replace(/^\+91/, '')
            : phone.replace(/^\+91/, ''),
          userName: userData
            ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
            : '',
          accessToken,
          refreshToken,
        }),

      /** Update in-store user from GET /me response */
      setUser: (userData) =>
        set((state) => ({
          user: userData,
          userName:
            `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
            state.userName,
          userPhone: userData.phoneNumber
            ? userData.phoneNumber.replace(/^\+91/, '')
            : state.userPhone,
        })),

      /** Rotate access / refresh tokens after /refresh call */
      setTokens: ({ accessToken, refreshToken }) =>
        set({
          accessToken: accessToken ?? '',
          ...(refreshToken ? { refreshToken } : {}),
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          userPhone: '',
          userName: '',
          accessToken: '',
          refreshToken: '',
        }),

      /** Optimistically update local profile fields */
      updateProfile: ({ firstName, lastName, email }) =>
        set((state) => ({
          userName:
            firstName || lastName
              ? `${firstName ?? state.user?.firstName ?? ''} ${lastName ?? state.user?.lastName ?? ''}`.trim()
              : state.userName,
          user: state.user
            ? {
                ...state.user,
                firstName: firstName ?? state.user.firstName,
                lastName: lastName ?? state.user.lastName,
                email: email ?? state.user.email,
              }
            : state.user,
        })),
    }),
    { name: 'sprint-shoes-auth' }
  )
);

export default useAuthStore;
