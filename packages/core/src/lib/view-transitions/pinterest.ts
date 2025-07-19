import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils";

interface PinterestOptions {
  spring?: Partial<SpringConfig>;
  timeout?: number;
}

/**
 * Pinterest-style transition for gallery/detail views
 *
 * Scenarios:
 * 1. Gallery → Detail (enter mode):
 *    - Gallery item expands to fill the screen with clip-path animation
 *    - From: Small gallery item position
 *    - To: Full detail view
 *
 * 2. Detail → Gallery (exit mode):
 *    - Detail view shrinks down to gallery item position
 *    - From: Full detail view
 *    - To: Small gallery item position
 *
 * Usage:
 * - Gallery page: Use both data-pinterest-enter-key and data-pinterest-exit-key
 * - Detail page: Use both data-pinterest-enter-key and data-pinterest-exit-key
 * - The transition auto-detects the mode based on which keys match between pages
 */

function getRect(root: HTMLElement, el: HTMLElement): DOMRect {
  const rootRect = root.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  return new DOMRect(
    elRect.left - rootRect.left,
    elRect.top - rootRect.top,
    elRect.width,
    elRect.height
  );
}

function detectModeAndKey(
  fromPage: HTMLElement,
  toPage: HTMLElement
): { mode: "enter" | "exit"; key: string } | null {
  // Check for enter mode: from has enter-key, to has both keys
  const fromEnterEls = fromPage.querySelectorAll("[data-pinterest-enter-key]");
  const toEnterEls = toPage.querySelectorAll("[data-pinterest-enter-key]");

  // Try enter mode first
  for (const fromEl of fromEnterEls) {
    const key = fromEl.getAttribute("data-pinterest-enter-key");
    if (!key) continue;

    // Check if to page has matching enter key
    const hasEnterKey = Array.from(toEnterEls).some(
      (el) => el.getAttribute("data-pinterest-enter-key") === key
    );

    if (hasEnterKey) {
      return { mode: "enter", key };
    }
  }

  // Check for exit mode: from has exit-key, to has exit-key
  const fromExitEls = fromPage.querySelectorAll("[data-pinterest-exit-key]");
  const toExitEls = toPage.querySelectorAll("[data-pinterest-exit-key]");

  for (const fromEl of fromExitEls) {
    const key = fromEl.getAttribute("data-pinterest-exit-key");
    if (!key) continue;

    // Check if to page has matching exit key
    const hasExitKey = Array.from(toExitEls).some(
      (el) => el.getAttribute("data-pinterest-exit-key") === key
    );

    if (hasExitKey) {
      return { mode: "exit", key };
    }
  }

  return null;
}

// Animation functions for each transition type
function detailIn(
  fromRect: DOMRect,
  toRect: DOMRect,
  pageRect: DOMRect,
  progress: number
) {
  // Gallery → Detail: Expanding from small to full
  const dx = toRect.left - fromRect.left + (toRect.width - fromRect.width) / 2;
  const dy = toRect.top - fromRect.top + (toRect.height - fromRect.height) / 2;

  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.max(scaleX, scaleY);

  // Clip-path animation
  const startTop = (fromRect.top / pageRect.height) * 100;
  const startRight =
    ((pageRect.width - (fromRect.left + fromRect.width)) / pageRect.width) *
    100;
  const startBottom =
    ((pageRect.height - (fromRect.top + fromRect.height)) / pageRect.height) *
    100;
  const startLeft = (fromRect.left / pageRect.width) * 100;

  const u = 1 - progress;
  const currentTop = startTop * u;
  const currentRight = startRight * u;
  const currentBottom = startBottom * u;
  const currentLeft = startLeft * u;

  return {
    clipPath: `inset(${currentTop}% ${currentRight}% ${currentBottom}% ${currentLeft}%)`,
    transformOrigin: `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`,
    transform: `translate(${dx * u}px, ${dy * u}px) scale(${1 + (scale - 1) * u})`,
  };
}

