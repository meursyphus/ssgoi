import type { PhysicsOptions, TransitionConfig } from "@types";
import { getViewportRect } from "@utils";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

// ease-out (Material decelerated): sheet rises and lands gracefully (incoming).
const ENTER: PhysicsOptions = {
  spring: { stiffness: 200, damping: 24 },
};

// ease-in (Material accelerated): sheet falls away (outgoing).
const EXIT: PhysicsOptions = {
  inertia: { acceleration: 25, resistance: 1.2 },
};

const DEFAULT_SCALE_OFFSET = 0.2;

export interface SheetOptions {
  direction?: "enter" | "exit";
  physics?: PhysicsOptions;
  scaleOffset?: number;
}

export const sheet = (options: SheetOptions = {}): TransitionConfig => {
  const { direction = "enter" } = options;
  const physicsOptions =
    options.physics ?? (direction === "enter" ? ENTER : EXIT);
  const scaleOffset = options.scaleOffset ?? DEFAULT_SCALE_OFFSET;

  return {
    prepare: ({ from, to }) => {
      from.then((el) => {
        el.style.willChange = "transform, opacity";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        el.style.pointerEvents = "none";
        el.style.zIndex = direction === "enter" ? "-1" : "100";
      });
      to.then((el) => {
        el.style.willChange = "transform, opacity";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
      });
      return {};
    },
    animation: ({ from, to, context }) => {
      const fromRect = getViewportRect(context, "from");
      const toRect = getViewportRect(context, "to");

      const fromCenterX = fromRect.left + fromRect.width / 2;
      const fromCenterY = fromRect.top + fromRect.height / 2;

      // Apply clip-paths sync so the sheet only shows its visible viewport
      // slice during transform.
      from.style.clipPath = `inset(${fromRect.top}px 0 calc(100% - ${fromRect.top + fromRect.height}px) 0)`;
      to.style.clipPath = `inset(${toRect.top}px 0 calc(100% - ${toRect.top + toRect.height}px) 0)`;

      if (direction === "enter") {
        from.style.transformOrigin = `${fromCenterX}px ${fromCenterY}px`;

        const outAnim = new WebAnimation({
          element: from,
          integrator: IntegratorProvider.from(physicsOptions),
          style: (t, u) => ({
            transform: `scale(${1 - scaleOffset * t})`,
            opacity: u,
          }),
        });

        const inAnim = new WebAnimation({
          element: to,
          integrator: IntegratorProvider.from(physicsOptions),
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
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t) => ({
          transform: `translate3d(0, ${t * fromRect.height}px, 0)`,
        }),
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t) => ({
          transform: `scale(${1 - scaleOffset + scaleOffset * t})`,
          opacity: t,
        }),
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
