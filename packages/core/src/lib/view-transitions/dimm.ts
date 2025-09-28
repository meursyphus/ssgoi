import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";

interface DimmOptions {
  spring?: SpringConfig;
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
  let isTransitioning = false;

  const { spring = { stiffness: 80, damping: 20 }, padding = 20 } = options;

  let geometry: {
    initialRadius: number;
    finalRadius: number;
    startX: number;
    startY: number;
    clientWidth: number;
    clientHeight: number;
  } | null = null;

  const getGeometry = (element: HTMLElement) => {
    if (geometry) return geometry;

    const triggerRect = lastTriggerRect;
    const parentRect = element.getBoundingClientRect();
    const clientWidth = element.clientWidth;
    const clientHeight = element.clientHeight;
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
    lastTriggerRect = null;

    const cornerDistances = [
      Math.hypot(startX, startY),
      Math.hypot(clientWidth - startX, startY),
      Math.hypot(startX, clientHeight - startY),
      Math.hypot(clientWidth - startX, clientHeight - startY),
    ];
    const finalRadius = Math.max(...cornerDistances);

    geometry = {
      initialRadius,
      finalRadius,
      startX,
      startY,
      clientWidth,
      clientHeight,
    };
    return geometry;
  };

  return {
    out: (element, context) => {
      if (isTransitioning) {
        return {
          prepare: () => {
            prepareOutgoing(element, context);
            element.style.opacity = "0";
          },
        };
      }
      isTransitioning = true;
      geometry = null;

      return {
        spring,
        prepare: () => {
          prepareOutgoing(element, context);
          element.style.zIndex = "1";
          const { clientWidth, clientHeight, startX, startY, initialRadius } =
            getGeometry(element);
          const clipPath = `path(evenodd, "M 0 0 H ${clientWidth} V ${clientHeight} H 0 Z M ${startX - initialRadius} ${startY} a ${initialRadius} ${initialRadius} 0 1 0 ${initialRadius * 2} 0 a ${initialRadius} ${initialRadius} 0 1 0 -${initialRadius * 2} 0")`;
          element.style.clipPath = clipPath;
        },
        tick: (progress) => {
          if (!geometry) return;
          const {
            initialRadius,
            finalRadius,
            startX,
            startY,
            clientWidth,
            clientHeight,
          } = geometry;
          const currentRadius =
            initialRadius + (finalRadius - initialRadius) * progress;
          const clipPath = `path(evenodd, "M 0 0 H ${clientWidth} V ${clientHeight} H 0 Z M ${startX - currentRadius} ${startY} a ${currentRadius} ${currentRadius} 0 1 0 ${currentRadius * 2} 0 a ${currentRadius} ${currentRadius} 0 1 0 -${currentRadius * 2} 0")`;
          element.style.clipPath = clipPath;
        },
        onEnd: () => {
          element.style.clipPath = "";
          element.style.opacity = "0";
        },
      };
    },
    in: (element) => {
      return {
        spring,
        prepare: () => {
          element.style.zIndex = "0";
          element.style.position = "absolute";
          element.style.left = "0";
          element.style.top = "0";
          element.style.width = "100%";
          element.style.height = "100%";
          const { startX, startY, initialRadius } = getGeometry(element);
          const clipPath = `circle(${initialRadius}px at ${startX}px ${startY}px)`;
          element.style.clipPath = clipPath;
        },
        tick: (progress) => {
          if (!geometry) return;
          const { initialRadius, finalRadius, startX, startY } = geometry;
          const currentRadius =
            initialRadius + (finalRadius - initialRadius) * progress;
          const clipPath = `circle(${currentRadius}px at ${startX}px ${startY}px)`;
          element.style.clipPath = clipPath;
        },
        onEnd: () => {
          element.style.clipPath = "";
          isTransitioning = false;
        },
      };
    },
  };
};
