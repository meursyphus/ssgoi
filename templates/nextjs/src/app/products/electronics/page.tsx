import ProductGrid from "@/components/products/product-grid";
import { products } from "@/components/products/mock-data";

export default function ElectronicsPage() {
  const filtered = products.filter((p) => p.category === "Electronics");
  return <ProductGrid products={filtered} category="electronics" />;
}
