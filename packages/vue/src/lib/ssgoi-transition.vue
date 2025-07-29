<template>
  <div ref="transitionEl" :data-ssgoi-transition="id">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { transition } from "./transition";
import { useSsgoi } from "./context";

interface Props {
  id: string;
}

const props = defineProps<Props>();

const transitionEl = ref<HTMLElement>();
const getTransition = useSsgoi();

let cleanup: (() => void) | void;

onMounted(() => {
  if (transitionEl.value) {
    cleanup = transition(getTransition(props.id))(transitionEl.value);
  }
});

onUnmounted(() => {
  if (cleanup) {
    cleanup();
  }
});
</script>