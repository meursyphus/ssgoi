import type { Transition, TransitionCallback } from "./types";
import { Animator } from "./animator";
import {
  createDefaultStrategy,
  type StrategyContext,
  type TransitionStrategy,
  type TransitionConfigs,
} from "./transition-strategy";

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
    if (!setup.config) {
      return;
    }

    setup.config.prepare?.(element);

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

    const configs: TransitionConfigs = {
      in: transition.in && Promise.resolve(transition.in(element)),
      out: transition.out && Promise.resolve(transition.out(element)),
    };

    const setup = await strategy.runOut(configs);
    if (!setup.config) {
      return;
    }

    setup.config.prepare?.(element);

    insertClone();

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

    return () => {
      const cloned = element.cloneNode(true) as HTMLElement;
      runExitTransition(cloned);
    };
  };
}
