"use client";

import { useEffect } from "react";
import { usePost } from "@/demo/instagram/state/post";
import { ReelItem } from "./reel-item";
export default function ProfileReelsPage({ id }: { id: string }) {
  const post = usePost((state) => ({
    reels: state.reels,
    actions: state.actions,
  }));
  useEffect(() => {
    post.actions.loadReels();
  }, [post.actions]);
  return (
    <div
      data-ssgoi-transition={`/demo/instagram/profile/${id}/reels`}
      className="min-h-screen"
    >
      {post.reels.isLoading && post.reels.data.length === 0 ? (
        <div className="grid grid-cols-3 gap-[2px] bg-white">
          {Array.from({
            length: 6,
          }).map((_, i) => (
            <div
              key={i}
              className="aspect-[9/16] animate-pulse bg-neutral-100"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[2px] bg-white">
          {post.reels.data.map((reel) => (
            <ReelItem key={reel.id} reel={reel} />
          ))}
        </div>
      )}
    </div>
  );
}
