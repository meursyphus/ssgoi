"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { SsgoiContext } from "@ssgoi/core/internal";
import type { SsgoiTransitionState } from "@ssgoi/core/types";
import { IDLE_TRANSITION_STATE } from "@ssgoi/core/internal";
import type { SsgoiFramework } from "./layout-boundary";

/** Provider-scoped dispatcher and router hooks; `<Ssgoi>` owns the only value. */
export const ssgoiContext = createContext<{
  ssgoi: SsgoiContext;
  framework?: SsgoiFramework;
} | null>(null);

const getServerSnapshot = () => IDLE_TRANSITION_STATE;

/**
 * Reads the provider's transition lifecycle: whether a page transition is
 * preparing or playing, and which routes it joins. Re-renders the caller on
 * every change.
 *
 * Use it to defer work that would fight the animation, such as a
 * programmatic scroll on the arriving page, until the status returns to
 * `"idle"`.
 *
 * Must be called under `<Ssgoi>`.
 */
export function useSsgoiTransition(): SsgoiTransitionState {
  const ssgoi = useContext(ssgoiContext)?.ssgoi;
  if (!ssgoi) {
    throw new Error("useSsgoiTransition must be used within <Ssgoi>");
  }
  return useSyncExternalStore(
    ssgoi.subscribe,
    ssgoi.getTransitionState,
    getServerSnapshot,
  );
}
