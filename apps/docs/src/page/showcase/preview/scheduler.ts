import {
  showcaseFrameProtocol,
  type ShowcaseFrameStatus,
  type ShowcaseNavigatedMessage,
  type ShowcasePoppedMessage,
} from "@/lib/hooks/use-showcase-frame-bridge";
import { framePath } from "@/lib/preview-path";

/*
 * One per document: the model of the page's JOINT session history that all
 * preview iframes share.
 *
 * A push inside any iframe appends a step to the tab's history, and
 * `history.back()` inside iframe X undoes whichever frame navigated LAST —
 * a sibling preview, or past the page itself. So pushes and backs go through
 * here:
 *
 * - `stack` is every entry the previews pushed, bottom first, with its frame.
 * - A frame backs only while the top entry is its own; otherwise it waits
 *   (it simply dwells longer). It never backs at depth 0.
 * - Excursions nest. Every push says how long it will stay open (`span`,
 *   the runner's estimate up to its closing back), so each entry has a due
 *   time. Another frame may push on top only if its own excursion ends
 *   before every open entry's due time: it fits inside them, and nobody
 *   below has to wait for it. A push that does not fit waits for the stack
 *   to drain (new excursions never extend the drain time), so no preview
 *   sits on one screen longer than the longest excursion in flight. A held
 *   frame (paused in a dock) is never due.
 * - While any frame waits to back, new pushes queue — except from the frame
 *   that owns the top entry (it is going to unwind anyway, depth ≤ 2), so a
 *   waiting back cannot deadlock behind a queued push. Backs go first.
 * - One push/back is in flight at a time, so the model's order is the
 *   order the browser committed them in.
 * - Replace changes no history length and is sent straight through.
 * - Frames report their depth with every ack, and `popped` when the user
 *   pressed Back/Forward; the model resyncs from that. A user traversal (of
 *   a frame, or of the page itself) also suspends pushes for a while and has
 *   every preview return, so the next Back leaves the page as usual.
 * - A same-tab link click while previews are out waits (≤ 0.7 s) for them
 *   to unwind silently first, so leaving never strands their entries under
 *   the next page.
 * - A frame only exists in history entries that were current when it
 *   loaded (Chromium and WebKit both). One that loads while a sibling is
 *   "out" is missing from the base entry, and its back would silently move
 *   the page instead of itself. So an iframe is created only while the
 *   stack is empty (`acquireLoad`): while one waits, no new excursion
 *   starts (those under way finish, so the stack drains), and while it
 *   loads, no push goes at all.
 *
 * The embedding page's own history is never touched: the scheduler never
 * navigates it, and a frame refuses a back at its own depth 0.
 */

const PUSH_TIMEOUT_MS = 12000;
const REPLACE_TIMEOUT_MS = 12000;
/** The frame gives up after 2.5 s without popstate; allow for delivery. */
const BACK_TIMEOUT_MS = 4000;
const TRAVERSE_YIELD_MS = 5000;
const LEAVE_HOLD_MS = 3000;
const LEAVE_WAIT_MS = 700;
const LOG_LIMIT = 600;
/** A frame that never reports ready stops holding pushes after this. */
const LOAD_HOLD_MS = 20000;
/** Grant a load even with entries on the stack after waiting this long. */
const LOAD_WAIT_MS = 8000;
/** How long a push without an estimate stays open. */
const DEFAULT_SPAN_MS = 3000;
/** A push may end this much after an entry below it is due. */
const FIT_SLACK_MS = 1200;

export type NavOutcome = {
  ok: boolean;
  path: string | null;
  noop?: boolean;
  reason?: string;
};

export type Suspension = {
  reason: "traverse" | "leave";
  /** Whether previews should unwind without animating. */
  silent: boolean;
  until: number;
};

export type SchedulerLogEntry = {
  t: number;
  frame: string;
  op:
    | "push"
    | "back"
    | "replace"
    | "ready"
    | "popped"
    | "resync"
    | "suspend"
    | "step";
  from?: string | null;
  to?: string | null;
  silent?: boolean;
  ok?: boolean;
  reason?: string;
  depth?: number;
  stack?: number;
  transition?: string;
  animated?: boolean;
  program?: string;
};

type Entry = {
  frame: PreviewFrame;
  from: string | null;
  to: string;
  /** When (performance.now) its frame expects to back out of it. */
  due: number;
};

