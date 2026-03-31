// Product data - easily replaceable with backend API
export const products = [
  {
    id: "shoe-1",
    name: "X Lows Armstrong",
    brand: "Classic Shoes",
    category: "lifestyle",
    gender: "men",
    price: 189.99,
    originalPrice: 219.99,
    rating: 4.8,
    reviewCount: 234,
    colors: ["black", "white", "navy"],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    images: ["/assets/shoes/shoe-10.avif", "/assets/shoes/shoe-11.avif"],
    thumbnail: "/assets/shoes/shoe-10.avif",
    description:
      "Defying gravity with every step. The X Lows Armstrong features premium materials and cutting-edge design for ultimate comfort and style.",
    features: [
      "Premium leather upper",
      "Responsive cushioning",
      "Durable rubber outsole",
      "Breathable mesh lining",
    ],
    isNew: true,
    isBestseller: false,
    inStock: true,
    tags: ["new-arrival", "premium"],
  },
  {
    id: "shoe-2",
    name: "Air Runner Pro",
    brand: "Classic Shoes",
    category: "running",
    gender: "men",
    price: 159.99,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 189,
    colors: ["red", "black", "white"],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: ["/assets/shoes/shoe-5.avif", "/assets/shoes/shoe-6.avif"],
    thumbnail: "/assets/shoes/shoe-5.avif",
    description:
      "Engineered for speed and endurance. The Air Runner Pro delivers exceptional performance with advanced cushioning technology.",
    features: [
      "Lightweight mesh upper",
      "Air cushioning unit",
      "Responsive foam midsole",
      "High-traction outsole",
    ],
    isNew: false,
    isBestseller: true,
    inStock: true,
    tags: ["bestseller", "running"],
  },
  {
    id: "shoe-3",
    name: "Urban Street Elite",
    brand: "Classic Shoes",
    category: "lifestyle",
    gender: "women",
    price: 139.99,
    originalPrice: 169.99,
    rating: 4.9,
    reviewCount: 312,
    colors: ["white", "pink", "beige"],
    sizes: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5],
    images: ["/assets/shoes/shoe-6.avif", "/assets/shoes/shoe-7.avif"],
    thumbnail: "/assets/shoes/shoe-6.avif",
    description:
      "Street-ready style meets all-day comfort. The Urban Street Elite is your perfect companion for city adventures.",
    features: [
      "Soft suede upper",
      "Memory foam insole",
      "Flexible outsole",
      "Padded collar",
    ],
    isNew: false,
    isBestseller: true,
    inStock: true,
    tags: ["sale", "bestseller"],
  },
  {
    id: "shoe-4",
    name: "Trail Blazer X",
    brand: "Classic Shoes",
    category: "outdoor",
    gender: "men",
    price: 179.99,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 156,
    colors: ["brown", "green", "black"],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
    images: ["/assets/shoes/shoe-7.avif", "/assets/shoes/shoe-8.avif"],
    thumbnail: "/assets/shoes/shoe-7.avif",
    description:
      "Conquer any terrain with confidence. The Trail Blazer X offers superior grip and protection for outdoor enthusiasts.",
    features: [
      "Waterproof membrane",
      "Aggressive tread pattern",
      "Reinforced toe cap",
      "Ankle support collar",
    ],
    isNew: true,
    isBestseller: false,
    inStock: true,
    tags: ["new-arrival", "outdoor"],
  },
  {
    id: "shoe-5",
    name: "Flex Motion Lite",
    brand: "Classic Shoes",
    category: "training",
    gender: "women",
    price: 129.99,
    originalPrice: 149.99,
    rating: 4.5,
    reviewCount: 98,
    colors: ["coral", "mint", "black"],
    sizes: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9],
    images: ["/assets/shoes/shoe-8.avif", "/assets/shoes/shoe-9.avif"],
    thumbnail: "/assets/shoes/shoe-8.avif",
    description:
      "Move freely, train harder. The Flex Motion Lite adapts to your every movement for versatile workout performance.",
    features: [
      "Flexible knit upper",
      "Lightweight construction",
      "Multi-directional traction",
      "Cushioned midsole",
    ],
    isNew: false,
    isBestseller: false,
    inStock: true,
    tags: ["sale", "training"],
  },
  {
    id: "shoe-6",
    name: "Classic Heritage",
    brand: "Classic Shoes",
    category: "lifestyle",
    gender: "men",
    price: 109.99,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 445,
    colors: ["white", "navy", "burgundy"],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: ["/assets/shoes/shoe-9.avif", "/assets/shoes/shoe-10.avif"],
    thumbnail: "/assets/shoes/shoe-9.avif",
    description:
      "Timeless design meets modern comfort. The Classic Heritage pays homage to iconic sneaker culture with contemporary updates.",
    features: [
      "Full-grain leather upper",
      "Vintage styling",
      "Cushioned footbed",
      "Classic rubber cupsole",
    ],
    isNew: false,
    isBestseller: true,
    inStock: true,
    tags: ["bestseller", "classic"],
  },
  {
    id: "shoe-7",
    name: "Speed Racer Max",
    brand: "Classic Shoes",
    category: "running",
    gender: "women",
    price: 169.99,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 203,
    colors: ["neon-yellow", "pink", "black"],
    sizes: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5],
    images: ["/assets/shoes/shoe-11.avif", "/assets/shoes/shoe-12.avif"],
    thumbnail: "/assets/shoes/shoe-11.avif",
    description:
      "Built for speed demons. The Speed Racer Max delivers explosive energy return for your fastest runs yet.",
    features: [
      "Carbon fiber plate",
      "Ultra-responsive foam",
      "Aerodynamic design",
      "Minimal weight",
    ],
    isNew: true,
    isBestseller: false,
    inStock: true,
    tags: ["new-arrival", "performance"],
  },
  {
    id: "shoe-8",
    name: "Comfort Cloud",
    brand: "Classic Shoes",
    category: "lifestyle",
    gender: "women",
    price: 99.99,
    originalPrice: 129.99,
    rating: 4.9,
    reviewCount: 567,
    colors: ["lavender", "cream", "grey"],
    sizes: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10],
    images: ["/assets/shoes/shoe-12.avif", "/assets/shoes/shoe-13.avif"],
    thumbnail: "/assets/shoes/shoe-12.avif",
    description:
      "Walk on clouds all day long. The Comfort Cloud features plush cushioning for unmatched everyday comfort.",
    features: [
      "Ultra-soft foam midsole",
      "Slip-on design",
      "Stretch knit upper",
      "Removable insole",
    ],
    isNew: false,
    isBestseller: true,
    inStock: true,
    tags: ["sale", "bestseller"],
  },
  {
    id: "shoe-9",
    name: "Basketball Elite Pro",
    brand: "Classic Shoes",
    category: "basketball",
    gender: "men",
    price: 199.99,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 178,
    colors: ["black-gold", "white-red", "navy"],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14],
    images: ["/assets/shoes/shoe-13.avif", "/assets/shoes/shoe-14.avif"],
    thumbnail: "/assets/shoes/shoe-13.avif",
    description:
      "Dominate the court with precision. The Basketball Elite Pro offers superior ankle support and responsive cushioning.",
    features: [
      "High-top design",
      "Zoom Air cushioning",
      "Herringbone traction",
      "Lockdown fit",
    ],
    isNew: true,
    isBestseller: false,
    inStock: true,
    tags: ["new-arrival", "basketball"],
  },
  {
    id: "shoe-10",
    name: "Skate Legend",
    brand: "Classic Shoes",
    category: "skateboarding",
    gender: "men",
    price: 89.99,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 234,
    colors: ["black", "white", "canvas"],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    images: ["/assets/shoes/shoe-14.avif", "/assets/shoes/shoe-15.avif"],
    thumbnail: "/assets/shoes/shoe-14.avif",
    description:
      "Built by skaters, for skaters. The Skate Legend delivers board feel and durability for your sessions.",
    features: [
      "Vulcanized construction",
      "Suede and canvas upper",
      "Padded tongue and collar",
      "Gum rubber outsole",
    ],
    isNew: false,
    isBestseller: false,
    inStock: true,
    tags: ["skateboarding"],
  },
  {
    id: "shoe-11",
    name: "Yoga Flow",
    brand: "Classic Shoes",
    category: "training",
    gender: "women",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewCount: 321,
    colors: ["sage", "blush", "charcoal"],
    sizes: [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5],
    images: ["/assets/shoes/shoe-15.avif", "/assets/shoes/shoe-5.avif"],
    thumbnail: "/assets/shoes/shoe-15.avif",
    description:
      "Find your balance with ease. The Yoga Flow offers barefoot-like flexibility for studio and beyond.",
    features: [
      "Barefoot feel",
      "Split outsole",
      "Sock-like fit",
      "Non-slip grip",
    ],
    isNew: false,
    isBestseller: false,
    inStock: true,
    tags: ["sale", "studio"],
  },
  {
    id: "shoe-12",
    name: "Golf Pro Tour",
    brand: "Classic Shoes",
    category: "golf",
    gender: "men",
    price: 149.99,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 87,
    colors: ["white", "black", "navy"],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    images: ["/assets/shoes/shoe-6.avif", "/assets/shoes/shoe-7.avif"],
    thumbnail: "/assets/shoes/shoe-6.avif",
    description:
      "Perform on the course with confidence. The Golf Pro Tour delivers stability and comfort for 18 holes and beyond.",
    features: [
      "Waterproof leather",
      "Spiked traction",
      "Foam cushioning",
      "Wide base stability",
    ],
    isNew: false,
    isBestseller: false,
    inStock: false,
    tags: ["golf"],
  },
];

