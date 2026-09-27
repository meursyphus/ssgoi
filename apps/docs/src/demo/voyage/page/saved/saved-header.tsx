"use client";

import { useStory } from "@/demo/voyage/state/story";
import { TabHeader } from "../shared/tab-header";

export function SavedHeader() {
  const story = useStory((s) => ({ savedStories: s.savedStories }));
  const count = story.savedStories.data.length;
  return (
    <TabHeader
      title="Saved"
      subtitle={`${count} ${count === 1 ? "story" : "stories"}`}
    />
  );
}
