import type { Pose, StyleObject, Timeline, TimelineFrame } from "@types";
import type { Integrator, IntegratorState } from "./integrator";
import {
  simulate,
  interpolateFrame,
  sampleIntegratorState,
  type SimFrame,
} from "../runtime/timeline";
import { waitPaint } from "../utils/wait-paint";
import {
  Animation,
  finishedDisposal,
  type AnimationDisposal,
} from "./animation";
import {
  compatibleChannel,
  residualAt,
  type MotionChannel,
  type MotionSnapshot,
} from "../runtime/motion-matching";
import {
  createWebPresentationCodec,
  type PresentationCodec,
} from "./web-presentation";

export interface WebMotionOptions {
  /** Semantic identity, scoped by HostAnimation; never inferred from array position. */
  key?: string;
  role?: string;
  space?: unknown;
  lifetime?: "persistent" | "temporary";
  codec?: PresentationCodec;
  /** Time allowed for the old path's residual to disappear, in milliseconds. */
  handoffDuration?: number;
  /** Default for disappearing targets is a short fade. */
  release?:
    | "fade"
    | "remove"
    | ((snapshot: MotionSnapshot<HTMLElement>) => WebAnimation);
  /** Opaque/incompatible CSS can crossfade a frozen copy, or explicitly finish. */
  fallback?: "crossfade" | "finish";
}
import {
  frameScheduler,
  STABLE_FRAME_THRESHOLD,
  type FrameTick,
} from "./frame-scheduler";

const STARTUP_STABLE_FRAMES = 2;

