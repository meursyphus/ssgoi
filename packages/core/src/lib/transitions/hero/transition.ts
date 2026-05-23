import type { PhysicsOptions, TransitionConfig } from "@types";
import { getRect } from "@utils";
import {
  Animation,
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 300, damping: 30 },
};

const HERO_ENTER_KEY = "data-hero-enter-key";
const HERO_EXIT_KEY = "data-hero-exit-key";
const HERO_LEGACY_KEY = "data-hero-key";

export interface HeroOptions {
  physics?: PhysicsOptions;
  maxDistance?: number;
}

function getHeroEl(page: HTMLElement, key: string): HTMLElement | null {
  return page.querySelector(`[${HERO_LEGACY_KEY}="${key}"]`);
}

type HeroPair = {
  toEl: HTMLElement;
  fromEl: HTMLElement;
  key: string;
};

/**
 * Build a `key → element` map for every element on `page` carrying `attr`.
 * If the same key appears twice on one side we keep the first match
 * (mirroring `querySelector` semantics) and silently ignore duplicates.
 */
function collectByAttr(
  page: HTMLElement,
  attr: string,
): Map<string, HTMLElement> {
  const map = new Map<string, HTMLElement>();
  const nodes = page.querySelectorAll<HTMLElement>(`[${attr}]`);
  for (const node of Array.from(nodes)) {
    const key = node.getAttribute(attr);
    if (!key) continue;
    if (map.has(key)) continue;
    map.set(key, node);
  }
  return map;
}

/**
 * Resolve new-style hero pairs from `data-hero-enter-key` (detail side) and
 * `data-hero-exit-key` (list side). Direction-agnostic: enter elements on
 * `to` pair with exit elements on `from` (forward navigation), and enter
 * elements on `from` pair with exit elements on `to` (reverse navigation).
 * In both cases the animated element is the one living on `to`.
 */
function resolvePairs(
  fromNode: HTMLElement,
  toNode: HTMLElement,
): HeroPair[] {
  const pairs: HeroPair[] = [];

  const toEnters = collectByAttr(toNode, HERO_ENTER_KEY);
  const fromExits = collectByAttr(fromNode, HERO_EXIT_KEY);
  for (const [key, toEl] of toEnters) {
    const fromEl = fromExits.get(key);
    if (!fromEl) continue;
    pairs.push({ key, fromEl, toEl });
  }

  const fromEnters = collectByAttr(fromNode, HERO_ENTER_KEY);
  const toExits = collectByAttr(toNode, HERO_EXIT_KEY);
  for (const [key, fromEl] of fromEnters) {
    const toEl = toExits.get(key);
    if (!toEl) continue;
    pairs.push({ key, fromEl, toEl });
  }

  return pairs;
}

export const hero = (options: HeroOptions = {}): TransitionConfig => {
  const physicsOptions: PhysicsOptions = options.physics ?? DEFAULT_PHYSICS;
  const maxDistance = options.maxDistance ?? 700;

  return {
    prepare: ({ from }) => {
      // Hide the outgoing page; hero elements on the incoming page do the
      // visible work.
      from.then((el) => {
        el.style.opacity = "0";
      });
      return {};
    },
    animation: ({ from, to, context }) => {
      const fromNode = from;
      const toNode = to;

      let pairs: HeroPair[] = resolvePairs(fromNode, toNode);

      if (pairs.length === 0) {
        // Legacy fallback: `data-hero-key` is kept for backwards
        // compatibility for animation matching. New code should use
        // `data-hero-enter-key` (detail side) + `data-hero-exit-key`
        // (list side). This branch only runs when no new-style pair
        // resolved — once any enter/exit match exists, the legacy
        // attribute is ignored.
        // @deprecated for animation matching — use the enter/exit pair.
        const legacyEls = Array.from(
          toNode.querySelectorAll<HTMLElement>(`[${HERO_LEGACY_KEY}]`),
        );
        for (const toEl of legacyEls) {
          const key = toEl.getAttribute(HERO_LEGACY_KEY);
          if (!key) continue;
          const fromEl = getHeroEl(fromNode, key);
          if (!fromEl) continue;
          pairs.push({ key, fromEl, toEl });
        }
      }

      if (pairs.length === 0) {
        return new MultiAnimation([], { mode: "parallel" });
      }

      const heroAnimations: Animation[] = [];
      const cleanups: Array<() => void> = [];

      for (const { fromEl, toEl } of pairs) {
        const fromRect = getRect(fromNode, fromEl);
        const toRect = getRect(toNode, toEl);
        const dx = fromRect.left - toRect.left - context.scrollOffset.x;
        const dy = fromRect.top - toRect.top - context.scrollOffset.y;
        const dw = fromRect.width / toRect.width;
        const dh = fromRect.height / toRect.height;

        if (Math.abs(dy) > maxDistance) continue;

        const originalTransform = toEl.style.transform;
        const originalPosition = toEl.style.position;
        const originalTransformOrigin = toEl.style.transformOrigin;
        const originalZIndex = toEl.style.zIndex;
        const originalWillChange = toEl.style.willChange;

        toEl.style.position = "relative";
        toEl.style.transformOrigin = "top left";
        toEl.style.zIndex = "1000";
        toEl.style.willChange = "transform";

        heroAnimations.push(
          new WebAnimation({
            element: toEl,
            integrator: IntegratorProvider.from(physicsOptions),
            style: (t, u) => {
              const tx = u * dx;
              const ty = u * dy;
              const sx = t + u * dw;
              const sy = t + u * dh;
              return {
                transform: `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`,
              };
            },
          }),
        );

        cleanups.push(() => {
          toEl.style.transform = originalTransform;
          toEl.style.position = originalPosition;
          toEl.style.transformOrigin = originalTransformOrigin;
          toEl.style.zIndex = originalZIndex;
          toEl.style.willChange = originalWillChange;
        });
      }

      const composite = new MultiAnimation(heroAnimations, {
        mode: "parallel",
      });
      const prevOnComplete = composite.onComplete;
      composite.onComplete = () => {
        for (const fn of cleanups) fn();
        prevOnComplete?.();
      };

      return composite;
    },
  };
};
