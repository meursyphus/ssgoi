import type { Pose, StyleObject, Timeline, TimelineFrame } from "@types";
import {
  type Integrator,
  type IntegratorState,
  SETTLE_THRESHOLD,
} from "./integrator";
import { Animation } from "./animation";
import { compressSettledFrames } from "./keyframe-compression";
import { findPoseMatch, rebasePose } from "./pose-matching";

const FRAME_TIME = 1000 / 60;

// Band width for keyframe decimation, as a fraction of the simulation's
// total position travel. 0.2% of travel is sub-pixel for any sub-500px
// motion and invisible for opacity — see keyframe-compression.ts.
const KEYFRAME_FLATTEN_RATIO = 0.002;

export interface WebAnimationOptions {
  element: HTMLElement;
  integrator: Integrator;
  style: (t: number, u: number) => StyleObject;
  /** Default 0 — the value `t` takes at the start of `play()`. */
  lowerBound?: number;
  /** Default 1 — the value `t` takes at the end of `play()`. */
  upperBound?: number;
  /**
   * Logical role for motion matching across handoffs. The reserved roles
   * "out"/"in" mirror into each other when an interrupting transition takes
   * over (see pose-matching.ts); any other string matches itself directly,
   * letting a pose survive node replacement (e.g. unmount-mode clones).
   */
  key?: string;
  onUpdate?: (poses: Pose[]) => void;
  onComplete?: () => void;
}

interface SimFrame {
  time: number;
  position: number;
  velocity: number;
}

/**
 * Single-element animation driven by an Integrator simulation, played through
 * the Web Animation API.
 *
 * Lifecycle:
 *   1. `play()` / `reverse()` calls `simulate()` from the current (position,
 *      velocity) toward the target bound, producing a frame list.
 *   2. Frames are converted to WAAPI keyframes; `element.animate(...)` runs them.
 *   3. While playing, `getPose()` interpolates the live position from frames
 *      using the WAAPI clock (`waapi.currentTime`), which tracks
 *      playbackRate and pause/resume; wall-clock elapsed is the fallback.
 *
 * Identity for motion matching is the DOM element first, then the logical
 * `key` role — when a previous animation's pose is handed in via
 * `matchInto`, the shared rules in pose-matching.ts decide whether to seed
 * it directly or mirrored (role flip), rebased into this animation's bounds.
 */
export class WebAnimation extends Animation {
  private element: HTMLElement;
  private integrator: Integrator;
  private styleFn: (t: number, u: number) => StyleObject;
  private lowerBound: number;
  private upperBound: number;
  private key: string | undefined;

  private currentValue: number;
  private currentVelocity = 0;
  private frames: SimFrame[] = [];
  private waapi: globalThis.Animation | null = null;
  private startTime = 0;
  private running = false;
  private paused = false;
  private settled = false;
  private reversing = false;

  constructor(opts: WebAnimationOptions) {
    super();
    this.element = opts.element;
    this.integrator = opts.integrator;
    this.styleFn = opts.style;
    this.lowerBound = opts.lowerBound ?? 0;
    this.upperBound = opts.upperBound ?? 1;
    this.key = opts.key;
    this.currentValue = this.lowerBound;
    this.onUpdate = opts.onUpdate;
    this.onComplete = opts.onComplete;
  }

  play(): void {
    this.reversing = false;
    if (this.paused && this.waapi) {
      // Resume the same WAAPI run — currentTime is preserved, so motion
      // continues exactly where it was halted.
      this.paused = false;
      this.running = true;
      this.waapi.play();
      return;
    }
    this.runToward(this.upperBound);
  }

  reverse(): void {
    this.reversing = true;
    // Reverse from a paused state always starts a fresh spring sim from the
    // current pose toward lowerBound — keyframes were baked forward, so
    // flipping playbackRate would replay the wrong path.
    this.runToward(this.lowerBound);
  }

  pause(): void {
    if (!this.running) return;
    // WAAPI's own pause keeps the forwards-fill visual and lets `play()`
    // resume from the exact frame — no inline-style pinning needed.
    this.captureLiveState();
    this.waapi?.pause();
    this.running = false;
    this.paused = true;
  }

  complete(): void {
    this.clearWaapi();
    this.running = false;
    this.paused = false;
    this.currentValue = this.upperBound;
    this.currentVelocity = 0;
    this.applyStyleAt(this.currentValue);
    this.settled = true;
    this.onComplete?.();
  }

