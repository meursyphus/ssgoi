"use client";

import { useEffect } from "react";
import { usePost } from "@/demo/instagram/state/post";
import { TaggedItem } from "./tagged-item";

export default function ProfileTaggedPage() {
  const post = usePost((state) => ({
    tagged: state.tagged,
    actions: state.actions,
  }));
  useEffect(() => {
    post.actions.loadTagged();
  }, [post.actions]);
  return (
    <div className="min-h-screen">
      {post.tagged.isLoading && post.tagged.data.length === 0 ? (
        <div className="grid grid-cols-3 gap-[2px] bg-white">
          {Array.from({
            length: 6,
          }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse bg-neutral-100"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[2px] bg-white">
          {post.tagged.data.map((t) => (
            <TaggedItem key={t.id} item={t} />
          ))}
        </div>
      )}
    </div>
  );
}
