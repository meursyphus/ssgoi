<!-- TODO(8.0.0): remove this entry (deprecated in 7.5.0). -->
<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import { useSsgoi } from "../context";

/** @deprecated Will be removed in 8.0.0. */
interface Props {
  id: string;
  as?: keyof HTMLElementTagNameMap;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
  class: undefined,
});

const ssgoi = useSsgoi();

const setTransitionRef = (
  element: Element | ComponentPublicInstance | null,
) => {
  const instance = element as ComponentPublicInstance | null;
  const node = element instanceof HTMLElement ? element : instance?.$el;
  if (node instanceof HTMLElement) {
    ssgoi.value.refFor(props.id)(node);
  }
};
</script>

<template>
  <component
    :is="as"
    :ref="setTransitionRef"
    :data-ssgoi-transition="id"
    :class="props.class"
  >
    <slot />
  </component>
</template>
