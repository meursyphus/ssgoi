"use client";

import { useRef, useCallback, useLayoutEffect } from "react";
import { createTransitionCallback, type Transition } from "@ssgoi/core";

/**
 * useEvent - Stable callback reference that always has access to latest values
 * Similar to the proposed React useEvent hook
 */
function useEvent<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback);
  
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

/**
 * React hook for applying DOM transitions
 * Wraps the core transition logic with React-specific behavior
 */
export function useDomTransition() {
  // Return a function that accepts transition options and returns the ref callback
  return (transition: Transition) => {
    // Use useEvent to create a stable callback that captures the transition
    return useEvent((element: HTMLElement | null) => {
      if (!element) return;
      
      const callback = createTransitionCallback(transition);
      return callback(element);
    });
  };
}