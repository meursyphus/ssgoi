import type { SpringConfig, SggoiTransition, StyleObject } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const ENTER_SPRING: SpringConfig = {
  stiffness: 125,
  damping: 14,
  doubleSpring: 0.5,
};

const EXIT_SPRING: SpringConfig = {
  stiffness: 128,
  damping: 14,
  doubleSpring: 0.5,
};

interface DrillOptions {
  opacity?: boolean;
  direction?: "enter" | "exit";
  spring?: Partial<SpringConfig>;
}

export const drill = (options: DrillOptions = {}): SggoiTransition => {
  const { opacity = false, direction = "enter" } = options;
  const defaultSpring = direction === "enter" ? ENTER_SPRING : EXIT_SPRING;
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? defaultSpring.stiffness,
    damping: options.spring?.damping ?? defaultSpring.damping,
    doubleSpring: options.spring?.doubleSpring ?? defaultSpring.doubleSpring,
  };

  if (direction === "enter") {
    return {
      in: (element) => ({
        physics: { spring },
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
        physics: { spring },
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
        physics: { spring },
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
        physics: { spring },
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
