"use client";

import { useRef } from "react";
import {
  useStory,
  type StoryDetail,
  type StorySimple,
} from "@/demo/voyage/state/story";
import { StoryHeader } from "./story-header";
import { StoryHero } from "./story-hero";
import { StoryMeta } from "./story-meta";
import { StoryBody } from "./story-body";
import { StoryActions } from "./story-actions";
import { MoreStories } from "./more-stories";

export default function StoryDetailPage({
  initialData,
  related,
}: {
  initialData: StoryDetail;
  related: StorySimple[];
}) {
  const story = useStory((s) => ({ actions: s.actions }));
  story.actions.init(initialData);
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <StoryHeader story={initialData} heroRef={heroRef} />
      <StoryHero story={initialData} heroRef={heroRef} />
      <StoryMeta story={initialData} />
      <StoryBody story={initialData} />
      <StoryActions story={initialData} />
      <MoreStories stories={related} />
    </div>
  );
}
