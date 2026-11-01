import { getContext, setContext } from "svelte";
import { readable, type Readable } from "svelte/store";
import type {
  SsgoiContext,
  SsgoiFramework,
  SsgoiTransitionState,
} from "./types.js";

const SSGOI_CONTEXT_KEY = Symbol("ssgoi");
const SSGOI_FRAMEWORK_KEY = Symbol("ssgoi-framework");

export function setSsgoiContext(context: SsgoiContext) {
  setContext(SSGOI_CONTEXT_KEY, context);
}

export function getSsgoiContext(): SsgoiContext {
  const context = getContext<SsgoiContext>(SSGOI_CONTEXT_KEY);
  if (!context) {
    throw new Error("getSsgoiContext must be called within Ssgoi component");
  }
  return context;
}

export function setSsgoiFramework(
  getFramework: () => SsgoiFramework | undefined,
) {
  setContext(SSGOI_FRAMEWORK_KEY, getFramework);
}

export function getSsgoiFramework(): SsgoiFramework {
  const framework = getContext<(() => SsgoiFramework | undefined) | undefined>(
    SSGOI_FRAMEWORK_KEY,
  )?.();
  if (!framework) {
    throw new Error(
      "SSGOI: SsgoiLayoutBoundary requires a framework. Pass it to <Ssgoi framework={{ getRoute: () => ({ pathname: page.url.pathname, url: page.url }), onNavigate }}>.",
    );
  }
  return framework;
}

/**
 * Store of the provider's transition lifecycle: whether a page transition is
 * preparing or playing, and which routes it joins.
 *
 * Use it to defer work that would fight the animation, such as a programmatic
 * scroll on the arriving page, until the status returns to `"idle"`.
 *
 * Must be called during component initialisation, under `<Ssgoi>`.
 */
export function getSsgoiTransition(): Readable<SsgoiTransitionState> {
  const context = getContext<SsgoiContext>(SSGOI_CONTEXT_KEY);
  if (!context) {
    throw new Error("getSsgoiTransition must be called within Ssgoi component");
  }
  return readable(context.getTransitionState(), (set) => {
    set(context.getTransitionState());
    return context.subscribe(set);
  });
}
