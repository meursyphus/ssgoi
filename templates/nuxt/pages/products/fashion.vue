<template>
  <ProductsProductGrid :products="products" />
</template>

<script setup lang="ts">
const products = useProductsByCategory('fashion');
</script>
