import type { TransitionConfig } from "@types";
import { getRect } from "@utils";
import {
  Animation,
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";
import {
  centerX,
  centerY,
  insetWithin,
  normalizeMediaGeometryPair,
  projectedWindowRect,
  resolveElementMediaGeometry,
  type MediaGeometry,
  type MediaFit,
} from "../media-geometry";
import { fallbackHeroFit } from "./fit";
import { HERO_ENTER_KEY, HERO_EXIT_KEY, HERO_LEGACY_KEY } from "./keys";
import { HERO_CHROME_PROVIDERS, HERO_VARIANT_PROVIDERS } from "./provider";
import type {
  HeroContributeCtx,
  HeroPair,
  HeroPrepareCtx,
  HeroResolved,
  HeroStrategy,
  NormalizedHeroOptions,
} from "./types";

export type { HeroType, HeroVariant, NormalizedHeroOptions } from "./types";

const DEFAULT_MAX_DISTANCE = 700;

/** @deprecated Intrinsic media dimensions are inferred automatically. */
const LEGACY_HERO_ASPECT_KEY = "data-hero-aspect-ratio";
/** @deprecated Border radius is inferred from the keyed clipping window. */
const LEGACY_HERO_RADIUS_KEY = "data-hero-radius";

/* ────────────────────────────────────────────────────────────────────────────
 * Content/window rect resolution
 *
 * A direct image or one unambiguous direct image child auto-resolves intrinsic
 * ratio, computed object-fit, clipping window, and simple uniform CSS radius.
 * Ambiguous structures retain bbox geometry. Deprecated aspect/radius data
 * attributes remain compatibility overrides for already-published markup.
 * ──────────────────────────────────────────────────────────────────────────── */

function getHeroRect(
  container: HTMLElement,
  el: HTMLElement,
  fit: MediaFit,
): MediaGeometry {
  const bbox = getRect(container, el);
  return resolveElementMediaGeometry(
    el,
    bbox,
    (mediaEl) => getRect(container, mediaEl),
    {
      fallbackFit: fit,
      legacyAspectRatioAttribute: LEGACY_HERO_ASPECT_KEY,
      legacyRadiusAttribute: LEGACY_HERO_RADIUS_KEY,
    },
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Pair resolution — shared by every strategy.
 * ──────────────────────────────────────────────────────────────────────────── */

function collectByAttr(
  page: HTMLElement,
  attr: string,
): Map<string, HTMLElement> {
  const map = new Map<string, HTMLElement>();
  const nodes = page.querySelectorAll<HTMLElement>(`[${attr}]`);
  for (const node of Array.from(nodes)) {
    const key = node.getAttribute(attr);
    if (!key) continue;
    if (map.has(key)) continue;
    map.set(key, node);
  }
  return map;
}

/**
 * Resolve new-style hero pairs from `data-hero-enter-key` (detail side) and
 * `data-hero-exit-key` (list side). Direction-agnostic: enter elements on
 * `to` pair with exit elements on `from` (forward navigation), and enter
 * elements on `from` pair with exit elements on `to` (reverse). In both
 * cases the animated element is the one living on `to`.
 */
export function resolveNewStylePairs(
  fromNode: HTMLElement,
  toNode: HTMLElement,
): HeroPair[] {
  const pairs: HeroPair[] = [];

  const toEnters = collectByAttr(toNode, HERO_ENTER_KEY);
  const fromExits = collectByAttr(fromNode, HERO_EXIT_KEY);
  for (const [key, toEl] of toEnters) {
    const fromEl = fromExits.get(key);
    if (!fromEl) continue;
    pairs.push({
      key,
      fromEl,
      toEl,
      fromFit: fallbackHeroFit("exit"),
      toFit: fallbackHeroFit("enter"),
    });
  }

  const fromEnters = collectByAttr(fromNode, HERO_ENTER_KEY);
  const toExits = collectByAttr(toNode, HERO_EXIT_KEY);
  for (const [key, fromEl] of fromEnters) {
    const toEl = toExits.get(key);
    if (!toEl) continue;
    pairs.push({
      key,
      fromEl,
      toEl,
      fromFit: fallbackHeroFit("enter"),
      toFit: fallbackHeroFit("exit"),
    });
  }

  return pairs;
}

/**
 * Legacy fallback. `data-hero-key` is kept for backwards compatibility for
 * animation matching. New code should use `data-hero-enter-key` (detail side)
 * + `data-hero-exit-key` (list side). This branch only runs when no
 * new-style pair resolved.
 *
 * @deprecated for animation matching — use the enter/exit pair.
 */
function resolveLegacyPairs(
  fromNode: HTMLElement,
  toNode: HTMLElement,
): HeroPair[] {
  const pairs: HeroPair[] = [];
  const legacyEls = Array.from(
    toNode.querySelectorAll<HTMLElement>(`[${HERO_LEGACY_KEY}]`),
  );
  for (const toEl of legacyEls) {
    const key = toEl.getAttribute(HERO_LEGACY_KEY);
    if (!key) continue;
    const fromEl = fromNode.querySelector<HTMLElement>(
      `[${HERO_LEGACY_KEY}="${key}"]`,
    );
    if (!fromEl) continue;
    pairs.push({
      key,
      fromEl,
      toEl,
      fromFit: fallbackHeroFit("legacy"),
      toFit: fallbackHeroFit("legacy"),
    });
  }
  return pairs;
}

function resolvePairs(fromNode: HTMLElement, toNode: HTMLElement): HeroPair[] {
  const pairs = resolveNewStylePairs(fromNode, toNode);
  if (pairs.length > 0) return pairs;
  return resolveLegacyPairs(fromNode, toNode);
}

type HeroMorphStyle = {
  transform: string;
  clipPath: string;
};

type HeroMorphPlan = {
  toContent: MediaGeometry["content"];
  fromVisualEl: HTMLElement;
  toVisualEl: HTMLElement;
  resetCloneRadius: boolean;
  styleFor: (t: number, u: number) => HeroMorphStyle;
};

export function normalizeHeroGeometryPair(
  from: MediaGeometry,
  to: MediaGeometry,
): [MediaGeometry, MediaGeometry] {
  return normalizeMediaGeometryPair(from, to);
}

export function shouldResetHeroCloneRadius(
  from: MediaGeometry,
  to: MediaGeometry,
): boolean {
  if (
    from.radiusSource === "unsupported" ||
    to.radiusSource === "unsupported"
  ) {
    return false;
  }
  return (
    from.mediaElement !== null ||
    to.mediaElement !== null ||
    from.radiusSource === "computed" ||
    from.radiusSource === "legacy" ||
    to.radiusSource === "computed" ||
    to.radiusSource === "legacy"
  );
}

function buildHeroMorphPlan(
  root: HTMLElement,
  pair: HeroPair,
  maxDistance: number,
): HeroMorphPlan | null {
  const { fromEl, toEl } = pair;
  const [fromHero, toHero] = normalizeHeroGeometryPair(
    getHeroRect(root, fromEl, pair.fromFit),
    getHeroRect(root, toEl, pair.toFit),
  );
  const fromContent = fromHero.content;
  const fromWindow = fromHero.window;
  const toContent = toHero.content;
  const toWindow = toHero.window;
  const toClipInset = toHero.clipInset;
  const preserveCloneRadius =
    fromHero.radiusSource === "unsupported" ||
    toHero.radiusSource === "unsupported";
  const fromRadius = preserveCloneRadius ? 0 : fromHero.radius;
  const toRadius = preserveCloneRadius ? 0 : toHero.radius;

  if (
    fromContent.width === 0 ||
    fromContent.height === 0 ||
    fromWindow.width === 0 ||
    fromWindow.height === 0 ||
    toContent.width === 0 ||
    toContent.height === 0 ||
    toWindow.width === 0 ||
    toWindow.height === 0
  ) {
    return null;
  }

  // Uniform scale on content-to-content. Window clips then express either
  // object-cover crop (exit side) or object-contain content (enter side).
  const sMax = Math.max(
    fromContent.width / toContent.width,
    fromContent.height / toContent.height,
  );

  // Translate so the scaled destination content lands on source content.
  const cxFrom = centerX(fromContent);
  const cyFrom = centerY(fromContent);
  const cxTo = centerX(toContent);
  const cyTo = centerY(toContent);
  const dx = cxFrom - cxTo;
  const dy = cyFrom - cyTo;

  if (Math.abs(dy) > maxDistance) return null;

  // Pre-transform source window expressed inside the destination content.
  const fromClipInset = insetWithin(
    toContent,
    projectedWindowRect(toContent, fromContent, fromWindow, sMax, sMax),
  );

  return {
    toContent,
    fromVisualEl: fromHero.mediaElement ?? fromEl,
    toVisualEl: toHero.mediaElement ?? toEl,
    resetCloneRadius: shouldResetHeroCloneRadius(fromHero, toHero),
    styleFor: (t, u) => {
      const tx = u * dx;
      const ty = u * dy;
      const s = t + u * sMax;
      const visibleRadius = Math.max(0, fromRadius * u + toRadius * t);
      // clip-path is resolved before transform; divide by the current scale
      // so the on-screen corner radius matches the visible hero window.
      const clipRadius = visibleRadius / Math.max(Math.abs(s), 0.000001);
      const insetT = fromClipInset.top * u + toClipInset.top * t;
      const insetR = fromClipInset.right * u + toClipInset.right * t;
      const insetB = fromClipInset.bottom * u + toClipInset.bottom * t;
      const insetL = fromClipInset.left * u + toClipInset.left * t;
      return {
        transform: `translate(${tx}px, ${ty}px) scale(${s})`,
        clipPath: `inset(${insetT}px ${insetR}px ${insetB}px ${insetL}px round ${clipRadius}px)`,
      };
    },
  };
}

function applyMorphStyle(el: HTMLElement, style: HeroMorphStyle): void {
  el.style.transform = style.transform;
  el.style.clipPath = style.clipPath;
}

/* ────────────────────────────────────────────────────────────────────────────
 * HeroTileStrategy — shared by every hero type.
 *
 * The moving hero lives as a temporary clone above both pages. That keeps
 * static/fade pair resolution, content/window rect math, distance filtering, and
 * aspect-ratio clipping identical; chrome strategies only decide whether
 * page surfaces snap or cross-fade around this shared tile morph.
 * ──────────────────────────────────────────────────────────────────────────── */

class HeroTileStrategy implements HeroStrategy {
  contribute(ctx: HeroContributeCtx): Animation[] {
    const { resolved, physics, positionedParent, maxDistance, onComplete } =
      ctx;
    const animations: Animation[] = [];

    for (const pair of resolved.pairs) {
      const morph = buildHeroMorphPlan(positionedParent, pair, maxDistance);
      if (!morph) continue;
      const { fromVisualEl, toVisualEl } = morph;

      const clone = toVisualEl.cloneNode(true) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.left = `${morph.toContent.left}px`;
      clone.style.top = `${morph.toContent.top}px`;
      clone.style.width = `${morph.toContent.width}px`;
      clone.style.height = `${morph.toContent.height}px`;
      clone.style.margin = "0";
      clone.style.transformOrigin = "center center";
      clone.style.zIndex = "1000";
      clone.style.willChange = "transform, clip-path";
      clone.style.pointerEvents = "none";
      clone.style.maxWidth = "none";
      clone.style.maxHeight = "none";
      if (morph.resetCloneRadius) clone.style.borderRadius = "0";

      applyMorphStyle(clone, morph.styleFor(0, 1));

      positionedParent.appendChild(clone);

      const previousFromOpacity = fromVisualEl.style.opacity;
      const previousToOpacity = toVisualEl.style.opacity;
      fromVisualEl.style.opacity = "0";
      toVisualEl.style.opacity = "0";

      onComplete(() => {
        fromVisualEl.style.opacity = previousFromOpacity;
        toVisualEl.style.opacity = previousToOpacity;
        if (clone.parentElement) clone.parentElement.removeChild(clone);
      });

      animations.push(
        new WebAnimation({
          element: clone,
          integrator: IntegratorProvider.from(physics),
          style: morph.styleFor,
        }),
      );
    }

    return animations;
  }
}

function heroStrategiesFor(opts: NormalizedHeroOptions): HeroStrategy[] {
  return [new HeroTileStrategy(), HERO_CHROME_PROVIDERS[opts.type]()];
}

/* ────────────────────────────────────────────────────────────────────────────
 * Public dispatcher.
 *
 * 1. `prepare`: resolve pairs (async, once) and fan out to each strategy.
 * 2. `animation`: hand each strategy a synchronous ctx; flatten contributions
 *    into a single MultiAnimation so the physics stays locked.
 *
 * Type branching lives only in `heroStrategiesFor`; this function is
 * symmetric for every type.
 * ──────────────────────────────────────────────────────────────────────────── */

type HeroExtras = { resolved: HeroResolved };

export const hero = (
  options: NormalizedHeroOptions,
): TransitionConfig<HeroExtras> => {
  const strategies = heroStrategiesFor(options);
  const physics = HERO_VARIANT_PROVIDERS[options.variant]();
  const maxDistance = DEFAULT_MAX_DISTANCE;

  return {
    prepare: (args): Promise<HeroExtras> => {
      const resolved: Promise<HeroResolved> = Promise.all([
        args.from,
        args.to,
      ]).then(([fromEl, toEl]) => ({ pairs: resolvePairs(fromEl, toEl) }));

      const ctx: HeroPrepareCtx = {
        from: args.from,
        to: args.to,
        resolved,
      };
      for (const strategy of strategies) {
        strategy.prepare?.(ctx);
      }

      return resolved.then((r) => ({ resolved: r }));
    },
    animation: ({ from, to, context, resolved }) => {
      if (resolved.pairs.length === 0) {
        return new MultiAnimation([], { mode: "parallel" });
      }

      // Shared `onComplete` registry — strategies push restore callbacks
      // here, and the composite fires them after every child has settled.
      // Fade uses page-level opacity plus overlay clones, so restoring on
      // the first child can reveal originals while sibling fades are active.
      const cleanups: Array<() => void> = [];
      const onComplete = (fn: () => void): void => {
        cleanups.push(fn);
      };

      const ctx: HeroContributeCtx = {
        from,
        to,
        resolved,
        physics,
        positionedParent: context.positionedParent,
        maxDistance,
        onComplete,
      };

      const anims: Animation[] = [];
      for (const strategy of strategies) {
        if (!strategy.contribute) continue;
        anims.push(...strategy.contribute(ctx));
      }

      if (anims.length === 0) {
        return new MultiAnimation([], { mode: "parallel" });
      }

      const composite = new MultiAnimation(anims, { mode: "parallel" });
      const prevOnComplete = composite.onComplete;
      composite.onComplete = () => {
        prevOnComplete?.();
        for (const fn of cleanups) {
          try {
            fn();
          } catch (e) {
            // Don't let one faulty restore tear down sibling cleanups.
            console.error("[hero] cleanup error", e);
          }
        }
      };

      return composite;
    },
  };
};
