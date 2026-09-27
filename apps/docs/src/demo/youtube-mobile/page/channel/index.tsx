"use client";

import type { Channel, MockVideo } from "../../mock-data";
import { useRememberedState } from "../shared/remembered-state";
import { ChannelHeader } from "./channel-header";
import { ChannelTopBar } from "./channel-top-bar";
import { ChannelVideos } from "./channel-videos";

const TABS = ["Home", "Videos", "Playlists"];

/** /channel/[id]: pushed in from the right (drill) from avatars and handles. */
export default function ChannelPage({
  channel,
  videos,
}: {
  channel: Channel;
  videos: MockVideo[];
}) {
  const [tab, setTab] = useRememberedState(`channel-tab:${channel.id}`, "Home");

  return (
    <main className="min-h-full grow bg-white pb-6 text-neutral-950">
      <ChannelTopBar channel={channel} />
      <ChannelHeader channel={channel} />

      <nav className="sticky top-12 z-10 flex border-b border-neutral-200 bg-white px-2">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={tab === item}
            onClick={() => setTab(item)}
            className={`relative h-11 px-3 text-[14px] font-semibold transition-colors ${
              tab === item ? "text-neutral-950" : "text-neutral-500"
            }`}
          >
            {item}
            {tab === item && (
              <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-neutral-950" />
            )}
          </button>
        ))}
      </nav>

      <ChannelVideos channel={channel} videos={videos} tab={tab} />
    </main>
  );
}
