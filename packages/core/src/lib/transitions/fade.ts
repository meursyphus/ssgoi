import type { StyleObject, TransitionKey } from "../types";

interface FadeOptions {
  from?: number;
  to?: number;
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const fade = (options: FadeOptions = {}) => {
  const {
    from = 0,
    to = 1,
    spring = { stiffness: 300, damping: 30 },
    key,
  } = options;

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
