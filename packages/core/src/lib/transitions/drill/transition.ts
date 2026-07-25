import type { TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";
import { DRILL_PROVIDERS } from "./provider";
import { Z_BACKGROUND, Z_FOREGROUND } from "../stacking";
import type { DrillOptions, DrillSideConfig, DrillType } from "./types";

export type { DrillOptions, DrillType } from "./types";

const DEFAULT_TYPE: DrillType = "parallax";

function applyStartStyle(el: HTMLElement, side: DrillSideConfig): void {
  el.style.willChange = side.willChange;
  el.style.backfaceVisibility = "hidden";
  (el.style as CSSStyleDeclaration & { contain: string }).contain =
    "layout paint";
  for (const [key, value] of Object.entries(side.startStyle)) {
    (el.style as unknown as Record<string, string | number>)[key] = value;
  }
}

export const drill = (options: DrillOptions = {}): TransitionConfig => {
  const provider = DRILL_PROVIDERS[options.type ?? DEFAULT_TYPE];
  const physicsOptions = provider.physics;

  return {
    prepare: ({ from, to, context }) => {
      const direction = context.direction === "forward" ? "enter" : "exit";
      const config = provider.build(direction);
      // enter: incoming `to` covers outgoing `from`; exit reverses the stack.
      const fromZ = direction === "enter" ? Z_BACKGROUND : Z_FOREGROUND;
      const toZ = direction === "enter" ? Z_FOREGROUND : Z_BACKGROUND;
      from.then((el) => {
        applyStartStyle(el, config.out);
        el.style.pointerEvents = "none";
        el.style.zIndex = fromZ;
      });
      to.then((el) => {
        applyStartStyle(el, config.in);
        // `to` is in normal flow; promote it so its z-index takes effect and it
        // can stack above/below the out-of-flow `from`. Reset on complete.
        el.style.position = "relative";
        el.style.zIndex = toZ;
      });
      return {};
    },
    animation: ({ from, to, context }) => {
      const direction = context.direction === "forward" ? "enter" : "exit";
      const config = provider.build(direction);
      const toZ = direction === "enter" ? Z_FOREGROUND : Z_BACKGROUND;
      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t) => config.out.animate(t),
        // The outgoing node is the real, reused element (re-hidden on navigate),
        // so clear every inline style we set on it — mirroring the `to` cleanup,
        // plus the out-only `pointerEvents` / `zIndex`.
        onComplete: () => {
          from.style.willChange = "auto";
          from.style.backfaceVisibility = "";
          (from.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
          from.style.transform = "";
          from.style.opacity = "";
          from.style.pointerEvents = "";
          from.style.zIndex = "";
        },
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t) => config.in.animate(t),
        onComplete: () => {
          to.style.willChange = "auto";
          to.style.backfaceVisibility = "";
          (to.style as CSSStyleDeclaration & { contain: string }).contain = "";
          to.style.transform = "";
          to.style.opacity = "";
          // `to` is the surviving page; clear the stacking props prepare set on
          // it (unmount mode gives the persistent `to` node no other cleanup).
          // Guard: if a follow-up navigation already re-claimed this node (e.g.
          // as the next outgoing `from`, now position:absolute), leave its
          // fresh stacking intact instead of stripping it.
          if (to.style.position === "relative") to.style.position = "";
          if (to.style.zIndex === toZ) to.style.zIndex = "";
        },
      });

      // Drop each WAAPI forwards-fill once its own run settles, so the inline
      // resets above (not a lingering final frame) govern the resting visual —
      // mirrors the zoom transition. Without this a reused node (React
      // <Activity>) reappears holding its animated transform/opacity.
      for (const anim of [outAnim, inAnim]) {
        const prev = anim.onComplete;
        anim.onComplete = () => {
          prev?.();
          anim.releaseFill();
        };
      }

      return new MultiAnimation([outAnim, inAnim], { mode: "parallel" });
    },
  };
};
