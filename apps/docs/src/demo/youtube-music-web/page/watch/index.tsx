"use client";

import { useSong, type SongDetail } from "@/demo/youtube-music-web/state/song";
import { NowPlaying } from "./now-playing";
import { UpNext } from "./up-next";
import { Lyrics } from "./lyrics";
import { Related } from "./related";
import { TabBar } from "./tab-bar";
export default function WatchPage({
  initialData,
}: {
  initialData: SongDetail;
}) {
  const song = useSong((s) => ({
    tab: s.tab,
    actions: s.actions,
  }));
  song.actions.init(initialData);
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#161616] via-[#0a0a0a] to-[#030303] text-white">
      <div className="mx-auto flex max-w-[1300px] flex-col px-4 pb-12 pt-4 lg:px-8">
        <TabBar />
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
          <NowPlaying detail={initialData} />
          <div className="min-w-0">
            {song.tab === "up-next" && <UpNext detail={initialData} />}
            {song.tab === "lyrics" && <Lyrics detail={initialData} />}
            {song.tab === "related" && <Related detail={initialData} />}
          </div>
        </div>
      </div>
    </div>
  );
}
