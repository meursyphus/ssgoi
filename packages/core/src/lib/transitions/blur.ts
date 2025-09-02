import type { TransitionKey } from "../types";

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

  const getBlurAmount = (value: number | string): string => {
    return typeof value === "number" ? `${value}px` : value;
  };

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const blurMultiplier = 1 - progress;
        const blurValue =
          typeof amount === "number"
            ? blurMultiplier * amount
            : `calc(${getBlurAmount(amount)} * ${blurMultiplier})`;

        element.style.filter =
          typeof amount === "number"
            ? `blur(${blurValue}px)`
            : `blur(${blurValue})`;

        if (scale) {
          element.style.transform = `scale(${0.8 + progress * 0.2})`;
        }

        if (fade) {
          element.style.opacity = (
            opacity +
            (1 - opacity) * progress
          ).toString();
        }
      },
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const blurMultiplier = 1 - progress;
        const blurValue =
          typeof amount === "number"
            ? blurMultiplier * amount
            : `calc(${getBlurAmount(amount)} * ${blurMultiplier})`;

        element.style.filter =
          typeof amount === "number"
            ? `blur(${blurValue}px)`
            : `blur(${blurValue})`;

        if (scale) {
          element.style.transform = `scale(${0.8 + progress * 0.2})`;
        }

        if (fade) {
          element.style.opacity = (
            opacity +
            (1 - opacity) * progress
          ).toString();
        }
      },
    }),
    ...(key && { key }),
  };
};
