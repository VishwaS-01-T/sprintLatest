import React, { useEffect, useState } from "react";
import { Package, ArrowRight, Clock, CheckCircle, AlertCircle, Truck } from "lucide-react";
import { Link, useRouter } from "../hooks/useRouter.jsx";
import useAuthStore from "../store/authStore";
import { ordersApi } from "../lib/api/ordersApi";
import showToast from "../utils/toast";
import { OrdersListSkeleton } from "../components/skeletons/OrderCardSkeleton";
import { EmptyState } from "../components/EmptyState";

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
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}>
      <Icon className="w-4 h-4" />
      <span className={`text-sm font-semibold ${config.text}`}>{status}</span>
    </div>
  );
};

const ItemPreview = ({ items, navigate }) => {
  const previewItems = items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <div className="flex items-center gap-2.5">
      {previewItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/product/${item.productSlug || item.productId}`);
          }}
          className="relative shrink-0 w-20 h-20 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden hover:border-amber-400 hover:shadow-md transition-all duration-300 cursor-pointer"
          title={item.productName}
        >
          {item.thumbnail ? (
            <img src={item.thumbnail} alt={item.productName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-8 h-8 text-neutral-300" />
            </div>
          )}
          {item.quantity > 1 && (
            <span className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full bg-amber-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
              {item.quantity}
            </span>
          )}
        </button>
      ))}

      {hasMore && (
        <div className="w-20 h-20 rounded-2xl bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center shrink-0 text-xs font-bold text-neutral-600">
          +{items.length - 3}
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const { navigate } = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      showToast.info("Please login to view orders.");
      navigate("/products");
      return;
    }

    let active = true;
    ordersApi
      .listOrders({ page: 1, limit: 20 })
      .then((res) => {
        if (active) setOrders(res.data?.orders || []);
      })
      .catch((err) => {
        if (active) showToast.error(err.message || "Failed to fetch orders");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-neutral-900 mb-1">My Orders</h1>
          <p className="text-sm sm:text-base text-neutral-600">Track your purchases and delivery status</p>
        </div>

        {loading && <OrdersListSkeleton count={3} />}

        {!loading && orders.length === 0 && (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="You haven't placed any orders. Start shopping to see your orders here."
            action={
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all duration-300"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
            }
          />
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="group block bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 hover:shadow-lg hover:border-amber-300 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">{order.orderNumber}</p>
                    <p className="text-base sm:text-lg font-bold text-neutral-900 mt-0.5">
                      Order placed on{" "}
                      <span className="text-amber-600">
                        {order.placedAt
                          ? new Date(order.placedAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Invalid Date"}
                      </span>
                    </p>
                  </div>
                  <StatusBadge status={order.status || "PENDING"} />
                </div>

                <div className="border-t border-neutral-100 pt-3">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2.5">Items ({order.itemCount})</p>
                  <div className="flex items-center justify-between gap-3">
                    <ItemPreview items={order.items || []} navigate={navigate} />
                    <div className="flex items-center gap-2 text-neutral-500 group-hover:text-amber-600 transition-colors shrink-0">
                      <span className="text-sm font-medium hidden sm:inline">View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">Order Total</p>
                    <p className="text-lg sm:text-xl font-bold text-neutral-900">
                      Rs {Number(order.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-sm font-semibold">
                    <Package className="w-4 h-4" />
                    <span>
                      {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
