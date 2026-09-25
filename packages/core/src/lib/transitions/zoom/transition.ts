import { hideSharedElement } from "../shared-visibility";
import type { AnimationDisposal } from "../../animation/animation";
import { animationGroup, releaseFillOnComplete } from "../animation-group";
import type { NavigationDirection } from "@types";
import { defineTransition } from "../../transition/define-transition";
import type { PhysicsOptions, TransitionDirection } from "@types";
import { getClientRect } from "@utils";
import { IntegratorProvider, WebAnimation, Animation } from "../../animation";
import { OverlayStrategy, createBackgroundStrategy } from "./provider";
import { createZoomIn, createZoomOut } from "./zoom-element";
import { crossfadeZoomVisuals } from "./crossfade";
import { CROSSFADE_ATTRIBUTE } from "../crossfade";
import { Z_BACKGROUND, Z_FOREGROUND } from "../stacking";
import {
  normalizeMediaGeometryPair,
  resolveElementMediaGeometry,
} from "../media-geometry";
import type {
  NormalizedZoomOptions,
  ZoomAnimationName,
  ZoomAnimationInput,
  ZoomContributeCtx,
  ZoomExtras,
  ZoomPrepareCtx,
  ZoomResolved,
  ZoomStrategy,
  ZoomVariant,
} from "./types";

export type { ZoomType, ZoomVariant, NormalizedZoomOptions } from "./types";

const ZOOM_ENTER_KEY = "data-zoom-enter-key";
const ZOOM_EXIT_KEY = "data-zoom-exit-key";
/** @deprecated Border radius is inferred from the keyed clipping window. */
const LEGACY_ZOOM_RADIUS_KEY = "data-zoom-radius";

function sameRect(
  a: { left: number; top: number; width: number; height: number },
  b: { left: number; top: number; width: number; height: number },
): boolean {
  const epsilon = 0.01;
  return (
    Math.abs(a.left - b.left) < epsilon &&
    Math.abs(a.top - b.top) < epsilon &&
    Math.abs(a.width - b.width) < epsilon &&
    Math.abs(a.height - b.height) < epsilon
  );
}

/**
 * Walk ancestor chain from `focusEl` up to (but excluding) `page`. At each
 * step collect siblings of the current node — those are elements that share
 * a parent with the focus subtree and can carry an opacity animation without
 * the inherited-opacity trap dimming the focus itself.
 */
function collectFadeTargets(
  page: HTMLElement,
  focusEl: HTMLElement,
): HTMLElement[] {
  const targets: HTMLElement[] = [];
  let current: HTMLElement | null = focusEl;
  while (current && current !== page) {
    const parent: HTMLElement | null = current.parentElement;
    if (!parent) break;
    for (const sibling of Array.from(parent.children)) {
      if (
        sibling !== current &&
        sibling instanceof HTMLElement &&
        !sibling.hasAttribute(CROSSFADE_ATTRIBUTE)
      ) {
        targets.push(sibling);
      }
    }
    current = parent;
  }
  return targets;
}

function findZoomEnter(node: HTMLElement): HTMLElement | null {
  const elements = node.querySelectorAll(`[${ZOOM_ENTER_KEY}]`);
  if (elements.length !== 1) return null;
  return elements[0] as HTMLElement;
}

function findZoomExit(node: HTMLElement, key: string): HTMLElement | null {
  const elements = node.querySelectorAll(`[${ZOOM_EXIT_KEY}]`);
  for (const element of elements) {
    if (element.getAttribute(ZOOM_EXIT_KEY) === key) {
      return element as HTMLElement;
    }
  }
  return null;
}

export function resolveZoom(
  fromNode: HTMLElement,
  toNode: HTMLElement,
  direction: "forward" | "backward",
): ZoomResolved | null {
  if (direction === "forward") {
    const enterEl = findZoomEnter(toNode);
    if (!enterEl) return null;
    const key = enterEl.getAttribute(ZOOM_ENTER_KEY);
    if (!key) return null;
    const exitEl = findZoomExit(fromNode, key);
    if (!exitEl) return null;
    return { mode: "enter", enterEl, exitEl };
  }

  const enterEl = findZoomEnter(fromNode);
  if (!enterEl) return null;
  const key = enterEl.getAttribute(ZOOM_ENTER_KEY);
  if (!key) return null;
  const exitEl = findZoomExit(toNode, key);
  if (!exitEl) return null;
  return { mode: "exit", enterEl, exitEl };
}

