import type { SpringConfig, SggoiTransition } from "../types";
import { prepareOutgoing } from "../utils";

interface HeroOptions {
  spring?: Partial<SpringConfig>;
  timeout?: number;
}

function getHeroEl(page: HTMLElement, key: string): HTMLElement | null {
  return page.querySelector(`[data-hero-key="${key}"]`);
}

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

export const hero = (options: HeroOptions = {}): SggoiTransition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 300,
    damping: options.spring?.damping ?? 30,
  };
  const timeout = options.timeout ?? 300;

  // Closure variables to share state between in/out
  let fromNode: HTMLElement | null = null;
  let resolver: ((value: boolean) => void) | null = null;

  return {
    in: async (element, context) => {
      const toNode = element;

      // Find all hero elements in the incoming page
      const heroEls = Array.from(toNode.querySelectorAll("[data-hero-key]"));
      if (heroEls.length === 0) {
        return {
          spring,
          tick: () => {}, // No hero elements, skip animation
        };
      }

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
          tick: () => {}, // No fromNode, skip animation
        };
      }

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
          };
        })
        .filter(Boolean) as Array<{
        toEl: HTMLElement;
        dx: number;
        dy: number;
        dw: number;
        dh: number;
        originalTransform: string;
        originalPosition: string;
        originalTransformOrigin: string;
        originalZIndex: string;
      }>;

      // Reset fromNode for next transition
      fromNode = null;

      if (heroAnimations.length === 0) {
        return {
          spring,
          tick: () => {}, // No matching hero elements
        };
      }

      return {
        spring,
        prepare: () => {
          heroAnimations.forEach(({ toEl }) => {
            toEl.style.position = "relative";
            toEl.style.transformOrigin = "top left";
            toEl.style.zIndex = "1000";
          });
        },
        tick: (progress) => {
          // Animate all hero elements
          heroAnimations.forEach(({ toEl, dx, dy, dw, dh }) => {
            toEl.style.transform = `translate(${(1 - progress) * dx}px,${(1 - progress) * dy}px) scale(${progress + (1 - progress) * dw}, ${progress + (1 - progress) * dh})`;
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
            }) => {
              toEl.style.transform = originalTransform;
              toEl.style.position = originalPosition;
              toEl.style.transformOrigin = originalTransformOrigin;
              toEl.style.zIndex = originalZIndex;
            }
          );
        },
      };
    },
    out: async (element) => {
      return {
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
          element.style.opacity = "0";
        },
      };
    },
  };
};
