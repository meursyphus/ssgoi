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
 * 1. OUT animation starts (when /home page disappears)
 *    - getTransition('unique-id', 'out', '/home') is called
 *    - Stores { from: '/home' } in pendingTransitions
 *    - Creates Promise and stores outResolve (not resolved yet)
 *    - Calls checkAndResolve → waits because 'to' is missing
 *
 * 2. IN animation starts (when /about page appears)
 *    - getTransition('unique-id', 'in', '/about') is called
 *    - Adds { to: '/about' } to existing pending
 *    - Creates Promise and stores inResolve
 *    - Calls checkAndResolve → both 'from' and 'to' are present!
 *
 * 3. Transition matching and resolution
 *    - Finds appropriate transition with from: '/home', to: '/about'
 *    - Resolves both out and in with the found transition's settings
 *    - Removes the id from pendingTransitions
 *
 * Key point: OUT and IN wait for each other. When both are ready,
 *           they find the appropriate transition using from/to info
 *           and resolve simultaneously.
 *
 * Edge cases:
 * - No OUT animation on page refresh or initial entry
 * - When only IN is called, checkAndResolve doesn't work without 'from'
 * - Promise isn't resolved, so animation doesn't start
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

  const getTransition = async (path: string, type: "out" | "in") => {
    // Skip animations if iOS swipe-back gesture is detected
    if (swipeDetector.isSwipePending()) {
      // Reset swipe detection to allow normal navigation after this check
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
