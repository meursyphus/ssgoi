import { createTransitionCallback, type Transition } from "@ssgoi/core";

/**
 * Svelte rune for applying DOM transitions
 * Similar to React's useDomTransition hook
 * Usage: 
 * const transition = useTransition();
 * <div use:transition={{in: fadeIn, out: fadeOut}}>
 */
export function useTransition<T extends HTMLElement = HTMLElement>() {
  let transitionRef = $state<Transition<T> | null>(null);
  
  // Create stable callback that persists across rerenders
  const callback = createTransitionCallback(() => {
    if (!transitionRef) {
      throw new Error("Transition not set");
    }
    return transitionRef;
  });
  
  // Return action function
  return (node: T, params: Transition<T>) => {
    transitionRef = params;
    
    // Start entrance transition
    const cleanup = callback(node);
    
    return {
      update(newParams: Transition<T>) {
        // Update params for future transitions
        transitionRef = newParams;
      },
      destroy() {
        // Run exit transition if cleanup exists
        if (cleanup) {
          cleanup();
        }
      }
    };
  };
}