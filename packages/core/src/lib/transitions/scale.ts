import type {
  PhysicsOptions,
  StyleObject,
  Transition,
  TransitionKey,
} from "../types";
import { getPhysics } from "./utils";

type ScaleOptions = {
  start?: number;
  opacity?: number;
  axis?: "x" | "y" | "both";
  key?: TransitionKey;
} & PhysicsOptions;

export const scale = (options: ScaleOptions = {}): Transition => {
  const { start = 0, opacity = 0, axis = "both", key } = options;
  const physics = getPhysics(options, {
    spring: { stiffness: 300, damping: 30 },
  });

  const getScaleTransform = (value: number): string => {
    switch (axis) {
      case "x":
        return `scaleX(${value})`;
      case "y":
        return `scaleY(${value})`;
      case "both":
      default:
        return `scale(${value})`;
    }
  };

  const getCss = (progress: number): StyleObject => {
    const scaleValue = start + (1 - start) * progress;
    return {
      transform: getScaleTransform(scaleValue),
      opacity: opacity + (1 - opacity) * progress,
    };
  };

  return {
    in: () => ({ ...physics, css: getCss }),
    out: () => ({ ...physics, css: getCss }),
    ...(key && { key }),
  };
};
