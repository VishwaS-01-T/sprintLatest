import { create } from "zustand";
import { wishlistApi } from "../lib/api/wishlistApi";
import useAuthStore from "./authStore";

const mapWishlistItem = (item) => ({
  id: item.id,
  productId: item.productId,
  addedAt: item.addedAt,
  product: item.product,
  priceAlert: item.priceAlert || null,
});

const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async () => {
    if (!useAuthStore.getState().isLoggedIn) return;
    set({ loading: true });
    try {
      const res = await wishlistApi.getWishlist();
      const items = (res.data?.wishlist?.items || []).map(mapWishlistItem);
      set({ items });
    } finally {
      set({ loading: false });
    }
  },

  addToWishlist: async (productId) => {
    await wishlistApi.addItem(productId);
    await get().fetchWishlist();
  },

  removeFromWishlist: async (itemId) => {
    await wishlistApi.removeItem(itemId);
    set((state) => ({ items: state.items.filter((item) => item.id !== itemId) }));
  },
}));

export default useWishlistStore;
