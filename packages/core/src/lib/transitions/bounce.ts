import type {
  PhysicsOptions,
  StyleObject,
  Transition,
  TransitionKey,
} from "../types";
import { getPhysics } from "./utils";

type BounceOptions = {
  height?: number;
  intensity?: number;
  scale?: boolean;
  fade?: boolean;
  direction?: "up" | "down";
  key?: TransitionKey;
} & PhysicsOptions;

export const bounce = (options: BounceOptions = {}): Transition => {
  const {
    height = 20,
    intensity = 1,
    scale = true,
    fade = true,
    direction = "up",
    key,
  } = options;
  const physics = getPhysics(options, {
    spring: { stiffness: 800, damping: 15 },
  });

  const getCss = (progress: number): StyleObject => {
    const style: StyleObject = {};
    const transforms: string[] = [];

    // Enhanced bounce effect with intensity control
    const bounceWave = Math.sin(progress * Math.PI * (1 + intensity));
    const dampening = 1 - progress;
    const bounceOffset = bounceWave * height * dampening;

    if (direction === "up") {
      transforms.push(`translateY(${-Math.abs(bounceOffset)}px)`);
    } else {
      transforms.push(`translateY(${Math.abs(bounceOffset)}px)`);
    }

    if (scale) {
      const scaleValue = 0.8 + progress * 0.2 + bounceWave * 0.05 * dampening;
      transforms.push(`scale(${scaleValue})`);
    }

    style.transform = transforms.join(" ");

    if (fade) {
      style.opacity = progress;
    }

    return style;
  };

  return {
    in: () => ({
      ...physics,
      css: getCss,
    }),
    out: () => ({
      ...physics,
      css: getCss,
    }),
    ...(key && { key }),
  };
};
