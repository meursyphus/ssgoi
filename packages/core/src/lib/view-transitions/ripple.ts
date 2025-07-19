import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "./utils";

interface RippleOptions {
  spring?: Partial<SpringConfig>;
}

function getOffset(element: Element) {
  const rect = element.getBoundingClientRect();
  const totalHeight = element.clientHeight;
  const visibleHeight = window.innerHeight - rect.top;
  const offset = (50 * visibleHeight) / totalHeight;

  return Math.min(Math.max(offset, 0), 100);
}

export const ripple = (options: RippleOptions = {}): SggoiTransition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 300,
    damping: options.spring?.damping ?? 200,
  };

  return {
    in: (element) => {
      const offset = getOffset(element);
      return {
        spring,
        tick: (progress) => {
          element.style.clipPath = `circle(${progress * 100}% at 50% ${offset}%)`;
        },
      };
    },
    out: (element) => {
      const offset = getOffset(element);
      return {
        spring,
        tick: (progress) => {
          element.style.clipPath = `circle(${progress * 100}% at 50% ${offset}%)`;
          element.style.zIndex = "100";
        },
        prepare: prepareOutgoing,
      };
    },
  };
};
