"use client";

import { useRef, useCallback } from "react";
import { createTransitionCallback, type Transition } from "@ssgoi/core";

/**
 * React hook for applying DOM transitions
 * Wraps the core transition logic with React-specific behavior
 */
export function useDomTransition() {
  console.log('useDomTransition hook called');
  
  const transitionRef = useRef<Transition | null>(null);
  const callbackRef = useRef<ReturnType<typeof createTransitionCallback>>(
    createTransitionCallback(() => {
      console.log('createTransitionCallback getter called');
      if (!transitionRef.current) {
        throw new Error("Transition not set");
      }

      return transitionRef.current;
    })
  );

  console.log('useDomTransition initialized', { callbackRef: !!callbackRef.current });

  // Stable callback that React can use as a ref
  const stableCallback = useCallback((element: HTMLElement | null) => {
    console.log('stableCallback called', { element: element?.className, hasElement: !!element });
    if (!element) return;

    const cleanup = callbackRef.current(element);
    console.log('callbackRef.current result', { cleanup: typeof cleanup });

    // Don't return the cleanup function to React
    // React would call it immediately if we return it
    // Instead, we'll handle cleanup internally when the element unmounts
    return undefined;
  }, []);

  // Return a function that accepts transition options and returns the ref callback
  return (transition: Transition) => {
    console.log('useDomTransition return function called', { transition });
    transitionRef.current = transition;
    return stableCallback;
  };
}
