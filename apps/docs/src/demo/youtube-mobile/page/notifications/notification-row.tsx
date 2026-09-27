import { Link } from "@/lib/link";
import { BASE, type Notification } from "../../mock-data";
import { MoreButton } from "../shared/action-sheet";
import { ChannelAvatar } from "../shared/channel-avatar";

/** Avatar → channel (drill); text and thumbnail → watch (zoom). */
export function NotificationRow({ item }: { item: Notification }) {
  const { video } = item;
  return (
    <article className="flex items-start gap-3 py-3 pl-2 pr-1">
      <span
        className={`mt-4 h-1 w-1 shrink-0 rounded-full ${
          item.unread ? "bg-[#065fd4]" : "bg-transparent"
        }`}
      />
      <Link
        href={`${BASE}/channel/${video.channelId}`}
        scroll={false}
        aria-label={video.channel}
        className="shrink-0"
      >
        <ChannelAvatar channelId={video.channelId} size={44} />
      </Link>
      <Link
        href={`${BASE}/watch/${video.id}`}
        scroll={false}
        className="flex min-w-0 flex-1 gap-3"
      >
        <span className="min-w-0 flex-1">
          <span className="line-clamp-3 text-[14px] leading-5">
            {video.channel} {item.verb}: {video.title}
          </span>
          <span className="mt-1 block text-[12px] text-neutral-500">
            {item.ago}
          </span>
        </span>
        <span className="relative block aspect-video w-[112px] shrink-0 self-start overflow-hidden rounded-lg bg-neutral-200">
          <img
            src={video.image}
            alt=""
            width={1100}
            height={620}
            data-zoom-exit-key={video.id}
            className="h-full w-full object-cover"
          />
        </span>
      </Link>
      <MoreButton menu="video" className="h-8 w-8 shrink-0" />
    </article>
  );
}
