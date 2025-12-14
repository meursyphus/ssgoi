import type { StyleObject, Transition, TransitionKey } from "../types";

interface ScaleOptions {
  start?: number;
  opacity?: number;
  axis?: "x" | "y" | "both";
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const scale = (options: ScaleOptions = {}): Transition => {
  const {
    start = 0,
    opacity = 0,
    axis = "both",
    spring: springOption,
    key,
  } = options;

  const spring = {
    stiffness: springOption?.stiffness ?? 300,
    damping: springOption?.damping ?? 30,
  };

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
