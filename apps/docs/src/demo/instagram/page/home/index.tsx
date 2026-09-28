"use client";

import { useEffect } from "react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { usePost } from "@/demo/instagram/state/post";
import { useProfile } from "@/demo/instagram/state/profile";
import { ProfileBottomBar } from "../profile-shell/bottom-bar";
import { HomeHeader } from "./header";
import { StoryTray } from "./story-tray";
import { HomeFeedPost } from "./feed-post";

export default function HomePage() {
  const post = usePost((state) => ({
    feed: state.feed,
    actions: state.actions,
  }));
  const profile = useProfile((state) => ({
    me: state.me,
    storyTray: state.storyTray,
    actions: state.actions,
  }));
  useEffect(() => {
    post.actions.loadFeed();
  }, [post.actions]);
  useEffect(() => {
    profile.actions.loadMe();
    profile.actions.loadStoryTray();
  }, [profile.actions]);
  const me = profile.me.data;
  const feedLoading = post.feed.isLoading && post.feed.data.length === 0;
  return (
    <SsgoiRouteBoundary className="relative flex min-h-full w-full flex-col bg-white text-neutral-900">
      <HomeHeader />
      <StoryTray items={profile.storyTray.data} />
      <div className="flex-1 border-t border-neutral-100">
        {feedLoading ? (
          <div className="mt-3 aspect-square w-full animate-pulse bg-neutral-100" />
        ) : (
          post.feed.data.map((p) => (
            <HomeFeedPost key={p.id} post={p} me={me} />
          ))
        )}
      </div>
      <div className="sticky bottom-0 z-30 bg-white">
        <ProfileBottomBar
          avatar={me?.avatar}
          active="home"
          profileHref={`/demo/instagram/profile/${me?.username ?? "deaseungseung94"}`}
        />
      </div>
    </SsgoiRouteBoundary>
  );
}