type Request = {
  frame: PreviewFrame;
  kind: "push" | "back";
  path?: string;
  silent: boolean;
  /** Push: how long the entry stays open, in ms (see `fits`). */
  span?: number;
  /** Runs once the request is granted, before it is sent (e.g. a mask fade). */
  prepare?: () => Promise<void>;
  resolve: (outcome: NavOutcome) => void;
};

/** Permission to create a preview iframe; see `acquireLoad`. */
export type LoadTicket = {
  /** Resolves once the iframe may be created. */
  ready: Promise<void>;
  /** Call when the frame is ready (or gone). */
  release(): void;
};

type TicketState = LoadTicket & {
  grant: () => void;
  since: number;
  timer?: number;
};

type Waiter = {
  frame: PreviewFrame;
  resolve: (msg: ShowcaseNavigatedMessage | null) => void;
  timer: number;
};

function spanOf(req: Request) {
  return req.span ?? DEFAULT_SPAN_MS;
}

/** A registered preview iframe, as the scheduler sees it. */
export class PreviewFrame {
  ready = false;
  path: string | null = null;
  status: ShowcaseFrameStatus = "idle";
  /** Last time (performance.now) a playing/reversing status arrived. */
  activeAt = Number.NEGATIVE_INFINITY;
  disposed = false;
  /** The last move the demo made by itself (a redirect), if any. */
  foreign: { at: number; from: string | null; to: string } | null = null;
  /** Debug: what the runner is playing. */
  program: {
    key: string;
    /** [from, to, kind, dwell] per step. */
    pairs: [string, string, string, number][];
  } | null = null;
  /** Holding its screen indefinitely (paused in a dock): never due. */
  held = false;

  constructor(
    readonly id: string,
    readonly name: string,
    readonly win: Window,
    private readonly owner: PreviewScheduler,
  ) {}

  get depth(): number {
    return this.owner.depthOf(this);
  }
}

class PreviewScheduler {
  private frames = new Map<Window, PreviewFrame>();
  private stack: Entry[] = [];
  private backs: Request[] = [];
  private pushes: Request[] = [];
  private inflight: Request | null = null;
  private waiters = new Map<string, Waiter>();
  private listeners = new Set<() => void>();
  private suspensionState: Suspension | null = null;
  private suspensionTimer: number | undefined;
  private seq = 0;
  private installed = false;
  private bypassClick = false;
  private loadWaiting = new Set<TicketState>();
  private loading = new Set<TicketState>();
  private loadTimer: number | undefined;
  readonly log: SchedulerLogEntry[] = [];

  /* ------------------------------------------------------------- frames */

  register(win: Window, name: string): PreviewFrame {
    this.install();
    const existing = this.frames.get(win);
    if (existing && !existing.disposed) return existing;
    const frame = new PreviewFrame(`f${++this.seq}`, name, win, this);
    this.frames.set(win, frame);
    this.post(frame, { type: showcaseFrameProtocol.messages.ping });
    return frame;
  }

  /** The frame is going away: forget its entries and requests. */
  unregister(frame: PreviewFrame) {
    if (frame.disposed) return;
    frame.disposed = true;
    if (this.frames.get(frame.win) === frame) this.frames.delete(frame.win);
    this.stack = this.stack.filter((e) => e.frame !== frame);
    for (const queue of [this.backs, this.pushes])
      for (const r of queue.filter((r) => r.frame === frame)) {
        queue.splice(queue.indexOf(r), 1);
        r.resolve({ ok: false, path: frame.path, reason: "disposed" });
      }
    for (const [id, w] of this.waiters)
      if (w.frame === frame) {
        window.clearTimeout(w.timer);
        this.waiters.delete(id);
        w.resolve(null);
      }
    this.pump();
    this.notify();
  }

  depthOf(frame: PreviewFrame): number {
    let n = 0;
    for (const e of this.stack) if (e.frame === frame) n++;
    return n;
  }

  /**
   * Ask to create a preview iframe. Granted once no preview entry is on the
   * stack, so the frame loads into the page's base history entry; until the
   * ticket is released (frame ready), pushes wait.
   */
  acquireLoad(): LoadTicket {
    this.install();
    let grant!: () => void;
    const ready = new Promise<void>((r) => (grant = r));
    const ticket: TicketState = {
      ready,
      grant,
      since: performance.now(),
      release: () => {
        window.clearTimeout(ticket.timer);
        const held =
          this.loadWaiting.delete(ticket) || this.loading.delete(ticket);
        if (held) this.pump();
      },
    };
    this.loadWaiting.add(ticket);
    this.pump();
    return ticket;
  }

