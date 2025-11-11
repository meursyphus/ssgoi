import type { Transition, TransitionCallback } from "./types";
import { Animator } from "./animator";
import {
  createDefaultStrategy,
  type StrategyContext,
  type TransitionStrategy,
  type TransitionConfigs,
} from "./transition-strategy";
import {
  globalRemovalDetector,
  shouldAutoDetectRemoval,
} from "./removal-detection";

export function createTransitionCallback<TAnimationValue = number>(
  getTransition: () => Transition<undefined, TAnimationValue>,
  options?: {
    onCleanupEnd?: () => void;
    strategy?: (
      context: StrategyContext<TAnimationValue>,
    ) => TransitionStrategy<TAnimationValue>;
  },
): TransitionCallback {
  // Combined state: tracks both animation instance and direction
  let currentAnimation: {
    animator: Animator<TAnimationValue>;
    direction: "in" | "out";
  } | null = null;
  let currentClone: HTMLElement | null = null; // Track current clone element
  let parentRef: Element | null = null;
  let nextSiblingRef: Element | null = null;

  // Create context for strategy
  const context: StrategyContext<TAnimationValue> = {
    get currentAnimation() {
      return currentAnimation;
    },
  };

  // Create strategy upfront for closure
  const strategy =
    options?.strategy?.(context) ||
    createDefaultStrategy<TAnimationValue>(context);

  const runEntrance = async (element: HTMLElement) => {
    if (currentClone) {
      currentClone.remove();
      currentClone = null;
    }
    const transition = getTransition();
    const configs: TransitionConfigs<TAnimationValue> = {
      in: transition.in && Promise.resolve(transition.in(element)),
      out: transition.out && Promise.resolve(transition.out(element)),
    };

    const setup = await strategy.runIn(configs);
    if (!setup.config) {
      return;
    }

    setup.config.prepare?.(element);

    // Wait if configured
    if (setup.config.wait) {
      await setup.config.wait();
    }

    const animator = Animator.fromState(setup.state, {
      from: setup.from,
      to: setup.to,
      spring: setup.config.spring,
      onStart: setup.config.onStart,
      onUpdate: setup.config.tick,
      onComplete: () => {
        currentAnimation = null;
        setup.config?.onEnd?.();
      },
    });

    currentAnimation = { animator, direction: "in" };

    if (setup.direction === "forward") {
      animator.forward();
    } else {
      animator.backward();
    }
  };

  const runExitTransition = async (element: HTMLElement) => {
    currentClone = element;

    const transition = getTransition();

    const configs: TransitionConfigs<TAnimationValue> = {
      in: transition.in && Promise.resolve(transition.in(element)),
      out: transition.out && Promise.resolve(transition.out(element)),
    };

    const setup = await strategy.runOut(configs);
    if (!setup.config) {
      return;
    }

    setup.config.prepare?.(element);

    insertClone();

    // Wait if configured
    if (setup.config.wait) {
      await setup.config.wait();
    }

    const animator = Animator.fromState(setup.state, {
      from: setup.from,
      to: setup.to,
      spring: setup.config.spring,
      onStart: setup.config.onStart,
      onUpdate: setup.config.tick,
      onComplete: () => {
        setup.config?.onEnd?.();
        if (currentClone) {
          currentClone.remove();
          currentClone = null;
        }
        currentAnimation = null;
        options?.onCleanupEnd?.();
      },
    });

    currentAnimation = { animator, direction: "out" };

    if (setup.direction === "forward") {
      animator.forward();
    } else {
      animator.backward();
    }

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

    // Manual cleanup function
    const cleanup = () => {
      const cloned = element.cloneNode(true) as HTMLElement;
      runExitTransition(cloned);
    };

    // Setup automatic removal detection if enabled
    let detectorCleanup: (() => void) | undefined;
    if (shouldAutoDetectRemoval()) {
      detectorCleanup = globalRemovalDetector.observe(element, cleanup);
    }

    // Return cleanup function (for framework lifecycle hooks)
    return () => {
      // Disconnect detector first to prevent duplicate execution
      detectorCleanup?.();
      // Then run cleanup
      cleanup();
    };
  };
}
