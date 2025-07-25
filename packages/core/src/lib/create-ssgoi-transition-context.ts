import type {
  SsgoiConfig,
  SsgoiContext,
  GetTransitionConfig,
  Transition,
} from "./types";
import { getScrollingElement } from "./utils";

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
  options: SsgoiConfig
): SsgoiContext {
  let pendingTransition: PendingTransition | null = null;

  // Process symmetric transitions - creates bidirectional transitions automatically
  const processedTransitions = [...options.transitions];
  const symmetricTransitions: typeof options.transitions = [];
  
  for (const transitionDef of options.transitions) {
    if (transitionDef.symmetric) {
      // Check if reverse transition already exists to avoid duplicates
      const reverseExists = processedTransitions.some(
        t => t.from === transitionDef.to && t.to === transitionDef.from
      );
      
      if (!reverseExists) {
        // Create reverse transition for symmetric navigation
        symmetricTransitions.push({
          from: transitionDef.to,
          to: transitionDef.from,
          transition: transitionDef.transition,
          // Don't add symmetric flag to the reverse to avoid infinite loop
        });
      }
    }
  }
  
  // Add symmetric transitions to the processed list for matching
  processedTransitions.push(...symmetricTransitions);

  // Scroll tracking - preserves scroll positions between page transitions
  let scrollContainer: HTMLElement | null = null;
  const scrollPositions: Map<string, { x: number; y: number }> = new Map();
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

  // Start tracking scroll for a path - initializes scroll container and updates current path
  const startScrollTracking = (element: HTMLElement, path: string) => {
    // Initialize scroll container once - finds the scrollable element
    if (!scrollContainer) {
      scrollContainer = getScrollingElement(element);
      scrollContainer.addEventListener("scroll", scrollListener, {
        passive: true,
      });
    }

    // Update current path for scroll position tracking
    currentPath = path;
  };

  // Calculate scroll offset - computes difference between pages' scroll positions
  const calculateScrollOffset = (): { x: number; y: number } => {
    const from = pendingTransition?.from;
    const to = pendingTransition?.to;

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

  function checkAndResolve() {
    if (pendingTransition?.from && pendingTransition?.to) {
      const transition = findMatchingTransition(
        pendingTransition.from,
        pendingTransition.to,
        processedTransitions
      );
      const result = transition || options.defaultTransition;
      const scrollOffset = calculateScrollOffset();
      const context = { scrollOffset };

      if (result) {
        if (result.out && pendingTransition.outResolve) {
          pendingTransition.outResolve((element) =>
            result.out!(element, context)
          );
        }
        if (result.in && pendingTransition.inResolve) {
          pendingTransition.inResolve((element) =>
            result.in!(element, context)
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

  return (path: string) => {
    return {
      key: path,
      in: async (element: HTMLElement) => {
        // Start scroll tracking for this path when element enters
        startScrollTracking(element, path);

        const transitionConfig = await getTransition(path, "in");
        return transitionConfig(element);
      },
      out: async (element: HTMLElement) => {
        const transitionConfig = await getTransition(path, "out");
        return transitionConfig(element);
      },
    };
  };
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
  }>
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
