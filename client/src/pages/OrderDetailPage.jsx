import React, { useEffect, useState } from "react";
import { Link, useRouter } from "../hooks/useRouter.jsx";
import useAuthStore from "../store/authStore";
import { ordersApi } from "../lib/api/ordersApi";
import showToast from "../utils/toast";
import { OrderDetailSkeleton } from "../components/skeletons/OrderDetailSkeleton";

const OrderDetailPage = () => {
  const { currentPath, navigate } = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = currentPath.split("/").pop();

  useEffect(() => {
    if (!isLoggedIn) {
      showToast.info("Please login to view order details.");
      navigate("/products");
      return;
    }

    let active = true;

    Promise.allSettled([ordersApi.getOrder(orderId), ordersApi.getOrderTracking(orderId)])
      .then(([orderRes, trackingRes]) => {
        if (!active) return;
        if (orderRes.status === "fulfilled") {
          setOrder(orderRes.value.data?.order || null);
        }
        if (trackingRes.status === "fulfilled") {
          setTracking(trackingRes.value.data?.tracking || trackingRes.value.data || null);
        }
      })
      .catch((err) => {
        if (active) showToast.error(err.message || "Failed to load order details");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, navigate, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50 p-8">
        <p className="text-neutral-600">Order not found.</p>
        <Link href="/orders" className="text-amber-600 underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <p className="text-xs text-neutral-500">{order.orderNumber}</p>
          <h1 className="text-2xl font-bold text-neutral-900 mt-1">Order Details</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-neutral-100 text-sm font-semibold">
            {order.status}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Items</h2>
          <div className="space-y-4">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img src={item.thumbnail} alt={item.productName} className="w-16 h-16 rounded-xl object-cover bg-neutral-100" />
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900">{item.productName}</p>
                  <p className="text-sm text-neutral-500">
                    Size {item.size} · {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">Rs {Number(item.totalPrice || 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-3">Shipping Address</h2>
            {order.shippingAddress ? (
              <>
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-neutral-600">{order.shippingAddress.addressLine1}</p>
                <p className="text-sm text-neutral-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-neutral-500">{order.shippingAddress.phoneNumber}</p>
              </>
            ) : (
              <p className="text-sm text-neutral-500">Address details unavailable.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-3">Payment</h2>
            {order.payment ? (
              <>
                <p className="text-sm text-neutral-600">Method: {order.payment.paymentMethod}</p>
                <p className="text-sm text-neutral-600">Status: {order.payment.status}</p>
                <p className="text-sm text-neutral-600">Amount: Rs {Number(order.payment.amount || 0).toFixed(2)}</p>
              </>
            ) : (
              <p className="text-sm text-neutral-500">Payment details unavailable.</p>
            )}
          </div>
        </div>

        {tracking && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-3">Tracking</h2>
            <p className="text-sm text-neutral-600">Carrier: {tracking.carrier || "N/A"}</p>
            <p className="text-sm text-neutral-600">Tracking #: {tracking.trackingNumber || "N/A"}</p>
            <p className="text-sm text-neutral-600">Status: {tracking.status || "N/A"}</p>
          </div>
        )}

        <Link href="/orders" className="inline-block text-sm text-neutral-600 hover:text-amber-600">
          Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailPage;
