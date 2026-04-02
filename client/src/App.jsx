import { useEffect, Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { RouterProvider, useRouter } from "./hooks/useRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/Footer.jsx";
import AddedToCartNotification from "./components/AddedToCartNotification.jsx";
import useAuthStore from "./store/authStore";
import useCartStore from "./store/cartStore";

// Lazy load all page components for code splitting
const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const ProductsPage = lazy(() => import("./pages/ProductsPage.jsx"));
const ProductPage = lazy(() => import("./pages/ProductPage.jsx"));
const CartPage = lazy(() => import("./pages/CartPage.jsx"));
const AddressPage = lazy(() => import("./pages/AddressPage.jsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.jsx"));
const MyProfile = lazy(() => import("./pages/MyProfile.jsx"));
const WishlistPage = lazy(() => import("./pages/WishlistPage.jsx"));
const OrdersPage = lazy(() => import("./pages/OrdersPage.jsx"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage.jsx"));

// Loading skeleton component for better UX during code splitting
const PageSkeleton = () => (
  <div className="min-h-screen bg-neutral-50 animate-pulse">
    {/* Header skeleton */}
    <div className="h-16 bg-neutral-200 mb-8"></div>
    
    {/* Content skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title skeleton */}
      <div className="h-8 bg-neutral-200 rounded w-1/3 mb-6"></div>
      
      {/* Content blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-48 bg-neutral-200 rounded-lg"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Route component for handling different pages
const Routes = () => {
  const { currentPath } = useRouter();

  // Match routes
  if (currentPath === "/" || currentPath === "") {
    return <HomePage />;
  }

  if (currentPath === "/products") {
    return <ProductsPage />;
  }

  if (currentPath.startsWith("/product/")) {
    return <ProductPage />;
  }

  if (currentPath === "/cart") {
    return <CartPage />;
  }

  if (currentPath === "/checkout/address") {
    return <AddressPage />;
  }

  if (currentPath === "/profile") {
    return <MyProfile />;
  }

  if (currentPath === "/wishlist") {
    return <WishlistPage />;
  }

  if (currentPath === "/orders") {
    return <OrdersPage />;
  }

  if (currentPath.startsWith("/orders/")) {
    return <OrderDetailPage />;
  }

  if (currentPath === "/checkout") {
    return <CheckoutPage />;
  }

  // 404 Page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

const App = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const syncLocalCartToServer = useCartStore((s) => s.syncLocalCartToServer);

  useEffect(() => {
    if (!isLoggedIn) return;
    syncLocalCartToServer().catch(() => {});
  }, [isLoggedIn, syncLocalCartToServer]);

  return (
    <RouterProvider>
      <AuthProvider>
        <main className="bg-white min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Suspense fallback={<PageSkeleton />}>
              <Routes />
            </Suspense>
          </div>
          <Footer />
          <AddedToCartNotification />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#363636',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </main>
      </AuthProvider>
    </RouterProvider>
  );
};

export default App;
