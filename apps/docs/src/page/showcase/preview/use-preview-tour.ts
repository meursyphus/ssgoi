"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { framePath, samePath } from "@/lib/preview-path";
import type { PreviewProgram, PreviewStep } from "./program";
import {
  getPreviewScheduler,
  type NavOutcome,
  type PreviewFrame,
  type PreviewScheduler,
} from "./scheduler";

/** No animation status this long after the ack: the move did not animate. */
const START_GRACE_MS = 500;
/** Give up waiting for a started animation to settle after this. */
const SETTLE_TIMEOUT_MS = 4000;
const RETRY_MS = 700;
/** A move's request, commit and animation, before its dwell starts. */
const MOVE_MS = 900;
/**
 * The first screen holds this long before the first move, so it is seen
 * after the frame's loading overlay fades out (500 ms).
 */
const OPENING_DWELL_MS = 1000;
/** Mask fade before a silent reposition (the consumer's CSS fade is 150 ms). */
const MASK_FADE_MS = 170;
/** After a reposition: the mask fades out and the new screen reads, then the move. */
const MASK_REVEAL_MS = 650;

/**
 * How long the push at `index` keeps its entry open: its own move and dwell
 * and every step after it, up to the back that closes it.
 */
export function openSpan(program: PreviewProgram, index: number): number {
  const { steps } = program;
  const base = steps[index].depthBefore;
  let ms = 0;
  for (let k = 0; k < steps.length; k++) {
    const step = steps[(index + k) % steps.length];
    if (k > 0 && step.kind === "back" && step.depthBefore === base + 1)
      return ms;
    ms += MOVE_MS + step.dwell;
  }
  return ms;
}

export type PreviewTourOptions = {
  /** Debug name (e.g. the showcase slug). */
  name: string;
  /**
   * Run the loop. When false the preview unwinds to depth 0 (silently),
   * pauses, and later resumes at the start of the excursion it was in.
   */
  active: boolean;
  /** Stay on the current screen (e.g. playback paused in a dock). */
  hold?: boolean;
  /**
   * The consumer covers the frame while `playback.masked` (a quick fade to
   * the page's background), so silent repositions between unconnected
   * moves dissolve instead of cutting. The runner waits for the fade.
   */
  mask?: boolean;
};

export type PreviewPlayback = {
  /** The frame's bridge answered. */
  ready: boolean;
  /** The move playing now, or the last one played. */
  step: PreviewStep | null;
  /** The frame's current path. */
  path: string | null;
  /** Cover the frame: a silent reposition is under way (`mask` option). */
  masked: boolean;
  /** The page's background where the mask was raised (CSS color). */
  maskColor: string;
};

type Inputs = {
  program: PreviewProgram | null;
  active: boolean;
  hold: boolean;
  mask: boolean;
};

/**
 * Plays `program` in the iframe forever: each move goes through the page's
 * joint-history scheduler, waits for the SSGOI transition to start and
 * settle, then dwells. See `scheduler.ts` for the history rules.
 */
export function usePreviewTour(
  frame: HTMLIFrameElement | null,
  program: PreviewProgram | null,
  { name, active, hold = false, mask = false }: PreviewTourOptions,
): PreviewPlayback {
  const [playback, setPlayback] = useState<PreviewPlayback>({
    ready: false,
    step: null,
    path: null,
    masked: false,
    maskColor: "#fff",
  });
  const inputs = useRef<Inputs>({ program, active, hold, mask });
  const runner = useRef<TourRunner | null>(null);

  useEffect(() => {
    inputs.current = { program, active, hold, mask };
    runner.current?.inputsChanged();
  }, [program, active, hold, mask]);

  useEffect(() => {
    const win = frame?.contentWindow;
    if (!frame || !win) return;
    const scheduler = getPreviewScheduler();
    const record = scheduler.register(win, name);
    const r = new TourRunner(
      scheduler,
      record,
      () => inputs.current,
      (next) =>
        setPlayback((prev) =>
          prev.ready === next.ready &&
          prev.step === next.step &&
          prev.path === next.path &&
          prev.masked === next.masked &&
          prev.maskColor === next.maskColor
            ? prev
            : next,
        ),
    );
    runner.current = r;
    void r.run();
    return () => {
      r.stop();
      runner.current = null;
      scheduler.unregister(record);
    };
  }, [frame, name]);

  return playback;
}

class TourRunner {
  private stopped = false;
  private program: PreviewProgram | null = null;
  private index = 0;
  private abort = new AbortController();
  private wakers = new Set<() => void>();
  private lastKey: string | null = null;
  private lastRunnable = false;
  /** Paths the demo redirects (e.g. an origin to its first tab). */
  private aliases = new Map<string, string>();
  private lastNav: { to: string; at: number; landed?: string } | null = null;
  private unsubscribe: () => void;

