<template>
  <div
    ref="root"
    data-ssgoi-root=""
    style="display: contents"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { SsgoiConfig, SsgoiFramework } from "./types";
import type { HostAnimation } from "@ssgoi/core/internal";
import { provideSsgoi } from "./context";
import {
  createSggoiTransitionContext,
  observeSsgoiTransitions,
  resolveLayoutChain,
} from "@ssgoi/core/internal";

interface Props {
  config: SsgoiConfig;
  host?: HostAnimation;
  framework?: SsgoiFramework;
}

const props = defineProps<Props>();

const contextValue = computed(() =>
  createSggoiTransitionContext(props.config, { host: props.host }),
);
// Resolve the route once; every SsgoiLayoutBoundary keys off this chain.
const layout = computed(() => {
  const route = props.framework?.getRoute();
  if (!route) return undefined;
  const routePath = route.renderedPath ?? route.pathname;
  return {
    routePath,
    chain: resolveLayoutChain(props.config.layouts, routePath),
  };
});
provideSsgoi(contextValue, layout);

const root = ref<HTMLElement | null>(null);
let stopObserving: (() => void) | undefined;

const startObserving = () => {
  stopObserving?.();
  stopObserving = undefined;

  if (root.value) {
    stopObserving = observeSsgoiTransitions(root.value, contextValue.value);
  }
};

onMounted(startObserving);
watch(contextValue, startObserving);
onBeforeUnmount(() => stopObserving?.());
</script>
