import { apiRequest } from "../apiClient";
import { products as fallbackProducts, categories as fallbackCategories } from "../../constants/products";

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

const normalizeFallbackProduct = (item) => ({
  ...item,
  slug: item.slug || item.id,
  categorySlug: item.categorySlug || item.category,
  thumbnail: item.thumbnail || item.images?.[0] || "",
  images: Array.isArray(item.images) ? item.images : item.thumbnail ? [item.thumbnail] : [],
});

const sortFallbackProducts = (items, sort = "featured") => {
  const sorted = [...items];

  switch (sort) {
    case "newest":
      sorted.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
      break;
    case "price-low":
      sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      break;
    case "price-high":
      sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      break;
    case "rating":
      sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      break;
    default:
      sorted.sort((a, b) => {
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      });
  }

  return sorted;
};

const getFallbackProducts = (filters = {}) => {
  let filtered = fallbackProducts.map(normalizeFallbackProduct);

  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters.gender) {
    filtered = filtered.filter(
      (p) => String(p.gender || "").toLowerCase() === String(filters.gender).toLowerCase(),
    );
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => Number(p.price || 0) >= Number(filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => Number(p.price || 0) <= Number(filters.maxPrice));
  }

  if (filters.search) {
    const searchText = String(filters.search).toLowerCase();
    filtered = filtered.filter((p) => {
      const haystack = [p.name, p.description, p.category, p.brand]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchText);
    });
  }

  if (filters.inStock) {
    filtered = filtered.filter((p) => p.inStock);
  }

  const sorted = sortFallbackProducts(filtered, filters.sort);
  const page = Number(filters.page || 1);
  const limit = Number(filters.limit || 20);
  const start = (page - 1) * limit;
  const products = sorted.slice(start, start + limit);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    products,
    total,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

export const productsApi = {
  async getProducts(filters = {}) {
    try {
      const qs = makeQuery(mapFilters(filters));
      const res = await apiRequest(`/products${qs ? `?${qs}` : ""}`);
      const data = res.data || {};
      const products = Array.isArray(data.products)
        ? data.products.map(normalizeProduct)
        : [];

      if (products.length > 0) {
        return {
          products,
          total: data.pagination?.total || products.length,
          pagination: data.pagination || null,
        };
      }
    } catch {
      // Fall back to local catalog when backend data is unavailable.
    }

    return getFallbackProducts(filters);
  },

  async getProductBySlug(slug) {
    try {
      const res = await apiRequest(`/products/${slug}`);
      const product = res.data?.product || null;
      if (product) return normalizeProduct(product);
    } catch {
      // If backend doesn't know this product, check local fallback data.
    }

    const fallback = fallbackProducts
      .map(normalizeFallbackProduct)
      .find((item) => item.slug === slug || item.id === slug);

    if (fallback) return fallback;
    throw new Error("Product not found");
  },

  async getRelatedProducts(productId, limit = 4) {
    try {
      const res = await apiRequest(`/products/${productId}/related?limit=${limit}`);
      const products = res.data?.products || [];
      if (products.length > 0) {
        return products.map(normalizeProduct);
      }
    } catch {
      // Fall through to local related products.
    }

    const allFallback = fallbackProducts.map(normalizeFallbackProduct);
    const currentProduct = allFallback.find((product) => product.id === productId || product.slug === productId);

    if (!currentProduct) {
      return allFallback.filter((product) => product.id !== productId).slice(0, limit);
    }

    return allFallback
      .filter(
        (product) =>
          product.id !== currentProduct.id
          && (product.category === currentProduct.category || product.gender === currentProduct.gender),
      )
      .slice(0, limit);
  },

  async getFeaturedProducts(limit = 8) {
    try {
      const res = await apiRequest(`/products/featured?limit=${limit}`);
      const products = res.data?.products || [];
      if (products.length > 0) {
        return products.map(normalizeProduct);
      }
    } catch {
      // Fall through to local featured products.
    }

    return fallbackProducts
      .map(normalizeFallbackProduct)
      .filter((product) => product.isBestseller || product.isNew)
      .slice(0, limit);
  },

  async getCategories() {
    try {
      const res = await apiRequest("/products/categories");
      const categories = res.data?.categories || [];

      if (categories.length > 0) {
        return [
          { id: "all", name: "All", count: categories.reduce((acc, c) => acc + (c.productCount || 0), 0) },
          ...categories.map((category) => ({
            id: category.slug,
            name: category.name,
            count: category.productCount || 0,
          })),
        ];
      }
    } catch {
      // Fall through to local categories.
    }

    return fallbackCategories;
  },

  async getFilters() {
    const res = await apiRequest("/products/filters");
    return res.data || {};
  },
};
