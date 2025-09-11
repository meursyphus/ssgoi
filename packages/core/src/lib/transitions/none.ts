import type { TransitionKey } from "../types";

interface NoneOptions {
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const none = (options: NoneOptions = {}) => {
  const { spring = { stiffness: 1000, damping: 100 }, key } = options;

  return {
    in: () => ({
      spring,
      tick: () => {
        // No animation, just instantly show
      },
    }),
    out: () => ({
      spring,
      tick: () => {
        // No animation, just instantly hide
      },
    }),
    ...(key && { key }),
  };
};
