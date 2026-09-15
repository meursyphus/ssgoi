import {
  animationGroup,
  type AnimationContributions,
} from "../animation-group";
import { defineTransition } from "../../transition/define-transition";
import type { TransitionDirection } from "@types";
import { getClientRect } from "@utils";
import { Animation, IntegratorProvider, WebAnimation } from "../../animation";
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
import {
  clampOpacity,
  cloneCrossfadeVisual,
  measureVisual,
  retainOpacity,
  type VisualReference,
} from "../crossfade";
import {
  fitHeroImage,
  markHeroTransitioning,
  preserveStyles,
  stackHeroPages,
} from "./in-place";
import { insetClipPath } from "../inset-clip";
import { HERO_ENTER_KEY, HERO_EXIT_KEY, HERO_LEGACY_KEY } from "./keys";
import { HERO_CHROME_PROVIDERS, HERO_VARIANT_PROVIDERS } from "./provider";
import type {
  HeroAnimationName,
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
  clipRoot: HTMLElement,
): MediaGeometry {
  const measure = (target: HTMLElement) => {
    const rect = getClientRect(container, target);
    // Keep every endpoint in the same root coordinate space, including the
    // root scroll offset and translated/nested scrolling ancestors.
    return {
      left: rect.left + container.scrollLeft,
      top: rect.top + container.scrollTop,
      width: rect.width,
      height: rect.height,
    };
  };
  const bbox = measure(el);
  return resolveElementMediaGeometry(el, bbox, measure, {
    clipRoot,
    fallbackFit: fit,
    legacyAspectRatioAttribute: LEGACY_HERO_ASPECT_KEY,
    legacyRadiusAttribute: LEGACY_HERO_RADIUS_KEY,
  });
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
 * cases both visuals crossfade in the parent of the element living on `to`.
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
  fromContent: MediaGeometry["content"];
  toContent: MediaGeometry["content"];
  fromVisualEl: HTMLElement;
  toVisualEl: HTMLElement;
  resetRadius: boolean;
  styleFor: (
    t: number,
    u: number,
    reference?: VisualReference,
  ) => HeroMorphStyle;
};

export function normalizeHeroGeometryPair(
  from: MediaGeometry,
  to: MediaGeometry,
): [MediaGeometry, MediaGeometry] {
  return normalizeMediaGeometryPair(from, to);
}

export function shouldResetHeroRadius(
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

export function buildHeroMorphPlan(
  root: HTMLElement,
  pair: HeroPair,
  maxDistance: number,
  fromPage: HTMLElement,
  toPage: HTMLElement,
): HeroMorphPlan | null {
  const { fromEl, toEl } = pair;
  const [fromHero, toHero] = normalizeHeroGeometryPair(
    getHeroRect(root, fromEl, pair.fromFit, fromPage),
    getHeroRect(root, toEl, pair.toFit, toPage),
  );
  const fromContent = fromHero.content;
  const fromWindow = fromHero.window;
  const toContent = toHero.content;
  const toWindow = toHero.window;
  const toClipInset = toHero.clipInset;
  const preserveRadius =
    fromHero.radiusSource === "unsupported" ||
    toHero.radiusSource === "unsupported";
  const fromRadius = preserveRadius ? 0 : fromHero.radius;
  const toRadius = preserveRadius ? 0 : toHero.radius;

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

  // Compatible media scales uniformly. Bbox fallbacks can have different
  // aspect ratios; map both axes so both visuals match the source at t=0.
  const scaleX = fromContent.width / toContent.width;
  const scaleY = fromContent.height / toContent.height;

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
    projectedWindowRect(toContent, fromContent, fromWindow, scaleX, scaleY),
  );

  return {
    fromContent,
    toContent,
    fromVisualEl: fromHero.mediaElement ?? fromEl,
    toVisualEl: toHero.mediaElement ?? toEl,
    resetRadius: shouldResetHeroRadius(fromHero, toHero),
    styleFor: (t, u, reference) => {
      const tx =
        (u * dx + (reference ? cxTo - centerX(reference.box) : 0)) /
        (reference?.scaleX ?? 1);
      const ty =
        (u * dy + (reference ? cyTo - centerY(reference.box) : 0)) /
        (reference?.scaleY ?? 1);
      const sx = t + u * scaleX;
      const sy = t + u * scaleY;
      // clip-path is resolved before transform; divide by the current scale
      // so the on-screen corner radius matches the visible hero window.
      const fromCorners = fromHero.cornerRadii ?? [
        fromRadius,
        fromRadius,
        fromRadius,
        fromRadius,
      ];
      const toCorners = toHero.cornerRadii ?? [
        toRadius,
        toRadius,
        toRadius,
        toRadius,
      ];
      const radii = fromCorners.map((corner, i) => {
        const radius = Math.max(0, corner * u + toCorners[i]! * t);
        return {
          x: radius / Math.max(Math.abs(sx), 0.000001),
          y: radius / Math.max(Math.abs(sy), 0.000001),
        };
      });
      const insetT = fromClipInset.top * u + toClipInset.top * t;
      const insetR = fromClipInset.right * u + toClipInset.right * t;
      const insetB = fromClipInset.bottom * u + toClipInset.bottom * t;
      const insetL = fromClipInset.left * u + toClipInset.left * t;
      return {
        transform: reference
          ? `translate(${tx}px, ${ty}px) scale(${(sx * toContent.width) / reference.box.width}, ${(sy * toContent.height) / reference.box.height})`
          : `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`,
        clipPath: insetClipPath(
          toContent,
          {
            top: insetT,
            right: insetR,
            bottom: insetB,
            left: insetL,
          },
          radii,
        ),
      };
    },
  };
}

