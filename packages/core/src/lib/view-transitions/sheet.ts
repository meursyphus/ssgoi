import type {
  PhysicsOptions,
  SggoiTransition,
  SggoiTransitionContext,
  StyleObject,
} from "../types";
import { getRect } from "../utils/get-rect";
import { prepareOutgoing } from "../utils/prepare-outgoing";

// ease-out (Material decelerated): sheet rises and lands gracefully (incoming).
// 200/24 = ratio 0.85 of critical (~28.3), ~290ms.
const ENTER: PhysicsOptions = {
  spring: {
    stiffness: 200,
    damping: 24,
  },
};

// ease-in (Material accelerated): sheet falls away (outgoing).
// Spring can't produce true ease-in (always decelerative); inertia integrator
// starts at v=0 and accelerates toward target — natural acceleration curve.
const EXIT: PhysicsOptions = {
  inertia: {
    acceleration: 25,
    resistance: 1.2,
  },
};

/** Default scale offset for sheet effect (20% = 0.2) */
const DEFAULT_SCALE_OFFSET = 0.2;

interface SheetOptions {
  direction?: "enter" | "exit";
  physics?: PhysicsOptions;
  /** Scale offset as a fraction (default: 0.2 = 20%) */
  scaleOffset?: number;
}

/**
 * Calculate the viewport rect for sheet transition
 */
function getSheetRect(context: SggoiTransitionContext) {
  const containerRect = getRect(document.body, context.positionedParent);
  const top = context.scroll.y;

  // Calculate viewport height considering container offset
  const viewportHeight =
    context.scrollingElement.offsetHeight - containerRect.top;

  return {
    top,
    left: 0,
    width: containerRect.width,
    height: viewportHeight,
  };
}

/**
 * Mobile-optimized bottom sheet style transition
 *
 * Enter direction (forward navigation):
 * - IN: Sheet slides up from bottom
 * - OUT: Background page scales down (1 → 0.8) with fade
 *
 * Exit direction (back navigation):
 * - IN: Background page scales up (0.8 → 1) with fade
 * - OUT: Sheet slides down with high z-index
 */
export const sheet = (options: SheetOptions = {}): SggoiTransition => {
  const { direction = "enter" } = options;
  const physicsOptions =
    options.physics ?? (direction === "enter" ? ENTER : EXIT);
  const scaleOffset = options.scaleOffset ?? DEFAULT_SCALE_OFFSET;

  if (direction === "enter") {
    // Forward: Sheet enters from bottom, background scales down
    return {
      // Entering sheet: slides up from bottom
      in: (element, context) => {
        const rect = getSheetRect(context);
        const viewportHeight = rect.height;
        const visibleTop = context.scroll.y;

        return {
          physics: physicsOptions,
          prepare: () => {
            element.style.willChange = "transform";
            element.style.backfaceVisibility = "hidden";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "layout paint";
            // Clip the sheet to its viewport-aligned slice so translate3d only
            // shows the slice the user was looking at, not the rest of the page.
            element.style.clipPath = `inset(${visibleTop}px 0 calc(100% - ${visibleTop + viewportHeight}px) 0)`;
          },
          css: (progress): StyleObject => ({
            transform: `translate3d(0, ${(1 - progress) * viewportHeight}px, 0)`,
          }),
          onEnd: () => {
            element.style.willChange = "auto";
            element.style.backfaceVisibility = "";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "";
            element.style.clipPath = "";
          },
        };
      },
      // Exiting background: scales down with fade
      out: (element, context) => {
        const rect = getSheetRect(context);
        const centerX = rect.left + rect.width / 2;
        // After prepareOutgoing applies top:-scrollOffset.y, the element's
        // visible slice in element-local coords is S_from..S_from+viewportH;
        // its center is rect.top+rect.height/2 (rect.top = context.scroll.y =
        // S_from). Adding scrollOffset.y here would double-count the same
        // compensation prepareOutgoing already does.
        const centerY = rect.top + rect.height / 2;

        return {
          physics: physicsOptions,
          prepare: () => {
            prepareOutgoing(element, context);
            element.style.zIndex = "-1";
            element.style.willChange = "transform, opacity";
            element.style.backfaceVisibility = "hidden";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "layout paint";
            element.style.pointerEvents = "none";
            element.style.transformOrigin = `${centerX}px ${centerY}px`;
          },
          css: (progress): StyleObject => ({
            transform: `scale(${1 - scaleOffset + progress * scaleOffset})`,
            opacity: progress,
          }),
        };
      },
    };
  } else {
    // Exit direction: Sheet exits down, background scales up
    return {
      // Entering background: scales up with fade
      in: (element, context) => {
        const centerX = (() => {
          const rect = getSheetRect(context);
          return rect.left + rect.width / 2;
        })();

        return {
          physics: physicsOptions,
          prepare: () => {
            element.style.willChange = "transform, opacity";
            element.style.backfaceVisibility = "hidden";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "layout paint";
            // Read live geometry so the origin stays at viewport center even if
            // scroll restoration to S_to hasn't landed yet at prepare time.
            const visualRect = element.getBoundingClientRect();
            const localCenterY = window.innerHeight / 2 - visualRect.top;
            element.style.transformOrigin = `${centerX}px ${localCenterY}px`;
          },
          css: (progress): StyleObject => ({
            transform: `scale(${1 - scaleOffset + progress * scaleOffset})`,
            opacity: progress,
          }),
          onEnd: () => {
            element.style.willChange = "auto";
            element.style.backfaceVisibility = "";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "";
            element.style.transformOrigin = "";
          },
        };
      },
      // Exiting sheet: slides down with high z-index
      out: (element, context) => {
        const rect = getSheetRect(context);
        const viewportHeight = rect.height;
        const visibleTop = context.scroll.y;

        return {
          physics: physicsOptions,
          prepare: () => {
            prepareOutgoing(element, context);
            element.style.zIndex = "100";
            element.style.willChange = "transform";
            element.style.backfaceVisibility = "hidden";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "layout paint";
            element.style.pointerEvents = "none";
            element.style.clipPath = `inset(${visibleTop}px 0 calc(100% - ${visibleTop + viewportHeight}px) 0)`;
          },
          css: (progress): StyleObject => ({
            transform: `translate3d(0, ${(1 - progress) * viewportHeight}px, 0)`,
          }),
        };
      },
    };
  }
};
