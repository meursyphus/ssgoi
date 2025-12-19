import { transition as _transition } from "@ssgoi/core";
import type { Directive } from "vue";
import type { Transition, TransitionKey, TransitionScope } from "@ssgoi/core";

export const transition = _transition;

type TransitionConfig = Transition & {
  key: TransitionKey;
  scope?: TransitionScope;
};

// Vue directive for element transitions
export const vTransition: Directive<HTMLElement, TransitionConfig | undefined> =
  {
    mounted(el, binding) {
      if (!binding.value) {
        console.warn(
          "[SSGOI] v-transition directive requires a configuration object",
        );
        return;
      }

      const transitionConfig = binding.value;

      // Pass the entire config including [TRANSITION_STRATEGY] symbol
      const cleanup = transition(transitionConfig)(el);

      // Store cleanup function on element for unmounted hook
      (el as any)._ssgoiCleanup = cleanup;
    },
    unmounted(el) {
      // Call cleanup if it exists
      const cleanup = (el as any)._ssgoiCleanup;
      if (cleanup) {
        cleanup();
        delete (el as any)._ssgoiCleanup;
      }
    },
  };
