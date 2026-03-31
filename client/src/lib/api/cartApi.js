import { apiRequest } from "../apiClient";

export const cartApi = {
  getCart: () => apiRequest("/cart", { auth: true }),
  clearCart: () => apiRequest("/cart", { method: "DELETE", auth: true }),
  addItem: (payload) => apiRequest("/cart/items", { method: "POST", auth: true, body: payload }),
  updateItem: (itemId, payload) =>
    apiRequest(`/cart/items/${itemId}`, { method: "PATCH", auth: true, body: payload }),
  removeItem: (itemId) =>
    apiRequest(`/cart/items/${itemId}`, { method: "DELETE", auth: true }),
  applyCoupon: (couponCode) =>
    apiRequest("/cart/coupon", {
      method: "POST",
      auth: true,
      body: { couponCode },
    }),
  removeCoupon: () => apiRequest("/cart/coupon", { method: "DELETE", auth: true }),
  getSummary: () => apiRequest("/cart/summary", { auth: true }),
  syncCart: (payload) => apiRequest("/cart/sync", { method: "POST", auth: true, body: payload }),
};
