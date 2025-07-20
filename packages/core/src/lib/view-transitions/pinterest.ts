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
 * - Gallery page: Use data-pinterest-gallery-key="unique-id"
 * - Detail page: Use data-pinterest-detail-key="unique-id"
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

type AnimationFunc = (progress: number) => void;

// Animation creators for each transition type
function createDetailIn(
  galleryRect: DOMRect,
  detailRect: DOMRect,
  pageRect: DOMRect,
  toNode: HTMLElement
): AnimationFunc {
  const dx =
    detailRect.left -
    galleryRect.left +
    (detailRect.width - galleryRect.width) / 2;
  const dy =
    detailRect.top -
    galleryRect.top +
    (detailRect.height - galleryRect.height) / 2;
  const scaleX = detailRect.width / galleryRect.width;
  const scaleY = detailRect.height / galleryRect.height;
  const scale = Math.max(scaleX, scaleY);

  const clipBounds = {
    top: (galleryRect.top / pageRect.height) * 100,
    right:
      ((pageRect.width - (galleryRect.left + galleryRect.width)) /
        pageRect.width) *
      100,
    bottom:
      ((pageRect.height - (galleryRect.top + galleryRect.height)) /
        pageRect.height) *
      100,
    left: (galleryRect.left / pageRect.width) * 100,
  };

  const transformOrigin = `${galleryRect.left + galleryRect.width / 2}px ${galleryRect.top + galleryRect.height / 2}px`;

  return (progress: number) => {
    const u = 1 - progress;
    toNode.style.clipPath = `inset(${clipBounds.top * u}% ${clipBounds.right * u}% ${clipBounds.bottom * u}% ${clipBounds.left * u}%)`;
    toNode.style.transformOrigin = transformOrigin;
    toNode.style.transform = `translate(${dx * u}px, ${dy * u}px) scale(${1 + (scale - 1) * u})`;
  };
}

function createGalleryOut(
  galleryRect: DOMRect,
  detailRect: DOMRect,
  pageRect: DOMRect,
  fromNode: HTMLElement
): AnimationFunc {
  const dx =
    detailRect.left -
    galleryRect.left +
    (detailRect.width - galleryRect.width) / 2;
  const dy =
    detailRect.top -
    galleryRect.top +
    (detailRect.height - galleryRect.height) / 2;
  const scaleX = detailRect.width / galleryRect.width;
  const scaleY = detailRect.height / galleryRect.height;
  const scale = Math.max(scaleX, scaleY);

  const clipBounds = {
    top: (galleryRect.top / pageRect.height) * 100,
    right:
      ((pageRect.width - (galleryRect.left + galleryRect.width)) /
        pageRect.width) *
      100,
    bottom:
      ((pageRect.height - (galleryRect.top + galleryRect.height)) /
        pageRect.height) *
      100,
    left: (galleryRect.left / pageRect.width) * 100,
  };

  const transformOrigin = `${galleryRect.left + galleryRect.width / 2}px ${galleryRect.top + galleryRect.height / 2}px`;

  return (progress: number) => {
    fromNode.style.clipPath = `inset(${clipBounds.top * progress}% ${clipBounds.right * progress}% ${clipBounds.bottom * progress}% ${clipBounds.left * progress}%)`;
    fromNode.style.transformOrigin = transformOrigin;
    fromNode.style.transform = `translate(${dx * progress}px, ${dy * progress}px) scale(${1 + (scale - 1) * progress})`;
  };
}

function createGalleryIn(
  galleryRect: DOMRect,
  detailRect: DOMRect,
  toNode: HTMLElement
): AnimationFunc {
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
  const inverseScale = 1 / scale;

  const transformOrigin = `${detailRect.left + detailRect.width / 2}px ${detailRect.top + detailRect.height / 2}px`;

  return (progress: number) => {
    const t = 1 - progress;
    toNode.style.transformOrigin = transformOrigin;
    toNode.style.transform = `translate(${-dx * t}px, ${-dy * t}px) scale(${1 + (inverseScale - 1) * t})`;
    toNode.style.opacity = `${progress}`;
  };
}

function createDetailOut(
  detailRect: DOMRect,
  galleryRect: DOMRect,
  fromNode: HTMLElement
): AnimationFunc {
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
  const inverseScale = 1 / scale;

  const transformOrigin = `${detailRect.left + detailRect.width / 2}px ${detailRect.top + detailRect.height / 2}px`;

  return (progress: number) => {
    fromNode.style.transformOrigin = transformOrigin;
    fromNode.style.transform = `translate(${-dx * progress}px, ${-dy * progress}px) scale(${1 + (inverseScale - 1) * progress})`;
    fromNode.style.opacity = `${1 - progress}`;
  };
}

interface AnimationHandlers {
  inAnimation: AnimationFunc;
  outAnimation: AnimationFunc;
}

function detectAndPrepare(
  fromNode: HTMLElement,
  toNode: HTMLElement
): AnimationHandlers | null {
  // Find detail element first (only one per page)
  const fromDetail = fromNode.querySelector(
    "[data-pinterest-detail-key]"
  ) as HTMLElement | null;
  const toDetail = toNode.querySelector(
    "[data-pinterest-detail-key]"
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
      `[data-pinterest-gallery-key="${key}"]`
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
      `[data-pinterest-gallery-key="${key}"]`
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
  if (isEnterMode) {
    return {
      inAnimation: createDetailIn(galleryRect, detailRect, pageRect, toNode),
      outAnimation: createGalleryOut(
        galleryRect,
        detailRect,
        pageRect,
        fromNode
      ),
    };
  } else {
    return {
      inAnimation: createGalleryIn(galleryRect, detailRect, toNode),
      outAnimation: createDetailOut(detailRect, galleryRect, fromNode),
    };
  }
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

  // Shared animation handlers
  let animationHandlers: AnimationHandlers | null = null;

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

      // Detect and prepare animation handlers
      const handlers = detectAndPrepare(fromNode, toNode);
      if (!handlers) {
        return {
          spring,
          tick: () => {},
        };
      }

      // Store animation handlers for out transition
      animationHandlers = handlers;

      return {
        spring,
        tick: (progress) => {
          animationHandlers!.inAnimation(progress);
        },
      };
    },
    out: async (element) => {
      return {
        onStart: () => {
          // Store fromNode
          currentFromNode = element;

          // Notify in transition that fromNode is ready
          if (fromNodeResolver) {
            fromNodeResolver(true);
            fromNodeResolver = null;
          }
        },
        prepare: (element) => {
          prepareOutgoing(element);
        },
        spring,
        tick: (progress) => {
          if (animationHandlers) {
            animationHandlers.outAnimation(progress);
          }
        },
      };
    },
  };
};
