import type {
  PhysicsOptions,
  StyleObject,
  Transition,
  TransitionKey,
} from "../types";
import { getPhysics } from "./utils";

type FadeOptions = {
  from?: number;
  to?: number;
  physics?: PhysicsOptions;
  key?: TransitionKey;
};

export const fade = (options: FadeOptions = {}): Transition => {
  const { from = 0, to = 1, key } = options;
  const physics = getPhysics(options.physics, {
    spring: { stiffness: 300, damping: 30 },
  });

  const getCss = (progress: number): StyleObject => ({
    opacity: from + (to - from) * progress,
  });

  const applyStyle = (element: HTMLElement, style: StyleObject): void => {
    for (const [k, value] of Object.entries(style)) {
      (element.style as unknown as Record<string, string>)[k] =
        typeof value === "number" ? String(value) : value;
    }
  };

  return {
    in: (element) => ({
      physics,
      css: getCss,
      update: (progress: number) => applyStyle(element, getCss(progress)),
    }),
    out: (element) => ({
      physics,
      css: getCss,
      update: (progress: number) => applyStyle(element, getCss(progress)),
    }),
    ...(key && { key }),
  };
};
