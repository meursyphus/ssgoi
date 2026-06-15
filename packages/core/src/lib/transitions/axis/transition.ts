import type { TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";
import { getViewportRect } from "@utils";
import { resolveAxisProvider } from "./provider";
import type { AxisFeel, AxisOptions, AxisSideConfig, AxisType } from "./types";

export type { AxisFeel, AxisOptions, AxisType } from "./types";

const DEFAULT_TYPE: AxisType = "x";
const DEFAULT_FEEL: AxisFeel = "snappy";

function applyStartStyle(el: HTMLElement, side: AxisSideConfig): void {
  el.style.willChange = side.willChange;
  el.style.backfaceVisibility = "hidden";
  (el.style as CSSStyleDeclaration & { contain: string }).contain =
    "layout paint";
  for (const [key, value] of Object.entries(side.startStyle)) {
    (el.style as unknown as Record<string, string | number>)[key] = value;
  }
}

function clearStyle(el: HTMLElement): void {
  el.style.willChange = "auto";
  el.style.backfaceVisibility = "";
  (el.style as CSSStyleDeclaration & { contain: string }).contain = "";
  el.style.transform = "";
  el.style.opacity = "";
  el.style.clipPath = "";
}

// The outgoing (from) element is now the real, reused page node (React
// Activity / Next cacheComponents) rather than a throwaway clone, so every
// inline style we set on it must be cleared when the out animation completes —
// otherwise the re-hidden node reappears stuck (invisible / translated /
// non-interactive) on the next navigation. Mirrors `clearStyle` (the in-side
// template) plus the out-only `pointerEvents` we set in `prepare`.
function clearFromStyle(el: HTMLElement): void {
  clearStyle(el);
  el.style.pointerEvents = "";
}

export const axis = (options: AxisOptions = {}): TransitionConfig => {
  const direction = options.direction ?? "forward";
  const type = options.type ?? DEFAULT_TYPE;
  const feel = options.feel ?? DEFAULT_FEEL;
  const provider = resolveAxisProvider(type, feel);
  const config = provider.build({ direction });

  return {
    prepare: ({ from, to }) => {
      from.then((el) => {
        applyStartStyle(el, config.out);
        el.style.pointerEvents = "none";
      });
      to.then((el) => {
        applyStartStyle(el, config.in);
      });
      return {};
    },
    animation: ({ from, to, context }) => {
      // Z scales the page element in place. Without clipping to the viewport
      // slice, scale-up paints over chrome / scroll overflow and scale-down
      // exposes neighbouring layout. Mirror sheet's inset trick.
      if (type === "z") {
        const fromRect = getViewportRect(context, "from");
        const toRect = getViewportRect(context, "to");
        from.style.clipPath = `inset(${fromRect.top}px 0 calc(100% - ${fromRect.top + fromRect.height}px) 0)`;
        to.style.clipPath = `inset(${toRect.top}px 0 calc(100% - ${toRect.top + toRect.height}px) 0)`;
      }

      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(provider.outPhysics),
        style: (t) => config.out.animate(t),
        // Restore the reused from node's inline styles on complete. This
        // covers willChange/backfaceVisibility/contain/transform/opacity (from
        // applyStartStyle + the WAAPI final frame), pointerEvents (set in
        // prepare), and clipPath (set above for z; harmless no-op otherwise).
        onComplete: () => clearFromStyle(from),
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(provider.inPhysics),
        style: (t) => config.in.animate(t),
        onComplete: () => clearStyle(to),
      });

      // Composition (mode / startAt overlap) is decided by the provider —
      // x, y, z have meaningfully different timings, so this file just
      // forwards what the provider gives us.
      return new MultiAnimation([outAnim, inAnim], provider.composition);
    },
  };
};
