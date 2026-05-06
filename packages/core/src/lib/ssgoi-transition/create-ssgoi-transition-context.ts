import type {
  SsgoiConfig,
  SsgoiContext,
  SsgoiTransitionConfig,
  SsgoiTransitionConfigInput,
} from "@types";
import {
  TRANSITION_STRATEGY,
  createPageTransitionStrategy,
} from "../transition/transition-strategy";
import { processSymmetricTransitions } from "./process-symmetric-transitions";
import { createContextManager } from "./create-context-manager";
import { createSwipeBackDetector } from "./create-swipe-back-detector";
import { findMatchingTransition } from "./find-matching-transition";
import { createNavigationDetector } from "./navigation-detector-strategy";

function isTransitionGroup(
  transition: SsgoiTransitionConfigInput,
): transition is readonly SsgoiTransitionConfigInput[] {
  return Array.isArray(transition);
}

function flattenTransitions(
  transitions: readonly SsgoiTransitionConfigInput[],
): SsgoiTransitionConfig[] {
  const flattened: SsgoiTransitionConfig[] = [];

  for (const transition of transitions) {
    if (isTransitionGroup(transition)) {
      flattened.push(...flattenTransitions(transition));
    } else {
      flattened.push(transition);
    }
  }

  return flattened;
}

/**
 * SSGOI Transition Context Operation Principles
 *
 * Page transition scenario: /home → /about
 *
 * **Navigation detection**: OUT and IN can arrive in any order
 * - Best for frameworks using MutationObserver or lifecycle hooks
 * - Either OUT or IN can arrive first
 * - Both wait for the other to complete the pair
 *
 * Flow:
 * 1. First transition arrives → Creates pendingTransition
 * 2. Second transition arrives → Completes the pair
 * 3. checkAndResolve → Finds matching transition and resolves both
 */

/**
 * Creates a transition configuration
 *
 * @example
 * const config = createSggoiTransitionConfig({
 *   transitions: [
 *     { from: '/home', to: '/about', transition: fade() },
 *     { from: '/products', to: '/products/*', transition: slide() }
 *   ],
 *   defaultTransition: fade()
 * });
 */
export function createSggoiTransitionContext(
  options: SsgoiConfig,
): SsgoiContext {
  // Destructure options with defaults
  const {
    transitions = [],
    defaultTransition,
    middleware = (from, to) => ({ from, to }), // Identity function as default
    preserveScroll = (isMobile: boolean) => isMobile,
  } = options;

  const detector = createNavigationDetector();

  // Process symmetric transitions - creates bidirectional transitions automatically
  const processedTransitions = processSymmetricTransitions(
    flattenTransitions(transitions),
  );

  // Detect native edge swipe-back / swipe-forward gestures so we can suppress
  // animations that would fight the OS gesture (iOS Safari, Android system back).
  const swipeDetector = createSwipeBackDetector();
  swipeDetector.initialize();

  // Initialize context manager with preserveScroll option
  const {
    initializeContext,
    calculateScrollOffset,
    evictScrollPosition,
    shouldPreserve,
    getScrollContainer,
    getPositionedParentElement,
    getScrollPosition,
  } = createContextManager({
    preserveScroll,
  });

  /**
   * Get transition config for the given path and type
   * Uses NavigationDetector to collect out/in pairs
   */
  const getTransition = async (path: string, type: "out" | "in") => {
    // Capture swipe state at arrival time (before any reset). Both IN and OUT
    // observe the same value via the detector's sticky flag.
    const isSwipeBack = swipeDetector.isSwipeBack();

    // Trigger and wait for navigation pair
    detector.trigger(path, type);
    const pair = await detector.get(type);

    // Always reset on the IN side, even when the pair was cancelled. Otherwise
    // the swipe flag would leak into the next, unrelated navigation.
    if (type === "in") {
      swipeDetector.onPageEnter();
    }

    if (!pair) return () => ({});

    // Suppress animations that would fight the native swipe gesture, but still
    // honour scroll eviction for the from-side so a stale scroll position
    // doesn't bleed into the next visit to the same path.
    if (isSwipeBack) {
      if (type === "out" && pair.from && !shouldPreserve(pair.from)) {
        evictScrollPosition(pair.from);
      }
      return () => ({});
    }

    // Apply middleware transformation
    const { from: transformedFrom, to: transformedTo } = middleware(
      pair.from,
      pair.to,
    );

    // Find matching transition
    const transition = findMatchingTransition(
      transformedFrom,
      transformedTo,
      processedTransitions,
    );
    const result = transition || defaultTransition;

    if (!result) return () => ({});

    // Calculate scroll offset
    const scrollOffset = calculateScrollOffset(pair.from, pair.to);

    if (type === "out") {
      const outContext = {
        scrollOffset,
        scroll: getScrollPosition(pair.from),
        get scrollingElement() {
          return getScrollContainer() || document.documentElement;
        },
        get positionedParent() {
          return getPositionedParentElement();
        },
      };
      // Evict from-side scroll for non-preserved paths so stale values don't
      // bleed into a future OUT diff. outContext.scroll is already snapshot above.
      if (pair.from && !shouldPreserve(pair.from)) {
        evictScrollPosition(pair.from);
      }
      return (element: HTMLElement) => result.out!(element, outContext);
    } else {
      const inContext = {
        scrollOffset,
        get scroll() {
          return getScrollPosition(pair.to);
        },
        get scrollingElement() {
          return getScrollContainer() || document.documentElement;
        },
        get positionedParent() {
          return getPositionedParentElement();
        },
      };
      return (element: HTMLElement) => result.in!(element, inContext);
    }
  };

  const ssgoiContext = (path: string) => {
    return {
      key: path,
      in: async (element: HTMLElement) => {
        // Initialize context for this path when element enters
        initializeContext(element, path);

        const transitionConfig = await getTransition(path, "in");
        return transitionConfig(element);
      },
      out: async (element: HTMLElement) => {
        const transitionConfig = await getTransition(path, "out");
        return transitionConfig(element);
      },
      // Add page transition strategy for page-level transitions
      [TRANSITION_STRATEGY]: createPageTransitionStrategy,
    };
  };

  return ssgoiContext;
}
