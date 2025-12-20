<template>
  <NuxtLink
    :to="`/pinterest/${item.id}`"
    class="block border border-white/5 rounded-lg overflow-hidden transition-all duration-200 hover:border-white/10 group"
  >
    <!-- Image with dynamic aspect ratio -->
    <div class="relative" :style="{ aspectRatio: item.aspectRatio }">
      <img
        :src="item.image"
        :alt="item.title"
        class="w-full h-full object-cover bg-[#111]"
        :data-pinterest-gallery-key="item.id"
      />
      <!-- Overlay on hover -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />

      <!-- Save button -->
      <button
        class="absolute top-2 right-2 bg-white/10 text-white px-2 py-0.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/20"
      >
        Save
      </button>
    </div>

    <!-- Content -->
    <div class="p-2.5">
      <h3 class="font-medium text-white text-xs mb-1.5 line-clamp-2">
        {{ item.title }}
      </h3>

      <!-- Author info -->
      <div class="flex items-center gap-1.5 mb-2">
        <img
          :src="item.author.avatar"
          :alt="item.author.name"
          class="w-4 h-4 rounded-full"
        />
        <span class="text-xs text-neutral-400">{{ item.author.name }}</span>
      </div>

      <!-- Stats and Category -->
      <div class="flex items-center justify-between text-xs">
        <span class="text-neutral-500"> {{ item.saves.toLocaleString() }} saves </span>
        <span class="px-1.5 py-0.5 bg-white/5 text-neutral-400 rounded">
          {{ item.category }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PinterestItem } from '~/composables/use-pinterest';

defineProps<{
  item: PinterestItem;
}>();
</script>
