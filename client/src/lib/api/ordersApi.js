import { apiRequest } from "../apiClient";

export const ordersApi = {
  validateCheckout: (payload) =>
    apiRequest("/orders/checkout/validate", {
      method: "POST",
      auth: true,
      body: payload,
    }),
  createCheckoutOrder: (payload) =>
    apiRequest("/orders/checkout/create", {
      method: "POST",
      auth: true,
      body: payload,
    }),
  processPayment: (orderId, payload) =>
    apiRequest(`/orders/checkout/${orderId}/pay`, {
      method: "POST",
      auth: true,
      body: payload,
    }),
  listOrders: ({ page = 1, limit = 10, status } = {}) => {
    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("limit", String(limit));
    if (status) query.set("status", status);
    return apiRequest(`/orders?${query.toString()}`, { auth: true });
  },
  getOrder: (orderId) => apiRequest(`/orders/${orderId}`, { auth: true }),
  getOrderStats: () => apiRequest("/orders/stats", { auth: true }),
  getUpcomingOrders: () => apiRequest("/orders/upcoming", { auth: true }),
  cancelOrder: (orderId, reason) =>
    apiRequest(`/orders/${orderId}/cancel`, {
      method: "PATCH",
      auth: true,
      body: reason ? { reason } : {},
    }),
  updateOrderAddress: (orderId, shippingAddressId) =>
    apiRequest(`/orders/${orderId}/address`, {
      method: "PATCH",
      auth: true,
      body: { addressId: shippingAddressId },
    }),
  getOrderTracking: (orderId) => apiRequest(`/orders/${orderId}/tracking`, { auth: true }),
  reorder: (orderId) => apiRequest(`/orders/${orderId}/reorder`, { method: "POST", auth: true }),
  getOrderInvoice: (orderId) => apiRequest(`/orders/${orderId}/invoice`, { auth: true }),
};
