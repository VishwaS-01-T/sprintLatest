import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:pl-0">
        <Header onMenuClick={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      {sidebarOpen ? (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-20 bg-slate-900/35 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
    </div>
  )
}

export default AdminLayout
