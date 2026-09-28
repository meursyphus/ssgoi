"use client";

import type { MockVideo } from "../../mock-data";
import { ActionRow } from "./action-row";
import { ChannelRow } from "./channel-row";
import { CommentsCard } from "./comments-card";
import { Player } from "./player";
import { UpNext } from "./up-next";
import { VideoInfo } from "./video-info";

/** /watch/[id]: the player grows out of the tapped thumbnail (zoom expand). */
export default function WatchPage({
  video,
  upNext,
  parent,
}: {
  video: MockVideo;
  upNext: MockVideo[];
  /** Minimize target when there is no in-demo history (a deep link). */
  parent: string;
}) {
  return (
    <main className="min-h-full grow bg-white pb-6 text-neutral-950">
      <Player video={video} parent={parent} />
      <VideoInfo video={video} />
      <ChannelRow video={video} />
      <ActionRow video={video} />
      <CommentsCard video={video} />
      <UpNext videos={upNext} />
    </main>
  );
}
