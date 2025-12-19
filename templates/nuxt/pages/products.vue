<template>
  <SsgoiTransition id="/products" class="min-h-screen bg-[#121212] flex flex-col">
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
        <NuxtPage />
      </Ssgoi>
    </div>
  </SsgoiTransition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Ssgoi, SsgoiTransition } from '@ssgoi/vue';
import type { SsgoiConfig } from '@ssgoi/vue';
import { slide } from '@ssgoi/vue/view-transitions';

const route = useRoute();
const pathname = computed(() => route.path);

const categories = [
  { id: 'all', label: 'All', path: '/products/all' },
  { id: 'electronics', label: 'Tech', path: '/products/electronics' },
  { id: 'fashion', label: 'Fashion', path: '/products/fashion' },
  { id: 'home', label: 'Home', path: '/products/home' },
  { id: 'beauty', label: 'Beauty', path: '/products/beauty' },
];

const config: SsgoiConfig = {
  transitions: [
    {
      from: '/products/tab/left',
      to: '/products/tab/right',
      transition: slide({ direction: 'left' }),
    },
    {
      from: '/products/tab/right',
      to: '/products/tab/left',
      transition: slide({ direction: 'right' }),
    },
  ],
  middleware: (from: string, to: string) => {
    const fromIndex = categories.findIndex((c) => c.path === from);
    const toIndex = categories.findIndex((c) => c.path === to);

    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      if (fromIndex < toIndex) {
        return { from: '/products/tab/left', to: '/products/tab/right' };
      } else {
        return { from: '/products/tab/right', to: '/products/tab/left' };
      }
    }

    return { from, to };
  },
};

</script>
