import type { Transition, TransitionCallback } from "./types";
import { runTransition } from "./transition-runner";

export * from "./types";
export * from "./transition-runner";

/**
 * Creates a transition callback that can be used with framework-specific implementations
 * This is the core logic that frameworks can wrap with their own APIs
 */
export function   createTransitionCallback<T extends HTMLElement = HTMLElement>(
  transition: Transition<T>
): TransitionCallback<T> {
  let cleanup: (() => void) | null = null;
  let elementRef: T | null = null;
  let parentRef: Element | null = null;
  let nextSiblingRef: Element | null = null;

  return (element: T) => {
    if (!element) return;

    // Store references
    elementRef = element;
    parentRef = element.parentElement;
    nextSiblingRef = element.nextElementSibling;

    // Get transition options

    // Run entrance transition
    const runEntrance = async () => {
      if (!elementRef) return;

      const config = await Promise.resolve(transition.in(elementRef));
      cleanup = runTransition({
        config,
        direction: "forward",
        onComplete: () => {
          cleanup = null;
        },
      });
    };

    runEntrance();

    // Return cleanup function for exit transition
    return () => {
      // Cancel any running entrance transition
      if (cleanup) {
        cleanup();
        cleanup = null;
      }

      if (!elementRef || !parentRef) return;

      // Clone the element for exit transition
      const clone = elementRef.cloneNode(true) as T;

      // Insert clone at the original position
      if (nextSiblingRef && parentRef.contains(nextSiblingRef)) {
        parentRef.insertBefore(clone, nextSiblingRef);
      } else {
        parentRef.appendChild(clone);
      }

      // Run exit transition on the clone
      const runExit = async () => {
        const config = await Promise.resolve(transition.out(clone));
        runTransition({
          config,
          direction: "backward",
          onComplete: () => {
            clone.remove();
          },
        });
      };

      runExit();
    };
  };
}
