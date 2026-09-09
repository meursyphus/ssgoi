import type { NavigationDirection } from "./types";
import type { TransitionView } from "./motion-state";

export type NavigationPair<TTarget, TValue> = {
  id: number;
  from: TransitionView<TTarget, TValue>;
  to: TransitionView<TTarget, TValue>;
  direction: NavigationDirection;
};
export type Presence<TTarget, TValue> = {
  entries: TransitionView<TTarget, TValue>[];
  routeKeys: string[];
  activeKey: string | null;
  generation: number;
  transition: NavigationPair<TTarget, TValue> | null;
};

export function createPresence<TTarget, TValue>(
  screens: TransitionView<TTarget, TValue>[],
  activeKey: string | null,
): Presence<TTarget, TValue> {
  return {
    entries: screens,
    routeKeys: screens.map((s) => s.key),
    activeKey,
    generation: 0,
    transition: null,
  };
}

/** Reconcile before React commits removal. Removed outgoing entries retain the same sibling key. */
export function reconcilePresence<TTarget, TValue>(
  previous: Presence<TTarget, TValue>,
  screens: TransitionView<TTarget, TValue>[],
  activeKey: string | null,
): Presence<TTarget, TValue> {
  const routeKeys = screens.map((s) => s.key);
  if (previous.activeKey === activeKey) {
    const outgoing = previous.transition?.from;
    return {
      ...previous,
      routeKeys,
      entries:
        outgoing && !routeKeys.includes(outgoing.key)
          ? [...screens, outgoing]
          : screens,
    };
  }
  const generation = previous.generation + 1;
  const from = previous.entries.find((s) => s.key === previous.activeKey);
  const to = screens.find((s) => s.key === activeKey);
  // A target already below the previous active screen is a pop, even if both paths match.
  const previousTargetIndex = previous.routeKeys.indexOf(activeKey ?? "");
  const direction =
    previousTargetIndex >= 0 &&
    previousTargetIndex < previous.routeKeys.indexOf(previous.activeKey ?? "")
      ? "backward"
      : "forward";
  const transition =
    from && to
      ? ({ id: generation, from, to, direction } as NavigationPair<
          TTarget,
          TValue
        >)
      : null;
  const entries =
    from && transition && !routeKeys.includes(from.key)
      ? [...screens, from]
      : screens;
  return { entries, routeKeys, activeKey, generation, transition };
}

export function settlePresence<TTarget, TValue>(
  presence: Presence<TTarget, TValue>,
  id: number,
): Presence<TTarget, TValue> {
  if (presence.transition?.id !== id) return presence;
  return {
    ...presence,
    transition: null,
    entries: presence.entries.filter((s) => presence.routeKeys.includes(s.key)),
  };
}
