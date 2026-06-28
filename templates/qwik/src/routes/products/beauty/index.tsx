import { component$ } from "@builder.io/qwik";
import { ProductGrid } from "~/components/product-grid";
import { getProductsByCategory } from "~/data/products";

export default component$(() => {
  return (
    <ProductGrid products={getProductsByCategory("beauty")} category="beauty" />
  );
});
