<script setup lang="ts">
import { computed } from "vue";
import { vTransition } from "./transition";
import { useSsgoi } from "./context";

interface Props {
  id: string;
  as?: keyof HTMLElementTagNameMap;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div'
});

const getTransition = useSsgoi();

// Compute transition config for the directive
const transitionConfig = computed(() => {
  const transition = getTransition(props.id);
  return {
    ...transition,
    key: props.id,
  };
});
</script>

<template>
  <component 
    :is="as" 
    v-transition="transitionConfig" 
    :data-ssgoi-transition="id"
    :class="props.class"
  >
    <slot />
  </component>
</template>
