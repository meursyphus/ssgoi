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
  let pendingDirection: NavigationDirection | null = null;
  let programmaticTraversal: NavigationDirection | null = null;
  let traversalTimeout: ReturnType<typeof setTimeout> | null = null;

  const clearTraversalTimeout = () => {
    if (traversalTimeout !== null) clearTimeout(traversalTimeout);
    traversalTimeout = null;
  };
  const markProgrammaticTraversal = (direction: NavigationDirection) => {
    pendingDirection = direction;
    programmaticTraversal = direction;
    clearTraversalTimeout();
    // history.back() can be a no-op at the beginning of the session. Do not
    // let that uncommitted hint leak into a later explicit navigation.
    traversalTimeout = setTimeout(() => {
      if (programmaticTraversal !== direction) return;
      programmaticTraversal = null;
      if (pendingDirection === direction) pendingDirection = null;
      traversalTimeout = null;
    }, 1_000);
  };
  const onPopState = () => {
    if (programmaticTraversal !== null) {
      // The method wrapper already marked this traversal before the router
      // could commit. Ignore its later popstate so it cannot poison the next
      // explicit navigation after the current hint has been consumed.
      programmaticTraversal = null;
      clearTraversalTimeout();
      return;
    }
    pendingDirection = "backward";
  };

  let historyRef: History | null = null;
  let originalBack: History["back"] | null = null;
  let originalForward: History["forward"] | null = null;
  let originalGo: History["go"] | null = null;
  let wrappedBack: History["back"] | null = null;
  let wrappedForward: History["forward"] | null = null;
  let wrappedGo: History["go"] | null = null;

  if (typeof window !== "undefined") {
    window.addEventListener("popstate", onPopState, true);

    historyRef = window.history;
    originalBack = historyRef.back;
    originalForward = historyRef.forward;
    originalGo = historyRef.go;
    wrappedBack = () => {
      markProgrammaticTraversal("backward");
      return originalBack?.call(historyRef);
    };
    wrappedForward = () => {
      markProgrammaticTraversal("forward");
      return originalForward?.call(historyRef);
    };
    wrappedGo = (delta = 0) => {
      if (delta < 0) markProgrammaticTraversal("backward");
      else if (delta > 0) markProgrammaticTraversal("forward");
      return originalGo?.call(historyRef, delta);
    };
    historyRef.back = wrappedBack;
    historyRef.forward = wrappedForward;
    historyRef.go = wrappedGo;
  }

  return {
    resolve(_rawFrom, _rawTo) {
      const direction = pendingDirection ?? "forward";
      pendingDirection = null;
      return direction;
    },
    dispose() {
      clearTraversalTimeout();
      if (typeof window !== "undefined") {
        window.removeEventListener("popstate", onPopState, true);
      }
      if (historyRef) {
        if (historyRef.back === wrappedBack && originalBack)
          historyRef.back = originalBack;
        if (historyRef.forward === wrappedForward && originalForward)
          historyRef.forward = originalForward;
        if (historyRef.go === wrappedGo && originalGo)
          historyRef.go = originalGo;
      }
    },
  };
}
