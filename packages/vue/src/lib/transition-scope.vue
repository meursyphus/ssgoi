<template>
  <div ref="scopeRef" style="display: contents">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * TransitionScope creates a boundary for local-scoped transitions.
 *
 * Child elements with `scope: 'local'` will:
 * - Skip IN animation when mounted simultaneously with the scope
 * - Skip OUT animation when unmounted simultaneously with the scope
 *
 * @example
 * ```vue
 * <TransitionScope>
 *   <div v-transition="{ scope: 'local', in: ..., out: ... }">
 *     Content
 *   </div>
 * </TransitionScope>
 * ```
 */
import { ref, onMounted, onUnmounted } from "vue";
import { createTransitionScope } from "@ssgoi/core";

const scopeRef = ref<HTMLElement | null>(null);
let cleanup: (() => void) | void;

onMounted(() => {
  if (scopeRef.value) {
    cleanup = createTransitionScope()(scopeRef.value);
  }
});

onUnmounted(() => {
  cleanup?.();
});
</script>
