<template>
  <ProductGrid :products="products" category="home" />
</template>

<script setup lang="ts">
const products = useProductsByCategory('home');
</script>
