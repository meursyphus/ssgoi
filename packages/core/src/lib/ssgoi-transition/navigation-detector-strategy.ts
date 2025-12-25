/**
 * Navigation Detector Strategy
 *
 * Collects out/in navigation events and provides navigation pairs.
 * Each strategy handles the timing differently:
 * - OutFirst: OUT must arrive before IN (for Svelte, Vue)
 * - AnyOrder: OUT and IN can arrive in any order (for React)
 */

export type NavigationPair = {
  from: string;
  to: string;
};

export interface NavigationDetector {
  /**
   * Trigger navigation event
   */
  trigger(path: string, type: "out" | "in"): void;

  /**
   * Get navigation pair when ready
   * Returns null if should skip (e.g., page refresh in outFirst mode)
   */
  get(type: "out" | "in"): Promise<NavigationPair | null>;
}

export type CreateNavigationDetector = () => NavigationDetector;

type PendingNavigation = {
  from?: string;
  to?: string;
  outResolve?: (pair: NavigationPair | null) => void;
  inResolve?: (pair: NavigationPair | null) => void;
};

/**
 * OutFirst Strategy
 *
 * OUT must arrive before IN. Best for frameworks with native destroy callbacks.
 * - OUT triggers first, then IN completes the pair
 * - If IN arrives without OUT, returns null (page refresh case)
 */
export function createOutFirstDetector(): NavigationDetector {
  let pending: PendingNavigation | null = null;

  function checkPair() {
    if (pending?.from && pending?.to) {
      const pair: NavigationPair = { from: pending.from, to: pending.to };
      pending.outResolve?.(pair);
      pending.inResolve?.(pair);
      pending = null;
    }
  }

  return {
    trigger(path, type) {
      if (!pending) {
        pending = {};
      }

      if (type === "out") {
        pending.from = path;
      } else {
        pending.to = path;
      }
    },

    get(type) {
      // OutFirst: IN without OUT means page refresh - skip
      if (type === "in" && (!pending || !pending.from)) {
        return Promise.resolve(null);
      }

      return new Promise<NavigationPair | null>((resolve) => {
        if (!pending) pending = {};

        if (type === "out") {
          pending.outResolve = resolve;
        } else {
          pending.inResolve = resolve;
        }

        checkPair();
      });
    },
  };
}

/**
 * AnyOrder Strategy
 *
 * OUT and IN can arrive in any order. Best for frameworks using MutationObserver.
 * - Either OUT or IN can arrive first
 * - Both wait indefinitely for the other to complete the pair
 * - If a new path arrives, cancels the previous pending transition
 */
export function createAnyOrderDetector(): NavigationDetector {
  let pending: PendingNavigation | null = null;

  function cancelPending() {
    if (!pending) return;
    pending.outResolve?.(null);
    pending.inResolve?.(null);
    pending = null;
  }

  function checkPair() {
    if (pending?.from && pending?.to) {
      const pair: NavigationPair = { from: pending.from, to: pending.to };
      pending.outResolve?.(pair);
      pending.inResolve?.(pair);
      pending = null;
    }
  }

  return {
    trigger(path, type) {
      // Cancel previous if this is a new transition
      const isNewTransition =
        pending &&
        ((type === "out" && pending.from && pending.from !== path) ||
          (type === "in" && pending.to && pending.to !== path));

      if (isNewTransition) {
        cancelPending();
      }

      if (!pending) {
        pending = {};
      }

      if (type === "out") {
        pending.from = path;
      } else {
        pending.to = path;
      }
    },

    get(type) {
      return new Promise<NavigationPair | null>((resolve) => {
        if (!pending) pending = {};

        if (type === "out") {
          pending.outResolve = resolve;
        } else {
          pending.inResolve = resolve;
        }

        checkPair();
      });
    },
  };
}
