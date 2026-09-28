"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ShowcasePhone } from "@/components/showcase-phone";
import { DesktopFrame } from "@/components/desktop-frame";
import { IframeLoadingOverlay } from "@/components/iframe-loading-overlay";
import type { ShowcasePlatform } from "@/page/showcase/data";
import { pairProgram } from "@/page/showcase/preview/program";
import {
  PLAY_MIN_RATIO,
  useDocumentVisible,
  useLoadSlot,
  useOnScreen,
  usePreviewTour,
} from "@/page/showcase/preview/use-preview-tour";

type Props = {
  platform: ShowcasePlatform;
  /** Path the iframe routes _to_ on the "enter" leg. */
  enterPath: string;
  /** Path it returns to (a real history back) — also the starting frame. */
  exitPath: string;
  title: string;
  /** Hold on each end, in ms. */
  intervalMs?: number;
};

/**
 * One transition's representative live demo. Mirrors the showcase card preview:
 * lazy-mounts when near the viewport, then loops push `enterPath` → real
 * history back, through the page's preview scheduler (every preview on the
 * page shares one joint session history). Pausing, scrolling away or hiding
 * the tab returns it to `exitPath` first. Stays inert when the docs site is
 * itself embedded in an iframe (showcase-within-showcase).
 */
export function TransitionDemo({
  platform,
  enterPath,
  exitPath,
  title,
  intervalMs = 2200,
}: Props) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const onScreen = useOnScreen(container, "0px", PLAY_MIN_RATIO);
  const near = useOnScreen(container, "300px");
  const docVisible = useDocumentVisible();
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
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      if (media.matches) setPlaying(false);
    };

    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  const want = topLevel && near;
  const program = useMemo(
    () => pairProgram({ from: exitPath, to: enterPath, dwell: intervalMs }),
    [exitPath, enterPath, intervalMs],
  );
  const playback = usePreviewTour(frame, program, {
    name: `demo:${title}`,
    active: want && onScreen && playing && docVisible,
  });
  // Created only while no other preview is "out" (see `acquireLoad`).
  const show = useLoadSlot(want, playback.ready);

  return (
    <div ref={setContainer} className="flex w-full flex-col items-center">
      <div className={platform === "web" ? "w-full" : "flex justify-center"}>
        {show ? (
          platform === "web" ? (
            <DesktopFrame
              ref={setFrame}
              src={exitPath}
              title={title}
              widthClassName="w-full"
              interactive={false}
            />
          ) : (
            <ShowcasePhone
              ref={setFrame}
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
      <div className="relative aspect-[9/19] min-h-0 rounded-[32px] bg-gradient-to-b from-[#1c1611] to-[#0f0b08] p-[6px]">
        <div className="relative h-full overflow-hidden rounded-[26px] bg-white">
          <IframeLoadingOverlay visible variant="light" />
        </div>
      </div>
    </div>
  );
}
