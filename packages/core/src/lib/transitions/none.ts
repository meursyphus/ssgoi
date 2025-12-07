import type { StyleObject, TransitionKey } from "../types";

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
      css: (): StyleObject => ({}),
    }),
    out: () => ({
      spring,
      css: (): StyleObject => ({}),
    }),
    ...(key && { key }),
  };
};
