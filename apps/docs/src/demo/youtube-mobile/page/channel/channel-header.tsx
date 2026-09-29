"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "@/lib/link";
import { BASE, SELF_CHANNEL_ID, type Channel } from "../../mock-data";
import { ChannelAvatar } from "../shared/channel-avatar";
import { SubscribeButton } from "../shared/subscribe-button";

/** Banner, avatar, counts, about line and the Subscribe (or Create) action. */
export function ChannelHeader({ channel }: { channel: Channel }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const self = channel.id === SELF_CHANNEL_ID;

  return (
    <section className="px-4 pb-4">
      {channel.banner && (
        <div className="aspect-[4/1] overflow-hidden rounded-xl bg-neutral-200">
          <img
            src={channel.banner}
            alt=""
            width={1100}
            height={300}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        <ChannelAvatar channelId={channel.id} size={72} />
        <div className="min-w-0">
          <h2 className="truncate text-[24px] font-bold leading-7 tracking-tight">
            {channel.name}
          </h2>
          <p className="mt-1 truncate text-[12px] text-neutral-950">
            {channel.handle}
          </p>
          <p className="truncate text-[12px] text-neutral-500">
            {channel.subscribers} · {channel.videoCount}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAboutOpen(!aboutOpen)}
        aria-expanded={aboutOpen}
        className="mt-3 flex w-full items-end gap-1 text-left text-[13px] leading-[18px] text-neutral-600"
      >
        <span className={aboutOpen ? "" : "line-clamp-1"}>{channel.about}</span>
        {!aboutOpen && (
          <span className="shrink-0 font-semibold text-neutral-950">›</span>
        )}
      </button>

      {self ? (
        <Link
          href={`${BASE}/create`}
          scroll={false}
          className="mt-4 flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-neutral-100 text-[14px] font-semibold active:bg-neutral-200"
        >
          <Plus className="h-4 w-4" />
          Create
        </Link>
      ) : (
        <SubscribeButton channelId={channel.id} className="mt-4 w-full" />
      )}
    </section>
  );
}
