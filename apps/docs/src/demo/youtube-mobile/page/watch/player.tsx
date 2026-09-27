"use client";

import { useState } from "react";
import { ChevronDown, Maximize, Pause, Play } from "lucide-react";
import { DemoBackLink } from "@/lib/components/demo-back-link";
import type { MockVideo } from "../../mock-data";
import { MoreButton } from "../shared/action-sheet";

/** A quarter of the way in: "12:48" → "3:12". */
function elapsed(duration = "0:00") {
  const total = duration
    .split(":")
    .reduce((sum, part) => sum * 60 + Number(part), 0);
  const at = Math.round(total / 4);
  const h = Math.floor(at / 3600);
  const m = Math.floor((at % 3600) / 60);
  const s = String(at % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

/**
 * 16:9 player at the top of the page. Its <img> is the page's single zoom
 * enter marker. It scrolls with the page on purpose: zoom measures the marker
 * before the incoming page's scroll resets, and a sticky player would report
 * the wrong offset whenever the source list was scrolled.
 */
export function Player({
  video,
  parent,
}: {
  video: MockVideo;
  parent: string;
}) {
  const [playing, setPlaying] = useState(true);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <img
        src={video.image}
        alt=""
        width={1100}
        height={620}
        data-zoom-enter-key={video.id}
        className="h-full w-full object-cover"
      />
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          playing ? "opacity-0" : "opacity-40"
        }`}
      />

      <DemoBackLink
        fallback={parent}
        aria-label="Minimize player"
        className="absolute left-2 top-2 flex h-10 w-10 items-center justify-center rounded-full text-white active:bg-white/20"
      >
        <ChevronDown className="h-7 w-7 drop-shadow" />
      </DemoBackLink>
      <MoreButton
        menu="player"
        label="Player settings"
        className="absolute right-2 top-2 h-10 w-10 text-white active:bg-white/20"
        iconClassName="h-6 w-6 drop-shadow"
      />

      <button
        type="button"
        onClick={() => setPlaying(!playing)}
        aria-label={playing ? "Pause" : "Play"}
        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-transform duration-150 active:scale-90"
      >
        {playing ? (
          <Pause className="h-7 w-7" fill="currentColor" />
        ) : (
          <Play className="ml-1 h-7 w-7" fill="currentColor" />
        )}
      </button>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-6 text-[11px] font-medium text-white">
        <div className="flex items-center justify-between">
          <span>
            {video.live
              ? "LIVE"
              : `${elapsed(video.duration)} / ${video.duration}`}
          </span>
          <Maximize className="h-4 w-4" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/30">
        <div
          className={`h-full bg-[#ff0033] ${video.live ? "w-full" : "w-1/4"}`}
        />
      </div>
    </div>
  );
}
