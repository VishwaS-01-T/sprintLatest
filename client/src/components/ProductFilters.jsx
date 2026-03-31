import React, { useState } from "react";
import {
  ChevronDown,
  X,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { useProductCategories } from "../hooks/useProducts";

const sortOptions = [
  { id: "featured", name: "Featured" },
  { id: "newest", name: "Newest" },
  { id: "price-low", name: "Price: Low to High" },
  { id: "price-high", name: "Price: High to Low" },
  { id: "rating", name: "Top Rated" },
];

/**
 * ProductFilters Component
 * Handles filtering and sorting of products
 * Props structured for backend integration
 */
const ProductFilters = ({
  filters = {},
  onFilterChange,
  onReset,
  totalProducts = 0,
  className = "",
}) => {
  const categories = useProductCategories();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    gender: true,
    price: true,
    availability: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId) => {
    onFilterChange({
      category: categoryId === filters.category ? "all" : categoryId,
    });
  };

  const handleGenderChange = (gender) => {
    onFilterChange({ gender: gender === filters.gender ? null : gender });
  };

  const handleSortChange = (sortId) => {
    onFilterChange({ sort: sortId });
  };

  const handlePriceChange = (min, max) => {
    onFilterChange({ minPrice: min, maxPrice: max });
  };

  const activeFiltersCount = [
    filters.category && filters.category !== "all",
    filters.gender,
    filters.minPrice !== undefined,
    filters.inStock,
  ].filter(Boolean).length;

  const renderFilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <FilterSection
        title="Category"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection("category")}
      >
        <div className="space-y-1">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`flex items-center justify-between cursor-pointer p-3 rounded-xl transition-all ${
                filters.category === category.id ||
                (!filters.category && category.id === "all")
                  ? "bg-amber-50 border-2 border-amber-500"
                  : "hover:bg-neutral-50 border-2 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    filters.category === category.id ||
                    (!filters.category && category.id === "all")
                      ? "bg-amber-500 border-amber-500"
                      : "border-neutral-300"
                  }`}
                >
                  {(filters.category === category.id ||
                    (!filters.category && category.id === "all")) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    filters.category === category.id ||
                    (!filters.category && category.id === "all")
                      ? "text-amber-700"
                      : "text-neutral-700"
                  }`}
                >
                  {category.name}
                </span>
              </div>
              <span className="text-xs font-medium text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">
                {category.count}
              </span>
              <input
                type="radio"
                name="category"
                checked={
                  filters.category === category.id ||
                  (!filters.category && category.id === "all")
                }
                onChange={() => handleCategoryChange(category.id)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Gender"
        isExpanded={expandedSections.gender}
        onToggle={() => toggleSection("gender")}
      >
        <div className="space-y-2">
          {[
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
            { label: "Unisex", value: "unisex" },
            { label: "Kids", value: "kids" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
                filters.gender === option.value
                  ? "bg-amber-50 border-2 border-amber-500"
                  : "hover:bg-neutral-50 border-2 border-transparent"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  filters.gender === option.value
                    ? "bg-amber-500 border-amber-500"
                    : "border-neutral-300"
                }`}
              >
                {filters.gender === option.value && <Check className="w-3 h-3 text-white" />}
              </div>
              <span
                className={`text-sm font-medium ${
                  filters.gender === option.value ? "text-amber-700" : "text-neutral-700"
                }`}
              >
                {option.label}
              </span>
              <input
                type="radio"
                name="gender"
                checked={filters.gender === option.value}
                onChange={() => handleGenderChange(option.value)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Filter */}
      <FilterSection
        title="Price"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-2">
          {[
            { label: "Under $100", min: 0, max: 100 },
            { label: "$100 - $150", min: 100, max: 150 },
            { label: "$150 - $200", min: 150, max: 200 },
            { label: "Over $200", min: 200, max: undefined },
          ].map((range, i) => (
            <label
              key={i}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
                filters.minPrice === range.min && filters.maxPrice === range.max
                  ? "bg-amber-50 border-2 border-amber-500"
                  : "hover:bg-neutral-50 border-2 border-transparent"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  filters.minPrice === range.min &&
                  filters.maxPrice === range.max
                    ? "bg-amber-500 border-amber-500"
                    : "border-neutral-300"
                }`}
              >
                {filters.minPrice === range.min &&
                  filters.maxPrice === range.max && (
                    <Check className="w-3 h-3 text-white" />
                  )}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  filters.minPrice === range.min &&
                  filters.maxPrice === range.max
                    ? "text-amber-700"
                    : "text-neutral-700"
                }`}
              >
                {range.label}
              </span>
              <input
                type="radio"
                name="price"
                checked={
                  filters.minPrice === range.min &&
                  filters.maxPrice === range.max
                }
                onChange={() => handlePriceChange(range.min, range.max)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Availability Filter */}
      <FilterSection
        title="Availability"
        isExpanded={expandedSections.availability}
        onToggle={() => toggleSection("availability")}
      >
        <label
          className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all ${
            filters.inStock
              ? "bg-green-50 border-2 border-green-500"
              : "hover:bg-neutral-50 border-2 border-transparent"
          }`}
        >
          <div
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              filters.inStock
                ? "bg-green-500 border-green-500"
                : "border-neutral-300"
            }`}
          >
            {filters.inStock && <Check className="w-4 h-4 text-white" />}
          </div>
          <span
            className={`text-sm font-medium ${filters.inStock ? "text-green-700" : "text-neutral-700"}`}
          >
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) =>
              onFilterChange({ inStock: e.target.checked || undefined })
            }
            className="sr-only"
          />
        </label>
      </FilterSection>

      {/* Reset Filters */}
      {activeFiltersCount > 0 && (
        <button
          onClick={onReset}
          className="w-full py-3 text-sm font-bold text-neutral-700 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <div className={className}>
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
        <p className="text-sm font-medium text-neutral-600">
          <span className="text-amber-600 font-bold">{totalProducts}</span>{" "}
          products found
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-neutral-700 bg-white border-2 border-neutral-200 rounded-xl hover:border-amber-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-xs bg-amber-500 text-neutral-900 font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <SortDropdown
            value={filters.sort || "featured"}
            onChange={handleSortChange}
          />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
          </div>
          <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
            {totalProducts} items
          </span>
        </div>
        {renderFilterContent()}
      </div>

      {/* Mobile Filter Panel */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto h-[calc(100%-73px)]">
              {renderFilterContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Filter Section Component
const FilterSection = ({ title, isExpanded, onToggle, children }) => (
  <div className="border-b border-neutral-100 pb-6">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-2 text-left group"
    >
      <span className="text-sm font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
        {title}
      </span>
      <ChevronDown
        className={`w-5 h-5 text-neutral-400 transition-all duration-300 ${
          isExpanded ? "rotate-180 text-amber-500" : ""
        }`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${isExpanded ? "mt-4 max-h-96" : "max-h-0"}`}
    >
      {children}
    </div>
  </div>
);

// Sort Dropdown Component
const SortDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentSort =
    sortOptions.find((opt) => opt.id === value) || sortOptions[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-neutral-700 bg-white border-2 border-neutral-200 rounded-xl hover:border-amber-300 transition-colors"
      >
        <span className="hidden sm:inline text-neutral-500">Sort:</span>
        <span className="text-neutral-900">{currentSort.name}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-500" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-52 bg-white border border-neutral-200 rounded-xl shadow-xl z-20 overflow-hidden animate-slide-down">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-3 text-left text-sm transition-colors ${
                  value === option.id
                    ? "bg-amber-50 text-amber-700 font-bold"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {option.name}
                {value === option.id && (
                  <Check className="w-4 h-4 text-amber-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductFilters;

// Export SortDropdown for use elsewhere
export { SortDropdown };
