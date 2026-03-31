import React, { useEffect, useMemo } from "react";
import { useRouter } from "../hooks/useRouter.jsx";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";
import ProductFilters, { SortDropdown } from "../components/ProductFilters";
import { ChevronRight } from "lucide-react";
import { Link } from "../hooks/useRouter.jsx";

/**
 * ProductsPage Component
 * Main products listing page with filters and sorting
 */
const ProductsPage = () => {
  const { getParam, routeKey } = useRouter();

  // Get filters from URL - using routeKey to force recalculation on route change
  const urlFilters = useMemo(
    () => ({
      category: getParam("category") || "all",
      gender: getParam("gender") || null,
      sort: getParam("sort") || "featured",
      page: getParam("page") ? Number(getParam("page")) : 1,
      limit: getParam("limit") ? Number(getParam("limit")) : 20,
      minPrice: getParam("minPrice") ? Number(getParam("minPrice")) : undefined,
      maxPrice: getParam("maxPrice") ? Number(getParam("maxPrice")) : undefined,
      inStock: getParam("inStock") === "true" || undefined,
      search: getParam("search") || "",
    }),
    [getParam, routeKey],
  );

  const {
    products,
    loading,
    error,
    total,
    pagination,
    filters,
    updateFilters,
    resetFilters,
    setFilters,
  } = useProducts(urlFilters);

  // Sync URL params to filters when URL changes
  useEffect(() => {
    setFilters(urlFilters);
  }, [urlFilters, setFilters]);

  // Sync filters to URL (only when filters change from UI, not from URL)
  useEffect(() => {
    const params = {};
    if (filters.category && filters.category !== "all")
      params.category = filters.category;
    if (filters.gender) params.gender = filters.gender;
    if (filters.sort && filters.sort !== "featured") params.sort = filters.sort;
    if (filters.page && Number(filters.page) > 1) params.page = filters.page;
    if (filters.limit && Number(filters.limit) !== 20) params.limit = filters.limit;
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.inStock) params.inStock = "true";
    if (filters.search) params.search = filters.search;

    // Update URL without navigation
    const url = new URL("/products", window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.history.replaceState({}, "", url.toString());
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    updateFilters({ ...newFilters, page: 1 });
  };

  const handleReset = () => {
    resetFilters();
  };

  // Get page title based on filters
  const getPageTitle = () => {
    if (filters.search) return `Search: "${filters.search}"`;
    if (filters.gender && filters.category !== "all") {
      return `${filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1)}'s ${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Shoes`;
    }
    if (filters.gender) {
      return `${filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1)}'s Shoes`;
    }
    if (filters.category && filters.category !== "all") {
      return `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Shoes`;
    }
    return "All Products";
  };

  return (
    <div className="min-h-screen bg-neutral-50 page-transition">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 mb-4 sm:mb-6 animate-fade-in overflow-x-auto">
            <Link href="/" className="hover:text-neutral-900 transition-all duration-[250ms] ease cursor-pointer">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 font-medium">Products</span>
            {filters.gender && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium capitalize">
                  {filters.gender}
                </span>
              </>
            )}
            {filters.category && filters.category !== "all" && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-neutral-900 font-medium capitalize">
                  {filters.category}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-neutral-900 animate-slide-up">
                {getPageTitle()}
              </h1>

            {/* Desktop Sort */}
            <div className="hidden lg:flex items-center gap-4 animate-fade-in">
              <span className="text-sm text-muted">{total} products</span>
              <SortDropdown
                value={filters.sort || "featured"}
                onChange={(sortId) => handleFilterChange({ sort: sortId })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-10">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 animate-slide-up">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
                totalProducts={total}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Mobile Filters */}
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              totalProducts={total}
              className="lg:hidden mb-6"
            />

            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              columns={3}
              emptyMessage={
                filters.search
                  ? `No products found for "${filters.search}"`
                  : "No products found"
              }
            />

            {/* Load More - For pagination integration */}
            {products.length > 0 && pagination?.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3 animate-fade-in">
                <button
                  disabled={loading || (pagination?.page || 1) <= 1}
                  onClick={() => updateFilters({ page: (pagination?.page || 1) - 1 })}
                  className="px-6 py-2.5 text-sm font-semibold text-neutral-900 bg-white border-2 border-neutral-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-500 hover:text-amber-600 transition-all duration-[250ms] ease cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-sm text-muted">
                  Page {pagination?.page || 1} of {pagination?.totalPages || 1}
                </span>
                <button
                  disabled={loading || (pagination?.page || 1) >= (pagination?.totalPages || 1)}
                  onClick={() => updateFilters({ page: (pagination?.page || 1) + 1 })}
                  className="px-6 py-2.5 text-sm font-semibold text-neutral-900 bg-white border-2 border-neutral-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-500 hover:text-amber-600 transition-all duration-[250ms] ease cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
