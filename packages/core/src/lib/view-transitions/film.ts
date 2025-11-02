import type {
  SggoiTransition,
  SggoiTransitionContext,
  SpringConfig,
  MultiSpringConfig,
} from "../types";

import { getRect } from "../utils/get-rect";
import { prepareOutgoing } from "../utils/prepare-outgoing";

// Default spring configurations for each animation phase
const DEFAULT_SCALE_SPRING: SpringConfig = {
  stiffness: 9,
  damping: 3.5,
};

const DEFAULT_TRANSLATE_SPRING: SpringConfig = {
  stiffness: 6,
  damping: 3.5,
};

const DEFAULT_SCALE = 0.8;
const DEFAULT_BORDER_COLOR = "white";

// Timing configuration (relative offsets)
// These match the original progress-based timing
const SCALE_DOWN_OFFSET = 0; // Starts at 0%
const TRANSLATE_OFFSET = 0.2; // Starts at 20%
const SCALE_UP_OFFSET = 0.85; // Starts at 85%

// Convert relative timing to milliseconds (assuming ~2s total animation)
const BASE_DURATION = 2000;

interface FilmOptions {
  scaleSpring?: SpringConfig;
  translateSpring?: SpringConfig;
  scale?: number; // Scale factor (default: 0.8)
  border?: {
    color?: string; // Border color (default: white)
  };
}

// Shared state for animation values
interface AnimationState {
  scaleDownProgress: number;
  translateProgress: number;
  scaleUpProgress: number;
}

