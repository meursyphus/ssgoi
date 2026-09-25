import type { Pose, Timeline } from "@types";
import { Animation, type AnimationDisposal } from "./animation";
import { MultiAnimation } from "./multi-animation";
import { WebAnimation } from "./web-animation";
import { SpringIntegrator } from "./integrator/spring-integrator";
import { createWebPresentationCodec } from "./web-presentation";
import { matchMotion, type MotionSnapshot } from "../runtime/motion-matching";
import { retainOpacity } from "../utils/retain-opacity";

type HostState = "idle" | "playing" | "paused" | "reversing";
type Run = {
  animation: Animation;
  epoch: number;
  targets: Set<HTMLElement>;
  /** Persistent sources whose identity this run carries on another node. */
  hidden: Array<() => void>;
};
type RetiringRun = Run & { releases: WebAnimation[] };
export interface HandoffEvent {
  kind: "element" | "key" | "enter" | "ambiguous" | "release" | "fallback";
  target?: HTMLElement;
  key?: string;
  channels?: readonly string[];
  fallback?: "crossfade" | "finish";
}
export interface HostAttachOptions {
  /** Presence is independent of tracks: blind/static hero can leave pages unanimated. */
  targets?: readonly HTMLElement[];
}

function tracks(animation: Animation): WebAnimation[] {
  return [...animation.getMotionTracks()];
}

/** A transition scope owns live presentation, replaceable choreography, and retirement. */
export class HostAnimation extends Animation {
  private child: Animation | null = null;
  private run: Run | null = null;
  private retiring: RetiringRun[] = [];
  private owners = new WeakMap<HTMLElement, number>();
  private epoch = 0;
  private prepared: MotionSnapshot<HTMLElement>[] | null = null;
  private _state: HostState = "idle";
  private _settled = false;
  private listeners = new Set<() => void>();
  onHandoff?: (events: readonly HandoffEvent[]) => void;

  /** Called before effect prepare mutates reused elements or measures anchors. */
  prepareHandoff(): void {
    if (this.prepared) return;
    this.prepared = this.sceneSnapshots();
    this.child?.pause();
    for (const run of this.retiring)
      for (const release of run.releases) release.pause();
  }