  private pumpLoads() {
    if (!this.loadWaiting.size) return;
    const now = performance.now();
    const base = !this.stack.length && !this.inflight;
    for (const t of [...this.loadWaiting]) {
      if (!base && now - t.since < LOAD_WAIT_MS) continue;
      this.loadWaiting.delete(t);
      this.loading.add(t);
      t.timer = window.setTimeout(t.release, LOAD_HOLD_MS);
      t.grant();
    }
    // Re-check a waiting ticket when its patience runs out.
    window.clearTimeout(this.loadTimer);
    if (this.loadWaiting.size)
      this.loadTimer = window.setTimeout(() => this.pump(), 1000);
  }

  /* --------------------------------------------------------- operations */

  /**
   * `span`: how long the pushed entry will stay open (until this frame's
   * back that closes it starts), in ms. Other frames nest their excursions
   * inside it.
   */
  push(
    frame: PreviewFrame,
    path: string,
    opts: { silent?: boolean; signal?: AbortSignal; span?: number } = {},
  ): Promise<NavOutcome> {
    return this.enqueue(frame, "push", framePath(path), opts);
  }

  /** The frame holds its screen indefinitely (or stops holding). */
  setHeld(frame: PreviewFrame, held: boolean) {
    if (frame.held === held) return;
    frame.held = held;
    this.pump();
  }

  /** `prepare` runs once the back is granted, just before it is sent. */
  back(
    frame: PreviewFrame,
    opts: {
      silent?: boolean;
      signal?: AbortSignal;
      prepare?: () => Promise<void>;
    } = {},
  ): Promise<NavOutcome> {
    if (this.depthOf(frame) === 0)
      return Promise.resolve({ ok: false, path: frame.path, reason: "depth" });
    return this.enqueue(frame, "back", undefined, opts);
  }

  async replace(
    frame: PreviewFrame,
    path: string,
    opts: { silent?: boolean } = {},
  ): Promise<NavOutcome> {
    const to = framePath(path);
    const from = frame.path;
    const msg = await this.request(
      frame,
      {
        type: showcaseFrameProtocol.messages.navigate,
        path: to,
        mode: "replace",
        silent: Boolean(opts.silent),
      },
      REPLACE_TIMEOUT_MS,
    );
    const outcome = this.outcome(frame, msg);
    if (outcome.ok) {
      // A replace at depth > 0 rewrites this frame's top entry.
      const own = this.topEntryOf(frame);
      if (own) own.to = frame.path ?? to;
    }
    this.record({
      frame: frame.name,
      op: "replace",
      from,
      to: frame.path,
      silent: Boolean(opts.silent),
      ok: outcome.ok,
      reason: outcome.reason,
      depth: frame.depth,
      stack: this.stack.length,
    });
    return outcome;
  }

  private enqueue(
    frame: PreviewFrame,
    kind: "push" | "back",
    path: string | undefined,
    opts: {
      silent?: boolean;
      signal?: AbortSignal;
      span?: number;
      prepare?: () => Promise<void>;
    },
  ): Promise<NavOutcome> {
    return new Promise((resolve) => {
      if (frame.disposed)
        return resolve({ ok: false, path: frame.path, reason: "disposed" });
      const req: Request = {
        frame,
        kind,
        path,
        silent: Boolean(opts.silent),
        span: opts.span,
        prepare: opts.prepare,
        resolve,
      };
      const queue = kind === "back" ? this.backs : this.pushes;
      const signal = opts.signal;
      if (signal) {
        if (signal.aborted)
          return resolve({ ok: false, path: frame.path, reason: "aborted" });
        signal.addEventListener(
          "abort",
          () => {
            const i = queue.indexOf(req);
            if (i < 0) return; // already in flight: its ack still counts
            queue.splice(i, 1);
            resolve({ ok: false, path: frame.path, reason: "aborted" });
            this.pump();
          },
          { once: true },
        );
      }
      queue.push(req);
      this.pump();
    });
  }

