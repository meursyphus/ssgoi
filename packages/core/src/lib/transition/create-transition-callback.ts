import type { Transition, TransitionCallback, TransitionScope } from "../types";
import { normalizeToMultiAnimation, normalizeSchedule } from "../types";
import { MultiAnimator } from "../animator/multi-animator";
import { Animator } from "../animator/types";
import {
  createDefaultStrategy,
  type StrategyContext,
  type TransitionStrategy,
  type InternalTransitionConfigs,
} from "./transition-strategy";
import { findScope, isScopeReady } from "./transition-scope";
import { waitPaint } from "../utils";
import {
  watchActivityHide,
  unwatchActivityHide,
  revealForAnimation,
  hideAfterAnimation,
} from "./activity-observer";

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
    // normalizeToMultiAnimation accepts Promise and resolves it internally
    const configs: InternalTransitionConfigs = {
      in: normalizeToMultiAnimation(inConfig),
      out: outConfig ? normalizeToMultiAnimation(outConfig) : undefined,
    };

    const setup = await strategy.runIn(configs);
    if (!setup.config) {
      if (currentAnimation) {
        currentAnimation.direction = "in";
      }
      return;
    }

    const config = setup.config;

    config.prepare?.();

    const normalizedConfig = normalizeSchedule(
      {
        ...config,
        onEnd: () => {
          currentAnimation = null;
          config.onEnd?.();
        },
      },
      element,
    );

    if (config.wait) {
      await config.wait();
    }

    const animator = MultiAnimator.fromState(setup.state, {
      config: normalizedConfig,
      from: setup.from,
      to: setup.to,
    });

    currentAnimation = { controller: animator, direction: "in" };

    config.onReady?.();

    await waitPaint(element);

    if (setup.direction === "forward") {
      animator.forward();
    } else {
      animator.backward();
    }
  };

  /**
   * Run exit transition
   * @param element - Element to animate (clone for traditional mode, original for Activity mode)
   * @param mode - 'clone' for traditional unmount, 'activity' for Activity hidden
   */
  const runExitTransition = async (
    element: HTMLElement,
    mode: "clone" | "activity" = "clone",
  ) => {
    const isActivityMode = mode === "activity";

    if (!isActivityMode) {
      currentClone = element;
    }

    const transition = getTransition();
    const inConfig =
      !options?.strategy && transition.in ? transition.in(element) : undefined;
    const outConfig = transition.out && transition.out(element);

    if (!outConfig) {
      if (!isActivityMode && currentClone) {
        currentClone.remove();
        currentClone = null;
      }
      if (isActivityMode) {
        // Keep element hidden if no animation
        hideAfterAnimation(element);
      }
      return;
    }

    // Normalize to multi-spring config before passing to strategy
    // normalizeToMultiAnimation accepts Promise and resolves it internally
    const configs: InternalTransitionConfigs = {
      in: inConfig ? normalizeToMultiAnimation(inConfig) : undefined,
      out: normalizeToMultiAnimation(outConfig),
    };

    const setup = await strategy.runOut(configs);
    if (!setup.config) {
      if (currentAnimation) {
        currentAnimation.direction = "out";
      }
      if (!isActivityMode && currentClone) {
        currentClone.remove();
        currentClone = null;
      }
      if (isActivityMode) {
        hideAfterAnimation(element);
      }
      return;
    }

    const config = setup.config;

    // Activity mode: reveal element; Clone mode: insert clone
    if (isActivityMode) {
      revealForAnimation(element);
    } else {
      insertClone();
    }
    config.prepare?.();

    const normalizedConfig = normalizeSchedule(
      {
        ...config,
        onEnd: () => {
          config.onEnd?.();
          if (isActivityMode) {
            // Activity mode: hide element back
            hideAfterAnimation(element);
          } else if (currentClone) {
            // Clone mode: remove clone
            currentClone.remove();
            currentClone = null;
          }
          currentAnimation = null;
          options?.onCleanupEnd?.();
        },
      },
      element,
    );

    if (config.wait) {
      await config.wait();
    }

    const animator = MultiAnimator.fromState(setup.state, {
      config: normalizedConfig,
      from: setup.from,
      to: setup.to,
    });

    currentAnimation = { controller: animator, direction: "out" };

    config.onReady?.();

    await waitPaint(element);

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

  // Track if exit has been triggered (prevents double execution from both Activity and unmount)
  let exitTriggered = false;

  // Current element reference for Activity cleanup
  let currentElementRef: HTMLElement | null = null;

  // Handler for Activity hidden detection (display: none)
  const handleActivityHide = (element: HTMLElement) => {
    if (exitTriggered) return;
    exitTriggered = true;

    if (scopeRef) {
      queueMicrotask(() => {
        if (!document.contains(scopeRef!)) {
          // Scope removed = skip OUT animation
          hideAfterAnimation(element);
          return;
        }
        runExitTransition(element, "activity");
      });
    } else {
      runExitTransition(element, "activity");
    }
  };

  // Function to handle unmount (traditional clone mode) - returns cleanup function for framework adapters
  const createUnmountHandler = (element: HTMLElement) => {
    return () => {
      // Cleanup Activity watcher
      unwatchActivityHide(element);

      if (exitTriggered) return;
      exitTriggered = true;

      const cloned = element.cloneNode(true) as HTMLElement;

      if (scopeRef) {
        // Local scope: defer to microtask and check if scope still exists
        queueMicrotask(() => {
          if (!document.contains(scopeRef!)) {
            // Scope removed = simultaneous unmount = skip OUT animation
            return;
          }
          runExitTransition(cloned, "clone");
        });
      } else {
        // Global scope: run immediately
        runExitTransition(cloned, "clone");
      }
    };
  };

  return (element: HTMLElement | null) => {
    if (!element) return;

    // Cleanup previous element's Activity watcher if any
    if (currentElementRef) {
      unwatchActivityHide(currentElementRef);
    }
    currentElementRef = element;

    requestAnimationFrame(() => {
      parentRef = element.parentElement;
      nextSiblingRef = element.nextElementSibling;
    });

    // Reset exit flag for new element
    exitTriggered = false;

    // === Register Activity observer ===
    // This detects when React Activity hides element with display:none
    // If Activity hides first, we use Activity mode (no clone)
    // If DOM unmount happens first, we use traditional clone mode
    watchActivityHide(element, handleActivityHide);

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
