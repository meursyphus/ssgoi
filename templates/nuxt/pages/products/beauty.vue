<template>
  <ProductsProductGrid :products="products" />
</template>

<script setup lang="ts">
const products = useProductsByCategory('beauty');
</script>
