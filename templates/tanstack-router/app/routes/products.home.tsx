import { createFileRoute } from "@tanstack/react-router";
import ProductGrid from "../components/products/product-grid";
import { getProductsByCategory } from "../components/products/mock-data";

function ProductsHomeRoute() {
  const products = getProductsByCategory("home");
  return <ProductGrid products={products} category="home" />;
}

export const Route = createFileRoute("/products/home")({
  component: ProductsHomeRoute,
});