// Categories for filtering
export const categories = [
  { id: "all", name: "All", count: products.length },
  {
    id: "lifestyle",
    name: "Lifestyle",
    count: products.filter((p) => p.category === "lifestyle").length,
  },
  {
    id: "running",
    name: "Running",
    count: products.filter((p) => p.category === "running").length,
  },
  {
    id: "training",
    name: "Training",
    count: products.filter((p) => p.category === "training").length,
  },
  {
    id: "basketball",
    name: "Basketball",
    count: products.filter((p) => p.category === "basketball").length,
  },
  {
    id: "outdoor",
    name: "Outdoor",
    count: products.filter((p) => p.category === "outdoor").length,
  },
  {
    id: "skateboarding",
    name: "Skateboarding",
    count: products.filter((p) => p.category === "skateboarding").length,
  },
  {
    id: "golf",
    name: "Golf",
    count: products.filter((p) => p.category === "golf").length,
  },
];

// Sort options
export const sortOptions = [
  { id: "featured", name: "Featured" },
  { id: "newest", name: "Newest" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "rating", name: "Top Rated" },
];

// API simulation helpers (replace with actual API calls)
export const productApi = {
  // Get all products with optional filters
  getProducts: async (filters = {}) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...products];

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.gender) {
      filtered = filtered.filter((p) => p.gender === filters.gender);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice);
    }

    if (filters.inStock) {
      filtered = filtered.filter((p) => p.inStock);
    }

    if (filters.isNew) {
      filtered = filtered.filter((p) => p.isNew);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower),
      );
    }

    // Sorting
    switch (filters.sort) {
      case "newest":
        filtered = filtered
          .filter((p) => p.isNew)
          .concat(filtered.filter((p) => !p.isNew));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured - bestsellers first, then new
        filtered.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
    }

    return {
      products: filtered,
      total: filtered.length,
    };
  },

  // Get single product by ID
  getProductById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const product = products.find((p) => p.id === productId);
    if (!product) return [];

    return products
      .filter(
        (p) =>
          p.id !== productId &&
          (p.category === product.category || p.gender === product.gender),
      )
      .slice(0, limit);
  },
};