  /** Grant the next push/back, if any may go now. */
  private pump() {
    if (this.inflight) return;
    this.pumpLoads();
    // A back from a frame with nothing on the stack can never be granted.
    for (const r of [...this.backs])
      if (this.depthOf(r.frame) === 0) {
        this.backs.splice(this.backs.indexOf(r), 1);
        r.resolve({ ok: false, path: r.frame.path, reason: "depth" });
      }
    const top = this.stack[this.stack.length - 1];
    let next = top ? this.backs.find((r) => r.frame === top.frame) : undefined;
    if (!next && !this.suspensionState && !this.loading.size) {
      // A frame waiting to load needs an empty stack: no new excursions,
      // while the ones under way finish.
      const draining = this.loadWaiting.size > 0;
      if (this.backs.length)
        next = top && this.pushes.find((r) => r.frame === top.frame);
      else
        for (const r of this.pushes) {
          if (draining && this.depthOf(r.frame) === 0) continue;
          if (!this.fits(r)) continue;
          // The longest excursion first: the shorter ones then fit inside it.
          if (!next || spanOf(r) > spanOf(next)) next = r;
        }
    }
    if (!next) return;
    const queue = next.kind === "back" ? this.backs : this.pushes;
    queue.splice(queue.indexOf(next), 1);
    this.inflight = next;
    void this.run(next);
  }

  private async run(req: Request) {
    const { frame } = req;
    if (req.prepare) await req.prepare().catch(() => {});
    const from = frame.path;
    const depthBefore = this.depthOf(frame);
    const msg = await this.request(
      frame,
      req.kind === "push"
        ? {
            type: showcaseFrameProtocol.messages.navigate,
            path: req.path,
            mode: "push",
            silent: req.silent,
          }
        : { type: showcaseFrameProtocol.messages.back, silent: req.silent },
      req.kind === "push" ? PUSH_TIMEOUT_MS : BACK_TIMEOUT_MS,
      // Account for the move before the frame's reported depth is applied.
      (m) => {
        if (!m.ok || m.noop) return;
        if (req.kind === "push")
          this.stack.push({
            frame,
            from,
            to: framePath(m.path),
            due: performance.now() + spanOf(req),
          });
        else this.removeTopEntries(frame, 1);
      },
    );
    const outcome = this.outcome(frame, msg);
    this.record({
      frame: frame.name,
      op: req.kind,
      from,
      to: frame.path,
      silent: req.silent,
      ok: outcome.ok,
      reason: outcome.reason,
      depth: this.depthOf(frame),
      stack: this.stack.length,
    });
    if (req.kind === "back" && !outcome.ok && outcome.reason === "no-popstate")
      // The traversal moved the page one step without reverting this frame
      // (it is missing from the entry below). The frame reset its depth to
      // 0 and the model dropped its entry: never retry, or the next back
      // would walk the embedding page itself back.
      this.record({
        frame: frame.name,
        op: "resync",
        reason: `back did not revert this frame (depth ${depthBefore} → ${this.depthOf(frame)})`,
        depth: this.depthOf(frame),
        stack: this.stack.length,
      });
    if (this.inflight === req) this.inflight = null;
    req.resolve(outcome);
    this.pump();
    this.notify();
  }

  private outcome(
    frame: PreviewFrame,
    msg: ShowcaseNavigatedMessage | null,
  ): NavOutcome {
    if (!msg) return { ok: false, path: frame.path, reason: "timeout" };
    return {
      ok: msg.ok,
      path: msg.path,
      noop: msg.noop,
      reason: msg.reason,
    };
  }

  private request(
    frame: PreviewFrame,
    message: Record<string, unknown>,
    timeoutMs: number,
    onAck?: (msg: ShowcaseNavigatedMessage) => void,
  ): Promise<ShowcaseNavigatedMessage | null> {
    return new Promise((resolve) => {
      if (frame.disposed) return resolve(null);
      const id = `${frame.id}:${++this.seq}`;
      const timer = window.setTimeout(() => {
        this.waiters.delete(id);
        resolve(null);
      }, timeoutMs);
      this.waiters.set(id, {
        frame,
        timer,
        resolve: (msg) => {
          if (msg) onAck?.(msg);
          resolve(msg);
        },
      });
      this.post(frame, { ...message, id });
    });
  }

  private post(frame: PreviewFrame, message: object) {
    try {
      frame.win.postMessage(message, "*");
    } catch {
      // Detached window: its waiters time out.
    }
  }

  /* ----------------------------------------------------------- the model */

  /**
   * Whether `req` (a push) may go on top of the stack now: the stack is
   * empty, or the frame owns the top entry (its excursion is under way),
   * or its excursion ends before every other frame's open entry is due.
   */
  private fits(req: Request): boolean {
    const top = this.stack[this.stack.length - 1];
    if (!top || top.frame === req.frame) return true;
    const end = performance.now() + spanOf(req);
    return this.stack.every(
      (e) =>
        e.frame === req.frame || e.frame.held || e.due + FIT_SLACK_MS >= end,
    );
  }

