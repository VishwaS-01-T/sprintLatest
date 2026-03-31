import { useEffect } from "react";
import { RouterProvider, useRouter } from "./hooks/useRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import AddressPage from "./pages/AddressPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import AddedToCartNotification from "./components/AddedToCartNotification.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import useAuthStore from "./store/authStore";
import useCartStore from "./store/cartStore";

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
            <Routes />
          </div>
          <Footer />
          <AddedToCartNotification />
          <ToastContainer />
        </main>
      </AuthProvider>
    </RouterProvider>
  );
};

export default App;
