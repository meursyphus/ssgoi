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

  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;

  return {
    out: (element, context) => {
      outAnimationComplete = new Promise<void>((resolve) => {
        resolveOutAnimation = resolve;
      });

      return {
        spring: outSpring,
        prepare: () => {
          prepareOutgoing(element, context);
          element.style.zIndex = "1";
        },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        },
        onEnd: () => {
          element.style.opacity = "0";
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
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
          element.style.zIndex = "0";
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
          if (outAnimationComplete) {
            await outAnimationComplete;
          }
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
