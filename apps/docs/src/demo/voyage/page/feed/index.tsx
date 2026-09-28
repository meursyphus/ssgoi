"use client";

import { useEffect } from "react";
import { useStory, type StorySimple } from "@/demo/voyage/state/story";
import { TopBar } from "./top-bar";
import { StoryList } from "./story-list";
import { ComposeFab } from "./compose-fab";

export default function FeedPage({
  initialStories,
}: {
  initialStories: StorySimple[];
}) {
  const story = useStory((s) => ({ actions: s.actions }));
  // Server data first, so the zoom cards exist on the first render (a story
  // opened directly can still zoom back into its card).
  story.actions.initFeed(initialStories);
  useEffect(() => {
    story.actions.loadStories();
  }, [story.actions]);

  // The compose FAB sits outside the scrolled content block so the rising
  // sheet does not drag it along (same approach as material-mail's inbox).
  // The bottom nav lives in the tabs shell and grows by the safe-area inset;
  // bottom-safe-20 keeps the FAB the same distance above its icons.
  return (
    <>
      <div className="flex min-h-full flex-col bg-white">
        <TopBar />
        <div className="flex-1 pb-6">
          <StoryList />
        </div>
      </div>
      <div className="pointer-events-none sticky bottom-safe-20 z-20 flex justify-end px-5">
        <div className="pointer-events-auto">
          <ComposeFab />
        </div>
      </div>
    </>
  );
}
