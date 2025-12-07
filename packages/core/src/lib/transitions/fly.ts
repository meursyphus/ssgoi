import type { StyleObject, TransitionKey } from "../types";

interface FlyOptions {
  x?: number | string;
  y?: number | string;
  opacity?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const fly = (options: FlyOptions = {}) => {
  const {
    x = 0,
    y = -100,
    opacity = 0,
    spring = { stiffness: 400, damping: 35 },
    key,
  } = options;

  const getCss = (progress: number): StyleObject => {
    const multiplier = 1 - progress;

    let xOffset: string;
    let yOffset: string;

    if (typeof x === "number") {
      xOffset = `${multiplier * x}px`;
    } else {
      xOffset = `calc(${x} * ${multiplier})`;
    }

    if (typeof y === "number") {
      yOffset = `${multiplier * y}px`;
    } else {
      yOffset = `calc(${y} * ${multiplier})`;
    }

    return {
      transform: `translate3d(${xOffset}, ${yOffset}, 0)`,
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
