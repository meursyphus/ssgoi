import ProductGrid from "@/components/products/product-grid";
import { products } from "@/components/products/mock-data";

export default function AllProductsPage() {
  return <ProductGrid products={products} category="all" />;
}
