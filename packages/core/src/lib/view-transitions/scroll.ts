import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

interface ScrollOptions {
  direction?: "up" | "down";
  spring?: Partial<SpringConfig>;
}

const DEFAULT_SPRING: SpringConfig = {
  stiffness: 30,
  damping: 7,
};

export const scroll = (options: ScrollOptions = {}): SggoiTransition => {
  const direction = options.direction ?? "up";
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? DEFAULT_SPRING.stiffness,
    damping: options.spring?.damping ?? DEFAULT_SPRING.damping,
  };

  const isUp = direction === "up";

  return {
    in: (element) => ({
      spring,
      tick: (progress) => {
        const translateY = isUp
          ? (1 - progress) * 100 // 100 → 0
          : (1 - progress) * -100; // -100 → 0
        element.style.transform = `translateY(${translateY}vh)`;
      },
    }),
    out: (element) => ({
      spring,
      tick: (progress) => {
        const translateY = isUp
          ? (1 - progress) * -100 // 0 → -100
          : (1 - progress) * 100; // 0 → 100
        element.style.transform = `translateY(${translateY}vh)`;
      },
      prepare: (element) => {
        prepareOutgoing(element);

        element.style.zIndex = isUp ? "-1" : "1";
      },
    }),
  };
};