  private topEntryOf(frame: PreviewFrame): Entry | undefined {
    for (let i = this.stack.length - 1; i >= 0; i--)
      if (this.stack[i].frame === frame) return this.stack[i];
    return undefined;
  }

  private removeTopEntries(frame: PreviewFrame, count: number) {
    for (let i = this.stack.length - 1; i >= 0 && count > 0; i--)
      if (this.stack[i].frame === frame) {
        this.stack.splice(i, 1);
        count--;
      }
  }

  /** Make the model agree with the depth the frame reports. */
  private reconcile(frame: PreviewFrame, depth: number, path: string) {
    const model = this.depthOf(frame);
    const before = frame.path;
    frame.path = framePath(path);
    if (depth === model) return;
    if (depth < model) this.removeTopEntries(frame, model - depth);
    else
      for (let i = model; i < depth; i++)
        this.stack.push({
          frame,
          from: before,
          to: frame.path,
          due: performance.now() + DEFAULT_SPAN_MS,
        });
    this.record({
      frame: frame.name,
      op: "resync",
      from: before,
      to: frame.path,
      reason: `model ${model} → reported ${depth}`,
      depth,
      stack: this.stack.length,
    });
  }

  /* ------------------------------------------------------------ messages */

  private onMessage = (e: MessageEvent) => {
    if (!e.source) return;
    const frame = this.frames.get(e.source as Window);
    if (!frame || frame.disposed) return;
    const data = e.data as Record<string, unknown> | null;
    if (!data || typeof data !== "object") return;
    const { messages } = showcaseFrameProtocol;

    switch (data.type) {
      case messages.status: {
        const status = data.status as ShowcaseFrameStatus;
        if (status === "playing" || status === "reversing")
          frame.activeAt = performance.now();
        if (status !== frame.status) {
          frame.status = status;
          this.notify();
        }
        return;
      }
      case messages.ready: {
        const depth = typeof data.depth === "number" ? data.depth : 0;
        const path = typeof data.path === "string" ? data.path : "/";
        const first = !frame.ready;
        frame.ready = true;
        this.reconcile(frame, depth, path);
        if (first)
          this.record({
            frame: frame.name,
            op: "ready",
            to: frame.path,
            depth,
            stack: this.stack.length,
          });
        this.pump();
        this.notify();
        return;
      }
      case messages.navigated: {
        const msg = data as ShowcaseNavigatedMessage;
        const waiter = msg.id ? this.waiters.get(msg.id) : undefined;
        if (waiter) {
          window.clearTimeout(waiter.timer);
          this.waiters.delete(msg.id!);
          waiter.resolve(msg);
        }
        // Late or not: the reported depth is the truth.
        this.reconcile(frame, msg.depth, msg.path);
        this.pump();
        this.notify();
        return;
      }
      case messages.popped: {
        const msg = data as ShowcasePoppedMessage;
        this.record({
          frame: frame.name,
          op: "popped",
          from: frame.path,
          to: framePath(msg.path),
          reason: msg.cause,
          depth: msg.depth,
        });
        if (msg.cause !== "traverse")
          frame.foreign = {
            at: performance.now(),
            from: frame.path,
            to: framePath(msg.path),
          };
        this.reconcile(frame, msg.depth, msg.path);
        if (msg.cause === "traverse")
          this.suspend("traverse", false, TRAVERSE_YIELD_MS);
        this.pump();
        this.notify();
        return;
      }
    }
  };

  /* ---------------------------------------------------------- suspension */

  get suspension(): Suspension | null {
    return this.suspensionState;
  }

  /**
   * Hold every preview at depth 0 for `ms`: pushes wait, runners unwind
   * (silently or visibly) and pause until it ends.
   */
  suspend(reason: Suspension["reason"], silent: boolean, ms: number) {
    const until = performance.now() + ms;
    const current = this.suspensionState;
    this.suspensionState = {
      reason,
      silent: current ? current.silent && silent : silent,
      until: Math.max(until, current?.until ?? 0),
    };
    window.clearTimeout(this.suspensionTimer);
    this.suspensionTimer = window.setTimeout(() => {
      this.suspensionState = null;
      this.pump();
      this.notify();
    }, this.suspensionState.until - performance.now());
    this.record({
      frame: "*",
      op: "suspend",
      reason,
      silent,
      stack: this.stack.length,
    });
    this.notify();
  }

