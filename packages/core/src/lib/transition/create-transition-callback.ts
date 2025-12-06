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

    const inConfig = transition.in && (await transition.in(element));
    const outConfig =
      !options?.strategy && transition.out
        ? transition.out(element)
        : undefined;

    if (!inConfig) {
      return;
    }

    // Multi-spring path
    if (isMultiSpring(inConfig)) {
      const configs: TransitionConfigs = {
        in: Promise.resolve(inConfig),
        out: outConfig && Promise.resolve(outConfig),
      };

      const setup = await strategy.runIn(configs);
      if (!setup.config) {
        if (currentAnimation) {
          currentAnimation.direction = "in";
        }
        return;
      }

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

      currentAnimation = { controller: scheduler, direction: "in" };
      scheduler.forward();
      return;
    }

    // Single-spring path
    const configs: TransitionConfigs = {
      in: Promise.resolve(inConfig),
      out: outConfig && Promise.resolve(outConfig),
    };

    const setup = await strategy.runIn(configs);
    if (!setup.config || "springs" in setup.config) {
      return;
    }

    setup.config.prepare?.(element);
    if (setup.config.wait) {
      await setup.config.wait();
    }

    const animator = Animator.fromState(
      { position: setup.state.position as number },
      {
        from: setup.from,
        to: setup.to,
        spring: setup.config.spring,
        tick: setup.config.tick,
        css: setup.config.css
          ? { element, style: setup.config.css }
          : undefined,
        onStart: setup.config.onStart,
        onComplete: () => {
          currentAnimation = null;
          setup.config?.onEnd?.();
        },
      },
    );

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
    const outConfig = transition.out && (await transition.out(element));

    if (!outConfig) {
      return;
    }

    // Multi-spring path
    if (isMultiSpring(outConfig)) {
      const configs: TransitionConfigs = {
        in: undefined,
        out: Promise.resolve(outConfig),
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

      currentAnimation = { controller: scheduler, direction: "out" };
      scheduler.forward();
      return;
    }

    // Single-spring path
    const configs: TransitionConfigs = {
      in: undefined,
      out: Promise.resolve(outConfig),
    };

    const setup = await strategy.runOut(configs);
    if (!setup.config || "springs" in setup.config) {
      return;
    }

    setup.config.prepare?.(element);
    insertClone();
    if (setup.config.wait) {
      await setup.config.wait();
    }

    const animator = Animator.fromState(
      { position: setup.state.position as number },
      {
        from: setup.from,
        to: setup.to,
        spring: setup.config.spring,
        tick: setup.config.tick,
        css: setup.config.css
          ? { element, style: setup.config.css }
          : undefined,
        onStart: setup.config.onStart,
        onComplete: () => {
          setup.config?.onEnd?.();
          if (currentClone) {
            currentClone.remove();
            currentClone = null;
          }
          currentAnimation = null;
          options?.onCleanupEnd?.();
        },
      },
    );

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
