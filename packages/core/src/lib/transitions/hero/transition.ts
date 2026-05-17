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

export interface HeroOptions {
  physics?: PhysicsOptions;
  maxDistance?: number;
}

function getHeroEl(page: HTMLElement, key: string): HTMLElement | null {
  return page.querySelector(`[data-hero-key="${key}"]`);
}

type HeroPair = {
  toEl: HTMLElement;
  fromEl: HTMLElement;
  key: string;
};

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

      const heroEls = Array.from(
        toNode.querySelectorAll<HTMLElement>("[data-hero-key]"),
      );

      const pairs: HeroPair[] = [];
      for (const toEl of heroEls) {
        const key = toEl.getAttribute("data-hero-key");
        if (!key) continue;
        const fromEl = getHeroEl(fromNode, key);
        if (!fromEl) continue;
        pairs.push({ key, fromEl, toEl });
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
