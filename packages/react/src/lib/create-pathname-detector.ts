import type { NavigationDetector, NavigationPair } from "@ssgoi/core";

/**
 * Creates a NavigationDetector based on pathname changes
 * Uses getPathname() to detect navigation without relying on IN/OUT callbacks
 */
export function createPathnameDetector(
  getPathname: () => string,
): NavigationDetector {
  let prevPathname: string | null = null;
  let currentPair: NavigationPair | null = null;
  let outConsumed = false;
  let inConsumed = false;

  return {
    trigger() {
      // no-op - pathname changes are detected via getPathname()
    },

    get(type): Promise<NavigationPair | null> {
      const currentPathname = getPathname();

      // Create new pair if none exists or both have been consumed
      if (!currentPair || (outConsumed && inConsumed)) {
        // First load or same path - no transition
        if (!prevPathname || prevPathname === currentPathname) {
          prevPathname = currentPathname;
          return Promise.resolve(null);
        }

        // Create new pair
        currentPair = {
          from: prevPathname,
          to: currentPathname,
        };
        outConsumed = false;
        inConsumed = false;
      }

      // Mark as consumed
      if (type === "out") {
        outConsumed = true;
      } else {
        inConsumed = true;
      }

      const pair = currentPair;

      // Update prevPathname only after both consumed
      if (outConsumed && inConsumed) {
        prevPathname = currentPathname;
        currentPair = null;
      }

      return Promise.resolve(pair);
    },
  };
}
