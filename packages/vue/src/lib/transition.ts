import { transition as _transition } from "@ssgoi/core/internal";
import type { Directive } from "vue";
import type {
  Transition,
  TransitionKey,
  TransitionScope,
} from "@ssgoi/core/internal";

export const transition = _transition;

type TransitionConfig = Transition<undefined> & {
  key: TransitionKey;
  scope?: TransitionScope;
};

type TransitionElement = HTMLElement & {
  _ssgoiCleanup?: () => void;
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
      (el as TransitionElement)._ssgoiCleanup = cleanup;
    },
    unmounted(el) {
      const transitionElement = el as TransitionElement;

      // Call cleanup if it exists
      const cleanup = transitionElement._ssgoiCleanup;
      if (cleanup) {
        cleanup();
        delete transitionElement._ssgoiCleanup;
      }
    },
  };
