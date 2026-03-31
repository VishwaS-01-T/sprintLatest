import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Link } from '../hooks/useRouter.jsx';
import useCartStore from '../store/cartStore';

/**
 * AddedToCartNotification — A slide-in popup shown when a product is added to cart.
 * Inspired by Nike's "Added to Bag" modal (image 2).
 */
const AddedToCartNotification = () => {
  const notification = useCartStore((s) => s.notification);
  const dismissNotification = useCartStore((s) => s.dismissNotification);
  const items = useCartStore((s) => s.items);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!notification) return null;

  const { product, size, color, quantity } = notification;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[90] transition-opacity"
        onClick={dismissNotification}
      />

      {/* Notification Panel */}
      <div className="fixed top-4 right-4 z-[100] w-full max-w-sm animate-slide-in-right">
        <div className="bg-white rounded-[20px] shadow-[var(--shadow-soft)] border border-neutral-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-bold text-neutral-900 text-sm">Added to Bag</span>
            </div>
            <button
              onClick={dismissNotification}
               className="p-1 hover:bg-neutral-100 rounded-full transition-all duration-[250ms] ease cursor-pointer"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex gap-4 p-5">
            {/* Product Image */}
            <div className="shrink-0 w-20 h-20 rounded-[20px] bg-neutral-100 overflow-hidden">
              <img
                src={product.thumbnail || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.04]"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-neutral-900 text-sm leading-tight truncate">
                {product.name}
              </h4>
              <p className="text-xs text-muted mt-0.5">{product.brand}</p>
              <p className="text-xs text-muted mt-1">
                Size {size}
                {color && ` · ${color}`}
                {quantity > 1 && ` · Qty: ${quantity}`}
              </p>
              <p className="font-bold text-neutral-900 text-sm mt-2">
                ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 pb-5">
            <Link
              href="/cart"
              onClick={dismissNotification}
              className="flex items-center justify-center w-full py-2.5 px-6 bg-neutral-900 text-white font-bold text-sm rounded-[20px] hover:bg-neutral-800 hover:shadow-[var(--shadow-soft)] transition-all duration-[250ms] ease cursor-pointer"
            >
              View Bag ({itemCount})
            </Link>
            <Link
              href={`/product/${product.slug || product.id}`}
              onClick={dismissNotification}
              className="mt-2 flex items-center justify-center w-full py-2.5 text-sm font-semibold text-neutral-700 hover:text-amber-600 transition-all duration-[250ms] ease cursor-pointer"
            >
              Continue shopping this item
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddedToCartNotification;
