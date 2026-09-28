import { Link } from "@/lib/link";
import { BASE, findChannel, type MockVideo } from "../../mock-data";
import { ChannelAvatar } from "../shared/channel-avatar";
import { SubscribeButton } from "../shared/subscribe-button";

/** Avatar and name push the channel page (drill); Subscribe toggles. */
export function ChannelRow({ video }: { video: MockVideo }) {
  const channel = findChannel(video.channelId);

  return (
    <section className="flex items-center gap-3 px-3 pt-4">
      <Link
        href={`${BASE}/channel/${video.channelId}`}
        scroll={false}
        className="flex min-w-0 flex-1 items-center gap-3 active:opacity-70"
      >
        <ChannelAvatar channelId={video.channelId} size={36} />
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-semibold">
            {video.channel}
          </span>
          <span className="block truncate text-[12px] text-neutral-500">
            {channel?.subscribers}
          </span>
        </span>
      </Link>
      <SubscribeButton channelId={video.channelId} />
    </section>
  );
}
