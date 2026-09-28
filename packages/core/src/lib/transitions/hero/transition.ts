import type { AnimationDisposal } from "../../animation/animation";
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
  type MediaRect,
} from "../media-geometry";
import { fallbackHeroFit } from "./fit";
import { createHeroExitLayer, usesHeroExitLayer } from "./exit-layer";
import {
  clampOpacity,
  cloneCrossfadeVisual,
  crossfadeUnderOpacity,
  measureVisual,
  retainOpacity,
  type VisualReference,
} from "../crossfade";
import { placeCrossfadeCopy, preserveStyles, stackHeroPages } from "./in-place";
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
 * cases the pair crossfades: in the destination parent on enter, above both
 * pages on exit.
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

/**
 * Where a rendered visual sits (`box`, its clip-path reference box) and the
 * media content it paints (`content`), both in root space. A copy sized to its
 * content omits `content`. The real destination keeps its own layout box, so
 * its fitted content can be larger (cover) or smaller (contain) than the box.
 */
export type HeroVisualReference = VisualReference & { content?: MediaRect };

type HeroMorphPlan = {
  fromContent: MediaGeometry["content"];
  toContent: MediaGeometry["content"];
  /** The destination visual's own layout box, in the same space as `toContent`. */
  toVisualBox: MediaRect;
  fromVisualEl: HTMLElement;
  toVisualEl: HTMLElement;
  resetRadius: boolean;
  styleFor: (
    t: number,
    u: number,
    reference?: HeroVisualReference,
  ) => HeroMorphStyle;
};

/** Re-express `rect`, measured against `from`, against the same box measured as `to`. */
function relocateRect(rect: MediaRect, from: MediaRect, to: MediaRect) {
  const sx = from.width > 0 ? to.width / from.width : 1;
  const sy = from.height > 0 ? to.height / from.height : 1;
  return {
    left: to.left + (rect.left - from.left) * sx,
    top: to.top + (rect.top - from.top) * sy,
    width: rect.width * sx,
    height: rect.height * sy,
  };
}

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

  const toVisualEl = toHero.mediaElement ?? toEl;

  return {
    fromContent,
    toContent,
    // Same root space as `toContent` (see getHeroRect).
    toVisualBox: measureVisual(root, toVisualEl).box,
    fromVisualEl: fromHero.mediaElement ?? fromEl,
    toVisualEl,
    resetRadius: shouldResetHeroRadius(fromHero, toHero),
    styleFor: (t, u, reference) => {
      const sx = t + u * scaleX;
      const sy = t + u * scaleY;
      // Without a reference the element is a copy placed at `toContent`.
      const box = reference?.box ?? toContent;
      const painted = reference?.content ?? box;
      // Scale the painted content onto the interpolated content rect.
      const scaleXOut = reference ? (sx * toContent.width) / painted.width : sx;
      const scaleYOut = reference
        ? (sy * toContent.height) / painted.height
        : sy;
      // transform-origin is the box center; land the painted content's center
      // on the interpolated content center. Translation is in local units, so
      // remove any ancestor scale.
      const tx =
        (u * dx +
          cxTo -
          centerX(box) -
          scaleXOut * (centerX(painted) - centerX(box))) /
        (reference?.scaleX ?? 1);
      const ty =
        (u * dy +
          cyTo -
          centerY(box) -
          scaleYOut * (centerY(painted) - centerY(box))) /
        (reference?.scaleY ?? 1);
      // Painted units per destination-content unit on each axis (1 for a copy
      // placed at `toContent`).
      const kx = painted.width / toContent.width;
      const ky = painted.height / toContent.height;
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
          x: (radius / Math.max(Math.abs(sx), 0.000001)) * kx,
          y: (radius / Math.max(Math.abs(sy), 0.000001)) * ky,
        };
      });
      // The window is interpolated inside the destination content. Express it
      // against the element's own box: cover content larger than the box gives
      // negative insets (painted only where the image's overflow allows it),
      // contain content smaller than the box gives the letterbox as insets.
      const insetT = fromClipInset.top * u + toClipInset.top * t;
      const insetR = fromClipInset.right * u + toClipInset.right * t;
      const insetB = fromClipInset.bottom * u + toClipInset.bottom * t;
      const insetL = fromClipInset.left * u + toClipInset.left * t;
      return {
        transform: `translate(${tx}px, ${ty}px) scale(${scaleXOut}, ${scaleYOut})`,
        clipPath: insetClipPath(
          box,
          {
            top: insetT * ky + painted.top - box.top,
            right:
              insetR * kx +
              box.left +
              box.width -
              (painted.left + painted.width),
            bottom:
              insetB * ky +
              box.top +
              box.height -
              (painted.top + painted.height),
            left: insetL * kx + painted.left - box.left,
          },
          radii,
        ),
      };
    },
  };
}

