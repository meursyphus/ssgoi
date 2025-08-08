import { useSignal, useVisibleTask$, type Signal } from "@builder.io/qwik";
import type { Transition, TransitionKey } from "@ssgoi/core";
import { transition as coreTransition } from "@ssgoi/core";

// Hook version for use within components
export function useTransition<TAnimationValue = number>(
  config: Transition<undefined, TAnimationValue> & { key: TransitionKey }
): Signal<HTMLElement | undefined> {
  const elementRef = useSignal<HTMLElement>();
  
  useVisibleTask$(({ track, cleanup }) => {
    const element = track(() => elementRef.value);
    if (!element) return;
    
    // Get the transition function from core with proper generic
    const transitionFn = coreTransition<TAnimationValue>({
      key: config.key,
      in: config.in,
      out: config.out,
    });
    
    // Apply the transition to the element
    transitionFn(element);
    
    // Handle cleanup when component unmounts
    cleanup(() => {
      // Trigger OUT transition when component unmounts
      if (config.out) {
        const event = new CustomEvent("ssgoi:unmount", { detail: { element } });
        element.dispatchEvent(event);
      }
    });
  });
  
  return elementRef;
}

// For backwards compatibility, export useTransition as transition too
export const transition = useTransition;