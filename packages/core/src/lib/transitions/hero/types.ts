import type { PhysicsOptions } from "@types";
import type { Animation } from "../../animation";

/* ────────────────────────────────────────────────────────────────────────────
 * Public option surface (v6 unified `{type?, variant?, options?}` shape)
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * - `static` — the shared element morphs in place; the incoming page's chrome
 *   snaps in. Default.
 * - `fade` — both pages cross-fade as whole surfaces while a temporary hero
 *   clone morphs above them.
 */
export type HeroType = "static" | "fade";
export type HeroVariant = "default";
export type HeroOptions = Record<string, never>;

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
  from: HTMLElement;
  to: HTMLElement;
  resolved: HeroResolved;
  physics: PhysicsOptions;
  scrollOffset: { x: number; y: number };
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
export interface HeroStrategy {
  prepare?: (ctx: HeroPrepareCtx) => void;
  contribute?: (ctx: HeroContributeCtx) => Animation[];
}
