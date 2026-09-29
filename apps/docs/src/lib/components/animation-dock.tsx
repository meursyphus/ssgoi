"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { House, Play, Square } from "lucide-react";
import type { HostAnimation } from "@ssgoi/core/internal";
import { showcaseFrameProtocol, type ShowcaseFrameStatus } from "@/lib/hooks";
import { Link } from "@/lib/link";

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
  const label = isAnimating ? "Stop" : "Play";

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20"
    >
      {isAnimating ? (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6 6h12v12H6z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}

function SlowToggle({ controller }: { controller: DockController }) {
  const slow = Math.abs(controller.rate - 0.1) < 0.001;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={slow}
      aria-label="slow playback (0.1×)"
      title={slow ? "slow · 0.1×" : "normal · 1×"}
      onClick={() => controller.setRate(slow ? 1 : 0.1)}
      className={`flex h-9 items-center gap-2 rounded-full border px-2.5 text-[11px] font-semibold tracking-wide transition-colors ${
        slow
          ? "border-orange-300/40 bg-orange-400/15 text-orange-100"
          : "border-white/15 bg-white/5 text-white/75 hover:bg-white/10"
      }`}
    >
      <span>slow</span>
      <span
        aria-hidden="true"
        className={`relative h-[16px] w-[28px] overflow-hidden rounded-full transition-colors ${slow ? "bg-orange-400" : "bg-white/25"}`}
      >
        <span
          className={`absolute top-[2px] left-[2px] h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${slow ? "translate-x-3" : "translate-x-0"}`}
        />
      </span>
    </button>
  );
}

/**
 * Bare minimal controls — play/stop and a slow (0.1×) switch.
 * No outer chrome; callers wrap in their own panel/glass container.
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
    <div className="flex items-center gap-2 text-xs font-medium text-white/95">
      {leading}
      <PlayPauseToggle controller={controller} />
      <SlowToggle controller={controller} />
    </div>
  );
}

type DockOffset = { right: number; bottom: number };

function clampOffset(
  offset: DockOffset,
  width: number,
  height: number,
): DockOffset {
  const safeBottom =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--safe-bottom",
      ),
    ) || 0;
  const minBottom = window.matchMedia("(min-width: 768px)").matches
    ? 12
    : safeBottom + 96;
  const maxRight = Math.max(12, window.innerWidth - width - 12);
  const maxBottom = Math.max(12, window.innerHeight - height - 12);
  return {
    right: Math.min(Math.max(offset.right, 12), maxRight),
    bottom: Math.min(Math.max(offset.bottom, minBottom), maxBottom),
  };
}

/**
 * Floating dock backed by a HostAnimation. Hidden inside an iframe — the
 * embedding clip-player provides controls there.
 *
 * The collapsed logo sits above mobile demo bottom navigation. On desktop it
 * stays in the viewport's lower-right gutter, away from the phone frame.
 */
