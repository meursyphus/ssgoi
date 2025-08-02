import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils";

interface ScrollOptions {
  direction?: "up" | "down";
  spring?: Partial<SpringConfig>;
}

export const scroll = (options: ScrollOptions = {}): SggoiTransition => {
  const direction = options.direction ?? "up";
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 300,
    damping: options.spring?.damping ?? 30,
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
