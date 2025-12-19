<template>
  <SsgoiTransition id="/pinterest">
    <div class="min-h-screen bg-[#121212] px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-sm font-medium text-white mb-1">Gallery</h1>
        <p class="text-xs text-neutral-500">Explore inspiring ideas and creativity</p>
      </div>

      <!-- Masonry Grid -->
      <div class="grid grid-cols-2 gap-2">
        <!-- Left Column -->
        <div class="flex flex-col gap-2">
          <PinCard v-for="item in leftColumnItems" :key="item.id" :item="item" />
        </div>

        <!-- Right Column -->
        <div class="flex flex-col gap-2">
          <PinCard v-for="item in rightColumnItems" :key="item.id" :item="item" />
        </div>
      </div>
    </div>
  </SsgoiTransition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SsgoiTransition } from '@ssgoi/vue';

const items = useAllPinterestItems();

// Split items into two columns for masonry effect
const leftColumnItems = computed(() => items.filter((_, index) => index % 2 === 0));
const rightColumnItems = computed(() => items.filter((_, index) => index % 2 === 1));
</script>
