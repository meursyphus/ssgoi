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

const contextValue = computed(() => createSggoiTransitionContext(props.config));

// Provide the context value reactively
watchEffect(() => {
  provideSsgoi(contextValue.value);
});
</script>