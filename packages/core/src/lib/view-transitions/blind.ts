import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing, sleep } from "../utils";

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
  staggerDelay?: number;
  blindColor?: string;
}

export const blind = (options: BlindOptions = {}): SggoiTransition => {
  const {
    inSpring = DEFAULT_IN_SPRING,
    outSpring = DEFAULT_OUT_SPRING,
    transitionDelay = DEFAULT_TRANSITION_DELAY,
    blindCount = DEFAULT_BLIND_COUNT,
    direction = DEFAULT_DIRECTION,
    staggerDelay = 100,
    blindColor = DEFAULT_BLIND_COLOR,
  } = options;

  let outAnimationComplete: Promise<void>;
  let resolveOutAnimation: (() => void) | null = null;

  // Helper function to calculate individual blind progress
  const calculateBlindProgress = (
    globalProgress: number,
    blindIndex: number,
    totalBlinds: number,
    isReversed: boolean = false
  ): number => {
    const staggerRatio = Math.min(0.5, (staggerDelay * totalBlinds) / 1000);
    const activeRatio = 1 - staggerRatio;

    const index = isReversed ? totalBlinds - 1 - blindIndex : blindIndex;
    const blindStartTime = (index / totalBlinds) * staggerRatio;
    const blindEndTime = blindStartTime + activeRatio;

    if (globalProgress <= blindStartTime) {
      return 0;
    } else if (globalProgress >= blindEndTime) {
      return 1;
    } else {
      return (globalProgress - blindStartTime) / activeRatio;
    }
  };

  // Helper function to create blinds
  const createBlinds = (
    element: HTMLElement,
    initialState: "hidden" | "closed",
    transformOrigin: "left" | "right" = "left"
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
    out: (element) => {
      let blindsData: { container: HTMLElement; blinds: HTMLElement[] } | null =
        null;

      outAnimationComplete = new Promise((resolve) => {
        resolveOutAnimation = resolve;
      });

      return {
        spring: outSpring,
        prepare: (element) => {
          prepareOutgoing(element);
          element.style.zIndex = "1000";

          // Create blinds starting from hidden state (will appear one by one)
          // OUT uses left origin - blinds expand from left to right
          blindsData = createBlinds(element, "hidden", "left");
        },
        onStart: () => {},
        tick: (progress) => {
          if (!blindsData) return;

          // OUT: progress goes 1 → 0, we want blinds to close (0 → 1)
          // So we use (1 - progress) to reverse it
          const reversedProgress = 1 - progress;

          // Blinds appear sequentially to cover the screen (left to right)
          blindsData.blinds.forEach((blind, index) => {
            const blindProgress = calculateBlindProgress(
              reversedProgress,
              index,
              blindCount,
              false // not reversed - left to right
            );

            // blindProgress goes 0 → 1, so blind appears (closes the view)
            if (direction === "horizontal") {
              blind.style.transform = `scaleX(${blindProgress})`;
            } else {
              blind.style.transform = `scaleY(${blindProgress})`;
            }
          });
        },
        onEnd: () => {
          // OUT element will be removed, taking blinds with it
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
        },
      };
    },
    in: (element) => {
      let blindsData: { container: HTMLElement; blinds: HTMLElement[] } | null =
        null;

      return {
        spring: inSpring,
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
        tick: (progress) => {
          if (!blindsData) return;

          // IN: Blinds disappear sequentially to reveal the screen (left to right, same as OUT)
          blindsData.blinds.forEach((blind, index) => {
            const blindProgress = calculateBlindProgress(
              progress,
              index,
              blindCount,
              false // same direction as OUT - left to right
            );

            // blindProgress goes 0 → 1, but we want blind to disappear, so use 1 - progress
            if (direction === "horizontal") {
              blind.style.transform = `scaleX(${1 - blindProgress})`;
            } else {
              blind.style.transform = `scaleY(${1 - blindProgress})`;
            }
          });
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
