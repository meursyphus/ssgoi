import type {
  SpringConfig,
  SggoiTransition,
  MultiSpringConfig,
} from "../types";
import { sleep } from "../utils";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const DEFAULT_OUT_SPRING = { stiffness: 80, damping: 25 };
const DEFAULT_IN_SPRING = { stiffness: 75, damping: 25 };
const DEFAULT_TRANSITION_DELAY = 300;
const DEFAULT_BLIND_COUNT = 10;
const DEFAULT_DIRECTION = "horizontal" as const;
const DEFAULT_BLIND_COLOR = "#000000";

interface BlindOptions {
  inSpring?: SpringConfig;
  outSpring?: SpringConfig;
  transitionDelay?: number;
  blindCount?: number;
  direction?: "horizontal" | "vertical";
  /**
   * Progress threshold (0-1) at which each subsequent blind starts
   * - 0: All blinds start simultaneously (overlap)
   * - 0.2: Each blind starts when previous reaches 20% progress
   * - 1: Each blind waits for previous to complete (sequential)
   * @default 0.15
   */
  staggerProgress?: number;
  blindColor?: string;
}

export const blind = (options: BlindOptions = {}): SggoiTransition => {
  const {
    inSpring = DEFAULT_IN_SPRING,
    outSpring = DEFAULT_OUT_SPRING,
    transitionDelay = DEFAULT_TRANSITION_DELAY,
    blindCount = DEFAULT_BLIND_COUNT,
    direction = DEFAULT_DIRECTION,
    staggerProgress = 0.15,
    blindColor = DEFAULT_BLIND_COLOR,
  } = options;

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

      // Create SpringItem for each blind
      const springs = Array.from({ length: blindCount }, (_, index) => {
        return {
          from: 0,
          to: 1,
          spring: outSpring,
          // First blind triggers immediately, others trigger when previous passes staggerProgress
          triggerAt: index === 0 ? 0 : staggerProgress,
          tick: (progress: number) => {
            if (!blindsData) return;
            const blind = blindsData.blinds[index];
            if (!blind) return;

            // OUT: progress goes 0 → 1 (blind appears to cover screen)
            if (direction === "horizontal") {
              blind.style.transform = `scaleX(${progress})`;
            } else {
              blind.style.transform = `scaleY(${progress})`;
            }
          },
        };
      });

      return {
        springs,
        schedule: "overlap",
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

      // Create SpringItem for each blind
      const springs = Array.from({ length: blindCount }, (_, index) => {
        return {
          from: 1,
          to: 0,
          spring: inSpring,
          // First blind triggers immediately, others trigger when previous passes staggerProgress
          triggerAt: index === 0 ? 0 : staggerProgress,
          tick: (progress: number) => {
            if (!blindsData) return;
            const blind = blindsData.blinds[index];
            if (!blind) return;

            // IN: progress goes 1 → 0 (blind disappears to reveal screen)
            if (direction === "horizontal") {
              blind.style.transform = `scaleX(${progress})`;
            } else {
              blind.style.transform = `scaleY(${progress})`;
            }
          },
        };
      });

      return {
        springs,
        schedule: "overlap",
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
