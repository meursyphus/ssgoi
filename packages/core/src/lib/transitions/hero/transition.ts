import type { PhysicsOptions, TransitionConfig } from "@types";
import { getRect } from "@utils";
import {
  Animation,
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";
import { HERO_ENTER_KEY, HERO_EXIT_KEY, HERO_LEGACY_KEY } from "./keys";
import { HERO_CHROME_PROVIDERS } from "./provider";
import type {
  HeroContributeCtx,
  HeroPair,
  HeroPrepareCtx,
  HeroResolved,
  HeroStrategy,
  HeroType,
  NormalizedHeroOptions,
} from "./types";

export type { HeroType, HeroVariant, NormalizedHeroOptions } from "./types";

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 300, damping: 30 },
};
const DEFAULT_MAX_DISTANCE = 700;

const HERO_ASPECT_KEY = "data-hero-aspect-ratio";

/* ────────────────────────────────────────────────────────────────────────────
 * Visible-rect resolution
 *
 * Authors opt in via `data-hero-aspect-ratio` (e.g. "1600/1067" or "1.5") to
 * tell hero that the element's actual content occupies a smaller, centered
 * sub-rect of its bbox (the typical `<img object-contain>` case). Without
 * the hint, visible == bbox and the rest of the math runs identically to
 * the bbox-only path.
 * ──────────────────────────────────────────────────────────────────────────── */

type LetterboxInset = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type HeroRect = {
  visible: { left: number; top: number; width: number; height: number };
  bbox: { left: number; top: number; width: number; height: number };
  letterbox: LetterboxInset;
};

function parseAspect(value: string | null): number | null {
  if (!value) return null;
  if (value.includes("/")) {
    const [wStr, hStr] = value.split("/");
    const w = parseFloat(wStr ?? "");
    const h = parseFloat(hStr ?? "");
    if (!Number.isFinite(w) || !Number.isFinite(h) || h === 0) return null;
    return w / h;
  }
  const ratio = parseFloat(value);
  return Number.isFinite(ratio) && ratio > 0 ? ratio : null;
}

