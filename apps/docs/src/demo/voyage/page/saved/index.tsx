"use client";

import { useEffect } from "react";
import { useStory, type StorySimple } from "@/demo/voyage/state/story";
import { SavedHeader } from "./saved-header";
import { SavedList } from "./saved-list";

export default function SavedPage({
  initialStories,
}: {
  initialStories: StorySimple[];
}) {
  const story = useStory((s) => ({ actions: s.actions }));
  // Seed before any child reads the list (server and client render alike).
  story.actions.initSaved(initialStories);
  useEffect(() => {
    story.actions.loadSaved();
    story.actions.enterSavedTab();
    return () => story.actions.leaveSavedTab();
  }, [story.actions]);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <SavedHeader />
      <div className="flex-1 pb-8">
        <SavedList />
      </div>
    </div>
  );
}
