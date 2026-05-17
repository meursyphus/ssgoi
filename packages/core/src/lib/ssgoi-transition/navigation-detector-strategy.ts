/**
 * Navigation Detector Strategy
 *
 * Collects out/in navigation events and provides navigation pairs.
 * OUT and IN can arrive in any order.
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
   * Returns null if a pending transition is cancelled.
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
 * Navigation detector
 *
 * OUT and IN can arrive in any order.
 * - Either OUT or IN can arrive first
 * - Both wait indefinitely for the other to complete the pair
 * - If a new path arrives, cancels the previous pending transition
 */
export function createNavigationDetector(): NavigationDetector {
  let pending: PendingNavigation | null = null;

  function reset() {
    if (!pending) return;
    pending.outResolve?.(null);
    pending.inResolve?.(null);
    pending = null;
  }

  function checkPair() {
    // Only resolve when BOTH outResolve and inResolve are set
    // This prevents race conditions when trigger/get calls interleave
    if (
      pending?.from &&
      pending?.to &&
      pending?.outResolve &&
      pending?.inResolve
    ) {
      // Validate pair: from and to must be different paths
      // Same path means mismatched pairing (e.g., delayed OUT paired with wrong IN)
      if (pending.from === pending.to) {
        reset();
        return;
      }

      const pair: NavigationPair = { from: pending.from, to: pending.to };
      pending.outResolve(pair);
      pending.inResolve(pair);
      pending = null;
    }
  }

  return {
    trigger(path, type) {
      // If the first page mounted in any-order mode, it can leave a pending
      // IN-only entry. When that same page later unmounts before the next IN
      // arrives, keep the OUT as the start of the real navigation instead of
      // treating it as a same-path mismatch.
      if (type === "out" && pending?.to === path && !pending.from) {
        pending.inResolve?.(null);
        pending = {};
      }

      // Cancel previous if this is a new transition
      const isNewTransition =
        pending &&
        ((type === "out" && pending.from && pending.from !== path) ||
          (type === "in" && pending.to && pending.to !== path));

      if (isNewTransition) {
        reset();
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