export interface WebMotionSnapshot extends MotionSnapshot<HTMLElement> {
  displayStyle: StyleObject;
  inlineStyle: string;
  frame?: PresentationCodec["frame"];
}

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
  motion?: WebMotionOptions;
  onDispose?: (context: AnimationDisposal) => void;
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
 * Scalar matchInto is a legacy, same-coordinate operation. Host handoff uses
 * scoped target identities and typed presentation channels instead.
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
  private solverState: IntegratorState | undefined;
  private solverTarget = 1;
  private presentationTime = 0;
  private renderedStyles: StyleObject[] = [];
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
  private disposed = false;
  private readonly legacyCompletionCleanup: boolean;
  readonly motion: WebMotionOptions;
  private codec: PresentationCodec | undefined;
  private adopted: MotionSnapshot<HTMLElement> | undefined;
  private presentationFrames: Array<{
    time: number;
    channels: Record<string, MotionChannel>;
  }> = [];
  private hold: globalThis.Animation | null = null;
  private fallbackCopy: WebAnimation | null = null;
  private fallbackChannels = new Set<string>();
  private fallbackMode: "crossfade" | "finish" | undefined;
  get handoffFallbackMode() {
    return this.fallbackMode;
  }
  get handoffFallbacks(): readonly string[] {
    return [...this.fallbackChannels];
  }

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
    this.legacyCompletionCleanup = !!opts.onComplete && !opts.onDispose;
    this.onComplete = opts.onComplete;
    this.onDispose = opts.onDispose;
    this.motion = opts.motion ?? {};
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
    this.solverState = undefined;
  }

  protected setIntegrator(integrator: Integrator): void {
    this._integrator = integrator;
    this.solverState = undefined;
  }

  play(): void {
    const wasReversing = this.reversing;
    this.reversing = false;
    if (this.paused && this.waapi && !wasReversing) {
      // Resume the same WAAPI run — currentTime is preserved, so motion
      // continues exactly where it was halted.
      this.paused = false;
      this.running = true;
      if (this.waitingForStart) {
        if (this.startReady) this.startFramePacedPlayback(this.waapi);
        return;
      }
      this.waapi.play();
      this.fallbackCopy?.play();
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
    this.fallbackCopy?.pause();
    this.stopStartupClock?.();
    this.stopStartupClock = null;
    this.running = false;
    this.paused = true;
  }

  complete(): void {
    if (this.settled) return;
    this.clearWaapi();
    this.running = false;
    this.paused = false;
    this.currentValue = this.upperBound;
    this.currentVelocity = 0;
    this.applyStyleAt(this.currentValue);
    this.settled = true;
    this.finish();
  }

  validate(): void {
    const duration = this.motion.handoffDuration ?? 280;
    if (!Number.isFinite(duration) || duration < 0 || duration > 10000)
      throw new Error(
        "handoffDuration must be finite and between 0 and 10000 ms",
      );
  }

  getMotionTracks(): readonly WebAnimation[] {
    return [this];
  }

  get supportsInterruption(): boolean {
    return !this.legacyCompletionCleanup;
  }

  stop(): void {
    this.captureLiveState();
    this.clearWaapi();
    this.hold?.cancel();
    this.hold = null;
    this.fallbackCopy?.cancel({ reason: "disposed", owns: () => true });
    this.fallbackCopy = null;
    this.running = false;
    this.paused = false;
  }

  cancel(context: AnimationDisposal): void {
    this.stop();
    this.disposeResources(context);
  }

  private disposeResources(context: AnimationDisposal): void {
    if (this.disposed) return;
    this.disposed = true;
    if (context.owns(this.element)) {
      try {
        this.onDispose?.(context);
      } catch (error) {
        console.error("[ssgoi] animation cleanup failed", error);
      }
    }
  }

  private finish(): void {
    this.presentationTime = this.frames[this.frames.length - 1]?.time ?? 0;
    this.solverState = undefined;
    this.hold?.cancel();
    this.hold = null;
    this.applyStyleAt(this.currentValue);
    this.clearWaapi();
    this.fallbackCopy?.cancel({ reason: "disposed", owns: () => true });
    this.fallbackCopy = null;
    if (!this.deferDisposal) this.disposeResources(finishedDisposal);
    this.onComplete?.();
  }

  get motionIdentity() {
    return {
      target: this.element,
      key: this.motion.key,
      role: this.motion.role,
      space: this.motion.space,
      lifetime: this.motion.lifetime,
    };
  }

  /** Final output, including any earlier residual, is the next handoff's source. */
  getMotionSnapshot(): WebMotionSnapshot {
    if (this.running) this.captureLiveState();
    const channels = this.samplePresentation(
      readAnimationTime(this.waapi) ?? this.presentationTime,
    );
    const rate =
      this.paused || (this.waitingForStart && !readAnimationTime(this.waapi))
        ? 0
        : this.playbackRate;
    const displayStyle = {
      ...this.styleFn(
        this.currentValue,
        this.lowerBound + this.upperBound - this.currentValue,
      ),
      ...this.codec?.write(channels),
    };
    return {
      ...this.motionIdentity,
      displayStyle,
      inlineStyle: this.element.style.cssText,
      frame: this.codec?.frame,
      channels: Object.fromEntries(
        Object.entries(channels).map(([key, c]) => [
          key,
          {
            ...c,
            velocity: c.velocity.map((v) => v * rate),
          },
        ]),
      ),
    };
  }

  adopt(snapshot: MotionSnapshot<HTMLElement>): void {
    this.codec ??=
      this.motion.codec ?? createWebPresentationCodec(this.element);
    this.adopted = snapshot;
    const destination = this.codec.read({
      transform: "none",
      opacity: 1,
      ...this.styleFn(
        this.currentValue,
        this.lowerBound + this.upperBound - this.currentValue,
      ),
    });
    this.fallbackChannels.clear();
    this.fallbackMode = undefined;
    const authoredStyle = this.styleFn(
      this.currentValue,
      this.lowerBound + this.upperBound - this.currentValue,
    );
    const previousStyle = (snapshot as Partial<WebMotionSnapshot>).displayStyle;
    for (const [property, value] of Object.entries(previousStyle ?? {})) {
      if (
        property in authoredStyle &&
        String(value) !== String(authoredStyle[property]) &&
        (!snapshot.channels[property] || !destination[property])
      )
        this.fallbackChannels.add(property);
    }
    for (const [property, source] of Object.entries(snapshot.channels)) {
      const next = destination[property];
      if (next && !compatibleChannel(source, next))
        this.fallbackChannels.add(property);
    }
    if (this.fallbackChannels.size) this.fallbackMode = "finish";
    if (this.fallbackChannels.size && this.motion.fallback !== "finish") {
      const visual = snapshot as Partial<WebMotionSnapshot>;
      if (
        visual.frame &&
        visual.displayStyle &&
        snapshot.target.cloneNode &&
        snapshot.target.parentElement &&
        !snapshot.target.shadowRoot &&
        !snapshot.target.matches?.(
          "canvas, video, audio, iframe, object, embed",
        ) &&
        !snapshot.target.querySelector?.(
          "canvas, video, audio, iframe, object, embed",
        )
      ) {
        this.fallbackMode = "crossfade";
        const clone = snapshot.target.cloneNode(true) as HTMLElement;
        clone.removeAttribute("id");
        clone.removeAttribute("data-ssgoi-transition");
        for (const child of clone.querySelectorAll(
          "[id], [data-ssgoi-transition]",
        )) {
          child.removeAttribute("id");
          child.removeAttribute("data-ssgoi-transition");
        }
        clone.style.cssText = visual.inlineStyle ?? "";
        Object.assign(clone.style, visual.displayStyle, {
          position: "fixed",
          left: `${visual.frame.left}px`,
          top: `${visual.frame.top}px`,
          width: `${visual.frame.width}px`,
          height: `${visual.frame.height}px`,
          margin: "0",
          pointerEvents: "none",
          zIndex: "2147483646",
        });
        clone.setAttribute("aria-hidden", "true");
        clone.inert = true;
        snapshot.target.parentElement.appendChild(clone);
        const opacity = Number(visual.displayStyle.opacity ?? 1);
        this.fallbackCopy = new WebAnimation({
          element: clone,
          integrator: {
            step: (state, target, dt) => ({
              position: Math.min(target, state.position + dt / 0.18),
              velocity: 0,
            }),
            isSettled: (state, target) => state.position >= target,
          },
          style: (_t, u) => ({ opacity: opacity * u }),
          onDispose: () => clone.remove(),
        });
        this.adopted = {
          ...snapshot,
          channels: {
            ...snapshot.channels,
            opacity: { schema: "css:#", value: [0], velocity: [0] },
          },
        };
      }
    }
    // A delayed child holds its transferred presentation until its dependency
    // actually starts it. It does not borrow the previous sequence's clock.
    const style = this.codec.write(this.adopted.channels);
    this.hold?.cancel();
    if (Object.keys(style).length) {
      this.hold = this.element.animate([style as Keyframe], {
        duration: 1,
        fill: "both",
      });
      this.hold.pause();
      this.hold.currentTime = 0;
    }
  }

  private samplePresentation(time: number): Record<string, MotionChannel> {
    const frames = this.presentationFrames;
    if (!frames.length) {
      if (this.adopted) return { ...this.adopted.channels };
      this.codec ??=
        this.motion.codec ?? createWebPresentationCodec(this.element);
      return this.codec.read({
        transform: "none",
        opacity: 1,
        ...this.styleFn(
          this.currentValue,
          this.lowerBound + this.upperBound - this.currentValue,
        ),
      });
    }
    let index = frames.findIndex((f) => f.time > time);
    if (index < 0) index = frames.length - 1;
    const a = frames[Math.max(0, index - 1)]!;
    const b = frames[index]!;
    const dt = (b.time - a.time) / 1000;
    const fraction = dt
      ? Math.max(0, Math.min(1, (time - a.time) / (dt * 1000)))
      : 0;
    const output: Record<string, MotionChannel> = {};
    for (const [property, c] of Object.entries(a.channels)) {
      const end = b.channels[property];
      if (!end || !compatibleChannel(c, end)) {
        output[property] = c;
        continue;
      }
      output[property] = {
        schema: c.schema,
        value: c.value.map((v, i) => v + (end.value[i]! - v) * fraction),
        velocity: c.value.map((v, i) =>
          time >= frames[frames.length - 1]!.time || !dt
            ? 0
            : (end.value[i]! - v) / dt,
        ),
      };
    }
    return output;
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
    const frames: TimelineFrame[] = this.frames.map((f, index) => {
      const t = f.position;
      const u = this.lowerBound + this.upperBound - t;
      return {
        time: f.time,
        value: f.position,
        velocity: f.velocity,
        style: this.renderedStyles[index] ?? this.styleFn(t, u),
      };
    });
    return [{ element: this._element, frames }];
  }

  matchInto(poses: Pose[]): void {
    const match = poses.find((p) => p.element === this._element);
    if (!match) return;
    this.currentValue = match.value;
    this.currentVelocity = match.velocity;
    this.solverState = undefined;
  }

  /* ───────────────────────────────────────────────────────── private */

  private runToward(target: number) {
    this.validate();
    if (this.running || this.paused) {
      const snapshot = this.getMotionSnapshot();
      this.captureLiveState();
      this.adopted = snapshot;
    }
    this.clearWaapi();
    this.running = false;
    this.paused = false;
    this.settled = false;
    this.disposed = false;
    this.codec = this.motion.codec ?? createWebPresentationCodec(this.element);

    this.presentationTime = 0;
    this.solverTarget = target;
    this.frames = simulate(
      this._integrator,
      this.currentValue,
      target,
      this.currentVelocity,
      this.solverState,
      true,
    );

    if (this.frames.length === 0 && this.adopted) {
      this.frames = [{ time: 0, position: target, velocity: 0 }];
    }
    if (this.frames.length === 0) {
      this.currentValue = target;
      this.currentVelocity = 0;
      this.applyStyleAt(target);
      this.settled = true;
      this.finish();
      return;
    }

    const duration = this.adopted
      ? Math.max(16, this.motion.handoffDuration ?? 280)
      : 0;
    const lastAuthored = this.frames[this.frames.length - 1]!;
    for (
      let time = lastAuthored.time + 1000 / 60;
      time < duration + 1000 / 60;
      time += 1000 / 60
    ) {
      this.frames.push({ time, position: lastAuthored.position, velocity: 0 });
    }
    const authored = this.frames.map((f) =>
      this.codec!.read({
        transform: "none",
        opacity: 1,
        ...this.styleFn(
          f.position,
          this.lowerBound + this.upperBound - f.position,
        ),
      }),
    );
    for (let i = 1; i < authored.length; i++) {
      const a = authored[i - 1]!.transform,
        b = authored[i]!.transform;
      if (a?.schema === "viewport-plane-v1" && b?.schema === a.schema) {
        const values = [...b.value];
        values[2] =
          a.value[2]! +
          Math.atan2(
            Math.sin(values[2]! - a.value[2]!),
            Math.cos(values[2]! - a.value[2]!),
          );
        authored[i]!.transform = { ...b, value: values };
      }
    }
    const first = authored[0]!;
    const second = authored[1] ?? first;
    const corrections: Record<
      string,
      { offset: number[]; velocity: number[] }
    > = {};
    for (const [property, source] of Object.entries(
      this.adopted?.channels ?? {},
    )) {
      let destination = first[property];
      if (!destination) {
        // An unused channel returns to its base presentation; the element stays.
        const neutral: StyleObject =
          property === "transform"
            ? { transform: "none" }
            : property === "opacity"
              ? { opacity: 1 }
              : {};
        destination = this.codec.read(neutral)[property];
        if (destination)
          for (const frame of authored) frame[property] = destination;
      }
      if (!destination || !compatibleChannel(source, destination)) continue;
      const next = second[property] ?? destination;
      corrections[property] = {
        offset: source.value.map((v, i) => {
          let delta = v - destination!.value[i]!;
          if (
            property === "transform" &&
            source.schema === "viewport-plane-v1" &&
            i === 2
          )
            delta = Math.atan2(Math.sin(delta), Math.cos(delta));
          return delta;
        }),
        velocity: source.velocity.map(
          (v, i) =>
            v / Math.max(Math.abs(this.playbackRate), 0.0001) -
            (next.value[i]! - destination!.value[i]!) * 60,
        ),
      };
    }
    this.presentationFrames = this.frames.map((f, index) => {
      const channels = { ...authored[index]! };
      for (const [property, correction] of Object.entries(corrections)) {
        const base = channels[property]!;
        channels[property] = {
          ...base,
          value: base.value.map(
            (v, i) =>
              v +
              residualAt(
                correction.offset[i]!,
                correction.velocity[i]!,
                f.time / 1000,
                duration / 1000,
              ).value,
          ),
        };
      }
      return { time: f.time, channels };
    });
    const keyframes: Keyframe[] = this.frames.map((f, index) => {
      const style = this.styleFn(
        f.position,
        this.lowerBound + this.upperBound - f.position,
      );
      const channels = this.presentationFrames[index]!.channels;
      return {
        ...style,
        ...this.codec!.write(
          Object.fromEntries(
            Object.keys(corrections).map((key) => [key, channels[key]!]),
          ),
        ),
      } as Keyframe;
    });
    this.renderedStyles = keyframes as StyleObject[];
    this.adopted = undefined;

    const firstFrame = keyframes[0];
    const lastFrame = this.frames[this.frames.length - 1]!;
    const playbackDuration = lastFrame.time;
    const runId = ++this.runId;

    const waapi = this._element.animate(keyframes, {
      duration: playbackDuration,
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
    this.fallbackCopy?.play();
    this.hold?.cancel();
    this.hold = null;
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
      this.finish();
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
    this.presentationTime = elapsed;
    const { position, velocity } = interpolateFrame(this.frames, elapsed);
    this.currentValue = position;
    this.currentVelocity = velocity;
    this.solverState = sampleIntegratorState(
      this.frames,
      elapsed,
      this._integrator,
      this.solverTarget,
    );
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
    this.finish();
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

function readAnimationTime(
  animation: globalThis.Animation | null,
): number | null {
  const currentTime = animation?.currentTime;
  return typeof currentTime === "number" ? currentTime : null;
}
