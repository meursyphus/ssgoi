<template>
  <slot />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SsgoiConfig } from "./types";
import type { HostAnimation } from "@ssgoi/core/internal";
import { provideSsgoi } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core/internal";

interface Props {
  config: SsgoiConfig;
  host?: HostAnimation;
}

const props = defineProps<Props>();

const contextValue = computed(() =>
  createSggoiTransitionContext(props.config, { host: props.host }),
);
provideSsgoi(contextValue);
</script>
