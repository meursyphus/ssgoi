import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const ENTER_SPRING: SpringConfig = {
  stiffness: 150,
  damping: 20,
};

const EXIT_SPRING: SpringConfig = {
  stiffness: 100,
  damping: 20,
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
  };

  if (direction === "enter") {
    return {
      in: (element) => ({
        spring,
        prepare: () => {
          // GPU acceleration hints
          element.style.willChange = opacity
            ? "transform, opacity"
            : "transform";
          element.style.backfaceVisibility = "hidden";
          element.style.perspective = "1000px";
          element.style.transformStyle = "preserve-3d";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
        },
        tick: (progress) => {
          // translate3d forces GPU layer
          element.style.transform = `translate3d(${(1 - progress) * 100}%, 0, 0)`;
          if (opacity) {
            element.style.opacity = progress.toString();
          }
        },
        onEnd: () => {
          element.style.willChange = "auto";
          element.style.backfaceVisibility = "";
          element.style.perspective = "";
          element.style.transformStyle = "";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
        },
      }),
      out: (element, context) => ({
        spring,
        prepare: (element) => {
          prepareOutgoing(element, context);
          element.style.zIndex = "-1";
          // GPU acceleration hints
          element.style.willChange = opacity
            ? "transform, opacity"
            : "transform";
          element.style.backfaceVisibility = "hidden";
          element.style.perspective = "1000px";
          element.style.transformStyle = "preserve-3d";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          element.style.pointerEvents = "none"; // prevent interaction during exit
        },
        tick: (progress) => {
          element.style.transform = `translate3d(${-(1 - progress) * 20}%, 0, 0)`;
          if (opacity) {
            element.style.opacity = progress.toString();
          }
        },
      }),
    };
  } else {
    // direction === "exit"
    return {
      in: (element) => ({
        spring,
        prepare: () => {
          // GPU acceleration hints
          element.style.willChange = opacity
            ? "transform, opacity"
            : "transform";
          element.style.backfaceVisibility = "hidden";
          element.style.perspective = "1000px";
          element.style.transformStyle = "preserve-3d";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
        },
        tick: (progress) => {
          element.style.transform = `translate3d(${-(1 - progress) * 20}%, 0, 0)`;
          if (opacity) {
            element.style.opacity = progress.toString();
          }
        },
        onEnd: () => {
          element.style.willChange = "auto";
          element.style.backfaceVisibility = "";
          element.style.perspective = "";
          element.style.transformStyle = "";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
        },
      }),
      out: (element, context) => ({
        spring,
        prepare: (element) => {
          prepareOutgoing(element, context);
          element.style.zIndex = "100";
          // GPU acceleration hints
          element.style.willChange = opacity
            ? "transform, opacity"
            : "transform";
          element.style.backfaceVisibility = "hidden";
          element.style.perspective = "1000px";
          element.style.transformStyle = "preserve-3d";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          element.style.pointerEvents = "none";
        },
        tick: (progress) => {
          element.style.transform = `translate3d(${(1 - progress) * 100}%, 0, 0)`;
          if (opacity) {
            element.style.opacity = progress.toString();
          }
        },
      }),
    };
  }
};