/**
 * Motion identity for the flight. The destination track carries the shared
 * photo's key so a redirected navigation (A→B→A) can pick the flight up from
 * wherever it currently is, even on a different DOM instance. Source copies
 * are unkeyed: they only ever enter and release.
 */
function heroDestinationMotion(
  key: string,
  space: HTMLElement,
  temporary: boolean,
) {
  return {
    key,
    role: "shared-media",
    space,
    lifetime: temporary ? ("temporary" as const) : ("persistent" as const),
  };
}
function heroSourceMotion(space: HTMLElement) {
  return {
    role: "shared-media-source",
    space,
    lifetime: "temporary" as const,
  };
}

function applyMorphStyle(el: HTMLElement, style: HeroMorphStyle): void {
  el.style.transform = style.transform;
  el.style.clipPath = style.clipPath;
}

/** Enter crossfades in-page; exit crossfades in a layer above both pages. */
class HeroTileStrategy implements HeroStrategy {
  contribute(
    ctx: HeroContributeCtx,
  ): AnimationContributions<HeroAnimationName> {
    const { resolved, physics, positionedParent, maxDistance, onDispose } = ctx;
    const restoreStack = stackHeroPages(ctx.from, ctx.to);
    onDispose((disposal) => restoreStack(disposal.owns));
    // Measure every pair before changing any visual's paint styles.
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
    for (const { pair, plan: morph } of matches) {
      const { fromVisualEl, toVisualEl } = morph;
      const sourceOpacity = retainOpacity(fromVisualEl);
      const targetOpacity = retainOpacity(toVisualEl);
      if (usesHeroExitLayer(pair, ctx.direction)) {
        const { layer, source, destination } = createHeroExitLayer(
          fromVisualEl,
          toVisualEl,
          morph.fromContent,
          morph.toContent,
          morph.resetRadius,
        );
        const sourceReference = {
          box: morph.fromContent,
          scaleX: 1,
          scaleY: 1,
        };
        const sourceStyle = (t: number, u: number) => ({
          ...morph.styleFor(t, u, sourceReference),
          opacity: clampOpacity(u) * sourceOpacity.opacity,
        });
        const destinationStyle = (t: number, u: number) => ({
          ...morph.styleFor(t, u),
          opacity: clampOpacity(t) * targetOpacity.opacity,
        });
        Object.assign(source.style, sourceStyle(0, 1));
        Object.assign(destination.style, destinationStyle(0, 1));
        positionedParent.appendChild(layer);
        sourceOpacity.set(0);
        targetOpacity.set(0);
        // Opacity leases and the layer are this run's own resources; the
        // lease itself arbitrates with a newer run that reuses the image.
        onDispose(() => {
          layer.remove();
          sourceOpacity.restore();
          targetOpacity.restore();
        });
        animations.push(
          new WebAnimation({
            element: source,
            motion: heroSourceMotion(positionedParent),
            integrator: IntegratorProvider.from(physics),
            style: sourceStyle,
          }),
          new WebAnimation({
            element: destination,
            motion: heroDestinationMotion(pair.key, positionedParent, true),
            integrator: IntegratorProvider.from(physics),
            style: destinationStyle,
          }),
        );
        continue;
      }
      // Snapshot before hiding the source or changing any paint style.
      const source = cloneCrossfadeVisual(fromVisualEl);
      const restoreTo = preserveStyles(toVisualEl, [
        "transform",
        "transform-origin",
        "clip-path",
        "border-radius",
        "will-change",
      ]);
      // Keep the real decoded image in its parent with its authored position,
      // size, margins, flex, and object-fit: only paint properties change, so
      // siblings never move and nothing stands in for the image in layout.
      toVisualEl.style.transform = "none";
      toVisualEl.style.transformOrigin = "center center";
      toVisualEl.style.willChange = "transform, clip-path, opacity";
      if (morph.resetRadius) toVisualEl.style.borderRadius = "0";
      const placement = placeCrossfadeCopy(toVisualEl, source);
      const measured = measureVisual(positionedParent, toVisualEl);
      // Transform and clip are expressed against the image's own box, which
      // paints the fitted content measured with the plan.
      const reference: HeroVisualReference = {
        ...measured,
        content: relocateRect(morph.toContent, morph.toVisualBox, measured.box),
      };
      source.style.width = `${morph.fromContent.width / reference.scaleX}px`;
      source.style.height = `${morph.fromContent.height / reference.scaleY}px`;
      source.style.zIndex = getComputedStyle(toVisualEl).zIndex;
      if (morph.resetRadius) source.style.borderRadius = "0";
      const sourceReference = measureVisual(positionedParent, source);
      // The lower visual stays opaque and the upper one fades, so overlapping
      // opaque pixels never expose the backdrop (see crossfadeUnderOpacity).
      // Below, the copy also covers what the real image cannot paint.
      const below = placement === "below";
      const sourceStyle = (t: number, u: number) => ({
        ...morph.styleFor(t, u, sourceReference),
        opacity: below
          ? crossfadeUnderOpacity(
              u,
              sourceOpacity.opacity,
              targetOpacity.opacity,
            )
          : clampOpacity(u) * sourceOpacity.opacity,
      });
      const style = (t: number, u: number) => ({
        ...morph.styleFor(t, u, reference),
        opacity: below
          ? clampOpacity(t) * targetOpacity.opacity
          : crossfadeUnderOpacity(
              t,
              targetOpacity.opacity,
              sourceOpacity.opacity,
            ),
      });
      applyMorphStyle(toVisualEl, style(0, 1));
      Object.assign(source.style, sourceStyle(0, 1));
      targetOpacity.set(style(0, 1).opacity);
      sourceOpacity.set(0);
      // Paint styles are restored regardless of ownership: a newer track on
      // the same image only drives transform, clip and opacity, and inline
      // writes under its live WAAPI are inert.
      onDispose(() => {
        restoreTo();
        sourceOpacity.restore();
        targetOpacity.restore();
        source.remove();
      });
      animations.push(
        new WebAnimation({
          element: source,
          motion: heroSourceMotion(positionedParent),
          integrator: IntegratorProvider.from(physics),
          style: sourceStyle,
        }),
        new WebAnimation({
          element: toVisualEl,
          motion: heroDestinationMotion(pair.key, positionedParent, false),
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

      // Shared `onDispose` registry — strategies push restore callbacks
      // here, and the composite fires them after every child has settled.
      // Keep the in-place transform/clip until every sibling fade has settled.
      const cleanups: Array<(disposal: AnimationDisposal) => void> = [];
      const onDispose = (fn: (disposal: AnimationDisposal) => void): void => {
        cleanups.push(fn);
      };

      const ctx: HeroContributeCtx = {
        direction: context.direction,
        from,
        to,
        resolved,
        physics,
        positionedParent: context.positionedParent,
        maxDistance,
        onDispose,
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
      const prevOnDispose = composite.onDispose;
      composite.onDispose = (disposal) => {
        prevOnDispose?.(disposal);
        // A forwards-filled transform/clip must not outlive the restored styles.
        for (const animation of Object.values(groups).flat()) {
          if (animation instanceof WebAnimation) animation.releaseFill();
        }
        for (const fn of cleanups) {
          try {
            fn(disposal);
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
