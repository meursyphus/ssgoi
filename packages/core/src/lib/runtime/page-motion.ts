import type { PhysicsOptions } from "./physics";
import type { NavigationDirection } from "./types";
import { IntegratorProvider } from "../animation/integrator/provider";
import { simulate, type SimFrame } from "./timeline";

export const FADE_OUT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 180, damping: 20, doubleSpring: true },
};
export const FADE_IN_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 170, damping: 20, doubleSpring: true },
};
export const SLIDE_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 170, damping: 22, doubleSpring: 0.8 },
};

export type PageMotionKind = "fade" | "slide";
export type MotionTrack = {
  frames: SimFrame[];
  offset: number;
  duration: number;
};
/** Serializable numerical data. No DOM objects, functions, or integrator instances. */
export type PageMotionPlan = {
  kind: PageMotionKind;
  direction: NavigationDirection;
  out: MotionTrack;
  in: MotionTrack;
  duration: number;
};

function track(physics: PhysicsOptions, offset = 0): MotionTrack {
  const integrator = physics.integrator?.() ?? IntegratorProvider.from(physics);
  const frames = simulate(integrator, 0, 1, 0);
  if (
    frames.some(
      (f) => !Number.isFinite(f.position) || !Number.isFinite(f.velocity),
    )
  ) {
    throw new Error("SSGOI: physics produced a non-finite timeline.");
  }
  return { frames, offset, duration: frames[frames.length - 1]?.time ?? 0 };
}

export function createPageMotionPlan(
  kind: PageMotionKind,
  direction: NavigationDirection,
  physics?: PhysicsOptions,
): PageMotionPlan {
  const out = track(
    physics ?? (kind === "fade" ? FADE_OUT_PHYSICS : SLIDE_PHYSICS),
  );
  const incoming = track(
    physics ?? (kind === "fade" ? FADE_IN_PHYSICS : SLIDE_PHYSICS),
    kind === "fade" ? out.duration : 0,
  );
  return {
    kind,
    direction,
    out,
    in: incoming,
    duration: Math.max(out.duration, incoming.offset + incoming.duration),
  };
}

/** x is expressed in widths: web uses 100%, native uses the measured host width. */
export function pageMotionStyle(
  kind: PageMotionKind,
  side: "in" | "out",
  direction: NavigationDirection,
  progress: number,
): { opacity: number; x: number } {
  "worklet";
  if (kind === "fade")
    return { opacity: side === "in" ? progress : 1 - progress, x: 0 };
  const sign = direction === "forward" ? 1 : -1;
  return { opacity: 1, x: sign * (side === "in" ? 1 - progress : -progress) };
}
