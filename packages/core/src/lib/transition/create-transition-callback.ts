import type { Transition, TransitionCallback } from "../types";
import { normalizeToMultiSpring } from "../types";
import { MultiAnimator } from "../animator/multi-animator";
import { Animation } from "../animator/animation";
import {
  createDefaultStrategy,
  type StrategyContext,
  type TransitionStrategy,
  type InternalTransitionConfigs,
} from "./transition-strategy";

export function createTransitionCallback(
  getTransition: () => Transition<undefined>,
  options?: {
    onCleanupEnd?: () => void;
    strategy?: (context: StrategyContext) => TransitionStrategy;
  },
): TransitionCallback {
  let currentAnimation: {
    controller: Animation;
    direction: "in" | "out";
  } | null = null;
  let currentClone: HTMLElement | null = null;
  let parentRef: Element | null = null;
  let nextSiblingRef: Element | null = null;

  const context: StrategyContext = {
    get currentAnimation() {
      return currentAnimation;
    },
  };

  const strategy =
    options?.strategy?.(context) || createDefaultStrategy(context);

  const runEntrance = async (element: HTMLElement) => {
    if (currentClone) {
      currentClone.remove();
      currentClone = null;
    }
    const transition = getTransition();

    const inConfig = transition.in && (await transition.in(element));
    const outConfig =
      !options?.strategy && transition.out
        ? await transition.out(element)
        : undefined;

    if (!inConfig) {
      return;
    }

    // Normalize to multi-spring config before passing to strategy
    const configs: InternalTransitionConfigs = {
      in: normalizeToMultiSpring(inConfig),
      out: outConfig ? normalizeToMultiSpring(outConfig) : undefined,
    };

    const setup = await strategy.runIn(configs);
    if (!setup.config) {
      if (currentAnimation) {
        currentAnimation.direction = "in";
      }
      return;
    }

    const config = setup.config;

    config.prepare?.(element);
    if (config.wait) {
      await config.wait();
    }

    const animator = MultiAnimator.fromState(setup.state, {
      config: {
        ...config,
        onEnd: () => {
          currentAnimation = null;
          config.onEnd?.();
        },
      },
      from: setup.from,
      to: setup.to,
      element,
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
    const inConfig =
      !options?.strategy && transition.in
        ? await transition.in(element)
        : undefined;
    const outConfig = transition.out && (await transition.out(element));

    if (!outConfig) {
      return;
    }

    // Normalize to multi-spring config before passing to strategy
    const configs: InternalTransitionConfigs = {
      in: inConfig ? normalizeToMultiSpring(inConfig) : undefined,
      out: normalizeToMultiSpring(outConfig),
    };

    const setup = await strategy.runOut(configs);
    if (!setup.config) {
      if (currentAnimation) {
        currentAnimation.direction = "out";
      }
      if (currentClone) {
        currentClone.remove();
        currentClone = null;
      }
      return;
    }

    const config = setup.config;

    config.prepare?.(element);
    insertClone();
    if (config.wait) {
      await config.wait();
    }

    const animator = MultiAnimator.fromState(setup.state, {
      config: {
        ...config,
        onEnd: () => {
          config.onEnd?.();
          if (currentClone) {
            currentClone.remove();
            currentClone = null;
          }
          currentAnimation = null;
          options?.onCleanupEnd?.();
        },
      },
      from: setup.from,
      to: setup.to,
      element,
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