function detailOut(fromRect: DOMRect, toRect: DOMRect, progress: number) {
  // Detail → Gallery: Gallery view is entering, detail is exiting
  const dx = toRect.left - fromRect.left + (toRect.width - fromRect.width) / 2;
  const dy = toRect.top - fromRect.top + (toRect.height - fromRect.height) / 2;

  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.max(scaleX, scaleY);

  return {
    transformOrigin: `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`,
    transform: `translate(${dx * progress}px, ${dy * progress}px) scale(${1 + (scale - 1) * progress})`,
    opacity: `${1 - progress}`,
  };
}

function galleryIn(
  galleryRect: DOMRect,
  detailRect: DOMRect,
  progress: number
) {
  // Detail → Gallery: Gallery is entering
  const dx =
    galleryRect.left -
    detailRect.left +
    (galleryRect.width - detailRect.width) / 2;
  const dy =
    galleryRect.top -
    detailRect.top +
    (galleryRect.height - detailRect.height) / 2;

  const scaleX = galleryRect.width / detailRect.width;
  const scaleY = galleryRect.height / detailRect.height;
  const scale = Math.max(scaleX, scaleY);

  const t = 1 - progress;

  return {
    transformOrigin: `${detailRect.left + detailRect.width / 2}px ${detailRect.top + detailRect.height / 2}px`,
    transform: `translate(${dx * t}px, ${dy * t}px) scale(${1 + (scale - 1) * t})`,
    opacity: `${progress}`,
  };
}

function galleryOut(
  fromRect: DOMRect,
  toRect: DOMRect,
  pageRect: DOMRect,
  progress: number
) {
  // Gallery → Detail: Gallery is exiting
  const dx = toRect.left - fromRect.left + (toRect.width - fromRect.width) / 2;
  const dy = toRect.top - fromRect.top + (toRect.height - fromRect.height) / 2;

  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.max(scaleX, scaleY);

  // Clip-path animation
  const startTop = (fromRect.top / pageRect.height) * 100;
  const startRight =
    ((pageRect.width - (fromRect.left + fromRect.width)) / pageRect.width) *
    100;
  const startBottom =
    ((pageRect.height - (fromRect.top + fromRect.height)) / pageRect.height) *
    100;
  const startLeft = (fromRect.left / pageRect.width) * 100;

  const currentTop = startTop * progress;
  const currentRight = startRight * progress;
  const currentBottom = startBottom * progress;
  const currentLeft = startLeft * progress;

  return {
    clipPath: `inset(${currentTop}% ${currentRight}% ${currentBottom}% ${currentLeft}%)`,
    transformOrigin: `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`,
    transform: `translate(${dx * progress}px, ${dy * progress}px) scale(${1 + (scale - 1) * progress})`,
  };
}

interface AnimationData {
  mode: "enter" | "exit";
  key: string;
  fromRect: DOMRect;
  toRect: DOMRect;
  fromPageRect: DOMRect;
  toPageRect: DOMRect;
}

