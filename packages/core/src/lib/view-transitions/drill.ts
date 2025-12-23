import type { PhysicsOptions, SggoiTransition, StyleObject } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const ENTER: PhysicsOptions = {
  spring: {
    stiffness: 170,
    damping: 22,
  },
};

const EXIT: PhysicsOptions = {
  spring: {
    stiffness: 170,
    damping: 22,
  },
};

interface DrillOptions {
  opacity?: boolean;
  direction?: "enter" | "exit";
  physics?: PhysicsOptions;
}

export const drill = (options: DrillOptions = {}): SggoiTransition => {
  const { opacity = false, direction = "enter" } = options;
  const physicsOptions =
    options.physics ?? (direction === "enter" ? ENTER : EXIT);

  if (direction === "enter") {
    return {
      in: (element) => ({
        physics: physicsOptions,

        prepare: () => {
          // GPU acceleration hints
          element.style.willChange = opacity
            ? "transform, opacity"
            : "transform";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
        },
        css: (progress): StyleObject => {
          const style: StyleObject = {
            transform: `translate3d(${(1 - progress) * 100}%, 0, 0)`,
          };
          if (opacity) {
            style.opacity = progress;
          }
          return style;
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
        prepare: (el) => {
          prepareOutgoing(el, context);
          el.style.zIndex = "-1";
          // GPU acceleration hints
          el.style.willChange = opacity ? "transform, opacity" : "transform";
          el.style.backfaceVisibility = "hidden";
          (el.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          el.style.pointerEvents = "none"; // prevent interaction during exit
        },
        css: (progress): StyleObject => {
          const style: StyleObject = {
            transform: `translate3d(${-(1 - progress) * 20}%, 0, 0)`,
          };
          if (opacity) {
            style.opacity = progress;
          }
          return style;
        },
      }),
    };
  } else {
    // direction === "exit"
    return {
      in: (element) => ({
        physics: physicsOptions,
        prepare: () => {
          // GPU acceleration hints
          element.style.willChange = opacity
            ? "transform, opacity"
            : "transform";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
        },
        css: (progress): StyleObject => {
          const style: StyleObject = {
            transform: `translate3d(${-(1 - progress) * 20}%, 0, 0)`,
          };
          if (opacity) {
            style.opacity = progress;
          }
          return style;
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
        prepare: (el) => {
          prepareOutgoing(el, context);
          el.style.zIndex = "100";
          // GPU acceleration hints
          el.style.willChange = opacity ? "transform, opacity" : "transform";
          el.style.backfaceVisibility = "hidden";
          (el.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          el.style.pointerEvents = "none";
        },
        css: (progress): StyleObject => {
          const style: StyleObject = {
            transform: `translate3d(${(1 - progress) * 100}%, 0, 0)`,
          };
          if (opacity) {
            style.opacity = progress;
          }
          return style;
        },
      }),
    };
  }
};