export function buildInput(
  resolved: ZoomResolved,
  fromNode: HTMLElement,
  toNode: HTMLElement,
  scrollOffset: { x: number; y: number },
): ZoomAnimationInput {
  const enterPage = resolved.mode === "enter" ? toNode : fromNode;
  const exitPage = resolved.mode === "enter" ? fromNode : toNode;
  const enterRect = getClientRect(enterPage, resolved.enterEl);
  const exitRect = getClientRect(exitPage, resolved.exitEl);
  const enterMedia = resolveElementMediaGeometry(
    resolved.enterEl,
    enterRect,
    (mediaEl) => getClientRect(enterPage, mediaEl),
    {
      clipRoot: enterPage,
      legacyRadiusAttribute: LEGACY_ZOOM_RADIUS_KEY,
    },
  );
  const exitMedia = resolveElementMediaGeometry(
    resolved.exitEl,
    exitRect,
    (mediaEl) => getClientRect(exitPage, mediaEl),
    {
      clipRoot: exitPage,
      legacyRadiusAttribute: LEGACY_ZOOM_RADIUS_KEY,
    },
  );
  const [normalizedEnterMedia, normalizedExitMedia] =
    normalizeMediaGeometryPair(enterMedia, exitMedia);
  const hasMediaPair =
    normalizedEnterMedia.contentAware && normalizedExitMedia.contentAware;
  const pageRect =
    resolved.mode === "enter"
      ? toNode.getBoundingClientRect()
      : fromNode.getBoundingClientRect();
  const pageBounds = {
    left: 0,
    top: 0,
    width: pageRect.width,
    height: pageRect.height,
  };
  const enterRadius =
    normalizedEnterMedia.radiusSource === "legacy" ||
    sameRect(normalizedEnterMedia.window, pageBounds)
      ? normalizedEnterMedia.radius
      : 0;

  return {
    enterRect,
    exitRect,
    ...(hasMediaPair
      ? {
          enterMedia: normalizedEnterMedia,
          exitMedia: normalizedExitMedia,
        }
      : {}),
    pageRect,
    scrollOffset,
    enterRadius,
    exitRadius: normalizedExitMedia.radius,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * TileStrategy — shared across all types. Drives the foreground tile motion
 * (zoom-in expanding from the grid cell, zoom-out shrinking back). Also owns
 * the z-index / willChange cleanup for the tile-side page since those touch
 * the same element it animates.
 * ──────────────────────────────────────────────────────────────────────────── */

class TileStrategy implements ZoomStrategy {
  readonly name = "tile";
  prepare(ctx: ZoomPrepareCtx): void {
    // Outgoing styling that doesn't depend on rect math. Applied as soon as
    // the `from` side resolves so pre-paint hints land before layout.
    ctx.from.then((el) => {
      el.style.willChange = "transform, clip-path, opacity";
      el.style.backfaceVisibility = "hidden";
      (el.style as CSSStyleDeclaration & { contain: string }).contain =
        "layout paint";
    });
  }

  contribute(ctx: ZoomContributeCtx): Animation[] {
    const { from, to, resolved, input, physics, onDispose } = ctx;
    const isEnter = resolved.mode === "enter";
    // Tile motion is applied to the page that owns the zoomed area.
    // Enter: that's `to` (incoming detail). Exit: that's `from` (outgoing).
    const tileConfig = isEnter ? createZoomIn(input) : createZoomOut(input);
    const tileEl = isEnter ? to : from;
    const feedDir: "t" | "u" = isEnter ? "t" : "u";

    const crossfade = crossfadeZoomVisuals(ctx);

    // Only the moving tile should paint the shared visuals. Otherwise its
    // antialiased rounded edge composites over the identical preview edge,
    // making the final corner look fuller despite matching radius geometry.
    onDispose(hideSharedElement(resolved.exitEl));

    if (tileConfig) tileEl.style.transformOrigin = tileConfig.transformOrigin;

    // Non-negative three-tier stacking: background < overlay < tile.
    // enter: `from` is the background (Z_BACKGROUND), the incoming tile (`to`)
    //   is raised to the foreground (Z_FOREGROUND); the blur overlay sits at
    //   Z_OVERLAY in between (see OverlayStrategy).
    // exit: `from` is the shrinking tile (Z_FOREGROUND) above the revealed
    //   background (`to`, Z_BACKGROUND), overlay in between.
    // Giving the background page an explicit z-index forms its own stacking
    // context so its descendants stay trapped beneath the tile. Keeping every
    // tier >= 0 means the layering no longer depends on the caller wrapping the
    // pages in a stacking context (a negative z-index would bleed behind it).
    const fromZ = isEnter ? Z_BACKGROUND : Z_FOREGROUND;
    const toZ = isEnter ? Z_FOREGROUND : Z_BACKGROUND;
    const previousFromZIndex = from.style.zIndex;
    from.style.zIndex = fromZ;
    // `to` is the surviving incoming page; raise/lower it and promote it to
    // position:relative (it is in normal flow) so the z-index takes effect.
    const previousToZIndex = to.style.zIndex;
    const previousToPosition = to.style.position;
    to.style.zIndex = toZ;
    to.style.position = "relative";

    onDispose((disposal) => {
      if (disposal.owns(tileEl)) {
        tileEl.style.willChange = "auto";
        tileEl.style.backfaceVisibility = "";
        tileEl.style.transformOrigin = "";
        tileEl.style.contain = "";
      }
      if (disposal.owns(from)) {
        from.style.zIndex = previousFromZIndex;
        from.style.willChange = "auto";
        from.style.backfaceVisibility = "";
        from.style.transformOrigin = "";
        from.style.contain = "";
        from.style.transform = "";
        from.style.clipPath = "";
      }
      if (disposal.owns(to)) {
        to.style.zIndex = previousToZIndex;
        to.style.position = previousToPosition;
        to.style.transformOrigin = "";
      }
    });

    return [
      ...crossfade,
      new WebAnimation({
        element: tileEl,
        integrator: IntegratorProvider.from(physics),
        // Enter: tile expands as `t` (0 → 1). Exit: tile shrinks as `u` —
        // the legacy convention from v5's outAnim path. Either way, feed
        // the progress that matches the tileConfig's authored direction.
        style:
          feedDir === "t"
            ? (t) => tileConfig.animate(t) as Record<string, string | number>
            : (_t, u) =>
                tileConfig.animate(u) as Record<string, string | number>,
      }),
    ];
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * FadeStrategy — fades sibling elements around the zoomed tile so the tile
 * stands out against a neutral background. variant `"default"` returns a
 * no-op instance; variant `"fade"` walks the sibling tree and animates each
 * target's opacity in lockstep with the shared physics.
 *
 * Factory uses a lookup table on `ZoomVariant`, not an inline branch.
 * ──────────────────────────────────────────────────────────────────────────── */

class FadeStrategy implements ZoomStrategy {
  readonly name = "content";
  contribute(ctx: ZoomContributeCtx): Animation[] {
    const { resolved, physics, from, to, onDispose } = ctx;
    const zoomedPage = resolved.mode === "enter" ? to : from;
    const targets = collectFadeTargets(zoomedPage, resolved.enterEl);
    if (targets.length === 0) return [];

    const previousOpacities = targets.map((el) => el.style.opacity);
    // Seed initial opacity for enter mode so the page doesn't flash at full
    // opacity before the first animation tick.
    if (resolved.mode === "enter") {
      for (const el of targets) el.style.opacity = "0";
    }

    onDispose((disposal) => {
      for (let i = 0; i < targets.length; i++) {
        const el = targets[i];
        if (el && disposal.owns(el))
          el.style.opacity = previousOpacities[i] ?? "";
      }
    });

    return targets.map(
      (target) =>
        new WebAnimation({
          element: target,
          integrator: IntegratorProvider.from(physics),
          style: (t, u) => ({
            opacity: resolved.mode === "enter" ? t : u,
          }),
        }),
    );
  }
}

class NoopStrategy implements ZoomStrategy {
  readonly name = "content";
  contribute(): Animation[] {
    return [];
  }
}

const FADE_STRATEGIES: Record<ZoomVariant, () => ZoomStrategy> = {
  default: () => new NoopStrategy(),
  fade: () => new FadeStrategy(),
};

function createFadeStrategy(variant: ZoomVariant): ZoomStrategy {
  return FADE_STRATEGIES[variant]();
}

/* ────────────────────────────────────────────────────────────────────────────
 * Strategy assembly — *no* `if/switch` on `type` or `variant` here. Each
 * factory owns its own table; this function just stitches the resulting
 * instances into a single ordered list.
 * ──────────────────────────────────────────────────────────────────────────── */

interface AssembledStrategies {
  strategies: ZoomStrategy[];
  physics: PhysicsOptions;
}

function zoomStrategiesFor(opts: NormalizedZoomOptions): AssembledStrategies {
  const background = createBackgroundStrategy(opts.type);
  const strategies: ZoomStrategy[] = [
    new TileStrategy(),
    background,
    createFadeStrategy(opts.variant),
    // Overlay is intrinsically tied to backdrop-filter-driven types. Today
    // that's only `blur`; the table-driven factory above owns the mapping
    // so this conditional is the single line that knows the relationship.
    ...(opts.type === "blur" ? [new OverlayStrategy()] : []),
  ];
  return { strategies, physics: background.physics };
}

/* ────────────────────────────────────────────────────────────────────────────
 * Public dispatcher. Walks the assembled strategy list twice:
 *   1. `prepare` pass: merge each strategy's extras into a shared bag.
 *   2. `contribute` pass: flatten each strategy's animation list and wrap
 *      them in a single `MultiAnimation` so the physics stays locked.
 * No type/variant branching lives in this function.
 * ──────────────────────────────────────────────────────────────────────────── */

export const zoom = (options: NormalizedZoomOptions) => {
  const { physics } = zoomStrategiesFor(options);

  const createDirection = (navigationDirection: NavigationDirection) =>
    ({
      prepare: (args) => {
        const { strategies } = zoomStrategiesFor(options);
        const ctx: ZoomPrepareCtx = {
          from: args.from,
          to: args.to,
          context: { positionedParent: args.context.positionedParent },
          // `createElement` from the dispatcher is generic over tag; the
          // strategy interface narrows the cast to keep both signatures
          // compatible.
          createElement: args.createElement as ZoomPrepareCtx["createElement"],
        };
        const extras: ZoomExtras = {};
        for (const strategy of strategies) {
          if (!strategy.prepare) continue;
          const contributed = strategy.prepare(ctx);
          if (contributed) Object.assign(extras, contributed);
        }
        return { ...extras, strategies };
      },
      animation: ({
        from,
        to,
        context,
        strategies = zoomStrategiesFor(options).strategies,
        ...extras
      }) => {
        const resolved = resolveZoom(from, to, navigationDirection);

        // No matching zoom pair → noop so the dispatcher still cleans up.
        if (!resolved) {
          return animationGroup({
            tile: [],
            background: [],
            content: [],
            overlay: [],
          });
        }

        const input = buildInput(resolved, from, to, context.scrollOffset);

        // Shared restoration runs after every named group finishes, allowing
        // overrides to retime groups independently without early DOM resets.
        const cleanups: Array<(disposal: AnimationDisposal) => void> = [];
        const onDispose = (fn: (disposal: AnimationDisposal) => void): void => {
          cleanups.push(fn);
        };

        const ctx: ZoomContributeCtx = {
          from,
          to,
          resolved,
          input,
          physics,
          context,
          extras: extras as ZoomExtras,
          onDispose,
        };

        const groups: Record<ZoomAnimationName, Animation[]> = {
          tile: [],
          background: [],
          content: [],
          overlay: [],
        };
        for (const strategy of strategies) {
          groups[strategy.name].push(...(strategy.contribute?.(ctx) ?? []));
        }
        const anims = Object.values(groups).flat();
        const composite = animationGroup(groups);
        // Independent overrides can make any group finish last. Restore shared
        // geometry only when the complete transition finishes or is interrupted.
        composite.onDispose = (disposal) => {
          for (const cleanup of cleanups) {
            try {
              cleanup(disposal);
            } catch (error) {
              console.error("[zoom] cleanup error", error);
            }
          }
        };

        // Release each animation's WAAPI forwards-fill once its OWN run settles,
        // so the inline styles (cleared during playback, reset by the cleanups
        // above) govern the resting visual instead of a lingering fill. Wrapped on
        // each animation's own onDispose — which fires after its onfinish but
        // before MultiAnimation's completion count — so every child is still
        // counted as done. Without this the exit tile stays shrunk to the card and
        // the background stays scaled; React <Activity> / Next cacheComponents then
        // preserve that on the real node, so the NEXT transition measures (and
        // renders) the page at the wrong size.
        for (const anim of anims) {
          if (anim instanceof WebAnimation) releaseFillOnComplete(anim);
        }

        return composite;
      },
    }) satisfies TransitionDirection<
      ZoomExtras & { strategies?: ZoomStrategy[] }
    >;

  return defineTransition({
    forward: createDirection("forward"),
    backward: createDirection("backward"),
  });
};
