"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { showcaseFrameProtocol, type ShowcaseFrameStatus } from "@/lib/hooks";
import { ShowcasePhone } from "@/components/showcase-phone";
import { DesktopFrame } from "@/components/desktop-frame";
import {
  AnimationDockUI,
  DockButton,
  StatusDot,
  type DockController,
} from "@/lib/components/animation-dock";
import type { ShowcaseClip, ShowcasePlatform } from "../data";

/**
 * Plays a single transition clip inside an iframe.
 *
 * Mechanism: parent posts `{type: "ssgoi-showcase:navigate", path}` to the
 * iframe and the demo's MobileShowcaseShell calls router.push. We toggle
 * between `enterPath` and `exitPath` on an interval so the ssgoi transition
 * fires repeatedly.
 *
 * The animation dock posts `{type: "ssgoi-showcase:host", command}` to control
 * the underlying HostAnimation (play/pause/reverse/rate) — same lever the
 * AnimationDock in apps/dev exposes.
 */
export function ClipPlayer({
  clip,
  demoOrigin,
  platform = "mobile",
}: {
  clip: ShowcaseClip;
  demoOrigin: string;
  platform?: ShowcasePlatform;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [autoplay, setAutoplay] = useState(true);
  const [status, setStatus] = useState<ShowcaseFrameStatus>("idle");
  const [rate, setRate] = useState(1);
  const intervalMs = clip.intervalMs ?? 4800;

  // toggle state — we drive enter/exit ourselves so the dock can pause without
  // racing the demo's own router state
  const onEnterRef = useRef(false);

  const post = useCallback((msg: object) => {
    const w = iframeRef.current?.contentWindow;
    if (!w) return;
    w.postMessage(msg, "*");
  }, []);

  const navigate = useCallback(
    (path: string) =>
      post({ type: showcaseFrameProtocol.messages.navigate, path }),
    [post],
  );

  // listen for status broadcasts from the iframe
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== iframeRef.current?.contentWindow) return;
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.type === showcaseFrameProtocol.messages.status) {
        setStatus(data.status as ShowcaseFrameStatus);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // auto-toggle enter/exit
  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      const next = onEnterRef.current ? clip.exitPath : clip.enterPath;
      onEnterRef.current = !onEnterRef.current;
      navigate(next);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [autoplay, clip.enterPath, clip.exitPath, intervalMs, navigate]);

  const reset = () => {
    onEnterRef.current = false;
    navigate(clip.exitPath);
  };

  const sendHost = (command: string, payload?: number) =>
    post({ type: showcaseFrameProtocol.messages.host, command, payload });

  const controller: DockController = {
    status,
    rate,
    play: () => sendHost("play"),
    pause: () => sendHost("pause"),
    setRate: (r) => {
      setRate(r);
      sendHost("rate", r);
    },
  };

  const overlay = autoplay ? (
    <a
      href={clip.enterPath}
      target="_blank"
      rel="noopener noreferrer"
      className="group absolute inset-0 z-10 flex items-end justify-center pb-5 transition-colors duration-200 hover:bg-black/45 hover:backdrop-blur-[2px]"
      aria-label={`Open ${clip.title} in a new tab`}
    >
      <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-900 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        Open demo ↗
      </span>
    </a>
  ) : null;

  return (
    <div
      className={
        "flex flex-col gap-3 " +
        (platform === "web" ? "w-full max-w-[760px]" : "w-[300px]")
      }
    >
      {platform === "web" ? (
        <DesktopFrame
          ref={iframeRef}
          src={demoOrigin}
          title={clip.title}
          widthClassName="w-full"
          interactive={!autoplay}
          urlLabel={`ssgoi.dev${clip.exitPath === "/" ? "" : clip.exitPath}`}
        >
          {overlay}
        </DesktopFrame>
      ) : (
        <ShowcasePhone
          ref={iframeRef}
          src={demoOrigin}
          title={clip.title}
          widthClassName="w-full"
          interactive={!autoplay}
          scaleViewport={false}
        >
          {overlay}
        </ShowcasePhone>
      )}

      <div className="flex items-center gap-2 text-sm">
        <h3 className="font-medium text-neutral-100">{clip.title}</h3>
        <span className="rounded-full border border-orange-400/30 bg-orange-400/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-orange-200">
          {clip.transition}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-neutral-500">
          <StatusDot status={status} /> {status}
        </span>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] px-2 py-1.5">
        <AnimationDockUI
          controller={controller}
          leading={
            <>
              <DockButton
                title={autoplay ? "Pause auto-route" : "Resume auto-route"}
                onClick={() => setAutoplay((p) => !p)}
              >
                {autoplay ? "⏸ auto" : "▶ auto"}
              </DockButton>
              <DockButton title="Reset to exit path" onClick={reset}>
                ↺
              </DockButton>
              <div className="mx-1 h-4 w-px bg-white/10" />
            </>
          }
        />
      </div>

      {clip.caption && (
        <p className="text-xs text-neutral-500">{clip.caption}</p>
      )}
    </div>
  );
}
