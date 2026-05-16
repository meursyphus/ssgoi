"use client";

import { useSong } from "@/demo/youtube-music-web/state/song";
import type { SongState } from "@/demo/youtube-music-web/state/song";

const TABS: { id: SongState["tab"]; label: string }[] = [
  { id: "up-next", label: "Up next" },
  { id: "lyrics", label: "Lyrics" },
  { id: "related", label: "Related" },
];

export function TabBar() {
  const song = useSong((s) => ({ tab: s.tab, actions: s.actions }));
  return (
    <div className="flex gap-1 border-b border-white/10">
      {TABS.map((t) => {
        const active = song.tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => song.actions.setTab(t.id)}
            className={[
              "relative h-11 px-4 text-[13px] font-semibold tracking-tight transition-colors",
              active ? "text-white" : "text-white/55 hover:text-white",
            ].join(" ")}
          >
            {t.label}
            {active && (
              <span className="absolute -bottom-px left-3 right-3 h-[3px] rounded-full bg-white" />
            )}
          </button>
        );
      })}
    </div>
  );
}
