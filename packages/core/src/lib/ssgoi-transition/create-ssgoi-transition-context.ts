import type {
  SsgoiConfig,
  SsgoiContext,
  SsgoiInternalOptions,
  GetTransitionConfig,
} from "../types";
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
  const { outFirst = true } = internalOptions || {};

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

  // Helper to cancel previous pending transition (observer mode only)
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

  /**
   * Default mode: OUT must arrive before IN
   * Original behavior for frameworks with native destroy callbacks
   */
  const getTransitionOutFirst = async (path: string, type: "out" | "in") => {
    // Skip animations if iOS swipe-back gesture is detected
    if (swipeDetector.isSwipePending()) {
      swipeDetector.resetSwipeDetection();
      return () => ({}); // Return empty transition
    }

    if (type === "in") {
      // If IN is called but no OUT is pending, no transition occurs (e.g., page refresh)
      if (!pendingTransition || !pendingTransition.from) {
        return () => ({}); // Return empty transition
      }
    }

    if (!pendingTransition) {
      pendingTransition = {};
    }

    if (type === "out") {
      pendingTransition.from = path;
      return new Promise<GetTransitionConfig>((resolve) => {
        pendingTransition!.outResolve = resolve;
        checkAndResolve();
      });
    } else {
      pendingTransition.to = path;
      return new Promise<GetTransitionConfig>((resolve) => {
        pendingTransition!.inResolve = resolve;
        checkAndResolve();
      });
    }
  };

  /**
   * Observer mode: OUT and IN can arrive in any order
   * For frameworks using MutationObserver for unmount detection
   */
  const getTransitionAnyOrder = async (path: string, type: "out" | "in") => {
    // Skip animations if iOS swipe-back gesture is detected
    if (swipeDetector.isSwipePending()) {
      swipeDetector.resetSwipeDetection();
      return () => ({}); // Return empty transition
    }

    // If this is a new transition (different path), cancel previous one
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
        // Wait indefinitely for IN
      });
    } else {
      pendingTransition.to = path;
      return new Promise<GetTransitionConfig>((resolve) => {
        pendingTransition!.inResolve = resolve;
        checkAndResolve();
        // Wait indefinitely for OUT
      });
    }
  };

  // Select the appropriate getTransition based on mode
  const getTransition = outFirst
    ? getTransitionOutFirst
    : getTransitionAnyOrder;

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
