import type { PhysicsOptions, TransitionConfig } from "@types";
import { getRect } from "@utils";
import { ZOOM_PROVIDERS } from "./provider";
import type { ZoomAnimationInput, ZoomOptions, ZoomProvider } from "./types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

export type { ZoomOptions, ZoomType } from "./types";

const ZOOM_ENTER_KEY = "data-zoom-enter-key";
const ZOOM_EXIT_KEY = "data-zoom-exit-key";
const ZOOM_RADIUS_KEY = "data-zoom-radius";

function readRadius(el: HTMLElement): number {
  const raw = el.getAttribute(ZOOM_RADIUS_KEY);
  if (!raw) return 0;
  const num = parseFloat(raw);
  return Number.isFinite(num) && num > 0 ? num : 0;
}

// Walk ancestor chain from focusEl up to (but excluding) page. At each step
// collect siblings of the current node — those are elements that share a
// parent with the focus subtree and can carry an opacity animation without
// the inherited-opacity trap dimming the focus itself.
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

type ZoomResolved = {
  mode: "enter" | "exit";
  enterEl: HTMLElement;
  exitEl: HTMLElement;
};

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
    enterRect: getRect(
      resolved.mode === "enter" ? toNode : fromNode,
      resolved.enterEl,
    ),
    exitRect: getRect(
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

type ZoomExtras = { overlay?: HTMLElement };

export const zoom = (options: ZoomOptions): TransitionConfig<ZoomExtras> => {
  const provider: ZoomProvider = ZOOM_PROVIDERS[options.type];
  const physicsOptions: PhysicsOptions = provider.physics;
  const overlayConfig = provider.overlay;
  const fadeEnabled = options.fade ?? false;

  return {
    prepare: ({ from, context, createElement }) => {
      // Outgoing styling that doesn't depend on rect math.
      from.then((el) => {
        el.style.willChange = "transform, clip-path, opacity";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
      });

      if (!overlayConfig) return {};

      // Layer for effects (blur backdrop, etc.). Lives on positionedParent so
      // it is clipped by that container while pages translate/scale.
      const overlay = createElement("zoom-overlay");
      Object.assign(overlay.style, overlayConfig.initialStyle);
      overlay.style.willChange = overlayConfig.willChange;
      context.positionedParent.appendChild(overlay);
      return { overlay };
    },
    animation: ({ from, to, context, overlay }) => {
      const resolved = resolveZoom(from, to);

      // No matching zoom pair → fall back to a noop animation so the
      // dispatcher still cleans up after itself.
      if (!resolved) {
        return new MultiAnimation([], { mode: "parallel" });
      }

      const input = buildInput(resolved, from, to, context.scrollOffset);

      const inConfig =
        resolved.mode === "enter"
          ? provider.in(input)
          : provider.backgroundIn(input);
      const outConfig =
        resolved.mode === "enter"
          ? provider.backgroundOut(input)
          : provider.out(input);

      if (inConfig) to.style.transformOrigin = inConfig.transformOrigin;
      if (outConfig) from.style.transformOrigin = outConfig.transformOrigin;

      // Keep the page that owns the zoom area on top throughout the
      // transition (enter → `to`, exit → `from`). Restore the prior inline
      // z-index when the animation completes.
      const zoomedPage = resolved.mode === "enter" ? to : from;
      const previousZIndex = zoomedPage.style.zIndex;
      zoomedPage.style.zIndex = "9999";

      // ── Fade targets (sibling-walk) ──
      // To fade everything in the zoomed page EXCEPT the enter-key (and its
      // ancestors), apply opacity to siblings at each level of the ancestor
      // chain. The enter-key's branch is never touched, so CSS opacity
      // inheritance can't dim it.
      const fadeTargets: HTMLElement[] = fadeEnabled
        ? collectFadeTargets(zoomedPage, resolved.enterEl)
        : [];
      const previousFadeOpacities = fadeTargets.map((el) => el.style.opacity);

      // Seed initial opacity for enter mode so the page doesn't flash at full
      // opacity before the first animation tick.
      if (fadeEnabled && resolved.mode === "enter") {
        for (const el of fadeTargets) el.style.opacity = "0";
      }

      const restoreFadeTargets = () => {
        for (let i = 0; i < fadeTargets.length; i++) {
          const el = fadeTargets[i];
          if (el) el.style.opacity = previousFadeOpacities[i] ?? "";
        }
      };

      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(physicsOptions),
        // The provider's `animate` was authored against legacy convention
        // where OUT runs `progress: 1 → 0`. Our `u` mirrors that, so feeding
        // `u` keeps the visual direction (full page → shrunk to tile) intact.
        style: (_t, u) =>
          outConfig.animate(u) as Record<string, string | number>,
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t) => inConfig.animate(t) as Record<string, string | number>,
        onComplete: () => {
          to.style.willChange = "auto";
          to.style.backfaceVisibility = "";
          to.style.transformOrigin = "";
          (to.style as CSSStyleDeclaration & { contain: string }).contain = "";
          zoomedPage.style.zIndex = previousZIndex;
          if (fadeEnabled) restoreFadeTargets();
        },
      });

      const anims = [outAnim, inAnim];

      // One WebAnimation per fade target. They share the same physics so
      // progress is locked across all of them (and with the main zoom).
      for (const target of fadeTargets) {
        anims.push(
          new WebAnimation({
            element: target,
            integrator: IntegratorProvider.from(physicsOptions),
            style: (t, u) => ({
              opacity: resolved.mode === "enter" ? t : u,
            }),
          }),
        );
      }

      if (overlayConfig && overlay) {
        anims.push(
          new WebAnimation({
            element: overlay,
            integrator: IntegratorProvider.from(physicsOptions),
            style: (t) => overlayConfig.style(resolved.mode, t),
          }),
        );
      }

      return new MultiAnimation(anims, { mode: "parallel" });
    },
  };
};
