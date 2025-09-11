import type { TransitionKey } from "../types";

interface MaskOptions {
  shape?: "circle" | "ellipse" | "square";
  origin?:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  scale?: number;
  fade?: boolean;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const mask = (options: MaskOptions = {}) => {
  const {
    shape = "circle",
    origin = "center",
    scale = 1.5,
    fade = false,
    spring = { stiffness: 300, damping: 30 },
    key,
  } = options;

  const getOriginPosition = (): string => {
    switch (origin) {
      case "top":
        return "50% 0%";
      case "bottom":
        return "50% 100%";
      case "left":
        return "0% 50%";
      case "right":
        return "100% 50%";
      case "top-left":
        return "0% 0%";
      case "top-right":
        return "100% 0%";
      case "bottom-left":
        return "0% 100%";
      case "bottom-right":
        return "100% 100%";
      case "center":
      default:
        return "50% 50%";
    }
  };

  const getClipPath = (progress: number): string => {
    const size = progress * scale * 100;
    const position = getOriginPosition();

    switch (shape) {
      case "ellipse":
        return `ellipse(${size}% ${size * 0.75}% at ${position})`;
      case "square": {
        const squareSize = progress * scale * 100;
        const [x, y] = position.split(" ");
        const xVal = parseFloat(x!);
        const yVal = parseFloat(y!);
        const halfSize = squareSize / 2;
        return `polygon(${xVal - halfSize}% ${yVal - halfSize}%, ${
          xVal + halfSize
        }% ${yVal - halfSize}%, ${xVal + halfSize}% ${yVal + halfSize}%, ${
          xVal - halfSize
        }% ${yVal + halfSize}%)`;
      }
      case "circle":
      default:
        return `circle(${size}% at ${position})`;
    }
  };

  return {
    in: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        element.style.clipPath = getClipPath(progress);

        if (fade) {
          element.style.opacity = progress.toString();
        }
      },
    }),
    out: (element: HTMLElement) => ({
      spring,
      tick: (progress: number) => {
        element.style.clipPath = getClipPath(progress);

        if (fade) {
          element.style.opacity = progress.toString();
        }
      },
    }),
    ...(key && { key }),
  };
};
