import { getContext, onDestroy, setContext } from "svelte";
import { readable, type Readable } from "svelte/store";
import { resolveLayoutChain } from "@ssgoi/core/internal";
import type {
  SsgoiConfig,
  SsgoiContext,
  SsgoiFramework,
  SsgoiTransitionState,
} from "./types.js";

const SSGOI_CONTEXT_KEY = Symbol("ssgoi");
const SSGOI_LAYOUT_ROUTES_KEY = Symbol("ssgoi-layout-routes");
const SSGOI_LAYOUT_OVERRIDE_KEY = Symbol("ssgoi-layout-override");
const SSGOI_LAYOUT_DEPTH_KEY = Symbol("ssgoi-layout-depth");

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

type LayoutBoundaryState = { id: string; key: string | number };
type BoundaryAt = (depth: number) => LayoutBoundaryState;

/** Where a layout boundary reads its current and next `{ id, key }`. */
export interface LayoutRoutes {
  current: BoundaryAt;
  /** Registers for the calling component's lifetime. */
  onNavigate: (listener: (next: BoundaryAt) => void | (() => void)) => void;
}

/**
 * Resolves routes once for every boundary under the provider: the id is the
 * pathname and a depth-N boundary keys by the depth-N `layouts` scope, falling
 * back to the pathname.
 */
export function setSsgoiLayoutRoutes(
  framework: SsgoiFramework | undefined,
  layouts: SsgoiConfig["layouts"],
) {
  if (!framework) return;
  const boundaryAt = (path: string): BoundaryAt => {
    const chain = resolveLayoutChain(layouts, path);
    return (depth) => ({ id: path, key: chain[depth] ?? path });
  };
  const listeners = new Set<(next: BoundaryAt) => void | (() => void)>();

  framework.onNavigate((navigation) => {
    if (!navigation.to) return;
    const next = boundaryAt(navigation.to.url.pathname);
    const finish = Array.from(listeners, (listener) => listener(next));
    return () => {
      for (const callback of finish) callback?.();
    };
  });

  setContext<LayoutRoutes>(SSGOI_LAYOUT_ROUTES_KEY, {
    current: (depth) => boundaryAt(framework.getRoute().pathname)(depth),
    onNavigate: (listener) => {
      listeners.add(listener);
      onDestroy(() => listeners.delete(listener));
    },
  });
}

/** Routes for the next layout boundary only; its descendants use the provider's. */
export function setSsgoiLayoutOverride(routes: LayoutRoutes) {
  setContext(SSGOI_LAYOUT_OVERRIDE_KEY, routes);
}

/** Reads a layout boundary's routes and depth, and nests its descendants. */
export function enterSsgoiLayoutBoundary() {
  const routes =
    getContext<LayoutRoutes | undefined>(SSGOI_LAYOUT_OVERRIDE_KEY) ??
    getContext<LayoutRoutes | undefined>(SSGOI_LAYOUT_ROUTES_KEY);
  if (!routes) {
    throw new Error(
      "SSGOI: SsgoiLayoutBoundary requires a framework. Pass it to <Ssgoi framework={{ getRoute: () => ({ pathname: page.url.pathname }), onNavigate }}>.",
    );
  }
  const depth = getContext<number | undefined>(SSGOI_LAYOUT_DEPTH_KEY) ?? 0;
  setContext(SSGOI_LAYOUT_OVERRIDE_KEY, undefined);
  setContext(SSGOI_LAYOUT_DEPTH_KEY, depth + 1);
  return { routes, depth };
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
