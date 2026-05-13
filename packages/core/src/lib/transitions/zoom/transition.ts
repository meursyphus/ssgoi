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

function getOutgoingZIndex(mode: "enter" | "exit"): string {
  return mode === "enter" ? "-1" : "100";
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
  };
}

export const zoom = (options: ZoomOptions): TransitionConfig => {
  const provider: ZoomProvider = ZOOM_PROVIDERS[options.type];
  const physicsOptions: PhysicsOptions = provider.physics;

  return {
    prepare: ({ from }) => {
      // Outgoing styling that doesn't depend on rect math.
      from.then((el) => {
        el.style.willChange = "transform, clip-path, opacity";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
      });
      return {};
    },
    animation: ({ from, to, context }) => {
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
      if (outConfig) {
        from.style.transformOrigin = outConfig.transformOrigin;
        from.style.zIndex = getOutgoingZIndex(resolved.mode);
      }

      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(physicsOptions),
        lowerBound: 0,
        upperBound: 1,
        style: (t) => outConfig.animate(t) as Record<string, string | number>,
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physicsOptions),
        lowerBound: 0,
        upperBound: 1,
        style: (t) => inConfig.animate(t) as Record<string, string | number>,
        onComplete: () => {
          to.style.willChange = "auto";
          to.style.backfaceVisibility = "";
          to.style.transformOrigin = "";
          (to.style as CSSStyleDeclaration & { contain: string }).contain = "";
        },
      });

      return new MultiAnimation([outAnim, inAnim], { mode: "parallel" });
    },
  };
};
