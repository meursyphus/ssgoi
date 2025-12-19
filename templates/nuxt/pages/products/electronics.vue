<template>
  <ProductsProductGrid :products="products" category="electronics" />
</template>

<script setup lang="ts">
const products = useProductsByCategory('electronics');
</script>
