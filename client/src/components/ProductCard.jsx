import React, { useState, useCallback, useMemo } from "react";
import { Link } from "../hooks/useRouter.jsx";
import { Heart } from "lucide-react";

/**
 * ProductCard Component
 * Displays a single product in a grid/list view
 * Props are structured for easy backend integration
 * 
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const ProductCard = React.memo(({
  id,
  slug,
  name,
  brand,
  price,
  originalPrice,
  thumbnail,
  inStock,
  className = "",
  index = 0,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(prev => !prev);
    // TODO: Integrate with backend favorites API
  }, []);

  // Memoize animation style to prevent re-creation
  const animationStyle = useMemo(() => ({
    animationDelay: `${index * 100}ms`,
    animationFillMode: "backwards",
  }), [index]);

  const productPath = `/product/${slug || id}`;

  return (
    <Link href={productPath} className="block group">
      <article
        className={`relative rounded-3xl bg-white border border-neutral-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden animate-fade-in ${className}`}
        style={animationStyle}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <img
            src={thumbnail}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-3 min-w-[44px] min-h-[44px] rounded-full bg-white/90 backdrop-blur-sm border border-neutral-200/80 shadow-sm transition-all duration-200 hover:scale-105 flex items-center justify-center ${
              isFavorite ? "opacity-100" : "opacity-80 group-hover:opacity-100"
            }`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`h-5 w-5 transition-all duration-200 ${
                isFavorite
                  ? "fill-rose-500 text-rose-500"
                  : "text-neutral-500 hover:text-rose-500"
              }`}
            />
          </button>

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center">
              <span className="px-6 py-3 bg-white text-neutral-900 font-bold text-sm rounded-full">
                OUT OF STOCK
              </span>
            </div>
          )}

        </div>

        {/* Content */}
        <div className="p-5 border-t border-neutral-100">
          {/* Brand */}
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-2">
            {brand}
          </p>

          {/* Name */}
          <h3 className="text-xl font-semibold text-neutral-900 line-clamp-2 tracking-tight mb-4">
            {name}
          </h3>

          {/* Price Row */}
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-semibold text-neutral-900 tracking-tight">
              ₹{price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-base text-neutral-400 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.id === nextProps.id &&
    prevProps.price === nextProps.price &&
    prevProps.inStock === nextProps.inStock &&
    prevProps.index === nextProps.index
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
