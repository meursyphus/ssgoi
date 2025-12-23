import type { SggoiTransition, PhysicsOptions } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { getRect } from "../utils/get-rect";

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 200, damping: 23, doubleSpring: 1 },
};

interface PinterestOptions {
  timeout?: number;
  physics?: PhysicsOptions;
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

type StyleObject = Record<string, string>;
type AnimationFunc = (progress: number) => StyleObject;

interface AnimationConfig {
  transformOrigin: string;
  animate: AnimationFunc;
}

// Animation creators for each transition type
function createDetailIn({
  detailRect: fromRect,
  galleryRect: toRect,
  pageRect,
  scrollOffset,
}: {
  detailRect: DOMRect;
  galleryRect: DOMRect;
  pageRect: DOMRect;
  scrollOffset: { x: number; y: number };
}): AnimationConfig {
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

  const transformOrigin = `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`;

  return {
    transformOrigin,
    animate: (progress: number) => {
      const u = 1 - progress;
      return {
        clipPath: `inset(${startTop * u}% ${startRight * u}% ${startBottom * u}% ${startLeft * u}%)`,
        transform: `translate(${dx * u}px, ${dy * u}px) scale(${1 + (scale - 1) * u})`,
      };
    },
  };
}

function createGalleryOut({
  galleryRect: fromRect,
  detailRect: toRect,
  scrollOffset,
}: {
  galleryRect: DOMRect;
  detailRect: DOMRect;
  scrollOffset: { x: number; y: number };
}): AnimationConfig {
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

  const transformOrigin = `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`;

  return {
    transformOrigin,
    animate: (progress: number) => {
      const t = 1 - progress; // 0 -> 1
      return {
        transform: `translate(${dx * t - scrollOffset.x}px, ${dy * t - scrollOffset.y}px) scale(${1 + (scale - 1) * t})`,
        opacity: `${1 - t}`,
      };
    },
  };
}

function createGalleryIn({
  galleryRect: fromRect,
  detailRect: toRect,
  scrollOffset,
}: {
  galleryRect: DOMRect;
  detailRect: DOMRect;
  scrollOffset: { x: number; y: number };
}): AnimationConfig {
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

  const transformOrigin = `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`;

  return {
    transformOrigin,
    animate: (progress: number) => {
      const t = 1 - progress; // 1 -> 0;
      const u = progress; // 0 -> 1;
      return {
        transform: `translate(${dx * t}px, ${dy * t}px) scale(${1 + (scale - 1) * t})`,
        opacity: `${u}`,
      };
    },
  };
}

function createDetailOut({
  detailRect: fromRect,
  galleryRect: toRect,
  pageRect,
  scrollOffset,
}: {
  detailRect: DOMRect;
  galleryRect: DOMRect;
  pageRect: DOMRect;
  scrollOffset: { x: number; y: number };
}): AnimationConfig {
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

  const transformOrigin = `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`;

  return {
    transformOrigin,
    animate: (progress: number) => {
      const t = 1 - progress; // 0 -> 1 for out transitions
      return {
        clipPath: `inset(${startTop * t}% ${startRight * t}% ${startBottom * t}% ${startLeft * t}%)`,
        transform: `translate(${dx * t - scrollOffset.x}px, ${dy * t - scrollOffset.y}px) scale(${1 + (scale - 1) * t})`,
      };
    },
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
    const inConfig = createDetailIn({
      detailRect,
      galleryRect,
      pageRect: toNode.getBoundingClientRect(),
      scrollOffset,
    });
    const outConfig = createGalleryOut({
      galleryRect,
      detailRect,
      scrollOffset,
    });

    // Apply transformOrigin to nodes
    toNode.style.transformOrigin = inConfig.transformOrigin;
    fromNode.style.transformOrigin = outConfig.transformOrigin;

    return {
      inAnimation: inConfig.animate,
      outAnimation: outConfig.animate,
    };
  } else {
    const inConfig = createGalleryIn({
      galleryRect,
      detailRect,
      scrollOffset,
    });
    const outConfig = createDetailOut({
      detailRect,
      galleryRect,
      pageRect: fromNode.getBoundingClientRect(),
      scrollOffset,
    });

    // Apply transformOrigin to nodes
    toNode.style.transformOrigin = inConfig.transformOrigin;
    fromNode.style.transformOrigin = outConfig.transformOrigin;

    return {
      inAnimation: inConfig.animate,
      outAnimation: outConfig.animate,
    };
  }
}

export const pinterest = (options: PinterestOptions = {}): SggoiTransition => {
  const physicsOptions: PhysicsOptions = options.physics ?? DEFAULT_PHYSICS;
  const timeout = options.timeout ?? 300;

  // Closure variables to share state between in/out
  let fromNode: HTMLElement | null = null;
  let resolver: ((value: boolean) => void) | null = null;
  let handlers: AnimationHandlers | null = null;
  // New: for CSS mode synchronization
  let resolveHandlers: (() => void) | null = null;

  return {
    in: async (element, { scrollOffset }) => {
      const toNode = element;

      // Wait for fromNode to be set by out transition's wait()
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
        // Resolve handlers promise even if no fromNode (to unblock OUT's wait)
        resolveHandlers?.();
        resolveHandlers = null;
        fromNode = null;
        return {
          physics: physicsOptions,
          css: () => ({}),
        };
      }

      // Detect and prepare animation handlers with saved scrollOffset
      handlers = createAnimationConfig(fromNode, toNode, scrollOffset);

      // Resolve handlers promise (unblock OUT's wait)
      resolveHandlers?.();
      resolveHandlers = null;

      if (!handlers) {
        fromNode = null;
        return {
          physics: physicsOptions,
          css: () => ({}),
        };
      }

      // Reset fromNode for next transition
      fromNode = null;

      return {
        physics: physicsOptions,
        css: (progress) => {
          if (!handlers) return {};
          return handlers.inAnimation(progress);
        },
      };
    },
    out: async (element) => {
      // Create handlersReady promise (will be resolved by IN transition)
      const handlersReady = new Promise<void>((resolve) => {
        resolveHandlers = resolve;
      });

      return {
        physics: physicsOptions,
        prepare: () => {
          prepareOutgoing(element);
          element.style.zIndex = "-1";
          // Called after insertClone() - element is now in DOM!
          fromNode = element;

          // If there's a waiting resolver (IN is waiting), resolve it
          if (resolver) {
            resolver(true);
            resolver = null;
          }
        },
        wait: async () => {
          // Wait for handlers to be created by IN transition
          await handlersReady;
        },
        css: (progress) => {
          // Called after wait() - handlers are guaranteed to exist
          if (!handlers) return {};
          return handlers.outAnimation(progress);
        },
      };
    },
  };
};
