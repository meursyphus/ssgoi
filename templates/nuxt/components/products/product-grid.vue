<template>
  <div :data-ssgoi-transition="`/products/${category}`">
    <div class="px-4 pb-6 h-full overflow-y-auto">
      <div v-if="products.length === 0" class="text-center py-12">
        <p class="text-neutral-500 text-sm">No products in this category</p>
      </div>
      <div v-else class="grid grid-cols-2 gap-3">
        <ProductsProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/composables/use-products";

defineProps<{
  products: Product[];
  category: string;
}>();
</script>
