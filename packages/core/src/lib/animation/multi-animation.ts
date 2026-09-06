import type { PhysicsOptions, Pose, Timeline } from "@types";
import { Animation } from "./animation";
import { frameScheduler } from "./frame-scheduler";
import { IntegratorProvider, type Integrator } from "./integrator";
import { WebAnimation } from "./web-animation";

export interface TrackPatch {
  /** New physics — an `Integrator` instance or the `{ spring | inertia }` shape. */
  integrator?: Integrator | PhysicsOptions;
}

function toIntegrator(value: Integrator | PhysicsOptions): Integrator {
  return typeof (value as Integrator).step === "function"
    ? (value as Integrator)
    : IntegratorProvider.from(value as PhysicsOptions);
}

export type MultiAnimationMode = "parallel" | "sequence";

export interface MultiAnimationOptions {
  mode?: MultiAnimationMode;
  /**
   * Per-child start progress (0..1), keyed off the *previous* child. Only
   * meaningful for `parallel` mode. `startAt[i]` = the progress the (i-1)th
   * child must reach before the i-th child plays. `startAt[0]` is ignored
   * (the first child always starts immediately).
   *
   * Omit (or use all zeros) for true simultaneous start — the existing
   * parallel behavior. Use a fractional value (e.g. `[0, 0.4]`) for
   * fade-through / shared-axis style overlap that's robust to spring tuning
   * changes (the trigger moves with the spring, not with wall-clock time).
   */
  startAt?: number[];
}

/**
 * Composite that drives several child Animations.
 *
 * - `parallel`: all children play together (optionally staggered via `startAt`)
 * - `sequence`: each child waits for the previous to settle, then plays
 *
 * Pose/Timeline reads fan out to every child for diagnostic / inspection use.
 */
export class MultiAnimation extends Animation {
  private readonly _children: Animation[];
  private _startAt: number[];
  /**
   * Every child shares one physics (drill's parallax pair, sheet's
   * sheet + background + overlay, zoom's tile + background). When set,
   * `set(label, …)` patches every `WebAnimation` regardless of label so the
   * geometric coupling is never broken. Assigned by `withOverride`.
   */
  coupled = false;
  private pendingComplete = 0;
  private running = false;
  private pendingStartObservers: Array<() => void> = [];

  constructor(children: Animation[], opts: MultiAnimationOptions = {}) {
    super();
    this._children = children;
    // Both `sequence` and `parallel` collapse onto a single scheduling
    // mechanism: each child waits for its predecessor to hit a progress
    // threshold. `sequence` is just `startAt = [0, 1, 1, …]` (next child
    // starts when the previous fully settles); `parallel` defaults to
    // `[0, 0, …]` (everyone starts together). Public API keeps both modes
    // for clarity, but only one code path runs.
    if ((opts.mode ?? "parallel") === "sequence") {
      this._startAt = children.map((_, i) => (i === 0 ? 0 : 1));
    } else {
      this._startAt = opts.startAt ?? [];
    }
  }

  /** Child animations in play order. */
  get children(): readonly Animation[] {
    return this._children;
  }

  /**
   * Per-child start thresholds (see `MultiAnimationOptions.startAt`). Read
   * at run time, so replacing it before `play()` changes the overlap.
   */
  get startAt(): number[] {
    return this._startAt;
  }
  set startAt(value: number[]) {
    this._startAt = value;
  }

  /** Every `WebAnimation` in this composite, nested composites included. */
  tracks(): WebAnimation[] {
    const out: WebAnimation[] = [];
    for (const child of this._children) {
      if (child instanceof WebAnimation) out.push(child);
      else if (child instanceof MultiAnimation) out.push(...child.tracks());
    }
    return out;
  }

  /** `WebAnimation`s whose `label` matches, nested composites included. */
  select(label: string): WebAnimation[] {
    return this.tracks().filter((track) => track.label === label);
  }

  /**
   * Patch the tracks with this label (all tracks when `coupled`). Unknown
   * labels are a no-op so app-wide overrides can address roles a preset
   * doesn't have.
   */
  set(label: string, patch: TrackPatch): this {
    const targets = this.coupled ? this.tracks() : this.select(label);
    if (patch.integrator !== undefined) {
      const integrator = toIntegrator(patch.integrator);
      for (const track of targets) track.integrator = integrator;
    }
    return this;
  }

  play(): void {
    this.startRun("play");
  }

