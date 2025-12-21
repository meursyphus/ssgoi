import type {
  PhysicsOptions,
  StyleObject,
  Transition,
  TransitionKey,
} from "../types";
import { getPhysics } from "./utils";

type RotateOptions = {
  degrees?: number;
  clockwise?: boolean;
  scale?: boolean;
  fade?: boolean;
  origin?: string;
  axis?: "2d" | "x" | "y" | "z";
  perspective?: number;
  key?: TransitionKey;
} & PhysicsOptions;

export const rotate = (options: RotateOptions = {}): Transition => {
  const {
    degrees = 360,
    clockwise = true,
    scale = false,
    fade = true,
    origin = "center",
    axis = "2d",
    perspective = 800,
    key,
  } = options;
  const physics = getPhysics(options, {
    spring: { stiffness: 500, damping: 25 },
  });

  const rotation = clockwise ? degrees : -degrees;

  const getRotateTransform = (progress: number): string => {
    const angle = (1 - progress) * rotation;
    switch (axis) {
      case "x":
        return `perspective(${perspective}px) rotateX(${angle}deg)`;
      case "y":
        return `perspective(${perspective}px) rotateY(${angle}deg)`;
      case "z":
        return `rotateZ(${angle}deg)`;
      case "2d":
      default:
        return `rotate(${angle}deg)`;
    }
  };

  const getCss = (progress: number): StyleObject => {
    const style: StyleObject = {};
    const transforms = [getRotateTransform(progress)];

    if (scale) {
      transforms.push(`scale(${progress})`);
    }

    style.transform = transforms.join(" ");
    style.transformOrigin = origin;

    if (fade) {
      style.opacity = progress;
    }

    return style;
  };

  return {
    in: () => ({ ...physics, css: getCss }),
    out: () => ({ ...physics, css: getCss }),
    ...(key && { key }),
  };
};
