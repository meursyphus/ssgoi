import type { PhysicsOptions } from "./physics";
import type { NavigationDirection } from "./types";
import { IntegratorProvider } from "../animation/integrator/provider";
import { simulate, type SimFrame } from "./timeline";

// Fade-through: a quick exit, then a softly decelerating entrance that starts
// once the outgoing page is nearly gone (FADE_HANDOFF), so there is no dead
// frame between them. Visually done in ~380 ms, settled in ~620 ms. Overshoot
// on the exit only pushes opacity past 0, which the browser clamps.
export const FADE_OUT_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 700, damping: 38, restDelta: 0.005, restSpeed: 0.05 },
};
export const FADE_IN_PHYSICS: PhysicsOptions = {
  spring: { stiffness: 300, damping: 33, restDelta: 0.005, restSpeed: 0.05 },
};
/** Exit progress at which the fade's incoming page starts. */
export const FADE_HANDOFF = 0.9;
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

/** When the exit first reaches FADE_HANDOFF (its end if it never does). */
function handoffTime(out: MotionTrack): number {
  return (
    out.frames.find((f) => f.position >= FADE_HANDOFF)?.time ?? out.duration
  );
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
    kind === "fade" ? handoffTime(out) : 0,
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
