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
import { Animation, IntegratorProvider, WebAnimation } from "../../../animation";
import { createZoomIn, createZoomOut } from "../zoom-element";

export const BLUR_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 200, damping: 24 },
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
  initialStyle: {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    // Sits above the background page but below the zoomed page (z-index 9999
    // in transition.ts). backdrop-filter therefore blurs the background,
    // while the zoom tile stays sharp as it expands on top.
    zIndex: "5000",
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