  get isAnimating(): boolean {
    return this.running;
  }
  get isPaused(): boolean {
    return this.paused;
  }
  get isComplete(): boolean {
    return this.settled;
  }
  get isReversing(): boolean {
    return this.reversing;
  }

  get progress(): number {
    if (this.running) this.captureLiveState();
    const span = this.upperBound - this.lowerBound;
    if (span === 0) return 0;
    const p = (this.currentValue - this.lowerBound) / span;
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }

  findTimeForProgress(threshold: number): number | null {
    if (this.frames.length < 2) return null;
    const span = this.upperBound - this.lowerBound;
    if (span === 0) return 0;
    // Walk frames directly — no per-frame style synthesis, no allocations.
    // For underdamped springs that overshoot, "first crossing" is the right
    // semantic: trigger when progress first reaches the threshold, not when
    // it settles there.
    for (const f of this.frames) {
      if ((f.position - this.lowerBound) / span >= threshold) return f.time;
    }
    return this.frames[this.frames.length - 1]!.time;
  }

  get playbackRate(): number {
    return super.playbackRate;
  }
  set playbackRate(rate: number) {
    super.playbackRate = rate;
    if (this.waapi) this.waapi.playbackRate = rate;
  }

  getPose(): Pose[] {
    if (this.running) this.captureLiveState();
    // Note: captureLiveState mutates currentValue/currentVelocity but doesn't
    // pause the WAAPI animation — visual playback continues, the pose just
    // reflects the live state at this instant.
    return [
      {
        element: this.element,
        value: this.currentValue,
        velocity: this.currentVelocity,
        key: this.key,
        lowerBound: this.lowerBound,
        upperBound: this.upperBound,
      },
    ];
  }

  getTimeline(): Timeline[] {
    const frames: TimelineFrame[] = this.frames.map((f) => {
      const t = f.position;
      const u = this.lowerBound + this.upperBound - t;
      return {
        time: f.time,
        value: f.position,
        velocity: f.velocity,
        style: this.styleFn(t, u),
      };
    });
    return [{ element: this.element, frames }];
  }

  matchInto(poses: Pose[]): void {
    const match = findPoseMatch(poses, {
      element: this.element,
      key: this.key,
    });
    if (!match) return;
    const seeded = rebasePose(
      match.pose,
      { lowerBound: this.lowerBound, upperBound: this.upperBound },
      match.mirror,
    );
    this.currentValue = seeded.value;
    this.currentVelocity = seeded.velocity;
  }

  /* ───────────────────────────────────────────────────────── private */

  private runToward(target: number) {
    if (this.running) this.captureLiveState();
    this.clearWaapi();
    this.running = false;
    this.paused = false;
    this.settled = false;

    this.frames = simulate(
      this.integrator,
      this.currentValue,
      target,
      this.currentVelocity,
    );

    if (this.frames.length === 0) {
      this.currentValue = target;
      this.currentVelocity = 0;
      this.applyStyleAt(target);
      // Natural completion keeps its final frame alive through the
      // forwards-filling WAAPI entry, and preset onComplete cleanups count
      // on that when they wipe inline styles. Mirror it here — otherwise a
      // child seeded exactly at its target (a fast-forwarded sequence
      // stage) pops back to its resting styles for the rest of the run.
      const u = this.lowerBound + this.upperBound - target;
      this.waapi = this.element.animate([this.styleFn(target, u) as Keyframe], {
        duration: 0,
        fill: "forwards",
        composite: "replace",
      });
      this.settled = true;
      this.onComplete?.();
      return;
    }

    const lastFrame = this.frames[this.frames.length - 1]!;
    const duration = lastFrame.time;

    // Decimate near-still stretches (the settle tail, sub-visual overshoot
    // wiggle) before baking keyframes — see compressSettledFrames. Dropped
    // frames force explicit offsets so the kept frames stay on the original
    // clock. Live-state reads are unaffected: getPose() and
    // findTimeForProgress() interpolate this.frames, never the baked
    // keyframes.
    let positionLow = Infinity;
    let positionHigh = -Infinity;
    for (const f of this.frames) {
      if (f.position < positionLow) positionLow = f.position;
      if (f.position > positionHigh) positionHigh = f.position;
    }
    const keptIndices = compressSettledFrames(
      this.frames.map((f) => f.position),
      (positionHigh - positionLow) * KEYFRAME_FLATTEN_RATIO,
    );

    // Collect the animated props off the first style BEFORE tacking offsets
    // onto the keyframes — `offset` is also a CSS property and must not be
    // swept up by the inline-style clearing below.
    let styledProps: string[] = [];
    const keyframes: Keyframe[] = keptIndices.map((idx, kept) => {
      const f = this.frames[idx]!;
      const t = f.position;
      const u = this.lowerBound + this.upperBound - t;
      const frame = this.styleFn(t, u) as Keyframe;
      if (kept === 0) styledProps = Object.keys(frame);
      frame.offset = duration > 0 ? f.time / duration : 0;
      return frame;
    });

    // Clear inline styles for animated props so they don't clash with WAAPI.
    for (const prop of styledProps) {
      (this.element.style as unknown as Record<string, string>)[prop] = "";
    }

    this.waapi = this.element.animate(keyframes, {
      duration,
      fill: "forwards",
      easing: "linear",
      composite: "replace",
    });
    this.waapi.playbackRate = this.playbackRate;

    this.startTime = performance.now();
    this.running = true;

    this.waapi.onfinish = () => {
      if (!this.running) return;
      this.running = false;
      this.settled = true;
      this.currentValue = lastFrame.position;
      this.currentVelocity = 0;
      this.onComplete?.();
    };
  }

