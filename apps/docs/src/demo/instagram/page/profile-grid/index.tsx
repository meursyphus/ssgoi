"use client";

import { useEffect } from "react";
import { usePost } from "@/demo/instagram/state/post";
import { GridSkeleton } from "./grid-skeleton";
import { GridItem } from "./grid-item";

export default function ProfileGridPage() {
  const post = usePost((state) => ({
    posts: state.posts,
    actions: state.actions,
  }));
  useEffect(() => {
    post.actions.loadPosts();
  }, [post.actions]);
  return (
    <div className="min-h-screen">
      {post.posts.isLoading && post.posts.data.length === 0 ? (
        <GridSkeleton />
      ) : (
        <div className="grid grid-cols-3 gap-[2px] bg-white">
          {post.posts.data.map((p) => (
            <GridItem key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
