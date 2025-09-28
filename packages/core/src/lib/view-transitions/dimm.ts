import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { sleep } from "../utils/sleep";

interface DimmOptions {
  inSpring?: SpringConfig;
  outSpring?: SpringConfig;
  transitionDelay?: number;
  color?: string;
  padding?: number;
}

let lastTriggerRect: DOMRect | null = null;

if (typeof document !== "undefined") {
  document.body.addEventListener(
    "mousedown",
    (e) => {
      if (e.target instanceof HTMLElement) {
        lastTriggerRect = e.target.getBoundingClientRect();
      }
    },
    { capture: true },
  );
}

export const dimm = (options: DimmOptions = {}): SggoiTransition => {
  const {
    inSpring = { stiffness: 80, damping: 20 },
    outSpring = { stiffness: 400, damping: 30 },
    transitionDelay = 20,
    padding = 20,
  } = options;

  return {
    out: (element, context) => {
      return {
        spring: inSpring, // Use same spring as `in` to sync duration
        prepare: () => {
          prepareOutgoing(element, context);
          element.style.zIndex = "0";
        },
        tick: (progress) => {
          // This is a dummy animation to keep the element from disappearing prematurely.
          // It remains visible throughout the transition.
          element.style.opacity = "1";
        },
        onEnd: () => {
          // Hide it completely at the very end.
          element.style.opacity = "0";
        },
      };
    },
    in: (element) => {
      let initialRadius = 0;
      let finalRadius = 0;
      let startX = 0;
      let startY = 0;

      return {
        spring: inSpring,
        prepare: () => {
          element.style.position = "absolute";
          element.style.left = "0";
          element.style.top = "0";
          element.style.width = "100%";
          element.style.height = "100%";
          element.style.zIndex = "1";
          element.style.opacity = "1";

          const triggerRect = lastTriggerRect;
          const parentRect = element.getBoundingClientRect();

          if (triggerRect) {
            const relativeLeft = triggerRect.left - parentRect.left;
            const relativeTop = triggerRect.top - parentRect.top;
            startX = relativeLeft + triggerRect.width / 2;
            startY = relativeTop + triggerRect.height / 2;
            initialRadius =
              Math.max(triggerRect.width, triggerRect.height) / 2 + padding;
          } else {
            startX = element.clientWidth / 2;
            startY = element.clientHeight / 2;
            initialRadius = 0;
          }
          lastTriggerRect = null;

          const cornerDistances = [
            Math.hypot(startX, startY),
            Math.hypot(element.clientWidth - startX, startY),
            Math.hypot(startX, element.clientHeight - startY),
            Math.hypot(
              element.clientWidth - startX,
              element.clientHeight - startY,
            ),
          ];
          finalRadius = Math.max(...cornerDistances);

          element.style.clipPath = `circle(${initialRadius}px at ${startX}px ${startY}px)`;
        },
        wait: async () => {
          await sleep(transitionDelay);
        },
        tick: (progress) => {
          const currentRadius =
            initialRadius + (finalRadius - initialRadius) * progress;
          element.style.clipPath = `circle(${currentRadius}px at ${startX}px ${startY}px)`;
        },
        onEnd: () => {
          element.style.clipPath = "";
        },
      };
    },
  };
};
