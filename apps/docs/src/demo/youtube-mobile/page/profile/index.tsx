import { ChevronRight, History, MoreVertical, Play } from "lucide-react";
import { historyVideos } from "../../mock-data";
import { YouTubeTopBar } from "../shared/top-bar";

const LIBRARY_FILTERS = [
  "Recent",
  "Playlists",
  "Downloads",
  "Podcasts",
  "Music",
];

export default function ProfilePage() {
  return (
    <main className="min-h-full bg-white pb-8 text-neutral-950">
      <YouTubeTopBar profile />

      <section className="px-4 pb-6 pt-6">
        <div className="flex items-center gap-4">
          <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff0033] via-[#7b2cff] to-[#065fd4] text-[28px] font-bold text-white">
            AM
          </div>
          <div className="min-w-0">
            <h1 className="text-[27px] font-bold tracking-tight">
              Alex Morgan
            </h1>
            <p className="mt-1 text-[14px] text-neutral-500">
              @alexmakes · Premium member
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="h-10 rounded-full bg-neutral-950 text-[14px] font-semibold text-white"
          >
            View channel
          </button>
          <button
            type="button"
            className="h-10 rounded-full border border-neutral-300 text-[14px] font-semibold"
          >
            Premium benefits
          </button>
        </div>
      </section>

      <section className="pb-6">
        <div className="flex items-center gap-2 px-4">
          <History className="h-5 w-5" />
          <h2 className="text-[20px] font-bold">History</h2>
          <ChevronRight className="h-5 w-5 text-neutral-500" />
        </div>
        <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto px-4">
          {historyVideos.map((video) => (
            <article key={video.title} className="w-[190px] shrink-0">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-200">
                <img
                  src={video.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] text-white">
                  {video.meta}
                </span>
              </div>
              <div className="mt-2 flex gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-[13px] font-medium leading-4">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {video.channel}
                  </p>
                </div>
                <MoreVertical className="h-4 w-4 shrink-0" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200 px-4 pt-6">
        <h2 className="text-[22px] font-bold">Your library</h2>
        <div className="scrollbar-hide -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
          {LIBRARY_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              className="h-9 shrink-0 rounded-lg bg-neutral-100 px-4 text-[13px] font-medium"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {historyVideos.slice(0, 2).map((video, index) => (
            <article key={video.title} className="flex gap-3">
              <div className="relative aspect-video w-[145px] shrink-0 overflow-hidden rounded-xl bg-neutral-200">
                <img
                  src={video.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-white">
                  <Play className="h-4 w-4" fill="currentColor" />
                </span>
              </div>
              <div className="min-w-0 flex-1 py-1">
                <h3 className="text-[15px] font-semibold">
                  {index === 0 ? "Saved creative ideas" : "Weekend listening"}
                </h3>
                <p className="mt-2 text-[12px] text-neutral-500">
                  Private · Playlist
                </p>
              </div>
              <MoreVertical className="mt-1 h-5 w-5 shrink-0" />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
