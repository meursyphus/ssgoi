import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils";

interface FadeOptions {
  spring?: Partial<SpringConfig>;
}

export const fade = (options: FadeOptions = {}): SggoiTransition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 300,
    damping: options.spring?.damping ?? 30,
  };

  return {
    in: (element) => ({
      spring,
      tick: (progress) => {
        element.style.opacity = progress.toString();
      },
    }),
    out: (element) => ({
      spring,
      tick: (progress) => {
        element.style.opacity = progress.toString();
      },
      prepare: prepareOutgoing,
    }),
  };
};
