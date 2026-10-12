import { component$ } from "@qwik.dev/core";
import { ProductGrid } from "~/components/product-grid";
import { getProductsByCategory } from "~/data/products";

export default component$(() => {
  return (
    <ProductGrid
      products={getProductsByCategory("electronics")}
      category="electronics"
    />
  );
});
