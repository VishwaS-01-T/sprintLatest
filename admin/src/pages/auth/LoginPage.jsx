import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '@/hooks/useAuth'
import useAuthStore from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin1@shoesprint.com',
      password: 'Admin@123',
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = (values) => {
    login(values)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(25,118,210,0.18),transparent_48%),radial-gradient(circle_at_95%_80%,rgba(15,157,110,0.16),transparent_45%)]" />

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Sprint Shoes</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to manage products, orders, and operations.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
              placeholder="admin@sprintshoes.com"
            />
            {errors.email ? <span className="text-xs text-rose-600">{errors.email.message}</span> : null}
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
              placeholder="Enter password"
            />
            {errors.password ? (
              <span className="text-xs text-rose-600">{errors.password.message}</span>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500">
          Tip: Seeded admin login is admin1@shoesprint.com / Admin@123.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
