import { Link } from "@/lib/link";
import { BASE, SELF_CHANNEL_ID } from "../../mock-data";
import { ChannelAvatar } from "../shared/channel-avatar";

export function ProfileHeader() {
  const channelHref = `${BASE}/channel/${SELF_CHANNEL_ID}`;
  return (
    <section className="px-4 pb-6 pt-6">
      <Link
        href={channelHref}
        scroll={false}
        className="flex items-center gap-4 active:opacity-70"
      >
        <ChannelAvatar channelId={SELF_CHANNEL_ID} size={78} />
        <div className="min-w-0">
          <h1 className="text-[27px] font-bold tracking-tight">Alex Morgan</h1>
          <p className="mt-1 text-[14px] text-neutral-500">
            @alexmakes · Premium member
          </p>
        </div>
      </Link>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link
          href={channelHref}
          scroll={false}
          className="flex h-10 items-center justify-center rounded-full bg-neutral-950 text-[14px] font-semibold text-white active:bg-neutral-800"
        >
          View channel
        </Link>
        <span className="flex h-10 items-center justify-center rounded-full border border-neutral-300 text-[14px] font-semibold">
          Premium benefits
        </span>
      </div>
    </section>
  );
}
