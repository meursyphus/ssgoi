"use client";

import { useEffect } from "react";
import { SsgoiRouteBoundary } from "@ssgoi/react/nextjs";
import { usePost } from "@/demo/instagram/state/post";
import { useProfile } from "@/demo/instagram/state/profile";
import { GridItem } from "../profile-grid/grid-item";
import { GridSkeleton } from "../profile-grid/grid-skeleton";
import { ProfileBottomBar } from "../profile-shell/bottom-bar";
import { ExploreSearchBar } from "./search-bar";

export default function ExplorePage() {
  const post = usePost((state) => ({
    explore: state.explore,
    actions: state.actions,
  }));
  const profile = useProfile((state) => ({
    me: state.me,
    actions: state.actions,
  }));
  useEffect(() => {
    post.actions.loadExplore();
  }, [post.actions]);
  useEffect(() => {
    profile.actions.loadMe();
  }, [profile.actions]);
  const me = profile.me.data;
  return (
    <SsgoiRouteBoundary className="relative flex min-h-full w-full flex-col bg-white text-neutral-900">
      <ExploreSearchBar />
      <div className="flex-1">
        {post.explore.isLoading && post.explore.data.length === 0 ? (
          <GridSkeleton />
        ) : (
          <div className="grid grid-cols-3 gap-[2px] bg-white">
            {post.explore.data.map((p) => (
              <GridItem key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
      <div className="sticky bottom-0 z-30 bg-white">
        <ProfileBottomBar
          avatar={me?.avatar}
          active="explore"
          profileHref={`/demo/instagram/profile/${me?.username ?? "deaseungseung94"}`}
        />
      </div>
    </SsgoiRouteBoundary>
  );
}
