<template>
  <ProductsProductGrid :products="products" />
</template>

<script setup lang="ts">
const products = useAllProducts();
</script>
