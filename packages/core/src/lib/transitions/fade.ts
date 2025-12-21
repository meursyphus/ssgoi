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
  key?: TransitionKey;
} & PhysicsOptions;

export const fade = (options: FadeOptions = {}): Transition => {
  const { from = 0, to = 1, key } = options;
  const physics = getPhysics(options, {
    spring: { stiffness: 300, damping: 30 },
  });

  return {
    in: () => ({
      ...physics,
      css: (progress: number): StyleObject => ({
        opacity: from + (to - from) * progress,
      }),
    }),
    out: () => ({
      ...physics,
      css: (progress: number): StyleObject => ({
        opacity: from + (to - from) * progress,
      }),
    }),
    ...(key && { key }),
  };
};
