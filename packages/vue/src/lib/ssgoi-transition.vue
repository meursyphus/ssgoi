<script setup lang="ts">
import { computed, h, withDirectives, useSlots } from "vue";
import { vTransition } from "./transition";
import { useSsgoi } from "./context";

interface Props {
  id: string;
}

const props = defineProps<Props>();
const slots = useSlots();
const getTransition = useSsgoi();

// Compute transition config for the directive
const transitionConfig = computed(() => {
  const transition = getTransition(props.id);
  return {
    ...transition,
    key: props.id,
  };
});

// Create render function
const renderWithTransition = () => {
  return withDirectives(
    h('div', {
      'data-ssgoi-transition': props.id
    }, slots.default?.()),
    [[vTransition, transitionConfig.value]]
  );
};
</script>

<template>
  <component :is="renderWithTransition" />
</template>
