import type { NavigationDirection } from "@types";

export interface NavigationDirectionTracker {
  resolve(from: string, to: string): NavigationDirection;
  dispose(): void;
}

/**
 * Navigation hint used only where a route rule cannot determine direction
 * from its own boundary/order. A browser pop is backward; every explicit
 * navigation is forward, even when its destination equals the previous path.
 */
export function createNavigationDirectionTracker(): NavigationDirectionTracker {
  let popPending = false;
  const onPopState = () => {
    popPending = true;
  };

  if (typeof window !== "undefined") {
    window.addEventListener("popstate", onPopState);
  }

  return {
    resolve(_rawFrom, _rawTo) {
      const direction: NavigationDirection = popPending
        ? "backward"
        : "forward";
      popPending = false;
      return direction;
    },
    dispose() {
      if (typeof window !== "undefined") {
        window.removeEventListener("popstate", onPopState);
      }
    },
  };
}
