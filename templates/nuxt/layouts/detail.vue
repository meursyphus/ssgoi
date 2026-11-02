<template>
  <div class="flex-1 flex flex-col">
    <!-- Depth 1: one detail page replaces another. -->
    <SsgoiLayoutBoundary class="flex-1 bg-[#121212]">
      <slot />
    </SsgoiLayoutBoundary>
  </div>
</template>

<script setup lang="ts">
import { SsgoiLayoutBoundary } from "@ssgoi/vue";
</script>
