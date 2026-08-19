import { Compass, MoreVertical } from "lucide-react";
import { feedVideos, shortVideos } from "../../mock-data";
import { ShortsMark } from "../shared/brand";
import { YouTubeTopBar } from "../shared/top-bar";
import { WideVideoCard } from "../shared/video-card";

const CHIPS = ["All", "For you", "Gaming", "Music", "Design", "Live"];

export default function HomePage() {
  return (
    <main className="min-h-full bg-white pb-5 text-neutral-950">
      <YouTubeTopBar />

      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-3 pb-3">
        <button
          type="button"
          aria-label="Explore"
          className="flex h-9 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100"
        >
          <Compass className="h-5 w-5" />
        </button>
        {CHIPS.map((chip, index) => (
          <button
            key={chip}
            type="button"
            className={`h-9 shrink-0 rounded-lg px-4 text-[14px] font-medium ${
              index === 0
                ? "bg-neutral-950 text-white"
                : "bg-neutral-100 text-neutral-900"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      <section className="px-3 pt-2">
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <ShortsMark className="h-7 w-7 text-[#ff0033]" />
            <h1 className="text-[20px] font-bold">Shorts</h1>
          </div>
          <MoreVertical className="h-5 w-5" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {shortVideos.map((video) => (
            <article
              key={video.title}
              className="relative aspect-[0.64] overflow-hidden rounded-xl bg-neutral-900"
            >
              <img
                src={video.image}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent px-3 pb-3 pt-14 text-white">
                <h2 className="line-clamp-2 text-[14px] font-semibold leading-[18px]">
                  {video.title}
                </h2>
                <p className="mt-1 text-[11px] text-white/80">{video.meta}</p>
              </div>
              <MoreVertical className="absolute right-2 top-2 h-5 w-5 text-white drop-shadow" />
            </article>
          ))}
        </div>
      </section>

      <section className="mt-5 border-t border-neutral-200 pt-4">
        {feedVideos.slice(0, 2).map((video) => (
          <WideVideoCard key={video.title} video={video} />
        ))}
      </section>
    </main>
  );
}
