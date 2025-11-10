import type {
  Transition,
  TransitionCallback,
  AnimationController,
} from "../types";
import { isMultiSpring } from "../types";
import { Animator } from "../animator";
import { AnimationScheduler } from "../animator/animation-scheduler";
import {
  createDefaultStrategy,
  type StrategyContext,
  type TransitionStrategy,
  type TransitionConfigs,
} from "./transition-strategy";

export function createTransitionCallback<TAnimationValue = number>(
  getTransition: () => Transition<undefined, TAnimationValue>,
  options?: {
    onCleanupEnd?: () => void;
    strategy?: (
      context: StrategyContext<TAnimationValue>,
    ) => TransitionStrategy<TAnimationValue>;
  },
): TransitionCallback {
  // Combined state: tracks both animation controller (Animator or AnimationScheduler) and direction
  let currentAnimation: {
    controller: AnimationController<TAnimationValue>;
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

    // Get transition config
    const inConfig = transition.in && (await transition.in(element));

    // Only fetch OUT config for DOM element transitions (those without custom strategy)
    // Page transitions (with createPageTransitionStrategy) don't need OUT config here
    // because calling transition.out() would start a new pending transition that never resolves
    const outConfig =
      !options?.strategy && transition.out
        ? transition.out(element)
        : undefined;

    if (!inConfig) {
      return;
    }

    // Check if multi-spring animation
    if (isMultiSpring(inConfig)) {
      // Multi-spring path: use AnimationScheduler
      // Check if we should reverse current animation via strategy
      const configs: TransitionConfigs<TAnimationValue> = {
        in: Promise.resolve(inConfig),
        out: outConfig && Promise.resolve(outConfig),
      };

      const setup = await strategy.runIn(configs);

      // If config is undefined, strategy already handled reversal
      if (!setup.config) {
        // Strategy reversed the existing AnimationScheduler
        // Update direction
        if (currentAnimation) {
          currentAnimation.direction = "in";
        }
        return;
      }

      // Create new AnimationScheduler
      inConfig.prepare?.(element);

      if (inConfig.wait) {
        await inConfig.wait();
      }

      const scheduler = new AnimationScheduler({
        ...inConfig,
        onEnd: () => {
          currentAnimation = null;
          inConfig.onEnd?.();
        },
      });

      currentAnimation = {
        controller: scheduler as AnimationController<TAnimationValue>,
        direction: "in",
      };
      scheduler.forward();
      return;
    }

    // Single-spring path: use Animator with strategy
    const configs: TransitionConfigs<TAnimationValue> = {
      in: Promise.resolve(inConfig),
      out: outConfig && Promise.resolve(outConfig),
    };

    const setup = await strategy.runIn(configs);
    if (!setup.config) {
      return;
    }

    // Type guard: config must be SingleSpringConfig at this point
    // because we already handled MultiSpringConfig above
    if ("springs" in setup.config) {
      console.error("Unexpected MultiSpringConfig in single-spring path");
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

    currentAnimation = { controller: animator, direction: "in" };

    if (setup.direction === "forward") {
      animator.forward();
    } else {
      animator.backward();
    }
  };

  const runExitTransition = async (element: HTMLElement) => {
    currentClone = element;

    const transition = getTransition();

    // Get transition config
    // NOTE: Don't call transition.in() here - it can interfere with page transitions
    // by modifying pendingTransition state. OUT transitions only need OUT config.
    const outConfig = transition.out && (await transition.out(element));

    if (!outConfig) {
      return;
    }

    // Check if multi-spring animation
    if (isMultiSpring(outConfig)) {
      // Multi-spring path: use AnimationScheduler
      // Check if we should reverse current animation via strategy
      const configs: TransitionConfigs<TAnimationValue> = {
        in: undefined, // Don't fetch IN config for exit transitions
        out: Promise.resolve(outConfig),
      };

      const setup = await strategy.runOut(configs);

      // If config is undefined, strategy already handled reversal
      if (!setup.config) {
        // Strategy reversed the existing AnimationScheduler
        // Update direction and cleanup clone
        if (currentAnimation) {
          currentAnimation.direction = "out";
        }
        if (currentClone) {
          currentClone.remove();
          currentClone = null;
        }
        return;
      }

      // Create new AnimationScheduler
      outConfig.prepare?.(element);

      insertClone();

      if (outConfig.wait) {
        await outConfig.wait();
      }

      const scheduler = new AnimationScheduler({
        ...outConfig,
        onEnd: () => {
          outConfig.onEnd?.();
          if (currentClone) {
            currentClone.remove();
            currentClone = null;
          }
          currentAnimation = null;
          options?.onCleanupEnd?.();
        },
      });

      currentAnimation = {
        controller: scheduler as AnimationController<TAnimationValue>,
        direction: "out",
      };
      scheduler.forward();
      return;
    }

    // Single-spring path: use Animator with strategy
    const configs: TransitionConfigs<TAnimationValue> = {
      in: undefined, // Don't fetch IN config for exit transitions
      out: Promise.resolve(outConfig),
    };

    const setup = await strategy.runOut(configs);
    if (!setup.config) {
      return;
    }

    // Type guard: config must be SingleSpringConfig at this point
    // because we already handled MultiSpringConfig above
    if ("springs" in setup.config) {
      console.error("Unexpected MultiSpringConfig in single-spring path");
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

    currentAnimation = { controller: animator, direction: "out" };

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
      if (element.isConnected) {
        const cloned = element.cloneNode(true) as HTMLElement;
        runExitTransition(cloned);
      } else {
        runExitTransition(element);
      }
    };
  };
}
