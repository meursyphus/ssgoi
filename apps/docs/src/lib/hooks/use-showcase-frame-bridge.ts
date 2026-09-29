"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { HostAnimation } from "@ssgoi/core/internal";
import { framePath } from "@/lib/preview-path";

export type ShowcaseFrameStatus =
  | "idle"
  | "playing"
  | "reversing"
  | "paused"
  | "settled";

/**
 * postMessage protocol between a preview iframe (this app, embedded) and the
 * page that embeds it.
 *
 * Parent → frame
 * - `navigate {path, mode?: "push" | "replace", silent?, id?}` — router
 *   push (default) or replace. `silent` completes the SSGOI host animation
 *   the moment it starts, so a reposition is invisible.
 * - `back {id?, silent?}` — a real `history.back()`: SSGOI replays the push
 *   in reverse. Refused (ok: false) when this frame has no entry of its own
 *   to return to, so it can never walk the embedding page back.
 * - `ping` — answered with `ready`.
 * - `host {command, payload}` — play / pause / reverse / complete / rate.
 *
 * Frame → parent
 * - `ready {path, depth}` on mount and on `ping`, once the page can animate
 *   a navigation: the document finished loading and an SSGOI boundary is
 *   mounted (a demo page that streams in has neither at mount, and a push
 *   sent then would jump without a transition).
 * - `status {status}` on every host notification.
 * - `navigated {id, path, depth, ok, noop?, reason?}` once a navigate/back
 *   committed (the new pathname rendered), or failed.
 * - `popped {path, depth, cause}` for history changes the parent did not ask
 *   for: the user pressed Back/Forward (`traverse`) or the demo pushed on its
 *   own (`push`).
 *
 * `depth` counts the entries this frame pushed on top of its first one (a
 * marker stamped into each entry's history state), so the parent can keep
 * its model of the page's joint session history in sync.
 */
export const showcaseFrameProtocol = {
  messages: {
    navigate: "ssgoi-showcase:navigate",
    back: "ssgoi-showcase:back",
    ping: "ssgoi-showcase:ping",
    host: "ssgoi-showcase:host",
    status: "ssgoi-showcase:status",
    ready: "ssgoi-showcase:ready",
    navigated: "ssgoi-showcase:navigated",
    popped: "ssgoi-showcase:popped",
  },
  hostCommands: {
    play: (host: HostAnimation) => host.play(),
    pause: (host: HostAnimation) => host.pause(),
    reverse: (host: HostAnimation) => host.reverse(),
    complete: (host: HostAnimation) => host.complete(),
    rate: (host: HostAnimation, payload: unknown) => {
      if (typeof payload === "number") host.playbackRate = payload;
    },
  },
  getStatus(host: HostAnimation): ShowcaseFrameStatus {
    if (host.isAnimating) return host.isReversing ? "reversing" : "playing";
    if (host.isPaused) return "paused";
    if (host.isComplete) return "settled";
    return "idle";
  },
} as const;

export type ShowcaseNavigateMode = "push" | "replace";

export type ShowcaseNavigatedMessage = {
  type: typeof showcaseFrameProtocol.messages.navigated;
  id?: string;
  path: string;
  depth: number;
  ok: boolean;
  /** Already there: nothing was navigated. */
  noop?: boolean;
  reason?: string;
};

export type ShowcasePoppedMessage = {
  type: typeof showcaseFrameProtocol.messages.popped;
  path: string;
  depth: number;
  /**
   * `traverse`: Back/Forward. `push` / `replace`: the demo navigated by
   * itself (a redirect, a client-side replace).
   */
  cause: "traverse" | "push" | "replace";
};

type HostCommand = keyof typeof showcaseFrameProtocol.hostCommands;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isHostCommand(command: unknown): command is HostCommand {
  return (
    typeof command === "string" && command in showcaseFrameProtocol.hostCommands
  );
}

function postToParent(message: object) {
  if (window.parent === window) return;
  window.parent.postMessage(message, "*");
}

function currentPath() {
  return framePath(window.location.pathname + window.location.search);
}

/** A back that produced no popstate by then consumed someone else's entry. */
const BACK_TIMEOUT_MS = 2500;
/** A silent navigation also swallows an animation that starts this late. */
const SILENT_GRACE_MS = 1500;
const NAVIGATE_TIMEOUT_MS = 12000;
/** A loaded page without any SSGOI boundary is ready after this anyway. */
const READY_NO_BOUNDARY_MS = 1500;
/** `ready` is never held back longer than this after mount. */
const READY_MAX_WAIT_MS = 10000;

