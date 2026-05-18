import type { TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";
import { resolveAxisProvider } from "./provider";
import type { AxisFeel, AxisOptions, AxisSideConfig, AxisType } from "./types";

export type { AxisFeel, AxisOptions, AxisType } from "./types";

const DEFAULT_TYPE: AxisType = "x";
const DEFAULT_FEEL: AxisFeel = "snappy";

function applyStartStyle(el: HTMLElement, side: AxisSideConfig): void {
  el.style.willChange = side.willChange;
  el.style.backfaceVisibility = "hidden";
  (el.style as CSSStyleDeclaration & { contain: string }).contain =
    "layout paint";
  for (const [key, value] of Object.entries(side.startStyle)) {
    (el.style as unknown as Record<string, string | number>)[key] = value;
  }
}

function clearStyle(el: HTMLElement): void {
  el.style.willChange = "auto";
  el.style.backfaceVisibility = "";
  (el.style as CSSStyleDeclaration & { contain: string }).contain = "";
  el.style.transform = "";
  el.style.opacity = "";
}

export const axis = (options: AxisOptions = {}): TransitionConfig => {
  const direction = options.direction ?? "forward";
  const type = options.type ?? DEFAULT_TYPE;
  const feel = options.feel ?? DEFAULT_FEEL;
  const provider = resolveAxisProvider(type, feel);
  const config = provider.build({ direction });

  return {
    prepare: ({ from, to }) => {
      from.then((el) => {
        applyStartStyle(el, config.out);
        el.style.pointerEvents = "none";
      });
      to.then((el) => {
        applyStartStyle(el, config.in);
      });
      return {};
    },
    animation: ({ from, to }) => {
      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(provider.outPhysics),
        style: (t) => config.out.animate(t),
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(provider.inPhysics),
        style: (t) => config.in.animate(t),
        onComplete: () => clearStyle(to),
      });

      // Composition (mode / startAt overlap) is decided by the provider —
      // x, y, z have meaningfully different timings, so this file just
      // forwards what the provider gives us.
      return new MultiAnimation([outAnim, inAnim], provider.composition);
    },
  };
};
