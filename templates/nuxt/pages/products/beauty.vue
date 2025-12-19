<template>
  <ProductsProductGrid :products="products" category="beauty" />
</template>

<script setup lang="ts">
const products = useProductsByCategory('beauty');
</script>
