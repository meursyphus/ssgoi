import type { Transition, TransitionCallback } from "./types";
import { Animator } from "./animator";
import {
  createDefaultStrategy,
  type StrategyContext,
  type TransitionStrategy,
  type TransitionConfigs,
} from "./transition-strategy";

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
    strategy?: (context: StrategyContext) => TransitionStrategy;
  }
): TransitionCallback {
  // Combined state: tracks both animation instance and direction
  let currentAnimation: { animator: Animator; direction: "in" | "out" } | null =
    null;
  let currentClone: HTMLElement | null = null; // Track current clone element
  let parentRef: Element | null = null;
  let nextSiblingRef: Element | null = null;

  // Create context for strategy
  const context: StrategyContext = {
    get currentAnimation() {
      return currentAnimation;
    },
  };

  // Create strategy upfront for closure
  const strategy =
    options?.strategy?.(context) || createDefaultStrategy(context);

  const runEntrance = async (element: HTMLElement) => {
    if (currentClone) {
      currentClone.remove();
      currentClone = null;
    }
    const transition = getTransition();
    const configs: TransitionConfigs = {
      in: transition.in && Promise.resolve(transition.in(element)),
      out: transition.out && Promise.resolve(transition.out(element)),
    };

    const setup = await strategy.runIn(configs);

    if (!setup.config.tick && !setup.config.onStart && !setup.config.onEnd) {
      return;
    }
    if (setup.config.prepare) {
      setup.config.prepare(element);
    }
    const animator = Animator.fromState(setup.state, {
      spring: setup.config.spring,
      onStart: setup.config.onStart,
      onUpdate: setup.config.tick,
      onComplete: () => {
        currentAnimation = null;
        setup.config.onEnd?.();
      },
    });

    if (setup.direction === "forward") {
      animator.forward();
    } else {
      animator.backward();
    }

    currentAnimation = { animator, direction: "in" };
  };

  const runExitTransition = async (element: HTMLElement) => {
    currentClone = element;

    const transition = getTransition();

    const configs: TransitionConfigs = {
      in: transition.in && Promise.resolve(transition.in(element)),
      out: transition.out && Promise.resolve(transition.out(element)),
    };

    const setup = await strategy.runOut(configs);

    setup.config.prepare?.(element);

    insertClone();

    const animator = Animator.fromState(setup.state, {
      spring: setup.config.spring,
      onStart: setup.config.onStart,
      onUpdate: setup.config.tick,
      onComplete: () => {
        setup.config.onEnd?.();
        if (currentClone) {
          currentClone.remove();
          currentClone = null;
        }
        currentAnimation = null;
        options?.onCleanupEnd?.();
      },
    });

    if (setup.direction === "forward") {
      animator.forward();
    } else {
      animator.backward();
    }

    currentAnimation = { animator, direction: "out" };

    function insertClone() {
      if (!parentRef || !currentClone) return;

      if (nextSiblingRef && parentRef.contains(nextSiblingRef)) {
        parentRef.insertBefore(currentClone, nextSiblingRef);
      } else {
        parentRef.appendChild(currentClone);
      }
    }
  };

  return (element: HTMLElement | null) => {
    if (!element) return;
    parentRef = element.parentElement;
    nextSiblingRef = element.nextElementSibling;

    runEntrance(element);

    return () => {
      const cloned = element.cloneNode(true) as HTMLElement;
      runExitTransition(cloned);
    };
  };
}
