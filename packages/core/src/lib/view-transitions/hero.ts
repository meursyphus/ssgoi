import type { Transition, SpringConfig } from "../types";
import { prepareOutgoing, getScrollingElement } from "./utils";

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

export const hero = (options: HeroOptions = {}): Transition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 300,
    damping: options.spring?.damping ?? 30,
  };
  const timeout = options.timeout ?? 300;

  // Closure variables to share state between in/out
  let fromNode: HTMLElement | null = null;
  let resolver: ((value: boolean) => void) | null = null;
  let scrollContainer: HTMLElement | null = null;
  const fromScroll = { top: 0, left: 0 };
  let scrollListener: (() => void) | null = null;
  let isListening = false;

  return {
    in: async (element) => {
      const toNode = element;

      // Initialize scroll container and listener once (lazy initialization)
      if (!scrollContainer) {
        scrollContainer = getScrollingElement(toNode);

        // Create scroll listener
        scrollListener = () => {
          if (scrollContainer) {
            fromScroll.top = scrollContainer.scrollTop;
            fromScroll.left = scrollContainer.scrollLeft;
          }
        };
      }

      // Start listening if not already
      if (!isListening && scrollContainer && scrollListener) {
        scrollContainer.addEventListener("scroll", scrollListener, {
          passive: true,
        });
        isListening = true;
        // Initialize current scroll position
        fromScroll.top = scrollContainer.scrollTop;
        fromScroll.left = scrollContainer.scrollLeft;
      }

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

          // Calculate scroll offset difference if scroll container exists
          let scrollOffsetX = 0;
          let scrollOffsetY = 0;

          if (scrollContainer) {
            const currentScrollTop = scrollContainer.scrollTop;
            const currentScrollLeft = scrollContainer.scrollLeft;
            scrollOffsetX = currentScrollLeft - fromScroll.left;
            scrollOffsetY = currentScrollTop - fromScroll.top;
          }

          const dx = fromRect.left - toRect.left + scrollOffsetX;
          const dy = fromRect.top - toRect.top + scrollOffsetY;
          const dw = fromRect.width / toRect.width;
          const dh = fromRect.height / toRect.height;

          // Store original styles
          const originalTransform = toEl.style.transform;
          const originalPosition = toEl.style.position;
          const originalTransformOrigin = toEl.style.transformOrigin;

          return {
            toEl,
            dx,
            dy,
            dw,
            dh,
            originalTransform,
            originalPosition,
            originalTransformOrigin,
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
            }) => {
              toEl.style.transform = originalTransform;
              toEl.style.position = originalPosition;
              toEl.style.transformOrigin = originalTransformOrigin;
            }
          );
        },
      };
    },
    out: async (element) => {
      if (isListening) {
        setTimeout(() => {
          if (scrollContainer && scrollListener) {
            scrollContainer.removeEventListener("scroll", scrollListener);
            isListening = false;
          }
        }, 0);
      }

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
