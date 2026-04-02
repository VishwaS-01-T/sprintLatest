import { create } from 'zustand';
import { cartApi } from '../lib/api/cartApi';
import useAuthStore from './authStore';

const parseCartItem = (serverItem) => ({
  id: serverItem.id,
  productId: serverItem.productId,
  variantId: serverItem.variantId,
  name: serverItem.product?.name || 'Product',
  slug: serverItem.product?.slug || '',
  brand: serverItem.product?.brand || '',
  price: Number(serverItem.unitPrice || serverItem.variant?.price || 0),
  originalPrice: Number(serverItem.variant?.comparePrice || 0) || null,
  image: serverItem.product?.images?.[0]?.imageUrl || serverItem.product?.thumbnail || '',
  size: serverItem.size || serverItem.variant?.size || '',
  color: serverItem.color || serverItem.variant?.color || '',
  quantity: Number(serverItem.quantity || 1),
  inStock: (serverItem.variant?.status || '').toUpperCase() === 'ACTIVE',
  source: 'server',
});

/**
 * Cart Store using Zustand
 * Manages local cart state + syncs with backend when user is authenticated
 */
const useCartStore = create((set, get) => ({
  // Cart items array
  items: [],
  // Loading state
  loading: false,
  syncing: false,
  couponCode: '',
  cartSummary: null,
  // Notification state for "Added to Cart" popup
  notification: null,

  // Get total item count
  get itemCount() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Get cart summary
  getCartSummary: () => {
    const summary = get().cartSummary;
    if (summary) {
      const subtotal = Number(summary.subtotal || 0);
      const shipping = Number(summary.shipping || 0);
      const total = Number(summary.total || subtotal + shipping);
      const itemCount = Number(summary.itemCount || get().itemCount);
      return { subtotal, shipping, total, itemCount };
    }

    const { items } = get();
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 5000 ? 0 : 199;
    const total = subtotal + shipping;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, shipping, total, itemCount };
  },

  setCartSummary: (summary) => set({ cartSummary: summary || null }),

  fetchServerSummary: async () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if (!isLoggedIn) return;
    try {
      const res = await cartApi.getSummary();
      set({ cartSummary: res.data || null });
    } catch {
      set({ cartSummary: null });
    }
  },

  fetchServerCart: async () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if (!isLoggedIn) return;

    set({ loading: true });
    try {
      const res = await cartApi.getCart();
      const cart = res.data?.cart;
      const items = Array.isArray(cart?.items) ? cart.items.map(parseCartItem) : [];
      set({
        items,
        couponCode: cart?.appliedCoupon?.code || '',
      });
      await get().fetchServerSummary();
    } finally {
      set({ loading: false });
    }
  },

  syncLocalCartToServer: async () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if (!isLoggedIn) return;

    const localItems = get().items.filter((item) => item.source !== 'server' && item.variantId);
    if (localItems.length === 0) {
      await get().fetchServerCart();
      return;
    }

    set({ syncing: true });
    try {
      await cartApi.syncCart({
        sessionId: `guest-${Date.now()}`,
        items: localItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      });
      await get().fetchServerCart();
    } finally {
      set({ syncing: false });
    }
  },

  // Add item to cart
  addItem: async (product, selectedSize, selectedColor, quantity = 1) => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    const selectedVariant = Array.isArray(product.variants)
      ? product.variants.find(
          (variant) =>
            String(variant.size) === String(selectedSize) &&
            String(variant.color).toLowerCase() === String(selectedColor || '').toLowerCase(),
        ) || product.variants.find((variant) => String(variant.size) === String(selectedSize))
      : null;

    if (isLoggedIn && selectedVariant?.id) {
      await cartApi.addItem({
        variantId: selectedVariant.id,
        quantity,
        size: String(selectedSize),
        color: selectedColor || selectedVariant.color,
      });
      await get().fetchServerCart();
      set({
        notification: {
          product,
          size: selectedSize,
          color: selectedColor,
          quantity,
        },
      });
      return;
    }

    const { items } = get();

    // Check if same product + size + color already exists
    const existingIndex = items.findIndex(
      (item) =>
        item.productId === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    let updatedItems;
    if (existingIndex >= 0) {
      updatedItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem = {
        id: `${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
        productId: product.id,
        variantId: selectedVariant?.id || null,
        slug: product.slug || '',
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.thumbnail || product.images?.[0],
        size: selectedSize,
        color: selectedColor,
        quantity,
        inStock: product.inStock,
        source: 'local',
      };
      updatedItems = [...items, newItem];
    }

    set({
      items: updatedItems,
      notification: {
        product,
        size: selectedSize,
        color: selectedColor,
        quantity,
      },
    });

    // Auto-dismiss notification after 4 seconds
    setTimeout(() => {
      const current = get().notification;
      if (current && current.product.id === product.id) {
        set({ notification: null });
      }
    }, 4000);
  },

  // Remove item from cart
  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  removeItemAsync: async (itemId) => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    const item = get().items.find((i) => i.id === itemId);
    if (!item) return;

    if (isLoggedIn && item.source === 'server') {
      await cartApi.removeItem(itemId);
      await get().fetchServerCart();
      return;
    }

    get().removeItem(itemId);
  },

  // Update item quantity
  updateQuantity: (itemId, quantity) => {
    if (quantity < 1) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  updateQuantityAsync: async (itemId, quantity) => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    const item = get().items.find((i) => i.id === itemId);
    if (!item) return;

    if (quantity < 1) {
      await get().removeItemAsync(itemId);
      return;
    }

    if (isLoggedIn && item.source === 'server') {
      await cartApi.updateItem(itemId, { quantity });
      await get().fetchServerCart();
      return;
    }

    get().updateQuantity(itemId, quantity);
  },

  // Increment quantity
  incrementQuantity: (itemId) => {
    const item = get().items.find((i) => i.id === itemId);
    if (item) {
      get().updateQuantity(itemId, item.quantity + 1);
    }
  },

  incrementQuantityAsync: async (itemId) => {
    const item = get().items.find((i) => i.id === itemId);
    if (!item) return;
    await get().updateQuantityAsync(itemId, item.quantity + 1);
  },

  // Decrement quantity
  decrementQuantity: (itemId) => {
    const item = get().items.find((i) => i.id === itemId);
    if (item) {
      get().updateQuantity(itemId, item.quantity - 1);
    }
  },

  decrementQuantityAsync: async (itemId) => {
    const item = get().items.find((i) => i.id === itemId);
    if (!item) return;
    await get().updateQuantityAsync(itemId, item.quantity - 1);
  },

  // Clear entire cart
  clearCart: () => {
    set({ items: [], cartSummary: null, couponCode: '' });
  },

  clearCartAsync: async () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if (isLoggedIn) {
      await cartApi.clearCart();
      set({ items: [], cartSummary: null, couponCode: '' });
      return;
    }
    get().clearCart();
  },

  applyCouponAsync: async (couponCode) => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if (!isLoggedIn) return;
    await cartApi.applyCoupon(couponCode);
    set({ couponCode });
    await get().fetchServerCart();
  },

  removeCouponAsync: async () => {
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    if (!isLoggedIn) return;
    await cartApi.removeCoupon();
    set({ couponCode: '' });
    await get().fetchServerCart();
  },

  // Dismiss notification
  dismissNotification: () => {
    set({ notification: null });
  },
}));

export default useCartStore;
