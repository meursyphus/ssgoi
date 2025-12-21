import type {
  SpringConfig,
  SggoiTransition,
  SggoiTransitionContext,
  StyleObject,
} from "../types";
import { getRect } from "../utils/get-rect";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { withResolvers } from "../utils";

const SPRING: SpringConfig = {
  stiffness: 300,
  damping: 22,
  doubleSpring: 0.5,
};

/** Scale offset for swap effect (5% = 0.05) */
const SCALE_OFFSET = 0.05;

interface SwapOptions {
  spring?: Partial<SpringConfig>;
}

/**
 * Calculate the viewport rect for swap transition
 */
function getSwapRect(context: SggoiTransitionContext) {
  const containerRect = getRect(document.body, context.positionedParent);
  const top = context.scroll.y;

  // Calculate viewport height considering container offset
  const viewportHeight = window.innerHeight - containerRect.top;

  return {
    top,
    left: 0,
    width: containerRect.width,
    height: viewportHeight,
  };
}

/**
 * Swap transition for peer-level navigation (e.g. bottom tabs)
 *
 * - OUT: Fade out only (no scale)
 * - IN: Scale up from smaller + fade in (waits for OUT to complete)
 */
export const swap = (options: SwapOptions = {}): SggoiTransition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? SPRING.stiffness,
    damping: options.spring?.damping ?? SPRING.damping,
    doubleSpring: options.spring?.doubleSpring ?? SPRING.doubleSpring,
  };

  // Shared promise for coordinating OUT and IN animations
  let { promise: outAnimationComplete, resolve: resolveOutAnimation } =
    withResolvers<void>();

  return {
    // Entering page: scales up from small (0.95 → 1) with fade in
    in: (element, context) => {
      const rect = getSwapRect(context);
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      return {
        physics: { spring },
        prepare: () => {
          element.style.opacity = "0";
          element.style.willChange = "transform, opacity";
          element.style.backfaceVisibility = "hidden";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          element.style.transformOrigin = `${centerX}px ${centerY}px`;
        },
        wait: async () => {
          if (outAnimationComplete) {
            await outAnimationComplete;
            const newResolvers = withResolvers<void>();
            outAnimationComplete = newResolvers.promise;
            resolveOutAnimation = newResolvers.resolve;
          }
        },
        css: (progress): StyleObject => ({
          transform: `scale(${1 - SCALE_OFFSET + progress * SCALE_OFFSET})`,
          opacity: progress,
        }),
        onEnd: () => {
          element.style.opacity = "1";
          element.style.willChange = "auto";
          element.style.backfaceVisibility = "";
          (element.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
          element.style.transformOrigin = "";
        },
      };
    },
    // Exiting page: fade out only (no scale)
    out: (_element, context) => {
      return {
        physics: { spring },
        prepare: (el) => {
          prepareOutgoing(el, context);
          el.style.willChange = "opacity";
          el.style.backfaceVisibility = "hidden";
          (el.style as CSSStyleDeclaration & { contain: string }).contain =
            "layout paint";
          el.style.pointerEvents = "none";
        },
        css: (progress): StyleObject => ({
          opacity: progress,
        }),
        onEnd: () => {
          if (resolveOutAnimation) {
            resolveOutAnimation();
          }
        },
      };
    },
  };
};
