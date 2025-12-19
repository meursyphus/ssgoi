import ProductGrid from "@/components/products/product-grid";
import { products } from "@/components/products/mock-data";

export default function BeautyPage() {
  const filtered = products.filter((p) => p.category === "Beauty");
  return <ProductGrid products={filtered} category="beauty" />;
}
