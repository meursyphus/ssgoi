import { defineComponent, computed, h } from "vue";
import type { PropType } from "vue";
import type { SsgoiConfig } from "./types";
import { provideSsgoi } from "./context";
import { createSggoiTransitionContext } from "@ssgoi/core";

export const Ssgoi = defineComponent({
  name: "Ssgoi",
  props: {
    config: {
      type: Object as PropType<SsgoiConfig>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const contextValue = computed(() => createSggoiTransitionContext(props.config));
    
    provideSsgoi(contextValue.value);
    
    return () => h("div", slots.default?.());
  },
});