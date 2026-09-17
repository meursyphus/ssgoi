import type { NavigationDirection, PhysicsOptions } from "@types";
import type { AnimationContributions } from "../animation-group";
import type { MediaFit } from "../media-geometry";

/* ────────────────────────────────────────────────────────────────────────────
 * Public option surface (v6 unified `{type?, variant?, options?}` shape)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * - `static` — morph the shared visual;
 *   incoming page content appears immediately. Default.
 * - `fade` — fade outgoing page and incoming non-shared content/surface colors
 *   while the shared visual stays opaque.
 * Enter renders in-page; exit renders in a temporary layer above both pages.
 */
export type HeroType = "static" | "fade";
/**
 * - `default` — single-spring physics shared between every strategy in the
 *   transition (300/30). Crisp, traditional spring feel.
 * - `smooth` — same base spring with `doubleSpring: 1` so the tile motion
 *   trails through a soft follower stage; gentler arrival, no hard stop.
 *
 * The variant only swaps the physics provider — chrome handling is owned by
 * `HeroType` and stays orthogonal.
 */
export type HeroVariant = "default" | "smooth";
export type HeroOptions = Record<string, never>;

export type HeroFit = MediaFit;

/* ────────────────────────────────────────────────────────────────────────────
 * Internal normalized options — `index.ts` is the single place that fills in
 * defaults so the rest of the module never branches on `undefined`.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface NormalizedHeroOptions {
  type: HeroType;
  variant: HeroVariant;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Pair resolution (shared by every strategy)
 * ──────────────────────────────────────────────────────────────────────────── */

export interface HeroPair {
  key: string;
  fromEl: HTMLElement;
  toEl: HTMLElement;
  fromFit: HeroFit;
  toFit: HeroFit;
}

export interface HeroResolved {
  pairs: HeroPair[];
}

/* ────────────────────────────────────────────────────────────────────────────
 * Strategy pattern (hero internal)
 *
 * Each concern (tile morph, chrome cross-fade) is a strategy object. The
 * transition dispatcher iterates a homogeneous list and never branches on
 * `type` / `variant` — the provider lookup tables own the mapping.
 * ──────────────────────────────────────────────────────────────────────────── */

export interface HeroPrepareCtx {
  from: Promise<HTMLElement>;
  to: Promise<HTMLElement>;
  resolved: Promise<HeroResolved>;
}

export interface HeroContributeCtx {
  direction: NavigationDirection;
  from: HTMLElement;
  to: HTMLElement;
  resolved: HeroResolved;
  physics: PhysicsOptions;
  positionedParent: HTMLElement;
  maxDistance: number;
  /**
   * Mutation registry. Strategies push restore callbacks here; the dispatcher
   * fires them on completion. Keeps cleanup local to each strategy instead of
   * leaking back into the dispatcher.
   */
  onComplete: (fn: () => void) => void;
}

/**
 * Strategy interface. Both methods are optional — a no-op strategy is a
 * legitimate factory return value (e.g. static chrome).
 */
export type HeroAnimationName = "shared" | "out" | "in";

export interface HeroStrategy {
  prepare?: (ctx: HeroPrepareCtx) => void;
  contribute?: (
    ctx: HeroContributeCtx,
  ) => AnimationContributions<HeroAnimationName>;
}
