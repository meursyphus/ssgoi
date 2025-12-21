import type { SggoiTransition, StyleObject } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const DEFAULT_SPRING = { stiffness: 100, damping: 30 };

export const rotate = (): SggoiTransition => {
  return {
    in: (element) => {
      return {
        physics: { spring: DEFAULT_SPRING },
        prepare: () => {
          element.style.opacity = "0";
          element.style.transform = "rotate(-180deg)";
          element.style.transformOrigin = "center center";
          element.style.willChange = "transform, opacity";
        },
        css: (progress): StyleObject => ({
          // -180deg → 0deg, show after 90deg (progress > 0.5)
          transform: `rotate(${(progress - 1) * 180}deg)`,
          opacity: progress > 0.5 ? 1 : 0,
        }),
        onEnd: () => {
          element.style.willChange = "auto";
          element.style.transform = "";
          element.style.transformOrigin = "";
          element.style.opacity = "";
        },
      };
    },
    out: (element, context) => {
      return {
        physics: { spring: DEFAULT_SPRING },
        prepare: () => {
          prepareOutgoing(element, context);
          element.style.transformOrigin = "center center";
          element.style.willChange = "transform, opacity";
        },
        css: (progress): StyleObject => ({
          // 0deg → 180deg, hide after 90deg (progress < 0.5)
          transform: `rotate(${(1 - progress) * 180}deg)`,
          opacity: progress > 0.5 ? 1 : 0,
        }),
        onEnd: () => {
          element.style.willChange = "auto";
        },
      };
    },
  };
};
