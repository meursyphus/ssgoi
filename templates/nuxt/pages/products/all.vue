<template>
  <ProductGrid :products="products" category="all" />
</template>

<script setup lang="ts">
const products = useAllProducts();
</script>