  attach(next: Animation, options: HostAttachOptions = {}): void {
    if (this.child === next) return;
    next.validate();
    const previous = this.run;
    const snapshots = this.prepared ?? this.sceneSnapshots();
    this.prepared = null;
    const epoch = ++this.epoch;
    const authoredTracks = tracks(next);
    const restorations = snapshots
      .filter(
        (source) =>
          source.lifetime !== "temporary" &&
          !authoredTracks.some((track) => track.element === source.target) &&
          (options.targets ?? []).some(
            (root) => root === source.target || root.contains?.(source.target),
          ) &&
          // Only channels with a known base presentation can be restored.
          // Anything else (clip, filter, color) is returned by the previous
          // effect's own cleanup, which keeps ownership of that target.
          ("transform" in source.channels || "opacity" in source.channels),
      )
      .map((source) => {
        const target = source.target;
        const before = {
          transform: target.style.transform,
          opacity: target.style.opacity,
        };
        const opacity = target.style.opacity || 1;
        return new WebAnimation({
          element: target,
          integrator: new SpringIntegrator({ stiffness: 200, damping: 24 }),
          style: () => ({ transform: "none", opacity }),
          motion: { key: source.key, role: source.role, space: source.space },
          // A restoration writes its resting frame inline when it settles.
          // Leave no trace where nothing was set before, so the element's
          // stylesheet values govern again.
          onDispose: () => {
            if (!before.transform && target.style.transform === "none")
              target.style.transform = "";
            if (
              !before.opacity &&
              String(target.style.opacity) === String(opacity)
            )
              target.style.opacity = "";
          },
        });
      });
    if (restorations.length) {
      const dispose = next.onDispose;
      next.onDispose = undefined;
      next = new MultiAnimation({
        effect: next,
        restore: new MultiAnimation(restorations),
      });
      next.onDispose = dispose;
    }
    const nextTracks = tracks(next);
    const targets = new Set([
      ...(options.targets ?? []),
      ...nextTracks.map((t) => t.element),
    ]);
    // Ownership covers the pages and the effect's own tracks. A restoration
    // track only returns transform/opacity to rest; the previous effect keeps
    // ownership so its cleanup still clears everything else it wrote there.
    for (const target of options.targets ?? []) this.owners.set(target, epoch);
    for (const track of authoredTracks) this.owners.set(track.element, epoch);
    this.child = next;
    const current: Run = { animation: next, epoch, targets, hidden: [] };
    this.run = current;
    this._settled = false;
    const events: HandoffEvent[] = [];

    if (
      next.supportsInterruption &&
      (!previous || previous.animation.supportsInterruption)
    ) {
      const matches = matchMotion(
        snapshots,
        nextTracks.map((t) => t.motionIdentity),
      );
      matches.forEach((match, i) => {
        events.push({
          kind: match.reason,
          target: match.next.target,
          key: match.next.key,
        });
        if (match.previous) nextTracks[i]!.adopt(match.previous);
        if (nextTracks[i]!.handoffFallbacks.length)
          events.push({
            kind: "fallback",
            target: match.next.target,
            channels: nextTracks[i]!.handoffFallbacks,
            fallback: nextTracks[i]!.handoffFallbackMode,
          });
      });
      for (const match of matches) {
        if (!match.previous || match.previous.target === match.next.target)
          continue;
        if (match.previous.lifetime === "temporary") {
          match.previous.target.remove();
          continue;
        }
        // A persistent source (an in-page image) whose flight moved to a new
        // node must not also stay visible at rest inside its page. The lease
        // outlives the previous run's own cleanup, which re-asserts it.
        const lease = retainOpacity(match.previous.target);
        lease.set(0);
        current.hidden.push(lease.restore);
      }
      // Reclaim an older exiting surface too (A -> B -> C -> A), not only B/C.
      for (const run of [...this.retiring]) {
        for (const release of run.releases) {
          const claimed =
            targets.has(release.element) ||
            matches.some((m) => m.previous?.target === release.element);
          if (claimed)
            release.cancel({ reason: "interrupted", owns: () => false });
        }
        run.releases = run.releases.filter((r) => r.isAnimating || r.isPaused);
        if (!run.releases.length) this.disposeRetiring(run);
      }
      if (previous)
        this.retire(
          previous,
          snapshots,
          new Set([
            ...targets,
            ...matches.flatMap((m) => (m.previous ? [m.previous.target] : [])),
          ]),
          events,
        );
    } else if (previous) {
      events.push({ kind: "fallback" });
      // No interpretation of an opaque custom driver's scalar as a visual pose.
      const styles = [...targets].map(
        (element) => [element, element.style.cssText] as const,
      );
      previous.animation.complete();
      for (const [element, cssText] of styles) element.style.cssText = cssText;
    }

    next.playbackRate = this.playbackRate;
    const previousDispose = next.onDispose;
    next.onDispose = (disposal) => {
      try {
        previousDispose?.(disposal);
      } finally {
        for (const restore of current.hidden.splice(0)) restore();
      }
    };
    const previousDone = next.onComplete;
    next.onComplete = () => {
      previousDone?.();
      if (this.child === next) {
        this.child = null;
        this.run = null;
        this._state = "idle";
        this._settled = this.retiring.length === 0;
      }
      this.notify();
    };
    const previousUpdate = next.onUpdate;
    next.onUpdate = (poses) => {
      previousUpdate?.(poses);
      if (this.child !== next) return;
      this.onUpdate?.(poses);
      this.notify();
    };
    if (this._state === "paused") next.pause();
    else {
      // A new navigation owns its direction; reversing the superseded plan
      // must not reverse an unrelated, already direction-resolved effect.
      this._state = "playing";
      next.play();
    }
    for (const run of this.retiring)
      for (const release of run.releases) {
        if (this._state !== "paused" && release.isPaused) release.play();
      }
    this.onHandoff?.(events);
    this.notify();
  }

  private sceneSnapshots(): MotionSnapshot<HTMLElement>[] {
    return [
      ...(this.child
        ? tracks(this.child).map((t) => t.getMotionSnapshot())
        : []),
      ...(this.run
        ? [...this.run.targets]
            .filter(
              (target) =>
                !tracks(this.run!.animation).some((t) => t.element === target),
            )
            .map((target) => ({
              target,
              channels: createWebPresentationCodec(target).read({
                transform:
                  typeof getComputedStyle === "function"
                    ? getComputedStyle(target).transform || "none"
                    : "none",
                opacity:
                  typeof getComputedStyle === "function"
                    ? getComputedStyle(target).opacity || "1"
                    : "1",
              }),
            }))
        : []),
      ...this.retiring.flatMap((run) =>
        run.releases.map((t) => t.getMotionSnapshot()),
      ),
    ];
  }

  private disposal(run: Run): AnimationDisposal {
    return {
      reason: "interrupted",
      owns: (element) =>
        !this.owners.has(element) || this.owners.get(element) === run.epoch,
    };
  }

