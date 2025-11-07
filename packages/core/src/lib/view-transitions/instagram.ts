import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { getRect } from "../utils/get-rect";

interface InstagramOptions {
  spring?: Partial<SpringConfig>;
  timeout?: number;
}

/**
 * Instagram-style transition for gallery/detail views
 *
 * Hybrid approach - uses Pinterest's IN animation for enter mode, OUT animation for exit mode.
 *
 * Scenarios:
 * 1. Gallery → Detail (enter mode):
 *    - Detail animates in with clip-path (from Pinterest IN)
 *    - Gallery stays visible without animation
 *
 * 2. Detail → Gallery (exit mode):
 *    - Detail animates out with clip-path (from Pinterest OUT)
 *    - Gallery stays visible without animation
 *
 * Usage:
 * - Gallery page: Use data-instagram-gallery-key="unique-id"
 * - Detail page: Use data-instagram-detail-key="unique-id"
 * - The transition auto-detects the mode based on which keys match between pages
 */

type AnimationFunc = (progress: number) => void;

// IN animation from Pinterest - for enter mode
function createDetailIn(
  {
    detailRect: fromRect,
    galleryRect: toRect,
    pageRect,
    scrollOffset,
  }: {
    detailRect: DOMRect;
    galleryRect: DOMRect;
    pageRect: DOMRect;
    scrollOffset: { x: number; y: number };
  },
  node: HTMLElement,
): AnimationFunc {
  // 시작 위치 (from)와 끝 위치 (to) 사이의 거리 계산
  const dx =
    toRect.left -
    fromRect.left +
    (toRect.width - fromRect.width) / 2 -
    scrollOffset.x;
  const dy =
    toRect.top -
    fromRect.top +
    (toRect.height - fromRect.height) / 2 -
    scrollOffset.y;

  // scale 계산
  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.max(scaleX, scaleY);

  // clip-path 계산
  const startTop = (fromRect.top / pageRect.height) * 100;
  const startRight =
    ((pageRect.width - (fromRect.left + fromRect.width)) / pageRect.width) *
    100;
  const startBottom =
    ((pageRect.height - (fromRect.top + fromRect.height)) / pageRect.height) *
    100;
  const startLeft = (fromRect.left / pageRect.width) * 100;

  node.style.transformOrigin = `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`;
  return (progress: number) => {
    const u = 1 - progress;
    const currentTop = startTop * u;
    const currentRight = startRight * u;
    const currentBottom = startBottom * u;
    const currentLeft = startLeft * u;

    node.style.clipPath = `inset(${currentTop}% ${currentRight}% ${currentBottom}% ${currentLeft}%)`;
    node.style.transform = `translate(${dx * u}px, ${dy * u}px) scale(${1 + (scale - 1) * u})`;
  };
}

// OUT animation from Pinterest - for exit mode
function createDetailOut(
  {
    detailRect: fromRect,
    galleryRect: toRect,
    pageRect,
    scrollOffset,
  }: {
    detailRect: DOMRect;
    galleryRect: DOMRect;
    pageRect: DOMRect;
    scrollOffset: { x: number; y: number };
  },
  node: HTMLElement,
): AnimationFunc {
  // 시작 위치 (from)와 끝 위치 (to) 사이의 거리 계산
  const dx =
    toRect.left -
    fromRect.left +
    (toRect.width - fromRect.width) / 2 +
    scrollOffset.x;
  const dy =
    toRect.top -
    fromRect.top +
    (toRect.height - fromRect.height) / 2 +
    scrollOffset.y;

  // scale 계산
  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.min(scaleX, scaleY);

  // clip-path 계산
  const startTop = (fromRect.top / pageRect.height) * 100;
  const startRight =
    ((pageRect.width - (fromRect.left + fromRect.width)) / pageRect.width) *
    100;
  const startBottom =
    ((pageRect.height - (fromRect.top + fromRect.height)) / pageRect.height) *
    100;
  const startLeft = (fromRect.left / pageRect.width) * 100;
  node.style.transformOrigin = `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`;
  return (progress: number) => {
    const t = 1 - progress; // 0 -> 1 for out transitions
    const currentTop = startTop * t;
    const currentRight = startRight * t;
    const currentBottom = startBottom * t;
    const currentLeft = startLeft * t;

    node.style.clipPath = `inset(${currentTop}% ${currentRight}% ${currentBottom}% ${currentLeft}%)`;
    node.style.transform = `translate(${dx * t - scrollOffset.x}px, ${dy * t - scrollOffset.y}px) scale(${1 + (scale - 1) * t})`;
  };
}

interface AnimationHandlers {
  isEnterMode: boolean;
  inAnimation?: AnimationFunc;
  outAnimation?: AnimationFunc;
}

