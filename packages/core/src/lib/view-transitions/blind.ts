import type {
  SggoiTransition,
  MultiSpringConfig,
  StyleObject,
  PhysicsOptions,
} from "../types";
import { sleep } from "../utils";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const DEFAULT_OUT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 80, damping: 25 },
};
const DEFAULT_IN_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 75, damping: 25 },
};
const DEFAULT_TRANSITION_DELAY = 300;
const DEFAULT_BLIND_COUNT = 10;
const DEFAULT_DIRECTION = "horizontal" as const;
const DEFAULT_BLIND_COLOR = "#000000";

interface BlindOptions {
  physics?: PhysicsOptions;
  transitionDelay?: number;
  blindCount?: number;
  direction?: "horizontal" | "vertical";
  blindColor?: string;
}

export const blind = (options: BlindOptions = {}): SggoiTransition => {
  const {
    transitionDelay = DEFAULT_TRANSITION_DELAY,
    blindCount = DEFAULT_BLIND_COUNT,
    direction = DEFAULT_DIRECTION,
    blindColor = DEFAULT_BLIND_COLOR,
  } = options;

  const inPhysicsOptions: PhysicsOptions =
    options.physics ?? DEFAULT_IN_PHYSICS;
  const outPhysicsOptions: PhysicsOptions =
    options.physics ?? DEFAULT_OUT_PHYSICS;

  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;

  // Helper function to create blinds
  const createBlinds = (
    element: HTMLElement,
    initialState: "hidden" | "closed",
    transformOrigin: "left" | "right" = "left",
  ) => {
    // Ensure parent has position relative for absolute positioning
    const parentStyle = window.getComputedStyle(element);
    if (parentStyle.position === "static") {
      element.style.position = "relative";
    }

    const container = document.createElement("div");
    container.className = "blind-container";
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;

    const blinds: HTMLElement[] = [];
    for (let i = 0; i < blindCount; i++) {
      const blind = document.createElement("div");

      if (direction === "horizontal") {
        const blindHeight = 100 / blindCount;
        // Add 1px overlap by slightly increasing height
        const actualHeight = `calc(${blindHeight}% + 1px)`;
        blind.style.cssText = `
          position: absolute;
          top: ${blindHeight * i}%;
          left: 0;
          width: 100%;
          height: ${actualHeight};
          background: ${blindColor};
          transform: scaleX(${initialState === "hidden" ? 0 : 1});
          transform-origin: ${transformOrigin} center;
          will-change: transform;
        `;
      } else {
        const blindWidth = 100 / blindCount;
        // Add 1px overlap by slightly increasing width
        const actualWidth = `calc(${blindWidth}% + 1px)`;
        blind.style.cssText = `
          position: absolute;
          top: 0;
          left: ${blindWidth * i}%;
          width: ${actualWidth};
          height: 100%;
          background: ${blindColor};
          transform: scaleY(${initialState === "hidden" ? 0 : 1});
          transform-origin: ${
            transformOrigin === "left" ? "top" : "bottom"
          } center;
          will-change: transform;
        `;
      }

      blinds.push(blind);
      container.appendChild(blind);
    }

    element.appendChild(container);
    return { container, blinds };
  };

  return {
    out: (): MultiSpringConfig => {
      let blindsData: { container: HTMLElement; blinds: HTMLElement[] } | null =
        null;

      outAnimationComplete = new Promise((resolve) => {
        resolveOutAnimation = resolve;
      });

      // Style generator for CSS animation mode
      const style = (progress: number): StyleObject => {
        // OUT: progress goes 1 → 0, but blind should appear (0 → 1)
        const scale = 1 - progress;
        return {
          transform:
            direction === "horizontal"
              ? `scaleX(${scale})`
              : `scaleY(${scale})`,
        };
      };

      // Create SpringItem for each blind with CSS mode
      const springs = Array.from({ length: blindCount }, (_, index) => {
        return {
          physics: outPhysicsOptions,
          offset: 0.2,
          css: {
            // Use getter for lazy element access (evaluated after prepare)
            get element(): HTMLElement {
              return blindsData?.blinds[index] as HTMLElement;
            },
            style,
          },
        };
      });

      return {
        springs,
        schedule: "stagger",
        prepare: (element) => {
          prepareOutgoing(element);
          element.style.zIndex = "1000";

          // Create blinds starting from hidden state (will appear one by one)
          // OUT uses left origin - blinds expand from left to right
          blindsData = createBlinds(element, "hidden", "left");
        },
        onStart: () => {},
        onEnd: () => {
          // OUT element will be removed, taking blinds with it
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
        },
      };
    },
    in: (): MultiSpringConfig => {
      let blindsData: { container: HTMLElement; blinds: HTMLElement[] } | null =
        null;

      // Style generator for CSS animation mode
      const style = (progress: number): StyleObject => {
        // IN: progress goes 0 → 1, but blind should disappear (1 → 0)
        const scale = 1 - progress;
        return {
          transform:
            direction === "horizontal"
              ? `scaleX(${scale})`
              : `scaleY(${scale})`,
        };
      };

      // Create SpringItem for each blind with CSS mode
      const springs = Array.from({ length: blindCount }, (_, index) => {
        return {
          physics: inPhysicsOptions,
          offset: 0.2,
          css: {
            // Use getter for lazy element access (evaluated after prepare)
            get element(): HTMLElement {
              return blindsData?.blinds[index] as HTMLElement;
            },
            style,
          },
        };
      });

      return {
        springs,
        schedule: "stagger",
        prepare: (element) => {
          element.style.position = "relative";
          element.style.zIndex = "0";
          // Create blinds in closed state (fully covering the screen)
          // IN uses right origin - blinds collapse from right to left
          blindsData = createBlinds(element, "closed", "right");
        },
        onStart: () => {},
        wait: async () => {
          // Wait for OUT animation to complete
          if (outAnimationComplete) {
            await outAnimationComplete;
          }
          // Additional delay between OUT and IN
          await sleep(transitionDelay);
        },
        onEnd: () => {
          // Clean up blinds after animation completes
          if (blindsData && blindsData.container) {
            blindsData.container.remove();
          }
        },
      };
    },
  };
};
