import type { Transition, TransitionCallback, TransitionScope } from "../types";
import { normalizeToMultiSpring, normalizeMultiSpringSchedule } from "../types";
import { MultiAnimator } from "../animator/multi-animator";
import { Animator } from "../animator/types";
import {
  createDefaultStrategy,
  type StrategyContext,
  type TransitionStrategy,
  type InternalTransitionConfigs,
} from "./transition-strategy";
import { findScope, isScopeReady } from "./transition-scope";

export function createTransitionCallback(
  getTransition: () => Transition<undefined>,
  options?: {
    onCleanupEnd?: () => void;
    strategy?: (context: StrategyContext) => TransitionStrategy;
    scope?: TransitionScope;
  },
): TransitionCallback {
  let currentAnimation: {
    controller: Animator;
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

    const inConfig = transition.in && transition.in(element);
    const outConfig =
      !options?.strategy && transition.out
        ? transition.out(element)
        : undefined;

    if (!inConfig) {
      return;
    }

    // Normalize to multi-spring config before passing to strategy
    // normalizeToMultiSpring accepts Promise and resolves it internally
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

    const normalizedConfig = normalizeMultiSpringSchedule(
      {
        ...config,
        onEnd: () => {
          currentAnimation = null;
          config.onEnd?.();
        },
      },
      element,
    );

    const animator = MultiAnimator.fromState(setup.state, {
      config: normalizedConfig,
      from: setup.from,
      to: setup.to,
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
      !options?.strategy && transition.in ? transition.in(element) : undefined;
    const outConfig = transition.out && transition.out(element);

    if (!outConfig) {
      return;
    }

    // Normalize to multi-spring config before passing to strategy
    // normalizeToMultiSpring accepts Promise and resolves it internally
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

    const normalizedConfig = normalizeMultiSpringSchedule(
      {
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
      element,
    );

    const animator = MultiAnimator.fromState(setup.state, {
      config: normalizedConfig,
      from: setup.from,
      to: setup.to,
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

  // Cached scope reference (only set for 'local' scope)
  let scopeRef: Element | null = null;

  // Track if unmount has been triggered (prevents double execution)
  let unmountTriggered = false;

  // Function to handle unmount - returns cleanup function for framework adapters
  const createUnmountHandler = (element: HTMLElement) => {
    return () => {
      if (unmountTriggered) return;
      unmountTriggered = true;

      const cloned = element.cloneNode(true) as HTMLElement;

      if (scopeRef) {
        // Local scope: defer to microtask and check if scope still exists
        queueMicrotask(() => {
          if (!document.contains(scopeRef!)) {
            // Scope removed = simultaneous unmount = skip OUT animation
            return;
          }
          runExitTransition(cloned);
        });
      } else {
        // Global scope: run immediately
        runExitTransition(cloned);
      }
    };
  };

  return (element: HTMLElement | null) => {
    if (!element) return;
    requestAnimationFrame(() => {
      parentRef = element.parentElement;
      nextSiblingRef = element.nextElementSibling;
    });

    // Reset unmount flag for new element
    unmountTriggered = false;

    // === IN transition ===
    if (options?.scope === "local") {
      // Local scope: defer to microtask to find scope (parent ref may not have run yet)
      queueMicrotask(() => {
        scopeRef = findScope(element);

        if (scopeRef && !isScopeReady(scopeRef)) {
          // Scope not ready = simultaneous mount = skip IN animation
          return;
        }

        runEntrance(element);
      });
    } else {
      // Global scope: run immediately
      runEntrance(element);
    }

    // Return cleanup function for framework adapters to use
    // - Svelte: call in destroy()
    // - React: register with watchUnmount
    return createUnmountHandler(element);
  };
}
