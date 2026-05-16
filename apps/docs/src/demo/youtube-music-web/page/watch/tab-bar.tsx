"use client";

import { useSong } from "@/demo/youtube-music-web/state/song";
import type { SongState } from "@/demo/youtube-music-web/state/song";

const TABS: { id: SongState["tab"]; label: string }[] = [
  { id: "up-next", label: "다음 트랙" },
  { id: "lyrics", label: "가사" },
  { id: "related", label: "관련 항목" },
];

export function TabBar() {
  const song = useSong((s) => ({ tab: s.tab, actions: s.actions }));
  return (
    <div className="flex gap-2 border-b border-white/10">
      {TABS.map((t) => {
        const active = song.tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => song.actions.setTab(t.id)}
            className={[
              "relative h-11 px-3 text-[13px] font-semibold tracking-tight transition-colors",
              active ? "text-white" : "text-white/55 hover:text-white",
            ].join(" ")}
          >
            {t.label}
            {active && (
              <span className="absolute -bottom-px left-2 right-2 h-[3px] rounded-full bg-white" />
            )}
          </button>
        );
      })}
    </div>
  );
}
