"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { showcaseFrameProtocol } from "@/lib/hooks";
import { ShowcasePhone } from "@/components/showcase-phone";
import { DesktopFrame } from "@/components/desktop-frame";
import { IframeLoadingOverlay } from "@/components/iframe-loading-overlay";
import type { ShowcasePlatform } from "@/page/showcase/data";

type Props = {
  platform: ShowcasePlatform;
  /** Path the iframe routes _to_ on the "enter" leg. */
  enterPath: string;
  /** Path it routes back to on the "exit" leg — also the starting frame. */
  exitPath: string;
  title: string;
  intervalMs?: number;
};

/**
 * One transition's representative live demo. Mirrors the showcase card preview:
 * lazy-mounts when near the viewport, then ping-pongs the iframe between the
 * enter/exit routes so the transition plays on a loop. Stays inert when the docs
 * site is itself embedded in an iframe (showcase-within-showcase).
 */
export function TransitionDemo({
  platform,
  enterPath,
  exitPath,
  title,
  intervalMs = 3000,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(true);
  const topLevel = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    },
    () => false,
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenVisible(true);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      if (media.matches) setPlaying(false);
    };

    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  const show = topLevel && hasBeenVisible;

  useEffect(() => {
    if (!show || !inView || !playing) return;
    let onEnter = false;
    const id = window.setInterval(() => {
      const next = onEnter ? exitPath : enterPath;
      onEnter = !onEnter;
      iframeRef.current?.contentWindow?.postMessage(
        { type: showcaseFrameProtocol.messages.navigate, path: next },
        "*",
      );
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [show, inView, playing, enterPath, exitPath, intervalMs]);

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center">
      <div className={platform === "web" ? "w-full" : "flex justify-center"}>
        {show ? (
          platform === "web" ? (
            <DesktopFrame
              ref={iframeRef}
              src={exitPath}
              title={title}
              widthClassName="w-full"
              interactive={false}
            />
          ) : (
            <ShowcasePhone
              ref={iframeRef}
              src={exitPath}
              title={title}
              widthClassName="w-[190px]"
              interactive={false}
            />
          )
        ) : (
          <DemoPlaceholder platform={platform} />
        )}
      </div>
      {show && (
        <button
          type="button"
          aria-pressed={playing}
          aria-label={`${playing ? "Pause" : "Play"} ${title} animation preview`}
          onClick={() => setPlaying((value) => !value)}
          className={
            "mt-3 rounded-full border border-line-strong bg-panel px-3 py-1.5 text-sm text-ink-faint transition-colors hover:border-ink-faint hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-strong " +
            (platform === "web" ? "self-end" : "")
          }
        >
          {playing ? "Pause preview" : "Play preview"}
        </button>
      )}
    </div>
  );
}

function DemoPlaceholder({ platform }: { platform: ShowcasePlatform }) {
  if (platform === "web") {
    return (
      <div className="w-full overflow-hidden rounded-[12px] bg-[#1c1611] p-[1px]">
        <div className="flex h-7 w-full items-center gap-[5px] rounded-t-[11px] bg-gradient-to-b from-[#2a221c] to-[#1c1611] px-2.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="relative aspect-[1280/800] overflow-hidden rounded-b-[11px] bg-canvas">
          <IframeLoadingOverlay visible variant="dark" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-[190px]">
      <div className="relative aspect-[9/19] rounded-[32px] bg-gradient-to-b from-[#1c1611] to-[#0f0b08] p-[6px]">
        <div className="relative h-full overflow-hidden rounded-[26px] bg-white">
          <IframeLoadingOverlay visible variant="light" />
        </div>
      </div>
    </div>
  );
}
