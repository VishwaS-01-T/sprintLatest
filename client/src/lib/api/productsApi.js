import { apiRequest } from "../apiClient";

const SORT_MAP = {
  featured: "popular",
  newest: "newest",
  "price-low": "price",
  "price-high": "price",
  rating: "popular",
};

const ORDER_MAP = {
  featured: "desc",
  newest: "desc",
  "price-low": "asc",
  "price-high": "desc",
  rating: "desc",
};

const toDisplayCategory = (value) => {
  if (!value) return "";
  return String(value)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const normalizeProduct = (item) => {
  const images = Array.isArray(item.images)
    ? item.images
        .map((img) => (typeof img === "string" ? img : img?.imageUrl))
        .filter(Boolean)
    : [];

  const variants = Array.isArray(item.variants) ? item.variants : [];
  const availableSizes = item.availableSizes || variants.map((v) => v.size).filter(Boolean);
  const availableColors = item.availableColors || variants.map((v) => v.color).filter(Boolean);
  const price = Number(item.minVariantPrice || item.basePrice || variants[0]?.price || 0);
  const originalPrice = Number(item.maxVariantPrice || variants[0]?.comparePrice || 0);

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    brand: item.brand,
    categorySlug: item.categorySlug || item.category || "",
    category: item.category || toDisplayCategory(item.categorySlug),
    price,
    originalPrice: originalPrice > price ? originalPrice : null,
    thumbnail: item.thumbnail || images[0] || "",
    images: images.length ? images : item.thumbnail ? [item.thumbnail] : [],
    colors: [...new Set(availableColors)],
    sizes: [...new Set(availableSizes)],
    inStock:
      variants.length > 0
        ? variants.some((v) => Number(v?.inventory?.availableStock || 0) > 0)
        : true,
    isNew: Boolean(item.newArrival),
    isBestseller: Boolean(item.featuredProduct),
    description: item.description || item.shortDescription || "",
    rating: Number(item.averageRating || 0),
    reviewCount: Number(item.reviewCount || 0),
    variants,
  };
};

const makeQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });
  return query.toString();
};

const mapFilters = (filters = {}) => {
  const sort = filters.sort || "featured";
  return {
    page: filters.page || 1,
    limit: filters.limit || 20,
    category: filters.category && filters.category !== "all" ? filters.category : undefined,
    gender: filters.gender ? String(filters.gender).toUpperCase() : undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    search: filters.search || undefined,
    sortBy: SORT_MAP[sort] || "popular",
    order: ORDER_MAP[sort] || "desc",
  };
};

export const productsApi = {
  async getProducts(filters = {}) {
    const qs = makeQuery(mapFilters(filters));
    const res = await apiRequest(`/products${qs ? `?${qs}` : ""}`);
    const data = res.data || {};
    const products = Array.isArray(data.products)
      ? data.products.map(normalizeProduct)
      : [];

    return {
      products,
      total: data.pagination?.total || products.length,
      pagination: data.pagination || null,
    };
  },

  async getProductBySlug(slug) {
    const res = await apiRequest(`/products/${slug}`);
    const product = res.data?.product || null;
    if (!product) throw new Error("Product not found");
    return normalizeProduct(product);
  },

  async getRelatedProducts(productId, limit = 4) {
    const res = await apiRequest(`/products/${productId}/related?limit=${limit}`);
    const products = res.data?.products || [];
    return products.map(normalizeProduct);
  },

  async getFeaturedProducts(limit = 8) {
    const res = await apiRequest(`/products/featured?limit=${limit}`);
    const products = res.data?.products || [];
    return products.map(normalizeProduct);
  },

  async getCategories() {
    const res = await apiRequest("/products/categories");
    const categories = res.data?.categories || [];
    return [
      { id: "all", name: "All", count: categories.reduce((acc, c) => acc + (c.productCount || 0), 0) },
      ...categories.map((category) => ({
        id: category.slug,
        name: category.name,
        count: category.productCount || 0,
      })),
    ];
  },

  async getFilters() {
    const res = await apiRequest("/products/filters");
    return res.data || {};
  },
};
