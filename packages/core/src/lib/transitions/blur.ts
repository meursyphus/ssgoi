import type {
  PhysicsOptions,
  StyleObject,
  Transition,
  TransitionKey,
} from "../types";
import { getPhysics } from "./utils";

type BlurOptions = {
  amount?: number | string;
  opacity?: number;
  scale?: boolean;
  fade?: boolean;
  physics?: PhysicsOptions;
  key?: TransitionKey;
};

export const blur = (options: BlurOptions = {}): Transition => {
  const { amount = 10, opacity = 0, scale = false, fade = true, key } = options;
  const physics = getPhysics(options.physics, {
    spring: { stiffness: 300, damping: 30 },
  });

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
    in: () => ({ physics, css: getCss }),
    out: () => ({ physics, css: getCss }),
    ...(key && { key }),
  };
};
