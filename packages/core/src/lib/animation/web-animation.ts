import type { Pose, StyleObject, Timeline, TimelineFrame } from "@types";
import {
  type Integrator,
  type IntegratorState,
  SETTLE_THRESHOLD,
} from "./integrator";
import { Animation } from "./animation";

const FRAME_TIME = 1000 / 60;

export interface WebAnimationOptions {
  element: HTMLElement;
  integrator: Integrator;
  style: (t: number, u: number) => StyleObject;
  /** Default 0 — the value `t` takes at the start of `play()`. */
  lowerBound?: number;
  /** Default 1 — the value `t` takes at the end of `play()`. */
  upperBound?: number;
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
 *      using `performance.now() - startTime`.
 *
 * Identity for motion matching is the DOM element itself — when a previous
 * animation's pose is handed in via `matchInto`, we look up by element.
 */
export class WebAnimation extends Animation {
  private element: HTMLElement;
  private integrator: Integrator;
  private styleFn: (t: number, u: number) => StyleObject;
  private lowerBound: number;
  private upperBound: number;

  private currentValue: number;
  private currentVelocity = 0;
  private frames: SimFrame[] = [];
  private waapi: globalThis.Animation | null = null;
  private startTime = 0;
  private running = false;

  constructor(opts: WebAnimationOptions) {
    super();
    this.element = opts.element;
    this.integrator = opts.integrator;
    this.styleFn = opts.style;
    this.lowerBound = opts.lowerBound ?? 0;
    this.upperBound = opts.upperBound ?? 1;
    this.currentValue = this.lowerBound;
    this.onUpdate = opts.onUpdate;
    this.onComplete = opts.onComplete;
  }

  play(): void {
    this.runToward(this.upperBound);
  }

  reverse(): void {
    this.runToward(this.lowerBound);
  }

  pause(): void {
    if (!this.running) return;
    this.captureLiveState();
    this.waapi?.cancel();
    this.waapi = null;
    this.running = false;
  }

  complete(): void {
    this.pause();
    this.currentValue = this.upperBound;
    this.currentVelocity = 0;
    this.applyStyleAt(this.currentValue);
    this.onComplete?.();
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
    const match = poses.find((p) => p.element === this.element);
    if (!match) return;
    this.currentValue = match.value;
    this.currentVelocity = match.velocity;
  }

  /* ───────────────────────────────────────────────────────── private */

  private runToward(target: number) {
    if (this.running) this.pause();

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
      this.onComplete?.();
      return;
    }

    const keyframes: Keyframe[] = this.frames.map((f) => {
      const t = f.position;
      const u = this.lowerBound + this.upperBound - t;
      return this.styleFn(t, u) as Keyframe;
    });

    // Clear inline styles for animated props so they don't clash with WAAPI.
    const firstFrame = keyframes[0];
    if (firstFrame) {
      for (const prop of Object.keys(firstFrame)) {
        (this.element.style as unknown as Record<string, string>)[prop] = "";
      }
    }

    const lastFrame = this.frames[this.frames.length - 1]!;
    const duration = lastFrame.time;

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
      this.currentValue = lastFrame.position;
      this.currentVelocity = 0;
      this.onComplete?.();
    };
  }

  private captureLiveState() {
    if (this.frames.length === 0) return;
    const elapsed = performance.now() - this.startTime;
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