  constructor(
    private scheduler: PreviewScheduler,
    private frame: PreviewFrame,
    private inputs: () => Inputs,
    private report: (playback: PreviewPlayback) => void,
  ) {
    this.unsubscribe = scheduler.subscribe(() => {
      this.checkInterrupt();
      this.wake();
    });
  }

  stop() {
    this.stopped = true;
    this.abort.abort();
    this.unsubscribe();
    this.wake();
  }

  inputsChanged() {
    this.syncHeld();
    this.checkInterrupt();
    this.wake();
  }

  /** Tell the scheduler when this frame holds its screen indefinitely. */
  private syncHeld() {
    const { active, hold } = this.inputs();
    this.scheduler.setHeld(this.frame, Boolean(active && hold));
  }

  private runnable() {
    const { active, program } = this.inputs();
    return Boolean(active && program && !this.scheduler.suspension);
  }

  /** Abort the current wait when the move in progress no longer applies. */
  private checkInterrupt() {
    const key = this.inputs().program?.key ?? null;
    const runnable = this.runnable();
    if (key !== this.lastKey || (this.lastRunnable && !runnable)) {
      this.abort.abort();
      this.abort = new AbortController();
    }
    this.lastKey = key;
    this.lastRunnable = runnable;
  }

  private wake() {
    const wakers = [...this.wakers];
    this.wakers.clear();
    for (const fn of wakers) fn();
  }