  private retire(
    previous: Run,
    snapshots: MotionSnapshot<HTMLElement>[],
    targets: Set<HTMLElement>,
    events: HandoffEvent[],
  ): void {
    previous.animation.stop();
    const oldTracks = tracks(previous.animation);
    const run: RetiringRun = { ...previous, releases: [] };
    const containers = new Set([...previous.targets, ...targets]);
    for (const target of previous.targets) {
      if (targets.has(target)) continue;
      // Fade a page once, rather than fading it and all its animated
      // descendants. A descendant of a page that survives is not released
      // either: it belongs to its page, and the previous effect's cleanup
      // returns it to rest.
      if (
        [...containers].some(
          (parent) => parent !== target && parent.contains?.(target),
        )
      )
        continue;
      const source = snapshots.find((s) => s.target === target);
      if (!source) continue;
      if (
        oldTracks.find((t) => t.element === target)?.motion.release === "remove"
      )
        continue;
      const policy = oldTracks.find((t) => t.element === target)?.motion
        .release;
      if (typeof policy === "function") {
        try {
          const release = policy(source);
          if (release.element !== target)
            throw new Error("Release must own the retiring target");
          release.validate();
          const done = release.onComplete;
          release.onComplete = () => {
            done?.();
            if (run.releases.every((t) => t.isComplete))
              this.disposeRetiring(run);
          };
          release.adopt(source);
          release.playbackRate = this.playbackRate;
          run.releases.push(release);
          events.push({ kind: "release", target });
          continue;
        } catch (error) {
          console.error("[ssgoi] invalid release; using fade", error);
          events.push({ kind: "fallback", target });
        }
      }
      const codec = createWebPresentationCodec(target);
      const style = codec.write(source.channels);
      const opacity = Number(style.opacity ?? 1);
      const release = new WebAnimation({
        element: target,
        integrator: {
          step: (state, target, dt) => ({
            position: Math.min(target, state.position + dt / 0.18),
            velocity: state.position >= target ? 0 : 1 / 0.18,
          }),
          isSettled: (state, target) => state.position >= target,
        },
        style: (_t, u) => ({ ...style, opacity: opacity * u }),
        motion: {
          ...oldTracks.find((t) => t.element === target)?.motion,
          handoffDuration: 180,
        },
        onComplete: () => {
          if (run.releases.every((t) => t.isComplete))
            this.disposeRetiring(run);
        },
      });
      release.adopt(source);
      release.playbackRate = this.playbackRate;
      run.releases.push(release);
      events.push({ kind: "release", target });
    }
    if (!run.releases.length) {
      previous.animation.cancel(this.disposal(previous));
      return;
    }
    this.retiring.push(run);
    for (const release of run.releases) {
      release.play();
      if (this._state === "paused") release.pause();
    }
    // Resource use stays bounded even if navigation repeatedly interrupts retirement.
    while (this.retiring.length > 8) this.disposeRetiring(this.retiring[0]!);
  }

  private disposeRetiring(run: RetiringRun): void {
    if (!this.retiring.includes(run)) return;
    this.retiring = this.retiring.filter((item) => item !== run);
    for (const release of run.releases)
      release.cancel({ reason: "disposed", owns: () => false });
    run.animation.cancel(this.disposal(run));
    if (!this.child && !this.retiring.length) this._settled = true;
    this.notify();
  }

  play(): void {
    this._state = "playing";
    this._settled = false;
    this.child?.play();
    for (const run of this.retiring)
      for (const release of run.releases) release.play();
    this.notify();
  }
  reverse(): void {
    this._state = "reversing";
    this._settled = false;
    this.child?.reverse();
    this.notify();
  }
  pause(): void {
    this._state = "paused";
    this.child?.pause();
    for (const run of this.retiring)
      for (const release of run.releases) release.pause();
    this.notify();
  }
  complete(): void {
    this.prepared = null;
    this.child?.complete();
    for (const run of [...this.retiring]) this.disposeRetiring(run);
    this.notify();
  }
  cancel(context: AnimationDisposal): void {
    this.prepared = null;
    const current = this.child;
    this.child = null;
    this.run = null;
    this._state = "idle";
    current?.cancel(context);
    for (const run of [...this.retiring]) this.disposeRetiring(run);
    this._settled = true;
    this.notify();
  }
  get isAnimating(): boolean {
    return (
      !!this.child?.isAnimating ||
      this.retiring.some((r) => r.releases.some((t) => t.isAnimating))
    );
  }
  get isPaused(): boolean {
    return this._state === "paused";
  }
  get isComplete(): boolean {
    return this._settled && !this.child && !this.retiring.length;
  }
  get isReversing(): boolean {
    return this.child?.isReversing ?? this._state === "reversing";
  }
  get progress(): number {
    return this.child?.progress ?? 0;
  }
  findTimeForProgress(threshold: number): number | null {
    return this.child?.findTimeForProgress(threshold) ?? null;
  }
  get playbackRate(): number {
    return super.playbackRate;
  }
  set playbackRate(rate: number) {
    super.playbackRate = rate;
    if (this.child) this.child.playbackRate = rate;
    for (const run of this.retiring)
      for (const release of run.releases) release.playbackRate = rate;
    this.notify();
  }
  getPose(): Pose[] {
    return this.child?.getPose() ?? [];
  }
  getTimeline(): Timeline[] {
    return this.child?.getTimeline() ?? [];
  }
  matchInto(poses: Pose[]): void {
    this.child?.matchInto(poses);
  }
  get activeChild(): Animation | null {
    return this.child;
  }
  get retiringCount(): number {
    return this.retiring.length;
  }
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
  private notify(): void {
    for (const fn of this.listeners) fn();
  }
}
