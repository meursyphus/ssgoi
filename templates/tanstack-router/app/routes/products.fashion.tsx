import { createFileRoute } from "@tanstack/react-router";
import ProductGrid from "../components/products/product-grid";
import { getProductsByCategory } from "../components/products/mock-data";

function ProductsFashionRoute() {
  const products = getProductsByCategory("fashion");
  return <ProductGrid products={products} category="fashion" />;
}

export const Route = createFileRoute("/products/fashion")({
  component: ProductsFashionRoute,
});
