import type { SsgoiConfig, SsgoiContext, GetTransitionConfig } from "../types";
import {
  TRANSITION_STRATEGY,
  createPageTransitionStrategy,
} from "../transition/transition-strategy";
import type { PendingTransition } from "./types";
import { processSymmetricTransitions } from "./process-symmetric-transitions";
import { createSwipeDetector } from "./create-swipe-detector";
import { createContextManager } from "./create-context-manager";
import { findMatchingTransition } from "./find-matching-transition";

/**
 * SSGOI Transition Context Operation Principles
 *
 * Page transition scenario: /home → /about
 *
 * **Order-independent design**: OUT and IN can arrive in any order.
 * This is necessary because:
 * - MutationObserver-based unmount detection may fire after mount
 * - Different frameworks have different callback ordering
 *
 * 1. First transition arrives (either OUT or IN)
 *    - Creates pendingTransition with path info
 *    - Starts timeout to wait for the other transition
 *    - Calls checkAndResolve → waits because pair is incomplete
 *
 * 2. Second transition arrives (the other of OUT/IN)
 *    - Clears the timeout
 *    - Adds path info to pendingTransition
 *    - Calls checkAndResolve → both 'from' and 'to' are present!
 *
 * 3. Transition matching and resolution
 *    - Finds appropriate transition with from/to paths
 *    - Resolves both out and in with the found transition's settings
 *    - Clears pendingTransition
 *
 * Edge cases:
 * - Page refresh or initial entry: Only IN arrives
 *   → Timeout expires, resolves with empty transition
 * - Orphan OUT (rare): Only OUT arrives
 *   → Timeout expires, just cleans up without resolving
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
    skipOnIosSwipe = true, // Default to true - skip animations on iOS swipe
  } = options;

  let pendingTransition: PendingTransition | null = null;

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

  function checkAndResolve() {
    if (pendingTransition?.from && pendingTransition?.to) {
      // Apply middleware transformation
      const { from: transformedFrom, to: transformedTo } = middleware(
        pendingTransition.from,
        pendingTransition.to,
      );

      const transition = findMatchingTransition(
        transformedFrom,
        transformedTo,
        processedTransitions,
      );
      const result = transition || defaultTransition;
      const scrollOffset = calculateScrollOffset(
        pendingTransition.from,
        pendingTransition.to,
      );

      // Create context for OUT transition (from page)
      const outContext = {
        scrollOffset,
        scroll: getScrollPosition(pendingTransition.from),
        get scrollingElement() {
          // Use lazy evaluation - get scrollContainer when actually accessed
          return getScrollContainer() || document.documentElement;
        },
        get positionedParent() {
          // Use lazy evaluation - get positioned parent from context manager
          return getPositionedParentElement();
        },
      };

      // Create context for IN transition (to page)
      const inContext = {
        scrollOffset,
        get scroll() {
          if (!pendingTransition) return { x: 0, y: 0 };
          return getScrollPosition(pendingTransition.to);
        },
        get scrollingElement() {
          // Use lazy evaluation - get scrollContainer when actually accessed
          return getScrollContainer() || document.documentElement;
        },
        get positionedParent() {
          // Use lazy evaluation - get positioned parent from context manager
          return getPositionedParentElement();
        },
      };

      if (result) {
        if (result.out && pendingTransition.outResolve) {
          pendingTransition.outResolve((element) =>
            result.out!(element, outContext),
          );
        }
        if (result.in && pendingTransition.inResolve) {
          pendingTransition.inResolve((element) =>
            result.in!(element, inContext),
          );
        }
      }

      pendingTransition = null;
    }
  }

  // Helper to cancel previous pending transition
  function cancelPendingTransition() {
    if (!pendingTransition) return;

    // Resolve any waiting promises with empty config to clean them up
    if (pendingTransition.inResolve) {
      pendingTransition.inResolve(() => ({}));
    }
    if (pendingTransition.outResolve) {
      pendingTransition.outResolve(() => ({}));
    }

    pendingTransition = null;
  }

  const getTransition = async (path: string, type: "out" | "in") => {
    // Skip animations if iOS swipe-back gesture is detected
    if (swipeDetector.isSwipePending()) {
      // Reset swipe detection to allow normal navigation after this check
      swipeDetector.resetSwipeDetection();
      return () => ({}); // Return empty transition
    }

    // If this is a new transition (different path), cancel previous one
    // Same path means it's the pair (OUT/IN) we're waiting for
    const isNewTransition =
      pendingTransition &&
      ((type === "out" &&
        pendingTransition.from &&
        pendingTransition.from !== path) ||
        (type === "in" &&
          pendingTransition.to &&
          pendingTransition.to !== path));

    if (isNewTransition) {
      cancelPendingTransition();
    }

    if (!pendingTransition) {
      pendingTransition = {};
    }

    if (type === "out") {
      pendingTransition.from = path;
      return new Promise<GetTransitionConfig>((resolve) => {
        pendingTransition!.outResolve = resolve;
        checkAndResolve();
        // No timeout - wait indefinitely for IN
      });
    } else {
      pendingTransition.to = path;
      return new Promise<GetTransitionConfig>((resolve) => {
        pendingTransition!.inResolve = resolve;
        checkAndResolve();
        // No timeout - wait indefinitely for OUT
        // Page is visible even without resolve (no prepare() called yet)
      });
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