  reverse(): void {
    this.startRun("reverse");
  }

  pause(): void {
    this.running = false;
    this.clearPendingStartObservers();
    for (const child of this._children) child.pause();
  }

  complete(): void {
    this.running = false;
    this.clearPendingStartObservers();
    for (const child of this._children) child.complete();
    this.onComplete?.();
  }

  get progress(): number {
    if (this._children.length === 0) return 0;
    let sum = 0;
    for (const child of this._children) sum += child.progress;
    return sum / this._children.length;
  }

  getPose(): Pose[] {
    return this._children.flatMap((c) => c.getPose());
  }

  getTimeline(): Timeline[] {
    return this._children.flatMap((c) => c.getTimeline());
  }

  matchInto(_poses: Pose[]): void {
    // TODO: handing a flat pose list to a composite isn't well-defined yet —
    // sequence/stagger progress, mode mismatches, and active-child awareness
    // all need a richer protocol than per-child broadcast. Left as a no-op
    // for now so we don't pretend to support cross-multi handoff.
  }

  get isAnimating(): boolean {
    return this._children.some((c) => c.isAnimating);
  }
  get isPaused(): boolean {
    return (
      this._children.some((c) => c.isPaused) &&
      this._children.every((c) => c.isPaused || c.isComplete)
    );
  }
  get isComplete(): boolean {
    return this._children.every((c) => c.isComplete);
  }
  get isReversing(): boolean {
    return this._children.some((c) => c.isReversing);
  }

  get playbackRate(): number {
    return super.playbackRate;
  }
  set playbackRate(rate: number) {
    super.playbackRate = rate;
    for (const child of this._children) child.playbackRate = rate;
  }

  /* ───────────────────────────────────────────────────────── private */

  private startRun(method: "play" | "reverse") {
    if (this.running) this.pause();
    this.running = true;
    this.pendingComplete = this._children.length;
    if (this.pendingComplete === 0) {
      this.handleFinished();
      return;
    }
    for (const child of this._children) {
      const prevOnComplete = child.onComplete;
      child.onComplete = () => {
        prevOnComplete?.();
        this.handleChildComplete();
      };
    }
    this.scheduleStart(0, method);
  }

  // Chained start: play child `index`, then observe its actual progress before
  // starting the next one. A wall-clock timeout starts counting before WAAPI's
  // asynchronous startup has completed, so mount/layout delays can otherwise
  // make a sequence or stagger run early. The shared frame scheduler evaluates
  // observers after frame-paced drivers, matching the pose painted this frame.
  private scheduleStart(index: number, method: "play" | "reverse") {
    if (!this.running) return;
    if (index >= this._children.length) return;
    this._children[index]![method]();
    const next = index + 1;
    if (next >= this._children.length) return;

    const threshold = this._startAt[next];
    if (threshold === undefined || threshold <= 0) {
      this.scheduleStart(next, method);
      return;
    }
    const child = this._children[index]!;
    if (this.hasReachedThreshold(child, threshold, method)) {
      this.scheduleStart(next, method);
      return;
    }

    const stop = frameScheduler.subscribe(() => {
      if (!this.running) return;
      if (!this.hasReachedThreshold(child, threshold, method)) return;
      stop();
      this.pendingStartObservers = this.pendingStartObservers.filter(
        (candidate) => candidate !== stop,
      );
      this.scheduleStart(next, method);
    }, "observe");
    this.pendingStartObservers.push(stop);
  }

  private hasReachedThreshold(
    child: Animation,
    threshold: number,
    method: "play" | "reverse",
  ): boolean {
    if (child.isComplete) return true;
    const runProgress = method === "play" ? child.progress : 1 - child.progress;
    return runProgress >= threshold;
  }

  private clearPendingStartObservers() {
    for (const stop of this.pendingStartObservers) stop();
    this.pendingStartObservers = [];
  }

  private handleChildComplete() {
    this.pendingComplete--;
    if (this.pendingComplete <= 0) this.handleFinished();
  }

  private handleFinished() {
    this.running = false;
    this.clearPendingStartObservers();
    this.onComplete?.();
  }

  findTimeForProgress(_threshold: number): number | null {
    // A composite's "progress" is an average across children that may start
    // at different times — there is no single timeline to consult. Return
    // null so callers (e.g. an outer MultiAnimation) fall through to an
    // immediate start rather than guessing a wrong ms value.
    return null;
  }
}
