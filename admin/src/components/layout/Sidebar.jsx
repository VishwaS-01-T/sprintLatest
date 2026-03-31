import { NavLink } from 'react-router-dom'
import { LayoutPanelLeft } from 'lucide-react'
import { navigationItems } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils'

function Sidebar({ open, onToggle }) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 h-screen w-72 border-r border-slate-200 bg-white/95 backdrop-blur md:static md:block',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        'transition-transform duration-200',
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <div>
          <p className="font-display text-lg font-bold text-slate-900">Sprint Shoes</p>
          <p className="text-xs font-medium text-brand-600">Admin Portal</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <LayoutPanelLeft className="h-5 w-5" />
        </button>
      </div>

      <nav className="space-y-1 p-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