export const film = (options?: FilmOptions): SggoiTransition => {
  const scaleSpring = options?.scaleSpring ?? DEFAULT_SCALE_SPRING;
  const translateSpring = options?.translateSpring ?? DEFAULT_TRANSLATE_SPRING;
  const scale = options?.scale ?? DEFAULT_SCALE;
  const borderColor = options?.border?.color ?? DEFAULT_BORDER_COLOR;

  return {
    out: (element, context): MultiSpringConfig => {
      // 나가는 화면 애니메이션
      const rect = getFilmRect(context);
      const containerRect = getRect(document.body, context.positionedParent);

      // Create border elements before return
      const borderElements = createCornerBorders(borderColor, {
        ...rect,
        top: containerRect.top,
      });

      // Shared animation state
      const state: AnimationState = {
        scaleDownProgress: 0,
        translateProgress: 0,
        scaleUpProgress: 0,
      };

      // Dirty flag and update scheduling
      let isDirty = false;
      let animationFrameId: number | null = null;

      // Helper function to update DOM based on current state
      const flushUpdates = () => {
        if (!isDirty) return;

        // Calculate current scale
        // If scaleUp has started (progress > 0), use its value
        // Otherwise use scaleDown value
        let currentScale: number;
        if (state.scaleUpProgress > 0) {
          currentScale = scale + (1 - scale) * state.scaleUpProgress;
        } else {
          currentScale = 1 - (1 - scale) * state.scaleDownProgress;
        }

        // Calculate translate
        const currentTranslateY = -rect.top - rect.height * state.translateProgress;

        // Apply transform
        element.style.transform = `translateY(${currentTranslateY}px) scale(${currentScale})`;

        // Update borders
        const offsetX = (rect.width - rect.width * currentScale) / 2;
        const offsetY = (rect.height - rect.height * currentScale) / 2;
        updateBorders(borderElements, offsetX, offsetY);

        isDirty = false;
        animationFrameId = null;
      };

      // Schedule update on next animation frame
      const scheduleUpdate = () => {
        isDirty = true;
        if (animationFrameId === null) {
          animationFrameId = requestAnimationFrame(flushUpdates);
        }
      };

      const springs = [
        // Spring 1: Scale down (1 → scale)
        {
          from: 0,
          to: 1,
          spring: scaleSpring,
          offset: SCALE_DOWN_OFFSET * BASE_DURATION,
          tick: (progress: number) => {
            state.scaleDownProgress = progress;
            scheduleUpdate();
          },
        },
        // Spring 2: Translate up
        {
          from: 0,
          to: 1,
          spring: translateSpring,
          offset: TRANSLATE_OFFSET * BASE_DURATION,
          tick: (progress: number) => {
            state.translateProgress = progress;
            scheduleUpdate();
          },
        },
        // Spring 3: Scale up (scale → 1)
        {
          from: 0,
          to: 1,
          spring: scaleSpring,
          offset: SCALE_UP_OFFSET * BASE_DURATION,
          tick: (progress: number) => {
            state.scaleUpProgress = progress;
            scheduleUpdate();
          },
        },
      ];

      return {
        springs,
        schedule: "chain", // Use chain mode with offsets
        prepare: () => {
          prepareOutgoing(element);
          applyFilmTransformOrigin(element, rect);
          applyFilmClip(element, rect);
          applyFlimTranslate(element, rect);

          // Add border elements to positionedParent
          for (const border of borderElements) {
            context.positionedParent.appendChild(border);
          }
        },
        onEnd: () => {
          // Clean up styles after animation
          element.style.clipPath = "";
          element.style.transformOrigin = "";

          // Remove border elements from positionedParent
          setTimeout(() => {
            for (const border of borderElements) {
              context.positionedParent.removeChild(border);
            }
          }, 1000);
        },
      };
    },

    in: (element, context): MultiSpringConfig => {
      // 들어오는 화면 애니메이션
      const rect = getFilmRect(context);

      // Shared animation state
      const state: AnimationState = {
        scaleDownProgress: 0,
        translateProgress: 0,
        scaleUpProgress: 0,
      };

      // Dirty flag and update scheduling
      let isDirty = false;
      let animationFrameId: number | null = null;

      // Helper function to update DOM based on current state
      const flushUpdates = () => {
        if (!isDirty) return;

        // Calculate current scale
        let currentScale: number;
        if (state.scaleUpProgress > 0) {
          currentScale = scale + (1 - scale) * state.scaleUpProgress;
        } else {
          currentScale = 1 - (1 - scale) * state.scaleDownProgress;
        }

        // Calculate translate (inverted for IN animation)
        const currentTranslateY = -rect.top + rect.height * (1 - state.translateProgress);

        // Apply transform
        element.style.transform = `translateY(${currentTranslateY}px) scale(${currentScale})`;

        isDirty = false;
        animationFrameId = null;
      };

      // Schedule update on next animation frame
      const scheduleUpdate = () => {
        isDirty = true;
        if (animationFrameId === null) {
          animationFrameId = requestAnimationFrame(flushUpdates);
        }
      };

      const springs = [
        // Spring 1: Scale down (1 → scale)
        {
          from: 0,
          to: 1,
          spring: scaleSpring,
          offset: SCALE_DOWN_OFFSET * BASE_DURATION,
          tick: (progress: number) => {
            state.scaleDownProgress = progress;
            scheduleUpdate();
          },
        },
        // Spring 2: Translate down (from bottom to original position)
        {
          from: 0,
          to: 1,
          spring: translateSpring,
          offset: TRANSLATE_OFFSET * BASE_DURATION,
          tick: (progress: number) => {
            state.translateProgress = progress;
            scheduleUpdate();
          },
        },
        // Spring 3: Scale up (scale → 1)
        {
          from: 0,
          to: 1,
          spring: scaleSpring,
          offset: SCALE_UP_OFFSET * BASE_DURATION,
          tick: (progress: number) => {
            state.scaleUpProgress = progress;
            scheduleUpdate();
          },
        },
      ];

      return {
        springs,
        schedule: "chain", // Use chain mode with offsets
        prepare: () => {
          applyFilmTransformOrigin(element, rect);
          applyFilmClip(element, rect);
          // Initial state: at bottom with scale
          element.style.transform = `translateY(${-rect.top + rect.height}px) scale(${scale})`;
        },
        onEnd: () => {
          // Clean up styles after animation
          element.style.clipPath = "";
          element.style.transformOrigin = "";
          element.style.transform = "";
        },
      };
    },
  };
};

