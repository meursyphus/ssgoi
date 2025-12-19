import ProductGrid from "@/components/products/product-grid";
import { products } from "@/components/products/mock-data";

export default function HomeProductsPage() {
  const filtered = products.filter((p) => p.category === "Home");
  return <ProductGrid products={filtered} category="home" />;
}