  /** Resolves on the next change (inputs, scheduler, frame) or after `ms`. */
  private changed(ms?: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
      let timer: number | undefined;
      const done = () => {
        window.clearTimeout(timer);
        this.wakers.delete(done);
        signal?.removeEventListener("abort", done);
        resolve();
      };
      this.wakers.add(done);
      if (ms !== undefined) timer = window.setTimeout(done, ms);
      signal?.addEventListener("abort", done, { once: true });
    });
  }

  private sleep(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
      if (signal.aborted || ms <= 0) return resolve();
      const timer = window.setTimeout(done, ms);
      function done() {
        window.clearTimeout(timer);
        signal.removeEventListener("abort", done);
        resolve();
      }
      signal.addEventListener("abort", done, { once: true });
    });
  }

  private lastStep: PreviewStep | null = null;
  private masked = false;
  private maskColor = "#fff";

  private publish(step: PreviewStep | null = this.lastStep) {
    this.lastStep = step;
    this.report({
      ready: this.frame.ready,
      step,
      path: this.frame.path,
      masked: this.masked,
      maskColor: this.maskColor,
    });
  }

  /** Whether silent moves should dissolve (the frame is watched). */
  private masking() {
    const { mask, active } = this.inputs();
    return mask && active && !this.scheduler.suspension;
  }

  /** Cover the frame (and wait for the fade) or uncover it. */
  private async setMask(on: boolean, signal: AbortSignal) {
    if (this.masked === on) return;
    this.masked = on;
    if (on) this.maskColor = pageBackground(this.frame.win);
    this.publish();
    await this.sleep(on ? MASK_FADE_MS : MASK_REVEAL_MS, signal);
  }

  /** Drop the mask at once (the frame is not watched, or holds). */
  private clearMask() {
    if (!this.masked) return;
    this.masked = false;
    this.publish();
  }

  /**
   * Back to depth 0. Waits for the frame's entries to reach the top. With
   * `mask`, the frame is covered only once its back is granted, so it never
   * sits covered while other previews finish first.
   */
  private async unwind(silent: boolean, mask = false) {
    const cover = async () => {
      if (this.masking()) await this.setMask(true, this.abort.signal);
    };
    while (!this.stopped && this.frame.depth > 0) {
      const r = await this.scheduler.back(this.frame, {
        silent,
        prepare: mask ? cover : undefined,
      });
      if (!r.ok && r.reason === "disposed") return;
      if (!r.ok && r.reason !== "depth") {
        this.clearMask();
        await this.changed(RETRY_MS);
      }
    }
  }

  private resolve(path: string) {
    const p = framePath(path);
    return this.aliases.get(p) ?? p;
  }

  private navigated(to: string) {
    this.lastNav = { to: framePath(to), at: performance.now() };
  }

  /**
   * The frame is not on `from` because the demo redirected our last
   * navigation to `from` (a landed path that differs, or a move of its own
   * right after): remember the redirect instead of fighting it.
   */
  private redirectedFrom(from: string): boolean {
    const last = this.lastNav;
    const here = this.frame.path;
    if (!last || !here || last.to !== from) return false;
    const f = this.frame.foreign;
    const redirected =
      (last.landed !== undefined && samePath(last.landed, here)) ||
      (f !== null &&
        f.at > last.at &&
        f.at - last.at < 5000 &&
        samePath(f.from, from) &&
        samePath(f.to, here));
    if (redirected) this.aliases.set(from, here);
    return redirected;
  }

  /** The step after the back that closes the push at `index`. */
  private afterExcursion(program: PreviewProgram, index: number) {
    const base = program.steps[index].depthBefore;
    for (let j = index + 1; j < program.steps.length; j++)
      if (
        program.steps[j].depthBefore === base + 1 &&
        program.steps[j].kind === "back"
      )
        return (j + 1) % program.steps.length;
    return (index + 1) % program.steps.length;
  }

  private exec(
    program: PreviewProgram,
    step: PreviewStep,
    signal: AbortSignal,
  ): Promise<NavOutcome> {
    if (step.kind === "push")
      return this.scheduler.push(this.frame, step.to, {
        signal,
        span: openSpan(program, this.index),
      });
    if (step.kind === "back")
      return this.scheduler.back(this.frame, { signal });
    return this.scheduler.replace(this.frame, step.to);
  }

  /** True when an SSGOI animation ran for this move. */
  private async settle(since: number, signal: AbortSignal): Promise<boolean> {
    const ackAt = performance.now();
    let deadline = ackAt + SETTLE_TIMEOUT_MS;
    while (!this.stopped && !signal.aborted) {
      const f = this.frame;
      const started = f.activeAt >= since;
      if (started && (f.status === "settled" || f.status === "idle"))
        return true;
      if (!started && performance.now() - ackAt > START_GRACE_MS) return false;
      // Paused in a dock: wait as long as it takes.
      if (f.status === "paused")
        deadline = performance.now() + SETTLE_TIMEOUT_MS;
      if (performance.now() > deadline) return started;
      await this.changed(60, signal);
    }
    return this.frame.activeAt >= since;
  }

  private describe(program: PreviewProgram) {
    this.frame.program = {
      key: program.key,
      pairs: program.steps.map((s) => [s.from, s.to, s.kind, s.dwell]),
    };
  }

  async run() {
    while (!this.stopped && !this.frame.ready) await this.changed(1000);
    this.publish(null);
    this.syncHeld();
    this.checkInterrupt();
    await this.sleep(OPENING_DWELL_MS, this.abort.signal);

    while (!this.stopped) {
      const { program: wanted, active, hold } = this.inputs();
      const suspension = this.scheduler.suspension;

      if (!wanted) {
        this.clearMask();
        await this.unwind(true);
        await this.changed();
        continue;
      }

      if (this.program?.key !== wanted.key || this.program !== wanted) {
        const switching = this.program?.key !== wanted.key;
        if (switching) {
          // Effect ↔ tour: return silently, then start the new loop.
          await this.unwind(true, this.masking());
          if (this.stopped) return;
          if (this.frame.depth > 0) {
            await this.changed(RETRY_MS);
            continue;
          }
          this.index = 0;
        } else {
          // Same loop, rebuilt data: keep the position.
          this.index = Math.min(this.index, wanted.steps.length - 1);
        }
        this.program = wanted;
        this.describe(wanted);
        continue;
      }
      const program = this.program;

      if (!active || suspension) {
        this.clearMask();
        await this.unwind(suspension ? suspension.silent : true);
        this.index = program.resume[this.index] ?? 0;
        if (this.stopped) return;
        if (!this.runnable()) await this.changed();
        continue;
      }
      if (hold) {
        this.clearMask();
        await this.changed();
        continue;
      }

      const step = program.steps[this.index];
      const signal = this.abort.signal;

      // Line the frame up with where this move starts.
      if (this.frame.depth !== step.depthBefore) {
        await this.unwind(true, this.masking());
        this.index = program.resume[this.index] ?? 0;
        if (this.frame.depth > 0) await this.changed(RETRY_MS);
        continue;
      }
      const from = this.resolve(step.from);
      if (!samePath(this.frame.path, from)) {
        if (this.redirectedFrom(framePath(step.from))) continue;
        if (this.masking()) await this.setMask(true, signal);
        this.navigated(from);
        const r = await this.scheduler.replace(this.frame, from, {
          silent: true,
        });
        if (r.ok && this.lastNav && r.path) this.lastNav.landed = r.path;
        if (!r.ok) {
          this.clearMask();
          await this.changed(RETRY_MS);
        }
        continue;
      }
      if (step.kind === "replace" && samePath(this.resolve(step.to), from)) {
        // Redirects back onto this screen: nothing to show.
        this.index = (this.index + 1) % program.steps.length;
        continue;
      }

      // Show where the move starts before it plays.
      if (this.masked) {
        await this.setMask(false, signal);
        continue;
      }

      const since = performance.now();
      if (step.kind !== "back") this.navigated(step.to);
      const r = await this.exec(program, step, signal);
      if (this.stopped) return;
      if (!r.ok) {
        if (!signal.aborted) await this.sleep(RETRY_MS, signal);
        continue;
      }
      if (this.lastNav && r.path && step.kind !== "back")
        this.lastNav.landed = r.path;
      if (r.noop && step.kind === "push") {
        // Nothing was pushed, so its back has nothing to close.
        this.index = this.afterExcursion(program, this.index);
        continue;
      }
      this.index = (this.index + 1) % program.steps.length;
      this.publish(step);
      const animated = r.noop ? false : await this.settle(since, signal);
      this.scheduler.record({
        frame: this.frame.name,
        op: "step",
        from: step.from,
        to: step.to,
        reason: step.kind,
        transition: step.transition,
        animated,
        program: program.key,
        depth: this.frame.depth,
      });
      await this.sleep(step.dwell, signal);
    }
  }
}