function applyMorphStyle(el: HTMLElement, style: HeroMorphStyle): void {
  el.style.transform = style.transform;
  el.style.clipPath = style.clipPath;
}

/** Crossfade both visuals in the destination's authored stacking context. */
class HeroTileStrategy implements HeroStrategy {
  contribute(
    ctx: HeroContributeCtx,
  ): AnimationContributions<HeroAnimationName> {
    const { resolved, physics, positionedParent, maxDistance, onComplete } =
      ctx;
    onComplete(stackHeroPages(ctx.from, ctx.to));
    // Measure every pair before changing any visual or caller-owned CSS hook.
    const matches = resolved.pairs.flatMap((pair) => {
      const plan = buildHeroMorphPlan(
        positionedParent,
        pair,
        maxDistance,
        ctx.from,
        ctx.to,
      );
      return plan ? [{ pair, plan }] : [];
    });
    // Chrome only excludes visuals that actually morph. Distance/geometry
    // fallbacks should still fade their ordinary incoming content.
    ctx.resolved = { pairs: matches.map(({ pair }) => pair) };

    const animations: Animation[] = [];
    for (const { plan: morph } of matches) {
      const { fromVisualEl, toVisualEl } = morph;
      const sourceOpacity = retainOpacity(fromVisualEl);
      const targetOpacity = retainOpacity(toVisualEl);
      // Snapshot before hiding the source or changing layout/CSS hooks.
      const source = cloneCrossfadeVisual(fromVisualEl);
      const restoreMarker = markHeroTransitioning(toVisualEl);
      const restoreTo = preserveStyles(toVisualEl, [
        "transform",
        "transform-origin",
        "clip-path",
        "object-fit",
        "border-radius",
        "will-change",
      ]);
      // Keep the real decoded image and its parent. The image's fitted content
      // size uses an empty placeholder to retain its original flow footprint.
      // Keeping object-fit also avoids SVG viewport changes at completion.
      toVisualEl.style.transform = "none";
      toVisualEl.style.transformOrigin = "center center";
      toVisualEl.style.willChange = "transform, clip-path, opacity";
      if (morph.resetRadius) toVisualEl.style.borderRadius = "0";
      const restoreFit = fitHeroImage(
        toVisualEl,
        morph.toContent,
        getClientRect(positionedParent, toVisualEl),
      );
      const reference = measureVisual(positionedParent, toVisualEl);
      source.style.width = `${morph.fromContent.width / reference.scaleX}px`;
      source.style.height = `${morph.fromContent.height / reference.scaleY}px`;
      source.style.zIndex = getComputedStyle(toVisualEl).zIndex;
      if (morph.resetRadius) source.style.borderRadius = "0";
      toVisualEl.after(source);
      const sourceReference = measureVisual(positionedParent, source);
      const sourceStyle = (t: number, u: number) => ({
        ...morph.styleFor(t, u, sourceReference),
        opacity: clampOpacity(u) * sourceOpacity.opacity,
      });
      const style = (t: number, u: number) => ({
        ...morph.styleFor(t, u, reference),
        opacity: clampOpacity(t) * targetOpacity.opacity,
      });
      applyMorphStyle(toVisualEl, style(0, 1));
      Object.assign(source.style, sourceStyle(0, 1));
      targetOpacity.set(0);
      sourceOpacity.set(0);
      onComplete(() => {
        restoreFit();
        restoreTo();
        sourceOpacity.restore();
        targetOpacity.restore();
        restoreMarker();
        source.remove();
      });
      animations.push(
        new WebAnimation({
          element: source,
          integrator: IntegratorProvider.from(physics),
          style: sourceStyle,
        }),
        new WebAnimation({
          element: toVisualEl,
          integrator: IntegratorProvider.from(physics),
          style,
        }),
      );
    }
    return { shared: animations };
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

type HeroExtras = { resolved: HeroResolved; strategies: HeroStrategy[] };

export const hero = (options: NormalizedHeroOptions) => {
  const physics = HERO_VARIANT_PROVIDERS[options.variant]();
  const maxDistance = DEFAULT_MAX_DISTANCE;

  const shared = {
    prepare: (args): Promise<HeroExtras> => {
      const strategies = heroStrategiesFor(options);
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

      return resolved.then((r) => ({ resolved: r, strategies }));
    },
    animation: ({ from, to, context, resolved, strategies }) => {
      if (resolved.pairs.length === 0) {
        return animationGroup({ shared: [], out: [], in: [] });
      }

      // Shared `onComplete` registry — strategies push restore callbacks
      // here, and the composite fires them after every child has settled.
      // Keep the in-place fit/clip until every sibling fade has settled.
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

      const groups: Record<HeroAnimationName, Animation[]> = {
        shared: [],
        out: [],
        in: [],
      };
      for (const strategy of strategies) {
        const contribution = strategy.contribute?.(ctx);
        if (!contribution) continue;
        for (const name of Object.keys(groups) as HeroAnimationName[]) {
          groups[name].push(...(contribution[name] ?? []));
        }
      }

      const composite = animationGroup(groups);
      const prevOnComplete = composite.onComplete;
      composite.onComplete = () => {
        prevOnComplete?.();
        // A forwards-filled transform must not override the restored image fit.
        for (const animation of Object.values(groups).flat()) {
          if (animation instanceof WebAnimation) animation.releaseFill();
        }
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
  } satisfies TransitionDirection<HeroExtras>;

  return defineTransition({
    forward: shared,
    backward: shared,
  });
};
