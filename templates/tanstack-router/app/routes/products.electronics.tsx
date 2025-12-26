import { createFileRoute } from "@tanstack/react-router";
import ProductGrid from "../components/products/product-grid";
import { getProductsByCategory } from "../components/products/mock-data";

function ProductsElectronicsRoute() {
  const products = getProductsByCategory("electronics");
  return <ProductGrid products={products} category="electronics" />;
}

export const Route = createFileRoute("/products/electronics")({
  component: ProductsElectronicsRoute,
});