export function FloatingAnimationDock({
  host,
  position = "fixed right-4 bottom-[calc(var(--safe-bottom)+6rem)] md:right-6 md:bottom-6 z-50",
}: {
  host: HostAnimation;
  /** Tailwind position classes. Override per mount site if needed. */
  position?: string;
}) {
  const controller = useHostController(host);
  const inIframe = useIsInIframe();
  const [expanded, setExpanded] = useState(false);
  const [offset, setOffset] = useState<DockOffset | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    right: number;
    bottom: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const onDragStart = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    const rect = dockRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      right: window.innerWidth - rect.right,
      bottom: window.innerHeight - rect.bottom,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onDragMove = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    const rect = dockRef.current?.getBoundingClientRect();
    if (!drag || drag.pointerId !== event.pointerId || !rect) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    setOffset(
      clampOffset(
        { right: drag.right - dx, bottom: drag.bottom - dy },
        rect.width,
        rect.height,
      ),
    );
  };

  const onDragEnd = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    suppressClickRef.current =
      drag.moved && event.currentTarget.dataset.playerToggle === "true";
    dragRef.current = null;
  };

  const onDragCancel = () => {
    dragRef.current = null;
    suppressClickRef.current = false;
  };

  const isPositioned = offset !== null;
  useEffect(() => {
    if (!isPositioned) return;
    const onResize = () => {
      setOffset((current) => {
        if (!current) return current;
        const next = clampOffset(
          current,
          expanded ? 64 : 56,
          expanded ? 264 : 56,
        );
        return next.right === current.right && next.bottom === current.bottom
          ? current
          : next;
      });
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [expanded, isPositioned]);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  if (inIframe) return null;

  const isAnimating =
    controller.status === "playing" || controller.status === "reversing";
  const slow = Math.abs(controller.rate - 0.1) < 0.001;

  return (
    <div
      ref={dockRef}
      className={`${position} overflow-hidden border border-white/20 bg-[#171717] text-white shadow-[0_10px_30px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)] transition-[width,height,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${expanded ? "h-[264px] w-16 rounded-[32px]" : "h-14 w-14 rounded-full"}`}
      style={offset ?? undefined}
    >
      <div
        id="demo-player-controls"
        inert={!expanded}
        aria-hidden={!expanded}
        className={`absolute inset-x-0 top-2 bottom-[60px] flex flex-col items-center gap-1.5 transition-[opacity,transform] duration-200 motion-reduce:transition-none ${expanded ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <button
          type="button"
          aria-label="Drag player"
          title="Drag player"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragCancel}
          className="flex h-5 w-11 shrink-0 touch-none cursor-grab items-center justify-center active:cursor-grabbing"
        >
          <span
            className="h-1 w-4 rounded-full bg-white/30"
            aria-hidden="true"
          />
        </button>
        <Link
          href="/"
          aria-label="Home"
          title="Home"
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <House className="h-[17px] w-[17px]" aria-hidden="true" />
          <span className="text-[9px] font-medium leading-none">home</span>
        </Link>
        <button
          type="button"
          onClick={isAnimating ? controller.pause : controller.play}
          aria-label={isAnimating ? "Stop" : "Play"}
          title={isAnimating ? "Stop" : "Play"}
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          {isAnimating ? (
            <Square
              className="h-[15px] w-[15px] fill-current"
              aria-hidden="true"
            />
          ) : (
            <Play
              className="h-[17px] w-[17px] fill-current"
              aria-hidden="true"
            />
          )}
          <span className="text-[9px] font-medium leading-none">
            {isAnimating ? "stop" : "play"}
          </span>
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={slow}
          aria-label="slow playback (0.1×)"
          title={slow ? "slow · 0.1×" : "normal · 1×"}
          onClick={() => controller.setRate(slow ? 1 : 0.1)}
          className={`flex h-[52px] w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl transition-colors ${slow ? "bg-orange-400/15 text-orange-200" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
        >
          <span className="text-[10px] font-medium leading-none">slow</span>
          <span
            aria-hidden="true"
            className={`relative h-4 w-7 overflow-hidden rounded-full transition-colors ${slow ? "bg-orange-400" : "bg-white/25"}`}
          >
            <span
              className={`absolute top-[2px] left-[2px] h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${slow ? "translate-x-3" : "translate-x-0"}`}
            />
          </span>
        </button>
      </div>
      <div
        className={`absolute inset-x-3 bottom-[56px] h-px bg-white/10 transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0"}`}
      />
      <button
        type="button"
        onClick={() => {
          if (suppressClickRef.current) {
            suppressClickRef.current = false;
            return;
          }
          setExpanded((current) => !current);
        }}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragCancel}
        onDragStart={(event) => event.preventDefault()}
        data-player-toggle="true"
        aria-label={expanded ? "Collapse player" : "Expand player"}
        aria-expanded={expanded}
        aria-controls="demo-player-controls"
        title={expanded ? "Collapse player" : "Drag or expand player"}
        className="absolute bottom-[3px] left-1/2 flex h-12 w-12 -translate-x-1/2 touch-none cursor-grab items-center justify-center rounded-full transition-colors hover:bg-white/10 active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        <Image
          src="/ssgoi-logo.png"
          alt=""
          width={28}
          height={28}
          className="h-7 w-7"
          draggable={false}
        />
      </button>
    </div>
  );
}
