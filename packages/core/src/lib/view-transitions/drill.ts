import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

interface DrillOptions {
  opacity?: boolean;
  direction?: "enter" | "exit";
  spring?: Partial<SpringConfig>;
}

export const drill = (options: DrillOptions = {}): SggoiTransition => {
  const { opacity = false, direction = "enter" } = options;
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 150,
    damping: options.spring?.damping ?? 20,
  };

  if (direction === "enter") {
    return {
      in: (element) => ({
        spring,
        tick: (progress) => {
          element.style.transform = `translateX(${(1 - progress) * 100}%)`;
          if (opacity) {
            // TODO: Apply opacity only to content, not the whole element
            element.style.opacity = progress.toString();
          }
        },
      }),
      out: (element, context) => ({
        spring,
        prepare: (element) => {
          prepareOutgoing(element, context);
          element.style.zIndex = "-1";
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
        spring: {
          stiffness: 100,
          damping: 20,
        },
        tick: (progress) => {
          element.style.transform = `translateX(${-(1 - progress) * 20}%)`;
          if (opacity) {
            // TODO: Apply opacity only to content, not the whole element
            element.style.opacity = progress.toString();
          }
        },
      }),
      out: (element, context) => ({
        spring: {
          stiffness: 100,
          damping: 20,
        },
        prepare: (element) => {
          prepareOutgoing(element, context);
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
