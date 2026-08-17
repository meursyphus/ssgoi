import { MoreVertical } from "lucide-react";
import type { MockVideo } from "../../mock-data";

export function WideVideoCard({ video }: { video: MockVideo }) {
  return (
    <article>
      <div className="relative aspect-video overflow-hidden bg-neutral-200">
        <img src={video.image} alt="" className="h-full w-full object-cover" />
        {video.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {video.duration}
          </span>
        )}
      </div>
      <div className="flex gap-3 px-3 py-3">
        <img
          src={`https://picsum.photos/seed/${encodeURIComponent(video.channel)}/72/72`}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-5 text-neutral-950">
            {video.title}
          </h3>
          <p className="mt-1 truncate text-[12px] text-neutral-500">
            {video.channel} · {video.meta}
          </p>
        </div>
        <MoreVertical className="h-5 w-5 shrink-0 text-neutral-700" />
      </div>
    </article>
  );
}
