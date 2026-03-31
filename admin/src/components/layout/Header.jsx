import { Bell, LogOut, Menu } from 'lucide-react'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'

const titleMap = {
  dashboard: 'Dashboard',
  products: 'Products',
  orders: 'Orders',
  customers: 'Customers',
  inventory: 'Inventory',
  analytics: 'Analytics',
  marketing: 'Marketing',
  returns: 'Returns',
  reviews: 'Reviews',
  settings: 'Settings',
}

function Header({ onMenuClick }) {
  const location = useLocation()
  const admin = useAuthStore((state) => state.admin)
  const { mutate: logout, isPending } = useLogout()

  const title = useMemo(() => {
    const segment = location.pathname.split('/').filter(Boolean)[0] || 'dashboard'
    return titleMap[segment] || 'Admin'
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs text-slate-500">Sprint Shoes Admin</p>
            <p className="font-display text-base font-semibold text-slate-900">{title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Bell className="h-4 w-4" />
          </button>

          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-slate-900">
              {admin?.firstName} {admin?.lastName}
            </p>
            <p className="text-xs text-slate-500">{admin?.email || 'admin@sprintshoes.com'}</p>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() => logout()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
