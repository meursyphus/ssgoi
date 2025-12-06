import type { SpringConfig, SggoiTransition, StyleObject } from "../types";
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

type CssAnimationFunc = (progress: number) => StyleObject;

interface AnimationParams {
  dx: number;
  dy: number;
  scale: number;
  scrollOffset: { x: number; y: number };
  transformOrigin: string;
  startTop?: number;
  startRight?: number;
  startBottom?: number;
  startLeft?: number;
}

// IN animation from Pinterest - for enter mode
function createDetailInParams({
  detailRect: fromRect,
  galleryRect: toRect,
  pageRect,
  scrollOffset,
}: {
  detailRect: DOMRect;
  galleryRect: DOMRect;
  pageRect: DOMRect;
  scrollOffset: { x: number; y: number };
}): AnimationParams {
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

  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.max(scaleX, scaleY);

  const startTop = (fromRect.top / pageRect.height) * 100;
  const startRight =
    ((pageRect.width - (fromRect.left + fromRect.width)) / pageRect.width) *
    100;
  const startBottom =
    ((pageRect.height - (fromRect.top + fromRect.height)) / pageRect.height) *
    100;
  const startLeft = (fromRect.left / pageRect.width) * 100;

  return {
    dx,
    dy,
    scale,
    scrollOffset,
    transformOrigin: `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`,
    startTop,
    startRight,
    startBottom,
    startLeft,
  };
}

function createDetailInCss(params: AnimationParams): CssAnimationFunc {
  const { dx, dy, scale, startTop, startRight, startBottom, startLeft } =
    params;

  return (progress: number): StyleObject => {
    const u = 1 - progress;
    const currentTop = startTop! * u;
    const currentRight = startRight! * u;
    const currentBottom = startBottom! * u;
    const currentLeft = startLeft! * u;

    return {
      clipPath: `inset(${currentTop}% ${currentRight}% ${currentBottom}% ${currentLeft}%)`,
      transform: `translate3d(${dx * u}px, ${dy * u}px, 0) scale(${1 + (scale - 1) * u})`,
    };
  };
}

// OUT animation from Pinterest - for exit mode
function createDetailOutParams({
  detailRect: fromRect,
  galleryRect: toRect,
  pageRect,
  scrollOffset,
}: {
  detailRect: DOMRect;
  galleryRect: DOMRect;
  pageRect: DOMRect;
  scrollOffset: { x: number; y: number };
}): AnimationParams {
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

  const scaleX = toRect.width / fromRect.width;
  const scaleY = toRect.height / fromRect.height;
  const scale = Math.min(scaleX, scaleY);

  const startTop = (fromRect.top / pageRect.height) * 100;
  const startRight =
    ((pageRect.width - (fromRect.left + fromRect.width)) / pageRect.width) *
    100;
  const startBottom =
    ((pageRect.height - (fromRect.top + fromRect.height)) / pageRect.height) *
    100;
  const startLeft = (fromRect.left / pageRect.width) * 100;

  return {
    dx,
    dy,
    scale,
    scrollOffset,
    transformOrigin: `${fromRect.left + fromRect.width / 2}px ${fromRect.top + fromRect.height / 2}px`,
    startTop,
    startRight,
    startBottom,
    startLeft,
  };
}

function createDetailOutCss(params: AnimationParams): CssAnimationFunc {
  const {
    dx,
    dy,
    scale,
    scrollOffset,
    startTop,
    startRight,
    startBottom,
    startLeft,
  } = params;

  return (progress: number): StyleObject => {
    const t = 1 - progress;
    const currentTop = startTop! * t;
    const currentRight = startRight! * t;
    const currentBottom = startBottom! * t;
    const currentLeft = startLeft! * t;

    return {
      clipPath: `inset(${currentTop}% ${currentRight}% ${currentBottom}% ${currentLeft}%)`,
      transform: `translate3d(${dx * t - scrollOffset.x}px, ${dy * t - scrollOffset.y}px, 0) scale(${1 + (scale - 1) * t})`,
    };
  };
}

interface AnimationHandlers {
  isEnterMode: boolean;
  inCss?: CssAnimationFunc;
  outCss?: CssAnimationFunc;
  inTransformOrigin?: string;
  outTransformOrigin?: string;
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

  // Return appropriate animation functions based on mode
  // enterMode: use IN animation (Detail animates in), OUT stays
  // exitMode: use OUT animation (Detail animates out), IN stays
  if (isEnterMode) {
    const inParams = createDetailInParams({
      detailRect,
      galleryRect,
      pageRect: toNode.getBoundingClientRect(),
      scrollOffset,
    });
    return {
      isEnterMode: true,
      inCss: createDetailInCss(inParams),
      inTransformOrigin: inParams.transformOrigin,
      // No outCss - gallery stays visible
    };
  } else {
    const outParams = createDetailOutParams({
      detailRect,
      galleryRect,
      pageRect: fromNode.getBoundingClientRect(),
      scrollOffset,
    });
    return {
      isEnterMode: false,
      outCss: createDetailOutCss(outParams),
      outTransformOrigin: outParams.transformOrigin,
      // No inCss - gallery stays visible
    };
  }
}

export const instagram = (options: InstagramOptions = {}): SggoiTransition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 150,
    damping: options.spring?.damping ?? 20,
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
          css: () => ({}),
        };
      }

      // Detect and prepare animation handlers with saved scrollOffset
      handlers = createAnimationConfig(fromNode, toNode, scrollOffset);
      if (!handlers) {
        return {
          spring,
          css: () => ({}),
        };
      }

      // Reset fromNode for next transition
      fromNode = null;

      return {
        spring,
        prepare: () => {
          if (handlers?.inCss) {
            // GPU acceleration hints
            element.style.willChange = "transform, clip-path";
            element.style.backfaceVisibility = "hidden";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "layout paint";
            if (handlers.inTransformOrigin) {
              element.style.transformOrigin = handlers.inTransformOrigin;
            }
          }
        },
        css: (progress): StyleObject => {
          // Use inCss if available (enterMode), otherwise return empty
          if (handlers?.inCss) {
            return handlers.inCss(progress);
          }
          return {};
        },
        onEnd: () => {
          if (handlers?.inCss) {
            element.style.willChange = "auto";
            element.style.backfaceVisibility = "";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "";
            element.style.transformOrigin = "";
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
        prepare: (el) => {
          prepareOutgoing(el);
          if (!handlers?.isEnterMode) {
            el.style.zIndex = "-1";
          }
          if (handlers?.outCss) {
            // GPU acceleration hints
            el.style.willChange = "transform, clip-path";
            el.style.backfaceVisibility = "hidden";
            (el.style as CSSStyleDeclaration & { contain: string }).contain =
              "layout paint";
            el.style.pointerEvents = "none";
            if (handlers.outTransformOrigin) {
              el.style.transformOrigin = handlers.outTransformOrigin;
            }
          }
        },
        css: (progress): StyleObject => {
          // Use outCss if available (exitMode), otherwise return empty
          if (handlers?.outCss) {
            return handlers.outCss(progress);
          }
          return {};
        },
      };
    },
  };
};
