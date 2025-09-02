import type { TransitionKey } from "../types";

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

export const bounce = (options: BounceOptions = {}) => {
  const {
    height = 20,
    intensity = 1,
    scale = true,
    fade = true,
    direction = "up",
    spring = { stiffness: 800, damping: 15 },
    key,
  } = options;

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const transforms = [];

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
          const scaleValue =
            0.8 + progress * 0.2 + bounceWave * 0.05 * dampening;
          transforms.push(`scale(${scaleValue})`);
        }

        element.style.transform = transforms.join(" ");

        if (fade) {
          element.style.opacity = progress.toString();
        }
      },
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        const transforms = [];

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
          const scaleValue =
            0.8 + progress * 0.2 + bounceWave * 0.05 * dampening;
          transforms.push(`scale(${scaleValue})`);
        }

        element.style.transform = transforms.join(" ");

        if (fade) {
          element.style.opacity = progress.toString();
        }
      },
    }),
    ...(key && { key }),
  };
};