/** Whether a navigation now would animate: loaded, with a boundary mounted. */
function pageSettled(mountedAt: number, loaded: { at: number | null }) {
  const now = performance.now();
  if (now - mountedAt > READY_MAX_WAIT_MS) return true;
  if (document.readyState !== "complete") return false;
  loaded.at ??= now;
  return (
    document.querySelector("[data-ssgoi-transition]") !== null ||
    now - loaded.at > READY_NO_BOUNDARY_MS
  );
}

const DEPTH_KEY = "__ssgoi_showcase_v1";

type DepthTracker = {
  /** Entries this document pushed on top of its first one. */
  read(): number;
  /**
   * Re-commit the current entry, optionally with a new depth. Chromium
   * records a frame in the joint history entry that is current when the
   * frame commits; re-committing before a push makes sure the entry the
   * push starts from knows this frame, so the back can return to it.
   */
  restamp(depth?: number): void;
  /** Called after every pushState / URL-changing replaceState. */
  onChange: ((kind: "push" | "replace") => void) | null;
  /** Set while this bridge's own back is in flight. */
  expectBack: boolean;
};

let depthTracker: DepthTracker | null = null;

/**
 * Tracks this document's history depth and the state of each of its
 * entries, by wrapping pushState / replaceState (as SSGOI's own tracker
 * does). Every entry also carries a `{doc, depth}` stamp.
 *
 * The depth and states are kept in memory, not only in `history.state`:
 * WebKit drops a subframe entry's state object whenever a SIBLING frame
 * pushes (the joint entry keeps a copy of this frame without its state), so
 * `history.state` reads null and a back into such an entry pops with a
 * stale or empty state — the router would ignore it or reload, and SSGOI
 * could not tell it is a back. Such a popstate is replayed with the state
 * the entry really had.
 *
 * One per document and never unwrapped, so a remounted bridge (Strict Mode,
 * Fast Refresh) keeps the same record.
 */
function trackDepth(): DepthTracker {
  if (depthTracker) return depthTracker;
  const history = window.history;
  const push = history.pushState;
  const replace = history.replaceState;
  const doc = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

  const readStamp = (state: unknown): number | null => {
    const stamp = isRecord(state) ? state[DEPTH_KEY] : null;
    if (!isRecord(stamp) || stamp.doc !== doc) return null;
    return typeof stamp.depth === "number" ? stamp.depth : null;
  };
  const stamp = (data: unknown, depth: number) => {
    if (data !== null && data !== undefined && !isRecord(data)) return data;
    return { ...(data ?? {}), [DEPTH_KEY]: { doc, depth } };
  };

  let depth = readStamp(history.state) ?? 0;
  /** What each of this document's entries holds, by depth. */
  const entries = new Map<number, { url: string; state: unknown }>();
  const keep = (state: unknown) =>
    entries.set(depth, { url: window.location.href, state });

  const tracker: DepthTracker = {
    read: () => depth,
    restamp: (next) => {
      try {
        const state = stamp(
          entries.get(depth)?.state ?? history.state,
          next ?? depth,
        );
        replace.call(history, state, "");
        if (next !== undefined) depth = next;
        keep(state);
      } catch {
        // History writes denied: nothing to fix.
      }
    },
    onChange: null,
    expectBack: false,
  };
  try {
    const state = stamp(history.state, depth);
    replace.call(history, state, "");
    keep(state);
  } catch {
    // A sandbox may deny history writes; depth then stays 0 (no backs).
    return tracker;
  }

  history.pushState = function (this: History, data, unused, url) {
    const state = stamp(data, depth + 1);
    push.call(this, state, unused, url);
    depth += 1;
    keep(state);
    tracker.onChange?.("push");
  };
  history.replaceState = function (this: History, data, unused, url) {
    const before = window.location.href;
    const state = stamp(data, depth);
    replace.call(this, state, unused, url);
    keep(state);
    if (window.location.href !== before) tracker.onChange?.("replace");
  };

  let replaying = false;
  const keysOf = (value: unknown) =>
    isRecord(value) ? Object.keys(value) : ([] as string[]);
  window.addEventListener(
    "popstate",
    (e) => {
      if (replaying) return;
      const href = window.location.href;
      // Which of our entries is this? The stamp says (Chromium); otherwise
      // our own back lands one below, and a user's Back/Forward is matched
      // by URL next to where we were.
      let next = readStamp(e.state);
      if (next === null) {
        const at = (d: number) => entries.get(d)?.url === href;
        if (tracker.expectBack && depth > 0) next = depth - 1;
        else if (at(depth - 1)) next = depth - 1;
        else if (at(depth + 1)) next = depth + 1;
        else next = depth;
      }
      depth = Math.max(0, next);
      const saved = entries.get(depth);
      if (!saved || saved.url !== href) return;
      const have = new Set(keysOf(e.state));
      if (!keysOf(saved.state).some((k) => !have.has(k))) return;
      // The browser lost this entry's state: put it back and replay.
      e.stopImmediatePropagation();
      try {
        replace.call(history, saved.state, "");
      } catch {
        return;
      }
      replaying = true;
      try {
        window.dispatchEvent(
          new PopStateEvent("popstate", { state: saved.state }),
        );
      } finally {
        replaying = false;
      }
    },
    // Capture listeners on the target run before the router's own.
    true,
  );

  depthTracker = tracker;
  return tracker;
}

