import { ChevronRight, History } from "lucide-react";
import { Link } from "@/lib/link";
import { BASE, historyItems } from "../../mock-data";
import { MoreButton } from "../shared/action-sheet";
import { VideoBadge } from "../shared/video-card";

/** Watch history carousel; each card resumes the video on the watch page. */
export function HistoryRow() {
  return (
    <section className="pb-6">
      <div className="flex items-center gap-2 px-4">
        <History className="h-5 w-5" />
        <h2 className="text-[20px] font-bold">History</h2>
        <ChevronRight className="h-5 w-5 text-neutral-500" />
      </div>
      <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto px-4">
        {historyItems.map(({ video, progress }) => (
          <article key={video.id} className="w-[190px] shrink-0">
            <Link
              href={`${BASE}/watch/${video.id}`}
              scroll={false}
              className="relative block aspect-video overflow-hidden rounded-xl bg-neutral-200"
            >
              <img
                src={video.image}
                alt=""
                width={1100}
                height={620}
                data-zoom-exit-key={video.id}
                className="h-full w-full object-cover"
              />
              <VideoBadge video={video} />
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/40">
                <span
                  className="block h-full bg-[#ff0033]"
                  style={{ width: `${progress * 100}%` }}
                />
              </span>
            </Link>
            <div className="mt-2 flex gap-1">
              <Link
                href={`${BASE}/watch/${video.id}`}
                scroll={false}
                className="min-w-0 flex-1"
              >
                <h3 className="line-clamp-2 text-[13px] font-medium leading-4">
                  {video.title}
                </h3>
                <p className="mt-1 text-[11px] text-neutral-500">
                  {video.channel}
                </p>
              </Link>
              <MoreButton
                menu="history"
                className="-mr-1.5 -mt-1 h-7 w-7 shrink-0"
                iconClassName="h-4 w-4"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
