import ProductGrid from "../components/products/product-grid";
import { products } from "../components/products/mock-data";

export default function ProductsElectronicsRoute() {
  const electronicsProducts = products.filter(
    (p) => p.category === "Electronics"
  );
  return <ProductGrid products={electronicsProducts} category="electronics" />;
}