function getHeroRect(container: HTMLElement, el: HTMLElement): HeroRect {
  const bbox = getRect(container, el);
  const aspect = parseAspect(el.getAttribute(HERO_ASPECT_KEY));
  if (aspect === null) {
    return {
      visible: bbox,
      bbox,
      letterbox: { top: 0, right: 0, bottom: 0, left: 0 },
    };
  }
  // Contain-fit sub-rect at `aspect`, centered in bbox.
  const bboxAspect = bbox.width / bbox.height;
  let visibleW: number;
  let visibleH: number;
  if (bboxAspect > aspect) {
    visibleH = bbox.height;
    visibleW = visibleH * aspect;
  } else {
    visibleW = bbox.width;
    visibleH = visibleW / aspect;
  }
  const dx = (bbox.width - visibleW) / 2;
  const dy = (bbox.height - visibleH) / 2;
  return {
    visible: {
      left: bbox.left + dx,
      top: bbox.top + dy,
      width: visibleW,
      height: visibleH,
    },
    bbox,
    letterbox: { top: dy, right: dx, bottom: dy, left: dx },
  };
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
function resolveNewStylePairs(
  fromNode: HTMLElement,
  toNode: HTMLElement,
): HeroPair[] {
  const pairs: HeroPair[] = [];

  const toEnters = collectByAttr(toNode, HERO_ENTER_KEY);
  const fromExits = collectByAttr(fromNode, HERO_EXIT_KEY);
  for (const [key, toEl] of toEnters) {
    const fromEl = fromExits.get(key);
    if (!fromEl) continue;
    pairs.push({ key, fromEl, toEl });
  }

  const fromEnters = collectByAttr(fromNode, HERO_ENTER_KEY);
  const toExits = collectByAttr(toNode, HERO_EXIT_KEY);
  for (const [key, fromEl] of fromEnters) {
    const toEl = toExits.get(key);
    if (!toEl) continue;
    pairs.push({ key, fromEl, toEl });
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
    pairs.push({ key, fromEl, toEl });
  }
  return pairs;
}

function resolvePairs(fromNode: HTMLElement, toNode: HTMLElement): HeroPair[] {
  const pairs = resolveNewStylePairs(fromNode, toNode);
  if (pairs.length > 0) return pairs;
  return resolveLegacyPairs(fromNode, toNode);
}

/* ────────────────────────────────────────────────────────────────────────────
 * TileStrategy — the per-pair morph. Uniform scale (max of dim ratios)
 * keeps the image's aspect intact; clip-path inset hides the overshoot so
 * the visible window equals fromRect without stretching content. Used by
 * `type: "static"`, where the destination element itself can move.
 * ──────────────────────────────────────────────────────────────────────────── */

class TileStrategy implements HeroStrategy {
  contribute(ctx: HeroContributeCtx): Animation[] {
    const {
      from: fromNode,
      to: toNode,
      resolved,
      physics,
      scrollOffset,
      maxDistance,
      onComplete,
    } = ctx;

    const animations: Animation[] = [];

    for (const { fromEl, toEl } of resolved.pairs) {
      const fromHero = getHeroRect(fromNode, fromEl);
      const toHero = getHeroRect(toNode, toEl);
      const fromVisible = fromHero.visible;
      const toVisible = toHero.visible;
      const toBbox = toHero.bbox;
      const toLetterbox = toHero.letterbox;

      // Uniform scale on visible-to-visible. The matching dim hits
      // fromVisible exactly; the other overshoots and gets hidden by the
      // window inset (added on top of the letterbox baseline).
      const sMax = Math.max(
        fromVisible.width / toVisible.width,
        fromVisible.height / toVisible.height,
      );

      // Translate so the scaled bbox center lands on fromVisible's center.
      // (Centered-fit case → visible.center == bbox.center, so using bbox
      // center is equivalent and simpler.)
      const cxFrom = fromVisible.left + fromVisible.width / 2;
      const cyFrom = fromVisible.top + fromVisible.height / 2;
      const cxTo = toBbox.left + toBbox.width / 2;
      const cyTo = toBbox.top + toBbox.height / 2;
      const dx = cxFrom - cxTo - scrollOffset.x;
      const dy = cyFrom - cyTo - scrollOffset.y;

      if (Math.abs(dy) > maxDistance) continue;

      // Pre-scale window inset WITHIN toVisible. At u=1 the post-scale
      // visible window equals fromVisible; pre-scale that's
      // fromVisible.{w,h}/sMax. One dim equals toVisible (window inset 0);
      // the other is smaller (window inset half the gap).
      const visibleWUnscaled = fromVisible.width / sMax;
      const visibleHUnscaled = fromVisible.height / sMax;
      const windowInsetX = Math.max(
        0,
        (toVisible.width - visibleWUnscaled) / 2,
      );
      const windowInsetY = Math.max(
        0,
        (toVisible.height - visibleHUnscaled) / 2,
      );

      const prevTransform = toEl.style.transform;
      const prevPosition = toEl.style.position;
      const prevTransformOrigin = toEl.style.transformOrigin;
      const prevClipPath = toEl.style.clipPath;
      const prevZIndex = toEl.style.zIndex;
      const prevWillChange = toEl.style.willChange;

      toEl.style.position = "relative";
      toEl.style.transformOrigin = "center center";
      toEl.style.zIndex = "1000";
      toEl.style.willChange = "transform, clip-path";

      onComplete(() => {
        toEl.style.transform = prevTransform;
        toEl.style.position = prevPosition;
        toEl.style.transformOrigin = prevTransformOrigin;
        toEl.style.clipPath = prevClipPath;
        toEl.style.zIndex = prevZIndex;
        toEl.style.willChange = prevWillChange;
      });

      animations.push(
        new WebAnimation({
          element: toEl,
          integrator: IntegratorProvider.from(physics),
          style: (t, u) => {
            const tx = u * dx;
            const ty = u * dy;
            const s = t + u * sMax;
            // Letterbox is a permanent baseline (hides bbox space outside
            // the visible sub-rect); window inset opens up from full crop
            // at u=1 to the full visible rect at u=0.
            const insetT = toLetterbox.top + u * windowInsetY;
            const insetR = toLetterbox.right + u * windowInsetX;
            const insetB = toLetterbox.bottom + u * windowInsetY;
            const insetL = toLetterbox.left + u * windowInsetX;
            return {
              transform: `translate(${tx}px, ${ty}px) scale(${s})`,
              clipPath: `inset(${insetT}px ${insetR}px ${insetB}px ${insetL}px)`,
            };
          },
        }),
      );
    }

    return animations;
  }
}

/**
 * CloneTileStrategy — used by `type: "fade"`.
 *
 * The pages themselves cross-fade as whole surfaces, so the moving hero cannot
 * live inside either page. Instead we clone the destination element, hide both
 * matched originals, and morph the clone above the pages. The geometry mirrors
 * TileStrategy's uniform-scale + clip-path math, but it is measured relative
 * to the positioned parent because the clone is appended there.
 */
class CloneTileStrategy implements HeroStrategy {
  contribute(ctx: HeroContributeCtx): Animation[] {
    const { resolved, physics, positionedParent, maxDistance, onComplete } =
      ctx;

    const animations: Animation[] = [];

    for (const { fromEl, toEl } of resolved.pairs) {
      const fromHero = getHeroRect(positionedParent, fromEl);
      const toHero = getHeroRect(positionedParent, toEl);
      const fromVisible = fromHero.visible;
      const toVisible = toHero.visible;
      const toBbox = toHero.bbox;
      const toLetterbox = toHero.letterbox;

      if (
        fromVisible.width === 0 ||
        fromVisible.height === 0 ||
        toVisible.width === 0 ||
        toVisible.height === 0
      ) {
        continue;
      }

      const sMax = Math.max(
        fromVisible.width / toVisible.width,
        fromVisible.height / toVisible.height,
      );

      const cxFrom = fromVisible.left + fromVisible.width / 2;
      const cyFrom = fromVisible.top + fromVisible.height / 2;
      const cxTo = toBbox.left + toBbox.width / 2;
      const cyTo = toBbox.top + toBbox.height / 2;
      const dx = cxFrom - cxTo;
      const dy = cyFrom - cyTo;

      if (Math.abs(dy) > maxDistance) continue;

      const visibleWUnscaled = fromVisible.width / sMax;
      const visibleHUnscaled = fromVisible.height / sMax;
      const windowInsetX = Math.max(
        0,
        (toVisible.width - visibleWUnscaled) / 2,
      );
      const windowInsetY = Math.max(
        0,
        (toVisible.height - visibleHUnscaled) / 2,
      );

      const clone = toEl.cloneNode(true) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.left = `${toBbox.left}px`;
      clone.style.top = `${toBbox.top}px`;
      clone.style.width = `${toBbox.width}px`;
      clone.style.height = `${toBbox.height}px`;
      clone.style.margin = "0";
      clone.style.transformOrigin = "center center";
      clone.style.zIndex = "1000";
      clone.style.willChange = "transform, clip-path";
      clone.style.pointerEvents = "none";
      clone.style.maxWidth = "none";
      clone.style.maxHeight = "none";

      const styleFor = (t: number, u: number) => {
        const tx = u * dx;
        const ty = u * dy;
        const s = t + u * sMax;
        const insetT = toLetterbox.top + u * windowInsetY;
        const insetR = toLetterbox.right + u * windowInsetX;
        const insetB = toLetterbox.bottom + u * windowInsetY;
        const insetL = toLetterbox.left + u * windowInsetX;
        return {
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
          clipPath: `inset(${insetT}px ${insetR}px ${insetB}px ${insetL}px)`,
        };
      };

      const initialStyle = styleFor(0, 1);
      clone.style.transform = initialStyle.transform;
      clone.style.clipPath = initialStyle.clipPath;

      positionedParent.appendChild(clone);

      const previousFromOpacity = fromEl.style.opacity;
      const previousToOpacity = toEl.style.opacity;
      fromEl.style.opacity = "0";
      toEl.style.opacity = "0";

      onComplete(() => {
        fromEl.style.opacity = previousFromOpacity;
        toEl.style.opacity = previousToOpacity;
        if (clone.parentElement) clone.parentElement.removeChild(clone);
      });

      animations.push(
        new WebAnimation({
          element: clone,
          integrator: IntegratorProvider.from(physics),
          style: styleFor,
        }),
      );
    }

    return animations;
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Strategy assembly — *no* if/switch on `type` here. The chrome factory
 * owns the lookup; this function just stitches the resulting instances into
 * a single ordered list.
 * ──────────────────────────────────────────────────────────────────────────── */

const HERO_TILE_STRATEGIES: Record<HeroType, () => HeroStrategy> = {
  static: () => new TileStrategy(),
  fade: () => new CloneTileStrategy(),
};

function heroStrategiesFor(opts: NormalizedHeroOptions): HeroStrategy[] {
  return [
    HERO_TILE_STRATEGIES[opts.type](),
    HERO_CHROME_PROVIDERS[opts.type](),
  ];
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
  const physics = DEFAULT_PHYSICS;
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
        scrollOffset: context.scrollOffset,
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
