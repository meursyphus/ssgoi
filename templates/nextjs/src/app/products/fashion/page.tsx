import ProductGrid from "@/components/products/product-grid";
import { products } from "@/components/products/mock-data";

export default function FashionPage() {
  const filtered = products.filter((p) => p.category === "Fashion");
  return <ProductGrid products={filtered} category="fashion" />;
}
