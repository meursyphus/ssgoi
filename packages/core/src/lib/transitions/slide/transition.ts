import type { SggoiTransition, StyleObject, PhysicsOptions } from "@types";
import { prepareOutgoing } from "@utils";

export interface SlideOptions {
  direction?: "left" | "right";
  physics?: PhysicsOptions;
}

// ease-out (Material decelerated): horizontal page push, incoming page settles in.
// 170/22 mirrors drill character; doubleSpring 0.8 softens both ends, ~330ms total.
const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 170,
    damping: 22,
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
    out: (element, context) => ({
      physics: physicsOptions,
      css: (progress): StyleObject => {
        const translateX = isLeft
          ? (1 - progress) * -100
          : (1 - progress) * 100;
        return {
          transform: `translate3d(${translateX}%, 0, 0)`,
        };
      },
      prepare: () => {
        prepareOutgoing(element, context);
        // GPU acceleration hints
        element.style.willChange = "transform";
        element.style.backfaceVisibility = "hidden";
        (element.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        element.style.pointerEvents = "none";
      },
    }),
  };
};
