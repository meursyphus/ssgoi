import type { Transition, SpringConfig } from "../types";
import { prepareOutgoing } from "./utils";

interface HeroOptions {
  spring?: Partial<SpringConfig>;
  timeout?: number;
}

interface HeroState {
  fromNode: HTMLElement | null;
  toNode: HTMLElement | null;
  resolver: ((node: HTMLElement | null) => void) | null;
  timeoutId: ReturnType<typeof setTimeout> | null;
}

// Global store for hero transitions by key
const heroStates = new Map<string, HeroState>();

function getOrCreateHeroState(key: string): HeroState {
  if (!heroStates.has(key)) {
    heroStates.set(key, {
      fromNode: null,
      toNode: null,
      resolver: null,
      timeoutId: null
    });
  }
  return heroStates.get(key)!;
}

function cleanupHeroState(key: string) {
  const state = heroStates.get(key);
  if (state?.timeoutId) {
    clearTimeout(state.timeoutId);
  }
  heroStates.delete(key);
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

function registerHeroElements(node: HTMLElement, direction: 'from' | 'to') {
  const heroEls = Array.from(node.querySelectorAll('[data-hero-key]'));
  
  heroEls.forEach((heroEl) => {
    const key = heroEl.getAttribute('data-hero-key');
    if (!key) return;

    const state = getOrCreateHeroState(key);
    
    if (direction === 'from') {
      state.fromNode = node;
      
      // Resolve if there's a waiting promise
      if (state.resolver) {
        state.resolver(node);
        state.resolver = null;
        if (state.timeoutId) {
          clearTimeout(state.timeoutId);
          state.timeoutId = null;
        }
      }
    } else {
      state.toNode = node;
    }
  });
  
  return heroEls;
}

export const hero = (options: HeroOptions = {}): Transition => {
  const spring: SpringConfig = {
    stiffness: options.spring?.stiffness ?? 300,
    damping: options.spring?.damping ?? 30,
  };
  const timeout = options.timeout ?? 300;

  return {
    in: async (element) => {
      const toNode = element;
      
      // Register all hero elements in the incoming page
      const heroEls = registerHeroElements(toNode, 'to');
      if (heroEls.length === 0) {
        return {
          spring,
          tick: () => {}, // No hero elements, skip animation
        };
      }

      // Wait for fromNode for each hero element
      const heroAnimations = await Promise.all(
        heroEls.map(async (heroEl) => {
          const key = heroEl.getAttribute('data-hero-key');
          if (!key) return null;

          const state = getOrCreateHeroState(key);

          // Create promise for this hero element
          const fromNodePromise = new Promise<HTMLElement | null>((resolve) => {
            state.resolver = resolve;
            state.timeoutId = setTimeout(() => {
              resolve(null);
              cleanupHeroState(key);
            }, timeout);
          });

          const fromNode = await fromNodePromise;
          if (!fromNode) {
            cleanupHeroState(key);
            return null;
          }

          const fromEl = getHeroEl(fromNode, key);
          const toEl = heroEl as HTMLElement;

          if (!fromEl) {
            cleanupHeroState(key);
            return null;
          }

          // Calculate animation parameters
          const fromRect = getRect(fromNode, fromEl);
          const toRect = getRect(toNode, toEl);
          
          const dx = fromRect.left - toRect.left;
          const dy = fromRect.top - toRect.top;
          const dw = fromRect.width / toRect.width;
          const dh = fromRect.height / toRect.height;

          // Store original styles
          const originalTransform = toEl.style.transform;
          const originalPosition = toEl.style.position;
          const originalTransformOrigin = toEl.style.transformOrigin;

          return {
            key,
            toEl,
            dx,
            dy,
            dw,
            dh,
            originalTransform,
            originalPosition,
            originalTransformOrigin
          };
        })
      );

      // Filter out null results
      const validAnimations = heroAnimations.filter(Boolean) as Array<{
        key: string;
        toEl: HTMLElement;
        dx: number;
        dy: number;
        dw: number;
        dh: number;
        originalTransform: string;
        originalPosition: string;
        originalTransformOrigin: string;
      }>;

      if (validAnimations.length === 0) {
        return {
          spring,
          tick: () => {}, // No valid animations
        };
      }

      return {
        spring,
        tick: (progress) => {
          // Animate all hero elements
          validAnimations.forEach(({ toEl, dx, dy, dw, dh }) => {
            toEl.style.position = 'relative';
            toEl.style.transformOrigin = 'top left';
            toEl.style.transform = `translate(${(1 - progress) * dx}px,${(1 - progress) * dy}px) scale(${progress + (1 - progress) * dw}, ${progress + (1 - progress) * dh})`;
          });
        },
        onEnd: () => {
          // Reset all hero elements and cleanup
          validAnimations.forEach(({ key, toEl, originalTransform, originalPosition, originalTransformOrigin }) => {
            toEl.style.transform = originalTransform;
            toEl.style.position = originalPosition;
            toEl.style.transformOrigin = originalTransformOrigin;
            cleanupHeroState(key);
          });
        }
      };
    },
    out: async (element) => {
      // Register all hero elements in the outgoing page
      registerHeroElements(element, 'from');
      
      return {
        prepare: (element) => {
          prepareOutgoing(element);
          element.style.opacity = '0'; // Make it invisible immediately
        },
      };
    },
  };
};