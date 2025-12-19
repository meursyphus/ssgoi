import ProductGrid from "../components/products/product-grid";
import { products } from "../components/products/mock-data";

export default function ProductsBeautyRoute() {
  const beautyProducts = products.filter((p) => p.category === "Beauty");
  return <ProductGrid products={beautyProducts} category="beauty" />;
}