/**
 * Helper function to update border positions
 */
function updateBorders(
  borderElements: CornerBorders,
  _offsetX: number,
  _offsetY: number,
) {
  const offsetX = _offsetX * 0.7;
  const offsetY = _offsetY * 0.7;
  borderElements.topLeft.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  borderElements.topRight.style.transform = `translate(${-offsetX}px, ${offsetY}px)`;
  borderElements.bottomLeft.style.transform = `translate(${offsetX}px, ${-offsetY}px)`;
  borderElements.bottomRight.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;
}

interface CornerBorders extends Iterable<HTMLElement> {
  topLeft: HTMLElement;
  topRight: HTMLElement;
  bottomLeft: HTMLElement;
  bottomRight: HTMLElement;
}

/**
 * Create corner border elements (ㄴ ㄱ shapes)
 */
function createCornerBorders(
  color: string = "white",
  rect: ReturnType<typeof getFilmRect>,
): CornerBorders {
  const borderWidth = 1;
  const borderLength = 15;

  // Top-left corner
  const topLeft = document.createElement("div");
  topLeft.style.position = "fixed";
  topLeft.style.pointerEvents = "none";
  topLeft.style.zIndex = "9999";
  topLeft.style.top = `${rect.top - borderWidth}px`;
  topLeft.style.left = `${rect.left - borderWidth}px`;
  topLeft.style.width = `${borderLength}px`;
  topLeft.style.height = `${borderLength}px`;
  // Horizontal line
  const topLeftH = document.createElement("div");
  topLeftH.style.position = "absolute";
  topLeftH.style.width = `${borderLength}px`;
  topLeftH.style.height = `${borderWidth}px`;
  topLeftH.style.backgroundColor = color;
  topLeftH.style.top = "0";
  topLeftH.style.left = "0";
  // Vertical line
  const topLeftV = document.createElement("div");
  topLeftV.style.position = "absolute";
  topLeftV.style.width = `${borderWidth}px`;
  topLeftV.style.height = `${borderLength}px`;
  topLeftV.style.backgroundColor = color;
  topLeftV.style.top = "0";
  topLeftV.style.left = "0";
  topLeft.appendChild(topLeftH);
  topLeft.appendChild(topLeftV);

  // Top-right corner
  const topRight = document.createElement("div");
  topRight.style.position = "fixed";
  topRight.style.pointerEvents = "none";
  topRight.style.zIndex = "9999";
  topRight.style.top = `${rect.top - borderWidth}px`;
  topRight.style.left = `${rect.left + rect.width - borderLength + borderWidth}px`;
  topRight.style.width = `${borderLength}px`;
  topRight.style.height = `${borderLength}px`;
  // Horizontal line
  const topRightH = document.createElement("div");
  topRightH.style.position = "absolute";
  topRightH.style.width = `${borderLength}px`;
  topRightH.style.height = `${borderWidth}px`;
  topRightH.style.backgroundColor = color;
  topRightH.style.top = "0";
  topRightH.style.right = "0";
  // Vertical line
  const topRightV = document.createElement("div");
  topRightV.style.position = "absolute";
  topRightV.style.width = `${borderWidth}px`;
  topRightV.style.height = `${borderLength}px`;
  topRightV.style.backgroundColor = color;
  topRightV.style.top = "0";
  topRightV.style.right = "0";
  topRight.appendChild(topRightH);
  topRight.appendChild(topRightV);

  // Bottom-left corner
  const bottomLeft = document.createElement("div");
  bottomLeft.style.position = "fixed";
  bottomLeft.style.pointerEvents = "none";
  bottomLeft.style.zIndex = "9999";
  bottomLeft.style.top = `${rect.top + rect.height - borderLength + borderWidth}px`;
  bottomLeft.style.left = `${rect.left - borderWidth}px`;
  bottomLeft.style.width = `${borderLength}px`;
  bottomLeft.style.height = `${borderLength}px`;
  // Horizontal line
  const bottomLeftH = document.createElement("div");
  bottomLeftH.style.position = "absolute";
  bottomLeftH.style.width = `${borderLength}px`;
  bottomLeftH.style.height = `${borderWidth}px`;
  bottomLeftH.style.backgroundColor = color;
  bottomLeftH.style.bottom = "0";
  bottomLeftH.style.left = "0";
  // Vertical line
  const bottomLeftV = document.createElement("div");
  bottomLeftV.style.position = "absolute";
  bottomLeftV.style.width = `${borderWidth}px`;
  bottomLeftV.style.height = `${borderLength}px`;
  bottomLeftV.style.backgroundColor = color;
  bottomLeftV.style.bottom = "0";
  bottomLeftV.style.left = "0";
  bottomLeft.appendChild(bottomLeftH);
  bottomLeft.appendChild(bottomLeftV);

  // Bottom-right corner
  const bottomRight = document.createElement("div");
  bottomRight.style.position = "fixed";
  bottomRight.style.pointerEvents = "none";
  bottomRight.style.zIndex = "9999";
  bottomRight.style.top = `${rect.top + rect.height - borderLength + borderWidth}px`;
  bottomRight.style.left = `${rect.left + rect.width - borderLength + borderWidth}px`;
  bottomRight.style.width = `${borderLength}px`;
  bottomRight.style.height = `${borderLength}px`;
  // Horizontal line
  const bottomRightH = document.createElement("div");
  bottomRightH.style.position = "absolute";
  bottomRightH.style.width = `${borderLength}px`;
  bottomRightH.style.height = `${borderWidth}px`;
  bottomRightH.style.backgroundColor = color;
  bottomRightH.style.bottom = "0";
  bottomRightH.style.right = "0";
  // Vertical line
  const bottomRightV = document.createElement("div");
  bottomRightV.style.position = "absolute";
  bottomRightV.style.width = `${borderWidth}px`;
  bottomRightV.style.height = `${borderLength}px`;
  bottomRightV.style.backgroundColor = color;
  bottomRightV.style.bottom = "0";
  bottomRightV.style.right = "0";
  bottomRight.appendChild(bottomRightH);
  bottomRight.appendChild(bottomRightV);

  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    *[Symbol.iterator]() {
      yield topLeft;
      yield topRight;
      yield bottomLeft;
      yield bottomRight;
    },
  };
}

