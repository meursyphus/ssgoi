import { Link } from "@/lib/link";
import { BASE, type MockVideo } from "../../mock-data";
import { MoreButton } from "./action-sheet";
import { ChannelAvatar } from "./channel-avatar";

/** Duration or LIVE badge on a thumbnail. */
export function VideoBadge({ video }: { video: MockVideo }) {
  if (video.live) {
    return (
      <span className="absolute bottom-2 right-2 rounded bg-[#cc0000] px-1.5 py-0.5 text-[11px] font-semibold text-white">
        LIVE
      </span>
    );
  }
  if (!video.duration) return null;
  return (
    <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-[11px] font-medium text-white">
      {video.duration}
    </span>
  );
}

/**
 * Full-width feed card. The thumbnail and the title open the watch page (the
 * thumbnail <img> carries the zoom exit key); the avatar opens the channel and
 * ⋮ opens the action sheet, so no link sits inside another.
 */
export function WideVideoCard({
  video,
  showChannel = true,
}: {
  video: MockVideo;
  showChannel?: boolean;
}) {
  const href = `${BASE}/watch/${video.id}`;
  return (
    <article>
      <Link href={href} scroll={false} className="block">
        <div className="relative aspect-video overflow-hidden bg-neutral-200">
          <img
            src={video.image}
            alt=""
            width={1100}
            height={620}
            data-zoom-exit-key={video.id}
            className="h-full w-full object-cover"
          />
          <VideoBadge video={video} />
        </div>
      </Link>
      <div className="flex gap-3 px-3 pb-4 pt-3">
        {showChannel && (
          <Link
            href={`${BASE}/channel/${video.channelId}`}
            scroll={false}
            aria-label={video.channel}
            className="shrink-0"
          >
            <ChannelAvatar channelId={video.channelId} size={36} />
          </Link>
        )}
        <Link href={href} scroll={false} className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-5 text-neutral-950">
            {video.title}
          </h3>
          <p className="mt-1 truncate text-[12px] text-neutral-500">
            {showChannel ? `${video.channel} · ` : ""}
            {video.views} · {video.ago}
          </p>
        </Link>
        <MoreButton menu="video" className="-mr-1 h-8 w-8 shrink-0" />
      </div>
    </article>
  );
}
