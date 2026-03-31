import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { Link, useRouter } from "../hooks/useRouter.jsx";
import useAuthStore from "../store/authStore";
import { ordersApi } from "../lib/api/ordersApi";
import { useToast } from "../hooks/useToast";

const OrdersPage = () => {
  const { navigate } = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { info: showInfo, error: showError } = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      showInfo("Please login to view orders.");
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
        if (active) showError(err.message || "Failed to fetch orders");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, navigate, showError, showInfo]);

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">My Orders</h1>

        {loading && <div className="bg-white rounded-xl p-6 text-neutral-500">Loading orders...</div>}

        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center">
            <Package className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 mb-4">No orders yet.</p>
            <Link href="/products" className="px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold">
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white border border-neutral-200 rounded-xl p-5 hover:border-amber-400 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-neutral-500">{order.orderNumber}</p>
                    <p className="font-bold text-neutral-900 mt-1">{order.status}</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Rs {Number(order.totalAmount || 0).toFixed(2)}</p>
                    <p className="text-xs text-neutral-500">{order.itemCount || 0} items</p>
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
