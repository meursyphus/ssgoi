<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import type { SsgoiConfig } from "./types";
import { provideSsgoi } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core";

interface Props {
  config: SsgoiConfig;
}

const props = defineProps<Props>();

const contextValue = computed(() =>
  createSggoiTransitionContext(props.config, {
    // Vue directive uses unmounted hook for cleanup,
    // so OUT and IN can arrive in any order
    outFirst: false,
  }),
);

// Provide the context value reactively
watchEffect(() => {
  provideSsgoi(contextValue.value);
});
</script>
