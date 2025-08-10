<script setup lang="ts">
import { computed } from "vue";
import { vTransition } from "./transition";
import { useSsgoi } from "./context";

interface Props {
  id: string;
}

const props = defineProps<Props>();
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
  <div v-transition="transitionConfig" :data-ssgoi-transition="id">
    <slot />
  </div>
</template>
