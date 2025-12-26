import { createFileRoute } from "@tanstack/react-router";
import ProductGrid from "../components/products/product-grid";
import { products } from "../components/products/mock-data";

function ProductsAllRoute() {
  return <ProductGrid products={products} category="all" />;
}

export const Route = createFileRoute("/products/all")({
  component: ProductsAllRoute,
});
