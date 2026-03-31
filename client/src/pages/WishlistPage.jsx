import React, { useEffect } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Link, useRouter } from "../hooks/useRouter.jsx";
import useAuthStore from "../store/authStore";
import useWishlistStore from "../store/wishlistStore";
import { useToast } from "../hooks/useToast";

const WishlistPage = () => {
  const { navigate } = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const items = useWishlistStore((s) => s.items);
  const loading = useWishlistStore((s) => s.loading);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const { info: showInfo, error: showError, success: showSuccess } = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      showInfo("Please login to access wishlist.");
      navigate("/products");
      return;
    }
    fetchWishlist().catch((err) => showError(err.message || "Failed to load wishlist"));
  }, [isLoggedIn, fetchWishlist, navigate, showError, showInfo]);

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-6 h-6 text-rose-500" />
          <h1 className="text-3xl font-bold text-neutral-900">My Wishlist</h1>
        </div>

        {loading && <div className="bg-white p-6 rounded-xl text-neutral-500">Loading wishlist...</div>}

        {!loading && items.length === 0 && (
          <div className="bg-white p-10 rounded-xl text-center">
            <p className="text-neutral-600 mb-4">Your wishlist is empty.</p>
            <Link href="/products" className="px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold">
              Browse Products
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <article key={item.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                <Link href={`/product/${item.product?.slug || item.productId}`}>
                  <img
                    src={item.product?.thumbnail}
                    alt={item.product?.name}
                    className="w-full aspect-square object-cover"
                  />
                </Link>
                <div className="p-4">
                  <p className="text-xs text-neutral-400 mb-1">{item.product?.brand}</p>
                  <Link href={`/product/${item.product?.slug || item.productId}`} className="font-bold text-neutral-900">
                    {item.product?.name}
                  </Link>
                  <p className="mt-2 text-lg font-semibold">Rs {Number(item.product?.basePrice || 0).toFixed(2)}</p>
                  <button
                    onClick={() =>
                      removeFromWishlist(item.id)
                        .then(() => showSuccess("Removed from wishlist"))
                        .catch((err) => showError(err.message || "Failed to remove item"))
                    }
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-rose-600 font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
