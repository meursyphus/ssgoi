import type { TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";
import { DRILL_PROVIDERS } from "./provider";
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
  const direction = options.direction ?? "enter";
  const provider = DRILL_PROVIDERS[options.type ?? DEFAULT_TYPE];
  const physicsOptions = provider.physics;
  const config = provider.build(direction);

  return {
    prepare: ({ from, to }) => {
      from.then((el) => {
        applyStartStyle(el, config.out);
        el.style.pointerEvents = "none";
        el.style.zIndex = direction === "enter" ? "0" : "100";
      });
      to.then((el) => {
        applyStartStyle(el, config.in);
      });
      return {};
    },
    animation: ({ from, to }) => {
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
        },
      });

      return new MultiAnimation([outAnim, inAnim], { mode: "parallel" });
    },
  };
};
