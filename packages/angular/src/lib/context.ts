import {
  DestroyRef,
  InjectionToken,
  inject,
  signal,
  type Signal,
} from "@angular/core";
import { IDLE_TRANSITION_STATE } from "@ssgoi/core/internal";
import type { SsgoiContext, SsgoiTransitionState } from "@ssgoi/core/types";

export const SSGOI_CONTEXT = new InjectionToken<SsgoiContext | undefined>(
  "ssgoi-context",
);

const noopContext: SsgoiContext = {
  register: () => {},
  refFor: () => () => {},
  getTransitionState: () => IDLE_TRANSITION_STATE,
  subscribe: () => () => {},
};

export function injectSsgoi(): SsgoiContext {
  const context = inject(SSGOI_CONTEXT, { optional: true });

  if (!context) {
    // During SSR or when not wrapped in <ssgoi>, return a no-op context
    // This prevents errors during server-side rendering
    return noopContext;
  }

  return context;
}

/**
 * Signal of the provider's transition lifecycle: whether a page transition is
 * preparing or playing, and which routes it joins.
 *
 * Use it to defer work that would fight the animation, such as a programmatic
 * scroll on the arriving page, until the status returns to `"idle"`.
 *
 * Must be called in an injection context under `[ssgoi]`. During SSR, or
 * outside the directive, it stays `"idle"`.
 */
export function injectSsgoiTransition(): Signal<SsgoiTransitionState> {
  const ssgoi = injectSsgoi();
  const state = signal<SsgoiTransitionState>(ssgoi.getTransitionState());
  const unsubscribe = ssgoi.subscribe((next) => state.set(next));
  inject(DestroyRef).onDestroy(unsubscribe);
  return state.asReadonly();
}
