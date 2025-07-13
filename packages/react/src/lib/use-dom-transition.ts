"use client";

import { useRef, useCallback, useEffect } from "react";
import { createTransitionCallback, type Transition } from "@ssgoi/core";

/**
 * React hook for applying DOM transitions
 * Wraps the core transition logic with React-specific behavior
 */
export function useDomTransition() {
  const transitionRef = useRef<Transition | null>(null);
  const callbackRef = useRef<ReturnType<typeof createTransitionCallback>>(
    createTransitionCallback(() => {
      if (!transitionRef.current) {
        throw new Error("Transition not set");
      }

      return transitionRef.current;
    })
  );

  // Stable callback that React can use as a ref
  const stableCallback = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return;
    }

    const cleanup = callbackRef.current(element);

    // React 19 supports returning cleanup functions from ref callbacks
    // The cleanup function will be called when the element unmounts
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  // Return a function that accepts transition options and returns the ref callback
  return (transition: Transition) => {
    transitionRef.current = transition;
    return stableCallback;
  };
}
