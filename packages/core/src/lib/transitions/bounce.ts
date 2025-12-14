import type { StyleObject, Transition, TransitionKey } from "../types";

interface BounceOptions {
  height?: number;
  intensity?: number;
  scale?: boolean;
  fade?: boolean;
  direction?: "up" | "down";
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const bounce = (options: BounceOptions = {}): Transition => {
  const {
    height = 20,
    intensity = 1,
    scale = true,
    fade = true,
    direction = "up",
    spring: springOption,
    key,
  } = options;

  const spring = {
    stiffness: springOption?.stiffness ?? 800,
    damping: springOption?.damping ?? 15,
  };

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
