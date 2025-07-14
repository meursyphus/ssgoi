import {
  transition as _transition,
  type Transition,
  type TransitionKey,
} from "@ssgoi/core";
import type { Directive } from "vue";

// Vue directive for transitions
export const vTransition: Directive<
  HTMLElement,
  Transition & { key: TransitionKey }
> = {
  mounted(el, binding) {
    const { key, in: inTransition, out: outTransition } = binding.value;
    const callback = _transition({
      key,
      in: inTransition,
      out: outTransition,
    });

    // Store cleanup function on element
    (el as any).__transitionCleanup = callback(el);
  },

  updated(el, binding) {
    // Clean up previous transition
    if ((el as any).__transitionCleanup) {
      (el as any).__transitionCleanup();
    }

    const { key, in: inTransition, out: outTransition } = binding.value;
    const callback = _transition({
      key,
      in: inTransition,
      out: outTransition,
    });

    // Store new cleanup function
    (el as any).__transitionCleanup = callback(el);
  },

  unmounted(el) {
    // Clean up on unmount
    if ((el as any).__transitionCleanup) {
      (el as any).__transitionCleanup();
      delete (el as any).__transitionCleanup;
    }
  },
};

// Export the original transition function for composition API usage
export const transition = _transition;
