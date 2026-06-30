import type { PhysicsOptions, TransitionConfig } from "@types";
import { getClientRect } from "@utils";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
  Animation,
} from "../../animation";
import { OverlayStrategy, createBackgroundStrategy } from "./provider";
import { createZoomIn, createZoomOut } from "./zoom-element";
import { Z_BACKGROUND, Z_FOREGROUND } from "../stacking";
import type {
  NormalizedZoomOptions,
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
const ZOOM_RADIUS_KEY = "data-zoom-radius";

function readRadius(el: HTMLElement): number {
  const raw = el.getAttribute(ZOOM_RADIUS_KEY);
  if (!raw) return 0;
  const num = parseFloat(raw);
  return Number.isFinite(num) && num > 0 ? num : 0;
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
      if (sibling !== current && sibling instanceof HTMLElement) {
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

function resolveZoom(
  fromNode: HTMLElement,
  toNode: HTMLElement,
): ZoomResolved | null {
  const fromEnter = findZoomEnter(fromNode);
  const toEnter = findZoomEnter(toNode);

  if (!fromEnter && toEnter) {
    const key = toEnter.getAttribute(ZOOM_ENTER_KEY);
    if (!key) return null;
    const exitEl = findZoomExit(fromNode, key);
    if (!exitEl) return null;
    return { mode: "enter", enterEl: toEnter, exitEl };
  }

  if (fromEnter && !toEnter) {
    const key = fromEnter.getAttribute(ZOOM_ENTER_KEY);
    if (!key) return null;
    const exitEl = findZoomExit(toNode, key);
    if (!exitEl) return null;
    return { mode: "exit", enterEl: fromEnter, exitEl };
  }

  return null;
}

function buildInput(
  resolved: ZoomResolved,
  fromNode: HTMLElement,
  toNode: HTMLElement,
  scrollOffset: { x: number; y: number },
): ZoomAnimationInput {
  return {
    enterRect: getClientRect(
      resolved.mode === "enter" ? toNode : fromNode,
      resolved.enterEl,
    ),
    exitRect: getClientRect(
      resolved.mode === "enter" ? fromNode : toNode,
      resolved.exitEl,
    ),
    pageRect:
      resolved.mode === "enter"
        ? toNode.getBoundingClientRect()
        : fromNode.getBoundingClientRect(),
    scrollOffset,
    enterRadius: readRadius(resolved.enterEl),
    exitRadius: readRadius(resolved.exitEl),
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * TileStrategy — shared across all types. Drives the foreground tile motion
 * (zoom-in expanding from the grid cell, zoom-out shrinking back). Also owns
 * the z-index / willChange cleanup for the tile-side page since those touch
 * the same element it animates.
 * ──────────────────────────────────────────────────────────────────────────── */

class TileStrategy implements ZoomStrategy {
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
    const { from, to, resolved, input, physics, onComplete } = ctx;
    const isEnter = resolved.mode === "enter";
    // Tile motion is applied to the page that owns the zoomed area.
    // Enter: that's `to` (incoming detail). Exit: that's `from` (outgoing).
    const tileConfig = isEnter ? createZoomIn(input) : createZoomOut(input);
    const tileEl = isEnter ? to : from;
    const feedDir: "t" | "u" = isEnter ? "t" : "u";

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

    onComplete(() => {
      tileEl.style.willChange = "auto";
      tileEl.style.backfaceVisibility = "";
      tileEl.style.transformOrigin = "";
      (tileEl.style as CSSStyleDeclaration & { contain: string }).contain = "";
      from.style.zIndex = previousFromZIndex;
      // `to` is the surviving page; restore the stacking props raised above.
      // Guard each reset: if a follow-up navigation already re-claimed this
      // node (e.g. as the next outgoing `from`, now position:absolute), its
      // stacking has changed — don't strip the fresh values.
      if (to.style.zIndex === toZ) to.style.zIndex = previousToZIndex;
      if (to.style.position === "relative")
        to.style.position = previousToPosition;
      // The exit-mode background animation writes transformOrigin onto `to`
      // (bgEl === to) and nothing else clears it — reset it here too.
      to.style.transformOrigin = "";
      // `from` is the REAL outgoing page now (React <Activity> / Next
      // cacheComponents re-hide and reuse this node on the next nav), so any
      // inline style left on it persists and corrupts the page when it
      // reappears. Mirror the tile-side (`to`) reset above for every prop the
      // prepare hook / out animations write to `from`, regardless of mode:
      //   - prepare(): willChange, backfaceVisibility, contain.
      //   - background/tile out animations: transformOrigin (set here for the
      //     `from`-owned config) plus the WAAPI forwards-fill final frame
      //     (transform on the expand/blur background, transform + clipPath on
      //     the exit-mode tile). When `tileEl === from` (exit) the resets
      //     above already cover those props; the lines below make the cleanup
      //     correct in enter mode too, where `tileEl === to`.
      from.style.willChange = "auto";
      from.style.backfaceVisibility = "";
      from.style.transformOrigin = "";
      (from.style as CSSStyleDeclaration & { contain: string }).contain = "";
      from.style.transform = "";
      from.style.clipPath = "";
    });

    return [
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
  contribute(ctx: ZoomContributeCtx): Animation[] {
    const { resolved, physics, from, to, onComplete } = ctx;
    const zoomedPage = resolved.mode === "enter" ? to : from;
    const targets = collectFadeTargets(zoomedPage, resolved.enterEl);
    if (targets.length === 0) return [];

    const previousOpacities = targets.map((el) => el.style.opacity);
    // Seed initial opacity for enter mode so the page doesn't flash at full
    // opacity before the first animation tick.
    if (resolved.mode === "enter") {
      for (const el of targets) el.style.opacity = "0";
    }

    onComplete(() => {
      for (let i = 0; i < targets.length; i++) {
        const el = targets[i];
        if (el) el.style.opacity = previousOpacities[i] ?? "";
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
 * CrossfadeStrategy — placeholder for cross-page opacity blending. v5 had
 * no implementation here, so the strategy is a no-op for now. Kept in the
 * pipeline so future tones (e.g. `expand.dim`) can swap it in without
 * touching the dispatcher.
 * ──────────────────────────────────────────────────────────────────────────── */

class CrossfadeStrategy extends NoopStrategy {}

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
    new CrossfadeStrategy(),
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

export const zoom = (
  options: NormalizedZoomOptions,
): TransitionConfig<ZoomExtras> => {
  const { strategies, physics } = zoomStrategiesFor(options);

  return {
    prepare: (args): ZoomExtras => {
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
      return extras;
    },
    animation: ({ from, to, context, ...extras }) => {
      const resolved = resolveZoom(from, to);

      // No matching zoom pair → noop so the dispatcher still cleans up.
      if (!resolved) {
        return new MultiAnimation([], { mode: "parallel" });
      }

      const input = buildInput(resolved, from, to, context.scrollOffset);

      // Shared `onComplete` registry — strategies push restore callbacks
      // here, and the *first* animation in the list (tile) fires them all.
      // Doing it on tile completion mirrors v5's behavior where the inAnim
      // owned all cleanup.
      const cleanups: Array<() => void> = [];
      const onComplete = (fn: () => void): void => {
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
        onComplete,
      };

      // Flatten every strategy's contribution into a single ordered list.
      const anims: Animation[] = [];
      for (const strategy of strategies) {
        if (!strategy.contribute) continue;
        anims.push(...strategy.contribute(ctx));
      }

      // Attach cleanup to the first animation's onComplete (tile, by
      // construction). v5 fired all restores from the inAnim onComplete;
      // we mirror that — the tile animation is always present (created by
      // TileStrategy) and is the natural cleanup hook because it owns the
      // longest-lived inline styles (z-index on `from`, will-change/
      // transform on the tile element).
      const head = anims[0];
      if (head) {
        const prevOnComplete = head.onComplete;
        head.onComplete = () => {
          prevOnComplete?.();
          for (const fn of cleanups) {
            try {
              fn();
            } catch (e) {
              // Don't let one faulty restore tear down sibling cleanups.
              console.error("[zoom] cleanup error", e);
            }
          }
        };
      }

      // Release each animation's WAAPI forwards-fill once its OWN run settles,
      // so the inline styles (cleared during playback, reset by the cleanups
      // above) govern the resting visual instead of a lingering fill. Wrapped on
      // each animation's own onComplete — which fires after its onfinish but
      // before MultiAnimation's completion count — so every child is still
      // counted as done. Without this the exit tile stays shrunk to the card and
      // the background stays scaled; React <Activity> / Next cacheComponents then
      // preserve that on the real node, so the NEXT transition measures (and
      // renders) the page at the wrong size.
      for (const anim of anims) {
        if (!(anim instanceof WebAnimation)) continue;
        const prev = anim.onComplete;
        anim.onComplete = () => {
          prev?.();
          anim.releaseFill();
        };
      }

      return new MultiAnimation(anims, { mode: "parallel" });
    },
  };
};
