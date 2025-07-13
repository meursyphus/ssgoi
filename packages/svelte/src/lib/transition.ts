import { createTransitionCallback, type Transition } from "@ssgoi/core";

/**
 * Svelte action for applying DOM transitions
 * Usage: <div use:transition={{in: fadeIn, out: fadeOut}}>
 */
export function transition<T extends HTMLElement = HTMLElement>(
  node: T,
  params: Transition<T>
) {
  // Create transition callback with current params
  const callback = createTransitionCallback(() => params);

  // Start entrance transition
  const cleanup = callback(node);

  return {
    update(newParams: Transition<T>) {
      // Update params for future transitions
      params = newParams;
    },
    destroy() {
      // Run exit transition if cleanup exists
      if (cleanup) {
        cleanup();
      }
    },
  };
}
