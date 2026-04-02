import React, { useEffect, useMemo, useState } from "react";
import { CreditCard, Wallet, Landmark } from "lucide-react";
import { Link, useRouter } from "../hooks/useRouter.jsx";
import useAuthStore from "../store/authStore";
import { ordersApi } from "../lib/api/ordersApi";
import { addressesApi } from "../lib/api/addressesApi";
import { paymentMethodsApi } from "../lib/api/paymentMethodsApi";
import useCartStore from "../store/cartStore";
import showToast from "../utils/toast";
import { RazorpayCheckout } from "../components/RazorpayCheckout";
import { CheckoutSkeleton } from "../components/skeletons/CheckoutSkeleton";

const PAYMENT_OPTIONS = [
  { id: "CREDIT_CARD", label: "Credit Card", icon: CreditCard },
  { id: "UPI", label: "UPI", icon: Wallet },
  { id: "COD", label: "Cash on Delivery", icon: Landmark },
];

const CheckoutPage = () => {
  const { navigate, getParam } = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userData = useAuthStore((s) => s.userData);
  const [addresses, setAddresses] = useState([]);
  const [savedPayments, setSavedPayments] = useState([]);
  const [shippingAddressId, setShippingAddressId] = useState(getParam("shippingAddressId") || "");
  const [billingAddressId, setBillingAddressId] = useState(getParam("billingAddressId") || "");
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const getCartSummary = useCartStore((s) => s.getCartSummary);
  const cartSummary = getCartSummary();
  const fetchServerCart = useCartStore((s) => s.fetchServerCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === shippingAddressId) || null,
    [addresses, shippingAddressId],
  );

  useEffect(() => {
    if (!isLoggedIn) {
      showToast.info("Please login to continue checkout.");
      navigate("/cart");
      return;
    }

    let active = true;

    Promise.allSettled([addressesApi.list(), paymentMethodsApi.list(), fetchServerCart()])
      .then(async ([addressRes, paymentRes]) => {
        if (!active) return;

        const addressList =
          addressRes.status === "fulfilled" ? addressRes.value.data?.addresses || [] : [];
        setAddresses(addressList);

        const defaultAddress =
          addressList.find((a) => a.isDefaultShipping) ||
          addressList.find((a) => a.isDefaultBilling) ||
          addressList[0] ||
          null;

        const nextShipping = shippingAddressId || defaultAddress?.id || "";
        const nextBilling = billingAddressId || defaultAddress?.id || "";

        setShippingAddressId(nextShipping);
        setBillingAddressId(nextBilling);

        if (paymentRes.status === "fulfilled") {
          const methods = paymentRes.value.data?.paymentMethods || [];
          setSavedPayments(methods);
        }

        if (nextShipping) {
          try {
            const validateRes = await ordersApi.validateCheckout({
              addressId: nextShipping,
            });
            setSummary(validateRes.data?.summary || null);
          } catch {
            setSummary(null);
          }
        }
      })
      .catch(() => {
        if (active) showToast.error("Failed to initialize checkout");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, navigate, shippingAddressId, billingAddressId, fetchServerCart]);

  const handlePlaceOrder = async () => {
    if (!shippingAddressId) {
      showToast.error("Please select a shipping address.");
      return;
    }

    setPlacing(true);
    try {
      await ordersApi.validateCheckout({ addressId: shippingAddressId });

      const created = await ordersApi.createCheckoutOrder({
        addressId: shippingAddressId,
      });
      const order = created.data?.order;
      const paymentId = created.data?.paymentId;
      if (!order?.id) throw new Error("Unable to create order");
      if (!paymentId) throw new Error("Unable to create payment session");

      // Store order data and show payment modal
      setOrderData({
        orderId: order.id,
        id: order.id,
        paymentId: paymentId,
        totalAmount: order.totalAmount || cartSummary.total,
        total: order.totalAmount || cartSummary.total,
      });
      setShowPaymentModal(true);
    } catch (err) {
      showToast.error(err.message || "Checkout failed");
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentSuccess = (response) => {
    setShowPaymentModal(false);
    clearCart(); // Clear local cart after successful payment
    showToast.success("Payment successful! Order placed.");
    navigate(`/orders/${orderData.orderId}`);
  };

  const handlePaymentFailed = () => {
    setShowPaymentModal(false);
    showToast.error("Payment failed. Please try again.");
  };

  // Get user info for Razorpay prefill
  const userInfo = useMemo(() => ({
    name: userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : '',
    email: userData?.email || '',
    phone: userData?.phoneNumber || '',
  }), [userData]);

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>

        {loading ? (
          <CheckoutSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white rounded-2xl border border-neutral-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-neutral-900">Shipping Address</h2>
                  <Link href="/checkout/address" className="text-sm font-semibold text-amber-600">
                    Manage
                  </Link>
                </div>

                {addresses.length === 0 && (
                  <div className="text-sm text-neutral-500">
                    No addresses found. <Link href="/checkout/address" className="underline">Add address</Link>
                  </div>
                )}

                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block rounded-xl border-2 p-4 cursor-pointer ${
                        shippingAddressId === address.id
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingAddress"
                        checked={shippingAddressId === address.id}
                        onChange={() => {
                          setShippingAddressId(address.id);
                          setBillingAddressId(address.id);
                        }}
                        className="sr-only"
                      />
                      <p className="font-semibold text-neutral-900">{address.fullName}</p>
                      <p className="text-sm text-neutral-600">{address.addressLine1}</p>
                      {address.addressLine2 && <p className="text-sm text-neutral-500">{address.addressLine2}</p>}
                      <p className="text-sm text-neutral-600">
                        {address.city}, {address.state} - {address.postalCode}
                      </p>
                      <p className="text-sm text-neutral-500">{address.phone}</p>
                    </label>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-neutral-200 p-5">
                <h2 className="text-lg font-bold text-neutral-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer ${
                          paymentMethod === option.id
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === option.id}
                          onChange={() => setPaymentMethod(option.id)}
                          className="sr-only"
                        />
                        <Icon className="w-5 h-5 text-neutral-700" />
                        <span className="font-medium text-neutral-900">{option.label}</span>
                      </label>
                    );
                  })}
                </div>

                {savedPayments.length > 0 && (
                  <p className="text-xs text-neutral-500 mt-3">
                    You have {savedPayments.length} saved payment method(s) in your account.
                  </p>
                )}
              </section>
            </div>

            <aside className="bg-white rounded-2xl border border-neutral-200 p-6 h-fit sticky top-24">
              <h2 className="text-xl font-bold text-neutral-900 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-medium">Rs {Number(summary?.subtotal ?? cartSummary.subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="font-medium">Rs {Number(summary?.shipping ?? cartSummary.shipping).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-neutral-100">
                  <span className="font-bold text-neutral-900">Total</span>
                  <span className="font-bold">Rs {Number(summary?.total ?? cartSummary.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing || !selectedAddress}
                className="w-full mt-6 py-4 rounded-full bg-neutral-900 text-white font-bold disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                {placing ? "Placing order..." : "Place Order"}
              </button>

              <Link href="/checkout/address" className="block mt-4 text-center text-sm text-neutral-500">
                Back to Address
              </Link>
            </aside>
          </div>
        )}

        {/* Razorpay Payment Checkout */}
        <RazorpayCheckout
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          order={orderData}
          onSuccess={handlePaymentSuccess}
          onFailed={handlePaymentFailed}
          userInfo={userInfo}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
