import type { PhysicsOptions, SsgoiTransitionContext } from "@types";
import type { Animation } from "../../animation";
import type { MediaGeometry } from "../media-geometry";

/* ────────────────────────────────────────────────────────────────────────────
 * Public option surface (v6 unified `{type?, variant?, options?}` shape)
 * ──────────────────────────────────────────────────────────────────────────── */

export type ZoomType = "expand" | "static" | "blur";
export type ZoomVariant = "default" | "fade";

/* ────────────────────────────────────────────────────────────────────────────
 * Internal normalized options used by transition.ts / strategy factory.
 * `index.ts` is the single place that converts public + deprecated config
 * (`fade: boolean`) into this shape, so the rest of the module never branches
 * on legacy fields.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface NormalizedZoomOptions {
  type: ZoomType;
  variant: ZoomVariant;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Provider plumbing (kept stable for v5 BackgroundStrategy implementations).
 * ──────────────────────────────────────────────────────────────────────────── */

export type ZoomStyleObject = Record<string, string>;
export type ZoomAnimationFunc = (progress: number) => ZoomStyleObject;

export interface ZoomAnimationConfig {
  transformOrigin: string;
  animate: ZoomAnimationFunc;
}

export interface ZoomAnimationInput {
  enterRect: DOMRect;
  exitRect: DOMRect;
  /** Optional content-aware geometry used only by the foreground tile. */
  enterMedia?: MediaGeometry;
  /** Optional content-aware geometry used only by the foreground tile. */
  exitMedia?: MediaGeometry;
  pageRect: DOMRect;
  scrollOffset: { x: number; y: number };
  enterRadius: number;
  exitRadius: number;
}

export interface ZoomOverlayConfig {
  willChange: string;
  initialStyle: Record<string, string>;
  style: (
    mode: "enter" | "exit",
    progress: number,
  ) => Record<string, string | number>;
}

export interface ZoomProvider {
  physics: PhysicsOptions;
  in: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  out: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  backgroundIn: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  backgroundOut: (input: ZoomAnimationInput) => ZoomAnimationConfig;
  overlay?: ZoomOverlayConfig;
}

export interface ZoomAnimationHandlers {
  mode: "enter" | "exit";
  inAnimation?: ZoomAnimationFunc;
  outAnimation?: ZoomAnimationFunc;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Strategy pattern (zoom internal)
 *
 * Each concern (tile motion, background motion, fade-around, crossfade,
 * overlay) is a strategy object. The transition dispatcher iterates a
 * homogeneous list and never branches on `type` / `variant` itself — the
 * factories (`BackgroundStrategy.forType`, `FadeStrategy.forVariant`) own
 * the lookup tables, and the dispatcher only consumes a uniform interface.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Resolution result handed to every strategy: which side initiated the zoom
 * and the two DOM nodes whose rects drive the math.
 */
export interface ZoomResolved {
  mode: "enter" | "exit";
  enterEl: HTMLElement;
  exitEl: HTMLElement;
}

/**
 * Mutable extras pool. Strategies fill in their own slots during `prepare`
 * and read from a shared bag in `contribute`, which keeps the dispatcher
 * agnostic to which slot belongs to which strategy.
 */
export interface ZoomExtras {
  overlay?: HTMLElement;
}

/**
 * Arguments passed to `prepare`. The strategy can `from.then(el => …)` to
 * attach styles ahead of layout, or create DOM via `createElement`.
 */
export interface ZoomPrepareCtx {
  from: Promise<HTMLElement>;
  to: Promise<HTMLElement>;
  context: {
    positionedParent: HTMLElement;
  };
  createElement: <K extends keyof HTMLElementTagNameMap>(
    id: string,
    tag?: K,
  ) => K extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[K]
    : HTMLDivElement;
}

/**
 * Inputs each strategy receives at `contribute` time. `physics` is sourced
 * from the BackgroundStrategy that owns the active `type` and is reused by
 * every other strategy so progress is locked.
 */
export interface ZoomContributeCtx {
  from: HTMLElement;
  to: HTMLElement;
  resolved: ZoomResolved;
  input: ZoomAnimationInput;
  physics: PhysicsOptions;
  extras: ZoomExtras;
  /**
   * Full transition context — strategies that stage viewport-aligned layers
   * (the blur overlay) need the live scroll position + scrolling element.
   */
  context: SsgoiTransitionContext;
  /**
   * Mutation registry. Strategies push restore callbacks here; the
   * dispatcher fires them on completion. Keeps cleanup local to each
   * strategy instead of leaking back into the dispatcher.
   */
  onComplete: (fn: () => void) => void;
}

/**
 * Strategy interface. Both methods are optional — a no-op strategy is
 * a legitimate factory return value (e.g. `FadeStrategy.forVariant("default")`).
 */
export interface ZoomStrategy {
  /**
   * Pre-paint setup. May mutate the outgoing/incoming pages via the
   * promises in `ctx`, or stage DOM via `createElement`. Returns extras
   * that get merged into the shared `ZoomExtras` bag.
   */
  prepare?: (ctx: ZoomPrepareCtx) => Partial<ZoomExtras> | void;

  /**
   * Build the strategy's contribution to the final animation list. Called
   * once per transition with both pages resolved and rect math complete.
   */
  contribute?: (ctx: ZoomContributeCtx) => Animation[];
}
