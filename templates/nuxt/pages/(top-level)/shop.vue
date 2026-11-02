<template>
  <div class="flex-1 bg-[#121212] flex flex-col">
    <!-- Header - Fixed -->
    <div class="px-4 pt-6 pb-3 flex-shrink-0">
      <h1 class="text-sm font-medium text-white mb-1">Shop</h1>
      <p class="text-xs text-neutral-500">Discover our curated collection</p>
    </div>

    <!-- Category Tabs - Fixed -->
    <div class="px-4 mb-4 flex-shrink-0">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <NuxtLink
          v-for="cat in SHOP_CATEGORIES"
          :key="cat.id"
          :to="cat.path"
          :class="[
            'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200',
            pathname === cat.path
              ? 'bg-white text-black'
              : 'bg-white/10 text-neutral-400 hover:bg-white/15',
          ]"
        >
          {{ cat.label }}
        </NuxtLink>
      </div>
    </div>

    <!-- Depth 2: categories slide here; the header and tabs stay. -->
    <div class="flex-1 overflow-hidden relative">
      <SsgoiLayoutBoundary class="min-h-full bg-[#121212]">
        <NuxtPage />
      </SsgoiLayoutBoundary>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SsgoiLayoutBoundary } from "@ssgoi/vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { SHOP_CATEGORIES } from "~/utils/ssgoi-config";

// Its children (/shop/*) inherit the layout through merged route meta.
definePageMeta({ layout: "top-level" });

const route = useRoute();
const pathname = computed(() => route.path);
</script>
