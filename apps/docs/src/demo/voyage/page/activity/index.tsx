"use client";

import { useEffect } from "react";
import { useStory, type ActivitySection } from "@/demo/voyage/state/story";
import { ActivityHeader } from "./activity-header";
import { ActivityList } from "./activity-list";

export default function ActivityPage({
  sections,
}: {
  sections: ActivitySection[];
}) {
  const story = useStory((s) => ({ actions: s.actions }));
  // Opening Activity clears the dot on the feed's bell.
  useEffect(() => {
    story.actions.readActivity();
  }, [story.actions]);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <ActivityHeader />
      <ActivityList sections={sections} />
    </div>
  );
}
