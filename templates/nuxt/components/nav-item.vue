<template>
  <NuxtLink
    :to="href"
    :class="[
      'flex flex-col items-center gap-1 px-4 py-2 text-xs min-w-[64px] transition-colors duration-200',
      isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-400',
    ]"
  >
    <div class="w-5 h-5">
      <slot />
    </div>
    <span>{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  href: string;
  label: string;
  isActive?: boolean;
}>();
</script>
