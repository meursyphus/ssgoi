<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect, onMounted, onUnmounted, getCurrentInstance } from "vue";
import type { SsgoiConfig } from "./types";
import { provideSsgoi } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core";

interface Props {
  config: SsgoiConfig;
}

const props = defineProps<Props>();

const contextValue = computed(() => createSggoiTransitionContext(props.config));

// Provide the context value reactively
watchEffect(() => {
  provideSsgoi(contextValue.value);
});

// Handle route changes for page transitions
let cleanup: (() => void) | null = null;

const triggerPageTransition = async () => {
  // Find all transition elements on the current page
  const currentTransitions = document.querySelectorAll('[data-ssgoi-transition]');
  
  // Trigger OUT transitions for all elements
  const outPromises = Array.from(currentTransitions).map(async (element) => {
    const id = element.getAttribute('data-ssgoi-transition');
    if (id) {
      const transition = contextValue.value(id);
      if (transition.out) {
        await transition.out(element as HTMLElement);
      }
    }
  });

  // Wait for all OUT transitions to complete
  await Promise.all(outPromises);
};

onMounted(() => {
  // Check if we're in a Nuxt/Vue Router environment
  const instance = getCurrentInstance();
  const router = instance?.appContext.config.globalProperties.$router;
  
  if (router && router.beforeEach) {
    // Listen for route changes
    cleanup = router.beforeEach(async (to: any, from: any) => {
      if (from.path !== to.path) {
        await triggerPageTransition();
      }
    });
  }
});

onUnmounted(() => {
  if (cleanup) {
    cleanup();
  }
});
</script>