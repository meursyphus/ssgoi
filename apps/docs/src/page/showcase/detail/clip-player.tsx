"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { showcaseFrameProtocol } from "@/lib/hooks";
import { ShowcasePhone } from "@/components/showcase-phone";
import { DesktopFrame } from "@/components/desktop-frame";
import {
  AnimationDockUI,
  StatusDot,
  type DockController,
} from "@/lib/components/animation-dock";
import { clipProgram } from "../preview/program";
import {
  PLAY_MIN_RATIO,
  useDocumentVisible,
  useLoadSlot,
  useOnScreen,
  usePreviewTour,
} from "../preview/use-preview-tour";
import type { ShowcaseClip, ShowcasePlatform } from "../data";

/**
 * Plays a single transition clip inside an iframe, on a loop: a history push
 * from `exitPath` to `enterPath`, then a real `history.back()`, so SSGOI
 * replays the effect in reverse the way a user's Back would. The moves go
 * through the page's preview scheduler (`preview/scheduler.ts`): every clip
 * on the page shares one joint session history, and a back may only undo
 * this clip's own entry.
 *
 * The animation dock posts `{type: "ssgoi-showcase:host", command}` to control
 * the underlying HostAnimation (play/pause/rate); while it is paused the loop
 * holds its screen.
 */
export function ClipPlayer({
  id,
  clip,
  platform = "mobile",
}: {
  /** Anchor for deep links (`#clip-i`), e.g. from a catalog search hit. */
  id?: string;
  clip: ShowcaseClip;
  platform?: ShowcasePlatform;
}) {
  const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [rate, setRate] = useState(1);
  const onScreen = useOnScreen(box, "0px", PLAY_MIN_RATIO);
  const near = useOnScreen(box, "600px");
  const docVisible = useDocumentVisible();
  const program = useMemo(() => clipProgram(clip), [clip]);
  const status = useFrameStatus(frame);

  const playback = usePreviewTour(frame, program, {
    name: `clip:${clip.title}`,
    active: onScreen && docVisible,
    hold: status === "paused",
  });
  // Created only while no other clip is "out" (see `acquireLoad`).
  const live = useLoadSlot(near, playback.ready);

  const post = useCallback(
    (msg: object) => frame?.contentWindow?.postMessage(msg, "*"),
    [frame],
  );
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

  const overlay = (
    <a
      href={clip.exitPath}
      target="_blank"
      rel="noopener noreferrer"
      className="group absolute inset-0 z-10 flex items-end justify-center pb-5 transition-colors duration-200 hover:bg-black/45 hover:backdrop-blur-[2px]"
      aria-label={`Open ${clip.title} in a new tab`}
    >
      <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-neutral-900 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        Open demo ↗
      </span>
    </a>
  );

  return (
    <div
      id={id}
      ref={setBox}
      className={
        "flex scroll-mt-8 flex-col gap-3 " +
        (platform === "web" ? "w-full max-w-[760px]" : "w-[300px]")
      }
    >
      {!live ? (
        <ClipPlaceholder platform={platform} />
      ) : platform === "web" ? (
        <DesktopFrame
          ref={setFrame}
          src={program.start}
          title={clip.title}
          widthClassName="w-full"
          interactive={false}
          urlLabel={`ssgoi.dev${clip.exitPath === "/" ? "" : clip.exitPath}`}
        >
          {overlay}
        </DesktopFrame>
      ) : (
        <ShowcasePhone
          ref={setFrame}
          src={program.start}
          title={clip.title}
          widthClassName="w-full"
          interactive={false}
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
        <AnimationDockUI controller={controller} />
      </div>

      {clip.caption && (
        <p className="text-xs text-neutral-500">{clip.caption}</p>
      )}
    </div>
  );
}

function ClipPlaceholder({ platform }: { platform: ShowcasePlatform }) {
  return (
    <div
      aria-hidden
      className={
        platform === "web"
          ? "aspect-[1280/828] w-full rounded-[12px] bg-[#1c1611]"
          : "aspect-[9/19] w-full rounded-[32px] bg-gradient-to-b from-[#1c1611] to-[#0f0b08]"
      }
    />
  );
}

/** The frame's host status, as the scheduler hears it. */
function useFrameStatus(frame: HTMLIFrameElement | null) {
  const [status, setStatus] = useState<DockController["status"]>("idle");
  useEffect(() => {
    const win = frame?.contentWindow;
    if (!win) return;
    function onMessage(e: MessageEvent) {
      if (e.source !== win) return;
      const data = e.data as { type?: unknown; status?: unknown } | null;
      if (data?.type === showcaseFrameProtocol.messages.status)
        setStatus(data.status as DockController["status"]);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [frame]);
  return status;
}
