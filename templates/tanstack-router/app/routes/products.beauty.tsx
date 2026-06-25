import { createFileRoute } from "@tanstack/react-router";
import ProductGrid from "../components/products/product-grid";
import { getProductsByCategory } from "../components/products/mock-data";

function ProductsBeautyRoute() {
  const products = getProductsByCategory("beauty");
  return <ProductGrid products={products} />;
}

export const Route = createFileRoute("/products/beauty")({
  component: ProductsBeautyRoute,
});
