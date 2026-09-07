import type { Pose, StyleObject, Timeline, TimelineFrame } from "@types";
import {
  type Integrator,
  type IntegratorState,
  SETTLE_THRESHOLD,
} from "./integrator";
import { waitPaint } from "../utils/wait-paint";
import { Animation } from "./animation";
import {
  frameScheduler,
  STABLE_FRAME_THRESHOLD,
  type FrameTick,
} from "./frame-scheduler";

const FRAME_TIME = 1000 / 60;
const STARTUP_STABLE_FRAMES = 2;

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
  /**
   * Role label for this track (`"out"`, `"in"`, `"shared"`, `"overlay"`).
   * Presets usually leave it unset; `withOverride` fills it in from element
   * identity so user overrides can address tracks by role.
   */
  label?: string;
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
 *   2. Frames are converted to WAAPI keyframes; `element.animate(...)` is held
 *      at 0 ms until the pending pause is acknowledged and the browser has had
 *      a rendering opportunity.
 *   3. Startup is advanced by a shared frame clock until two rendering
 *      opportunities arrive without a long gap. Delayed mount work during
 *      this startup window therefore cannot be charged to the document
 *      timeline in one catch-up jump.
 *   4. Playback is handed to native WAAPI once rendering is stable, preserving
 *      compositor playback for the remainder of the transition.
 *   5. While playing, `getPose()` interpolates the live position from frames
 *      using WAAPI's `currentTime`, so browser setup latency is not counted as
 *      animation progress.
 *
 * Identity for motion matching is the DOM element itself — when a previous
 * animation's pose is handed in via `matchInto`, we look up by element.
 */
export class WebAnimation extends Animation {
  private readonly _element: HTMLElement;
  private _integrator: Integrator;
  /** Role label, see `WebAnimationOptions.label`. */
  label: string | undefined;
  private styleFn: (t: number, u: number) => StyleObject;
  private lowerBound: number;
  private upperBound: number;

  private currentValue: number;
  private currentVelocity = 0;
  private frames: SimFrame[] = [];
  private waapi: globalThis.Animation | null = null;
  private runId = 0;
  private waitingForStart = false;
  private startReady = false;
  private pendingFirstFrame: Keyframe | undefined;
  private stopStartupClock: (() => void) | null = null;
  private startupStableFrames = 0;
  private running = false;
  private paused = false;
  private settled = false;
  private reversing = false;

  constructor(opts: WebAnimationOptions) {
    super();
    this._element = opts.element;
    this._integrator = opts.integrator;
    this.label = opts.label;
    this.styleFn = opts.style;
    this.lowerBound = opts.lowerBound ?? 0;
    this.upperBound = opts.upperBound ?? 1;
    this.currentValue = this.lowerBound;
    this.onUpdate = opts.onUpdate;
    this.onComplete = opts.onComplete;
  }

  /** The DOM node this track drives. */
  get element(): HTMLElement {
    return this._element;
  }

  /**
   * Physics that drives this track. Read lazily at `play()` / `reverse()`
   * (the simulation runs then), so replacing it before playback takes effect
   * for the next run — this is what `withOverride` relies on.
   */
  get integrator(): Integrator {
    return this._integrator;
  }
  set integrator(integrator: Integrator) {
    this._integrator = integrator;
  }

