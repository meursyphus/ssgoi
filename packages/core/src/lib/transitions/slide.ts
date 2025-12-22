import type {
  PhysicsOptions,
  StyleObject,
  Transition,
  TransitionKey,
} from "../types";
import { getPhysics } from "./utils";

type SlideOptions = {
  direction?: "left" | "right" | "up" | "down";
  distance?: number | string;
  opacity?: number;
  fade?: boolean;
  axis?: "x" | "y";
  physics?: PhysicsOptions;
  key?: TransitionKey;
};

export const slide = (options: SlideOptions = {}): Transition => {
  const {
    direction,
    distance = 100,
    opacity = 0,
    fade = true,
    axis,
    key,
  } = options;
  const physics = getPhysics(options.physics, {
    spring: { stiffness: 400, damping: 35 },
  });

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
    in: () => ({ physics, css: getCss }),
    out: () => ({ physics, css: getCss }),
    ...(key && { key }),
  };
};
