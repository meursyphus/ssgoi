import type { Transition, SpringConfig } from "../types";
import { prepareOutgoing } from "./utils";

interface HeroOptions {
  spring?: Partial<SpringConfig>;
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

  let fromNode: HTMLElement | null = null;
  let toNode: HTMLElement | null = null;

  return {
    in: (element) => {
      toNode = element;
      
      return {
        spring,
        tick: (progress) => {
          if (!fromNode || !toNode) {
            // Default fade in if no matching hero element
            element.style.opacity = progress.toString();
            return;
          }

          const commonKey = findCommonKey(fromNode, toNode);
          if (!commonKey) {
            element.style.opacity = progress.toString();
            return;
          }

          const fromEl = getHeroEl(fromNode, commonKey);
          const toEl = getHeroEl(toNode, commonKey);

          if (!fromEl || !toEl) {
            element.style.opacity = progress.toString();
            return;
          }

          // Apply hero animation to the matched element
          const fromRect = getRect(fromNode, fromEl);
          const toRect = getRect(toNode, toEl);
          
          const dx = fromRect.left - toRect.left;
          const dy = fromRect.top - toRect.top;
          const dw = fromRect.width / toRect.width;
          const dh = fromRect.height / toRect.height;

          // Animate the hero element
          const currentStyle = toEl.getAttribute('style') || '';
          toEl.setAttribute(
            'style',
            `${currentStyle}
            position: relative;
            transform-origin: top left;
            transform: translate(${(1 - progress) * dx}px,${(1 - progress) * dy}px) scale(${progress + (1 - progress) * dw}, ${progress + (1 - progress) * dh});
            `
          );

          // Fade in the rest of the page
          element.style.opacity = progress.toString();
        },
        onEnd: () => {
          fromNode = null;
          // Reset hero element styles
          if (toNode) {
            const commonKey = findCommonKey(fromNode || toNode, toNode);
            if (commonKey) {
              const toEl = getHeroEl(toNode, commonKey);
              if (toEl) {
                toEl.style.transform = '';
                toEl.style.position = '';
                toEl.style.transformOrigin = '';
              }
            }
          }
        }
      };
    },
    out: (element) => {
      fromNode = element;
      
      return {
        spring,
        tick: (progress) => {
          // Just fade out for the outgoing page
          element.style.opacity = progress.toString();
        },
        prepare: prepareOutgoing,
      };
    },
  };
};