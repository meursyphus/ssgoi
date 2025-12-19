<template>
  <ProductGrid :products="products" category="electronics" />
</template>

<script setup lang="ts">
const products = useProductsByCategory('electronics');
</script>
