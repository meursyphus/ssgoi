"use client";

import type { SongDetail } from "@/demo/youtube-music-web/api/song";

export function Lyrics({ detail }: { detail: SongDetail }) {
  const lines = detail.lyrics.split("\n");
  return (
    <section>
      <header className="mb-3">
        <h2 className="text-[16px] font-semibold tracking-tight">Lyrics</h2>
        <p className="mt-1 text-[12px] text-white/55">
          {detail.artist} • {detail.album}
        </p>
      </header>
      <div className="space-y-1 text-[15px] leading-relaxed text-white/80">
        {lines.map((line, i) =>
          line.trim() === "" ? (
            <div key={i} className="h-4" />
          ) : (
            <p
              key={i}
              className={
                i === 0
                  ? "text-white"
                  : i < 3
                    ? "text-white/85"
                    : "text-white/55"
              }
            >
              {line}
            </p>
          ),
        )}
      </div>
      <p className="mt-8 text-[11px] text-white/40">
        Provided by the ssgoi demo • No license info
      </p>
    </section>
  );
}
