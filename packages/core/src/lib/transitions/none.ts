import type {
  SpringConfig,
  StyleObject,
  Transition,
  TransitionKey,
} from "../types";

interface NoneOptions {
  spring?: Partial<SpringConfig>;
  key?: TransitionKey;
}

export const none = (options: NoneOptions = {}): Transition => {
  const { spring: springOption, key } = options;

  const spring: SpringConfig = {
    stiffness: springOption?.stiffness ?? 1000,
    damping: springOption?.damping ?? 100,
    doubleSpring: springOption?.doubleSpring ?? false,
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