type Pending =
  | {
      kind: "push" | "replace";
      id?: string;
      target: string;
      from: string;
      /** Where a redirect left the frame, and since when. */
      landed?: string;
      landedAt?: number;
      startedAt: number;
    }
  | { kind: "back"; id?: string; popped: boolean; startedAt: number };

export function useShowcaseFrameBridge(host: HostAnimation) {
  const router = useRouter();
  const pathname = usePathname();
  // Latest committed pathname, and a hook for the session to re-check on commit.
  const committed = useRef<string | null>(null);
  const onCommit = useRef<(() => void) | null>(null);

  useEffect(() => {
    committed.current = pathname;
    onCommit.current?.();
  }, [pathname]);

  useEffect(() => {
    const embedded = window.parent !== window;
    let pending: Pending | null = null;
    let silentUntil = 0;
    let silentPending = false;
    let reportTraverse = false;
    let reportMove: "push" | "replace" | null = null;
    let poll: number | undefined;
    let backTimer: number | undefined;
    let readyPoll: number | undefined;
    const mountedAt = performance.now();
    const loaded = { at: null as number | null };

    const tracker = embedded ? trackDepth() : null;
    if (tracker)
      tracker.onChange = (kind) => {
        // Ours: the pending navigation. Anything else the demo did itself.
        if (pending && pending.kind !== "back" && pending.kind === kind) return;
        if (pending?.kind === "back") return;
        reportMove = kind === "push" || reportMove === "push" ? "push" : kind;
      };
    const depth = () => tracker?.read() ?? 0;
    const hasCommitted = () => {
      const now = committed.current;
      if (now === null) return true;
      const raw = window.location.pathname;
      if (now === raw) return true;
      try {
        return now === decodeURI(raw);
      } catch {
        return false;
      }
    };

    function reply(
      p: Pending,
      ok: boolean,
      extra: { noop?: boolean; reason?: string } = {},
    ) {
      if (!ok) silentPending = false;
      postToParent({
        type: showcaseFrameProtocol.messages.navigated,
        id: p.id,
        path: currentPath(),
        depth: depth(),
        ok,
        ...extra,
      });
    }

    function settle() {
      if (pending) {
        const p = pending;
        const here = currentPath();
        let done =
          p.kind === "back"
            ? p.popped && hasCommitted()
            : here === p.target && hasCommitted();
        if (!done && p.kind !== "back" && here !== p.from && hasCommitted()) {
          // Redirected somewhere else: accept it once it holds still.
          if (p.landed !== here) {
            p.landed = here;
            p.landedAt = performance.now();
          } else if (performance.now() - (p.landedAt ?? 0) > 600) done = true;
        }
        if (done) {
          pending = null;
          window.clearTimeout(backTimer);
          // Keep swallowing an animation that starts a little after commit.
          if (silentPending) silentUntil = performance.now() + SILENT_GRACE_MS;
          reply(p, true);
        } else if (
          p.kind !== "back" &&
          performance.now() - p.startedAt > NAVIGATE_TIMEOUT_MS
        ) {
          pending = null;
          reply(p, false, { reason: "timeout" });
        }
      }
      if (!pending && (reportTraverse || reportMove) && hasCommitted()) {
        const cause = reportTraverse ? "traverse" : reportMove!;
        reportTraverse = false;
        reportMove = null;
        postToParent({
          type: showcaseFrameProtocol.messages.popped,
          path: currentPath(),
          depth: depth(),
          cause,
        });
      }
      const waiting = pending || reportTraverse || reportMove;
      if (waiting && poll === undefined) {
        // Timers, not rAF: a hidden (display: none) frame gets no frames.
        poll = window.setInterval(settle, 30);
      } else if (!waiting && poll !== undefined) {
        window.clearInterval(poll);
        poll = undefined;
      }
    }
    onCommit.current = settle;

    function armSilent() {
      silentPending = true;
      silentUntil = Number.POSITIVE_INFINITY;
      // Whatever is still running would otherwise play on after the jump.
      if (host.isAnimating) host.complete();
    }

    function onHostChange() {
      if (!silentPending) return;
      if (performance.now() > silentUntil) {
        silentPending = false;
        return;
      }
      if (host.isAnimating) {
        silentPending = false;
        host.complete();
      }
    }

    function onNavigate(data: Record<string, unknown>) {
      const path = data.path as string;
      const id = typeof data.id === "string" ? data.id : undefined;
      const mode: ShowcaseNavigateMode =
        data.mode === "replace" ? "replace" : "push";
      const target = framePath(path);
      if (pending) {
        postToParent({
          type: showcaseFrameProtocol.messages.navigated,
          id,
          path: currentPath(),
          depth: depth(),
          ok: false,
          reason: "busy",
        });
        return;
      }
      const p: Pending = {
        kind: mode,
        id,
        target,
        from: currentPath(),
        startedAt: performance.now(),
      };
      if (target === currentPath()) {
        // A push to the current URL would be turned into a replace by the
        // router; either way nothing moves.
        reply(p, true, { noop: true });
        return;
      }
      if (data.silent === true) armSilent();
      else silentPending = false;
      pending = p;
      if (mode === "replace") router.replace(path, { scroll: false });
      else {
        tracker?.restamp();
        router.push(path, { scroll: false });
      }
      settle();
    }

    function onBack(data: Record<string, unknown>) {
      const id = typeof data.id === "string" ? data.id : undefined;
      const p: Pending = {
        kind: "back",
        id,
        popped: false,
        startedAt: performance.now(),
      };
      if (pending) return reply(p, false, { reason: "busy" });
      // Depth 0: the entry behind this one is not ours (the embedding page or
      // a sibling frame), so a back here would move that instead.
      if (!tracker || depth() <= 0) return reply(p, false, { reason: "depth" });
      if (data.silent === true) armSilent();
      else silentPending = false;
      pending = p;
      tracker.expectBack = true;
      backTimer = window.setTimeout(() => {
        tracker.expectBack = false;
        if (pending !== p || p.popped) return;
        pending = null;
        silentPending = false;
        // The traversal moved an entry this frame is not part of (the page's
        // history lost track of it). This frame's own previous entry is no
        // longer the one behind it: forget the depth, so it can never back
        // into the embedding page.
        tracker?.restamp(0);
        reply(p, false, { reason: "no-popstate" });
        settle();
      }, BACK_TIMEOUT_MS);
      window.history.back();
    }

    function onPopState() {
      if (tracker) tracker.expectBack = false;
      if (pending?.kind === "back" && !pending.popped) pending.popped = true;
      else reportTraverse = true;
      settle();
    }

    function onMessage(e: MessageEvent) {
      if (embedded && e.source !== window.parent) return;
      const data = e.data;
      if (!isRecord(data)) return;
      const { messages } = showcaseFrameProtocol;

      if (data.type === messages.navigate && typeof data.path === "string") {
        if (!embedded) {
          router.push(data.path, { scroll: false });
          return;
        }
        onNavigate(data);
        return;
      }
      if (data.type === messages.back) {
        if (embedded) onBack(data);
        return;
      }
      if (data.type === messages.ping) {
        announceReady();
        return;
      }
      if (data.type === messages.host && isHostCommand(data.command)) {
        showcaseFrameProtocol.hostCommands[data.command](host, data.payload);
      }
    }

    function broadcast() {
      postToParent({
        type: showcaseFrameProtocol.messages.status,
        status: showcaseFrameProtocol.getStatus(host),
      });
    }

    function announceReady() {
      if (!embedded || readyPoll !== undefined) return;
      const send = () => {
        if (!pageSettled(mountedAt, loaded)) return false;
        window.clearInterval(readyPoll);
        readyPoll = undefined;
        postToParent({
          type: showcaseFrameProtocol.messages.ready,
          path: currentPath(),
          depth: depth(),
        });
        return true;
      };
      // Timers, not rAF: a hidden (display: none) frame gets no frames.
      if (!send()) readyPoll = window.setInterval(send, 50);
    }

    window.addEventListener("message", onMessage);
    window.addEventListener("popstate", onPopState);
    const unsubscribeBroadcast = host.subscribe(broadcast);
    const unsubscribeSilent = host.subscribe(onHostChange);
    announceReady();

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("popstate", onPopState);
      unsubscribeBroadcast();
      unsubscribeSilent();
      window.clearInterval(poll);
      window.clearInterval(readyPoll);
      window.clearTimeout(backTimer);
      onCommit.current = null;
      if (tracker) tracker.onChange = null;
    };
  }, [router, host]);
}
