import React from "react";
import ProductCard from "./ProductCard";
import { Package, AlertTriangle, RefreshCw } from "lucide-react";

/**
 * ProductGrid Component
 * Renders a grid of products with loading and empty states
 */
const ProductGrid = ({
  products = [],
  loading = false,
  error = null,
  columns = 4,
  emptyMessage = "No products found",
  className = "",
  onRetry,
}) => {
  // Loading skeleton
  if (loading) {
    return (
      <div className={`grid gap-6 ${getGridCols(columns)} ${className}`}>
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-neutral-600 text-center mb-6 max-w-md">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-neutral-400" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-neutral-600 text-center max-w-md">
          Try adjusting your filters or search terms to find what you're looking
          for
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${getGridCols(columns)} ${className}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} {...product} index={index} />
      ))}
    </div>
  );
};

// Get Tailwind grid columns class
function getGridCols(columns) {
  const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };
  return colsMap[columns] || colsMap[4];
}

// Loading skeleton component
const ProductCardSkeleton = ({ index = 0 }) => (
  <div
    className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="aspect-square bg-gradient-to-br from-neutral-200 to-neutral-100" />
    <div className="p-5 space-y-4">
      <div className="h-3 bg-neutral-200 rounded-full w-1/4" />
      <div className="h-5 bg-neutral-200 rounded-full w-3/4" />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-neutral-200 rounded" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-6 bg-neutral-200 rounded-full w-20" />
        <div className="h-4 bg-neutral-100 rounded-full w-14" />
      </div>
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-5 h-5 bg-neutral-200 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);

export default ProductGrid;
