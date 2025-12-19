<template>
  <ProductGrid :products="products" category="fashion" />
</template>

<script setup lang="ts">
const products = useProductsByCategory('fashion');
</script>