export const pinterest = (options: PinterestOptions = {}): SggoiTransition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 300,
    damping: options.spring?.damping ?? 30,
  };
  const timeout = options.timeout ?? 300;

  // Shared state between in/out
  let currentFromNode: HTMLElement | null = null;
  let currentToNode: HTMLElement | null = null;
  let fromNodeResolver: ((value: boolean) => void) | null = null;
  let toNodeResolver: ((value: boolean) => void) | null = null;

  // Shared animation data
  let animationData: AnimationData | null = null;

  return {
    in: async (element) => {
      currentToNode = element;

      // Notify out transition that toNode is ready
      if (toNodeResolver) {
        toNodeResolver(true);
        toNodeResolver = null;
      }

      // Wait for out transition to provide fromNode
      const hasFromNode = await new Promise<boolean>((resolve) => {
        if (currentFromNode) {
          // fromNode already set by out transition
          resolve(true);
        } else {
          // Store resolver for out transition to call
          fromNodeResolver = resolve;
          // Timeout fallback
          setTimeout(() => {
            fromNodeResolver = null;
            resolve(false);
          }, timeout);
        }
      });

      if (!hasFromNode || !currentFromNode) {
        currentFromNode = null;
        return {
          spring,
          tick: () => {},
        };
      }

      const fromNode = currentFromNode;
      const toNode = currentToNode;

      // Detect mode and key
      const detection = detectModeAndKey(fromNode, toNode);
      if (!detection) {
        return {
          spring,
          tick: () => {},
        };
      }

      const { mode, key } = detection;

      // Get elements based on detected mode
      const attr =
        mode === "enter"
          ? "data-pinterest-enter-key"
          : "data-pinterest-exit-key";
      const fromEl = fromNode.querySelector(
        `[${attr}="${key}"]`
      ) as HTMLElement;
      const toEl = toNode.querySelector(`[${attr}="${key}"]`) as HTMLElement;

      if (!fromEl || !toEl) {
        return {
          spring,
          tick: () => {},
        };
      }

      // Calculate animation parameters
      const fromRect = getRect(fromNode, fromEl);
      const toRect = getRect(toNode, toEl);
      const fromPageRect = fromNode.getBoundingClientRect();
      const toPageRect = toNode.getBoundingClientRect();

      // Store animation data for out transition
      animationData = {
        mode,
        key,
        fromRect,
        toRect,
        fromPageRect,
        toPageRect,
      };

      // Store original styles
      const originalStyles = {
        clipPath: toNode.style.clipPath,
        transform: toNode.style.transform,
        transformOrigin: toNode.style.transformOrigin,
        opacity: toNode.style.opacity,
      };

      // Reset for next transition
      currentFromNode = null;

      return {
        spring,
        tick: (progress) => {
          if (mode === "enter") {
            // Detail view entering (expanding from gallery)
            const styles = detailIn(fromRect, toRect, toPageRect, progress);
            toNode.style.clipPath = styles.clipPath;
            toNode.style.transformOrigin = styles.transformOrigin;
            toNode.style.transform = styles.transform;
          } else {
            // Gallery view entering (shrinking from detail)
            const styles = galleryIn(toRect, fromRect, progress);
            toNode.style.transformOrigin = styles.transformOrigin;
            toNode.style.transform = styles.transform;
            toNode.style.opacity = styles.opacity;
          }
        },
        onEnd: () => {
          // Restore original styles
          toNode.style.clipPath = originalStyles.clipPath;
          toNode.style.transform = originalStyles.transform;
          toNode.style.transformOrigin = originalStyles.transformOrigin;
          toNode.style.opacity = originalStyles.opacity;
        },
      };
    },
    out: async (element) => {
      currentFromNode = element;

      // Notify in transition that fromNode is ready
      if (fromNodeResolver) {
        fromNodeResolver(true);
        fromNodeResolver = null;
      }

      // Wait for in transition to be ready (optional, for animation data)
      await new Promise<boolean>((resolve) => {
        if (currentToNode) {
          // toNode already set by in transition
          resolve(true);
        } else {
          // Store resolver for in transition to call
          toNodeResolver = resolve;
          // Don't wait too long since out needs to start quickly
          setTimeout(() => {
            toNodeResolver = null;
            resolve(false);
          }, 50);
        }
      });

      return {
        prepare: (element) => {
          prepareOutgoing(element);
        },
        spring,
        tick: (progress) => {
          if (animationData) {
            const { mode, fromRect, toRect, fromPageRect } = animationData;

            if (mode === "enter") {
              // Gallery view exiting (when detail enters)
              const styles = galleryOut(
                fromRect,
                toRect,
                fromPageRect,
                progress
              );
              element.style.clipPath = styles.clipPath;
              element.style.transformOrigin = styles.transformOrigin;
              element.style.transform = styles.transform;
            } else {
              // Detail view exiting (when gallery enters)
              const styles = detailOut(fromRect, toRect, progress);
              element.style.transformOrigin = styles.transformOrigin;
              element.style.transform = styles.transform;
              element.style.opacity = styles.opacity;
            }
          } else {
            // Fallback: simple fade out
            element.style.opacity = `${1 - progress}`;
          }
        },
        onEnd: () => {
          // Clean up for next transition
          currentToNode = null;
          animationData = null;
        },
      };
    },
  };
};
