"use client";

import { SUBSCRIPTION_FILTERS, subscriptionFeed } from "../../mock-data";
import { ChipRow } from "../shared/chip-row";
import { useRememberedState } from "../shared/remembered-state";
import { YouTubeTopBar } from "../shared/top-bar";
import { WideVideoCard } from "../shared/video-card";
import { ChannelStrip } from "./channel-strip";
import { ShortsRow } from "./shorts-row";

export default function SubscriptionsPage() {
  const [filter, setFilter] = useRememberedState("subscriptions-filter", "All");
  const feed = subscriptionFeed(filter);
  const empty = feed.shorts.length === 0 && feed.videos.length === 0;

  return (
    <main className="min-h-full bg-white pb-5 text-neutral-950">
      <YouTubeTopBar />
      <ChannelStrip />

      <ChipRow
        items={SUBSCRIPTION_FILTERS}
        value={filter}
        onChange={setFilter}
        className="px-3 pb-4"
      />

      {feed.shorts.length > 0 && <ShortsRow shorts={feed.shorts} />}

      {feed.videos.length > 0 && (
        <section className="pt-4">
          {feed.videos.map((video) => (
            <WideVideoCard key={video.id} video={video} />
          ))}
        </section>
      )}

      {empty && (
        <p className="px-8 pt-16 text-center text-[14px] leading-5 text-neutral-500">
          No new {filter.toLowerCase()} from your subscriptions yet.
        </p>
      )}
    </main>
  );
}
