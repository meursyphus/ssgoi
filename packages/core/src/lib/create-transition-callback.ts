import type { Transition, TransitionCallback } from "./types";
import { Animator } from "./animator";
/**
 * Creates a transition callback that can be used with framework-specific implementations
 * This is the core logic that frameworks can wrap with their own APIs
 *
 * UX Animation Behavior - 4 Main Scenarios:
 *
 * 1. No animation running + IN trigger:
 *    - Start entrance animation (0 → 1)
 *    - Return cleanup function for exit
 *
 * 2. No animation running + OUT trigger:
 *    - Clone element, start exit animation (1 → 0)
 *    - Remove clone when complete
 *
 * 3. IN animation running + OUT trigger:
 *    - Stop current IN animation (DOM is disappearing)
 *    - Clone element for exit animation
 *    - Create REVERSED IN animation (not OUT animation) with current state
 *    - This gives natural backward motion instead of jumping to OUT definition
 *
 * 4. OUT animation running + IN trigger:
 *    - Stop current OUT animation (cleanup any cloned elements)
 *    - Create REVERSED OUT animation (not IN animation) with current state
 *    - This gives natural backward motion instead of jumping to IN definition
 *    - Switch to entrance mode
 *
 * Closure Structure:
 * - Outer function: Returns entrance callback
 * - Inner function (entrance callback): Returns cleanup callback (exit)
 * - Cleanup callback: Handles exit transitions
 */
export function createTransitionCallback(
  getTransition: () => Transition,
  options?: {
    onCleanupEnd?: () => void;
  }
): TransitionCallback {
  let currentAnimation: Animator | null = null;
  let currentClone: HTMLElement | null = null; // Track current clone element
  let parentRef: Element | null = null;
  let nextSiblingRef: Element | null = null;
  let isEntering = false; // Track current transition direction

  const runEntrance = async (element: HTMLElement) => {
    // Scenario 4: OUT animation running + IN trigger
    if (currentAnimation && currentAnimation.getIsAnimating() && !isEntering) {
      // Stop current OUT animation
      const currentState = currentAnimation.getCurrentState();
      currentAnimation.stop();

      // Remove clone immediately
      if (currentClone) {
        currentClone.remove();
        currentClone = null;
      }

      // Start reversed OUT animation on original element (IN direction)
      isEntering = true;
      const transition = getTransition();
      if (!transition.out) return;

      const outConfig = await Promise.resolve(transition.out(element));

      // Use OUT config but reverse direction (backward)
      currentAnimation = Animator.fromState(currentState, {
        from: 1,
        to: 0,
        spring: outConfig.spring,
        onStart: outConfig.onStart,
        onUpdate: (value) => {
          outConfig.tick?.(value);
        },
        onComplete: () => {
          currentAnimation = null;
          isEntering = false;
          outConfig.onEnd?.();
        },
      });

      currentAnimation.backward();
      return;
    }

    // Scenario 1: No animation running OR IN already running
    if (!currentAnimation || !currentAnimation.getIsAnimating()) {
      // Start new IN animation
      isEntering = true;
      const transition = getTransition();
      if (!transition.in) return;

      const inConfig = await Promise.resolve(transition.in(element));

      // Apply prepare function if provided
      inConfig.prepare?.(element);

      currentAnimation = new Animator({
        from: 0,
        to: 1,
        spring: inConfig.spring,
        onStart: inConfig.onStart,
        onUpdate: (value) => {
          inConfig.tick?.(value);
        },
        onComplete: () => {
          currentAnimation = null;
          isEntering = false;
          inConfig.onEnd?.();
        },
      });

      currentAnimation.forward();
    }
    // If IN is already running, just continue
  };
  function runExitTransition(element: HTMLElement) {
    // Helper function to insert clone into DOM
    const insertClone = () => {
      if (!parentRef || !currentClone) return;

      if (nextSiblingRef && parentRef.contains(nextSiblingRef)) {
        parentRef.insertBefore(currentClone, nextSiblingRef);
      } else {
        parentRef.appendChild(currentClone);
      }
    };

    // Helper function to handle cleanup
    const cleanup = () => {
      if (currentClone) {
        currentClone.remove();
        currentClone = null;
      }
      currentAnimation = null;
      isEntering = false;
      options?.onCleanupEnd?.();
    };
    // Get transition
    const transition = getTransition();
    // Clone the element upfront
    currentClone = element.cloneNode(true) as HTMLElement;

    // Scenario 3: IN animation running + OUT trigger
    if (currentAnimation && currentAnimation.getIsAnimating() && isEntering) {
      // Stop current IN animation and create REVERSED IN animation (not OUT)
      const currentState = currentAnimation.getCurrentState();
      currentAnimation.stop();
      isEntering = false;

      // Get the IN config (not OUT) because we want to reverse the IN animation
      if (!transition.in) {
        currentClone = null;
        cleanup();
        return;
      }

      Promise.resolve(transition.in(currentClone)).then(async (inConfig) => {
        const outConfig =
          currentClone && (await transition.out?.(currentClone));

        if (outConfig?.prepare) {
          currentClone && outConfig.prepare(currentClone);
        }
        // Insert clone only after we have the transition config
        insertClone();

        // Use IN config but reverse direction (backward)
        currentAnimation = Animator.fromState(currentState, {
          from: 0,
          to: 1,
          spring: inConfig.spring,
          onStart: inConfig.onStart,
          onUpdate: (value) => {
            inConfig.tick?.(value);
          },
          onComplete: () => {
            inConfig.onEnd?.();
            cleanup();
          },
        });

        currentAnimation.backward();
      });

      return;
    }

    // Scenario 2: No animation running OR OUT already running
    if (
      !currentAnimation ||
      !currentAnimation.getIsAnimating() ||
      !isEntering
    ) {
      isEntering = false;

      if (!transition.out) {
        currentClone = null;
        cleanup();
        return;
      }

      Promise.resolve(transition.out(currentClone)).then((outConfig) => {
        // Apply prepare function if provided

        currentClone && outConfig.prepare?.(currentClone);

        // Insert clone after preparation
        insertClone();

        currentAnimation = new Animator({
          from: 1,
          to: 0,
          spring: outConfig.spring,
          onStart: outConfig.onStart,
          onUpdate: (value) => {
            outConfig.tick?.(value);
          },
          onComplete: () => {
            outConfig.onEnd?.();
            cleanup();
          },
        });

        currentAnimation.forward();
      });
    }
    // If OUT is already running, just continue
  }

  return (element: HTMLElement | null) => {
    if (!element) return;
    parentRef = element.parentElement;
    nextSiblingRef = element.nextElementSibling;

    const transition = getTransition();
    if (transition.in) {
      runEntrance(element);
    }

    // Return cleanup function for exit transition
    return () => {
      runExitTransition(element);
    };
  };
}
