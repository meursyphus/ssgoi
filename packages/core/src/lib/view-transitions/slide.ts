import type { SpringConfig, SggoiTransition, StyleObject } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

interface SlideOptions {
  direction?: "left" | "right";
  spring?: Partial<SpringConfig>;
}

const DEFAULT_SPRING: SpringConfig = {
  stiffness: 15,
  damping: 7,
  doubleSpring: true,
};

export const slide = (options: SlideOptions = {}): SggoiTransition => {
  const direction = options.direction ?? "left";
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? DEFAULT_SPRING.stiffness,
    damping: options.spring?.damping ?? DEFAULT_SPRING.damping,
    doubleSpring: options.spring?.doubleSpring ?? DEFAULT_SPRING.doubleSpring,
  };

  const isLeft = direction === "left";

  return {
    in: (element) => ({
      spring,
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
      spring,
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
