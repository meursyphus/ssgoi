import ProductGrid from "../components/products/product-grid";
import { products } from "../components/products/mock-data";

export default function ProductsHomeRoute() {
  const homeProducts = products.filter((p) => p.category === "Home");
  return <ProductGrid products={homeProducts} category="home" />;
}