function createAnimationConfig(
  fromNode: HTMLElement,
  toNode: HTMLElement,
  scrollOffset: { x: number; y: number },
): AnimationHandlers | null {
  // Find detail element first (only one per page)
  const fromDetail = fromNode.querySelector(
    "[data-instagram-detail-key]",
  ) as HTMLElement | null;
  const toDetail = toNode.querySelector(
    "[data-instagram-detail-key]",
  ) as HTMLElement | null;

  // Early return if multiple details on either page
  if (
    fromNode.querySelectorAll("[data-instagram-detail-key]").length > 1 ||
    toNode.querySelectorAll("[data-instagram-detail-key]").length > 1
  ) {
    return null;
  }

  let galleryEl: HTMLElement | null = null;
  let detailEl: HTMLElement | null = null;
  let isEnterMode = false;

  // Case 1: Gallery → Detail (enter mode)
  if (!fromDetail && toDetail) {
    detailEl = toDetail;
    const key = detailEl.getAttribute("data-instagram-detail-key");
    if (!key) return null;

    // Find matching gallery in from page
    galleryEl = fromNode.querySelector(
      `[data-instagram-gallery-key="${key}"]`,
    ) as HTMLElement | null;

    if (galleryEl) {
      isEnterMode = true;
    }
  }
  // Case 2: Detail → Gallery (exit mode)
  else if (fromDetail && !toDetail) {
    detailEl = fromDetail;
    const key = detailEl.getAttribute("data-instagram-detail-key");
    if (!key) return null;

    // Find matching gallery in to page
    galleryEl = toNode.querySelector(
      `[data-instagram-gallery-key="${key}"]`,
    ) as HTMLElement | null;

    if (galleryEl) {
      isEnterMode = false;
    }
  }

  if (!galleryEl || !detailEl) {
    return null;
  }

  // Calculate rects based on mode
  const galleryRect = getRect(isEnterMode ? fromNode : toNode, galleryEl);
  const detailRect = getRect(isEnterMode ? toNode : fromNode, detailEl);
  const pageRect = toNode.getBoundingClientRect();

  // Return appropriate animation functions based on mode
  // enterMode: use IN animation (Detail animates in), OUT stays
  // exitMode: use OUT animation (Detail animates out), IN stays
  if (isEnterMode) {
    return {
      isEnterMode: true,
      inAnimation: createDetailIn(
        { detailRect, galleryRect, pageRect, scrollOffset },
        toNode,
      ),
      // No outAnimation - gallery stays visible
    };
  } else {
    return {
      isEnterMode: false,
      outAnimation: createDetailOut(
        { detailRect, galleryRect, pageRect, scrollOffset },
        fromNode,
      ),
      // No inAnimation - gallery stays visible
    };
  }
}

export const instagram = (options: InstagramOptions = {}): SggoiTransition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 150,
    damping: options.spring?.damping ?? 22,
  };
  const timeout = options.timeout ?? 300;

  // Closure variables to share state between in/out
  let fromNode: HTMLElement | null = null;
  let resolver: ((value: boolean) => void) | null = null;
  let handlers: AnimationHandlers | null = null;

  return {
    in: async (element, { scrollOffset }) => {
      const toNode = element;

      // Wait for fromNode to be set by out transition
      const hasFromNode = await new Promise<boolean>((resolve) => {
        if (fromNode) {
          // fromNode already set by out transition
          resolve(true);
        } else {
          // Store resolver for out transition to call
          resolver = resolve;
          // Timeout fallback
          setTimeout(() => {
            resolver = null;
            resolve(false);
          }, timeout);
        }
      });

      if (!hasFromNode || !fromNode) {
        fromNode = null;
        return {
          spring,
          tick: () => {},
        };
      }

      // Detect and prepare animation handlers with saved scrollOffset
      handlers = createAnimationConfig(fromNode, toNode, scrollOffset);
      if (!handlers) {
        return {
          spring,
          tick: () => {},
        };
      }

      // Reset fromNode for next transition
      fromNode = null;

      return {
        spring,
        tick: (progress) => {
          // Use inAnimation if available (enterMode), otherwise stay visible
          if (handlers?.inAnimation) {
            handlers.inAnimation(progress);
          }
        },
      };
    },
    out: async (element) => {
      return {
        spring,
        onStart: () => {
          // Store fromNode
          fromNode = element;

          // If there's a waiting resolver, resolve it
          if (resolver) {
            resolver(true);
            resolver = null;
          }
        },
        prepare: (element) => {
          prepareOutgoing(element);

          if (!handlers?.isEnterMode) {
            element.style.zIndex = "-1";
          }
        },
        tick: (progress) => {
          // Use outAnimation if available (exitMode), otherwise stay visible
          if (handlers?.outAnimation) {
            handlers.outAnimation(progress);
          }
        },
      };
    },
  };
};
