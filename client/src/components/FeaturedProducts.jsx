import React from "react";
import { Link } from "../hooks/useRouter.jsx";
import ProductGrid from "./ProductGrid";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import NewArrivalsScrollExpansion from "./ui/demo";
import { productsApi } from "../lib/api/productsApi";

/**
 * FeaturedProducts Component
 * Displays a curated selection of products on the homepage
 */
const FeaturedProducts = () => {
  const [bestsellers, setBestsellers] = React.useState([]);
  const [bestsellersLoading, setBestsellersLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    setBestsellersLoading(true);
    productsApi
      .getFeaturedProducts(8)
      .then((products) => {
        if (active) setBestsellers(products);
      })
      .catch(() => {
        if (active) setBestsellers([]);
      })
      .finally(() => {
        if (active) setBestsellersLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const displayProducts = bestsellers;

  return (
    <section className="pt-8 pb-20 sm:pt-12 sm:pb-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div className="animate-slide-up">
            <span className="inline-block text-xs font-bold text-amber-600 bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              ✦ Featured
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-2">
              Our Best <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">Sellers</span>
            </h2>
            <p className="text-base text-neutral-500 max-w-md">
              Handpicked styles loved by thousands worldwide.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-neutral-900 bg-neutral-100 rounded-full hover:bg-neutral-900 hover:text-white transition-all duration-300 animate-fade-in"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={displayProducts}
          loading={bestsellersLoading}
          columns={4}
        />

        {/* Category Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <CategoryCard
            title="Men's Collection"
            description="Explore performance and style"
            image="/assets/shoes/shoe-10.png"
            href="/products?gender=men"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <CategoryCard
            title="Women's Collection"
            description="Discover comfort and elegance"
            image="/assets/shoes/shoe-12.avif"
            href="/products?gender=women"
            icon={<Sparkles className="w-5 h-5" />}
          />
        </div>

        {/* New Arrivals Scroll Expansion */}
        <div className="mt-20">
          <NewArrivalsScrollExpansion />
        </div>
      </div>
    </section>
  );
};

// Category Card Component
const CategoryCard = ({ title, description, image, href, icon }) => (
  <Link
    href={href}
    className="group relative rounded-3xl overflow-hidden aspect-[2/1] bg-neutral-200 shadow-lg hover:shadow-2xl transition-all duration-500"
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
      <div className="flex items-center gap-2 text-amber-400 mb-3">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">
          Shop Now
        </span>
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
        {title}
      </h3>
      <p className="text-neutral-300 mb-4">{description}</p>
      <span className="inline-flex items-center gap-2 text-sm font-bold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full group-hover:bg-yellow-400 group-hover:text-black transition-all">
        Explore
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </div>
  </Link>
);

export default FeaturedProducts;
