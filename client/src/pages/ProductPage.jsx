import React from "react";
import { useRouter } from "../hooks/useRouter.jsx";
import ProductDetail from "../components/ProductDetail";

/**
 * ProductPage Component
 * Individual product detail page
 */
const ProductPage = () => {
  const { currentPath } = useRouter();

  // Extract product ID from URL path
  // Expected format: /product/shoe-1
  const pathParts = currentPath.split("/");
  const productId = pathParts[pathParts.length - 1];

  return <ProductDetail productId={productId} />;
};

export default ProductPage;
