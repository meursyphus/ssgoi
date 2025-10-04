import type {
  SpringConfig,
  SggoiTransition,
  SggoiTransitionContext,
} from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { sleep } from "../utils/sleep";

interface DimmOptions {
  inSpring?: SpringConfig;
  outSpring?: SpringConfig;
  transitionDelay?: number;
  padding?: number;
}

const DEFAULT_TRANSITION_DELAY = 30;
const DEFAULT_IN_SPRING = { stiffness: 80, damping: 20 };
const DEFAULT_OUT_SPRING = { stiffness: 300, damping: 30 };
const DEFAULT_PADDING = 10;

const getGeometry = (
  parent: HTMLElement,
  triggerRect: DOMRect | null,
  padding: number,
) => {
  const parentRect = parent.getBoundingClientRect();
  const clientWidth = parent.clientWidth;
  const clientHeight = parent.clientHeight;
  let startX: number, startY: number, initialRadius: number;

  if (triggerRect) {
    const relativeLeft = triggerRect.left - parentRect.left;
    const relativeTop = triggerRect.top - parentRect.top;
    startX = relativeLeft + triggerRect.width / 2;
    startY = relativeTop + triggerRect.height / 2;
    initialRadius =
      Math.max(triggerRect.width, triggerRect.height) / 2 + padding;
  } else {
    startX = clientWidth / 2;
    startY = clientHeight / 2;
    initialRadius = 0;
  }

  const cornerDistances = [
    Math.hypot(startX, startY),
    Math.hypot(clientWidth - startX, startY),
    Math.hypot(startX, clientHeight - startY),
    Math.hypot(clientWidth - startX, clientHeight - startY),
  ];
  const finalRadius = Math.max(...cornerDistances);

  return {
    initialRadius,
    finalRadius,
    startX,
    startY,
    clientWidth,
    clientHeight,
  };
};

export const dimm = ({
  inSpring = DEFAULT_IN_SPRING,
  outSpring = DEFAULT_OUT_SPRING,
  transitionDelay = DEFAULT_TRANSITION_DELAY,
  padding = DEFAULT_PADDING,
}: DimmOptions = {}): SggoiTransition => {
  // Shared promise for coordinating OUT and IN animations
  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;
  // register event
  let triggerDomRect: DOMRect | null = null;

  const bindTriggerTransitionRect = (context: SggoiTransitionContext) => {
    triggerDomRect =
      triggerDomRect ?? context.triggerElement?.getBoundingClientRect() ?? null;
  };

  return {
    in: (element, context) => {
      return {
        spring: inSpring,
        prepare: () => {
          prepareOutgoing(element, context);
          bindTriggerTransitionRect(context);
          element.style.position = "absolute";
          element.style.left = "0";
          element.style.top = "0";
          element.style.width = "100%";
          element.style.height = "100%";
          console.log("in prepare", context.triggerElement);
          const { startX, startY, initialRadius } = getGeometry(
            element,
            triggerDomRect,
            padding,
          );
          const clipPath = `circle(${initialRadius}px at ${startX}px ${startY}px)`;
          element.style.clipPath = clipPath;
        },
        wait: async () => {
          // Wait for OUT animation to complete if it exists
          if (outAnimationComplete) {
            await outAnimationComplete;
            // Configurable delay after OUT completes
            await sleep(transitionDelay);
          }
        },
        tick: (progress) => {
          const { initialRadius, finalRadius, startX, startY } = getGeometry(
            element,
            triggerDomRect,
            padding,
          );
          const currentRadius =
            initialRadius + (finalRadius - initialRadius) * progress;
          const clipPath = `circle(${currentRadius}px at ${startX}px ${startY}px)`;
          element.style.clipPath = clipPath;
        },
        onEnd: () => {
          element.style.clipPath = "";
        },
      };
    },
    out: (element, context) => {
      // Create promise for OUT animation completion
      outAnimationComplete = new Promise((resolve) => {
        resolveOutAnimation = resolve;
      });

      return {
        spring: outSpring,
        prepare: () => {
          prepareOutgoing(element, context);
          bindTriggerTransitionRect(context);
          element.style.position = "absolute";
          element.style.left = "0";
          element.style.top = "0";
          element.style.width = "100%";
          element.style.height = "100%";
          element.style.opacity = "0";
        },
        tick: (progress) => {
          element.style.opacity = progress.toString();
        },
        onEnd: () => {
          element.style.opacity = "1";
          // Resolve the promise when OUT animation completes
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
        },
      };
    },
  };
};