/* ------------------------------------------------------------ utilities */

/** The background colour at the middle of a (same-origin) preview page. */
function pageBackground(win: Window): string {
  try {
    const doc = win.document;
    const root = doc.documentElement;
    let el = doc.elementFromPoint(root.clientWidth / 2, root.clientHeight / 2);
    while (el) {
      const bg = win.getComputedStyle(el).backgroundColor;
      const clear =
        !bg ||
        bg === "transparent" ||
        /^rgba\(.*,\s*0\)$/.test(bg) ||
        /\/\s*0\)$/.test(bg);
      if (!clear) return bg;
      el = el.parentElement;
    }
  } catch {
    // Cross-origin or detached: fall back.
  }
  return "#fff";
}

/**
 * Whether a preview iframe may exist now. While `want` is true it asks the
 * scheduler for a load slot (granted when no preview is out, so the frame
 * loads into the page's base history entry) and gives the slot back once the
 * frame is `ready`; from then on it stays true. If `want` turns false before
 * the frame is ready (hidden, scrolled away — a lazy iframe would never
 * load), the slot is returned and the iframe should unmount; it asks again
 * next time.
 */
export function useLoadSlot(want: boolean, ready: boolean): boolean {
  // Previews stay inert inside an iframe (a demo page showing the docs site
  // itself): nested previews would push into the same joint history.
  const topLevel = useSyncExternalStore(
    subscribeNever,
    isTopWindow,
    () => false,
  );
  const wanted = want && topLevel;
  const [granted, setGranted] = useState(false);
  const live = granted && ready;
  const liveRef = useRef(live);
  useLayoutEffect(() => {
    liveRef.current = live;
  }, [live]);

  useEffect(() => {
    if (live || !wanted) return;
    const ticket = getPreviewScheduler().acquireLoad();
    let alive = true;
    void ticket.ready.then(() => {
      if (alive) setGranted(true);
    });
    return () => {
      alive = false;
      ticket.release();
      if (!liveRef.current) setGranted(false);
    };
  }, [wanted, live]);

  return live || (granted && wanted);
}

function subscribeNever() {
  return () => {};
}

function isTopWindow() {
  try {
    return window.self === window.top;
  } catch {
    return false;
  }
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** False while the tab is in the background. */
export function useDocumentVisible(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState !== "hidden",
    () => true,
  );
}

/**
 * Live "is it on screen" for an element: any part of it (within
 * `rootMargin`), or at least `minRatio` of it.
 */
export function useOnScreen<T extends Element>(
  element: T | null,
  rootMargin = "0px",
  minRatio = 0,
): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!element) return;
    const io = new IntersectionObserver(
      ([entry]) =>
        setOn(entry.isIntersecting && entry.intersectionRatio >= minRatio),
      { rootMargin, threshold: minRatio > 0 ? [0, minRatio] : 0 },
    );
    io.observe(element);
    return () => io.disconnect();
  }, [element, rootMargin, minRatio]);
  return on;
}

/**
 * The share of a preview that must be on screen for it to play. A sliver
 * at the viewport edge stays still: nobody watches it, and every preview
 * that plays shares the page's history with the ones people do watch.
 */
export const PLAY_MIN_RATIO = 0.2;
