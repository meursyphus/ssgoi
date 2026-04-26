import type { SsgoiConfig, SsgoiContext, SsgoiInternalOptions } from "../types";
import {
  TRANSITION_STRATEGY,
  createPageTransitionStrategy,
} from "../transition/transition-strategy";
import { processSymmetricTransitions } from "./process-symmetric-transitions";
import { createNavigationDirectionDetector } from "./create-navigation-direction-detector";
import { createContextManager } from "./create-context-manager";
import { findMatchingTransition } from "./find-matching-transition";
import {
  createOutFirstDetector,
  createAnyOrderDetector,
} from "./navigation-detector-strategy";
import { matchPlatform } from "../utils";

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
    skipAnimationOnBack = ["ios"],
    preserveScroll = (isMobile: boolean) => isMobile,
  } = options;

  // Determine if we should skip on back navigation based on current platform
  const shouldSkipOnBack = matchPlatform(skipAnimationOnBack);

  // Internal options (set by framework adapters)
  const { outFirst = true } = internalOptions || {};

  // Create detector based on outFirst preference
  const detector = outFirst
    ? createOutFirstDetector()
    : createAnyOrderDetector();

  // Process symmetric transitions - creates bidirectional transitions automatically
  const processedTransitions = processSymmetricTransitions(transitions);

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

  // Initialize navigation direction detector for back navigation detection
  const directionDetector = createNavigationDirectionDetector();
  if (shouldSkipOnBack) {
    directionDetector.initialize();
  }

  /**
   * Get transition config for the given path and type
   * Uses NavigationDetector to collect out/in pairs
   */
  const getTransition = async (path: string, type: "out" | "in") => {
    // Capture back navigation state at arrival time (before any reset)
    // Both IN and OUT will see the same direction since they're part of the same navigation
    const isBackNavigation = shouldSkipOnBack && directionDetector.isBack();

    // Trigger and wait for navigation pair
    detector.trigger(path, type);
    const pair = await detector.get(type);

    if (!pair) return () => ({});

    // Reset direction after pair is complete (only on IN to avoid double reset)
    if (type === "in" && shouldSkipOnBack) {
      directionDetector.onPageEnter();
    }

    // Skip animations on back navigation (after detector pairing is complete)
    if (isBackNavigation) {
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
