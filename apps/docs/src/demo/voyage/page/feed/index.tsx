"use client";

import { useEffect } from "react";
import { useStory } from "@/demo/voyage/state/story";
import { TopBar } from "./top-bar";
import { StoryList } from "./story-list";
import { ComposeFab } from "./compose-fab";

export default function FeedPage() {
  const story = useStory((s) => ({ actions: s.actions }));
  useEffect(() => {
    story.actions.loadStories();
  }, [story.actions]);

  // The compose FAB sits outside the scrolled content block so the rising
  // sheet does not drag it along (same approach as material-mail's inbox).
  return (
    <>
      <div className="flex min-h-full flex-col bg-white">
        <TopBar />
        <div className="flex-1 pb-6">
          <StoryList />
        </div>
      </div>
      <div className="sticky bottom-5 z-20 flex justify-end px-5 pointer-events-none">
        <div className="pointer-events-auto">
          <ComposeFab />
        </div>
      </div>
    </>
  );
}
