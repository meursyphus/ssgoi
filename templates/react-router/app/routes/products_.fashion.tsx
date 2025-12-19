import ProductGrid from "../components/products/product-grid";
import { products } from "../components/products/mock-data";

export default function ProductsFashionRoute() {
  const fashionProducts = products.filter((p) => p.category === "Fashion");
  return <ProductGrid products={fashionProducts} category="fashion" />;
}
