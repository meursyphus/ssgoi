import type {
  SpringConfig,
  SggoiTransition,
  SggoiTransitionContext,
  StyleObject,
} from "../types";
import { getRect } from "../utils/get-rect";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { withResolvers } from "../utils";

const ENTER_SPRING: SpringConfig = {
  stiffness: 300,
  damping: 22,
  doubleSpring: 0.5,
};

const EXIT_SPRING: SpringConfig = {
  stiffness: 300,
  damping: 22,
  doubleSpring: 0.5,
};

/** Scale offset for depth effect (10% = 0.1) */
const SCALE_OFFSET = 0.05;

interface DepthOptions {
  direction?: "enter" | "exit";
  spring?: Partial<SpringConfig>;
}

/**
 * Calculate the viewport rect for depth transition
 */
function getDepthRect(context: SggoiTransitionContext) {
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
 * Material Design Z-Axis depth transition
 *
 * Enter direction (forward navigation):
 * - IN: New page scales up from 0.8 → 1 with fade in (coming forward)
 * - OUT: Old page scales up to 1.2 with fade out (going backward), z-index: -1
 *
 * Exit direction (back navigation):
 * - IN: Returning page scales down from 1.2 → 1 with fade in (coming forward from behind)
 * - OUT: Current page scales down to 0.8 with fade out (going backward), z-index: 100
 */
export const depth = (options: DepthOptions = {}): SggoiTransition => {
  const { direction = "enter" } = options;
  const defaultSpring = direction === "enter" ? ENTER_SPRING : EXIT_SPRING;
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? defaultSpring.stiffness,
    damping: options.spring?.damping ?? defaultSpring.damping,
    doubleSpring: options.spring?.doubleSpring ?? defaultSpring.doubleSpring,
  };

  // Shared promise for coordinating OUT and IN animations
  let { promise: outAnimationComplete, resolve: resolveOutAnimation } =
    withResolvers<void>();

  if (direction === "enter") {
    // Forward: New page comes forward from small, old page goes back and grows
    return {
      // Entering page: scales up from small (0.8 → 1) with fade in
      in: (element, context) => {
        const rect = getDepthRect(context);
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        return {
          physics: { spring },
          prepare: () => {
            element.style.opacity = "0";
            element.style.willChange = "transform, opacity";
            element.style.backfaceVisibility = "hidden";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "layout paint";
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
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "";
            element.style.transformOrigin = "";
          },
        };
      },
      // Exiting page: scales up (1 → 1.2) with fade out, goes to back
      out: (_element, context) => {
        const rect = getDepthRect(context);
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2 + context.scrollOffset.y;

        return {
          physics: { spring },
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
            transform: `scale(${1 + (1 - progress) * SCALE_OFFSET})`,
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
  } else {
    // Exit direction: Current page scales down to back, returning page scales down from large
    return {
      // Entering page: scales down from large (1.2 → 1) with fade in
      in: (element, context) => {
        const rect = getDepthRect(context);
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        return {
          physics: { spring },
          prepare: () => {
            element.style.opacity = "0";
            element.style.willChange = "transform, opacity";
            element.style.backfaceVisibility = "hidden";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "layout paint";
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
            transform: `scale(${1 + SCALE_OFFSET - progress * SCALE_OFFSET})`,
            opacity: progress,
          }),
          onEnd: () => {
            element.style.opacity = "1";
            element.style.willChange = "auto";
            element.style.backfaceVisibility = "";
            (
              element.style as CSSStyleDeclaration & { contain: string }
            ).contain = "";
            element.style.transformOrigin = "";
          },
        };
      },
      // Exiting page: scales down to small (1 → 0.8) with fade out
      out: (_element, context) => {
        const rect = getDepthRect(context);
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2 + context.scrollOffset.y;

        return {
          physics: { spring },
          prepare: (el) => {
            prepareOutgoing(el, context);
            el.style.zIndex = "100";
            el.style.willChange = "transform, opacity";
            el.style.backfaceVisibility = "hidden";
            (el.style as CSSStyleDeclaration & { contain: string }).contain =
              "layout paint";
            el.style.pointerEvents = "none";
            el.style.transformOrigin = `${centerX}px ${centerY}px`;
          },
          css: (progress): StyleObject => ({
            transform: `scale(${1 - (1 - progress) * SCALE_OFFSET})`,
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
  }
};