  play(): void {
    this.reversing = false;
    if (this.paused && this.waapi) {
      // Resume the same WAAPI run — currentTime is preserved, so motion
      // continues exactly where it was halted.
      this.paused = false;
      this.running = true;
      if (this.waitingForStart) {
        if (this.startReady) this.startFramePacedPlayback(this.waapi);
        return;
      }
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
    this.stopStartupClock?.();
    this.stopStartupClock = null;
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

  /**
   * Drop the WAAPI forwards-fill after the run has settled, letting inline
   * styles govern the resting visual. Call only from `onComplete` (the run is
   * already finished) — otherwise it cancels mid-flight. Unlike `complete()`,
   * it writes no final frame, so a caller can reset the element to its natural
   * state without the lingering fill clobbering it.
   */
  releaseFill(): void {
    this.clearWaapi();
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
        element: this._element,
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
    return [{ element: this._element, frames }];
  }

  matchInto(poses: Pose[]): void {
    const match = poses.find((p) => p.element === this._element);
    if (!match) return;
    this.currentValue = match.value;
    this.currentVelocity = match.velocity;
  }

  /* ───────────────────────────────────────────────────────── private */

  private runToward(target: number) {
    if (this.running) this.captureLiveState();
    this.clearWaapi();
    this.running = false;
    this.paused = false;
    this.settled = false;

    this.frames = simulate(
      this._integrator,
      this.currentValue,
      target,
      this.currentVelocity,
    );

    if (this.frames.length === 0) {
      this.currentValue = target;
      this.currentVelocity = 0;
      this.applyStyleAt(target);
      this.settled = true;
      this.onComplete?.();
      return;
    }

    const keyframes: Keyframe[] = this.frames.map((f) => {
      const t = f.position;
      const u = this.lowerBound + this.upperBound - t;
      return this.styleFn(t, u) as Keyframe;
    });

    const firstFrame = keyframes[0];
    const lastFrame = this.frames[this.frames.length - 1]!;
    const duration = lastFrame.time;
    const runId = ++this.runId;

    const waapi = this._element.animate(keyframes, {
      duration,
      fill: "both",
      easing: "linear",
      composite: "replace",
    });
    waapi.playbackRate = this.playbackRate;
    // Element.animate() auto-plays. Seek while that play is pending, then pause:
    // setting currentTime after pause would synchronously complete the pending
    // pause, making `ready` useless as an acknowledgement of the pause request.
    waapi.currentTime = 0;
    waapi.pause();

    this.waapi = waapi;
    this.waitingForStart = true;
    this.startReady = false;
    this.pendingFirstFrame = firstFrame;
    this.running = true;

    waapi.onfinish = () => {
      if (!this.running || this.waapi !== waapi) return;
      this.running = false;
      this.settled = true;
      this.currentValue = lastFrame.position;
      this.currentVelocity = 0;
      this.onComplete?.();
    };

    void this.startWhenReady(waapi, runId);
  }

  private clearWaapi() {
    this.runId++;
    this.waapi?.cancel();
    this.waapi = null;
    this.waitingForStart = false;
    this.startReady = false;
    this.pendingFirstFrame = undefined;
    this.stopStartupClock?.();
    this.stopStartupClock = null;
    this.startupStableFrames = 0;
  }

  private captureLiveState() {
    if (this.frames.length === 0) return;
    const elapsed = readAnimationTime(this.waapi);
    if (elapsed === null) return;
    const { position, velocity } = interpolateFrame(this.frames, elapsed);
    this.currentValue = position;
    this.currentVelocity = velocity;
  }

  private async startWhenReady(
    waapi: globalThis.Animation,
    runId: number,
  ): Promise<void> {
    try {
      // This acknowledges the pending pause. It does not prove that pixels have
      // been presented, so keep the animation held through the frame barrier.
      await waapi.ready;
      if (typeof requestAnimationFrame !== "undefined") {
        await waitPaint(this._element);
      }
    } catch {
      return;
    }

    if (this.runId !== runId || this.waapi !== waapi) {
      return;
    }

    this.startReady = true;
    if (!this.running || this.paused) return;
    this.startFramePacedPlayback(waapi);
  }

  private startFramePacedPlayback(waapi: globalThis.Animation): void {
    if (
      this.waapi !== waapi ||
      !this.waitingForStart ||
      !this.startReady ||
      this.stopStartupClock
    ) {
      return;
    }

    // Clear inline styles only after the browser has applied the paused 0 ms
    // WAAPI frame. Clearing earlier can expose the underlying, unanimated
    // style while the animation is still pending.
    if (this.pendingFirstFrame) {
      for (const prop of Object.keys(this.pendingFirstFrame)) {
        (this._element.style as unknown as Record<string, string>)[prop] = "";
      }
    }

    this.pendingFirstFrame = undefined;
    if (typeof requestAnimationFrame === "undefined" || this.playbackRate < 0) {
      this.handOffToWaapi(waapi);
      return;
    }
    this.startupStableFrames = 0;
    this.stopStartupClock = frameScheduler.subscribe((tick) => {
      this.advanceFramePacedStartup(waapi, tick);
    });
  }

  private advanceFramePacedStartup(
    waapi: globalThis.Animation,
    tick: FrameTick,
  ): void {
    if (
      this.waapi !== waapi ||
      !this.running ||
      this.paused ||
      !this.waitingForStart
    ) {
      return;
    }

    const lastFrame = this.frames[this.frames.length - 1];
    if (!lastFrame) return;

    const currentTime = readAnimationTime(waapi) ?? 0;
    const nextTime = Math.min(
      lastFrame.time,
      currentTime + tick.delta * Math.max(0, this.playbackRate),
    );
    waapi.currentTime = nextTime;
    this.captureLiveState();

    if (nextTime >= lastFrame.time) {
      this.finishFramePacedRun(waapi, lastFrame);
      return;
    }

    if (tick.rawDelta <= STABLE_FRAME_THRESHOLD) this.startupStableFrames++;
    else this.startupStableFrames = 0;

    if (this.startupStableFrames < STARTUP_STABLE_FRAMES) return;

    this.handOffToWaapi(waapi);
  }

  private handOffToWaapi(waapi: globalThis.Animation): void {
    if (this.waapi !== waapi || !this.running || this.paused) return;
    this.stopStartupClock?.();
    this.stopStartupClock = null;
    this.waitingForStart = false;
    this.startReady = false;
    this.startupStableFrames = 0;
    waapi.play();
  }

  private finishFramePacedRun(
    waapi: globalThis.Animation,
    lastFrame: SimFrame,
  ): void {
    if (this.waapi !== waapi || !this.running) return;
    this.stopStartupClock?.();
    this.stopStartupClock = null;
    this.waitingForStart = false;
    this.startReady = false;
    this.startupStableFrames = 0;
    this.running = false;
    this.settled = true;
    this.currentValue = lastFrame.position;
    this.currentVelocity = 0;
    this.onComplete?.();
  }

  private applyStyleAt(value: number) {
    const u = this.lowerBound + this.upperBound - value;
    const style = this.styleFn(value, u);
    for (const [key, val] of Object.entries(style)) {
      (this._element.style as unknown as Record<string, string>)[key] =
        typeof val === "number" ? String(val) : val;
    }
  }
}

/* ────────────────────────────────────────────────────────────────────────────
 * Simulation helpers
 * ──────────────────────────────────────────────────────────────────────────── */

export function simulate(
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

function readAnimationTime(
  animation: globalThis.Animation | null,
): number | null {
  const currentTime = animation?.currentTime;
  return typeof currentTime === "number" ? currentTime : null;
}
