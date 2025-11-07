import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { getRect } from "../utils/get-rect";

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
 * - Gallery page: Use data-pinterest-gallery-key="unique-id"
 * - Detail page: Use data-pinterest-detail-key="unique-id"
 * - The transition auto-detects the mode based on which keys match between pages
 */

type AnimationFunc = (progress: number) => void;

// Animation creators for each transition type
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

function createGalleryOut(
  {
    galleryRect: fromRect,
    detailRect: toRect,
    scrollOffset,
  }: {
    galleryRect: DOMRect;
    detailRect: DOMRect;
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
  const scale = Math.max(scaleX, scaleY);

  return (progress: number) => {
    node.style.transformOrigin = `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`;
    const t = 1 - progress; // 0 -> 1
    node.style.transform = `translate(${dx * t - scrollOffset.x}px, ${dy * t - scrollOffset.y}px) scale(${1 + (scale - 1) * t})`;
    node.style.opacity = `${1 - t}`;
  };
}

function createGalleryIn(
  {
    galleryRect: fromRect,
    detailRect: toRect,
    scrollOffset,
  }: {
    galleryRect: DOMRect;
    detailRect: DOMRect;
    scrollOffset: { x: number; y: number };
  },
  node: HTMLElement,
): AnimationFunc {
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

  return (progress: number) => {
    const t = 1 - progress; // 1 -> 0;
    const u = progress; // 0 -> 1;
    node.style.transformOrigin = `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`;
    node.style.transform = `translate(${dx * t}px, ${dy * t}px) scale(${1 + (scale - 1) * t})`;
    node.style.opacity = `${u}`;
  };
}

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
  inAnimation: AnimationFunc;
  outAnimation: AnimationFunc;
}

function createAnimationConfig(
  fromNode: HTMLElement,
  toNode: HTMLElement,
  scrollOffset: { x: number; y: number },
): AnimationHandlers | null {
  // Find detail element first (only one per page)
  const fromDetail = fromNode.querySelector(
    "[data-pinterest-detail-key]",
  ) as HTMLElement | null;
  const toDetail = toNode.querySelector(
    "[data-pinterest-detail-key]",
  ) as HTMLElement | null;

  // Early return if multiple details on either page
  if (
    fromNode.querySelectorAll("[data-pinterest-detail-key]").length > 1 ||
    toNode.querySelectorAll("[data-pinterest-detail-key]").length > 1
  ) {
    return null;
  }

  let galleryEl: HTMLElement | null = null;
  let detailEl: HTMLElement | null = null;
  let isEnterMode = false;

  // Case 1: Gallery → Detail (enter mode)
  if (!fromDetail && toDetail) {
    detailEl = toDetail;
    const key = detailEl.getAttribute("data-pinterest-detail-key");
    if (!key) return null;

    // Find matching gallery in from page
    galleryEl = fromNode.querySelector(
      `[data-pinterest-gallery-key="${key}"]`,
    ) as HTMLElement | null;

    if (galleryEl) {
      isEnterMode = true;
    }
  }
  // Case 2: Detail → Gallery (exit mode)
  else if (fromDetail && !toDetail) {
    detailEl = fromDetail;
    const key = detailEl.getAttribute("data-pinterest-detail-key");
    if (!key) return null;

    // Find matching gallery in to page
    galleryEl = toNode.querySelector(
      `[data-pinterest-gallery-key="${key}"]`,
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

  // Return appropriate animation functions based on mode
  if (isEnterMode) {
    return {
      inAnimation: createDetailIn(
        { detailRect, galleryRect, pageRect: toNode.getBoundingClientRect(), scrollOffset },
        toNode,
      ),
      outAnimation: createGalleryOut(
        { galleryRect, detailRect, scrollOffset },
        fromNode,
      ),
    };
  } else {
    return {
      inAnimation: createGalleryIn(
        { galleryRect, detailRect, scrollOffset },
        toNode,
      ),
      outAnimation: createDetailOut(
        { detailRect, galleryRect, pageRect: fromNode.getBoundingClientRect(), scrollOffset },
        fromNode,
      ),
    };
  }
}

export const pinterest = (options: PinterestOptions = {}): SggoiTransition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 30,
    damping: options.spring?.damping ?? 10,
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
          if (handlers) handlers.inAnimation(progress);
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
          element.style.zIndex = "-1";
        },
        tick: (progress) => {
          if (handlers) handlers.outAnimation(progress);
        },
      };
    },
  };
};
