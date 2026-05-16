import type { TransitionConfig } from "@types";
import { getViewportRect } from "@utils";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";
import { SHEET_PROVIDERS } from "./provider";
import type { SheetOptions, SheetType } from "./types";

export type { SheetOptions, SheetType } from "./types";

const DEFAULT_TYPE: SheetType = "static";
const SHEET_WILL_CHANGE = "transform";

export const sheet = (options: SheetOptions = {}): TransitionConfig => {
  const direction = options.direction ?? "enter";
  const provider = SHEET_PROVIDERS[options.type ?? DEFAULT_TYPE];
  const physics =
    direction === "enter" ? provider.enterPhysics : provider.exitPhysics;
  const bg = provider.background;
  const bgWillChange = bg.willChange || "auto";

  return {
    prepare: ({ from, to }) => {
      from.then((el) => {
        el.style.willChange =
          direction === "enter" ? bgWillChange : SHEET_WILL_CHANGE;
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        el.style.pointerEvents = "none";
        el.style.zIndex = direction === "enter" ? "-1" : "100";
      });
      to.then((el) => {
        el.style.willChange =
          direction === "enter" ? SHEET_WILL_CHANGE : bgWillChange;
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
      });
      return {};
    },
    animation: ({ from, to, context }) => {
      const fromRect = getViewportRect(context, "from");
      const toRect = getViewportRect(context, "to");

      // Clip each page to its visible viewport slice during transform.
      from.style.clipPath = `inset(${fromRect.top}px 0 calc(100% - ${fromRect.top + fromRect.height}px) 0)`;
      to.style.clipPath = `inset(${toRect.top}px 0 calc(100% - ${toRect.top + toRect.height}px) 0)`;

      if (direction === "enter") {
        const fromCenterX = fromRect.left + fromRect.width / 2;
        const fromCenterY = fromRect.top + fromRect.height / 2;
        from.style.transformOrigin = `${fromCenterX}px ${fromCenterY}px`;

        const outAnim = new WebAnimation({
          element: from,
          integrator: IntegratorProvider.from(physics),
          style: (t, u) => bg.enterStyle(t, u),
        });

        const inAnim = new WebAnimation({
          element: to,
          integrator: IntegratorProvider.from(physics),
          style: (_t, u) => ({
            transform: `translate3d(0, ${u * toRect.height}px, 0)`,
          }),
          onComplete: () => {
            to.style.willChange = "auto";
            to.style.backfaceVisibility = "";
            (to.style as CSSStyleDeclaration & { contain: string }).contain =
              "";
            to.style.clipPath = "";
            to.style.transform = "";
          },
        });

        return new MultiAnimation([outAnim, inAnim], { mode: "parallel" });
      }

      // direction === "exit"
      const toCenterX = toRect.left + toRect.width / 2;
      const toCenterY = toRect.top + toRect.height / 2;
      to.style.transformOrigin = `${toCenterX}px ${toCenterY}px`;

      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(physics),
        style: (t) => ({
          transform: `translate3d(0, ${t * fromRect.height}px, 0)`,
        }),
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physics),
        style: (t) => bg.exitStyle(t),
        onComplete: () => {
          to.style.willChange = "auto";
          to.style.backfaceVisibility = "";
          (to.style as CSSStyleDeclaration & { contain: string }).contain = "";
          to.style.transformOrigin = "";
          to.style.clipPath = "";
        },
      });

      return new MultiAnimation([outAnim, inAnim], { mode: "parallel" });
    },
  };
};
