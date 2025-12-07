import type { StyleObject, TransitionKey } from "../types";

interface BlurOptions {
  amount?: number | string;
  opacity?: number;
  scale?: boolean;
  fade?: boolean;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const blur = (options: BlurOptions = {}) => {
  const {
    amount = 10,
    opacity = 0,
    scale = false,
    fade = true,
    spring = { stiffness: 300, damping: 30 },
    key,
  } = options;

  const getCss = (progress: number): StyleObject => {
    const blurMultiplier = 1 - progress;
    const style: StyleObject = {};

    if (typeof amount === "number") {
      style.filter = `blur(${blurMultiplier * amount}px)`;
    } else {
      style.filter = `blur(calc(${amount} * ${blurMultiplier}))`;
    }

    if (scale) {
      style.transform = `scale(${0.8 + progress * 0.2})`;
    }

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
