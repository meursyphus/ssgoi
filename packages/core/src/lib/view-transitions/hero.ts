import type { Transition, SpringConfig } from "../types";
import { prepareOutgoing } from "./utils";

interface HeroOptions {
  spring?: Partial<SpringConfig>;
  timeout?: number; // timeout for waiting fromNode
}

function getHeroEl(page: HTMLElement, key: string): HTMLElement | null {
  return page.querySelector(`[data-hero-key="${key}"]`);
}

function findCommonKey(fromPage: HTMLElement, toPage: HTMLElement): string | null {
  const fromKeys = new Set(
    Array.from(fromPage.querySelectorAll('[data-hero-key]')).map(el => 
      el.getAttribute('data-hero-key')
    ).filter(Boolean)
  );
  const toKeys = new Set(
    Array.from(toPage.querySelectorAll('[data-hero-key]')).map(el => 
      el.getAttribute('data-hero-key')
    ).filter(Boolean)
  );

  for (const key of fromKeys) {
    if (toKeys.has(key)) {
      return key;
    }
  }
  return null;
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

  let toNode: HTMLElement | null = null;
  let fromNodeResolver: ((node: HTMLElement) => void) | null = null;

  return {
    in: async (element) => {
      toNode = element;
      
      // Wait for fromNode with timeout
      const fromNodePromise = new Promise<HTMLElement | null>((resolve) => {
        // Store the resolver so out transition can trigger it
        fromNodeResolver = resolve;
        
        // Set up timeout fallback
        setTimeout(() => {
          if (fromNodeResolver) {
            fromNodeResolver = null;
            resolve(null);
          }
        }, timeout);
      });

      const resolvedFromNode = await fromNodePromise;
      
      // If no fromNode, just skip animation
      if (!resolvedFromNode || !toNode) {
        return {
          spring,
          tick: () => {}, // Do nothing
        };
      }

      const commonKey = findCommonKey(resolvedFromNode, toNode);
      if (!commonKey) {
        return {
          spring,
          tick: () => {}, // Do nothing
        };
      }

      const fromEl = getHeroEl(resolvedFromNode, commonKey);
      const toEl = getHeroEl(toNode, commonKey);

      if (!fromEl || !toEl) {
        return {
          spring,
          tick: () => {}, // Do nothing
        };
      }

      // Calculate positions once, outside of tick
      const fromRect = getRect(resolvedFromNode, fromEl);
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
        spring,
        tick: (progress) => {
          if (!toEl) return;
          
          // Animate the hero element only
          toEl.style.position = 'relative';
          toEl.style.transformOrigin = 'top left';
          toEl.style.transform = `translate(${(1 - progress) * dx}px,${(1 - progress) * dy}px) scale(${progress + (1 - progress) * dw}, ${progress + (1 - progress) * dh})`;
        },
        onEnd: () => {
          // Reset hero element styles
          if (toEl) {
            toEl.style.transform = originalTransform;
            toEl.style.position = originalPosition;
            toEl.style.transformOrigin = originalTransformOrigin;
          }
        }
      };
    },
    out: async (element) => {
      // Trigger the promise resolver if in transition is waiting
      if (fromNodeResolver) {
        fromNodeResolver(element);
        fromNodeResolver = null;
      }
      
      return {
        // No spring needed for out
        tick: () => {}, // Do nothing - let prepareOutgoing handle visibility
        prepare: (element) => {
          prepareOutgoing(element);
          element.style.opacity = '0'; // Make it invisible immediately
        },
      };
    },
  };
};