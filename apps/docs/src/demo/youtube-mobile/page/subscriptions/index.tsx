import { ChevronRight, MoreVertical } from "lucide-react";
import { channels, feedVideos, shortVideos } from "../../mock-data";
import { ShortsMark } from "../shared/brand";
import { YouTubeTopBar } from "../shared/top-bar";
import { WideVideoCard } from "../shared/video-card";

const FILTERS = ["All", "Today", "Videos", "Shorts", "Live", "Podcasts"];

export default function SubscriptionsPage() {
  return (
    <main className="min-h-full bg-white pb-5 text-neutral-950">
      <YouTubeTopBar />

      <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-4 pt-2">
        {channels.map((channel) => (
          <div key={channel.name} className="w-[58px] shrink-0 text-center">
            <span className="relative mx-auto block h-[58px] w-[58px]">
              <img
                src={channel.image}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#065fd4]" />
            </span>
            <span className="mt-1.5 block truncate text-[10px]">
              {channel.name}
            </span>
          </div>
        ))}
        <button
          type="button"
          className="shrink-0 self-center px-1 text-[12px] font-semibold text-[#065fd4]"
        >
          All
        </button>
      </div>

      <div className="scrollbar-hide flex gap-2 overflow-x-auto px-3 pb-4">
        {FILTERS.map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={`h-9 shrink-0 rounded-lg px-4 text-[14px] font-medium ${
              index === 0 ? "bg-neutral-950 text-white" : "bg-neutral-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="border-y border-neutral-200 py-4">
        <div className="mb-3 flex items-center gap-2 px-4">
          <ShortsMark className="h-7 w-7 text-[#ff0033]" />
          <h1 className="text-[20px] font-bold">Shorts</h1>
          <ChevronRight className="h-5 w-5 text-neutral-500" />
        </div>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-3">
          {shortVideos.slice(0, 3).map((video) => (
            <article
              key={video.title}
              className="relative aspect-[0.65] w-[156px] shrink-0 overflow-hidden rounded-xl bg-neutral-900"
            >
              <img
                src={video.image}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2.5 pb-3 pt-16 text-white">
                <h2 className="line-clamp-2 text-[13px] font-semibold leading-4">
                  {video.title}
                </h2>
                <p className="mt-1 text-[10px] text-white/75">{video.meta}</p>
              </div>
              <MoreVertical className="absolute right-2 top-2 h-5 w-5 text-white" />
            </article>
          ))}
        </div>
      </section>

      <section className="pt-4">
        {feedVideos.map((video) => (
          <WideVideoCard key={video.title} video={video} />
        ))}
      </section>
    </main>
  );
}
