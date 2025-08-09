import { isBrowser } from "@builder.io/qwik/build";
import type { Transition, TransitionKey } from "@ssgoi/core";
import { transition as coreTransition } from "@ssgoi/core";

/**
 * Qwik-specific transition function that properly handles element lifecycle
 * Usage: Use with useVisibleTask$ to apply transitions
 *
 * Example:
 * const elementRef = useSignal<HTMLElement>();
 * useVisibleTask$(({ cleanup }) => {
 *   const element = elementRef.value;
 *   if (!element) return;
 *
 *   const cleanupFn = transition({ key: 'fade', in, out })(element);
 *   cleanup(() => cleanupFn?.());
 * });
 */
export function transition<TAnimationValue = number>(options: {
  key: TransitionKey;
  in?: Transition<undefined, TAnimationValue>["in"];
  out?: Transition<undefined, TAnimationValue>["out"];
}) {
  // Return a function that accepts an element and returns a cleanup function
  return (element: HTMLElement) => {
    // Skip if not in browser environment (SSR)
    if (!isBrowser) return;

    // Get the transition function from core
    const transitionFn = coreTransition<TAnimationValue>({
      key: options.key,
      in: options.in,
      out: options.out,
    });

    // Apply the transition to the element and return cleanup
    const result = transitionFn(element);
    return typeof result === "function" ? result : undefined;
  };
}