  /** Unwind every preview (silently) before the page navigates away. */
  async releaseAll(timeoutMs = LEAVE_WAIT_MS): Promise<void> {
    if (!this.stack.length && !this.inflight) return;
    this.suspend("leave", true, LEAVE_HOLD_MS);
    const deadline = performance.now() + timeoutMs;
    // Runners unwind on the suspension; this covers frames without one.
    const unwind = async () => {
      while (this.stack.length && performance.now() < deadline) {
        const top = this.stack[this.stack.length - 1];
        const r = await this.back(top.frame, { silent: true });
        if (!r.ok && r.reason !== "depth") break;
      }
    };
    await Promise.race([
      unwind(),
      new Promise((r) => window.setTimeout(r, timeoutMs)),
    ]);
  }

  /* ------------------------------------------------------ subscriptions */

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    for (const fn of [...this.listeners]) fn();
  }

  record(entry: Omit<SchedulerLogEntry, "t">) {
    this.log.push({ t: Math.round(performance.now()), ...entry });
    if (this.log.length > LOG_LIMIT)
      this.log.splice(0, this.log.length - LOG_LIMIT);
  }

  /* --------------------------------------------------------- page hooks */

  private install() {
    if (this.installed) return;
    this.installed = true;
    window.addEventListener("message", this.onMessage);
    window.addEventListener("click", this.onClick, true);
    // The page itself was traversed (Back/Forward into or within it): the
    // user is walking history, so keep previews home for a moment and let
    // the next Back leave instead of closing a preview.
    window.addEventListener("popstate", () =>
      this.suspend("traverse", false, TRAVERSE_YIELD_MS),
    );
    if (process.env.NODE_ENV !== "production") this.exposeDebug();
  }

  /**
   * Same-tab link clicks wait for the previews to return first. The click
   * is swallowed and replayed on the same anchor, so Next's Link (or the
   * browser) navigates exactly as it would have.
   */
  private onClick = (e: MouseEvent) => {
    if (this.bypassClick || e.defaultPrevented) return;
    if (!this.stack.length && !this.inflight) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    const target = e.target as Element | null;
    const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!anchor || anchor.hasAttribute("download")) return;
    if (anchor.target && anchor.target !== "_self") return;
    let url: URL;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    const here = window.location;
    if (
      url.origin === here.origin &&
      url.pathname === here.pathname &&
      url.search === here.search &&
      url.hash
    )
      return; // in-page anchor
    e.preventDefault();
    e.stopPropagation();
    void this.releaseAll().then(() => {
      this.bypassClick = true;
      try {
        if (anchor.isConnected) anchor.click();
        else window.location.assign(url.href);
      } finally {
        this.bypassClick = false;
      }
    });
  };

  private exposeDebug() {
    const w = window as Window & { __ssgoiPreviews?: unknown };
    w.__ssgoiPreviews = {
      log: this.log,
      stack: () =>
        this.stack.map((e) => ({
          frame: e.frame.name,
          from: e.from,
          to: e.to,
          dueIn: Math.round(e.due - performance.now()),
        })),
      frames: () =>
        [...this.frames.values()].map((f) => ({
          name: f.name,
          ready: f.ready,
          path: f.path,
          depth: f.depth,
          status: f.status,
          held: f.held,
          program: f.program,
        })),
      suspension: () => this.suspensionState,
      queued: () => ({
        backs: this.backs.map((r) => r.frame.name),
        pushes: this.pushes.map((r) => r.frame.name),
        inflight: this.inflight
          ? `${this.inflight.kind} ${this.inflight.frame.name}`
          : null,
        loads: { waiting: this.loadWaiting.size, loading: this.loading.size },
      }),
    };
  }
}

let scheduler: PreviewScheduler | null = null;

/** The document's preview history scheduler (created on first use). */
export function getPreviewScheduler(): PreviewScheduler {
  scheduler ??= new PreviewScheduler();
  return scheduler;
}

/**
 * Before a navigation that is not a link click (e.g. `router.push` from the
 * search palette): bring every preview home first, so their history entries
 * are not left under the next page (≤ 0.7 s). Link clicks do this by
 * themselves.
 */
export function releasePreviews(): Promise<void> {
  return scheduler ? scheduler.releaseAll() : Promise.resolve();
}

export type { PreviewScheduler };
