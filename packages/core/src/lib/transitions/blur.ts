import type {
  SpringConfig,
  StyleObject,
  Transition,
  TransitionKey,
} from "../types";

interface BlurOptions {
  amount?: number | string;
  opacity?: number;
  scale?: boolean;
  fade?: boolean;
  spring?: Partial<SpringConfig>;
  key?: TransitionKey;
}

export const blur = (options: BlurOptions = {}): Transition => {
  const {
    amount = 10,
    opacity = 0,
    scale = false,
    fade = true,
    spring: springOption,
    key,
  } = options;

  const spring: SpringConfig = {
    stiffness: springOption?.stiffness ?? 300,
    damping: springOption?.damping ?? 30,
    doubleSpring: springOption?.doubleSpring ?? false,
  };

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
