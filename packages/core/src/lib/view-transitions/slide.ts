import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils";

interface SlideOptions {
  direction?: "left" | "right";
  spring?: Partial<SpringConfig>;
}

const DEFAULT_SPRING: SpringConfig = {
  stiffness: 30,
  damping: 7,
};

export const slide = (options: SlideOptions = {}): SggoiTransition => {
  const direction = options.direction ?? "left";
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? DEFAULT_SPRING.stiffness,
    damping: options.spring?.damping ?? DEFAULT_SPRING.damping,
  };

  const isLeft = direction === "left";

  return {
    in: (element) => ({
      spring,
      tick: (progress) => {
        const translateX = isLeft
          ? (1 - progress) * 100 // 100 → 0
          : (1 - progress) * -100; // -100 → 0
        element.style.transform = `translateX(${translateX}%)`;
      },
    }),
    out: (element) => ({
      spring,
      tick: (progress) => {
        const translateX = isLeft
          ? (1 - progress) * -100 // 0 → -100
          : (1 - progress) * 100; // 0 → 100
        element.style.transform = `translateX(${translateX}%)`;
      },
      prepare: (element) => {
        prepareOutgoing(element);

        element.style.zIndex = isLeft ? "-1" : "1";
      },
    }),
  };
};