/**
 * Calculate the visible viewport rect for film transition
 * Returns the area where the transition will be visible
 */
function getFilmRect(context: SggoiTransitionContext) {
  const containerRect = getRect(document.body, context.positionedParent);
  const top = context.scroll.y;

  return {
    top,
    left: 0,
    width: containerRect.width,
    height: window.innerHeight - containerRect.top,
  };
}

/**
 * Set transform-origin to the center of film rect
 */
function applyFilmTransformOrigin(
  element: HTMLElement,
  rect: ReturnType<typeof getFilmRect>,
) {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  element.style.transformOrigin = `${centerX}px ${centerY}px`;
}

/**
 * Apply clipPath to limit element visibility to film rect
 * Common prepare function for both in and out transitions
 */
function applyFilmClip(
  element: HTMLElement,
  rect: ReturnType<typeof getFilmRect>,
) {
  element.style.clipPath = `polygon(
    ${rect.left}px ${rect.top}px,
    ${rect.left + rect.width}px ${rect.top}px,
    ${rect.left + rect.width}px ${rect.top + rect.height}px,
    ${rect.left}px ${rect.top + rect.height}px
  )`;
}

function applyFlimTranslate(
  element: HTMLElement,
  rect: ReturnType<typeof getFilmRect>,
) {
  element.style.transform = `translateY(${-rect.top}px)`;
}