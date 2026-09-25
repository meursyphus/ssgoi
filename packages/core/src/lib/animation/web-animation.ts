import type { Pose, StyleObject, Timeline, TimelineFrame } from "@types";
import type { Integrator, IntegratorState } from "./integrator";
import {
  simulate,
  interpolateFrame,
  sampleIntegratorState,
  type SimFrame,
} from "../runtime/timeline";
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
  type ViewportHint,
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
/**
 * A run is created between two rendering updates, so its first painted frame
 * is one frame after the pose its first keyframe describes. Seeking this far
 * up front keeps a handoff from repeating the frame that is already on screen.
 */
const NOMINAL_FRAME_TIME = 1000 / 60;

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
 *   2. Frames are converted to WAAPI keyframes and `element.animate(...)`
 *      plays natively from the start. Its start time is pending until the
 *      browser's next rendering update, so main-thread work still queued in
 *      the current task (page mount effects, forced layout) is never charged
 *      to the animation. The effect applies while pending, which is why the
 *      inline start styles are cleared at once.
 *   3. The run is seeked one nominal frame in before that first update, so a
 *      handoff from a moving element does not repeat the pose the previous
 *      frame already painted.
 *   4. While playing, `getPose()` interpolates the live position from frames
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
  private running = false;
  private paused = false;
  private settled = false;
  private reversing = false;
  private disposed = false;
  private readonly legacyCompletionCleanup: boolean;
  readonly motion: WebMotionOptions;
  private codec: PresentationCodec | undefined;
  private viewport: ViewportHint | undefined;
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

  /**
   * Read the element's rendered box while the scene is laid out for this run.
   * The next navigation snapshots this track only after the framework has
   * unmounted the element or an Activity hide has taken it out of flow, so a
   * box measured at that point is empty or shifted and the handoff would
   * decode the pose against the wrong frame. Playback never needs this; an
   * uninterrupted run still decodes nothing.
   */
  measure(viewport?: ViewportHint): void {
    this.viewport = viewport ?? this.viewport;
    if (this.codec) return;
    const element = this._element;
    if (!element.isConnected || !(element.offsetWidth || element.offsetHeight))
      return;
    this.codec =
      this.motion.codec ?? createWebPresentationCodec(element, this.viewport);
  }

  /** Final output, including any earlier residual, is the next handoff's source. */
  getMotionSnapshot(): WebMotionSnapshot {
    if (this.running) this.captureLiveState();
    const channels = this.samplePresentation(
      readAnimationTime(this.waapi) ?? this.presentationTime,
    );
    const rate = this.paused ? 0 : this.playbackRate;
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
      this.motion.codec ??
      createWebPresentationCodec(this.element, this.viewport);
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
      // Both keyframes carry the pose. A lone keyframe sits at offset 1 and
      // interpolates from the underlying style, so a hold paused at 0 would
      // show the staged start style (fade's `opacity: 0`) instead.
      this.hold = this.element.animate([style, style] as Keyframe[], {
        duration: 1,
        fill: "both",
      });
      this.hold.pause();
      this.hold.currentTime = 0;
    }
  }

  /** Presentation channels of frame `index`, corrected when a handoff applied. */
  private channelsAt(index: number): Record<string, MotionChannel> {
    const corrected = this.presentationFrames[index];
    if (corrected) return corrected.channels;
    const frame = this.frames[index]!;
    this.codec ??=
      this.motion.codec ??
      createWebPresentationCodec(this.element, this.viewport);
    return this.codec.read({
      transform: "none",
      opacity: 1,
      ...this.styleFn(
        frame.position,
        this.lowerBound + this.upperBound - frame.position,
      ),
    });
  }

  private samplePresentation(time: number): Record<string, MotionChannel> {
    const frames = this.frames;
    if (!frames.length) {
      if (this.adopted) return { ...this.adopted.channels };
      this.codec ??=
        this.motion.codec ??
        createWebPresentationCodec(this.element, this.viewport);
      return this.codec.read({
        transform: "none",
        opacity: 1,
        ...this.styleFn(
          this.currentValue,
          this.lowerBound + this.upperBound - this.currentValue,
        ),
      });
    }
    // Only the two frames around `time` are decoded. An uninterrupted run
    // never pays for a per-frame presentation timeline.
    let index = frames.findIndex((f) => f.time > time);
    if (index < 0) index = frames.length - 1;
    const first = Math.max(0, index - 1);
    const a = frames[first]!;
    const b = frames[index]!;
    const start = this.channelsAt(first);
    const end = first === index ? start : this.channelsAt(index);
    const dt = (b.time - a.time) / 1000;
    const fraction = dt
      ? Math.max(0, Math.min(1, (time - a.time) / (dt * 1000)))
      : 0;
    const output: Record<string, MotionChannel> = {};
    for (const [property, c] of Object.entries(start)) {
      const next = end[property];
      if (!next || !compatibleChannel(c, next)) {
        output[property] = c;
        continue;
      }
      output[property] = {
        schema: c.schema,
        value: c.value.map((v, i) => v + (next.value[i]! - v) * fraction),
        velocity: c.value.map((v, i) =>
          time >= frames[frames.length - 1]!.time || !dt
            ? 0
            : (next.value[i]! - v) / dt,
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

    this.presentationTime = 0;
    this.presentationFrames = [];
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

    const authoredStyle = (f: SimFrame): StyleObject =>
      this.styleFn(f.position, this.lowerBound + this.upperBound - f.position);
    // The presentation codec is only consulted when bridging an adopted
    // presentation: measuring the element and decoding every authored frame
    // is handoff work, not something every uninterrupted transition pays.
    const keyframes: Keyframe[] = this.adopted
      ? this.bridgeKeyframes(authoredStyle)
      : this.frames.map((f) => authoredStyle(f) as Keyframe);
    this.renderedStyles = keyframes as StyleObject[];
    this.adopted = undefined;

    const firstFrame = keyframes[0];
    const lastFrame = this.frames[this.frames.length - 1]!;
    const playbackDuration = lastFrame.time;
    this.runId++;

    const waapi = this._element.animate(keyframes, {
      duration: playbackDuration,
      fill: "both",
      easing: "linear",
      composite: "replace",
    });
    waapi.playbackRate = this.playbackRate;

    this.waapi = waapi;
    this.fallbackCopy?.play();
    this.hold?.cancel();
    this.hold = null;
    this.running = true;

    waapi.onfinish = () => {
      if (!this.running || this.waapi !== waapi) return;
      this.running = false;
      this.settled = true;
      this.currentValue = lastFrame.position;
      this.currentVelocity = 0;
      this.finish();
    };

    // The effect applies from this point on, pending start time or not, so
    // the inline start styles are redundant now. Leaving them until later
    // would let snapshots and clones copy stale values.
    this.clearInlineStyle(firstFrame);
    this.beginPlayback(waapi, playbackDuration);
  }

  /**
   * Bake the residual correction into the keyframes: each authored frame is
   * decoded through the codec, offset by the decaying residual, and encoded
   * back. `presentationFrames` records the corrected output so a later
   * interruption samples what is actually displayed.
   */
  private bridgeKeyframes(
    authoredStyle: (frame: SimFrame) => StyleObject,
  ): Keyframe[] {
    this.codec =
      this.motion.codec ??
      createWebPresentationCodec(this.element, this.viewport);
    const codec = this.codec;
    const duration = Math.max(16, this.motion.handoffDuration ?? 280);
    const lastAuthored = this.frames[this.frames.length - 1]!;
    for (
      let time = lastAuthored.time + 1000 / 60;
      time < duration + 1000 / 60;
      time += 1000 / 60
    ) {
      this.frames.push({ time, position: lastAuthored.position, velocity: 0 });
    }
    const authored = this.frames.map((f) =>
      codec.read({ transform: "none", opacity: 1, ...authoredStyle(f) }),
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
        destination = codec.read(neutral)[property];
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
    return this.frames.map((f, index) => {
      const channels = this.presentationFrames[index]!.channels;
      return {
        ...authoredStyle(f),
        ...codec.write(
          Object.fromEntries(
            Object.keys(corrections).map((key) => [key, channels[key]!]),
          ),
        ),
      } as Keyframe;
    });
  }

  private clearWaapi() {
    this.runId++;
    this.waapi?.cancel();
    this.waapi = null;
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

  /**
   * `Element.animate()` auto-plays with a pending start time that the browser
   * resolves at its next rendering update, after whatever the current task
   * still has to do. The run is seeked one nominal frame in while pending, so
   * its first painted frame follows the frame that showed its first keyframe.
   * A negative rate takes WAAPI's own auto-rewind: `play()` seeks to the end
   * and runs the baked path backwards.
   */
  private beginPlayback(waapi: globalThis.Animation, duration: number): void {
    const rate = this.playbackRate;
    if (rate < 0) {
      waapi.play();
      return;
    }
    if (rate > 0) {
      waapi.currentTime = Math.min(duration, NOMINAL_FRAME_TIME * rate);
    }
  }

  private clearInlineStyle(frame: Keyframe | undefined): void {
    if (!frame) return;
    for (const prop of Object.keys(frame)) {
      (this._element.style as unknown as Record<string, string>)[prop] = "";
    }
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
