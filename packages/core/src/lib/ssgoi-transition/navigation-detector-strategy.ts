/**
 * Navigation Detector Strategy
 *
 * Collects out/in navigation events and provides navigation pairs.
 * OUT and IN can arrive in any order.
 */

export type NavigationPair<TPayload> = {
  from: string;
  to: string;
  out: TPayload;
  in: TPayload;
};

export type NavigationArrivalType = "out" | "in";

export type NavigationCollision<TPayload> = {
  type: NavigationArrivalType;
  path: string;
  current: TPayload;
  next: TPayload;
};

export type NavigationDetectorOptions<TPayload> = {
  /**
   * Select which payload owns a repeated arrival for the same side and path.
   * The default keeps the latest arrival.
   */
  keepCurrent?: (collision: NavigationCollision<TPayload>) => boolean;
};

export interface NavigationDetector<TPayload> {
  /**
   * Add one side of a navigation. The promise resolves after its matching side
   * arrives, or with null when this arrival is superseded/cancelled.
   */
  arrive(
    path: string,
    type: NavigationArrivalType,
    payload: TPayload,
  ): Promise<NavigationPair<TPayload> | null>;

  /**
   * Cancel a pending navigation when either side matches the predicate.
   */
  cancel(predicate: (payload: TPayload) => boolean): void;
}

type PendingArrival<TPayload> = {
  path: string;
  payload: TPayload;
  resolve: (pair: NavigationPair<TPayload> | null) => void;
};

type PendingNavigation<TPayload> = {
  out?: PendingArrival<TPayload>;
  in?: PendingArrival<TPayload>;
};

/**
 * Navigation detector
 *
 * OUT and IN can arrive in any order.
 * - Either OUT or IN can arrive first
 * - Both wait indefinitely for the other to complete the pair
 * - If a new path arrives, cancels the previous pending transition
 */
export function createNavigationDetector<TPayload>(
  options: NavigationDetectorOptions<TPayload> = {},
): NavigationDetector<TPayload> {
  let pending: PendingNavigation<TPayload> | null = null;
  let lastPair: NavigationPair<TPayload> | null = null;

  function reset() {
    if (!pending) return;
    pending.out?.resolve(null);
    pending.in?.resolve(null);
    pending = null;
  }

  function checkPair() {
    if (pending?.out && pending.in) {
      // Validate pair: from and to must be different paths
      // Same path means mismatched pairing (e.g., delayed OUT paired with wrong IN)
      if (pending.out.path === pending.in.path) {
        reset();
        return;
      }

      // Capture both DOM-side payloads in the resolved pair. Promise callbacks
      // run in a later microtask, so reading mutable global side slots there
      // would let a nested arrival steal an already-matched transition.
      const pair: NavigationPair<TPayload> = {
        from: pending.out.path,
        to: pending.in.path,
        out: pending.out.payload,
        in: pending.in.payload,
      };
      // Keep the ownership of the most recently matched sides. A nested
      // boundary can be reported after the outer pair has already resolved
      // (separate MutationObserver/visibility batches). Without this record,
      // that late duplicate becomes the first side of the NEXT navigation and
      // shifts every following transition by one route.
      lastPair = pair;
      pending.out.resolve(pair);
      pending.in.resolve(pair);
      pending = null;
    }
  }

  return {
    arrive(path, type, payload) {
      return new Promise<NavigationPair<TPayload> | null>((resolve) => {
        const lastArrival =
          lastPair === null
            ? null
            : type === "out"
              ? { path: lastPair.from, payload: lastPair.out }
              : { path: lastPair.to, payload: lastPair.in };

        // One context has one boundary owner per navigation side. Frameworks
        // can report another DOM instance for that same side/path after the
        // pair has resolved (Activity eviction, streamed layout replacement),
        // and the late node is not guaranteed to remain a DOM descendant of
        // the chosen owner. Absorb it by navigation identity rather than DOM
        // ancestry so it cannot become the first side of the NEXT navigation.
        //
        // Opposite-side arrivals are intentionally unaffected: after A → B,
        // an OUT for B is how a legitimate B → C navigation begins.
        if (lastArrival?.path === path) {
          resolve(null);
          return;
        }

        // If the first page mounted in any-order mode, it can leave a pending
        // IN-only entry. When that same page later unmounts before the next IN
        // arrives, keep the OUT as the start of the real navigation instead of
        // treating it as a same-path mismatch.
        if (type === "out" && pending?.in?.path === path && !pending.out) {
          pending.in.resolve(null);
          pending.in = undefined;
        }

        const current = pending?.[type];

        // A different path on the same side starts a newer transition.
        if (current && current.path !== path) {
          reset();
        }

        if (!pending) pending = {};

        const repeated = pending[type];
        if (repeated) {
          const keepCurrent =
            options.keepCurrent?.({
              type,
              path,
              current: repeated.payload,
              next: payload,
            }) ?? false;

          if (keepCurrent) {
            resolve(null);
            return;
          }

          // The previous implementation replaced this resolver silently,
          // leaving its promise pending forever. Explicit cancellation keeps
          // repeated same-side arrivals bounded.
          repeated.resolve(null);
        }

        pending[type] = { path, payload, resolve };
        checkPair();
      });
    },

    cancel(predicate) {
      if (
        (pending?.out && predicate(pending.out.payload)) ||
        (pending?.in && predicate(pending.in.payload))
      ) {
        reset();
      }
      if (
        (lastPair && predicate(lastPair.out)) ||
        (lastPair && predicate(lastPair.in))
      ) {
        lastPair = null;
      }
    },
  };
}
