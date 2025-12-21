import type { SggoiTransition, StyleObject, PhysicsOptions } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

interface SlideOptions {
  direction?: "left" | "right";
  physics?: PhysicsOptions;
}

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 140,
    damping: 19,
    doubleSpring: 0.8,
  },
};

export const slide = (options: SlideOptions = {}): SggoiTransition => {
  const direction = options.direction ?? "left";
  const physicsOptions: PhysicsOptions = options.physics ?? DEFAULT_PHYSICS;

  const isLeft = direction === "left";

  return {
    in: (element) => ({
      physics: physicsOptions,
      prepare: () => {
        // GPU acceleration hints
        element.style.willChange = "transform";
        element.style.backfaceVisibility = "hidden";
        (element.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
      },
      css: (progress): StyleObject => {
        const translateX = isLeft
          ? (1 - progress) * 100
          : (1 - progress) * -100;
        return {
          transform: `translate3d(${translateX}%, 0, 0)`,
        };
      },
      onEnd: () => {
        element.style.willChange = "auto";
        element.style.backfaceVisibility = "";
        (element.style as CSSStyleDeclaration & { contain: string }).contain =
          "";
      },
    }),
    out: (_element, context) => ({
      physics: physicsOptions,
      css: (progress): StyleObject => {
        const translateX = isLeft
          ? (1 - progress) * -100
          : (1 - progress) * 100;
        return {
          transform: `translate3d(${translateX}%, 0, 0)`,
        };
      },
      prepare: (el) => {
        prepareOutgoing(el, context);
        // GPU acceleration hints
        el.style.willChange = "transform";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        el.style.pointerEvents = "none";
      },
    }),
  };
};
