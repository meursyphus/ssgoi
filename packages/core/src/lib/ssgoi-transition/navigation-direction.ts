import type { NavigationDirection } from "@types";
import { normalizePath } from "./path-pattern";

export interface NavigationDirectionTracker {
  resolve(from: string, to: string): NavigationDirection;
  dispose(): void;
}

/**
 * Lightweight semantic history used only where a route rule cannot determine
 * direction from its own boundary/order. A browser pop wins; otherwise a
 * navigation to the immediately previous route is backward even when an app
 * implemented its back button with push().
 */
export function createNavigationDirectionTracker(): NavigationDirectionTracker {
  const stack: string[] = [];
  let popPending = false;
  const onPopState = () => {
    popPending = true;
  };

  if (typeof window !== "undefined") {
    window.addEventListener("popstate", onPopState);
  }

  return {
    resolve(rawFrom, rawTo) {
      const from = normalizePath(rawFrom);
      const to = normalizePath(rawTo);

      if (stack.length === 0) {
        stack.push(from);
      } else if (stack[stack.length - 1] !== from) {
        const knownFrom = stack.lastIndexOf(from);
        if (knownFrom >= 0) stack.splice(knownFrom + 1);
        else stack.push(from);
      }

      const previous = stack[stack.length - 2];
      const direction: NavigationDirection =
        popPending || previous === to ? "backward" : "forward";
      popPending = false;

      if (direction === "backward") {
        const knownTo = stack.lastIndexOf(to);
        if (knownTo >= 0) stack.splice(knownTo + 1);
        else stack.push(to);
      } else if (stack[stack.length - 1] !== to) {
        stack.push(to);
      }

      return direction;
    },
    dispose() {
      if (typeof window !== "undefined") {
        window.removeEventListener("popstate", onPopState);
      }
    },
  };
}
