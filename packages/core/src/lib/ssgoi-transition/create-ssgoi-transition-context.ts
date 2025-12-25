import type { SsgoiConfig, SsgoiContext, SsgoiInternalOptions } from "../types";
import {
  TRANSITION_STRATEGY,
  createPageTransitionStrategy,
} from "../transition/transition-strategy";
import { processSymmetricTransitions } from "./process-symmetric-transitions";
import { createSwipeDetector } from "./create-swipe-detector";
import { createContextManager } from "./create-context-manager";
import { findMatchingTransition } from "./find-matching-transition";
import {
  createOutFirstDetector,
  createAnyOrderDetector,
} from "./navigation-detector-strategy";

/**
 * SSGOI Transition Context Operation Principles
 *
 * Page transition scenario: /home → /about
 *
 * **Default mode (outFirst: true)**: OUT must arrive before IN
 * - Best for frameworks with native destroy callbacks (Svelte, Vue)
 * - OUT triggers first, then IN completes the pair
 * - If IN arrives without OUT, returns empty transition (page refresh)
 *
 * **Observer mode (outFirst: false)**: OUT and IN can arrive in any order
 * - Best for frameworks using MutationObserver (React)
 * - Either OUT or IN can arrive first
 * - Both wait indefinitely for the other to complete the pair
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
  internalOptions?: SsgoiInternalOptions,
): SsgoiContext {
  // Destructure options with defaults
  const {
    transitions = [],
    defaultTransition,
    middleware = (from, to) => ({ from, to }), // Identity function as default
    skipOnIosSwipe = true, // Default to true - skip animations on iOS swipe
  } = options;

  // Internal options (set by framework adapters)
  const { outFirst = true, createNavigationDetector } = internalOptions || {};

  // Create detector (injected or default based on outFirst)
  const detector =
    createNavigationDetector?.() ??
    (outFirst ? createOutFirstDetector() : createAnyOrderDetector());

  // Process symmetric transitions - creates bidirectional transitions automatically
  const processedTransitions = processSymmetricTransitions(transitions);

  // Initialize context manager
  const {
    initializeContext,
    calculateScrollOffset,
    getScrollContainer,
    getPositionedParentElement,
    getScrollPosition,
  } = createContextManager();

  // Initialize swipe detector
  const swipeDetector = createSwipeDetector(skipOnIosSwipe);
  swipeDetector.initialize();

  /**
   * Get transition config for the given path and type
   * Uses NavigationDetector to collect out/in pairs
   */
  const getTransition = async (path: string, type: "out" | "in") => {
    // Skip animations if iOS swipe-back gesture is detected
    if (swipeDetector.isSwipePending()) {
      swipeDetector.resetSwipeDetection();
      return () => ({});
    }

    // Trigger and wait for navigation pair
    detector.trigger(path, type);
    const pair = await detector.get(type);

    if (!pair) return () => ({});

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
