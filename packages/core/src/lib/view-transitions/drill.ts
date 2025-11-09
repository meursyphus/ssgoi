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
          element.style.willChange = opacity
            ? "transform, opacity"
            : "transform";
        },
        tick: (progress) => {
          element.style.transform = `translateX(${(1 - progress) * 100}%)`;
          if (opacity) {
            // TODO: Apply opacity only to content, not the whole element
            element.style.opacity = progress.toString();
          }
        },
        onEnd: () => {
          element.style.willChange = "auto";
        },
      }),
      out: (element, context) => ({
        spring,
        prepare: (element) => {
          prepareOutgoing(element, context);
          element.style.zIndex = "-1";
          element.style.willChange = opacity
            ? "transform, opacity"
            : "transform";
        },
        tick: (progress) => {
          element.style.transform = `translateX(${-(1 - progress) * 20}%)`;
          if (opacity) {
            // TODO: Apply opacity only to content, not the whole element
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
          element.style.willChange = opacity
            ? "transform, opacity"
            : "transform";
        },
        tick: (progress) => {
          element.style.transform = `translateX(${-(1 - progress) * 20}%)`;
          if (opacity) {
            // TODO: Apply opacity only to content, not the whole element
            element.style.opacity = progress.toString();
          }
        },
        onEnd: () => {
          element.style.willChange = "auto";
        },
      }),
      out: (element, context) => ({
        spring,
        prepare: (element) => {
          prepareOutgoing(element, context);
          element.style.willChange = opacity
            ? "transform, opacity"
            : "transform";
          element.style.zIndex = "100";
        },
        tick: (progress) => {
          element.style.transform = `translateX(${(1 - progress) * 100}%)`;

          if (opacity) {
            // TODO: Apply opacity only to content, not the whole element
            element.style.opacity = progress.toString();
          }
        },
      }),
    };
  }
};
