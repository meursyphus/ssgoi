import { createContext } from "preact";
import { useContext, useLayoutEffect, useState } from "preact/hooks";
import type { SsgoiContext } from "@ssgoi/core/internal";
import type { SsgoiTransitionState } from "@ssgoi/core/types";

export const ssgoiContext = createContext<SsgoiContext | null>(null);

/** Read the nearest provider's page transition lifecycle. */
export function useSsgoiTransition(): SsgoiTransitionState {
  const context = useContext(ssgoiContext);
  if (!context) {
    throw new Error("useSsgoiTransition must be used within <Ssgoi>");
  }
  const [, update] = useState(0);
  const snapshot = context.getTransitionState();

  useLayoutEffect(() => {
    const unsubscribe = context.subscribe(() => update((value) => value + 1));
    // A child layout effect may have changed the store before subscription.
    if (context.getTransitionState() !== snapshot) update((value) => value + 1);
    return unsubscribe;
  }, [context]);

  return snapshot;
}
