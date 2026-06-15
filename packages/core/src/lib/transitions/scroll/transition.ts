import type { PhysicsOptions, TransitionConfig } from "@types";
import {
  IntegratorProvider,
  MultiAnimation,
  WebAnimation,
} from "../../animation";
import { Z_BACKGROUND, Z_FOREGROUND } from "../stacking";

export interface ScrollOptions {
  direction?: "up" | "down";
  physics?: PhysicsOptions;
}

const DEFAULT_PHYSICS: PhysicsOptions = {
  spring: {
    stiffness: 20,
    damping: 8,
    doubleSpring: 1,
    restDelta: 0.001,
    restSpeed: 0.001,
  },
};

export const scroll = (options: ScrollOptions = {}): TransitionConfig => {
  const direction = options.direction ?? "up";
  const physicsOptions: PhysicsOptions = options.physics ?? DEFAULT_PHYSICS;
  const isUp = direction === "up";

  // up: the incoming `to` slides up over the outgoing `from`; down: the
  // outgoing `from` slides down on top of the revealed `to`.
  const fromZ = isUp ? Z_BACKGROUND : Z_FOREGROUND;
  const toZ = isUp ? Z_FOREGROUND : Z_BACKGROUND;

  return {
    prepare: ({ from, to }) => {
      from.then((el) => {
        el.style.zIndex = fromZ;
        el.style.willChange = "transform";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        el.style.pointerEvents = "none";
      });
      to.then((el) => {
        el.style.willChange = "transform";
        el.style.backfaceVisibility = "hidden";
        (el.style as CSSStyleDeclaration & { contain: string }).contain =
          "layout paint";
        // `to` is in normal flow; promote it so its z-index takes effect.
        el.style.position = "relative";
        el.style.zIndex = toZ;
      });
      return {};
    },
    animation: ({ from, to }) => {
      const fromHeight = from.offsetHeight;
      const toHeight = to.offsetHeight;
      const viewportHeight = window.innerHeight;
      const height = Math.max(Math.min(fromHeight, toHeight), viewportHeight);

      const outAnim = new WebAnimation({
        element: from,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (t) => {
          const translateY = isUp ? -height * t : height * t;
          return { transform: `translate3d(0, ${translateY}px, 0)` };
        },
        // The outgoing node is the real, reused element (re-hidden then shown
        // again on the next navigation), so mirror the incoming cleanup and
        // also reset the out-only props applied in prepare (zIndex,
        // pointerEvents) — otherwise the leftover inline styles corrupt the
        // page the next time it appears.
        onComplete: () => {
          from.style.willChange = "auto";
          from.style.backfaceVisibility = "";
          (from.style as CSSStyleDeclaration & { contain: string }).contain =
            "";
          from.style.transform = "";
          from.style.pointerEvents = "";
          from.style.zIndex = "";
        },
      });

      const inAnim = new WebAnimation({
        element: to,
        integrator: IntegratorProvider.from(physicsOptions),
        style: (_t, u) => {
          const translateY = isUp ? u * height : u * -height;
          return { transform: `translate3d(0, ${translateY}px, 0)` };
        },
        onComplete: () => {
          to.style.willChange = "auto";
          to.style.backfaceVisibility = "";
          (to.style as CSSStyleDeclaration & { contain: string }).contain = "";
          to.style.transform = "";
          // `to` is the surviving page; clear the stacking props prepare set on
          // it (unmount mode gives the persistent `to` node no other cleanup).
          // Guard: if a follow-up navigation already re-claimed this node (e.g.
          // as the next outgoing `from`, now position:absolute), leave its
          // fresh stacking intact instead of stripping it.
          if (to.style.position === "relative") to.style.position = "";
          if (to.style.zIndex === toZ) to.style.zIndex = "";
        },
      });

      // Drop each WAAPI forwards-fill once its own run settles, so the inline
      // resets above (not a lingering final frame) govern the resting visual —
      // mirrors the zoom transition. Without this a reused node (React
      // <Activity>) reappears displaced by the leftover transform.
      for (const anim of [outAnim, inAnim]) {
        const prev = anim.onComplete;
        anim.onComplete = () => {
          prev?.();
          anim.releaseFill();
        };
      }

      return new MultiAnimation([outAnim, inAnim], { mode: "parallel" });
    },
  };
};
