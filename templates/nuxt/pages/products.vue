<template>
  <div class="min-h-screen bg-[#121212] flex flex-col">
    <!-- Header - Fixed -->
    <div class="px-4 pt-6 pb-3 flex-shrink-0">
      <h1 class="text-sm font-medium text-white mb-1">Shop</h1>
      <p class="text-xs text-neutral-500">Discover our curated collection</p>
    </div>

    <!-- Category Tabs - Fixed -->
    <div class="px-4 mb-4 flex-shrink-0">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <NuxtLink
          v-for="cat in categories"
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

    <!-- Tab Content - Slide transitions here -->
    <div class="flex-1 overflow-hidden relative">
      <Ssgoi :config="config">
        <SsgoiTransitionBoundary class="min-h-full bg-[#121212]">
          <NuxtPage />
        </SsgoiTransitionBoundary>
      </Ssgoi>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Ssgoi } from "@ssgoi/vue";
import type { SsgoiConfig } from "@ssgoi/vue";
import { slide } from "@ssgoi/vue/view-transitions";

const route = useRoute();
const pathname = computed(() => route.path);

const categories = [
  { id: "all", label: "All", path: "/products/all" },
  { id: "electronics", label: "Tech", path: "/products/electronics" },
  { id: "fashion", label: "Fashion", path: "/products/fashion" },
  { id: "home", label: "Home", path: "/products/home" },
  { id: "beauty", label: "Beauty", path: "/products/beauty" },
];

const config: SsgoiConfig = {
  transitions: [
    {
      ordered: categories.map((category) => category.path),
      transition: slide(),
    },
  ],
};
</script>