  private clearWaapi() {
    this.waapi?.cancel();
    this.waapi = null;
  }

  private captureLiveState() {
    if (this.frames.length === 0) return;
    // Frame timestamps are 1×-speed simulation times. The WAAPI clock
    // (currentTime) advances at playbackRate and freezes across
    // pause/resume, so prefer it over wall-clock elapsed, which diverges
    // from the visual under either.
    const local = this.waapi?.currentTime;
    const elapsed =
      typeof local === "number" ? local : performance.now() - this.startTime;
    const { position, velocity } = interpolateFrame(this.frames, elapsed);
    this.currentValue = position;
    this.currentVelocity = velocity;
  }

  private applyStyleAt(value: number) {
    const u = this.lowerBound + this.upperBound - value;
    const style = this.styleFn(value, u);
    for (const [key, val] of Object.entries(style)) {
      (this.element.style as unknown as Record<string, string>)[key] =
        typeof val === "number" ? String(val) : val;
    }
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Simulation helpers
 * ──────────────────────────────────────────────────────────────────────────── */

function simulate(
  integrator: Integrator,
  from: number,
  to: number,
  initialVelocity: number,
): SimFrame[] {
  if (from === to && initialVelocity === 0) return [];

  const MAX_FRAMES = 600;
  let state: IntegratorState = { position: from, velocity: initialVelocity };
  let settleTime = 0;
  const frames: SimFrame[] = [];

  for (let i = 0; i < MAX_FRAMES; i++) {
    const time = i * FRAME_TIME;
    frames.push({ time, position: state.position, velocity: state.velocity });

    state = integrator.step(state, to, FRAME_TIME / 1000);

    if (integrator.isSettled(state, to)) {
      settleTime += FRAME_TIME / 1000;
      if (settleTime >= SETTLE_THRESHOLD) {
        frames.push({
          time: (i + 1) * FRAME_TIME,
          position: to,
          velocity: 0,
        });
        break;
      }
    } else {
      settleTime = 0;
    }
  }

  return frames;
}

function interpolateFrame(
  frames: SimFrame[],
  elapsed: number,
): { position: number; velocity: number } {
  if (frames.length === 0) return { position: 0, velocity: 0 };

  const first = frames[0]!;
  const last = frames[frames.length - 1]!;

  if (elapsed <= 0)
    return { position: first.position, velocity: first.velocity };
  if (elapsed >= last.time)
    return { position: last.position, velocity: last.velocity };

  let lo = 0;
  let hi = frames.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (frames[mid]!.time <= elapsed) lo = mid;
    else hi = mid;
  }
  const a = frames[lo]!;
  const b = frames[hi]!;
  const t = (elapsed - a.time) / (b.time - a.time);
  return {
    position: a.position + (b.position - a.position) * t,
    velocity: a.velocity + (b.velocity - a.velocity) * t,
  };
}
