import { Link } from "@/lib/link";
import { BASE, channels } from "../../mock-data";

/** Subscribed channels; each avatar pushes that channel's page. */
export function ChannelStrip() {
  return (
    <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-4 pt-2">
      {channels.map((channel) => (
        <Link
          key={channel.id}
          href={`${BASE}/channel/${channel.id}`}
          scroll={false}
          className="w-[58px] shrink-0 text-center active:opacity-70"
        >
          <span className="relative mx-auto block h-[58px] w-[58px]">
            <img
              src={channel.image}
              alt=""
              width={58}
              height={58}
              className="h-full w-full rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#065fd4]" />
          </span>
          <span className="mt-1.5 block truncate text-[10px]">
            {channel.name}
          </span>
        </Link>
      ))}
      <span className="shrink-0 self-center px-1 text-[12px] font-semibold text-[#065fd4]">
        All
      </span>
    </div>
  );
}
