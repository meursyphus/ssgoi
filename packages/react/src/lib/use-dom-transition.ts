"use client";

import { useRef, useCallback } from "react";
import { createTransitionCallback, type Transition } from "@ssgoi/core";

/**
 * React hook for applying DOM transitions
 * Wraps the core transition logic with React-specific behavior
 */
export function useDomTransition() {
  const transitionRef = useRef<Transition | null>(null);

  // Stable callback that React can use as a ref
  const stableCallback = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    // Create and call the transition callback with a getter function
    const callback = createTransitionCallback(() => {
      if (!transitionRef.current) {
        throw new Error("Transition not set");
      }
      return transitionRef.current;
    });
    return callback(element);
  }, []);

  // Return a function that accepts transition options and returns the ref callback
  return (transition: Transition) => {
    transitionRef.current = transition;
    return stableCallback;
  };
}
