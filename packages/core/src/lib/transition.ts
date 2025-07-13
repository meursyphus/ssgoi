import type { Transition } from "./types";
import { createTransitionCallback } from "./create-transition-callback";

// Global state management
const activeTransitions = new WeakMap<HTMLElement, TransitionState>();
const pendingCleanups = new Map<string, PendingCleanup<any>>();

interface TransitionState {
  key: string;
  cleanup?: () => void;
  type: 'in' | 'out';
}

interface PendingCleanup<T extends HTMLElement = HTMLElement> {
  timer: NodeJS.Timeout;
  key: string;
  transition: Transition<T>;
}

interface TransitionOptions<T extends HTMLElement = HTMLElement> extends Transition<T> {
  key: string;
}

/**
 * Creates a ref callback for transitions with global state management
 * 
 * @param options - Transition configuration with required key
 * @returns Ref callback function for React/Svelte
 * 
 * Usage:
 * ```tsx
 * <div ref={transition({ key: 'modal', in: fadeIn, out: fadeOut })}>
 * ```
 */
export function transition<T extends HTMLElement = HTMLElement>(
  options: TransitionOptions<T>
) {
  const { key, ...transitionConfig } = options;
  
  // Return ref callback
  return (element: T | null) => {
    if (!element) return;
    
    // Check for pending cleanup (quick re-entry)
    if (pendingCleanups.has(key)) {
      const pending = pendingCleanups.get(key)!;
      clearTimeout(pending.timer);
      pendingCleanups.delete(key);
      
      // Reuse the same transition config
      const callback = createTransitionCallback(() => pending.transition);
      const cleanup = callback(element);
      
      // Store state
      activeTransitions.set(element, {
        key,
        cleanup: cleanup || undefined,
        type: 'in'
      });
      
      // Return cleanup for React 19
      return () => {
        cleanup?.();
        handleExit(element, key, transitionConfig);
      };
    }
    
    // Create new transition
    const callback = createTransitionCallback(() => transitionConfig);
    const cleanup = callback(element);
    
    // Store state
    activeTransitions.set(element, {
      key,
      cleanup,
      type: 'in'
    });
    
    // Return cleanup function for React 19
    return () => {
      cleanup?.();
      handleExit(element, key, transitionConfig);
    };
  };
}

function handleExit<T extends HTMLElement>(
  element: T,
  key: string,
  transitionConfig: Transition<T>
) {
  const state = activeTransitions.get(element);
  if (!state) return;
  
  // Mark as out transition
  state.type = 'out';
  
  // Clean up from WeakMap immediately
  activeTransitions.delete(element);
  
  // Keep in pending map for potential quick re-entry
  const timer = setTimeout(() => {
    pendingCleanups.delete(key);
  }, 150); // 150ms grace period
  
  pendingCleanups.set(key, {
    timer,
    key,
    transition: transitionConfig
  });
}