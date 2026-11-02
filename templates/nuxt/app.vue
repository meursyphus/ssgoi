<template>
  <DemoWrapper>
    <!-- layouts/top-level.vue or layouts/detail.vue, chosen by each page's
         definePageMeta({ layout }). -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </DemoWrapper>
</template>

<script setup lang="ts">
</script>
