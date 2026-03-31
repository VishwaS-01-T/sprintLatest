import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import LoginPage from '@/pages/auth/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ProductsListPage from '@/pages/products/ProductsListPage'
import ProductCreatePage from '@/pages/products/ProductCreatePage'
import ProductEditPage from '@/pages/products/ProductEditPage'
import ProductDetailPage from '@/pages/products/ProductDetailPage'
import DummyProductsSeederPage from '@/pages/products/DummyProductsSeederPage'
import OrdersListPage from '@/pages/orders/OrdersListPage'
import OrderDetailPage from '@/pages/orders/OrderDetailPage'
import ModulePlaceholderPage from '@/pages/common/ModulePlaceholderPage'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsListPage />} />
            <Route path="products/new" element={<ProductCreatePage />} />
            <Route path="products/seed" element={<DummyProductsSeederPage />} />
            <Route path="products/:productId" element={<ProductDetailPage />} />
            <Route path="products/:productId/edit" element={<ProductEditPage />} />
            <Route path="orders" element={<OrdersListPage />} />
            <Route path="orders/:orderId" element={<OrderDetailPage />} />
            <Route path="customers" element={<ModulePlaceholderPage title="Customers" />} />
            <Route path="inventory" element={<ModulePlaceholderPage title="Inventory" />} />
            <Route path="analytics" element={<ModulePlaceholderPage title="Analytics" />} />
            <Route path="marketing" element={<ModulePlaceholderPage title="Marketing" />} />
            <Route path="returns" element={<ModulePlaceholderPage title="Returns & Refunds" />} />
            <Route path="reviews" element={<ModulePlaceholderPage title="Reviews" />} />
            <Route path="settings" element={<ModulePlaceholderPage title="Settings" />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}

export default App
