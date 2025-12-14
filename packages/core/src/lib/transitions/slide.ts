import type { StyleObject, Transition, TransitionKey } from "../types";

interface SlideOptions {
  direction?: "left" | "right" | "up" | "down";
  distance?: number | string;
  opacity?: number;
  fade?: boolean;
  axis?: "x" | "y";
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const slide = (options: SlideOptions = {}): Transition => {
  const {
    direction,
    distance = 100,
    opacity = 0,
    fade = true,
    axis,
    spring: springOption,
    key,
  } = options;

  const spring = {
    stiffness: springOption?.stiffness ?? 400,
    damping: springOption?.damping ?? 35,
  };

  // Determine actual direction based on axis parameter
  const getActualDirection = (): "left" | "right" | "up" | "down" => {
    if (direction) return direction;
    if (axis === "x") return "left";
    if (axis === "y") return "up";
    return "left";
  };

  const actualDirection = getActualDirection();

  const getTransform = (progress: number): string => {
    const multiplier = 1 - progress;

    if (typeof distance === "number") {
      const offset = multiplier * distance;
      switch (actualDirection) {
        case "left":
          return `translate3d(${-offset}px, 0, 0)`;
        case "right":
          return `translate3d(${offset}px, 0, 0)`;
        case "up":
          return `translate3d(0, ${-offset}px, 0)`;
        case "down":
          return `translate3d(0, ${offset}px, 0)`;
      }
    } else {
      switch (actualDirection) {
        case "left":
          return `translate3d(calc(-1 * ${distance} * ${multiplier}), 0, 0)`;
        case "right":
          return `translate3d(calc(${distance} * ${multiplier}), 0, 0)`;
        case "up":
          return `translate3d(0, calc(-1 * ${distance} * ${multiplier}), 0)`;
        case "down":
          return `translate3d(0, calc(${distance} * ${multiplier}), 0)`;
      }
    }
  };

  const getCss = (progress: number): StyleObject => {
    const style: StyleObject = {
      transform: getTransform(progress),
    };
    if (fade) {
      style.opacity = opacity + (1 - opacity) * progress;
    }
    return style;
  };

  return {
    in: () => ({
      spring,
      css: getCss,
    }),
    out: () => ({
      spring,
      css: getCss,
    }),
    ...(key && { key }),
  };
};
