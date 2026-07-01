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

const getInitialLocalItems = () => {
  try {
    return JSON.parse(localStorage.getItem('sprint_wishlist') || '[]');
  } catch (e) {
    return [];
  }
};

const useWishlistStore = create((set, get) => ({
  items: [],
  localItems: getInitialLocalItems(),
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

  toggleWishlist: async (productId) => {
    const { items, localItems } = get();
    const isLoggedIn = useAuthStore.getState().isLoggedIn;

    if (isLoggedIn) {
      const existingItem = items.find((i) => i.productId === productId);
      if (existingItem) {
        await get().removeFromWishlist(existingItem.id);
        return { added: false, isLocal: false };
      } else {
        await get().addToWishlist(productId);
        return { added: true, isLocal: false };
      }
    } else {
      const isLocalAdded = localItems.includes(productId);
      let newLocalItems;
      if (isLocalAdded) {
        newLocalItems = localItems.filter((id) => id !== productId);
      } else {
        newLocalItems = [...localItems, productId];
      }
      localStorage.setItem('sprint_wishlist', JSON.stringify(newLocalItems));
      set({ localItems: newLocalItems });
      return { added: !isLocalAdded, isLocal: true };
    }
  },
}));

export default useWishlistStore;
