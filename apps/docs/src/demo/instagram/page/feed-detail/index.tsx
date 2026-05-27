"use client";

import { useEffect } from "react";
import { usePost, type PostDetail } from "@/demo/instagram/state/post";
import { useProfile } from "@/demo/instagram/state/profile";
import { FeedDetailHeader } from "./header";
import { FeedDetailImage } from "./image";
import { FeedDetailActions } from "./actions";
import { FeedDetailMeta } from "./meta";
export default function FeedDetailPage({
  initialData,
}: {
  initialData: PostDetail;
}) {
  const post = usePost((state) => ({
    current: state.currentPost,
    actions: state.actions,
  }));
  post.actions.init(initialData);
  const profile = useProfile((state) => ({
    me: state.me,
    actions: state.actions,
  }));
  useEffect(() => {
    if (!profile.me.data) profile.actions.loadMe();
  }, [profile.actions, profile.me.data]);
  const detail = post.current ?? initialData;
  const me = profile.me.data;
  return (
    <div
      data-ssgoi-transition={`/demo/instagram/feed/${detail.id}`}
      className="relative block min-h-full w-full bg-white"
    >
      <FeedDetailHeader
        backHref={`/demo/instagram/profile/${me?.username ?? "deaseungseung94"}`}
      />
      <FeedDetailImage post={detail} author={me} />
      <FeedDetailActions />
      <FeedDetailMeta post={detail} author={me} />
    </div>
  );
}
