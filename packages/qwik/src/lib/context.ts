import { createContextId, useContext } from "@builder.io/qwik";
import type { SsgoiTransitionState } from "@ssgoi/core/types";

/** Serialisable store of the provider's lifecycle, mutated in place by `useSsgoi`. */
export type SsgoiTransitionStore = {
  status: SsgoiTransitionState["status"];
  from: string | null;
  to: string | null;
  direction: SsgoiTransitionState["direction"];
};

export const SsgoiTransitionContextId =
  createContextId<SsgoiTransitionStore>("ssgoi.transition");

/**
 * Reactive store of the provider's transition lifecycle: whether a page
 * transition is preparing or playing, and which routes it joins.
 *
 * Use it to defer work that would fight the animation, such as a programmatic
 * scroll on the arriving page, until the status returns to `"idle"`.
 *
 * Must be called under `<Ssgoi>` (or a component that calls `useSsgoi`).
 */
export const useSsgoiTransition = (): Readonly<SsgoiTransitionStore> => {
  return useContext(SsgoiTransitionContextId);
};
