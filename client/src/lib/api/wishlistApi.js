import { apiRequest } from "../apiClient";

export const wishlistApi = {
  getWishlist: () => apiRequest("/wishlist", { auth: true }),
  clearWishlist: () => apiRequest("/wishlist", { method: "DELETE", auth: true }),
  addItem: (productId) =>
    apiRequest("/wishlist/items", {
      method: "POST",
      auth: true,
      body: { productId },
    }),
  removeItem: (itemId) =>
    apiRequest(`/wishlist/items/${itemId}`, { method: "DELETE", auth: true }),
  checkProduct: (productId) => apiRequest(`/wishlist/check/${productId}`, { auth: true }),
  moveToCart: (itemId, payload) =>
    apiRequest(`/wishlist/items/${itemId}/move-to-cart`, {
      method: "POST",
      auth: true,
      body: payload,
    }),
};
