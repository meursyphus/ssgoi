"use client";

import { Compass } from "lucide-react";
import { EXPLORE_TOPICS, HOME_CHIPS, homeFeed } from "../../mock-data";
import { closeActionSheet, openActionSheet } from "../shared/action-sheet";
import { ChipRow } from "../shared/chip-row";
import { useRememberedState } from "../shared/remembered-state";
import { YouTubeTopBar } from "../shared/top-bar";
import { WideVideoCard } from "../shared/video-card";
import { ShortsShelf } from "./shorts-shelf";

export default function HomePage() {
  const [chip, setChip] = useRememberedState("home-chip", "All");
  const feed = homeFeed(chip);

  const openExplore = () =>
    openActionSheet({
      title: "Explore",
      content: (
        <div className="grid grid-cols-2 gap-2 px-4 pb-2">
          {EXPLORE_TOPICS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setChip(item);
                closeActionSheet();
              }}
              className="h-12 rounded-xl bg-neutral-100 px-4 text-left text-[15px] font-medium active:bg-neutral-200"
            >
              {item}
            </button>
          ))}
        </div>
      ),
    });

  return (
    <main className="min-h-full bg-white pb-5 text-neutral-950">
      <YouTubeTopBar />

      <ChipRow
        items={HOME_CHIPS}
        value={chip}
        onChange={setChip}
        className="px-3 pb-3"
        leading={
          <button
            type="button"
            aria-label="Explore"
            onClick={openExplore}
            className="flex h-9 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 active:bg-neutral-200"
          >
            <Compass className="h-5 w-5" />
          </button>
        }
      />

      {feed.lead.map((video) => (
        <WideVideoCard key={video.id} video={video} />
      ))}

      {feed.shorts.length > 0 && <ShortsShelf shorts={feed.shorts} />}

      {feed.rest.length > 0 && (
        <section className="border-t border-neutral-200 pt-4">
          {feed.rest.map((video) => (
            <WideVideoCard key={video.id} video={video} />
          ))}
        </section>
      )}
    </main>
  );
}
