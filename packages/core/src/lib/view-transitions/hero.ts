import type { SggoiTransition, PhysicsOptions } from "../types";
import { prepareOutgoing } from "../utils/prepare-outgoing";
import { getRect } from "../utils/get-rect";
import { withResolvers } from "../utils/with-resolvers";

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 300, damping: 30 },
};

interface HeroOptions {
  physics?: PhysicsOptions;
  timeout?: number;
  maxDistance?: number;
}

function getHeroEl(page: HTMLElement, key: string): HTMLElement | null {
  return page.querySelector(`[data-hero-key="${key}"]`);
}

export const hero = (options: HeroOptions = {}): SggoiTransition => {
  const physicsOptions: PhysicsOptions = options.physics ?? DEFAULT_PHYSICS;
  const maxDistance = options.maxDistance ?? 700;

  // Closure variables to share state between in/out
  let fromNode: HTMLElement | null = null;
  let fromNodeReady = withResolvers<void>();

  return {
    in: async (element, context) => {
      const toNode = element;

      // Find all hero elements in the incoming page
      const heroEls = Array.from(toNode.querySelectorAll("[data-hero-key]"));

      // Wait for fromNode to be set by out transition
      await fromNodeReady.promise;

      // Calculate animations for matching hero elements
      const heroAnimations = heroEls
        .map((heroEl) => {
          const key = heroEl.getAttribute("data-hero-key");
          if (!key) return null;

          const fromEl = getHeroEl(fromNode!, key);
          if (!fromEl) return null;

          const toEl = heroEl as HTMLElement;

          // Calculate animation parameters
          const fromRect = getRect(fromNode!, fromEl);
          const toRect = getRect(toNode, toEl);
          const dx = fromRect.left - toRect.left - context.scrollOffset.x;
          const dy = fromRect.top - toRect.top - context.scrollOffset.y;
          const dw = fromRect.width / toRect.width;
          const dh = fromRect.height / toRect.height;

          // Store original styles
          const originalTransform = toEl.style.transform;
          const originalPosition = toEl.style.position;
          const originalTransformOrigin = toEl.style.transformOrigin;
          const originalZIndex = toEl.style.zIndex;
          const originalWillChange = toEl.style.willChange;

          return {
            toEl,
            dx,
            dy,
            dw,
            dh,
            originalTransform,
            originalPosition,
            originalTransformOrigin,
            originalZIndex,
            originalWillChange,
          };
        })
        .filter(
          (
            animation,
          ): animation is {
            toEl: HTMLElement;
            dx: number;
            dy: number;
            dw: number;
            dh: number;
            originalTransform: string;
            originalPosition: string;
            originalTransformOrigin: string;
            originalZIndex: string;
            originalWillChange: string;
          } => animation !== null && Math.abs(animation.dy) <= maxDistance,
        );

      // Reset for next transition
      fromNode = null;
      fromNodeReady = withResolvers<void>();

      if (heroAnimations.length === 0) {
        return {
          physics: physicsOptions,
          tick: () => {}, // No matching hero elements
        };
      }

      return {
        items: heroAnimations.map(({ toEl, dx, dy, dw, dh }) => ({
          physics: physicsOptions,
          tick: (progress: number) => {
            toEl.style.transform = `translate(${(1 - progress) * dx}px, ${(1 - progress) * dy}px) scale(${progress + (1 - progress) * dw}, ${progress + (1 - progress) * dh})`;
          },
        })),
        schedule: "parallel" as const,
        prepare: () => {
          heroAnimations.forEach(({ toEl }) => {
            toEl.style.position = "relative";
            toEl.style.transformOrigin = "top left";
            toEl.style.zIndex = "1000";
            toEl.style.willChange = "transform";
          });
        },
        onEnd: () => {
          // Reset all hero elements
          heroAnimations.forEach(
            ({
              toEl,
              originalTransform,
              originalPosition,
              originalTransformOrigin,
              originalZIndex,
              originalWillChange,
            }) => {
              toEl.style.transform = originalTransform;
              toEl.style.position = originalPosition;
              toEl.style.transformOrigin = originalTransformOrigin;
              toEl.style.zIndex = originalZIndex;
              toEl.style.willChange = originalWillChange;
            },
          );
        },
      };
    },
    out: async (element) => {
      return {
        physics: physicsOptions,
        onStart: () => {
          // Store fromNode and resolve the waiting promise
          fromNode = element;
          fromNodeReady.resolve();
        },
        tick: () => {},
        prepare: (element) => {
          prepareOutgoing(element);
          element.style.opacity = "0";
        },
      };
    },
  };
};
