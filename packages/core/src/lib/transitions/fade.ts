import type { StyleObject, Transition, TransitionKey } from "../types";

interface FadeOptions {
  from?: number;
  to?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const fade = (options: FadeOptions = {}): Transition => {
  const { from = 0, to = 1, spring: springOption, key } = options;

  const spring = {
    stiffness: springOption?.stiffness ?? 300,
    damping: springOption?.damping ?? 30,
  };

  return {
    in: () => ({
      spring,
      css: (progress: number): StyleObject => ({
        opacity: from + (to - from) * progress,
      }),
    }),
    out: () => ({
      spring,
      css: (progress: number): StyleObject => ({
        opacity: from + (to - from) * progress,
      }),
    }),
    ...(key && { key }),
  };
};
