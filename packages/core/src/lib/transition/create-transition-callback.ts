import type {
  Transition,
  TransitionCallback,
  AnimationController,
} from "../types";
import { AnimationScheduler } from "../animator/animation-scheduler";
import {
  createDefaultStrategy,
  type StrategyContext,
  type TransitionStrategy,
  type TransitionConfigs,
} from "./transition-strategy";
import { normalizeToMultiSpring } from "./normalize-config";

export function createTransitionCallback(
  getTransition: () => Transition<undefined>,
  options?: {
    onCleanupEnd?: () => void;
    strategy?: (context: StrategyContext) => TransitionStrategy;
  },
): TransitionCallback {
  let currentAnimation: {
    controller: AnimationController;
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

    const inConfigRaw = transition.in?.(element);
    if (!inConfigRaw) {
      return;
    }

    const outConfigRaw =
      !options?.strategy && transition.out
        ? transition.out(element)
        : undefined;

    const configs: TransitionConfigs = {
      in: normalizeToMultiSpring(inConfigRaw, element),
      out: outConfigRaw
        ? normalizeToMultiSpring(outConfigRaw, element)
        : undefined,
    };

    const setup = await strategy.runIn(configs);
    if (!setup.config) {
      if (currentAnimation) {
        currentAnimation.direction = "in";
      }
      return;
    }

    const multiConfig = setup.config;
    multiConfig.prepare?.(element);
    if (multiConfig.wait) {
      await multiConfig.wait();
    }

    const scheduler = AnimationScheduler.fromState(setup.state, {
      ...multiConfig,
      onEnd: () => {
        currentAnimation = null;
        multiConfig.onEnd?.();
      },
    });

    currentAnimation = { controller: scheduler, direction: "in" };

    if (setup.direction === "forward") {
      scheduler.forward();
    } else {
      scheduler.backward();
    }
  };

  const runExitTransition = async (element: HTMLElement) => {
    currentClone = element;

    const transition = getTransition();
    const outConfigRaw = transition.out?.(element);

    if (!outConfigRaw) {
      return;
    }

    const inConfigRaw =
      !options?.strategy && transition.in ? transition.in(element) : undefined;

    const configs: TransitionConfigs = {
      in: inConfigRaw
        ? normalizeToMultiSpring(inConfigRaw, element)
        : undefined,
      out: normalizeToMultiSpring(outConfigRaw, element),
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

    const multiConfig = setup.config;
    multiConfig.prepare?.(element);
    insertClone();
    if (multiConfig.wait) {
      await multiConfig.wait();
    }

    const scheduler = AnimationScheduler.fromState(setup.state, {
      ...multiConfig,
      onEnd: () => {
        multiConfig.onEnd?.();
        if (currentClone) {
          currentClone.remove();
          currentClone = null;
        }
        currentAnimation = null;
        options?.onCleanupEnd?.();
      },
    });

    currentAnimation = { controller: scheduler, direction: "out" };

    if (setup.direction === "forward") {
      scheduler.forward();
    } else {
      scheduler.backward();
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
