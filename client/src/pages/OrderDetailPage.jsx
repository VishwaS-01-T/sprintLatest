import React, { useEffect, useState } from "react";
import { Link, useRouter } from "../hooks/useRouter.jsx";
import useAuthStore from "../store/authStore";
import { ordersApi } from "../lib/api/ordersApi";
import showToast from "../utils/toast";
import { OrderDetailSkeleton } from "../components/skeletons/OrderDetailSkeleton";
import { ArrowLeft, MapPin, CreditCard, Truck, Package, Clock, CheckCircle, AlertCircle } from "lucide-react";

// Status badge component with color coding
const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", icon: Clock },
    CONFIRMED: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: CheckCircle },
    PROCESSING: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: Truck },
    SHIPPED: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: Truck },
    DELIVERED: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: CheckCircle },
    CANCELLED: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: AlertCircle },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.border}`}>
      <Icon className="w-5 h-5" />
      <span className={`text-sm font-bold ${config.text}`}>{status}</span>
    </div>
  );
};

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
      <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Order not found.</p>
          <Link href="/orders" className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700">
            <ArrowLeft className="w-4 h-4" />
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-neutral-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/orders" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 font-semibold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Order ID</p>
              <p className="text-2xl font-bold text-neutral-900 mt-1">{order.orderNumber}</p>
              <p className="text-sm text-neutral-600 mt-2">
                Placed on{" "}
                <span className="font-semibold text-neutral-900">
                  {order.placedAt
                    ? new Date(order.placedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                </span>
              </p>
            </div>
            <StatusBadge status={order.status || order.orderStatus || "PENDING"} />
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Items Ordered</h2>
          <p className="text-neutral-600 mb-6">({order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""})</p>

          <div className="space-y-4">
            {(order.items || []).map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.productSlug || item.productId}`)}
                className="group flex gap-6 p-5 rounded-2xl border border-neutral-200 hover:border-amber-400 hover:shadow-md transition-all duration-300 cursor-pointer bg-neutral-50 hover:bg-amber-50"
              >
                {/* Product Image */}
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200 group-hover:border-amber-300 transition-colors">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-neutral-300" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                    {item.productName}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {item.size && (
                      <span className="px-3 py-1 rounded-lg bg-neutral-200 text-sm font-semibold text-neutral-700">
                        Size {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="px-3 py-1 rounded-lg bg-neutral-200 text-sm font-semibold text-neutral-700 capitalize">
                        {item.color}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-lg bg-amber-100 text-sm font-bold text-amber-700">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="text-xs text-neutral-500 mb-1">Unit Price</p>
                  <p className="text-sm font-semibold text-neutral-700">
                    Rs {Number(item.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 mt-2">
                    Rs {Number(item.totalPrice || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-blue-100">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Shipping Address</h3>
            </div>
            {order.shippingAddress ? (
              <div className="space-y-2 text-sm">
                <p className="font-bold text-neutral-900">{order.shippingAddress.fullName}</p>
                <p className="text-neutral-600">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-neutral-600">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-neutral-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                </p>
                <p className="font-semibold text-neutral-700 pt-2">{order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Address details unavailable.</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-green-100">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Payment</h3>
            </div>
            {order.payment ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider">Method</p>
                  <p className="text-lg font-bold text-neutral-900 mt-1">{order.payment.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider">Status</p>
                  <p className="text-sm font-semibold mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
                        order.payment.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : order.payment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.payment.status}
                    </span>
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider">Amount</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-2">
                    Rs {Number(order.payment.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Payment details unavailable.</p>
            )}
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-purple-100">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Tracking</h3>
            </div>
            {tracking ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider">Carrier</p>
                  <p className="text-lg font-semibold text-neutral-900 mt-1">{tracking.carrier || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider">Tracking #</p>
                  <p className="text-sm font-mono text-neutral-700 mt-1">{tracking.trackingNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider">Status</p>
                  <p className="text-sm font-semibold text-neutral-700 mt-1">{tracking.status || "N/A"}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Tracking info not available yet.</p>
            )}
          </div>
        </div>

        {/* Order Totals */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 mb-6">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-neutral-600">Subtotal</p>
              <p className="font-semibold text-neutral-900">
                Rs {Number(order.subtotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-neutral-600">Tax</p>
              <p className="font-semibold text-neutral-900">
                Rs {Number(order.taxAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-neutral-600">Shipping</p>
              <p className="font-semibold text-neutral-900">
                Rs {Number(order.shippingCost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-neutral-600">Discount</p>
                <p className="font-semibold text-green-600">
                  -Rs {Number(order.discountAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
            <div className="pt-4 border-t-2 border-neutral-200 flex justify-between items-center">
              <p className="text-lg font-bold text-neutral-900">Total Amount</p>
              <p className="text-3xl font-bold text-amber-600">
                Rs {Number(order.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
