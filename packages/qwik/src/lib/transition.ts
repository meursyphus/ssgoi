import { useVisibleTask$ } from "@builder.io/qwik";
import type { Transition, TransitionKey } from "@ssgoi/core";
import { transition as coreTransition } from "@ssgoi/core";

export function transition(config: Transition & { key: TransitionKey }) {
  return (element: Element | undefined) => {
    if (!element) return;
    
    useVisibleTask$(({ cleanup }) => {
      // Get the transition function from core
      const transitionFn = coreTransition(config);
      
      // Apply the transition to the element
      transitionFn(element as HTMLElement);
      
      // Handle cleanup when component unmounts
      cleanup(() => {
        // Trigger OUT transition when component unmounts
        if (config.out) {
          const event = new CustomEvent("ssgoi:unmount", { detail: { element } });
          element.dispatchEvent(event);
        }
      });
    });
  };
}