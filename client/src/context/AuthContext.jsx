import { createContext, useContext } from 'react';
import useAuthStore from '../store/authStore';

/**
 * AuthContext — thin React Context wrapper around the Zustand auth store.
 * Provides isLoggedIn, userPhone, userName, login(), logout(), updateProfile()
 * so components can consume auth state via either useAuth() or useAuthStore().
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Subscribe to all auth state from Zustand
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userPhone = useAuthStore((s) => s.userPhone);
  const userName = useAuthStore((s) => s.userName);
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userPhone, userName, user, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
