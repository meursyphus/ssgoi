import type { PhysicsOptions } from "@types";
import type {
  ZoomAnimationConfig,
  ZoomContributeCtx,
  ZoomExtras,
  ZoomOverlayConfig,
  ZoomPrepareCtx,
  ZoomProvider,
  ZoomStrategy,
} from "../types";
import {
  Animation,
  IntegratorProvider,
  WebAnimation,
} from "../../../animation";
import { createZoomIn, createZoomOut } from "../zoom-element";
import { Z_OVERLAY } from "../../stacking";
import { getOverlayRect } from "@utils";

export const BLUR_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 380,
    damping: 30,
    restDelta: 0.1,
    restSpeed: 0.1,
    doubleSpring: {
      stiffness: 260,
      damping: 30,
    },
  },
};

// Background page shrinks to (1 - SCALE_OFFSET) at peak.
const SCALE_OFFSET = 0.12;

// Maximum backdrop blur (px) at the zoom-detail extreme.
const MAX_BLUR_PX = 18;

// `backgroundOut` runs in enter mode against the outgoing page.
// transition.ts feeds it `u` (1 → 0), so flip to a 0 → 1 visual ramp.
function backgroundOut(): ZoomAnimationConfig {
  return {
    transformOrigin: "50% 50%",
    animate: (u) => {
      const t = 1 - u;
      return {
        transform: `scale(${1 - SCALE_OFFSET * t})`,
      };
    },
  };
}

// `backgroundIn` runs in exit mode against the incoming (revealed) page.
// transition.ts feeds it `t` (0 → 1) where 1 is settled, so the visual
// ramp is the inverse — start small/blurred, end at rest.
function backgroundIn(): ZoomAnimationConfig {
  return {
    transformOrigin: "50% 50%",
    animate: (t) => {
      const u = 1 - t;
      return {
        transform: `scale(${1 - SCALE_OFFSET * u})`,
      };
    },
  };
}

const overlay: ZoomOverlayConfig = {
  willChange: "backdrop-filter",
  // `top` + `height` are set per-transition in OverlayStrategy.contribute (they
  // track the live scroll position), so they are intentionally omitted here.
  initialStyle: {
    position: "absolute",
    left: "0",
    width: "100%",
    pointerEvents: "none",
    // z-index is applied in OverlayStrategy.contribute. The overlay always
    // sits at Z_OVERLAY, between the background page (Z_BACKGROUND) and the
    // zoomed tile (Z_FOREGROUND), in both enter and exit.
    backdropFilter: "blur(0px)",
    WebkitBackdropFilter: "blur(0px)",
  },
  style: (mode, progress) => {
    // enter: 0 → MAX_BLUR_PX. exit: MAX_BLUR_PX → 0.
    const visual = mode === "enter" ? progress : 1 - progress;
    const blur = `blur(${MAX_BLUR_PX * visual}px)`;
    return {
      backdropFilter: blur,
      WebkitBackdropFilter: blur,
    };
  },
};

/* ────────────────────────────────────────────────────────────────────────────
 * BackgroundStrategy — the blur tone scales the background page by a small
 * amount around its center, leaving the actual blur to a separate overlay
 * layer (see `OverlayStrategy` below).
 * ──────────────────────────────────────────────────────────────────────────── */

export class BlurBackgroundStrategy implements ZoomStrategy {
  readonly physics = BLUR_PHYSICS;

  contribute(ctx: ZoomContributeCtx): Animation[] {
    const { from, to, resolved, physics } = ctx;
    const isEnter = resolved.mode === "enter";
    const bgEl = isEnter ? from : to;
    const bgConfig = isEnter ? backgroundOut() : backgroundIn();

    if (bgConfig) bgEl.style.transformOrigin = bgConfig.transformOrigin;

    return [
      new WebAnimation({
        element: bgEl,
        integrator: IntegratorProvider.from(physics),
        style: isEnter
          ? (_t, u) => bgConfig.animate(u) as Record<string, string | number>
          : (t) => bgConfig.animate(t) as Record<string, string | number>,
      }),
    ];
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * OverlayStrategy — adds a backdrop-filter layer between the background page
 * and the zoomed tile. Only attached when the active type is `blur`, but the
 * implementation lives here next to the overlay config it consumes.
 * ──────────────────────────────────────────────────────────────────────────── */

export class OverlayStrategy implements ZoomStrategy {
  prepare(ctx: ZoomPrepareCtx): Partial<ZoomExtras> {
    const overlayEl = ctx.createElement("zoom-overlay");
    Object.assign(overlayEl.style, overlay.initialStyle);
    overlayEl.style.willChange = overlay.willChange;
    ctx.context.positionedParent.appendChild(overlayEl);
    return { overlay: overlayEl };
  }

  contribute(ctx: ZoomContributeCtx): Animation[] {
    const overlayEl = ctx.extras.overlay;
    if (!overlayEl) return [];
    // Sits at the middle tier between background and tile (see TileStrategy).
    // Overlay is fully transparent (blur(0px)) until the first tick fires, so
    // applying the z-index here — after prepare, before paint — has no cost.
    overlayEl.style.zIndex = Z_OVERLAY;
    // The overlay must stay inside positionedParent to sit between the
    // background and the tile in the stacking order — but positionedParent is
    // the scroll container, and absolute children of a scroll container
    // translate with the content. A plain inset:0 would ride the scroll and
    // leave the bottom `scroll.y` px of the viewport unblurred (visible on
    // exit, e.g. zooming back into a scrolled grid). The container is restored
    // to the incoming page's scroll (context.to.scroll.y) for the whole run, so
    // anchor the overlay to that live viewport slice instead (getOverlayRect
    // backs out both the scroll and positionedParent's own offset).
    const overlayRect = getOverlayRect(ctx.context, "to");
    overlayEl.style.top = `${overlayRect.top}px`;
    overlayEl.style.height = `${overlayRect.height}px`;
    return [
      new WebAnimation({
        element: overlayEl,
        integrator: IntegratorProvider.from(ctx.physics),
        style: (t) => overlay.style(ctx.resolved.mode, t),
      }),
    ];
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Legacy provider export.
 * ──────────────────────────────────────────────────────────────────────────── */

export function createBlurProvider(): ZoomProvider {
  return {
    physics: BLUR_PHYSICS,
    in: createZoomIn,
    out: createZoomOut,
    backgroundIn,
    backgroundOut,
    overlay,
  };
}
