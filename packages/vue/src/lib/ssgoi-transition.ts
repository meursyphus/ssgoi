import { defineComponent, ref, onMounted, onUnmounted, h } from "vue";
import type { PropType } from "vue";
import { transition } from "./transition";
import { useSsgoi } from "./context";

export const SsgoiTransition = defineComponent({
  name: "SsgoiTransition",
  props: {
    id: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props, { slots }) {
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
    
    return () => h(
      "div",
      {
        ref: transitionEl,
        "data-ssgoi-transition": props.id,
      },
      slots.default?.()
    );
  },
});