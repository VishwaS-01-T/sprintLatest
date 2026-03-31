import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Users,
  Package,
  LineChart,
  Megaphone,
  Undo2,
  Star,
  Settings,
} from 'lucide-react'

export const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: Boxes },
  { label: 'Orders', path: '/orders', icon: ShoppingCart },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Inventory', path: '/inventory', icon: Package },
  { label: 'Analytics', path: '/analytics', icon: LineChart },
  { label: 'Marketing', path: '/marketing', icon: Megaphone },
  { label: 'Returns', path: '/returns', icon: Undo2 },
  { label: 'Reviews', path: '/reviews', icon: Star },
  { label: 'Settings', path: '/settings', icon: Settings },
]
