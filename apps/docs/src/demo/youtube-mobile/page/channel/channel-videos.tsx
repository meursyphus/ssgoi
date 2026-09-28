import { Link } from "@/lib/link";
import { BASE, SELF_CHANNEL_ID } from "../../mock-data";
import type { Channel, MockVideo } from "../../mock-data";
import { MoreButton } from "../shared/action-sheet";
import { VideoBadge, WideVideoCard } from "../shared/video-card";

function CompactRow({ video }: { video: MockVideo }) {
  const href = `${BASE}/watch/${video.id}`;
  return (
    <article className="flex gap-3 px-3">
      <Link
        href={href}
        scroll={false}
        className="relative block aspect-video w-[168px] shrink-0 self-start overflow-hidden rounded-lg bg-neutral-200"
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
      </Link>
      <Link href={href} scroll={false} className="min-w-0 flex-1 py-0.5">
        <h3 className="line-clamp-2 text-[14px] font-medium leading-[18px]">
          {video.title}
        </h3>
        <p className="mt-1 text-[12px] text-neutral-500">
          {video.views} · {video.ago}
        </p>
      </Link>
      <MoreButton menu="video" className="-mr-1 h-8 w-8 shrink-0" />
    </article>
  );
}

function Empty({ children }: { children: string }) {
  return (
    <p className="px-10 pt-14 text-center text-[14px] leading-5 text-neutral-500">
      {children}
    </p>
  );
}

/** Tab content. Only one tab renders, so every exit key stays unique. */
export function ChannelVideos({
  channel,
  videos,
  tab,
}: {
  channel: Channel;
  videos: MockVideo[];
  tab: string;
}) {
  if (tab === "Playlists") {
    return <Empty>{`${channel.name} hasn't made any public playlists.`}</Empty>;
  }
  if (videos.length === 0) {
    return (
      <Empty>
        {channel.id === SELF_CHANNEL_ID
          ? "Your uploads will appear here. Tap Create to make your first Short."
          : "This channel hasn't uploaded videos yet."}
      </Empty>
    );
  }
  if (tab === "Videos") {
    return (
      <div className="space-y-4 pt-4">
        {videos.map((video) => (
          <CompactRow key={video.id} video={video} />
        ))}
      </div>
    );
  }
  return (
    <div className="pt-3">
      {videos.map((video) => (
        <WideVideoCard key={video.id} video={video} showChannel={false} />
      ))}
    </div>
  );
}
