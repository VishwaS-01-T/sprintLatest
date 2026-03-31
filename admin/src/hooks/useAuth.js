import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '@/lib/api/auth'

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ email, password }) => authApi.login(email, password),
    onSuccess: () => {
      toast.success('Welcome back!')
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed')
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast.success('Logged out successfully')
      navigate('/login', { replace: true })
    },
    onError: () => {
      navigate('/login', { replace: true })
    },
  })
}
