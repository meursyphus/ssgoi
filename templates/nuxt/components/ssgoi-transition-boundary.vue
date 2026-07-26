<template>
  <component :is="as" :key="transitionId" :data-ssgoi-transition="transitionId">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

interface Props {
  as?: keyof HTMLElementTagNameMap;
  getId?: (pathname: string) => string;
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
  getId: (pathname: string) => pathname,
});

const route = useRoute();
const transitionId = computed(() => props.getId(route.path));
</script>
