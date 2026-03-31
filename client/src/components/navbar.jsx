"use client";

import { useState } from "react";
import { Search, User, ShoppingBag, X, Menu, LogOut, Heart } from "lucide-react";
import { Link, useRouter } from "../hooks/useRouter.jsx";
import LoginModal from "./LoginModal";
import LoginSuccessNotification from "./LoginSuccessNotification";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import { userAuth } from "../lib/api";

const NAV_LINKS = [
  { label: "New Launch", href: "/products?sort=newest" },
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "All Products", href: "/products" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { navigate } = useRouter();

  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userPhone = useAuthStore((s) => s.userPhone);
  const userName = useAuthStore((s) => s.userName);
  const logout = useAuthStore((s) => s.logout);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/products", { search: searchQuery.trim() });
      setSearchQuery("");
    }
  };

  const isActive = (href) => {
    const [hrefPath, hrefSearch] = href.split("?");
    const currentUrl = new URL(window.location.href);
    const currentPathname = currentUrl.pathname;

    // Must match the pathname first
    if (currentPathname !== hrefPath) return false;

    // If the link has query params, they must match
    if (hrefSearch) {
      const hrefParams = new URLSearchParams(hrefSearch);
      for (const [key, value] of hrefParams) {
        if (currentUrl.searchParams.get(key) !== value) return false;
      }
      return true;
    }

    // "All Products" link (/products with no params) is active only when no gender/sort filters
    if (hrefPath === "/products") {
      return !currentUrl.searchParams.get("gender") && !currentUrl.searchParams.get("sort");
    }

    return true;
  };

  return (
    <>
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.06)]">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
      <Link
        href="/"
        aria-label="Classic Shoes Home"
        className="flex items-center gap-3 group"
      >
        <img
          src="logo.png"
          alt="Classic Shoes"
          className="h-24 w-auto object-contain"
        />
        <span className="hidden sm:block text-xl font-extrabold text-neutral-900 tracking-tight">
          Sprint<span className="text-amber-500">Shoes</span>
        </span>
      </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`relative text-sm font-semibold tracking-wide transition-all duration-[250ms] ease py-2 cursor-pointer ${
                  isActive(l.href)
                    ? "text-amber-500"
                    : "text-neutral-700 hover:text-amber-500"
                }`}
              >
                {l.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-amber-500 transition-all duration-300 ${
                    isActive(l.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted group-focus-within:text-amber-500 transition-colors duration-[250ms]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 lg:w-52 rounded-full bg-neutral-100 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:ring-offset-2 focus:bg-white transition-all duration-[250ms] ease"
            />
          </form>

          <div
            className="relative"
            onMouseEnter={() => setUserDropdown(true)}
            onMouseLeave={() => setUserDropdown(false)}
          >
            <button
              aria-label="Account"
               className="p-2.5 rounded-full hover:bg-neutral-100 transition-all duration-[250ms] ease cursor-pointer"
            >
              <User className="h-5 w-5 text-neutral-700" />
            </button>

            {userDropdown && (
              <div className="absolute right-0 mt-0 w-72 bg-white border border-neutral-200 shadow-[var(--shadow-soft)] rounded-[20px] overflow-hidden">
                {isLoggedIn ? (
                  /* ---- Logged-in dropdown ---- */
                  <>
                    <div className="p-6 border-b border-neutral-200">
                      <h3 className="text-lg font-bold text-black">Hello, {userName || 'User'} 👋</h3>
                      <p className="text-[13px] text-muted mt-0.5">+91 {userPhone}</p>
                    </div>
                    <div className="p-4 space-y-1">
                      {[
                        { href: "/profile", label: "My Profile" },
                        { href: "/orders", label: "Your Orders" },
                        { href: "/wishlist", label: "Wishlist" },
                        { href: "/returns", label: "Returns & Exchange" },
                        { href: "/customer", label: "Customer Support" },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserDropdown(false)}
                          className="flex items-center px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-amber-600 rounded-xl transition-all duration-[250ms] ease cursor-pointer"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={async () => {
                          const { refreshToken, accessToken } = useAuthStore.getState();
                           try {
                             await userAuth.logout(refreshToken, accessToken);
                           } catch {
                             // no-op
                           }
                          logout();
                          useCartStore.getState().clearCart();
                          setUserDropdown(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-[250ms] ease cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  /* ---- Logged-out dropdown ---- */
                  <>
                    <div className="p-6 border-b border-neutral-200">
                      <h3 className="text-xl font-bold text-black mb-2">Welcome</h3>
                      <p className="text-[13px] text-neutral-700 mb-4">To access account and manage orders</p>
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          setLoginModalOpen(true);
                        }}
                         className="w-full bg-yellow-400 py-2.5 px-6 font-bold text-black text-[13px] hover:bg-yellow-500 hover:shadow-[var(--shadow-glow-amber)] transition-all duration-[250ms] ease rounded-[20px] cursor-pointer"
                      >
                        LOGIN / SIGNUP
                      </button>
                    </div>
                    <div className="p-4 space-y-1">
                      {[
                        { href: "/orders", label: "Your Order" },
                        { href: "/returns", label: "Returns & Exchange" },
                        { href: "/customer", label: "Customer Support" },
                      ].map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                           className="flex items-center px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-amber-600 rounded-xl transition-all duration-[250ms] ease cursor-pointer"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            aria-label="Wishlist"
            onClick={() => navigate('/wishlist')}
            className="relative p-2.5 rounded-full hover:bg-neutral-100 transition-all duration-[250ms] ease cursor-pointer"
          >
            <Heart className="h-5 w-5 text-neutral-700" />
          </button>

          <button
            aria-label="Shopping Cart"
            onClick={() => navigate('/cart')}
            className="relative p-2.5 rounded-full hover:bg-neutral-100 transition-all duration-[250ms] ease cursor-pointer"
          >
            <ShoppingBag className="h-5 w-5 text-neutral-700" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-yellow-400 text-neutral-900 text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          </button>
        </div>

        <button
          type="button"
           className="inline-flex items-center justify-center p-2 rounded-[20px] hover:bg-neutral-100 md:hidden transition-all duration-[250ms] ease cursor-pointer"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          {open ? (
            <X className="h-6 w-6 text-neutral-700" />
          ) : (
            <Menu className="h-6 w-6 text-neutral-700" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`border-t border-neutral-200 md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 px-4 py-4 bg-neutral-50">
          {NAV_LINKS.map((l, index) => (
            <li key={l.href} style={{ animationDelay: `${index * 50}ms` }}>
              <Link
                href={l.href}
                className={`block py-3 px-4 text-sm font-semibold rounded-[20px] transition-all duration-[250ms] ease cursor-pointer ${
                  isActive(l.href)
                    ? "bg-yellow-400 text-neutral-900"
                    : "text-neutral-700 hover:bg-neutral-200"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center gap-3 pt-2">
            <input
              type="text"
              placeholder="Search"
               className="flex-1 rounded-full bg-neutral-100 px-4 py-2 text-[13px] font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:bg-neutral-200 transition-all duration-[250ms] ease"
            />
            <button aria-label="Favorites">
              <User className="h-6 w-6" />
            </button>
            <button
              aria-label="Shopping Cart"
              onClick={() => { setOpen(false); navigate('/cart'); }}
               className="flex-1 flex items-center justify-center gap-2 py-2.5 px-6 bg-yellow-400 text-neutral-900 rounded-[20px] font-medium hover:bg-yellow-500 transition-all duration-[250ms] ease cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5" />
              Cart ({cartCount})
            </button>
          </li>
        </ul>
      </div>
    </header>
    
    {/* Login Modal */}
    <LoginModal
      isOpen={loginModalOpen}
      onClose={() => setLoginModalOpen(false)}
      onLoginSuccess={() => window.dispatchEvent(new Event('login-success'))}
    />
    <LoginSuccessNotification />
    </>
  );
}
