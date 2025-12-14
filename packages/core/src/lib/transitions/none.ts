import type { StyleObject, Transition, TransitionKey } from "../types";

interface NoneOptions {
  spring?: {
    stiffness?: number;
    damping?: number;
  };
  key?: TransitionKey;
}

export const none = (options: NoneOptions = {}): Transition => {
  const { spring: springOption, key } = options;

  const spring = {
    stiffness: springOption?.stiffness ?? 1000,
    damping: springOption?.damping ?? 100,
  };

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
