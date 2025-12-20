import type {
  SpringConfig,
  SggoiTransition,
  SggoiTransitionContext,
  StyleObject,
} from "../types";
import { getRect } from "../utils/get-rect";
import { prepareOutgoing } from "../utils/prepare-outgoing";

const ENTER_SPRING: SpringConfig = {
  stiffness: 140,
  damping: 15,
  doubleSpring: 0.5,
};

const EXIT_SPRING: SpringConfig = {
  stiffness: 145,
  damping: 15,
  doubleSpring: 0.5,
};

interface SheetOptions {
  direction?: "enter" | "exit";
  spring?: Partial<SpringConfig>;
}

/**
 * Calculate the viewport rect for sheet transition
 */
function getSheetRect(context: SggoiTransitionContext) {
  const containerRect = getRect(document.body, context.positionedParent);
  const top = context.scroll.y;

  // Calculate viewport height considering container offset (like jaemin.ts)
  const viewportHeight = window.innerHeight - containerRect.top;

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
  const defaultSpring = direction === "enter" ? ENTER_SPRING : EXIT_SPRING;
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? defaultSpring.stiffness,
    damping: options.spring?.damping ?? defaultSpring.damping,
    doubleSpring: options.spring?.doubleSpring ?? defaultSpring.doubleSpring,
  };

  if (direction === "enter") {
    // Forward: Sheet enters from bottom, background scales down
    return {
      // Entering sheet: slides up from bottom
      in: (element, context) => {
        const rect = getSheetRect(context);
        const viewportHeight = rect.height;

        return {
          spring,
          prepare: () => {
            element.style.willChange = "transform";
            element.style.backfaceVisibility = "hidden";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "layout paint";
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
          },
        };
      },
      // Exiting background: scales down with fade
      out: (_element, context) => {
        const rect = getSheetRect(context);
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2 + context.scrollOffset.y;

        return {
          spring,
          prepare: (el) => {
            prepareOutgoing(el, context);
            el.style.zIndex = "-1";
            el.style.willChange = "transform, opacity";
            el.style.backfaceVisibility = "hidden";
            (el.style as CSSStyleDeclaration & { contain: string }).contain =
              "layout paint";
            el.style.pointerEvents = "none";
            el.style.transformOrigin = `${centerX}px ${centerY}px`;
          },
          css: (progress): StyleObject => ({
            transform: `scale(${0.8 + progress * 0.2})`,
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
        const rect = getSheetRect(context);
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        return {
          spring,
          prepare: () => {
            element.style.willChange = "transform, opacity";
            element.style.backfaceVisibility = "hidden";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "layout paint";
            element.style.transformOrigin = `${centerX}px ${centerY}px`;
          },
          css: (progress): StyleObject => ({
            transform: `scale(${0.8 + progress * 0.2})`,
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
      out: (_element, context) => {
        const rect = getSheetRect(context);
        const viewportHeight = rect.height;

        return {
          spring,
          prepare: (el) => {
            prepareOutgoing(el, context);
            el.style.zIndex = "100";
            el.style.willChange = "transform";
            el.style.backfaceVisibility = "hidden";
            (el.style as CSSStyleDeclaration & { contain: string }).contain =
              "layout paint";
            el.style.pointerEvents = "none";
          },
          css: (progress): StyleObject => ({
            transform: `translate3d(0, ${(1 - progress) * viewportHeight}px, 0)`,
          }),
        };
      },
    };
  }
};
