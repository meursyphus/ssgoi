import type {
  SsgoiConfig,
  SsgoiContext,
  GetTransitionConfig,
  Transition,
} from "./types";
import { getScrollingElement } from "./utils/get-scrolling-element";
import { getPositionedParent } from "./utils/get-positioned-parent";
import {
  TRANSITION_STRATEGY,
  createPageTransitionStrategy,
} from "./transition-strategy";

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

type PendingTransition = {
  from?: string;
  to?: string;
  outResolve?: (transition: GetTransitionConfig) => void;
  inResolve?: (transition: GetTransitionConfig) => void;
};

/**
 * Processes symmetric transitions to create bidirectional navigation
 * For each symmetric transition, creates a reverse transition automatically
 */
function processSymmetricTransitions(
  transitions: NonNullable<SsgoiConfig["transitions"]>,
): Omit<NonNullable<SsgoiConfig["transitions"]>[number], "symmetric">[] {
  const reversedTransitions = transitions
    .filter((t) => t.symmetric)
    .map((t) => ({
      from: t.to,
      to: t.from,
      transition: t.transition,
    }));

  return [...transitions, ...reversedTransitions];
}

/**
 * Creates a context manager for tracking transition-related information
 * including scroll positions and DOM element relationships
 */
function createContextManager() {
  let scrollContainer: HTMLElement | null = null;
  let contextElement: HTMLElement | null = null;
  const scrollPositions: Map<string, { x: number; y: number }> = new Map();
  const triggerElements: Map<string, HTMLElement> = new Map();
  let currentPath: string | null = null;

  // Scroll listener - captures current scroll position
  const scrollListener = () => {
    if (scrollContainer && currentPath) {
      scrollPositions.set(currentPath, {
        x: scrollContainer.scrollLeft,
        y: scrollContainer.scrollTop,
      });
    }
  };

  const targetElementListener = (e: Event) => {
    if (currentPath && e.target instanceof HTMLElement) {
      console.log("targetElementListener", currentPath, e.target);
      triggerElements.set(currentPath, e.target);
    }
  };

  // Initialize context with element - sets up scroll tracking and stores element for later use
  const initializeContext = (element: HTMLElement, path: string) => {
    // Store the element for positioned parent calculation
    contextElement = element;

    // Initialize scroll container once - finds the scrollable element
    if (!scrollContainer) {
      scrollContainer = getScrollingElement(element);

      // IMPORTANT: When the scrolling element is document.documentElement (html element),
      // scroll events must be attached to window, not the element itself.
      // This is because document.documentElement doesn't fire scroll events directly.
      // For all other scrollable containers, we attach the listener to the element.
      const target =
        scrollContainer === document.documentElement ? window : scrollContainer;
      target.addEventListener("scroll", scrollListener, {
        passive: true,
      });
    }

    // registeer event
    contextElement.removeEventListener("touchend", targetElementListener);
    contextElement.removeEventListener("mousedown", targetElementListener);
    contextElement.addEventListener("touchend", targetElementListener, {
      passive: true,
    });
    contextElement.addEventListener("mousedown", targetElementListener, {
      passive: true,
    });

    // Update current path for scroll position tracking
    currentPath = path;
  };

  // Calculate scroll offset - computes difference between pages' scroll positions
  const calculateScrollOffset = (
    from?: string,
    to?: string,
  ): { x: number; y: number } => {
    const fromScroll =
      from && scrollPositions.has(from)
        ? scrollPositions.get(from)!
        : { x: 0, y: 0 };

    const toScroll =
      to && scrollPositions.has(to) ? scrollPositions.get(to)! : { x: 0, y: 0 };

    return {
      x: -toScroll.x + fromScroll.x,
      y: -toScroll.y + fromScroll.y,
    };
  };

  // Getter for scroll container - returns null if not initialized yet
  const getScrollContainer = () => scrollContainer;

  // Get positioned parent element - finds the nearest positioned ancestor
  const getPositionedParentElement = () => {
    if (!contextElement) return document.body;
    return getPositionedParent(contextElement);
  };

  // Get scroll position for a specific path
  const getScrollPosition = (path?: string): { x: number; y: number } => {
    return path && scrollPositions.has(path)
      ? scrollPositions.get(path)!
      : { x: 0, y: 0 };
  };
  const getTriggerElement = (path?: string): HTMLElement | null => {
    return path && triggerElements.has(path)
      ? triggerElements.get(path)!
      : null;
  };

  return {
    initializeContext,
    calculateScrollOffset,
    getScrollContainer,
    getPositionedParentElement,
    getScrollPosition,
    getTriggerElement,
  };
}

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
    getTriggerElement,
  } = createContextManager();

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
        triggerElement: getTriggerElement(pendingTransition.from),
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
        triggerElement: getTriggerElement(pendingTransition.to),
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

/**
 * Matches a path against a pattern
 * Supports exact matches and wildcard patterns
 *
 * @example
 * matchPath('/products', '/products') // true
 * matchPath('/products/123', '/products/*') // true
 * matchPath('/products/123', '/products') // false
 * matchPath('/anything', '*') // true
 */
function findMatchingTransition<TContext>(
  from: string,
  to: string,
  transitions: Array<{
    from: string;
    to: string;
    transition: Transition<TContext>;
  }>,
): Transition<TContext> | null {
  // First try to find exact match for both from and to paths
  for (const config of transitions) {
    if (matchPath(from, config.from) && matchPath(to, config.to)) {
      return config.transition;
    }
  }

  // Then try wildcard matches if no exact match found
  for (const config of transitions) {
    if (
      (config.from === "*" || matchPath(from, config.from)) &&
      (config.to === "*" || matchPath(to, config.to))
    ) {
      return config.transition;
    }
  }

  return null;
}

function matchPath(path: string, pattern: string): boolean {
  // Universal match - asterisk matches any path
  if (pattern === "*") {
    return true;
  }

  // Wildcard match - pattern ending with /* matches path and subpaths
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -2);
    return path === prefix || path.startsWith(prefix + "/");
  }

  // Exact match - paths must be identical
  return path === pattern;
}
