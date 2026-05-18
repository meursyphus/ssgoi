"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { HostAnimation } from "@ssgoi/core/internal";
import { showcaseFrameProtocol, type ShowcaseFrameStatus } from "@/lib/hooks";

export type DockController = {
  status: ShowcaseFrameStatus;
  rate: number;
  play: () => void;
  pause: () => void;
  setRate: (r: number) => void;
};

/**
 * Reactively mirrors a HostAnimation and exposes direct-call handlers.
 * Re-renders on every host notification (lifecycle + per-frame onUpdate).
 */
export function useHostController(host: HostAnimation): DockController {
  const [, force] = useState(0);
  useEffect(() => host.subscribe(() => force((n) => n + 1)), [host]);

  return {
    status: showcaseFrameProtocol.getStatus(host),
    rate: host.playbackRate,
    play: () => host.play(),
    pause: () => host.pause(),
    setRate: (r) => showcaseFrameProtocol.hostCommands.rate(host, r),
  };
}

function subscribeToFrameEnvironment(onStoreChange: () => void) {
  queueMicrotask(onStoreChange);
  return () => {};
}

function getIsInIframeSnapshot() {
  return window.parent !== window;
}

function getIsInIframeServerSnapshot() {
  return true;
}

function useIsInIframe() {
  return useSyncExternalStore(
    subscribeToFrameEnvironment,
    getIsInIframeSnapshot,
    getIsInIframeServerSnapshot,
  );
}

const STATUS_COLOR: Record<ShowcaseFrameStatus, string> = {
  playing: "bg-emerald-400",
  reversing: "bg-amber-400",
  paused: "bg-sky-400",
  settled: "bg-white/40",
  idle: "bg-white/20",
};

export function StatusDot({ status }: { status: ShowcaseFrameStatus }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_COLOR[status]}`}
      aria-label={status}
    />
  );
}

export function DockButton({
  children,
  onClick,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded-lg px-2 py-1 font-medium text-white/95 transition-colors [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}

function PlayPauseToggle({ controller }: { controller: DockController }) {
  const isAnimating =
    controller.status === "playing" || controller.status === "reversing";
  const onClick = isAnimating ? controller.pause : controller.play;
  const label = isAnimating ? "Pause" : "Play";

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20"
    >
      {isAnimating ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}

/**
 * Bare minimal controls — play/pause toggle + rate. No outer chrome;
 * callers wrap in their own panel/glass container.
 * `leading` lets callers prepend extras (e.g. clip-player's autoplay+reset).
 */
export function AnimationDockUI({
  controller,
  leading,
}: {
  controller: DockController;
  leading?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs font-medium text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
      {leading}
      <PlayPauseToggle controller={controller} />
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={2}
          step={0.05}
          value={controller.rate}
          onChange={(e) => controller.setRate(+e.target.value)}
          className="h-1 w-24 cursor-pointer accent-white"
          aria-label="Playback rate"
        />
        <span className="w-10 text-right tabular-nums text-white/70">
          {controller.rate.toFixed(2)}x
        </span>
      </div>
    </div>
  );
}

/**
 * Floating dock backed by a HostAnimation. Hidden inside an iframe — the
 * embedding clip-player provides controls there.
 *
 * Default position is bottom-center: mobile lifts above the demo bottom-nav
 * area; desktop sits in the viewport gutter under the phone frame.
 */
export function FloatingAnimationDock({
  host,
  position = "fixed left-1/2 -translate-x-1/2 bottom-24 md:bottom-6 z-40",
}: {
  host: HostAnimation;
  /** Tailwind position classes. Override per mount site if needed. */
  position?: string;
}) {
  const controller = useHostController(host);
  const inIframe = useIsInIframe();

  if (inIframe) return null;

  return (
    <div className={position}>
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-neutral-900/55 px-3 py-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-white/5 backdrop-blur-xl backdrop-saturate-150">
        <AnimationDockUI controller={controller} />
      </div>
    </div>
  );
}
