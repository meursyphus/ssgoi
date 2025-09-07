import type { SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

export const film = (): SggoiTransition => {
  return {
    in: (element) => {
      return {
        spring: { stiffness: 200, damping: 20 },
        prepare: (element) => {
          element.style.transform = "rotateY(-90deg)";
          element.style.opacity = "0";
        },
        tick: (progress) => {
          const rotation = -90 + 90 * progress;
          element.style.transform = `rotateY(${rotation}deg)`;
          element.style.opacity = progress.toString();
        },
      };
    },
    out: (element) => {
      return {
        spring: { stiffness: 200, damping: 20 },
        prepare: prepareOutgoing,
        tick: (progress) => {
          const rotation = 90 * (1 - progress);
          element.style.transform = `rotateY(${rotation}deg)`;
          element.style.opacity = progress.toString();
        },
      };
    },
  };
};
