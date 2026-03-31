import React, { useEffect, useState } from "react";
import { Link, useRouter } from "../hooks/useRouter.jsx";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import LoginModal from "../components/LoginModal";
import { useToast } from "../hooks/useToast";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  Truck,
  ArrowLeft,
} from "lucide-react";

const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const incrementQuantity = useCartStore((s) => s.incrementQuantityAsync);
  const decrementQuantity = useCartStore((s) => s.decrementQuantityAsync);
  const removeItem = useCartStore((s) => s.removeItemAsync);
  const fetchServerCart = useCartStore((s) => s.fetchServerCart);
  const fetchServerSummary = useCartStore((s) => s.fetchServerSummary);
  const applyCouponAsync = useCartStore((s) => s.applyCouponAsync);
  const removeCouponAsync = useCartStore((s) => s.removeCouponAsync);
  const getCartSummary = useCartStore((s) => s.getCartSummary);
  const couponCode = useCartStore((s) => s.couponCode);

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { navigate } = useRouter();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const { success: showSuccess, error: showError, info: showInfo } = useToast();

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchServerCart().catch(() => {});
    fetchServerSummary().catch(() => {});
  }, [isLoggedIn, fetchServerCart, fetchServerSummary]);

  const { subtotal, shipping, total, itemCount } = getCartSummary();

  const handleProceed = () => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      return;
    }
    navigate("/checkout/address");
  };

  const handleApplyCoupon = async () => {
    if (!isLoggedIn) {
      showInfo("Please login to apply coupon.");
      return;
    }
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    try {
      await applyCouponAsync(couponInput.trim());
      showSuccess("Coupon applied successfully");
      setCouponInput("");
    } catch (err) {
      showError(err.message || "Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    try {
      await removeCouponAsync();
      showSuccess("Coupon removed");
    } catch (err) {
      showError(err.message || "Failed to remove coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-neutral-300" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your Bag is Empty</h1>
        <p className="text-neutral-500 mb-8 text-center max-w-md">
          Looks like you haven&apos;t added anything to your bag yet.
        </p>
         <Link
           href="/products"
           className="inline-flex items-center gap-2 px-8 py-2.5 bg-neutral-900 text-white font-bold rounded-full hover:bg-neutral-800 hover:shadow-[var(--shadow-soft)] transition-all duration-[250ms] ease cursor-pointer"
         >
          <ShoppingBag className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-[-0.02em] text-neutral-900">Bag</h1>
              <p className="text-sm text-muted mt-1">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
            <Link
              href="/products"
             className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-amber-600 transition-all duration-[250ms] ease cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
            <div className="lg:col-span-2 space-y-0">
              {items.map((item, index) => (
                <div
                  key={item.id}
                className={`bg-white p-6 sm:p-7 ${index === 0 ? "rounded-t-[20px]" : ""} ${index === items.length - 1 ? "rounded-b-[20px]" : ""} ${index !== items.length - 1 ? "border-b border-neutral-100" : ""}`}
                >
                  <div className="flex gap-4 sm:gap-6">
                    <Link
                      href={`/product/${item.slug || item.productId}`}
                       className="shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-[20px] bg-neutral-100 overflow-hidden group"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                         className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            href={`/product/${item.slug || item.productId}`}
                             className="font-bold text-neutral-900 hover:text-amber-600 transition-all duration-[250ms] ease cursor-pointer line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted mt-0.5">{item.brand}</p>
                        </div>
                        <p className="font-bold text-neutral-900 whitespace-nowrap">
                          Rs {Number(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      <div className="mt-2 space-y-1">
                        {item.color && <p className="text-sm text-neutral-500 capitalize">{item.color}</p>}
                        <p className="text-sm text-neutral-600 underline underline-offset-2">Size {item.size}</p>
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                         <div className="inline-flex items-center border border-neutral-200 rounded-[20px] overflow-hidden">
                          <button
                            onClick={() => decrementQuantity(item.id).catch(() => {})}
                             className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-[250ms] ease cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            {item.quantity <= 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                          </button>
                          <span className="px-4 py-1.5 text-sm font-bold text-neutral-900 min-w-[36px] text-center border-x border-neutral-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(item.id).catch(() => {})}
                             className="p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-[250ms] ease cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id).catch(() => {})}
                           className="p-2 rounded-[20px] border border-neutral-200 text-muted hover:text-rose-500 hover:border-rose-200 transition-all duration-[250ms] ease cursor-pointer"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-[20px] p-7 sticky top-24 shadow-[var(--shadow-soft)]">
                <h2 className="text-xl font-extrabold tracking-[-0.02em] text-neutral-900 mb-7">Summary</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600">Bag Total</span>
                    <span className="text-sm font-medium text-neutral-900">
                      Rs {subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Shipping Charges</span>
                    <span className={`text-sm font-medium ${shipping === 0 ? "text-green-600" : "text-neutral-900"}`}>
                      {shipping === 0
                        ? "Free"
                        : `Rs ${shipping.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>

                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">You Pay</span>
                      <span className="font-bold text-lg text-neutral-900">
                        Rs {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                  <div className="mt-6 p-5 bg-neutral-50 rounded-[20px]">
                  <div className="flex items-center gap-3 mb-3">
                       <Tag className="w-5 h-5 text-muted" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-neutral-900">Have a promo code?</p>
                       <p className="text-xs text-muted">Apply now to get instant savings</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder={couponCode ? `Applied: ${couponCode}` : "Enter coupon code"}
                       className="flex-1 rounded-[20px] border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:ring-offset-2"
                      disabled={Boolean(couponCode)}
                    />
                    {!couponCode ? (
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                         className="px-6 py-2.5 rounded-[20px] bg-neutral-900 text-white text-sm font-semibold disabled:opacity-50 hover:bg-neutral-800 hover:shadow-[var(--shadow-soft)] transition-all duration-[250ms] ease cursor-pointer"
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        onClick={handleRemoveCoupon}
                        disabled={couponLoading}
                         className="px-6 py-2.5 rounded-[20px] bg-white border border-neutral-200 text-sm font-semibold hover:bg-neutral-50 transition-all duration-[250ms] ease cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full mt-6 py-2.5 px-6 bg-neutral-900 text-white font-bold text-base rounded-full hover:bg-neutral-800 transition-all duration-[250ms] ease cursor-pointer shadow-[var(--shadow-soft)]"
                >
                  Proceed to Buy
                </button>

                <div className="flex items-center gap-2 mt-4 justify-center">
                  <Truck className="w-4 h-4 text-green-500" />
                   <span className="text-xs text-muted">
                     {shipping === 0 ? "You qualify for free shipping!" : "Shipping calculated at checkout"}
                   </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={() => {
          window.dispatchEvent(new Event("login-success"));
          navigate("/checkout/address");
        }}
      />
    </>
  );
};

export default CartPage;
